package com.codebangers.backend.payment.service;

import com.codebangers.backend.course.model.Course;
import com.codebangers.backend.payment.dto.CheckoutSessionResponse;
import com.codebangers.backend.user.model.User;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.net.RequestOptions;
import com.stripe.param.checkout.SessionCreateParams;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class StripeGatewayImpl implements StripeGateway {

    private static final Logger log = LoggerFactory.getLogger(StripeGatewayImpl.class);

    private final String stripeSecretKey;
    private final String defaultSuccessUrl;
    private final String defaultCancelUrl;

    public StripeGatewayImpl(
            @Value("${stripe.secret.key:${STRIPE_SECRET_KEY:}}") String stripeSecretKey,
            @Value("${stripe.success.url:${STRIPE_SUCCESS_URL:http://localhost:3000/success.html}}") String defaultSuccessUrl,
            @Value("${stripe.cancel.url:${STRIPE_CANCEL_URL:${app.frontend.url:http://localhost:3000}/cours.html}}") String defaultCancelUrl) {
        this.stripeSecretKey = stripeSecretKey;
        this.defaultSuccessUrl = defaultSuccessUrl;
        this.defaultCancelUrl = defaultCancelUrl;
    }

    @Override
    public CheckoutSessionResponse createCheckoutSession(User user, Course course, String successUrl, String cancelUrl) {
        if (stripeSecretKey == null || stripeSecretKey.isBlank()) {
            throw new IllegalStateException("Stripe Secret Key non configurée. Impossible de créer une Checkout Session.");
        }

        long unitAmount = (course.getPriceInCents() != null && course.getPriceInCents() > 0)
                ? course.getPriceInCents()
                : 4900L;

        String currency = (course.getCurrency() != null && !course.getCurrency().isBlank())
                ? course.getCurrency().toLowerCase()
                : "eur";

        String effectiveSuccessUrl = (successUrl != null && !successUrl.isBlank())
                ? successUrl
                : defaultSuccessUrl + "?session_id={CHECKOUT_SESSION_ID}&course_id=" + course.getId();

        String effectiveCancelUrl = (cancelUrl != null && !cancelUrl.isBlank())
                ? cancelUrl
                : defaultCancelUrl + "?id=" + course.getId() + "&cancelled=true";

        String description = course.getDescription();
        if (description != null && description.length() > 250) {
            description = description.substring(0, 247) + "...";
        }
        if (description == null || description.isBlank()) {
            description = "Formation complète NoSeumCode : " + course.getTitle();
        }

        SessionCreateParams.Builder paramsBuilder = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setCustomerEmail(user.getEmail())
                .setSuccessUrl(effectiveSuccessUrl)
                .setCancelUrl(effectiveCancelUrl)
                .putMetadata("userId", user.getId().toString())
                .putMetadata("courseId", course.getId().toString())
                .putMetadata("userEmail", user.getEmail())
                .addLineItem(
                        SessionCreateParams.LineItem.builder()
                                .setQuantity(1L)
                                .setPriceData(
                                        SessionCreateParams.LineItem.PriceData.builder()
                                                .setCurrency(currency)
                                                .setUnitAmount(unitAmount)
                                                .setProductData(
                                                        SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                .setName(course.getTitle())
                                                                .setDescription(description)
                                                                .build()
                                                )
                                                .build()
                                )
                                .build()
                );

        try {
            RequestOptions options = RequestOptions.builder()
                    .setApiKey(stripeSecretKey)
                    .build();

            Session session = Session.create(paramsBuilder.build(), options);

            log.info("🛒 Session Stripe Checkout créée avec succès : ID={}, URL={}, Course={}, User={}",
                    session.getId(), session.getUrl(), course.getId(), user.getEmail());

            return new CheckoutSessionResponse(
                    session.getId(),
                    session.getUrl(),
                    course.getId(),
                    unitAmount,
                    currency
            );
        } catch (StripeException e) {
            log.error("Erreur lors de la création de la session Stripe: {}", e.getMessage(), e);
            throw new RuntimeException("Échec de la création de session Stripe Checkout : " + e.getMessage(), e);
        }
    }
}
