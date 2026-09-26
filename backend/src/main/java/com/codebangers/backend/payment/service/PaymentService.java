package com.codebangers.backend.payment.service;

import com.codebangers.backend.config.exception.ResourceNotFoundException;
import com.codebangers.backend.course.model.Course;
import com.codebangers.backend.course.model.Enrollment;
import com.codebangers.backend.course.model.Enrollment.PaymentStatus;
import com.codebangers.backend.course.repository.CourseRepository;
import com.codebangers.backend.course.repository.EnrollmentRepository;
import com.codebangers.backend.payment.dto.CheckoutSessionResponse;
import com.codebangers.backend.payment.dto.CreateCheckoutSessionRequest;
import com.codebangers.backend.payment.dto.PaymentStatusUpdateRequest;
import com.codebangers.backend.user.model.User;
import com.codebangers.backend.user.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class PaymentService {

    private static final Logger log = LoggerFactory.getLogger(PaymentService.class);

    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;
    private final StripeGateway stripeGateway;

    public PaymentService(UserRepository userRepository,
                          EnrollmentRepository enrollmentRepository,
                          CourseRepository courseRepository,
                          StripeGateway stripeGateway) {
        this.userRepository = userRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.courseRepository = courseRepository;
        this.stripeGateway = stripeGateway;
    }

    /**
     * Point d'entrée universel pour mettre à jour le statut de paiement d'un utilisateur.
     * Compatible avec l'administration manuelle (par UUID ou Email) et les webhooks Stripe automatisés.
     */
    public List<Enrollment> processPaymentStatusUpdate(String userIdentifier, PaymentStatusUpdateRequest request) {
        User user = null;
        try {
            UUID id = UUID.fromString(userIdentifier);
            user = userRepository.findById(id).orElse(null);
        } catch (IllegalArgumentException ignored) {}

        if (user == null) {
            user = userRepository.findByEmail(userIdentifier)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with identifier: " + userIdentifier));
        }

        UUID userId = user.getId();

        log.info("💳 Mise à jour du statut de paiement pour {} ({}) -> Statut: {}, Source: {}, Ref: {}",
                user.getEmail(), userId, request.getPaymentStatus(), request.getSource(), request.getTransactionReference());

        List<Course> activeCourses = courseRepository.findAll().stream().filter(c -> !c.isDeleted()).toList();
        List<Enrollment> existingEnrollments = enrollmentRepository.findByUserId(userId);

        for (Course course : activeCourses) {
            Enrollment enrollment = existingEnrollments.stream()
                    .filter(e -> e.getCourse() != null && e.getCourse().getId().equals(course.getId()))
                    .findFirst()
                    .orElse(null);

            if (enrollment != null) {
                enrollment.setPaymentStatus(request.getPaymentStatus());
                enrollmentRepository.save(enrollment);
            } else if (request.getPaymentStatus() != null) {
                Enrollment newEnrollment = new Enrollment(user, course, request.getPaymentStatus(), 0);
                enrollmentRepository.save(newEnrollment);
                log.info("🎓 Inscription créée pour {} sur le cours {} avec statut {}", user.getEmail(), course.getTitle(), request.getPaymentStatus());
            }
        }

        return enrollmentRepository.findByUserId(userId);
    }

    /**
     * Crée une Checkout Session Stripe pour un utilisateur authentifié et un cours donné.
     */
    public CheckoutSessionResponse createCheckoutSession(User user, CreateCheckoutSessionRequest request) {
        if (request.getCourseId() == null) {
            throw new IllegalArgumentException("L'identifiant du cours (courseId) est requis");
        }

        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course", request.getCourseId()));

        if (course.isDeleted()) {
            throw new ResourceNotFoundException("Ce cours n'est plus disponible.");
        }

        if (!course.isPublished()) {
            throw new IllegalStateException("Ce cours n'est pas encore ouvert aux inscriptions.");
        }

        List<Enrollment> existingEnrollments = enrollmentRepository.findByUserId(user.getId());
        boolean isAlreadyPaid = existingEnrollments.stream()
                .anyMatch(e -> e.getCourse() != null
                        && e.getCourse().getId().equals(course.getId())
                        && (e.getPaymentStatus() == PaymentStatus.PAID));

        if (isAlreadyPaid) {
            throw new IllegalStateException("Vous avez déjà acheté et validé l'accès complet à cette formation.");
        }

        // Cours 100% gratuit
        if (course.getPriceInCents() != null && course.getPriceInCents() <= 0) {
            Enrollment enrollment = existingEnrollments.stream()
                    .filter(e -> e.getCourse() != null && e.getCourse().getId().equals(course.getId()))
                    .findFirst()
                    .orElse(new Enrollment(user, course, PaymentStatus.PAID, 0));
            enrollment.setPaymentStatus(PaymentStatus.PAID);
            enrollmentRepository.save(enrollment);
            return new CheckoutSessionResponse("free_course", "/cours.html?id=" + course.getId(), course.getId(), 0L, course.getCurrency());
        }

        boolean embedded = request.getEmbedded() == null || request.getEmbedded();
        return stripeGateway.createCheckoutSession(user, course, request.getSuccessUrl(), request.getCancelUrl(), embedded, request.getReturnUrl());
    }

    /**
     * Traitement automatisé d'un événement de paiement Stripe Webhook (par email).
     */
    public void processStripeWebhookEvent(String customerEmail, String stripeEventType, String transactionId) {
        processStripeWebhookEvent(customerEmail, stripeEventType, transactionId, null, null);
    }

    /**
     * Traitement d'un événement Stripe avec ciblage précis du cours et de l'utilisateur par métadonnées.
     */
    public void processStripeWebhookEvent(String customerEmail, String stripeEventType, String transactionId, String courseIdStr, String userIdStr) {
        User user = null;
        if (userIdStr != null && !userIdStr.isBlank()) {
            try {
                user = userRepository.findById(UUID.fromString(userIdStr)).orElse(null);
            } catch (IllegalArgumentException ignored) {}
        }
        if (user == null && customerEmail != null && !customerEmail.isBlank()) {
            user = userRepository.findByEmail(customerEmail).orElse(null);
        }

        if (user == null) {
            log.error("Impossible de traiter l'événement Stripe: aucun utilisateur trouvé pour email={} ou userId={}", customerEmail, userIdStr);
            throw new ResourceNotFoundException("User not found for Stripe webhook event");
        }

        PaymentStatus status;
        switch (stripeEventType) {
            case "checkout.session.completed", "invoice.payment_succeeded", "payment_intent.succeeded":
                status = PaymentStatus.PAID;
                break;
            case "charge.refunded":
                status = PaymentStatus.REFUNDED;
                break;
            case "invoice.payment_failed", "payment_intent.payment_failed":
                status = PaymentStatus.FAILED;
                break;
            default:
                status = PaymentStatus.PENDING;
                break;
        }

        if (courseIdStr != null && !courseIdStr.isBlank()) {
            try {
                UUID courseId = UUID.fromString(courseIdStr);
                Course course = courseRepository.findById(courseId).orElse(null);
                if (course != null) {
                    List<Enrollment> existingEnrollments = enrollmentRepository.findByUserId(user.getId());
                    Enrollment enrollment = existingEnrollments.stream()
                            .filter(e -> e.getCourse() != null && e.getCourse().getId().equals(course.getId()))
                            .findFirst()
                            .orElse(null);

                    if (enrollment != null) {
                        enrollment.setPaymentStatus(status);
                        enrollmentRepository.save(enrollment);
                    } else if (status != null) {
                        Enrollment newEnrollment = new Enrollment(user, course, status, 0);
                        enrollmentRepository.save(newEnrollment);
                    }
                    log.info("🎓 Inscription mise à jour suite à webhook Stripe (cours spécifique) pour {} sur le cours {} -> Statut: {}",
                            user.getEmail(), course.getTitle(), status);
                    return;
                }
            } catch (IllegalArgumentException e) {
                log.warn("Identifiant de cours invalide dans metadata Stripe: {}", courseIdStr);
            }
        }

        // Si aucun cours spécifique (ou fallback legacy): mise à jour globale
        PaymentStatusUpdateRequest request = new PaymentStatusUpdateRequest(
                status,
                "STRIPE_WEBHOOK",
                transactionId,
                "Événement Stripe automatique : " + stripeEventType
        );
        processPaymentStatusUpdate(user.getId().toString(), request);
    }

    /**
     * Confirme et synchronise le paiement d'une session Stripe Checkout directement depuis l'API Stripe.
     * Utilisé en fallback synchrone sur la page de succès/retour si le webhook est retardé ou absent.
     */
    public Enrollment confirmCheckoutSession(User user, String sessionId) {
        if (sessionId == null || sessionId.isBlank()) {
            throw new IllegalArgumentException("L'identifiant de session est requis.");
        }

        com.stripe.model.checkout.Session session = stripeGateway.retrieveSession(sessionId);
        if (session == null) {
            throw new ResourceNotFoundException("Session Stripe introuvable: " + sessionId);
        }

        String paymentStatus = session.getPaymentStatus();
        String status = session.getStatus();

        if (!"paid".equalsIgnoreCase(paymentStatus) && !"complete".equalsIgnoreCase(status)) {
            log.warn("Tentative de validation d'une session non payée: id={}, status={}, paymentStatus={}",
                    sessionId, status, paymentStatus);
            throw new IllegalStateException("Le paiement n'a pas été validé par Stripe.");
        }

        String courseIdStr = session.getMetadata() != null ? session.getMetadata().get("courseId") : null;
        if (courseIdStr == null || courseIdStr.isBlank()) {
            throw new IllegalStateException("Métadonnée courseId introuvable dans la session Stripe.");
        }

        UUID courseId;
        try {
            courseId = UUID.fromString(courseIdStr);
        } catch (IllegalArgumentException e) {
            throw new IllegalStateException("Métadonnée courseId invalide dans la session Stripe: " + courseIdStr);
        }

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course", courseId));

        List<Enrollment> existingEnrollments = enrollmentRepository.findByUserId(user.getId());
        Enrollment enrollment = existingEnrollments.stream()
                .filter(e -> e.getCourse() != null && e.getCourse().getId().equals(course.getId()))
                .findFirst()
                .orElse(null);

        if (enrollment != null) {
            enrollment.setPaymentStatus(PaymentStatus.PAID);
            enrollmentRepository.save(enrollment);
        } else {
            enrollment = new Enrollment(user, course, PaymentStatus.PAID, 0);
            enrollmentRepository.save(enrollment);
        }

        log.info("🎓 Inscription confirmée (synchronisation Stripe directe) pour {} sur le cours {} -> Statut: PAID",
                user.getEmail(), course.getTitle());
        return enrollment;
    }

    /**
     * Crée une session pour le portail client Stripe (factures et règlements).
     */
    public String createCustomerPortalSession(User user, String returnUrl) {
        return stripeGateway.createCustomerPortalSession(user, returnUrl);
    }
}
