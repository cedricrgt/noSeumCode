# ROADMAP.md â€” Feuille de Route Commerciale NoSeumCode

> _DerniÃ¨re mise Ã  jour : 2026-10-04_  
> _Objectif : Transformer le MVP NoSeumCode en produit final, sÃ©curisÃ©, commercialisable et prÃªt pour la production._

---

## ðŸŽ¯ Vue d'ensemble des Sprints

| Sprint | ThÃ¨me Principal | Objectif ClÃ© | Statut |
| :--- | :--- | :--- | :--- |
| **Sprint 1** | **SÃ©curitÃ© & Paywall Serveur** | Bloquer l'accÃ¨s gratuit aux cours et sÃ©curiser le webhook Stripe (HMAC SHA-256) | âœ… **TerminÃ©** |
| **Sprint 2** | **Tunnel de Vente & MonÃ©tisation** | IntÃ©grer Stripe Embedded Checkout rÃ©el et mÃ©tadonnÃ©es marchandes | âœ… **TerminÃ©** |
| **Sprint 3** | **Auth, Comptes & E-mails** | Mot de passe oubliÃ©, emails transactionnels Brevo, sessions RTR 7 jours | âœ… **TerminÃ©** |
| **Sprint 4** | **Quick Wins Conversion, Leads & LÃ©gal** | RÃ©parer les CTA Hero, dÃ©bloquer CSP HubSpot, sÃ©curiser `thanks.html`, pages lÃ©gales | âœ… **TerminÃ©** |
| **Sprint 5** | **Portail Client Stripe** | Factures PDF, reÃ§us d'achat et gestion des moyens de paiement apprenant | âœ… **TerminÃ©** |
| **Sprint 6** | **Workshops Gratuits Toussaint** | Bandeau header rÃ©activÃ©, page dÃ©diÃ©e `workshops.html`, jauge stricte 6 Ã©lÃ¨ves max | âœ… **TerminÃ©** |
| **Sprint 7** | **Nouvelle Gamme & AccÃ¨s Cohortes** | Pack Starter (accÃ¨s replays Ã  vie), Pack Web, option VIP, Klarna BNPL via Stripe | âœ… **TerminÃ©** |
| **Sprint 8** | **Performance Web & SEO Technique** | Compression images (<800 Ko), rendu statique dÃ©diÃ© formations, fix CLS, cache Apache | âœ… **TerminÃ©** |
| **Sprint 9** | **Copywriting & Rassurance Parents/Jeunes** | Refonte Hero, section Ton Mentor, rassurance parents, Analytics RGPD cookieless | âœ… **TerminÃ©** |
| **Sprint 10** | **Optimisation PageSpeed & Core Web Vitals** | LCP < 1.5s, Ã©radication CLS 0.175 sur Hero, dÃ©ferrement Stripe & GPU compositing | âœ… **TerminÃ©** |
| **Sprint 11** | **IntÃ©gration Discord & CommunautÃ©** | OAuth2 Discord (`identify`, `email`, `guilds.join`), liaison compte, auto-join guild et synchronisation dynamique des rÃ´les selon le palier (Starter, Web, VIP) | âœ… **TerminÃ©** |
| **Sprint 12** | **Web Performance, BFCache & Cache Policy** | DÃ©blocage BFCache (.htaccess), cache 1 an CSS/JS, versioning assets, Ã©lagage Google Fonts (-35Ko) | âœ… **TerminÃ©** |
| **Sprint 13** | **Socle Technique, SÃ©curitÃ© Serveur & Assets** | DÃ©blocage CSP HubSpot, cache Apache Ã©tendu, SEO technique (robots.txt, sitemap), compression WebP (>5 Mo) et 3 pages lÃ©gales | âœ… **TerminÃ©** |
| **Sprint 14** | **Nouvelle Architecture des Offres (3 Packages)** | ModÃ©lisation catalogue `cours.js` (Starter 89 â‚¬, Web Pro 179 â‚¬, VIP 389 â‚¬), alignement Stripe, navigation `header.html` et page parcours | âœ… **TerminÃ©** |
| **Sprint 15** | **Refonte Copywriting Homepage & SEO SÃ©mantique** | Copywriting validÃ©, H1/Hero percutant, suppression du double regard, grille des 3 offres `#parcours`, FAQ 6 questions et mots-clÃ©s cibles | âœ… **TerminÃ©** |
| **Sprint 16** | **Tunnel Lead Magnet, Onboarding & Cocon Blog** | SÃ©curisation `thanks.html` (liens PDF + upsell), onboarding `success.html`, gabarit cocon blog (`article.html`) et recette globale | âœ… **TerminÃ©** |
| **Sprint 17** | **Urgences Vitales CRO & SEO (24h)** | Correction prix 3x, redirections 301 (.htaccess), fix canonical blog, CTA hero workshops, pack unique `thanks.html` | âœ… **TerminÃ©** |
| **Sprint 18** | **Optimisation StratÃ©gique & IA / AEO (1 sem)** | DonnÃ©es structurÃ©es JSON-LD Course/FAQPage, Order Bump HTML Suivi Mentor (+199 â‚¬), avis preuve sociale, macaron garantie 14j | âœ… **TerminÃ©** |
| **Sprint 19** | **Architecture Statique & SSG (1 mois)** | Suppression CSR Header/Footer via script de build Node.js, gÃ©nÃ©ration physique des articles (/blog/*.html), alignement sitemap.xml | ðŸ“‹ **Ã€ faire** |
| **Sprint 20** | **Urgences Déploiement & Sécurité (P0)** | Correction Build Docker, suppression SUPERUSER, suppression DELETE Flyway, correction env | 🚧 **À faire** |
| **Sprint 21** | **Consolidation Métier & Idempotence Stripe (P1)** | Idempotence Webhooks, prix DB, course slugs, Rate Limiting X-Forwarded-For | 🚧 **À faire** |
| **Sprint 22** | **Dette Technique & Architecture (P2)** | Découpage PaymentController/Service, Bounded Contexts, Testcontainers, UI core | 🚧 **À faire** |
| **Sprint 23** | **Finalisation Idempotence Stripe & Infra (P0)** | Entité StripeEvent, logique idempotence, vérification droits DBA, branch protection | 🚧 **À faire** |
| **Sprint 24** | **Qualité, CI/CD et Observabilité (P1 & P2)** | Nettoyage secrets env, Testcontainers PostgreSQL, refactoring métier, Correlation ID | 🚧 **À faire** |
| **Sprint 25** | **Sécurité Métier & Idempotence Stripe (P0)** | IDOR, usurpation session, verrou idempotence Stripe DB | ✅ **Terminé** |
| **Sprint 26** | **E2E, CORS & Hygiène (P1 & P2)** | Playwright CI, durcissement CORS, HttpOnly cookies, nettoyage repo | ✅ **Terminé** |

---

## ðŸ“Š Diagramme de Gantt (Rendu Visuel GitHub & Git)

```mermaid
gantt
    title Feuille de Route NoSeumCode
    dateFormat  YYYY-MM-DD
    axisFormat  %d/%m

    section Sprint 1 : SÃ©curitÃ© & Paywall
    HMAC Webhook Stripe (1.1)            :done, s1_1, 2026-09-24, 2026-09-25
    Paywall Serveur Chapitres (1.2)      :done, s1_2, 2026-09-24, 2026-09-25
    Purge faille localStorage (1.3)      :done, s1_3, 2026-09-24, 2026-09-25

    section Sprint 2 : MonÃ©tisation & Stripe
    SDK stripe-java (2.1)                :done, s2_1, 2026-09-25, 2026-09-25
    Catalogue & Flyway V011 (2.3)        :done, s2_2, 2026-09-25, 2026-09-25
    Stripe Checkout Embedded (2.2)       :done, s2_3, 2026-09-25, 2026-09-25
    Tunnel Achat & Paywall In-App (2.4)  :done, s2_4, 2026-09-25, 2026-09-25
    Confirmation Session Stripe API      :done, s2_5, 2026-09-25, 2026-09-26

    section Sprint 3 : Auth & E-mails
    EmailService & Templates Brevo (3.1) :done, s3_1, 2026-09-25, 2026-09-26
    Mot de passe oubliÃ© & Flyway V012(3.2):done, s3_2, 2026-09-25, 2026-09-26
    Refresh Tokens Rotation RTR (3.3)    :done, s3_3, 2026-09-25, 2026-09-26
    Rate Limiting OWASP (3.4)            :done, s3_4, 2026-09-25, 2026-09-26

    section Sprint 4 : Quick Wins & LÃ©gal
    RÃ©paration CTA Hero & Liens (4.1)    :done, s4_1, 2026-09-26, 2026-09-26
    DÃ©blocage CSP HubSpot & Mail PDF(4.2):done, s4_2, 2026-09-26, 2026-09-26
    SÃ©curisation thanks.html (4.3)       :done, s4_3, 2026-09-26, 2026-09-26
    Pages LÃ©gales CGV / Mentions (4.4)   :done, s4_4, 2026-09-26, 2026-09-26

    section Sprint 5 : Portail Factures Stripe
    Stripe Billing Portal API (5.1)      :done, s5_1, 2026-09-26, 2026-09-26
    Dashboard Header Factures CTA (5.2)  :done, s5_2, 2026-09-26, 2026-09-26
    Espace Factures & ReÃ§us Apprenant(5.3):done, s5_3, 2026-09-26, 2026-09-26

    section Sprint 6 : Workshops Toussaint
    Bandeau Header DÃ©roulant (6.1)       :done, s6_1, 2026-09-26, 2026-09-26
    Page dÃ©diÃ©e workshops.html (6.2)     :done, s6_2, 2026-09-26, 2026-09-26
    Jauge 6 inscrits & Dashboard (6.3)   :done, s6_3, 2026-09-26, 2026-09-26

    section Sprint 7 : Nouvelle Gamme & Cohortes
    ModÃ©lisation Cohortes & Plans (7.1)  :done, s7_1, 2026-09-27, 2026-09-27
    ContrÃ´le accÃ¨s Replays & Live (7.2)  :done, s7_2, 2026-09-27, 2026-09-27
    Klarna BNPL & Stripe Checkout (7.3)  :done, s7_3, 2026-09-27, 2026-09-27

    section Sprint 8 : Performance & SEO
    Compression Images <800Ko (8.1)      :done, s8_1, 2026-09-27, 2026-09-28
    Pages Statiques Formations & OG (8.2):done, s8_2, 2026-09-27, 2026-09-28
    Fix CLS Header & Cache Apache (8.3)  :done, s8_3, 2026-09-27, 2026-09-28

    section Sprint 9 : Copywriting & Analytics
    Hero & Rassurance Parents/Jeunes(9.1):done, s9_1, 2026-09-28, 2026-09-28
    Section Ton Mentor (9.2)             :done, s9_2, 2026-09-28, 2026-09-28
    Analytics Cookieless RGPD (9.3)      :done, s9_3, 2026-09-28, 2026-09-28

    section Sprint 10 : Optimisation PageSpeed & Core Web Vitals
    Retrait Stripe de la homepage (10.1) :done, s10_1, 2026-09-28, 2026-09-28
    Scripts Defer & Minification JS (10.2):done, s10_2, 2026-09-28, 2026-09-28
    Ã‰radication CLS & GPU Compositing(10.3):done, s10_3, 2026-09-28, 2026-09-28
    Optimisation Images & Waterfall (10.4):done, s10_4, 2026-09-28, 2026-09-28

    section Sprint 11 : Discord & CommunautÃ©
    OAuth2 Scopes & ModÃ¨le V016 (11.1)   :done, s11_1, 2026-09-28, 2026-09-28
    Ports/Adapters Discord Gateway (11.2):done, s11_2, 2026-09-28, 2026-09-28
    Synchronisation RÃ´les & Stripe (11.3):done, s11_3, 2026-09-28, 2026-09-28
    Dashboard UI & Unlink/Sync (11.4)    :done, s11_4, 2026-09-28, 2026-09-28

    section Sprint 12 : Web Performance & BFCache
    DÃ©blocage BFCache Apache (12.1)      :done, s12_1, 2026-09-29, 2026-09-30
    Cache 1 an CSS/JS & Versioning (12.2):done, s12_2, 2026-09-29, 2026-09-30
    Ã‰lagage Fonts & Suppression 404(12.3):done, s12_3, 2026-09-29, 2026-09-30

    section Sprint 13 : Socle Technique & Assets
    DÃ©blocage CSP HubSpot & Cache (13.1) :done, s13_1, 2026-09-30, 2026-09-30
    HygiÃ¨ne SEO robots.txt/sitemap (13.2):done, s13_2, 2026-09-30, 2026-09-30
    Compression WebP & Favicon (13.3)    :done, s13_3, 2026-09-30, 2026-09-30
    Pages LÃ©gales & Footer (13.4)        :done, s13_4, 2026-09-30, 2026-09-30

    section Sprint 14 : Nouvelle Gamme 3 Packages
    ModÃ¨le Catalogue cours.js & Stripe (14.1):done, s14_1, 2026-09-30, 2026-09-30
    Refonte Page Parcours & Niveaux (14.2)   :done, s14_2, 2026-09-30, 2026-09-30
    Navigation Globale & Header (14.3)       :done, s14_3, 2026-09-30, 2026-09-30

    section Sprint 15 : Copywriting & SEO Homepage
    MÃ©tadonnÃ©es & Matrice Mots-ClÃ©s (15.1)   :done, s15_1, 2026-09-30, 2026-09-30
    Hero H1 Sans le Seum & Trustbar (15.2)   :done, s15_2, 2026-09-30, 2026-09-30
    La MÃ©thode 3 Piliers (15.3)              :done, s15_3, 2026-09-30, 2026-09-30
    Grille 3 Packages #parcours (15.4)       :done, s15_4, 2026-09-30, 2026-09-30
    FAQ 6 Questions Anti-Objections (15.5)   :done, s15_5, 2026-09-30, 2026-09-30

    section Sprint 16 : Conversion, Lead Magnet & QA
    Lead Magnet thanks.html & Upsell (16.1)  :done, s16_1, 2026-09-30, 2026-09-30
    Onboarding success.html (16.2)           :done, s16_2, 2026-09-30, 2026-09-30
    Gabarit Cocon Blog & Maillage (16.3)     :done, s16_3, 2026-09-30, 2026-09-30
    Recette E2E & Audit PageSpeed CWV (16.4) :done, s16_4, 2026-09-30, 2026-09-30

    section Sprint 17 : Urgences Vitales CRO & SEO
    Correction Tarifs 3x & Checkout (17.1)   :active, s17_1, 2026-10-03, 2026-10-04
    Redirections HTTP 301 Apache (17.2)      :active, s17_2, 2026-10-03, 2026-10-04
    Retrait Canonical article.html (17.3)    :active, s17_3, 2026-10-03, 2026-10-04
    CTA Hero workshops.html (17.4)           :active, s17_4, 2026-10-03, 2026-10-04
    Nettoyage Pack Unique thanks.html (17.5) :active, s17_5, 2026-10-03, 2026-10-04

    section Sprint 18 : Optimisation StratÃ©gique & IA
    JSON-LD Schema Course & FAQPage (18.1)   :s18_1, 2026-10-05, 2026-10-08
    Order Bump HTML Mentorat (18.2)          :s18_2, 2026-10-05, 2026-10-09
    Preuve Sociale & Avis RÃ©els (18.3)       :s18_3, 2026-10-06, 2026-10-09
    Macaron Garantie 14 Jours (18.4)         :s18_4, 2026-10-07, 2026-10-10

    section Sprint 19 : Architecture Statique & SSG
    Build Script SSG Header/Footer (19.1)    :s19_1, 2026-10-12, 2026-10-20
    GÃ©nÃ©ration Physique Blog /blog/ (19.2)   :s19_2, 2026-10-15, 2026-10-25
    CohÃ©rence DÃ©terministe Sitemap (19.3)    :s19_3, 2026-10-20, 2026-10-28
    section Phase 3 (Architecture & Déploiement)
    Sprint 20 (Urgences & Sécurité) :active, sp20, 2026-10-07, 2d
    Sprint 21 (Modèle Métier)       :sp21, after sp20, 3d
    Sprint 22 (Dette Technique)     :sp22, after sp21, 5d
    Sprint 23 (Idempotence & Infra) :sp23, after sp22, 2d
    Sprint 24 (Qualité & CI/CD)     :sp24, after sp23, 3d
    Sprint 25 (Sécurité & Idempotence):done, sp25, 2026-10-08, 1d
    Sprint 26 (E2E, CORS & Nettoyage) :done, sp26, 2026-10-09, 1d
```

---

## ðŸ“‹ DÃ©tail des Sprints

### Sprint 1 : SÃ©curitÃ© du Paywall Serveur & Webhook Stripe (TerminÃ©)
- **1.1 Validation HMAC Webhook Stripe** (`PaymentController.java`) : Validation cryptographique du header `Stripe-Signature` avec tolÃ©rance anti-rejeu.
- **1.2 Paywall Serveur sur Chapitres & Contenus** (`ChapterController.java`, `ContentController.java`) : VÃ©rification stricte des inscriptions `PAID`.
- **1.3 Purge de la faille client** (`cours.js`, `dashboard.js`) : Ã‰limination de `noseum_payments` dans le localStorage.

---

### Sprint 2 : MonÃ©tisation RÃ©elle & Tunnel Stripe Checkout (TerminÃ©)
- **2.1 IntÃ©gration du SDK Stripe** : `com.stripe:stripe-java` dans `backend/pom.xml` via architecture Ports/Adapters (`StripeGateway`).
- **2.2 Endpoint Checkout Session** (`POST /api/payments/create-checkout-session`) : Session Stripe Embedded Checkout avec mode `payment`.
- **2.3 ModÃ¨le Ã‰conomique & Catalogue** (`Course.java`, Flyway migration V011) : Tarifs, slugs, devises, publication.

---

### Sprint 3 : Comptes Apprenants & E-mails Transactionnels (TerminÃ©)
- **3.1 Fournisseur Mail Transactionnel Brevo** : IntÃ©gration des templates e-mail transactionnels.
- **3.2 Flux Mot de Passe OubliÃ©** : Endpoints `POST /api/auth/forgot-password` et `POST /api/auth/reset-password` avec hachage SHA-256 du token (Flyway V012).
- **3.3 Refresh Token Rotation (RTR)** : Persistance PostgreSQL hachÃ©e SHA-256 avec rotation automatique sur 7 jours.
- **3.4 SÃ©curitÃ© OWASP** : Filtre de Rate Limiting (15 req/min par IP, HTTP 429) et validation stricte des mots de passe.

---

### Sprint 4 : Quick Wins Conversion, DÃ©blocage Leads & LÃ©gal (TerminÃ©)
- **4.1 RÃ©paration des CTA du Hero** (`frontend/index.html`) :
  - Bouton 1 : *"Go coder"* âž” Redirection fluide vers `cours.html`.
  - Bouton 2 : *"Teste et kiffe !"* âž” Ouverture directe de la modale des sessions dÃ©couvertes pour rÃ©server sa place.
- **4.2 DÃ©blocage CSP HubSpot & StratÃ©gie Lead Magnet** (`frontend/.htaccess`, `popover-hubspot.js`) :
  - Autoriser `https://js-eu1.hsforms.net` et `https://forms-eu1.hsforms.com` dans `script-src`, `connect-src`, `frame-src`.
  - Configuration de l'envoi du programme de formation par e-mail automatique pour forcer des e-mails qualifiÃ©s.
- **4.3 SÃ©curisation de `thanks.html` et des PDFs** :
  - Ajout de `<meta name="robots" content="noindex, nofollow">` sur `thanks.html`, `dashboard.html`, `reset-password.html`.
  - Retrait des pages privÃ©es du `sitemap.xml`.
  - Correction du bouton Git & GitHub dans `thanks.html` (qui tÃ©lÃ©chargeait le PDF JavaScript par erreur).
- **4.4 Pages LÃ©gales & ConformitÃ© RGPD** :
  - CrÃ©ation de `mentions-legales.html`, `cgv.html`, `politique-confidentialite.html`.
  - Remplacement des liens factices du footer.
  - Retrait des boutons sociaux non implÃ©mentÃ©s (Facebook, GitHub auth) du formulaire de connexion/inscription.

---

### Sprint 5 : Portail Client Stripe (Factures & Abonnements) (TerminÃ©)
- **5.1 API Backend Stripe Customer Portal** (`PaymentController.java`, `PaymentService.java`, `StripeGatewayImpl.java`) :
  - Endpoint sÃ©curisÃ© `POST /api/payments/create-customer-portal-session` protÃ©gÃ© par JWT.
  - RÃ©solution automatique du Customer Stripe par email (crÃ©ation Ã  la volÃ©e si inexistant).
  - GÃ©nÃ©ration de session `com.stripe.model.billingportal.Session` avec URL de retour vers le tableau de bord NoSeumCode.
- **5.2 AccÃ¨s Rapide Header Apprenant** (`frontend/dashboard.html`) :
  - Bouton interactif Â« Factures Â» avec icÃ´ne SVG dans la barre d'outils utilisateur.
- **5.3 Carte Facturation Espace Apprenant** (`frontend/dashboard.html`, `frontend/js/dashboard.js`) :
  - Section dÃ©diÃ©e Â« Facturation & Abonnements Â» intÃ©grÃ©e dans la vue Apprenant.
  - Bouton de redirection vers le portail officiel Stripe avec gestion du loading state et feedback en cas d'erreur.

---

### Sprint 6 : Workshops Gratuits Toussaint (Acquisition & Preuves VidÃ©os)
- **6.1 Bandeau Header DÃ©roulant** (`frontend/partials/header.html`) :
  - DÃ©commenter et rÃ©activer le bandeau supÃ©rieur de promotion des ateliers dÃ©couvertes gratuits.
- **6.2 Page dÃ©diÃ©e Workshops** (`frontend/workshops.html`) :
  - PrÃ©sentation des ateliers live dÃ©couvertes (HTML/CSS & JavaScript) de 2h pendant les vacances.
- **6.3 Gestion de la Jauge & Inscription** :
  - Limite stricte de 6 participants maximum par session d'atelier.
  - RÃ©servation rattachÃ©e au compte Ã©tudiant et synchronisÃ©e avec le dashboard.

---

### Sprint 7 : Nouvelle Gamme & AccÃ¨s Cohortes (Starter, Web, VIP & Klarna) (TerminÃ©)
- **7.1 Nettoyage Catalogue & ModÃ¨le Ã‰conomique** :
  - Suppression dÃ©finitive des faux cours d'essai (Java 21 Ã  49 â‚¬ et Clean Architecture Ã  69 â‚¬).
  - CrÃ©ation de la gamme : **Pack Starter** (DÃ©couverte & Fondations - 6 semaines) et **Pack Web** (Parcours complet interactif).
  - Option **Mentorat VIP** : Pack Web + 4 sessions individuelles d'1h planifiÃ©es avec le formateur.
- **7.2 ModÃ©lisation Backend & RÃ¨gle des Replays** :
  - EntitÃ© `Cohort` et type de souscription dans `Enrollment`.
  - **Les Ã©lÃ¨ves Starter conservent l'accÃ¨s Ã  vie aux replays de leur tronc commun (HTML/CSS/Git)**.
  - Verrouillage automatique cÃ´tÃ© backend des sessions live et des replays des modules avancÃ©s (JavaScript, API, CI/CD) pour les Ã©lÃ¨ves Starter.
- **7.3 IntÃ©gration Klarna (BNPL)** :
  - Activation de Klarna via Stripe Checkout pour le paiement fractionnÃ© en 3x/4x sans risque d'impayÃ© (fonds garantis par Klarna).

---

### Sprint 8 : Performance Web & SEO Technique (TerminÃ©)
- **8.1 Compression Drastique des Images** :
  - Remplacement du faux `git.webp` (2,73 Mo) par un vrai WebP compressÃ© (<100 Ko).
  - Optimisation des logos PNG (`logo-css`, `logo-react`, `logo-js`) et du favicon (passage de 10 Mo au total Ã  <800 Ko).
- **8.2 Pages Statiques Formations & MÃ©tadonnÃ©es Dynamiques** :
  - Fichiers HTML statiques dÃ©diÃ©s pour chaque offre (`/formations/starter.html`, `/formations/pack-web.html`).
  - Balises Open Graph rÃ©elles (1200x630 px) et donnÃ©es structurÃ©es Schema.org `Course`.
- **8.3 Optimisation Core Web Vitals & Cache Apache** :
  - Hauteur rÃ©servÃ©e au conteneur `#header-placeholder` pour Ã©liminer le CLS.
  - Directives de compression `mod_deflate` / Brotli et expiration de cache pour WebP/AVIF/fonts dans `.htaccess`.

---

### Sprint 9 : Refonte Copywriting & Rassurance Parents/Jeunes (TerminÃ©)
- **9.1 Repositionnement du Message & Hero** :
  - Titre : *"Apprendre Ã  coder en construisant de vrais projets"*.
  - Double discours : cool et valorisant pour les 16-25 ans, structurÃ© et rassurant pour les parents (cours en direct, petits groupes de 6, 2h cours + 2h atelier projet par semaine).
- **9.2 Section "Ton Mentor"** :
  - PrÃ©sentation de CÃ©dric, son parcours technique, sa pÃ©dagogie active et humaine.
- **9.3 Analytics Conforme RGPD & Cookieless** :
  - IntÃ©gration de Plausible ou Umami (lÃ©ger, respectueux de la vie privÃ©e, sans bandeau cookie intrusif).
  - Mesure des conversions (clics CTA, soumissions HubSpot, checkouts Stripe).

---

### Sprint 10 : Optimisation PageSpeed & Core Web Vitals (TerminÃ©)
- **10.1 DÃ©ferrement & Suppression Tiers Bloquants** :
  - Retrait du SDK Stripe (`js.stripe.com/v3/`) de la page d'accueil `index.html` (-278 Ko, -3 150 ms de blocage thread principal, Ã©limination des alertes de cache TTL tiers).
  - Chargement dynamique de Stripe conditionnÃ© Ã  `parcours.html` ou Ã  l'ouverture du modal de paiement.
- **10.2 Ã‰limination des Ressources Bloquant le Rendu** :
  - Ajout de l'attribut `defer` sur tous les scripts de la page d'accueil (`header.js`, `script.js`, `popover-hubspot.js`).
  - Minification de `header.js` (14,3 Ko) dans le script de build.
- **10.3 Ã‰radication ComplÃ¨te du CLS (0.175 âž” 0.00)** :
  - Calibrage strict de la hauteur rÃ©servÃ©e pour `#header-placeholder` (desktop 153px, mobile 118px) pour Ã©liminer l'affaissement brutal du Hero au chargement du DOM.
  - Remplacement de l'animation non-composÃ©e `background-position-x` (`gradientShift` sur `.gradient-text`) par une animation accÃ©lÃ©rÃ©e matÃ©riellement sur GPU (`transform` ou pseudo-Ã©lÃ©ment `opacity`).
- **10.4 Optimisation du Waterfall RÃ©seau & Images** :
  - ParallÃ©lisation du chargement des partials (`header.html`, `footer.html`, `popovers-shared.html`) via `Promise.all()`.
  - Redimensionnement du logo en SVG/WebP natif 141x105 (<5 Ko au lieu du 320x239 de 28 Ko).
  - Rapatriement local et compression WebP des 3 visuels Unsplash avec attributs `width="400"`, `height="300"`, `loading="lazy"` et `decoding="async"`.

---

### Sprint 11 : IntÃ©gration Discord & Automatisation RÃ´les CommunautÃ© (TerminÃ©)
- **11.1 Scopes OAuth2 Discord & ModÃ¨le de DonnÃ©es** :
  - Configuration des scopes `identify`, `email`, `guilds.join` dans `application.properties`.
  - Migration Flyway `V016__add_discord_integration_fields_to_users.sql` : colonnes `discord_user_id`, `discord_username`, `discord_avatar`, `discord_linked_at` avec index sur `discord_user_id`.
  - EntitÃ© `User` et `UserRepository.findByDiscordUserId` pour recherche rapide et contrÃ´le d'unicitÃ©.
- **11.2 Architecture Hexagonale Ports/Adapters (`DiscordGateway`)** :
  - Port `DiscordGateway` et adaptateur `DiscordGatewayImpl` utilisant Spring `RestClient` pour communiquer avec l'API Discord v10.
  - AdhÃ©sion automatique au serveur (`PUT /guilds/{guildId}/members/{userId}`) via bot token et user access token.
  - Attribution et rÃ©vocation unitaire de rÃ´les (`PUT / DELETE /guilds/{guildId}/members/{userId}/roles/{roleId}`).
  - Mode simulation gracieuse non-bloquant lorsque les identifiants Discord ne sont pas configurÃ©s (profils dev / CI).
- **11.3 Synchronisation Dynamique des RÃ´les & Pipeline de Paiement** :
  - `DiscordService` : logique de liaison avec anti-collision (OWASP ASVS), dÃ©liaison sÃ©curisÃ©e, et calcul hiÃ©rarchique cumulatif des rÃ´les (VIP, Web, Starter, Membre).
  - CÃ¢blage direct dans `PaymentService` lors de la complÃ©tion d'un achat Stripe (webhook et secours `confirm-session`).
  - Flux OAuth2 Ã©tendu : capture de `link_token` JWT transitoire pour lier un compte connectÃ© sans dÃ©connexion.
- **11.4 Tableau de Bord Apprenant & Actions Utilisateur** :
  - Barre d'outils header : bouton interactif Discord avec statut visuel (connectÃ© / dÃ©connectÃ©).
  - Section dÃ©diÃ©e dans `dashboard.html` : carte Discord Cyber Dark affichant le tag Discord, l'avatar, les badges de rÃ´les actifs, bouton de synchronisation manuelle, et dissociation en 1 clic.
  - Toasts d'information clairs lors de la liaison, dÃ©liaison et synchronisation.

---

### Sprint 12 : Optimisations Web Performance, BFCache & Cache Apache (TerminÃ©)
- **12.1 DÃ©blocage BFCache sur Apache (`.htaccess`)** :
  - Remplacement de `no-store` par `no-cache, must-revalidate` sur les fichiers HTML pour dÃ©bloquer la restauration instantanÃ©e (0 ms) en mÃ©moire vive lors des navigations PrÃ©cÃ©dent/Suivant, tout en garantissant la fraÃ®cheur du contenu via revalidation HTTP 304.
  - Ã‰limination de la transmission de l'en-tÃªte `no-store` sur les requÃªtes partielles (`fetch("partials/*.html")`).
- **12.2 Extension du Cache Statique CSS/JS & Versioning d'Assets** :
  - Alignement de la directive `Cache-Control` sur 1 an (`max-age=31536000, public`) pour les fichiers CSS et JS dans `.htaccess` (rÃ©solution de l'audit Lighthouse Â« Serve static assets with an efficient cache policy Â»).
  - ImplÃ©mentation du versioning systÃ©matique par query string (`?v=sprint12`) sur les balises de styles et de scripts dans tous les fichiers HTML du frontend.
  - Priorisation du tÃ©lÃ©chargement du CSS critique `homepage.min.css` en tÃªte du `<head>`.
- **12.3 AllÃ¨gement des Web Fonts & Ã‰radication des 404** :
  - Ã‰lagage des graisses superflues de Poppins (`300` et `500`) pour ne charger que `wght@400;600;700` et `Bangers` (gain estimÃ© : ~35-40 Ko).
  - Nettoyage des appels de scripts inexistants (`js/footer.js` dans `workshops.html`, `js/popovers.js` dans les pages de formations remplacÃ© par `js/popover-hubspot.min.js`).

---

> ðŸ“– **SpÃ©cifications DÃ©taillÃ©es & Textes ValidÃ©s (Sprints 13 Ã  16)** :  
> L'ensemble des textes validÃ©s, blocs HTML prÃªts au copier-coller, JSON Stripe, CSP et matrice de mots-clÃ©s sont consignÃ©s dans [`docs/specs/2026-09-briefing-offres-seo-copywriting.md`](file:///d:/Archive-mac/dev/code-bangers/docs/specs/2026-09-briefing-offres-seo-copywriting.md).

### Sprint 13 : Socle Technique, SÃ©curitÃ© Serveur & Assainissement des Assets (TerminÃ©)
- **13.1 DÃ©blocage CSP HubSpot & Directives de Cache Apache (`frontend/.htaccess`)** :
  - Mise Ã  jour stricte du Content-Security-Policy autorisant l'affichage et la soumission du popover HubSpot sans erreur bloquante en console :
    - `script-src` : ajout de `https://js.stripe.com`, `https://js-eu1.hsforms.net`, `https://js.hsforms.net`.
    - `frame-src` : `https://js.stripe.com`, `https://hooks.stripe.com`, `https://forms.eu1.hsforms.com`, `https://forms.hubspot.com`.
    - `connect-src` : `https://api.stripe.com`, `https://api.hsforms.com`, `https://forms.hubspot.com`.
    - `img-src` : `https://*.stripe.com`, `https://forms.hubspot.com`.
  - ComplÃ©tion des rÃ¨gles `mod_expires` pour le cache Ã  1 an (`access plus 1 year`) sur `image/webp`, `image/avif`, `image/svg+xml` et `font/woff2`.
- **13.2 HygiÃ¨ne SEO Technique (`frontend/robots.txt` & `frontend/sitemap.xml`)** :
  - `robots.txt` : interdiction formelle d'exploration des pages privÃ©es, documents et donnÃ©es transactionnelles (`Disallow: /dashboard.html`, `Disallow: /thanks.html`, `Disallow: /success.html`, `Disallow: /reset-password.html`, `Disallow: /documents/`, `Disallow: /data/`), maintien de `Allow: /` et dÃ©claration sitemap.
  - `sitemap.xml` : suppression de `/dashboard.html` et correction canonique de la racine (`<loc>https://noseumcode.fr/</loc>` au lieu de `index.html`).
- **13.3 Compression Lourde des Assets Graphiques & Favicon (Gain > 5 Mo)** :
  - Remplacement de `frontend/images/courses/git.webp` (2,73 Mo) et `frontend/images/courses/javascript.webp` (1,52 Mo) par de vraies images WebP compressÃ©es Ã  75% de qualitÃ© (taille cible : 45 Ã  65 Ko).
  - Remplacement de `frontend/images/favicon.png` (235 Ko) par une icÃ´ne optimisÃ©e (<15 Ko).
- **13.4 CrÃ©ation des Pages LÃ©gales & ConformitÃ© RGPD (`frontend/mentions-legales.html`, `cgv.html`, `confidentialite.html`)** :
  - CrÃ©ation des 3 pages lÃ©gales complÃ¨tes : Mentions LÃ©gales (Ã‰diteur, SIRET, hÃ©bergeur o2switch), CGV (Tarifs 3 packs, droit de rÃ©tractation 14 jours, mÃ©diation de la consommation), Politique de ConfidentialitÃ© (RGPD, Stripe, Brevo).
  - Mise Ã  jour des liens du pied de page (`frontend/partials/footer.html`) pour pointer vers ces pages rÃ©elles au lieu d'ancres `index.html`.

---

### Sprint 14 : Nouvelle Architecture des Offres (Les 3 Packages) & Refonte Navigation (TerminÃ©)
- **14.1 ModÃ©lisation Catalogue des 3 Packages (`frontend/js/cours.js` & Backend Stripe)** :
  - Abandon de la vente Ã©clatÃ©e au profit de 3 Packages progressifs :
    - `pack-starter` : 89 â‚¬ (8900 cts), slug `pack-starter`, niveau `DEBUTANT`, Stripe `price_starter_89`, 4 modules (HTML5, CSS3, Flexbox/Grid, Responsive), 2 projets portfolio, non-mentorÃ©.
    - `pack-web-pro` : 179 â‚¬ (17900 cts) ou 2x 95 â‚¬ sans frais, slug `pack-web-pro`, niveau `INTERMEDIAIRE`, Stripe `price_webpro_179`, Starter + JS ES6+, DOM, Fetch/Async + Bonus Git & GitHub offert, 6 projets.
    - `pack-mentorat-vip` : 389 â‚¬ (38900 cts) ou 3x 135 â‚¬ sans frais, slug `pack-mentorat-vip`, niveau `ACCOMPAGNE`, Stripe `price_vip_389`, Web Pro + 4h visio One-to-One, revue de code, coaching CV/GitHub, salon Discord VIP privÃ©, 10 places/mois.
  - VÃ©rification de l'API Stripe Checkout backend et de `PaymentService` pour mapper ces nouveaux IDs de prix et supporter les Ã©chÃ©anciers sans frais.
- **14.2 Harmonisation SÃ©mantique & Page Catalogue (`frontend/parcours.html` / `cours.html`)** :
  - Bannissement des termes vieillots ou acadÃ©miques (Â« Cursus Â», Â« Formations Â», Â« Nos cours Â») au profit de Â« Nos Parcours Â» ou Â« Nos Packs Â».
  - Rendu dynamique ou statique des 3 fiches de formation avec badges de clartÃ©, mise en valeur du Pack Web Pro (RecommandÃ©) et options de paiement fractionnÃ©.
- **14.3 Navigation Principale & Parcours Utilisateur (`frontend/partials/header.html` & `header.js`)** :
  - Alignement des liens du menu principal : Accueil (`index.html`), Nos Parcours (`index.html#parcours`), La MÃ©thode (`index.html#services`), FAQ (`index.html#faq`).
  - Boutons d'action harmonisÃ©s : Bouton secondaire Â« Se connecter Â» et bouton primaire Â« TÃ©lÃ©charger le programme Â».

---

### Sprint 15 : Refonte Copywriting Homepage & Optimisation SÃ©mantique SEO (TerminÃ©)
- **15.1 MÃ©tadonnÃ©es SEO `<head>` & Cocon SÃ©mantique (`frontend/index.html`)** :
  - Balise `<title>` : `NoSeumCode | Apprends le DÃ©veloppement Web Sans le Seum (HTML, CSS, JS)`.
  - Meta description orientÃ©e bÃ©nÃ©fices rÃ©els (de zÃ©ro aux premiers sites web en ligne, projets concrets, mentorat direct, garantie 14 jours).
  - Balise canonique `https://noseumcode.fr/` et mÃ©tadonnÃ©es Open Graph complÃ¨tes (`og:image`, `og:title`, `og:description`, `og:url`).
  - IntÃ©gration de la matrice sÃ©mantique : short-tail (*apprendre Ã  coder*, *cours javascript*, *cours html css*, *crÃ©er son site web*, *formation git github*), middle-tail et long-tail.
- **15.2 Refonte Hero & Trustbar Preuve Sociale (`frontend/index.html`)** :
  - Tag : `<span class="section-tag">Formations Web DÃ©butant & IntermÃ©diaire</span>`.
  - H1 percutant : `Apprends Ã  coder pour de vrai. <span class="gradient-text">Sans le seum.</span>`.
  - Paragraphe sous-titre anti-thÃ©orie et boutons CTA directs (*Voir les 3 Packs d'Apprentissage â†“* vers `#parcours`, *TÃ©lÃ©charger le Programme (PDF)* via popover HubSpot).
  - Puces de rassurance immÃ©diate : *âœ“ Projets 100% pratiques â€¢ âœ“ AccÃ¨s Ã  vie aux mises Ã  jour â€¢ âœ“ Garantie 14 jours satisfait ou remboursÃ©*.
  - Nouvelle Trustbar des technologies maÃ®trisÃ©es : HTML5 SÃ©mantique, CSS3 & Flexbox, JavaScript ES6+, Git & GitHub, VS Code, Responsive Design.
- **15.3 Section Â« La MÃ©thode NoSeumCode Â» & Abandon du Double Regard** :
  - Suppression de la scission artificielle en deux colonnes Â« Pour toi le jeune Â» vs Â« Pour vous les parents Â». Voix unique directe, jeune, tutoyante et orientÃ©e crÃ©ation.
  - DÃ©ploiement des 3 piliers :
    1. *ZÃ©ro thÃ©orie inutile, 100% de crÃ©ation* (outils pro dÃ¨s la premiÃ¨re heure, interfaces rÃ©elles).
    2. *Des projets que tu seras fier de montrer* (code en ligne, Git/GitHub, portfolio recruteurs/clients).
    3. *Un mentor et une communautÃ© Ã  tes cÃ´tÃ©s* (Discord privÃ©, support rÃ©actif, zÃ©ro blocage).
- **15.4 Section Offres : Grille des 3 Packages (`#parcours`)** :
  - Remplacement de l'ancienne section `#courses` par l'ID `#parcours` avec balisage exact :
    - *Pack Starter (89 â‚¬)* : Tag Â« IdÃ©al DÃ©butant Â», liste Ã  puces, bouton `initiateCourseEnrollment('pack-starter')`.
    - *Pack Web Pro (179 â‚¬)* : Tag Â« Le Plus Populaire Â» (featured bordure verte), mention Â« ou 2x 95 â‚¬ Â», bonus Git/GitHub offert, bouton `initiateCourseEnrollment('pack-web-pro')`.
    - *Pack Mentorat VIP (389 â‚¬)* : Tag Â« 10 Places / Mois Â», mention Â« ou 3x 135 â‚¬ Â», 4h mentorat visio 1-to-1, revue de code, salon Discord VIP privÃ©.
- **15.5 Section FAQ Anti-Objections (6 Questions Cibles)** :
  - Remplacement des questions actuelles par les 6 rÃ©ponses levant les freins rÃ©els :
    1. Jamais codÃ© de ma vie / dÃ©butant complet.
    2. Faut-il Ãªtre bon en maths (dÃ©mystification).
    3. DurÃ©e d'accÃ¨s aux cours (accÃ¨s Ã  vie et mises Ã  jour gratuites).
    4. Rassurance parents (financement parent + email Ã©lÃ¨ve, environnement sÃ©curisÃ© et encadrÃ©).
    5. Garantie 14 jours satisfait ou remboursÃ©.
    6. ModalitÃ©s du paiement en plusieurs fois sans frais (2x et 3x via Stripe).

---

### Sprint 16 : Tunnel Lead Magnet, Onboarding Apprenant & Cocon Blog (TerminÃ©)
- **16.1 Optimisation Lead Magnet & Upsell Doux (`frontend/thanks.html`)** :
  - MÃ©tadonnÃ©es `<meta name="robots" content="noindex, nofollow">` et titre optimisÃ©.
  - RÃ©paration des 4 liens de tÃ©lÃ©chargement de documents PDF : `documents/programme-complet.pdf` (suppression de l'espace), `documents/Cours-HTML-CSS.pdf`, `documents/Premiers-pas-avec-JavaScript.pdf`, `documents/git&github.pdf` (lien rÃ©parÃ©).
  - IntÃ©gration de la boÃ®te d'upsell doux sous la grille (*Envie de passer directement Ã  la pratique ? Rejoins nos parcours dÃ¨s 89 â‚¬*).
- **16.2 Onboarding Post-Achat & RÃ©assurance ImmÃ©diate (`frontend/success.html`)** :
  - MÃ©tadonnÃ©es `<meta name="robots" content="noindex, nofollow">` et titre de confirmation.
  - SÃ©quence d'accueil en 3 Ã©tapes :
    1. AccÃ¨s Ã  l'espace Ã©tudiant (dashboard).
    2. Rejoindre la communautÃ© Discord (`#nouveaux-Ã©lÃ¨ves`).
    3. Configuration de l'Ã©diteur VS Code en moins de 10 minutes.
  - Boutons d'action prioritaires vers le tableau de bord et Discord.
- **16.3 Structure & Gabarit du Cocon SÃ©mantique Blog (`frontend/article.html`)** :
  - ModÃ¨le d'article de blog responsive et sÃ©mantique avec balisage Schema.org `Article`.
  - IntÃ©gration de la matrice de mots-clÃ©s : requÃªtes pratiques apprenants (portfolio dÃ©butant, maths & code) et requÃªtes cibles parents/lycÃ©ens (spÃ©cialitÃ© NSI, orientation numÃ©rique).
  - EncadrÃ© d'appel Ã  l'action contextuel vers les packs et le tÃ©lÃ©chargement du programme.
- **16.4 Plan de Test Global, Recette & Audit Core Web Vitals** :
  - Test Formulaire HubSpot : popover sans erreur CSP console et rÃ©ception effective de l'email.
  - Test TÃ©lÃ©chargements : validation HTTP 200 sur les 4 fichiers PDF dans `documents/`.
  - Test Tunnel Stripe : vÃ©rification des montants transmis (89 â‚¬, 179 â‚¬, 389 â‚¬) pour chaque session Stripe Checkout.
  - Audit PageSpeed & Mobile CWV : validation LCP < 2,5s sur mobile, CLS ~0.00 et persistance BFCache.

---

> ðŸ“– **SpÃ©cifications DÃ©taillÃ©es (Sprints 17 Ã  19)** :  
> Le cahier des charges dÃ©taillÃ© couvrant les 3 phases d'urgence, d'optimisation IA et d'architecture statique est consignÃ© dans [`docs/specs/2026-10-urgences-cro-seo-architecture.md`](file:///d:/Archive-mac/dev/code-bangers/docs/specs/2026-10-urgences-cro-seo-architecture.md).

### Sprint 17 : Urgences Vitales CRO & SEO (24h)
- **17.1 Correction de la Grille Tarifaire 3x & Stripe Checkout (`cours.js`, `starter.html`, `pack-web.html`)** :
  - Ã‰limination de l'anomalie oÃ¹ le paiement fractionnÃ© 3x est moins cher que le paiement comptant (Starter Ã  299 â‚¬ comptant vs 3x 99 â‚¬ = 297 â‚¬ ; Web Pro Ã  449 â‚¬ comptant vs 3x 149 â‚¬ = 447 â‚¬).
  - Alignement sur la grille rÃ©visÃ©e avec frais de fractionnement standard : Pack Starter Ã  299 â‚¬ comptant ou 3x 109 â‚¬ (327 â‚¬) ; Pack Web Pro Ã  449 â‚¬ comptant ou 3x 160 â‚¬ (480 â‚¬).
  - Synchronisation des libellÃ©s dans le HTML, des attributs de donnÃ©es `data-price-installments`, et de la crÃ©ation de session Stripe Checkout / Klarna.
- **17.2 Suppression des Redirections Meta Refresh & Configuration HTTP 301 Apache (`frontend/.htaccess`, `cours.html`, `course.html`)** :
  - Suppression dÃ©finitive des balises parasites `<meta http-equiv="refresh" content="...">` dans `cours.html` et `course.html`.
  - Configuration de redirections HTTP 301 dÃ©terministes cÃ´tÃ© serveur dans `.htaccess` vers `/parcours` afin de prÃ©server 100% du jus SEO (PageRank) et Ã©viter les pÃ©nalitÃ©s d'indexation.
- **17.3 Ã‰radication de la Balise Canonical Suicidaire sur le Blog (`frontend/article.html`)** :
  - Retrait immÃ©diat de la balise `<link rel="canonical" href="https://noseumcode.fr/article.html">` qui ordonne aux robots d'indexation de dÃ©sindexer tous les articles de blog individuels servis dynamiquement.
- **17.4 IntÃ©gration du Bouton d'Action Hero sur la Page Workshops (`frontend/workshops.html`)** :
  - Ajout d'un bouton CTA direct et contrastÃ© au-dessus de la ligne de flottaison (above-the-fold) sans nÃ©cessiter de dÃ©filement, renvoyant directement vers le sÃ©lecteur d'atelier ou l'inscription.
- **17.5 Nettoyage du Tunnel Lead Magnet & Focalisation Offre (`frontend/thanks.html`)** :
  - Fusion des 4 boutons de tÃ©lÃ©chargement dispersÃ©s en un seul pack ressource tÃ©lÃ©chargeable (Â« TÃ©lÃ©charger le Pack Complet des Guides DÃ©veloppeur (ZIP/PDF) Â»).
  - Utilisation de l'espace libÃ©rÃ© pour mettre en avant l'offre commerciale principale avec un appel Ã  l'action d'inscription fort.

---

### Sprint 18 : Optimisation StratÃ©gique, IA & AEO (1 semaine)
- **18.1 DonnÃ©es StructurÃ©es JSON-LD Course & FAQPage (`frontend/index.html`)** :
  - ImplÃ©mentation du balisage Schema.org `Course` pour le Pack Starter et le Pack Web Pro avec instructeur, offre tarifaire et compÃ©tences visÃ©es.
  - Ajout du balisage Schema.org `FAQPage` exhaustif sur les questions/rÃ©ponses de la section FAQ pour maximiser l'Ã©ligibilitÃ© aux moteurs de rÃ©ponse IA (Perplexity, ChatGPT, Claude) et Google AI Overviews.
- **18.2 Refonte UX du Suivi Mentor en Order Bump HTML (`index.html`, `starter.html`, `pack-web.html`)** :
  - Retrait de l'offre mentorat de la grille tarifaire principale pour simplifier le choix de premier niveau.
  - ImplÃ©mentation sous forme d'**Order Bump** (case Ã  cocher +199 â‚¬) directement visible avant le paiement.
  - Contrainte technique stricte : Balisage HTML initial complet (pilotÃ© par formulaires et CSS), sans injection JavaScript tardive, pour garantir la lisibilitÃ© et l'indexation par les crawlers.
- **18.3 Activation de la Section Preuve Sociale & TÃ©moignages RÃ©els (`frontend/index.html`)** :
  - DÃ©commenter et structurer la section "Preuve Sociale" en remplacement des simples logos d'outils pros.
  - IntÃ©gration de retours apprenants authentiques, citations vÃ©rifiÃ©es et preuves de rÃ©ussite concrÃ¨tes issues de la communautÃ© Discord.
- **18.4 Valorisation Visuelle de la Garantie 14 Jours (`frontend/index.html`, `parcours.html`)** :
  - Extraction de la mention discrÃ¨te en bas de page pour la transformer en un macaron graphique massif et valorisant (Â« 14 Jours Satisfait ou RemboursÃ© Sans Question Â») positionnÃ© Ã  proximitÃ© immÃ©diate des boutons d'achat pour inverser le risque perÃ§u.

---

### Sprint 19 : Assainissement de l'Architecture & Rendu Statique SSG (1 mois)
- **19.1 Ã‰radication du Client-Side Rendering (CSR) Header/Footer via Script de Build Node.js** :
  - Remplacement de l'injection JavaScript asynchrone (`<div id="header-placeholder">` / `header.js`) par une compilation statique locale.
  - Mise en place d'un script de build Node.js lÃ©ger (`build-static.js`) fusionnant `header.html`, le contenu de chaque page et `footer.html` en fichiers HTML statiques complets avant dÃ©ploiement.
  - Conservation de l'architecture Vanilla sans dÃ©pendance Ã  un framework lourd (Next.js/Astro) tout en garantissant une visibilitÃ© 100% immÃ©diate pour les crawlers de recherche.
- **19.2 Rendu Statique DÃ©diÃ© du Blog (SSG Blog / Fiches Physiques)** :
  - Ã‰limination du modÃ¨le `article.html?id=...` non indexable au profit de pages physiques gÃ©nÃ©rÃ©es pour chaque article (ex: `/blog/apprendre-a-coder-debutant.html`).
  - Chaque fichier gÃ©nÃ©rÃ© intÃ¨gre son contenu textuel en dur dans le DOM, des balises `<title>`, `<meta description>`, Open Graph et donnÃ©es structurÃ©es Schema.org `BlogPosting` uniques.
- **19.3 CohÃ©rence DÃ©terministe du Sitemap & Routage (`frontend/sitemap.xml`, `frontend/.htaccess`)** :
  - Alignement rigoureux des URLs dÃ©clarÃ©es dans le sitemap avec l'arborescence des fichiers statiques rÃ©ellement servis.
  - Harmonisation des rÃ¨gles de rÃ©Ã©criture d'URL Apache pour garantir des URLs propres sans extension `.html` sans rupture de liens.





---

### Sprint 20 : Urgences DÃ©ploiement & SÃ©curitÃ© Infrastructure (P0)
- **20.1 Correction du Build Docker (`backend/dockerfile`, `docker-compose.yml`)** :
  - Renommer le fichier `backend/dockerfile` en `backend/Dockerfile`.
  - S'assurer que le `docker-compose.yml` cible correctement le fichier en respectant la casse stricte de Linux.
  - Valider la rÃ©solution par un run de validation CI.
- **20.2 SÃ©curisation du Script de DÃ©ploiement (`.github/workflows/deploy.yml`)** :
  - Supprimer l'attribution du privilÃ¨ge `SUPERUSER` au rÃ´le PostgreSQL de l'application. Ne conserver que les droits standard de lecture/Ã©criture.
  - Retirer l'instruction `DELETE FROM flyway_schema_history WHERE success = false;`. Toute migration Ã©chouÃ©e doit Ãªtre corrigÃ©e manuellement.
- **20.3 Alignement CI/CD de la Base de DonnÃ©es (`.github/workflows/backend-ci.yml`)** :
  - Mettre Ã  jour l'image de base de la CI de `postgres:15` vers `postgres:16-alpine`.
- **20.4 Assainissement de l'Environnement Frontend (`frontend/.env.example`)** :
  - Ã‰liminer la variable `DATABASE_URL` du fichier modÃ¨le.
- **20.5 Structuration Typologique de la MÃ©moire IA (`docs/ai/`)** :
  - Ajouter un encart de contexte global forÃ§ant les agents IA Ã  considÃ©rer le code et les fichiers de configuration comme vÃ©ritÃ© technique absolue.
  - ImplÃ©menter les statuts d'Ã©tat (`CURRENT`, `ACCEPTED`, `SUPERSEDED`) sur l'ensemble de la documentation dÃ©cisionnelle.

---

### Sprint 21 : Consolidation du ModÃ¨le MÃ©tier & Idempotence Stripe (P1)
- **21.1 Ã‰radication des DonnÃ©es MÃ©tier en Dur (`PaymentService.java`, `StripeGatewayImpl.java`)** :
  - Extraire les prix codÃ©s en dur (29900L, 44900L) de l'implÃ©mentation Stripe.
  - Remplacer les appels d'instanciation manuelle d'UUID par des recherches via `slug` ou `code_produit`.
- **21.2 Idempotence Stricte des Webhooks Stripe (`StripeWebhookService.java`)** :
  - CrÃ©er la table PostgreSQL `stripe_event` via Flyway (colonnes : `id`, `stripe_event_id UNIQUE`, `type`, `processed_at`).
  - Bloquer toute exÃ©cution mÃ©tier si le `stripe_event_id` a dÃ©jÃ  Ã©tÃ© traitÃ©.
- **21.3 Durcissement CORS et Rate Limiting (`SecurityConfig.java`)** :
  - Substituer la politique CORS permissive de dÃ©veloppement Ã  une politique stricte pilotÃ©e par profil.
  - VÃ©rifier la bonne prise en charge de `X-Forwarded-For` avec la configuration de proxy Nginx.
- **21.4 Feuille de Route Auth : PrÃ©paration Migration JWT** :
  - RÃ©diger les spÃ©cifications pour la migration de la persistance du JWT (du `localStorage` vers un cookie `HttpOnly Secure SameSite`).

---

### Sprint 22 : RÃ©sorption de la Dette Technique & Architecture (P2)
- **22.1 DÃ©coupage des Classes Centrales de Paiement (`PaymentController.java`, `PaymentService.java`)** :
  - Scinder `PaymentController` en responsabilitÃ©s REST limitÃ©es : `CheckoutController`, `StripeWebhookController`, et `AdminPaymentController`.
  - Diviser `PaymentService` en sous-services dÃ©diÃ©s (`CheckoutService`, `EnrollmentProvisioningService`, `PaymentStatusService`).
- **22.2 RÃ©organisation Modulaire des Bounded Contexts** :
  - Aligner progressivement l'arborescence des packages Java sur les vÃ©ritables domaines d'affaires (`identity/`, `catalog/`, `commerce/`, `learning/`, `mentoring/`).
- **22.3 Fiabilisation de l'IntÃ©gration via Testcontainers** :
  - Introduire Testcontainers pour PostgreSQL dans le cycle de tests backend.
- **22.4 Architecture Modulaire du Frontend Vanilla** :
  - Structurer le rÃ©pertoire client sous la forme : `core/`, `features/` et `ui/`.


---

### Sprint 23 : Finalisation Idempotence Stripe & SÃ©curisation Infra (P0)
- **23.1 EntitÃ© et Repository StripeEvent** : Mapping JPA de la table `stripe_event`.
- **23.2 Logique d'idempotence Webhook** : Extraction de `event.id` du payload Stripe, vÃ©rification de non-existence en base avant traitement, et sauvegarde de l'Ã©vÃ©nement.
- **23.3 Assainissement du script de dÃ©ploiement** : Suppression du nettoyage Flyway (`DELETE FROM flyway_schema_history`) et du masquage d'erreur du healthcheck (`|| echo`).
- **23.4 RÃ©vocation des droits DBA applicatifs** : Ajustement des requÃªtes de crÃ©ation d'utilisateur dans le dÃ©ploiement pour n'octroyer que les permissions DML/DDL de base.
- **23.5 Protection des branches GitHub** : Activation des *Branch Protection Rules* sur `develop` et `main` (PR et CI obligatoires).

---

### Sprint 24 : QualitÃ©, CI/CD et ObservabilitÃ© (P1 & P2)
- **24.1 Nettoyage des scories du projet** : Suppression de `STRIPE_SECRET_KEY` du `.env.example` frontend et suppression des `.DS_Store` trackÃ©s via `git rm --cached`.
- **24.2 ImplÃ©mentation de Testcontainers** : Ajout de Testcontainers PostgreSQL pour les tests de la couche de persistance.
- **24.3 DÃ©coupage `PaymentController` et `PaymentService`** : Refactoring pour Ã©liminer les "God Classes" de la logique de paiement.
- **24.4 ObservabilitÃ© (Correlation ID)** : Mise en place d'un filtre interceptant ou gÃ©nÃ©rant un Request ID injectÃ© dans le contexte de log (MDC) pour toutes les requÃªtes entrantes.



---

### Sprint 25 : Sécurité Métier & Raccordement Idempotence Stripe (P0) (Terminé)
- **25.1 Contrôle d'accès Stripe Session** : Ajouter la validation `session.metadata.userId == JWT user.id` dans `confirm-session` pour prévenir l'usurpation d'achats.
- **25.2 Correction IDOR sur Inscriptions** : Sécuriser les accès et mises à jour du contrôleur d'enrollment (GET, PUT progress, POST). Un étudiant ne peut gérer que ses propres données.
- **25.3 Logique d'Idempotence Stripe Branchée** : Lier `StripeEventRepository` au webhook. Exploiter l'exception d'unicité (UK) comme verrou d'idempotence et ignorer les événements non supportés.
- **25.4 Suppression des UUID Legacy** : Retirer les constantes UUID hard-codées restantes de l'ancien `EnrollmentService`.

---

### Sprint 26 : Intégration E2E, CORS & Hygiène (P1/P2) (Terminé)
- **26.1 Playwright CI Gate** : Exécution automatique des tests E2E Playwright dans la chaîne GitHub Actions (`frontend-ci.yml`), configuration de `playwright test` dans `e2e/package.json` et rapport d'artefacts.
- **26.2 Durcissement Réseau (CORS & Auth)** : Ciblage du CORS en prod (`https://noseumcode.fr`, `https://www.noseumcode.fr`, interdiction formelle des wildcards et origines locales) + conception complète de l'architecture cookies `HttpOnly; Secure; SameSite=Lax` pour la transition JWT (ADR-023).
- **26.3 Nettoyage du Bruit Git** : Suppression des fichiers doublons corrompus (mojibake Mac/Windows) dans `frontend/data/` et `.github/instructions/`, réécriture de `rule-11` en nommage ASCII strict, et mise à jour de la description dans `pom.xml` vers Spring Boot 4.1 & Java 21.
