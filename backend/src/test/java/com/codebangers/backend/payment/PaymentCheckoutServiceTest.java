package com.codebangers.backend.payment;

import com.codebangers.backend.config.exception.ResourceNotFoundException;
import com.codebangers.backend.course.model.Course;
import com.codebangers.backend.course.model.Enrollment;
import com.codebangers.backend.course.model.Enrollment.PaymentStatus;
import com.codebangers.backend.course.repository.CourseRepository;
import com.codebangers.backend.course.repository.EnrollmentRepository;
import com.codebangers.backend.payment.controller.PaymentController;
import com.codebangers.backend.payment.dto.CheckoutSessionResponse;
import com.codebangers.backend.payment.dto.CreateCheckoutSessionRequest;
import com.codebangers.backend.payment.security.StripeWebhookValidator;
import com.codebangers.backend.payment.service.PaymentService;
import com.codebangers.backend.payment.service.StripeGateway;
import com.codebangers.backend.user.model.User;
import com.codebangers.backend.user.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.Jwt;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
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
    private PaymentService paymentService;

    private UserService userService;
    private StripeWebhookValidator webhookValidator;
    private ObjectMapper objectMapper;
    private PaymentController paymentController;

    private User testUser;
    private Course testCourse;

    @BeforeEach
    void setUp() {
        courseRepository = mock(CourseRepository.class);
        enrollmentRepository = mock(EnrollmentRepository.class);
        userRepository = mock(com.codebangers.backend.user.repository.UserRepository.class);
        stripeGateway = mock(StripeGateway.class);
        userService = mock(UserService.class);
        webhookValidator = mock(StripeWebhookValidator.class);
        objectMapper = new ObjectMapper();

        paymentService = new PaymentService(userRepository, enrollmentRepository, courseRepository, stripeGateway);
        paymentController = new PaymentController(paymentService, userService, webhookValidator, objectMapper, "whsec_test");

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
                "cs_test_123", "https://checkout.stripe.com/pay/cs_test_123", courseId, 4900L, "EUR");
        when(stripeGateway.createCheckoutSession(eq(testUser), eq(testCourse), any(), any()))
                .thenReturn(expectedResponse);

        CreateCheckoutSessionRequest request = new CreateCheckoutSessionRequest(courseId);
        CheckoutSessionResponse actual = paymentService.createCheckoutSession(testUser, request);

        assertNotNull(actual);
        assertEquals("cs_test_123", actual.getSessionId());
        assertEquals("https://checkout.stripe.com/pay/cs_test_123", actual.getSessionUrl());
        verify(stripeGateway).createCheckoutSession(eq(testUser), eq(testCourse), any(), any());
    }

    @Test
    void createCheckoutSession_shouldThrowWhenUserAlreadyPaid() {
        UUID courseId = testCourse.getId();
        when(courseRepository.findById(courseId)).thenReturn(Optional.of(testCourse));

        Enrollment paidEnrollment = new Enrollment(testUser, testCourse, PaymentStatus.PAID, 50);
        when(enrollmentRepository.findByUserId(testUser.getId())).thenReturn(List.of(paidEnrollment));

        CreateCheckoutSessionRequest request = new CreateCheckoutSessionRequest(courseId);

        IllegalStateException exception = assertThrows(IllegalStateException.class, () ->
                paymentService.createCheckoutSession(testUser, request));

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
        CheckoutSessionResponse actual = paymentService.createCheckoutSession(testUser, request);

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
                paymentService.createCheckoutSession(testUser, request));
        verifyNoInteractions(stripeGateway);
    }

    @Test
    void createCheckoutSession_shouldThrowWhenCourseDeleted() {
        UUID courseId = testCourse.getId();
        testCourse.setDeleted(true);
        when(courseRepository.findById(courseId)).thenReturn(Optional.of(testCourse));

        CreateCheckoutSessionRequest request = new CreateCheckoutSessionRequest(courseId);

        assertThrows(ResourceNotFoundException.class, () ->
                paymentService.createCheckoutSession(testUser, request));
        verifyNoInteractions(stripeGateway);
    }

    @Test
    void webhook_shouldUpdateSpecificCourseWhenMetadataProvided() {
        UUID courseId = testCourse.getId();
        when(userRepository.findById(testUser.getId())).thenReturn(Optional.of(testUser));
        when(courseRepository.findById(courseId)).thenReturn(Optional.of(testCourse));

        Enrollment existingPending = new Enrollment(testUser, testCourse, PaymentStatus.PENDING, 0);
        when(enrollmentRepository.findByUserId(testUser.getId())).thenReturn(new ArrayList<>(List.of(existingPending)));

        paymentService.processStripeWebhookEvent(
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
    void controller_createCheckoutSession_shouldReturnOkForAuthenticatedUser() {
        UUID courseId = testCourse.getId();
        CreateCheckoutSessionRequest request = new CreateCheckoutSessionRequest(courseId);

        Jwt jwt = mock(Jwt.class);
        when(jwt.getSubject()).thenReturn("student@codebangers.fr");
        when(userService.getUserByEmail("student@codebangers.fr")).thenReturn(Optional.of(testUser));
        when(courseRepository.findById(courseId)).thenReturn(Optional.of(testCourse));
        when(enrollmentRepository.findByUserId(testUser.getId())).thenReturn(new ArrayList<>());

        CheckoutSessionResponse expected = new CheckoutSessionResponse(
                "cs_abc", "https://checkout.stripe.com/pay/cs_abc", courseId, 4900L, "EUR");
        when(stripeGateway.createCheckoutSession(eq(testUser), eq(testCourse), any(), any()))
                .thenReturn(expected);

        ResponseEntity<?> response = paymentController.createCheckoutSession(request, jwt);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody() instanceof CheckoutSessionResponse);
        CheckoutSessionResponse res = (CheckoutSessionResponse) response.getBody();
        assertEquals("cs_abc", res.getSessionId());
    }

    @Test
    void controller_createCheckoutSession_shouldReturn401WhenJwtNull() {
        CreateCheckoutSessionRequest request = new CreateCheckoutSessionRequest(testCourse.getId());
        ResponseEntity<?> response = paymentController.createCheckoutSession(request, null);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
    }
}
