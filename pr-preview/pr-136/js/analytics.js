/**
 * NoSeumCode — Analytics Cookieless & Privacy-First (ADR-015 / Sprint 9)
 * 
 * Solution conforme au RGPD (exemptée de consentement CNIL car 100% cookieless,
 * sans fingerprinting intrusif ni collecte de données personnelles).
 * Supporte Plausible Analytics et Umami avec repli transparent (graceful fallback).
 */

(function () {
  'use strict';

  // Configuration par défaut
  const CONFIG = {
    domain: 'noseumcode.fr',
    isDev: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname.includes('develop'),
    debug: false
  };

  /**
   * Vérifie si le visiteur a activé le flag "Do Not Track"
   */
  function isDntActive() {
    return navigator.doNotTrack === '1' || window.doNotTrack === '1' || navigator.msDoNotTrack === '1';
  }

  /**
   * Envoie un événement personnalisé à la solution d'analytics active.
   * Compatible avec Plausible (`window.plausible`) et Umami (`window.umami.track`).
   *
   * @param {string} eventName - Nom de l'événement (ex: 'cta_click', 'checkout_initiate')
   * @param {Object} [props={}] - Propriétés contextuelles (ex: { cta: 'hero_go_coder', tier: 'STARTER' })
   */
  function trackEvent(eventName, props = {}) {
    if (isDntActive()) {
      return;
    }

    // Propriétés nettoyées (sans PII)
    const sanitizedProps = { ...props };
    delete sanitizedProps.email;
    delete sanitizedProps.password;
    delete sanitizedProps.token;

    // 1. Plausible Analytics
    if (typeof window.plausible === 'function') {
      try {
        window.plausible(eventName, { props: sanitizedProps });
      } catch (err) {
        console.warn('[Analytics] Erreur Plausible:', err);
      }
    }

    // 2. Umami Analytics
    if (window.umami && typeof window.umami.track === 'function') {
      try {
        window.umami.track(eventName, sanitizedProps);
      } catch (err) {
        console.warn('[Analytics] Erreur Umami:', err);
      }
    }

    // 3. Journalisation de débogage en environnement local ou staging
    if (CONFIG.isDev || CONFIG.debug) {
      console.debug(`%c[Analytics] 📊 ${eventName}`, 'color: #00ff87; font-weight: bold;', sanitizedProps);
    }
  }

  /**
   * Alias de conversion pour les objectifs clés du tunnel commercial
   */
  function trackConversion(goalName, props = {}) {
    trackEvent(goalName, { ...props, is_conversion: true });
  }

  // Exposition globale des méthodes de tracking
  window.trackEvent = trackEvent;
  window.trackConversion = trackConversion;

  /**
   * Capture automatique des interactions utilisateur (CTAs, formulaires, téléchargements)
   */
  document.addEventListener('DOMContentLoaded', () => {

    // 1. Suivi des clics sur les boutons et CTAs majeurs (délégation d'événements)
    document.addEventListener('click', (event) => {
      const target = event.target.closest('[data-track], .button, .card__link, a[download], .popover__cta');
      if (!target) return;

      // Priorité à l'attribut data-track
      const customEventName = target.getAttribute('data-track');
      const ctaName = target.getAttribute('data-track-cta') || target.textContent.trim().substring(0, 40);
      const location = target.getAttribute('data-track-location') || target.closest('section')?.id || 'page';

      if (customEventName) {
        trackEvent(customEventName, {
          cta_name: ctaName,
          location: location,
          href: target.getAttribute('href') || undefined
        });
        return;
      }

      // Détection des téléchargements PDF (Lead magnets / programmes)
      if (target.matches('a[download], a[href$=".pdf"]')) {
        trackConversion('pdf_download', {
          file_name: target.getAttribute('href')?.split('/').pop() || 'document.pdf',
          cta_text: ctaName,
          location: location
        });
        return;
      }

      // Détection automatique des boutons d'action
      if (target.matches('.button__primary, .button__secondary, .popover__cta')) {
        trackEvent('cta_click', {
          cta_text: ctaName,
          location: location,
          type: target.classList.contains('button__primary') ? 'primary' : 'secondary'
        });
      }
    }, { passive: true });

    // 2. Écoute des soumissions de formulaires HubSpot (message postMessage)
    window.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'hsFormCallback') {
        if (event.data.eventName === 'onFormSubmitted') {
          trackConversion('hubspot_form_submitted', {
            form_id: event.data.data?.formId || 'hubspot_default',
            location: 'lead_magnet_modal'
          });
        }
      }
    });

    // 3. Détection de la page de confirmation de commande Stripe (success.html)
    if (window.location.pathname.endsWith('success.html') || window.location.pathname.includes('/success')) {
      const urlParams = new URLSearchParams(window.location.search);
      const sessionId = urlParams.get('session_id');
      const courseId = urlParams.get('course_id');

      if (sessionId || courseId) {
        trackConversion('checkout_completed', {
          session_id: sessionId ? sessionId.substring(0, 15) + '...' : undefined,
          course_id: courseId || 'unknown'
        });
      }
    }
  });

})();
