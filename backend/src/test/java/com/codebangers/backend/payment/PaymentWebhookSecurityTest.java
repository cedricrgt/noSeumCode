package com.codebangers.backend.payment;

import com.codebangers.backend.payment.controller.StripeWebhookController;
import com.codebangers.backend.payment.security.StripeWebhookValidator;
import com.codebangers.backend.payment.service.StripeEventService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.codebangers.backend.payment.repository.StripeEventRepository;
import static org.mockito.Mockito.mock;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.HexFormat;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class PaymentWebhookSecurityTest {

    private StripeWebhookValidator validator;
    private StripeEventService StripeEventService;
    private ObjectMapper objectMapper;
    private final String secret = "whsec_test_secret_key_123456789";

    @BeforeEach
    void setUp() {
        validator = new StripeWebhookValidator();
        StripeEventService = mock(StripeEventService.class);
        objectMapper = new ObjectMapper();
    }

    private String generateSignature(String payload, long timestamp, String key) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            byte[] hash = mac.doFinal((timestamp + "." + payload).getBytes(StandardCharsets.UTF_8));
            return "t=" + timestamp + ",v1=" + HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException | InvalidKeyException e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    void validHmacSignatureShouldBeAccepted() {
        String payload = "{\"id\":\"evt_123\",\"type\":\"checkout.session.completed\",\"data\":{\"object\":{\"customer_email\":\"user@example.com\",\"id\":\"cs_123\"}}}";
        long now = Instant.now().getEpochSecond();
        String sigHeader = generateSignature(payload, now, secret);

        assertTrue(validator.isValidSignature(payload, sigHeader, secret));
    }

    @Test
    void tamperedPayloadShouldBeRejected() {
        String originalPayload = "{\"type\":\"checkout.session.completed\"}";
        long now = Instant.now().getEpochSecond();
        String sigHeader = generateSignature(originalPayload, now, secret);

        String tamperedPayload = "{\"type\":\"checkout.session.completed\",\"injected\":true}";
        assertFalse(validator.isValidSignature(tamperedPayload, sigHeader, secret));
    }

    @Test
    void expiredTimestampShouldBeRejectedDueToReplayProtection() {
        String payload = "{\"type\":\"checkout.session.completed\"}";
        long expiredTime = Instant.now().getEpochSecond() - 400; // 400s > 300s limit
        String sigHeader = generateSignature(payload, expiredTime, secret);

        assertFalse(validator.isValidSignature(payload, sigHeader, secret));
    }

    @Test
    void wrongSecretShouldBeRejected() {
        String payload = "{\"type\":\"checkout.session.completed\"}";
        long now = Instant.now().getEpochSecond();
        String sigHeader = generateSignature(payload, now, "wrong_secret");

        assertFalse(validator.isValidSignature(payload, sigHeader, secret));
    }

    @Test
    void controllerShouldAcceptValidWebhookAndTriggerPaymentUpdate() {
        StripeWebhookController controller = new StripeWebhookController(StripeEventService, validator, objectMapper, mock(StripeEventRepository.class), secret);

        String payload = "{\"id\":\"evt_123\",\"type\":\"checkout.session.completed\",\"data\":{\"object\":{\"customer_email\":\"student@codebangers.fr\",\"id\":\"ch_test_123\"}}}";
        long now = Instant.now().getEpochSecond();
        String sigHeader = generateSignature(payload, now, secret);

        ResponseEntity<?> response = controller.handleStripeWebhook(payload, sigHeader);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(StripeEventService).processStripeWebhookEvent("student@codebangers.fr", "checkout.session.completed", "ch_test_123");
    }

    @Test
    void controllerShouldRejectMissingSignatureWhenSecretIsConfigured() {
        StripeWebhookController controller = new StripeWebhookController(StripeEventService, validator, objectMapper, mock(StripeEventRepository.class), secret);

        String payload = "{\"type\":\"checkout.session.completed\"}";
        ResponseEntity<?> response = controller.handleStripeWebhook(payload, null);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        verifyNoInteractions(StripeEventService);
    }

    @Test
    void controllerShouldRejectInvalidSignature() {
        StripeWebhookController controller = new StripeWebhookController(StripeEventService, validator, objectMapper, mock(StripeEventRepository.class), secret);

        String payload = "{\"type\":\"checkout.session.completed\"}";
        ResponseEntity<?> response = controller.handleStripeWebhook(payload, "t=123,v1=invalidhex");

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        verifyNoInteractions(StripeEventService);
    }

    @Test
    void controllerShouldRejectMalformedJsonPayload() {
        StripeWebhookController controller = new StripeWebhookController(StripeEventService, validator, objectMapper, mock(StripeEventRepository.class), secret);

        String payload = "NOT_A_JSON_STRING";
        long now = Instant.now().getEpochSecond();
        String sigHeader = generateSignature(payload, now, secret);

        ResponseEntity<?> response = controller.handleStripeWebhook(payload, sigHeader);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        verifyNoInteractions(StripeEventService);
    }

    @Test
    void controllerShouldHandleDuplicateEventIdempotently() {
        StripeEventRepository eventRepository = mock(StripeEventRepository.class);
        doThrow(new org.springframework.dao.DataIntegrityViolationException("Duplicate key"))
                .when(eventRepository).saveAndFlush(any());

        StripeWebhookController controller = new StripeWebhookController(StripeEventService, validator, objectMapper, eventRepository, secret);

        String payload = "{\"id\":\"evt_duplicate_123\",\"type\":\"checkout.session.completed\",\"data\":{\"object\":{\"customer_email\":\"student@codebangers.fr\",\"id\":\"ch_test_123\"}}}";
        long now = Instant.now().getEpochSecond();
        String sigHeader = generateSignature(payload, now, secret);

        ResponseEntity<?> response = controller.handleStripeWebhook(payload, sigHeader);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody() instanceof Map);
        Map<?, ?> body = (Map<?, ?>) response.getBody();
        assertEquals(true, body.get("received"));
        assertEquals(true, body.get("idempotent"));
        verifyNoInteractions(StripeEventService);
    }

    @Test
    void controllerShouldSaveStripeEventOnFirstOccurrence() {
        StripeEventRepository eventRepository = mock(StripeEventRepository.class);
        StripeWebhookController controller = new StripeWebhookController(StripeEventService, validator, objectMapper, eventRepository, secret);

        String payload = "{\"id\":\"evt_first_123\",\"type\":\"checkout.session.completed\",\"data\":{\"object\":{\"customer_email\":\"student@codebangers.fr\",\"id\":\"ch_test_123\"}}}";
        long now = Instant.now().getEpochSecond();
        String sigHeader = generateSignature(payload, now, secret);

        ResponseEntity<?> response = controller.handleStripeWebhook(payload, sigHeader);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(eventRepository).saveAndFlush(argThat(event ->
                "evt_first_123".equals(event.getStripeEventId()) &&
                "checkout.session.completed".equals(event.getType())
        ));
        verify(StripeEventService).processStripeWebhookEvent("student@codebangers.fr", "checkout.session.completed", "ch_test_123");
    }

    @Test
    void getWebhookHealthShouldReturnStatusUp() {
        StripeWebhookController controller = new StripeWebhookController(StripeEventService, validator, objectMapper, mock(StripeEventRepository.class), secret);

        ResponseEntity<Map<String, Object>> response = controller.getWebhookHealth();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("UP", response.getBody().get("status"));
        assertEquals("stripe-webhook", response.getBody().get("service"));
        assertEquals("/api/payments/webhook", response.getBody().get("endpoint"));
    }
}
