package com.codebangers.backend.payment;

import com.codebangers.backend.payment.controller.PaymentConfigController;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

class PaymentConfigControllerTest {

    @Test
    void shouldReturnConfiguredStripePublishableKey() {
        PaymentConfigController controller = new PaymentConfigController("pk_test_sample123");
        ResponseEntity<Map<String, String>> response = controller.getStripePublishableKey();

        assertThat(response.getStatusCode().is2xxSuccessful()).isTrue();
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().get("publishableKey")).isEqualTo("pk_test_sample123");
    }

    @Test
    void shouldReturnEmptyStringWhenKeyIsNull() {
        PaymentConfigController controller = new PaymentConfigController(null);
        ResponseEntity<Map<String, String>> response = controller.getStripePublishableKey();

        assertThat(response.getStatusCode().is2xxSuccessful()).isTrue();
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().get("publishableKey")).isEqualTo("");
    }
}
