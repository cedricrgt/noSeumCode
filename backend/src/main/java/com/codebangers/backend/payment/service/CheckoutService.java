package com.codebangers.backend.payment.service;

import com.codebangers.backend.config.exception.ResourceNotFoundException;
import com.codebangers.backend.course.model.Course;
import com.codebangers.backend.course.model.Enrollment;
import com.codebangers.backend.course.model.Enrollment.PaymentStatus;
import com.codebangers.backend.course.repository.CourseRepository;
import com.codebangers.backend.course.repository.EnrollmentRepository;
import com.codebangers.backend.payment.dto.CheckoutSessionResponse;
import com.codebangers.backend.payment.dto.CreateCheckoutSessionRequest;
import com.codebangers.backend.user.model.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CheckoutService {

    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final StripeGateway stripeGateway;

    public CheckoutService(CourseRepository courseRepository,
                           EnrollmentRepository enrollmentRepository,
                           StripeGateway stripeGateway) {
        this.courseRepository = courseRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.stripeGateway = stripeGateway;
    }

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
        if (request.getTier() == null && request.getCohortId() == null && (request.getAddon() == null || request.getAddon().isBlank())) {
            return stripeGateway.createCheckoutSession(user, course, request.getSuccessUrl(), request.getCancelUrl(), embedded, request.getReturnUrl());
        }
        if (request.getAddon() == null || request.getAddon().isBlank()) {
            return stripeGateway.createCheckoutSession(user, course, request.getSuccessUrl(), request.getCancelUrl(), embedded, request.getReturnUrl(), request.getTier(), request.getCohortId());
        }
        return stripeGateway.createCheckoutSession(user, course, request.getSuccessUrl(), request.getCancelUrl(), embedded, request.getReturnUrl(), request.getTier(), request.getCohortId(), request.getAddon());
    }

    public String createCustomerPortalSession(User user, String returnUrl) {
        return stripeGateway.createCustomerPortalSession(user, returnUrl);
    }
}
