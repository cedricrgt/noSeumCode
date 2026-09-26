# ROADMAP.md — Feuille de Route Commerciale NoSeumCode

> _Dernière mise à jour : 2026-09-26_  
> _Objectif : Transformer le MVP NoSeumCode en produit final, sécurisé, commercialisable et prêt pour la production._

---

## 🎯 Vue d'ensemble des Sprints

| Sprint | Thème Principal | Objectif Clé | Statut |
| :--- | :--- | :--- | :--- |
| **Sprint 1** | **Sécurité & Paywall Serveur** | Bloquer l'accès gratuit aux cours et sécuriser le webhook Stripe (HMAC SHA-256) | ✅ **Terminé** |
| **Sprint 2** | **Tunnel de Vente & Monétisation** | Intégrer Stripe Embedded Checkout réel et métadonnées marchandes | ✅ **Terminé** |
| **Sprint 3** | **Auth, Comptes & E-mails** | Mot de passe oublié, emails transactionnels Brevo, sessions RTR 7 jours | ✅ **Terminé** |
| **Sprint 4** | **Quick Wins Conversion, Leads & Légal** | Réparer les CTA Hero, débloquer CSP HubSpot, sécuriser `thanks.html`, pages légales | 🟡 **En cours / Prêt** |
| **Sprint 5** | **Workshops Gratuits Toussaint** | Bandeau header réactivé, page dédiée `workshops.html`, jauge stricte 6 élèves max | ⚪ **Planifié** |
| **Sprint 6** | **Nouvelle Gamme & Accès Cohortes** | Pack Starter (accès replays à vie), Pack Web, option VIP, Klarna BNPL via Stripe | ⚪ **Planifié** |
| **Sprint 7** | **Performance Web & SEO Technique** | Compression images (<800 Ko), rendu statique dédié formations, fix CLS, cache Apache | ⚪ **Planifié** |
| **Sprint 8** | **Copywriting & Rassurance Parents/Jeunes** | Refonte Hero, section Ton Mentor, rassurance parents, Analytics RGPD cookieless | ⚪ **Planifié** |

---

## 📊 Diagramme de Gantt (Rendu Visuel GitHub & Git)

```mermaid
gantt
    title Feuille de Route NoSeumCode
    dateFormat  YYYY-MM-DD
    axisFormat  %d/%m

    section Sprint 1 : Sécurité & Paywall
    HMAC Webhook Stripe (1.1)            :done, s1_1, 2026-09-24, 2026-09-25
    Paywall Serveur Chapitres (1.2)      :done, s1_2, 2026-09-24, 2026-09-25
    Purge faille localStorage (1.3)      :done, s1_3, 2026-09-24, 2026-09-25

    section Sprint 2 : Monétisation & Stripe
    SDK stripe-java (2.1)                :done, s2_1, 2026-09-25, 2026-09-25
    Catalogue & Flyway V011 (2.3)        :done, s2_2, 2026-09-25, 2026-09-25
    Stripe Checkout Embedded (2.2)       :done, s2_3, 2026-09-25, 2026-09-25
    Tunnel Achat & Paywall In-App (2.4)  :done, s2_4, 2026-09-25, 2026-09-25
    Confirmation Session Stripe API      :done, s2_5, 2026-09-25, 2026-09-26

    section Sprint 3 : Auth & E-mails
    EmailService & Templates Brevo (3.1) :done, s3_1, 2026-09-25, 2026-09-26
    Mot de passe oublié & Flyway V012(3.2):done, s3_2, 2026-09-25, 2026-09-26
    Refresh Tokens Rotation RTR (3.3)    :done, s3_3, 2026-09-25, 2026-09-26
    Rate Limiting OWASP (3.4)            :done, s3_4, 2026-09-25, 2026-09-26

    section Sprint 4 : Quick Wins & Légal
    Réparation CTA Hero & Liens (4.1)    :active, s4_1, 2026-09-26, 1d
    Déblocage CSP HubSpot & Mail PDF(4.2):s4_2, after s4_1, 1d
    Sécurisation thanks.html (4.3)       :s4_3, after s4_2, 1d
    Pages Légales CGV / Mentions (4.4)   :s4_4, after s4_3, 2d

    section Sprint 5 : Workshops Toussaint
    Bandeau Header Déroulant (5.1)       :s5_1, after s4_4, 1d
    Page dédiée workshops.html (5.2)     :s5_2, after s5_1, 2d
    Jauge 6 inscrits & Dashboard (5.3)   :s5_3, after s5_2, 1d

    section Sprint 6 : Nouvelle Gamme & Cohortes
    Modélisation Cohortes & Plans (6.1)  :s6_1, after s5_3, 2d
    Contrôle accès Replays & Live (6.2)  :s6_2, after s6_1, 2d
    Klarna BNPL & Stripe Checkout (6.3)  :s6_3, after s6_2, 1d

    section Sprint 7 : Performance & SEO
    Compression Images <800Ko (7.1)      :s7_1, after s6_3, 1d
    Pages Statiques Formations & OG (7.2):s7_2, after s7_1, 2d
    Fix CLS Header & Cache Apache (7.3)  :s7_3, after s7_2, 1d

    section Sprint 8 : Copywriting & Analytics
    Hero & Rassurance Parents/Jeunes(8.1):s8_1, after s7_3, 2d
    Section Ton Mentor (8.2)             :s8_2, after s8_1, 1d
    Analytics Cookieless RGPD (8.3)      :s8_3, after s8_2, 1d
```

---

## 📋 Détail des Sprints

### Sprint 1 : Sécurité du Paywall Serveur & Webhook Stripe (Terminé)
- **1.1 Validation HMAC Webhook Stripe** (`PaymentController.java`) : Validation cryptographique du header `Stripe-Signature` avec tolérance anti-rejeu.
- **1.2 Paywall Serveur sur Chapitres & Contenus** (`ChapterController.java`, `ContentController.java`) : Vérification stricte des inscriptions `PAID`.
- **1.3 Purge de la faille client** (`cours.js`, `dashboard.js`) : Élimination de `noseum_payments` dans le localStorage.

---

### Sprint 2 : Monétisation Réelle & Tunnel Stripe Checkout (Terminé)
- **2.1 Intégration du SDK Stripe** : `com.stripe:stripe-java` dans `backend/pom.xml` via architecture Ports/Adapters (`StripeGateway`).
- **2.2 Endpoint Checkout Session** (`POST /api/payments/create-checkout-session`) : Session Stripe Embedded Checkout avec mode `payment`.
- **2.3 Modèle Économique & Catalogue** (`Course.java`, Flyway migration V011) : Tarifs, slugs, devises, publication.

---

### Sprint 3 : Comptes Apprenants & E-mails Transactionnels (Terminé)
- **3.1 Fournisseur Mail Transactionnel Brevo** : Intégration des templates e-mail transactionnels.
- **3.2 Flux Mot de Passe Oublié** : Endpoints `POST /api/auth/forgot-password` et `POST /api/auth/reset-password` avec hachage SHA-256 du token (Flyway V012).
- **3.3 Refresh Token Rotation (RTR)** : Persistance PostgreSQL hachée SHA-256 avec rotation automatique sur 7 jours.
- **3.4 Sécurité OWASP** : Filtre de Rate Limiting (15 req/min par IP, HTTP 429) et validation stricte des mots de passe.

---

### Sprint 4 : Quick Wins Conversion, Déblocage Leads & Légal (En cours / Prochain)
- **4.1 Réparation des CTA du Hero** (`frontend/index.html`) :
  - Bouton 1 : *"Go coder"* ➔ Redirection fluide vers `cours.html`.
  - Bouton 2 : *"Teste et kiffe !"* ➔ Redirection vers la future page des ateliers gratuits (`workshops.html` ou modale programme).
- **4.2 Déblocage CSP HubSpot & Stratégie Lead Magnet** (`frontend/.htaccess`, `popover-hubspot.js`) :
  - Autoriser `https://js-eu1.hsforms.net` et `https://forms-eu1.hsforms.com` dans `script-src`, `connect-src`, `frame-src`.
  - Configuration de l'envoi du programme de formation par e-mail automatique pour forcer des e-mails qualifiés.
- **4.3 Sécurisation de `thanks.html` et des PDFs** :
  - Ajout de `<meta name="robots" content="noindex, nofollow">` sur `thanks.html`, `dashboard.html`, `reset-password.html`.
  - Retrait des pages privées du `sitemap.xml`.
  - Correction du bouton Git & GitHub dans `thanks.html` (qui téléchargeait le PDF JavaScript par erreur).
- **4.4 Pages Légales & Conformité RGPD** :
  - Création de `mentions-legales.html`, `cgv.html`, `politique-confidentialite.html`.
  - Remplacement des liens factices du footer.
  - Retrait des boutons sociaux non implémentés (Facebook, GitHub auth) du formulaire de connexion/inscription.

---

### Sprint 5 : Workshops Gratuits Toussaint (Acquisition & Preuves Vidéos)
- **5.1 Bandeau Header Déroulant** (`frontend/partials/header.html`) :
  - Décommenter et réactiver le bandeau supérieur de promotion des ateliers découvertes gratuits.
- **5.2 Page dédiée Workshops** (`frontend/workshops.html`) :
  - Présentation des ateliers live découvertes (HTML/CSS & JavaScript) de 2h pendant les vacances.
- **5.3 Gestion de la Jauge & Inscription** :
  - Limite stricte de 6 participants maximum par session d'atelier.
  - Réservation rattachée au compte étudiant et synchronisée avec le dashboard.

---

### Sprint 6 : Nouvelle Gamme & Accès Cohortes (Starter, Web, VIP & Klarna)
- **6.1 Nettoyage Catalogue & Modèle Économique** :
  - Suppression définitive des faux cours d'essai (Java 21 à 49 € et Clean Architecture à 69 €).
  - Création de la gamme : **Pack Starter** (Découverte & Fondations - 6 semaines) et **Pack Web** (Parcours complet interactif).
  - Option **Mentorat VIP** : Pack Web + 4 sessions individuelles d'1h planifiées avec le formateur.
- **6.2 Modélisation Backend & Règle des Replays** :
  - Entité `Cohort` et type de souscription dans `Enrollment`.
  - **Les élèves Starter conservent l'accès à vie aux replays de leur tronc commun (HTML/CSS/Git)**.
  - Verrouillage automatique côté backend des sessions live et des replays des modules avancés (JavaScript, API, CI/CD) pour les élèves Starter.
- **6.3 Intégration Klarna (BNPL)** :
  - Activation de Klarna via Stripe Checkout pour le paiement fractionné en 3x/4x sans risque d'impayé (fonds garantis par Klarna).

---

### Sprint 7 : Performance Web & SEO Technique
- **7.1 Compression Drastique des Images** :
  - Remplacement du faux `git.webp` (2,73 Mo) par un vrai WebP compressé (<100 Ko).
  - Optimisation des logos PNG (`logo-css`, `logo-react`, `logo-js`) et du favicon (passage de 10 Mo au total à <800 Ko).
- **7.2 Pages Statiques Formations & Métadonnées Dynamiques** :
  - Fichiers HTML statiques dédiés pour chaque offre (`/formations/starter.html`, `/formations/pack-web.html`).
  - Balises Open Graph réelles (1200x630 px) et données structurées Schema.org `Course`.
- **7.3 Optimisation Core Web Vitals & Cache Apache** :
  - Hauteur réservée au conteneur `#header-placeholder` pour éliminer le CLS.
  - Directives de compression `mod_deflate` / Brotli et expiration de cache pour WebP/AVIF/fonts dans `.htaccess`.

---

### Sprint 8 : Refonte Copywriting & Rassurance Parents/Jeunes
- **8.1 Repositionnement du Message & Hero** :
  - Titre : *"Apprendre à coder en construisant de vrais projets"*.
  - Double discours : cool et valorisant pour les 16-25 ans, structuré et rassurant pour les parents (cours en direct, petits groupes de 6, 2h cours + 2h atelier projet par semaine).
- **8.2 Section "Ton Mentor"** :
  - Présentation de Cédric, son parcours technique, sa pédagogie active et humaine.
- **8.3 Analytics Conforme RGPD & Cookieless** :
  - Intégration de Plausible ou Umami (léger, respectueux de la vie privée, sans bandeau cookie intrusif).
  - Mesure des conversions (clics CTA, soumissions HubSpot, checkouts Stripe).
