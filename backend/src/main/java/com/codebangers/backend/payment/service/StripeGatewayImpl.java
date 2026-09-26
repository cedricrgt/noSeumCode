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
    private final String stripePublishableKey;
    private final String defaultSuccessUrl;
    private final String defaultCancelUrl;
    private final String defaultReturnUrl;

    public StripeGatewayImpl(
            @Value("${stripe.secret.key:${STRIPE_SECRET_KEY:}}") String stripeSecretKey,
            @Value("${stripe.publishable.key:${STRIPE_PUBLISHABLE_KEY:pk_test_2BsFfeoXfXOvjtOnGf24JH6E00S9sVcIEG}}") String stripePublishableKey,
            @Value("${stripe.success.url:${STRIPE_SUCCESS_URL:http://localhost:3000/success.html}}") String defaultSuccessUrl,
            @Value("${stripe.cancel.url:${STRIPE_CANCEL_URL:${app.frontend.url:http://localhost:3000}/cours.html}}") String defaultCancelUrl,
            @Value("${stripe.return.url:${STRIPE_RETURN_URL:${app.frontend.url:http://localhost:3000}/success.html}}") String defaultReturnUrl) {
        this.stripeSecretKey = stripeSecretKey;
        this.stripePublishableKey = stripePublishableKey;
        this.defaultSuccessUrl = defaultSuccessUrl;
        this.defaultCancelUrl = defaultCancelUrl;
        this.defaultReturnUrl = defaultReturnUrl;
    }

    @Override
    public CheckoutSessionResponse createCheckoutSession(User user, Course course, String successUrl, String cancelUrl) {
        return createCheckoutSession(user, course, successUrl, cancelUrl, true, null);
    }

    @Override
    public CheckoutSessionResponse createCheckoutSession(User user, Course course, String successUrl, String cancelUrl, boolean embedded, String returnUrl) {
        if (stripeSecretKey == null || stripeSecretKey.isBlank()) {
            throw new IllegalStateException("Stripe Secret Key non configurée. Impossible de créer une Checkout Session.");
        }

        long unitAmount = (course.getPriceInCents() != null && course.getPriceInCents() > 0)
                ? course.getPriceInCents()
                : 4900L;

        String currency = (course.getCurrency() != null && !course.getCurrency().isBlank())
                ? course.getCurrency().toLowerCase()
                : "eur";

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

        if (embedded) {
            String effectiveReturnUrl = (returnUrl != null && !returnUrl.isBlank())
                    ? returnUrl
                    : ((successUrl != null && !successUrl.isBlank()) ? successUrl : defaultReturnUrl);

            if (!effectiveReturnUrl.contains("{CHECKOUT_SESSION_ID}")) {
                effectiveReturnUrl += (effectiveReturnUrl.contains("?") ? "&" : "?") + "session_id={CHECKOUT_SESSION_ID}";
            }
            if (!effectiveReturnUrl.contains("course_id=") && course.getId() != null) {
                effectiveReturnUrl += "&course_id=" + course.getId();
            }

            paramsBuilder
                    .setUiMode(SessionCreateParams.UiMode.EMBEDDED)
                    .setReturnUrl(effectiveReturnUrl);
        } else {
            String effectiveSuccessUrl = (successUrl != null && !successUrl.isBlank())
                    ? successUrl
                    : defaultSuccessUrl + "?session_id={CHECKOUT_SESSION_ID}&course_id=" + course.getId();

            String effectiveCancelUrl = (cancelUrl != null && !cancelUrl.isBlank())
                    ? cancelUrl
                    : defaultCancelUrl + "?id=" + course.getId() + "&cancelled=true";

            paramsBuilder
                    .setSuccessUrl(effectiveSuccessUrl)
                    .setCancelUrl(effectiveCancelUrl);
        }

        try {
            RequestOptions options = RequestOptions.builder()
                    .setApiKey(stripeSecretKey)
                    .build();

            Session session = Session.create(paramsBuilder.build(), options);

            log.info("🛒 Session Stripe Checkout créée avec succès : ID={}, Mode={}, Course={}, User={}",
                    session.getId(), (embedded ? "EMBEDDED" : "HOSTED"), course.getId(), user.getEmail());

            return new CheckoutSessionResponse(
                    session.getId(),
                    session.getUrl(),
                    course.getId(),
                    unitAmount,
                    currency,
                    session.getClientSecret(),
                    stripePublishableKey
            );
        } catch (StripeException e) {
            log.error("Erreur lors de la création de la session Stripe: {}", e.getMessage(), e);
            throw new RuntimeException("Échec de la création de session Stripe Checkout : " + e.getMessage(), e);
        }
    }

    @Override
    public Session retrieveSession(String sessionId) {
        if (sessionId == null || sessionId.isBlank()) {
            throw new IllegalArgumentException("L'identifiant de session Stripe est requis.");
        }
        try {
            RequestOptions options = RequestOptions.builder()
                    .setApiKey(stripeSecretKey)
                    .build();
            return Session.retrieve(sessionId, options);
        } catch (StripeException e) {
            log.error("Erreur lors de la récupération de la session Stripe {}: {}", sessionId, e.getMessage());
            throw new RuntimeException("Erreur Stripe lors de la récupération de la session : " + e.getMessage(), e);
        }
    }

    @Override
    public String createCustomerPortalSession(User user, String returnUrl) {
        if (stripeSecretKey == null || stripeSecretKey.isBlank()) {
            throw new IllegalStateException("Stripe Secret Key non configurée. Impossible d'ouvrir le portail client.");
        }

        RequestOptions options = RequestOptions.builder()
                .setApiKey(stripeSecretKey)
                .build();

        try {
            com.stripe.param.CustomerListParams listParams = com.stripe.param.CustomerListParams.builder()
                    .setEmail(user.getEmail())
                    .setLimit(1L)
                    .build();

            com.stripe.model.CustomerCollection customers = com.stripe.model.Customer.list(listParams, options);
            String customerId;

            if (customers.getData() != null && !customers.getData().isEmpty()) {
                customerId = customers.getData().get(0).getId();
            } else {
                com.stripe.param.CustomerCreateParams createParams = com.stripe.param.CustomerCreateParams.builder()
                        .setEmail(user.getEmail())
                        .setName(user.getFirstName() + " " + user.getLastName())
                        .putMetadata("userId", user.getId().toString())
                        .build();
                com.stripe.model.Customer newCustomer = com.stripe.model.Customer.create(createParams, options);
                customerId = newCustomer.getId();
            }

            String effectiveReturnUrl = (returnUrl != null && !returnUrl.isBlank())
                    ? returnUrl
                    : defaultReturnUrl.replace("success.html", "dashboard.html");

            com.stripe.param.billingportal.SessionCreateParams portalParams =
                    com.stripe.param.billingportal.SessionCreateParams.builder()
                            .setCustomer(customerId)
                            .setReturnUrl(effectiveReturnUrl)
                            .build();

            com.stripe.model.billingportal.Session portalSession =
                    com.stripe.model.billingportal.Session.create(portalParams, options);

            return portalSession.getUrl();
        } catch (StripeException e) {
            log.error("Erreur lors de la création de la session Customer Portal pour user {}: {}", user.getEmail(), e.getMessage());
            throw new RuntimeException("Erreur Stripe lors de l'accès au portail de facturation : " + e.getMessage(), e);
        }
    }
}
