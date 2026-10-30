package com.codebangers.backend.payment;

import com.codebangers.backend.cohort.model.Cohort;
import com.codebangers.backend.cohort.repository.CohortRepository;
import com.codebangers.backend.course.model.CourseTier;
import com.codebangers.backend.course.model.EnrollmentTier;
import com.codebangers.backend.config.exception.ResourceNotFoundException;
import com.codebangers.backend.course.model.Course;
import com.codebangers.backend.course.model.Enrollment;
import com.codebangers.backend.course.model.Enrollment.PaymentStatus;
import com.codebangers.backend.course.repository.CourseRepository;
import com.codebangers.backend.course.repository.EnrollmentRepository;
import com.codebangers.backend.payment.controller.CheckoutController;
import com.codebangers.backend.payment.controller.CustomerPortalController;
import com.codebangers.backend.payment.dto.CheckoutSessionResponse;
import com.codebangers.backend.payment.dto.CreateCheckoutSessionRequest;
import com.codebangers.backend.payment.security.StripeWebhookValidator;
import com.codebangers.backend.payment.service.StripeEventService;
import com.codebangers.backend.payment.service.CheckoutService;
import com.codebangers.backend.payment.service.PaymentStatusService;
import com.codebangers.backend.payment.service.EnrollmentProvisioningService;
import com.codebangers.backend.payment.service.StripeGateway;
import com.codebangers.backend.user.model.User;
import com.codebangers.backend.user.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.codebangers.backend.payment.repository.StripeEventRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.Jwt;

import com.stripe.model.checkout.Session;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

class PaymentCheckoutServiceTest {

    private CourseRepository courseRepository;
    private EnrollmentRepository enrollmentRepository;
    private com.codebangers.backend.user.repository.UserRepository userRepository;
    private StripeGateway stripeGateway;
    private CohortRepository cohortRepository;
    private CheckoutService checkoutService;
    private EnrollmentProvisioningService enrollmentProvisioningService;

    private UserService userService;
    private StripeWebhookValidator webhookValidator;
    private ObjectMapper objectMapper;
    private CheckoutController checkoutController;
    private CustomerPortalController customerPortalController;
    private StripeEventService stripeEventService;
    private PaymentStatusService paymentStatusService;

    private User testUser;
    private Course testCourse;

    @BeforeEach
    void setUp() {
        courseRepository = mock(CourseRepository.class);
        enrollmentRepository = mock(EnrollmentRepository.class);
        userRepository = mock(com.codebangers.backend.user.repository.UserRepository.class);
        stripeGateway = mock(StripeGateway.class);
        cohortRepository = mock(CohortRepository.class);
        userService = mock(UserService.class);
        webhookValidator = mock(StripeWebhookValidator.class);
        objectMapper = new ObjectMapper();

        checkoutService = new CheckoutService(courseRepository, enrollmentRepository, stripeGateway);
        enrollmentProvisioningService = new EnrollmentProvisioningService(enrollmentRepository, courseRepository, cohortRepository, stripeGateway, null);
        paymentStatusService = new PaymentStatusService(userRepository, enrollmentRepository, courseRepository, enrollmentProvisioningService);
        stripeEventService = new StripeEventService(userRepository, enrollmentRepository, courseRepository, cohortRepository, null, enrollmentProvisioningService, paymentStatusService);
        checkoutController = new CheckoutController(checkoutService, enrollmentProvisioningService, userService);
        customerPortalController = new CustomerPortalController(checkoutService, userService);

        testUser = new User();
        testUser.setId(UUID.randomUUID());
        testUser.setEmail("student@codebangers.fr");
        testUser.setFirstName("Alice");

        testCourse = new Course("Java 21 & Spring Boot 3", "Apprenez le Java moderne");
        testCourse.setId(UUID.randomUUID());
        testCourse.setPriceInCents(4900L);
        testCourse.setCurrency("EUR");
        testCourse.setPublished(true);
        testCourse.setDeleted(false);
    }

    @Test
    void createCheckoutSession_shouldCallGatewayWhenValid() {
        UUID courseId = testCourse.getId();
        when(courseRepository.findById(courseId)).thenReturn(Optional.of(testCourse));
        when(enrollmentRepository.findByUserId(testUser.getId())).thenReturn(new ArrayList<>());

        CheckoutSessionResponse expectedResponse = new CheckoutSessionResponse(
                "cs_test_123", "https://checkout.stripe.com/pay/cs_test_123", courseId, 4900L, "EUR", "cs_test_123_secret_xyz", "pk_test_123");
        when(stripeGateway.createCheckoutSession(eq(testUser), eq(testCourse), any(), any(), anyBoolean(), any()))
                .thenReturn(expectedResponse);

        CreateCheckoutSessionRequest request = new CreateCheckoutSessionRequest(courseId);
        CheckoutSessionResponse actual = checkoutService.createCheckoutSession(testUser, request);

        assertNotNull(actual);
        assertEquals("cs_test_123", actual.getSessionId());
        assertEquals("https://checkout.stripe.com/pay/cs_test_123", actual.getSessionUrl());
        assertEquals("cs_test_123_secret_xyz", actual.getClientSecret());
        assertEquals("pk_test_123", actual.getPublishableKey());
        verify(stripeGateway).createCheckoutSession(eq(testUser), eq(testCourse), any(), any(), eq(true), any());
    }

    @Test
    void createCheckoutSession_shouldThrowWhenUserAlreadyPaid() {
        UUID courseId = testCourse.getId();
        when(courseRepository.findById(courseId)).thenReturn(Optional.of(testCourse));

        Enrollment paidEnrollment = new Enrollment(testUser, testCourse, PaymentStatus.PAID, 50);
        when(enrollmentRepository.findByUserId(testUser.getId())).thenReturn(List.of(paidEnrollment));

        CreateCheckoutSessionRequest request = new CreateCheckoutSessionRequest(courseId);

        IllegalStateException exception = assertThrows(IllegalStateException.class, () ->
                checkoutService.createCheckoutSession(testUser, request));

        assertTrue(exception.getMessage().contains("déjà acheté"));
        verifyNoInteractions(stripeGateway);
    }

    @Test
    void createCheckoutSession_shouldDirectlyGrantAccessWhenPriceIsZero() {
        UUID courseId = testCourse.getId();
        testCourse.setPriceInCents(0L); // Cours gratuit
        when(courseRepository.findById(courseId)).thenReturn(Optional.of(testCourse));
        when(enrollmentRepository.findByUserId(testUser.getId())).thenReturn(new ArrayList<>());

        CreateCheckoutSessionRequest request = new CreateCheckoutSessionRequest(courseId);
        CheckoutSessionResponse actual = checkoutService.createCheckoutSession(testUser, request);

        assertNotNull(actual);
        assertEquals("free_course", actual.getSessionId());
        verify(enrollmentRepository).save(any(Enrollment.class));
        verifyNoInteractions(stripeGateway);
    }

    @Test
    void createCheckoutSession_shouldThrowWhenCourseUnpublished() {
        UUID courseId = testCourse.getId();
        testCourse.setPublished(false);
        when(courseRepository.findById(courseId)).thenReturn(Optional.of(testCourse));

        CreateCheckoutSessionRequest request = new CreateCheckoutSessionRequest(courseId);

        assertThrows(IllegalStateException.class, () ->
                checkoutService.createCheckoutSession(testUser, request));
        verifyNoInteractions(stripeGateway);
    }

    @Test
    void createCheckoutSession_shouldThrowWhenCourseDeleted() {
        UUID courseId = testCourse.getId();
        testCourse.setDeleted(true);
        when(courseRepository.findById(courseId)).thenReturn(Optional.of(testCourse));

        CreateCheckoutSessionRequest request = new CreateCheckoutSessionRequest(courseId);

        assertThrows(ResourceNotFoundException.class, () ->
                checkoutService.createCheckoutSession(testUser, request));
        verifyNoInteractions(stripeGateway);
    }

    @Test
    void webhook_shouldUpdateSpecificCourseWhenMetadataProvided() {
        UUID courseId = testCourse.getId();
        when(userRepository.findById(testUser.getId())).thenReturn(Optional.of(testUser));
        when(courseRepository.findById(courseId)).thenReturn(Optional.of(testCourse));

        Enrollment existingPending = new Enrollment(testUser, testCourse, PaymentStatus.PENDING, 0);
        when(enrollmentRepository.findByUserId(testUser.getId())).thenReturn(new ArrayList<>(List.of(existingPending)));

        stripeEventService.processStripeWebhookEvent(
                testUser.getEmail(),
                "checkout.session.completed",
                "cs_test_999",
                courseId.toString(),
                testUser.getId().toString()
        );

        assertEquals(PaymentStatus.PAID, existingPending.getPaymentStatus());
        verify(enrollmentRepository).save(existingPending);
    }

    @Test
    void webhook_shouldIgnoreUnsupportedEventType() {
        UUID courseId = testCourse.getId();
        when(userRepository.findById(testUser.getId())).thenReturn(Optional.of(testUser));
        when(courseRepository.findById(courseId)).thenReturn(Optional.of(testCourse));

        Enrollment existingPending = new Enrollment(testUser, testCourse, PaymentStatus.PENDING, 0);
        when(enrollmentRepository.findByUserId(testUser.getId())).thenReturn(new ArrayList<>(List.of(existingPending)));

        stripeEventService.processStripeWebhookEvent(
                testUser.getEmail(),
                "customer.subscription.created",
                "sub_test_123",
                courseId.toString(),
                testUser.getId().toString()
        );

        verify(enrollmentRepository, never()).save(any());
        assertEquals(PaymentStatus.PENDING, existingPending.getPaymentStatus());
    }

    @Test
    void controller_createCheckoutSession_shouldReturnOkForAuthenticatedUser() {
        UUID courseId = testCourse.getId();
        CreateCheckoutSessionRequest request = new CreateCheckoutSessionRequest(courseId);

        Jwt jwt = mock(Jwt.class);
        when(jwt.getSubject()).thenReturn("student@codebangers.fr");
        when(userService.getUserByEmail("student@codebangers.fr")).thenReturn(Optional.of(testUser));
        when(courseRepository.findById(courseId)).thenReturn(Optional.of(testCourse));
        when(enrollmentRepository.findByUserId(testUser.getId())).thenReturn(new ArrayList<>());

        CheckoutSessionResponse expected = new CheckoutSessionResponse(
                "cs_abc", "https://checkout.stripe.com/pay/cs_abc", courseId, 4900L, "EUR", "cs_abc_secret", "pk_test_123");
        when(stripeGateway.createCheckoutSession(eq(testUser), eq(testCourse), any(), any(), anyBoolean(), any()))
                .thenReturn(expected);

        ResponseEntity<?> response = checkoutController.createCheckoutSession(request, jwt);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody() instanceof CheckoutSessionResponse);
        CheckoutSessionResponse res = (CheckoutSessionResponse) response.getBody();
        assertEquals("cs_abc", res.getSessionId());
        assertEquals("cs_abc_secret", res.getClientSecret());
    }

    @Test
    void controller_createCheckoutSession_shouldReturn401WhenJwtNull() {
        CreateCheckoutSessionRequest request = new CreateCheckoutSessionRequest(testCourse.getId());
        ResponseEntity<?> response = checkoutController.createCheckoutSession(request, null);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
    }

    @Test
    void createCheckoutSession_shouldSupportStarterPricing_299EUR() {
        Course starterCourse = new Course("Pack Starter", "Fondations du web");
        starterCourse.setId(UUID.randomUUID());
        starterCourse.setPriceInCents(29900L);
        starterCourse.setCurrency("EUR");
        starterCourse.setPublished(true);

        when(courseRepository.findById(starterCourse.getId())).thenReturn(Optional.of(starterCourse));
        when(enrollmentRepository.findByUserId(testUser.getId())).thenReturn(new ArrayList<>());

        CheckoutSessionResponse expectedResponse = new CheckoutSessionResponse(
                "cs_test_299", "https://checkout.stripe.com/pay/cs_test_299", starterCourse.getId(), 29900L, "EUR", "sec_299", "pk_test");
        when(stripeGateway.createCheckoutSession(eq(testUser), eq(starterCourse), any(), any(), anyBoolean(), any()))
                .thenReturn(expectedResponse);

        CreateCheckoutSessionRequest request = new CreateCheckoutSessionRequest(starterCourse.getId());
        CheckoutSessionResponse actual = checkoutService.createCheckoutSession(testUser, request);

        assertNotNull(actual);
        assertEquals(29900L, actual.getAmount());
        assertEquals("EUR", actual.getCurrency());
        assertEquals("sec_299", actual.getClientSecret());
        verify(stripeGateway).createCheckoutSession(eq(testUser), eq(starterCourse), any(), any(), eq(true), any());
    }

    @Test
    void createCheckoutSession_shouldSupportWebProPricing_449EUR() {
        Course webProCourse = new Course("Pack Web Pro", "Autonomie complete");
        webProCourse.setId(UUID.randomUUID());
        webProCourse.setPriceInCents(44900L);
        webProCourse.setCurrency("EUR");
        webProCourse.setPublished(true);

        when(courseRepository.findById(webProCourse.getId())).thenReturn(Optional.of(webProCourse));
        when(enrollmentRepository.findByUserId(testUser.getId())).thenReturn(new ArrayList<>());

        CheckoutSessionResponse expectedResponse = new CheckoutSessionResponse(
                "cs_test_449", "https://checkout.stripe.com/pay/cs_test_449", webProCourse.getId(), 44900L, "EUR", "sec_449", "pk_test");
        when(stripeGateway.createCheckoutSession(eq(testUser), eq(webProCourse), any(), any(), anyBoolean(), any()))
                .thenReturn(expectedResponse);

        CreateCheckoutSessionRequest request = new CreateCheckoutSessionRequest(webProCourse.getId());
        CheckoutSessionResponse actual = checkoutService.createCheckoutSession(testUser, request);

        assertNotNull(actual);
        assertEquals(44900L, actual.getAmount());
        assertEquals("EUR", actual.getCurrency());
        assertEquals("sec_449", actual.getClientSecret());
        verify(stripeGateway).createCheckoutSession(eq(testUser), eq(webProCourse), any(), any(), eq(true), any());
    }

    @Test
    void createCheckoutSession_withMentorAddon_shouldPassAddonToGateway() {
        Course course = new Course("Pack Starter", "Fondations");
        course.setId(UUID.randomUUID());
        course.setPriceInCents(29900L);
        course.setPublished(true);

        when(courseRepository.findById(course.getId())).thenReturn(Optional.of(course));
        when(enrollmentRepository.findByUserId(testUser.getId())).thenReturn(new ArrayList<>());

        UUID cohortId = UUID.randomUUID();
        CheckoutSessionResponse expectedResponse = new CheckoutSessionResponse(
                "cs_test_addon", "https://checkout.stripe.com/pay/cs_test_addon", course.getId(), 49800L, "EUR", "sec_addon", "pk_test");
        when(stripeGateway.createCheckoutSession(eq(testUser), eq(course), any(), any(), eq(true), any(), eq(EnrollmentTier.STARTER), eq(cohortId), eq("mentor_4sessions")))
                .thenReturn(expectedResponse);

        CreateCheckoutSessionRequest request = new CreateCheckoutSessionRequest(course.getId());
        request.setTier(EnrollmentTier.STARTER);
        request.setCohortId(cohortId);
        request.setAddon("mentor_4sessions");

        CheckoutSessionResponse actual = checkoutService.createCheckoutSession(testUser, request);

        assertNotNull(actual);
        assertEquals(49800L, actual.getAmount());
        verify(stripeGateway).createCheckoutSession(eq(testUser), eq(course), any(), any(), eq(true), any(), eq(EnrollmentTier.STARTER), eq(cohortId), eq("mentor_4sessions"));
    }

    @Test
    void confirmCheckoutSession_shouldUpdateEnrollmentToPaid_whenStripeSessionIsPaid() {
        UUID courseId = testCourse.getId();
        when(courseRepository.findById(courseId)).thenReturn(Optional.of(testCourse));
        when(enrollmentRepository.findByUserId(testUser.getId())).thenReturn(new ArrayList<>());
        when(enrollmentRepository.save(any(Enrollment.class))).thenAnswer(i -> i.getArgument(0));

        Session mockSession = mock(Session.class);
        when(mockSession.getPaymentStatus()).thenReturn("paid");
        when(mockSession.getStatus()).thenReturn("complete");
        when(mockSession.getMetadata()).thenReturn(Map.of("courseId", courseId.toString(), "userId", testUser.getId().toString()));

        when(stripeGateway.retrieveSession("cs_test_valid")).thenReturn(mockSession);

        Enrollment enrollment = enrollmentProvisioningService.confirmCheckoutSession(testUser, "cs_test_valid");

        assertNotNull(enrollment);
        assertEquals(PaymentStatus.PAID, enrollment.getPaymentStatus());
        assertEquals(testCourse, enrollment.getCourse());
        verify(enrollmentRepository).save(any(Enrollment.class));
    }

    @Test
    void confirmCheckoutSession_controllerEndpoint_shouldReturnConfirmed() {
        UUID courseId = testCourse.getId();
        when(userService.getUserByEmail(testUser.getEmail())).thenReturn(Optional.of(testUser));
        when(courseRepository.findById(courseId)).thenReturn(Optional.of(testCourse));
        when(enrollmentRepository.findByUserId(testUser.getId())).thenReturn(new ArrayList<>());

        Session mockSession = mock(Session.class);
        when(mockSession.getPaymentStatus()).thenReturn("paid");
        when(mockSession.getStatus()).thenReturn("complete");
        when(mockSession.getMetadata()).thenReturn(Map.of(
                "courseId", courseId.toString(),
                "userId", testUser.getId().toString()
        ));
        when(stripeGateway.retrieveSession("cs_test_123")).thenReturn(mockSession);

        Jwt jwt = mock(Jwt.class);
        when(jwt.getSubject()).thenReturn(testUser.getEmail());

        ResponseEntity<?> response = checkoutController.confirmCheckoutSession("cs_test_123", jwt);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody() instanceof Map);
        Map<?, ?> body = (Map<?, ?>) response.getBody();
        assertEquals(true, body.get("confirmed"));
        assertEquals(PaymentStatus.PAID, body.get("paymentStatus"));
    }

    @Test
    void confirmCheckoutSession_shouldThrowAccessDenied_whenSessionBelongsToDifferentUser() {
        UUID courseId = testCourse.getId();
        UUID attackerId = UUID.randomUUID();

        Session mockSession = mock(Session.class);
        when(mockSession.getPaymentStatus()).thenReturn("paid");
        when(mockSession.getStatus()).thenReturn("complete");
        when(mockSession.getMetadata()).thenReturn(Map.of(
                "courseId", courseId.toString(),
                "userId", attackerId.toString()
        ));
        when(stripeGateway.retrieveSession("cs_stolen_session")).thenReturn(mockSession);

        assertThrows(org.springframework.security.access.AccessDeniedException.class, () ->
                enrollmentProvisioningService.confirmCheckoutSession(testUser, "cs_stolen_session"));
    }

    @Test
    void confirmCheckoutSession_controllerEndpoint_shouldReturn403Forbidden_whenSessionBelongsToDifferentUser() {
        UUID courseId = testCourse.getId();
        UUID otherUserId = UUID.randomUUID();

        when(userService.getUserByEmail(testUser.getEmail())).thenReturn(Optional.of(testUser));

        Session mockSession = mock(Session.class);
        when(mockSession.getPaymentStatus()).thenReturn("paid");
        when(mockSession.getStatus()).thenReturn("complete");
        when(mockSession.getMetadata()).thenReturn(Map.of(
                "courseId", courseId.toString(),
                "userId", otherUserId.toString()
        ));
        when(stripeGateway.retrieveSession("cs_stolen_123")).thenReturn(mockSession);

        Jwt jwt = mock(Jwt.class);
        when(jwt.getSubject()).thenReturn(testUser.getEmail());

        ResponseEntity<?> response = checkoutController.confirmCheckoutSession("cs_stolen_123", jwt);

        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
    }

    @Test
    void createCustomerPortalSession_shouldReturnPortalUrl() {
        when(userService.getUserByEmail(testUser.getEmail())).thenReturn(Optional.of(testUser));
        when(stripeGateway.createCustomerPortalSession(eq(testUser), any())).thenReturn("https://billing.stripe.com/session/test_123");

        Jwt jwt = mock(Jwt.class);
        when(jwt.getSubject()).thenReturn(testUser.getEmail());

        ResponseEntity<?> response = customerPortalController.createCustomerPortalSession(Map.of("returnUrl", "https://noseumcode.fr/dashboard.html"), jwt);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody() instanceof Map);
        Map<?, ?> body = (Map<?, ?>) response.getBody();
        assertEquals("https://billing.stripe.com/session/test_123", body.get("portalUrl"));
    }

    @Test
    void createCustomerPortalSession_unauthenticated_shouldReturn401() {
        ResponseEntity<?> response = customerPortalController.createCustomerPortalSession(Map.of(), null);
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
    }

    @Test
    void createCheckoutSession_withCohortAndTier_shouldPassMetadataToGateway() {
        UUID courseId = testCourse.getId();
        UUID cohortId = UUID.randomUUID();
        when(courseRepository.findById(courseId)).thenReturn(Optional.of(testCourse));
        when(enrollmentRepository.findByUserId(testUser.getId())).thenReturn(new ArrayList<>());

        CheckoutSessionResponse expectedResponse = new CheckoutSessionResponse(
                "cs_test_vip", "https://checkout.stripe.com/pay/cs_test_vip", courseId, 87900L, "EUR", "cs_test_vip_secret", "pk_test_123");
        when(stripeGateway.createCheckoutSession(eq(testUser), eq(testCourse), any(), any(), eq(true), any(), eq(EnrollmentTier.VIP), eq(cohortId)))
                .thenReturn(expectedResponse);

        CreateCheckoutSessionRequest request = new CreateCheckoutSessionRequest(courseId);
        request.setTier(EnrollmentTier.VIP);
        request.setCohortId(cohortId);
        CheckoutSessionResponse actual = checkoutService.createCheckoutSession(testUser, request);

        assertNotNull(actual);
        assertEquals("cs_test_vip", actual.getSessionId());
        verify(stripeGateway).createCheckoutSession(eq(testUser), eq(testCourse), any(), any(), eq(true), any(), eq(EnrollmentTier.VIP), eq(cohortId));
    }

    @Test
    void confirmCheckoutSession_withCohortAndTier_shouldPersistOnEnrollment() {
        UUID courseId = testCourse.getId();
        UUID cohortId = UUID.randomUUID();
        Cohort mockCohort = new Cohort("Cohorte Alpha", "cohorte-alpha", java.time.LocalDateTime.now(), 6);
        mockCohort.setTier(EnrollmentTier.WEB);
        mockCohort.setId(cohortId);

        when(courseRepository.findById(courseId)).thenReturn(Optional.of(testCourse));
        when(enrollmentRepository.findByUserId(testUser.getId())).thenReturn(new ArrayList<>());
        when(cohortRepository.findById(cohortId)).thenReturn(Optional.of(mockCohort));

        Session mockSession = mock(Session.class);
        when(mockSession.getPaymentStatus()).thenReturn("paid");
        when(mockSession.getStatus()).thenReturn("complete");
        when(mockSession.getMetadata()).thenReturn(Map.of(
                "courseId", courseId.toString(),
                "userId", testUser.getId().toString(),
                "tier", "VIP",
                "cohortId", cohortId.toString()
        ));
        when(stripeGateway.retrieveSession("cs_test_vip")).thenReturn(mockSession);

        Enrollment enrollment = enrollmentProvisioningService.confirmCheckoutSession(testUser, "cs_test_vip");

        assertNotNull(enrollment);
        assertEquals(PaymentStatus.PAID, enrollment.getPaymentStatus());
        assertEquals(EnrollmentTier.VIP, enrollment.getTier());
        assertEquals(mockCohort, enrollment.getCohort());
        verify(enrollmentRepository).save(any(Enrollment.class));
    }
}

