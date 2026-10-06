# DECISIONS.md

> **Statuts d'état** : Toute décision documentée ci-dessous doit porter une mention explicite de statut : [CURRENT] (actuelle/en vigueur), [ACCEPTED] (acceptée/en attente d'implémentation), ou [SUPERSEDED] (obsolète/remplacée).

 — NoSeumCode

_Last updated: 2026-09-16 | Conversation: e0c9f398-8522-470e-9df1-e11344331037_

---

## ADR-001 — JWT HS256 via Spring OAuth2 Resource Server
**Status**: Actif
**Décision**: Utiliser `NimbusJwtDecoder.withSecretKey()` avec `MacAlgorithm.HS256`.
**Alternative rejetée**: RS256 (asymétrique) — plus sécurisé mais complexité de gestion de paires de clés non justifiée pour un monolithe.
**Conséquence**: Le secret doit être fort (256 bits min) et géré via les secrets du serveur.

## ADR-002 — Stateless session (STATELESS)
**Status**: Actif
**Décision**: `SessionCreationPolicy.STATELESS` — aucune session HTTP côté serveur.
**Alternative rejetée**: Sessions Spring Security avec CSRF — complexifie le scale-out.
**Conséquence**: Pas de révocation de token facile. Nécessite une blacklist `jti` pour la sécurité complète.

## ADR-003 — OAuth2 callback JWT en URL fragment
**Status**: Actif mais **à reconsidérer** (voir ISSUE-009)
**Décision**: Après OAuth2 success, JWT envoyé en fragment URL `#token=...`.
**Alternative rejetée**: Cookie HttpOnly — complexité CORS avec le frontend statique.
**Conséquence**: JWT exposé dans l'historique navigateur. Risque si proxy logging activé.

## ADR-004 — Frontend Vanilla JS (pas de framework)
**Status**: Actif
**Décision**: HTML/CSS/JS pur, sans React/Vue/Angular.
**Alternative rejetée**: Next.js — overhead pour un MVP, hébergement Apache statique souhaité.
**Conséquence**: Gestion manuelle du DOM, risques XSS plus élevés sans sanitisation systématique.

## ADR-005 — CSRF désactivé (API stateless)
**Status**: Actif
**Décision**: `csrf.disable()` car API REST consommée uniquement par JWT Bearer.
**Alternative rejetée**: CSRF avec cookie SameSite — incompatible avec le flow OAuth2 actuel.
**Conséquence**: Acceptable pour les endpoints REST, mais le state OAuth2 doit être vérifié côté client.

## ADR-006 — Soft delete sur les utilisateurs
**Status**: Actif
**Décision**: Champ `is_deleted` + `deleted_at` au lieu d'un DELETE physique.
**Alternative rejetée**: DELETE physique — perd l'audit trail et les données pour les analytics.

## ADR-007 — BCryptPasswordEncoder (pas de rounds configurés)
**Status**: Actif mais à améliorer
**Décision**: `new BCryptPasswordEncoder()` — utilise le strength par défaut (10 rounds).
**Alternative rejetée**: Argon2 — non disponible nativement dans Spring Security 6 sans dépendance externe.
**Conséquence**: 10 rounds est acceptable mais OWASP recommande 12+ pour BCrypt.

## ADR-008 — SeedDataInitializer protégé par @Profile("dev")
**Status**: Actif — décision correcte
**Décision**: Données de test uniquement en profil `dev`.
**Alternative rejetée**: Scripts SQL manuels — plus d'effort de maintenance.

## ADR-009 — Workflow de Développement Agentique & Protection de la branche develop
**Status**: Actif
**Décision**: Les agents autonomes opèrent exclusivement sur des branches dédiées (`feat/*`, `fix/*`, `task/*`), exécutent le cycle itératif de développement et de tests, mettent à jour la mémoire projet (`docs/ai/`), puis ouvrent une Pull Request (PR) comparant la branche de travail à `develop`. Tous les messages de commit (titre et corps) ainsi que les descriptions de PR sont rédigés impérativement en anglais, selon la convention Conventional Commits, sans emojis ni boilerplate. Cedric valide et fusionne manuellement la PR.
**Alternative rejetée**: Push direct des agents sur la branche `develop` — formellement rejetée car `.github/workflows/deploy.yml` déclenche automatiquement un déploiement SSH en production sur la VM Oracle Cloud à chaque push sur `develop`.
**Conséquence**: Préservation totale de l'environnement de production, isolation des développements, possibilité de prévisualisation via GitHub Pages (`pr-preview.yml`), et contrôle humain final sur les fusions.

## ADR-010 — Architecture Stripe Checkout & Pattern Ports/Adapters
**Status**: Actif
**Décision**: Encapsuler les appels de l'API Stripe derrière un port `StripeGateway` et son adaptateur `StripeGatewayImpl`. Utiliser `com.stripe.net.RequestOptions` pour injecter la clé secrète de manière thread-safe sans dépendre du singleton statique mutable `Stripe.apiKey`.
**Alternative rejetée**: Appels directs à `com.stripe.model.checkout.Session.create(...)` dans `PaymentService` ou `PaymentController` — rejetée car rendrait les tests unitaires dépendants du réseau externe Stripe et introduirait des risques de concurrence.
**Conséquence**: Testabilité unitaire 100% déterministe avec mocks, robustesse face aux pannes réseau externes, et découplage strict entre la couche métier Spring Boot et le SDK Stripe.

## ADR-011 — Rotation de Refresh Token & Jeton de Réinitialisation par Hachage Cryptographique
**Status**: Actif
**Décision**: Stocker les jetons de rafraîchissement (Refresh Tokens) et les jetons de réinitialisation de mot de passe (Password Reset Tokens) sous forme de condensat SHA-256 (`token_hash`) dans PostgreSQL, tout en ne transmettant le jeton brut qu'au client final. Appliquer la rotation systématique des refresh tokens (Refresh Token Rotation - RTR) à chaque renouvellement d'access token, et révoquer l'ensemble des sessions actives en cas de réinitialisation de mot de passe ou de détection de rejeu.
**Alternative rejetée**: Stockage en clair des tokens en base de données — rejetée car une fuite ou un dump de la base compromettrait l'ensemble des sessions actives et permettrait la prise de contrôle non autorisée des comptes.
**Conséquence**: Protection optimale contre le vol de sessions (OWASP ASVS), détection immédiate de réutilisation de refresh tokens, et persistance sécurisée de la session utilisateur sur 7 jours.

## ADR-012 — Séparation des Déploiements Frontend o2switch (Production vs Staging)
**Status**: Actif
**Décision**: Séparer strictement le déploiement du frontend en deux workflows GitHub Actions distincts : `.github/workflows/ftp.yml` déclenché uniquement sur `main` vers la production `noseumcode.fr`, et `.github/workflows/ftp-dev.yml` déclenché uniquement sur `develop` vers le sous-domaine de test `develop.noseumcode.fr/`. Utiliser `local-dir: ./frontend/` pour ne déployer que les fichiers statiques web à la racine de la cible sans exposer le backend Java ni la documentation.
**Alternative rejetée**: Workflow unique avec conditionnel bash complexe — rejetée pour éliminer tout risque d'écrasement accidentel de la production lors d'un push sur `develop` et garantir une visibilité claire dans l'interface GitHub Actions.
**Conséquence**: Isolation stricte entre les environnements de test et de production, réduction du temps de transfert FTP de 6m30s à ~15s, et protection du code source backend.

## ADR-013 — Gamme Produits par Cohortes & Gestion des Droits aux Replays
**Status**: Actif
**Décision**: Structurer l'offre pédagogique en deux parcours principaux par cohortes (petits groupes de 6 élèves max) : **Pack Starter** (Fondations Web, 6 semaines) et **Pack Web** (Parcours complet interactif), complété par une option **Mentorat VIP** (Pack Web + 4h one-to-one). Tous les élèves d'une même cohorte démarrent ensemble. **Les élèves du Pack Starter conservent un accès à vie illimité aux replays des sessions live de leur tronc commun (HTML/CSS/Git)**. En revanche, l'accès aux sessions live et aux replays des modules avancés (JavaScript, API, CI/CD) est strictement verrouillé côté backend (`Enrollment.tier`) à l'issue des semaines de tronc commun.
**Alternative rejetée**: Vente de modules isolés par langage sans synergie de groupe, ou révocation totale des replays pour le Starter (rejetée car contraire à la promesse de formation et néfaste pour la satisfaction apprenant).
**Conséquence**: Modélisation simplifiée (`Cohort`, `Enrollment.tier`), upsell naturel fluide vers le Pack Web dans le dashboard, et pérennité de la valeur perçue pour l'élève Starter.

## ADR-014 — Paiement Fractionné BNPL sans Risque via Klarna / Stripe Checkout
**Status**: Actif
**Décision**: Activer le moyen de paiement Buy Now Pay Later (BNPL) **Klarna** directement dans Stripe Checkout pour proposer le paiement en 3x ou 4x sans frais aux familles. Klarna verse l'intégralité des fonds dès la souscription et assume 100% du risque d'impayé ou de défaut sur les mensualités futures.
**Alternative rejetée**: Échéancier manuel via Stripe Subscriptions (rejeté car en cas de carte bancaire bloquée ou expirée au mois 2, le risque financier et le recouvrement incombent entièrement à l'entreprise) ou création d'un compte marchand Klarna séparé (rejeté car inutile, Stripe gère l'agrégation nativement).
**Conséquence**: Levée du frein tarifaire pour les 16-25 ans sans aucun risque de trésorerie ni coût de gestion d'impayés pour NoSeumCode.

## ADR-015 — Système Analytics Cookieless & Privacy-First (Plausible / Umami)
**Status**: Actif
**Décision**: Adopter une solution d'analytics légère, respectueuse de la vie privée et conforme par défaut au RGPD (Plausible ou Umami) pour le suivi des tunnels de conversion (clics CTA, soumissions HubSpot, checkouts Stripe).
**Alternative rejetée**: Google Analytics 4 (GA4) / Google Tag Manager avec bandeau de cookies (rejeté car alourdit la page, dégrade le score Web Vitals, nécessite une bannière intrusive de consentement et fait fuir l'audience jeune).
**Conséquence**: Script de tracking < 2 Ko, respect strict de la confidentialité sans bandeau de cookies bloquant, et données fiables sur les conversions réelles.

## ADR-016 — Optimisation Web Performance, Compression d'Assets & SSG Formations
**Status**: Actif
**Décision**: 
1. Optimiser drastiquement tous les assets graphiques du frontend vers de véritables formats WebP et PNG quantifiés (passage de 11,7 Mo à 711 Ko au total, soit -94% de poids, avec chaque image <110 Ko).
2. Déployer des pages statiques (SSG) dédiées pour chaque offre de formation (`/formations/starter.html`, `/formations/pack-web.html`, `/formations/index.html`) avec métadonnées Open Graph (1200x630 px) et données structurées Schema.org `Course` (JSON-LD).
3. Éliminer le CLS (Cumulative Layout Shift) en assignant des dimensions explicites (hauteur d'en-tête déterministe, `aspect-ratio: 320/239` sur le logo) et en configurant la compression `mod_deflate` / Brotli et les durées d'expiration `mod_expires` (1 an pour les assets statiques immuables, 1 mois pour CSS/JS, 0s pour HTML) dans `.htaccess`.
**Alternative rejetée**: 
- Chargement d'images brutes haute résolution non compressées côté client ou redimensionnement dynamique au runtime (rejeté car dégrade lourdement le LCP et le score Core Web Vitals).
- Pages de formation générées uniquement via JavaScript côté client (SPA) sans HTML pré-rendu (rejeté car pénalisant pour le référencement naturel SEO Googlebot et le partage sur les réseaux sociaux Discord/LinkedIn/Twitter).
**Conséquence**: Vitesse de chargement quasi-instantanée sur mobile et desktop, score Core Web Vitals optimal (CLS ~0, LCP réduit de plusieurs secondes), et indexation SEO sémantique des offres NoSeumCode.

## ADR-017 — Optimisation PageSpeed & Core Web Vitals (LCP < 1.5s, CLS ~0.00 & Compositing GPU)
**Status**: Actif
**Décision**: 
1. **Déferrement & suppression des tiers bloquants** : retirer le script synchrone Stripe.js (`js.stripe.com/v3/`) de la page d'accueil (économie de 278 Ko et élimination de 3 150 ms de temps de blocage CPU) et basculer sur son injection asynchrone dynamique à la demande (`ensureStripeJsLoaded()`) lors de l'ouverture du modal de paiement ou sur `parcours.html`. Ajouter l'attribut `defer` sur tous les scripts de la page d'accueil (`header.min.js`, `script.min.js`, `popover-hubspot.min.js`, `analytics.js`).
2. **Parallélisation réseau du chargement des partials** : remplacer l'enchaînement séquentiel en cascade (`header.html` ➔ `popovers-shared.html` ➔ `footer.html`) par un chargement simultané via `Promise.all()`, réduisant la latence d'affichage du squelette de page à un seul aller-retour HTTP.
3. **Éradication du CLS et GPU compositing** : éliminer les sauts de mise en page (CLS) en remplaçant l'animation non-composée `background-position-x` (`gradientShift`) par une animation accélérée matériellement sur GPU (`transform: translateZ(0)` et `opacity`), supprimer les mutations JavaScript directes de `background-size` dans le DOM, et figer la hauteur déterministe d'en-tête (153px desktop, 118px mobile).
4. **Optimisation des images et rapatriement local** : convertir le visuel SVG Hero en WebP (26 Ko au lieu de 73 Ko), intégrer le logo sous forme d'élément `<picture>` avec source WebP (8,9 Ko) et dimensions natives explicites (141x105 px), et rapatrier localement l'ensemble des visuels distants Unsplash vers des formats WebP compressés (<20 Ko chacun) dans `images/card/` et `images/blogCards/`.
**Alternative rejetée**: 
- Maintenir le SDK Stripe chargé de manière synchrone sur la page d'accueil pour anticiper un éventuel achat (rejeté car pénalise 100% des visiteurs en augmentant le Total Blocking Time de plus de 3 secondes).
- Continuer à charger les fragments HTML en série (rejeté car allonge inutilement le LCP et le temps avant interactivité).

## ADR-018 — Architecture Intégration Discord Community & Pattern Ports/Adapters
**Status**: Actif
**Décision**: 
1. **Pattern Ports/Adapters (`DiscordGateway`)** : Abstraire l'intégration Discord REST API v10 derrière l'interface port `DiscordGateway` et son adaptateur `DiscordGatewayImpl` (`RestClient` Spring Boot) pour gérer l'adhésion au serveur Discord (`PUT /guilds/{guildId}/members/{userId}`) et l'attribution/retrait dynamique de rôles (`PUT /guilds/{guildId}/members/{userId}/roles/{roleId}`).
2. **Liaison de compte sécurisée & Anti-collision (OWASP ASVS)** : Permettre à un étudiant connecté de lier son compte Discord via OAuth2 (`link_token` JWT transitoire). Vérifier l'unicité de `discord_user_id` et interdire la collision avec un compte existant (`DuplicateResourceException` HTTP 409).
3. **Calcul cumulatif des rôles par palier de formation** :
   - `VIP` ➔ Rôles VIP + Web + Starter + Membre par défaut.
   - `WEB` ➔ Rôles Web + Starter + Membre par défaut.
   - `STARTER` ➔ Rôles Starter + Membre par défaut.
   - `NONE` ➔ Rôle Membre par défaut.
4. **Synchronisation automatique post-paiement Stripe** : Lors de la confirmation d'une commande (webhook Stripe ou endpoint de secours `confirm-session`), synchroniser automatiquement les rôles Discord de l'élève si son compte est lié.
5. **Résilience et non-blocage** : Si le token de bot ou l'identifiant de guilde ne sont pas configurés (environnements dev/tests), `DiscordGatewayImpl` simule l'opération gracieusement sans bloquer le flux d'authentification ou d'inscription.
**Alternative rejetée**: 
- Bibliothèque lourde WebSocket (JDA / Discord4J) : rejetée en raison de l'empreinte mémoire excessive (WebSockets persistants, gestion d'événements superflue) alors que de simples requêtes REST HTTP v10 suffisent pour administrer les membres et rôles.
- Rendre les erreurs Discord bloquantes pour le checkout Stripe ou la connexion utilisateur : rejeté car une indisponibilité de l'API Discord ne doit jamais impacter le chiffre d'affaires ou l'accès aux cours de l'élève.
**Conséquence**: Expérience d'onboarding communautaire automatisée, synchronisation instantanée des accès Discord dès l'achat d'un pack, et robustesse totale en environnement de test/développement.

## ADR-019 — Politique de Cache HTTP Apache & Restauration BFCache (Back/Forward Cache)
**Status**: Actif
**Décision**: 
1. **Élimination de `no-store` sur les documents HTML** : Remplacer `Header set Cache-Control "max-age=0, no-cache, no-store, must-revalidate"` par `Header set Cache-Control "no-cache, must-revalidate"` pour les fichiers `.html` dans `.htaccess`. Cela garantit la revalidation auprès du serveur (`304 Not Modified`) pour toute nouvelle visite ou déploiement tout en autorisant Chromium et Safari à restaurer la page instantanément (0 ms) via le Back/Forward Cache (BFCache) lors des navigations dans l'historique.
2. **Cache 1 an pour les assets statiques CSS & JS (`max-age=31536000, public`)** : Aligner la durée de mise en cache des feuilles de style et des scripts sur celle des images et polices web pour satisfaire pleinement les audits Lighthouse / Core Web Vitals.
3. **Invalidation par Versioning d'Assets (Cache Busting)** : Associer systématiquement une chaîne de version (`?v=sprintXX`) à toutes les références de scripts et de styles dans le balisage HTML pour forcer l'invalidation immédiate du cache client à chaque livraison sans dépendre de l'expiration du TTL.
4. **Allègement des polices Google Fonts** : Ne charger que les graisses strictement nécessaires (`wght@400;600;700` et `Bangers`) pour réduire le poids de transfert de ~40 Ko et limiter les micro-reflows FOUT.
**Alternative rejetée**: 
- Maintenir `no-store` sur les fichiers HTML : rejetée car cela détruit l'arbre DOM et l'état JS en mémoire vive dès que l'utilisateur quitte la page, provoquant un rechargement réseau complet lors d'un retour arrière et dégradant l'expérience de navigation.
- Conserver un cache de 30 jours sans versioning sur CSS/JS : rejetée car pénalisée par les audits d'efficacité de cache Lighthouse et susceptible de laisser subsister du code JavaScript ou CSS obsolète chez l'utilisateur lors de correctifs urgents.
**Conséquence**: Navigation retour/avance instantanée (0 ms), satisfaction intégrale des audits de politique de cache Lighthouse, élimination des requêtes 404 parasites et réduction significative du payload réseau initial.

## ADR-020 — Règles d'Ergonomie de Lecture et Alignement Typographique Strict
**Status**: Actif
**Décision**: 
1. **Mur d'ancrage visuel gauche (LTR)** : En lecture occidentale de gauche à droite, garantir un point de repère vertical fixe sur l'axe X gauche en interdisant le centrage des paragraphes descriptifs, argumentatifs, des listes à puces et des contenus longs.
2. **Exceptions strictement bornées au centrage (<= 3 lignes)** :
   - Sous-titres d'accroche Hero sous H1 (1 à 2 lignes).
   - Micro-réassurance sous les boutons CTA (1 ligne : `✓ Accès immédiat • Garantie 14 jours`).
   - Bannières d'action / empty states (icône + titre + 1 phrase + bouton CTA).
   - Citations ou témoignages isolés courts entre guillemets.
   - Titres majeurs de sections (H1, H2), badges pillules de technologies et boutons d'action.
3. **Interdiction formelle de centrage (`text-align: left` obligatoire)** :
   - Corps de texte des chapitres et articles de blog (`max-width: 75ch`, `line-height: 1.7` à `1.85`).
   - Réponses de FAQ (lecture en scan F/Z).
   - Listes à puces et checklists des fonctionnalités des packs d'offres (`.package-features`).
   - Cartes explicatives et blocs feature (les 3 piliers de La Méthode `.card__paragraphe`).
   - Descriptions et argumentaires des packs de cours (`.package-tagline`, bio et piliers mentor).
4. **Préservation stricte sur mobile** : Dans les requêtes `@media (max-width: ...)`, préserver impérativement l'alignement à gauche des paragraphes descriptifs afin d'éviter la formation de colonnes hachées en "dents de scie".
**Alternative rejetée**: 
- Centrer l'ensemble des conteneurs de cartes ou sections par défaut pour des raisons d'esthétique symétrique abstraite (rejetée car cela perturbe la fixation oculaire, augmente la charge cognitive et dégrade les taux de complétion et de conversion).
- Forcer le centrage des textes descriptifs sur mobile sous prétexte de centrer l'avatar ou le bouton (rejetée car la colonne étroite accentue dramatiquement l'effort de lecture).
**Conséquence**: Amélioration de la lisibilité et de la vitesse de scan, confort de lecture accru sur mobile et desktop, et standardisation pérenne formalisée dans la règle projet `.agents/rules/rule-20-typography-readability.md`.

## ADR-021 — Conformité des Ratios de Contraste Couleurs WCAG 2.2 AA / AAA & RGAA
**Status**: Actif
**Décision**: 
1. **Application stricte des ratios normatifs WCAG 2.2 / RGAA** :
   - Texte normal (< 24px ou < 18,5px en gras) : ratio minimum **4,5:1** (AA) et **7:1** (AAA).
   - Grand texte ($\ge$ 24px ou $\ge$ 18,5px en gras) : ratio minimum **3:1** (AA) et **4,5:1** (AAA).
   - Éléments graphiques et composants d'interface interactifs (boutons, champs, icônes fonctionnelles, chevrons) : ratio minimum **3:1** (Critère 1.4.11).
   - Exceptions admises : éléments purement décoratifs, contrôles inactifs (`disabled`), logotypes.
2. **Harmonisation de la palette NoSeumCode sur fond clair (`#ffffff` / `#f5f7fa`)** :
   - Remplacement des teintes défaillantes : `#94a3b8` (2.56:1, FAIL) remplacé par `#475569` (7.58:1, PASS AAA) sur cartes blanches et micro-textes.
   - Badges tarifaires : badge Starter `#00d9ff` sur fond teinté (1.53:1, FAIL) remplacé par `#0369a1` (5.35:1, PASS AA) ; badge VIP `#ff3366` (2.89:1, FAIL) remplacé par `#be123c` (5.11:1, PASS AA).
   - Éléments graphiques interactifs : remplacement de `stroke: var(--primary-green)` (1.34:1, FAIL) et `#00a85a` (3.11:1) sur fond blanc par le vert accessible `#047857` (5.48:1, PASS AA).
   - Titres Markdown de cours : H1 passé à `#047857` (5.48:1) et H2 passé à `#0369a1` (5.93:1).
   - Badges du tableau de bord utilisateur : `#00a85a`, `#0284c7`, `#d97706` alignés sur des contrastes $\ge 4.5:1$ (`#047857`, `#0369a1`, `#b45309`).
3. **Harmonisation sur fond sombre** :
   - Ajout explicite de `.section--dark` sur `.section--trustbar` pour garantir la lisibilité optimale des badges d'outils pros (`#e2e8f0` : 14.71:1, AAA) et du libellé d'en-tête (`#94a3b8` : 7.07:1, AAA).
4. **Pérénisation dans les règles agents** :
   - Création de la règle `.agents/rules/rule-21-wcag-color-contrast.md`.
**Alternative rejetée**: 
- Utiliser du texte gris clair (`#94a3b8`) ou des teintes pastel fluo (`#00ff87`, `#00d9ff`, `#ff3366`) sur fond blanc pour un effet esthétique délavé (rejetée car cela exclut les personnes malvoyantes et constitue une non-conformité légale WCAG 2.2 / RGAA).
**Conséquence**: Accessibilité universelle garantie, conformité 100% WCAG 2.2 AA / AAA sur tous les contrastes texte et composants d'interface, et suppression définitive des contrastes illisibles.

## ADR-022 — Architecture des Offres : 2 Packs de Base (299 € & 449 €) + 1 Option Add-on Suivi Mentor (+199 € / Downsell 89 €)
**Status**: Actif
**Décision**: 
1. **Abandon définitif de l'offre éclatée en 3 packs distincts (Starter / Web Pro / VIP)** :
   - Le catalogue se concentre sur 2 packs de formation : **Pack Starter** (299 € ou 3× 99 € sans frais via Klarna) et **Pack Web Pro** (449 € ou 3× 149 € sans frais via Klarna).
   - Le mentorat individuel n'est plus un 3e pack isolé mais un **Add-on transverse** (+199 € pour 4 sessions de 1h avec Cédric Ragot), cumulable avec n'importe lequel des deux packs de base (Starter + Mentor = 498 €, Web Pro + Mentor = 648 €).
2. **Gestion de la Rareté & des Quotas (3 places max par cohorte par pack)** :
   - Stock physique limité à 3 places par cohorte par pack. Les compteurs sont alimentés dynamiquement par l'API backend `GET /api/cohorts/current`.
   - La décrémentation des stocks n'a lieu qu'à la confirmation de paiement réelle (webhook Stripe `checkout.session.completed` / `confirmCheckoutSession`).
3. **Mécanique de Conversion au Checkout** :
   - Rappel discret non bloquant au checkout Stripe si l'option n'est pas sélectionnée, avec ouverture d'un drawer latéral sans rechargement de page.
   - Modale downsell non culpabilisante proposant 2 sessions pour 89 € au moment de la validation, affichée une seule fois par session (`sessionStorage`).
**Alternative rejetée**: 
- Maintenir un 3e pack "Mentorat VIP" à 879 € ou 389 € (rejetée car cela dilue le positionnement, impose un ticket d'entrée élevé inaccessible, et complique la logistique des cohortes séquentielles).
- Décrémenter les places restantes au simple clic "ajouter au panier" (rejetée car cela génère des faux stocks épuisés et des abandons de panier bloquants).
**Conséquence**: Augmentation du panier moyen et du taux de conversion (CRO), valorisation transparente du temps de mentorat individuel, et alignement parfait entre frontend, backend Spring Boot et Stripe Embedded Checkout.

