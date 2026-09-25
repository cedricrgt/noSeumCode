package com.codebangers.backend.payment.service;

import com.codebangers.backend.course.model.Course;
import com.codebangers.backend.payment.dto.CheckoutSessionResponse;
import com.codebangers.backend.user.model.User;

public interface StripeGateway {

    /**
     * Crée une session de paiement hébergée ou embarquée Stripe Checkout pour un utilisateur et un cours donné.
     *
     * @param user L'utilisateur apprenant acheteur
     * @param course Le cours acheté
     * @param successUrl L'URL de redirection en cas de succès (optionnel)
     * @param cancelUrl L'URL de redirection en cas d'annulation (optionnel)
     * @return Les détails de la session créée (sessionId, sessionUrl, clientSecret, publishableKey, montant, devise)
     */
    CheckoutSessionResponse createCheckoutSession(User user, Course course, String successUrl, String cancelUrl);

    /**
     * Crée une session de paiement Stripe Checkout avec sélection explicite du mode (Embedded ou Hosted).
     *
     * @param user L'utilisateur apprenant acheteur
     * @param course Le cours acheté
     * @param successUrl L'URL de succès (mode Hosted)
     * @param cancelUrl L'URL d'annulation (mode Hosted)
     * @param embedded Si true, génère une session en mode EMBEDDED avec clientSecret et returnUrl
     * @param returnUrl L'URL de retour après paiement pour le mode EMBEDDED
     * @return Les détails de la session créée
     */
    CheckoutSessionResponse createCheckoutSession(User user, Course course, String successUrl, String cancelUrl, boolean embedded, String returnUrl);
}
