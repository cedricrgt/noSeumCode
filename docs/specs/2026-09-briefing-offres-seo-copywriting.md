# CAHIER DES CHARGES & BRIEFING DEV : Refonte SEO, Copywriting & Offres NoSeumCode

**Destinataire** : Agent de Développement / Intégrateur Frontend & Backend  
**Projet** : NoSeumCode (https://noseumcode.fr)  
**Chemin du dépôt local** : D:\Archive-mac\dev\code-bangers\frontend  
**Objet** : Déploiement de la nouvelle stratégie d'offres en 3 Packages, intégration du copywriting validé, optimisation SEO (mots-clés short & long-tail), déblocage technique (CSP HubSpot, noindex, performance CWV) et assainissement ergonomique.  
**Date de validation** : 2026-09-30  
**Statut** : Document de spécification officiel & immuable pour les Sprints 13, 14, 15 et 16  

---

## 📑 Table des Matières
1. [Principes Directeurs & Arbitrages Stratégiques](#1-principes-directeurs--arbitrages-stratégiques)
2. [Matrice Sémantique des Mots-Clés (Short, Middle & Long-Tail)](#2-matrice-sémantique-des-mots-clés-short-middle--long-tail)
3. [Nouvelle Architecture des Offres (Les 3 Packages)](#3-nouvelle-architecture-des-offres-les-3-packages)
4. [Spécifications Page par Page & Textes Prêts au Copier-Coller](#4-spécifications-page-par-page--textes-prêts-au-copier-coller)
   - 4.1 Page d'Accueil (`index.html`)
   - 4.2 Page Catalogue / Parcours (`cours.html` / `parcours.html`)
   - 4.3 Cocon Sémantique Blog (`article.html` & Fiches Articles)
   - 4.4 Tunnel Lead Magnet (`popover-hubspot.js` & `thanks.html`)
   - 4.5 Page de Confirmation de Paiement (`success.html`)
   - 4.6 Tableau de Bord & Sécurité (`dashboard.html` & `reset-password.html`)
   - 4.7 Composants Partagés (`header.html`, `footer.html`, Modales Auth)
5. [Correctifs Techniques Obligatoires (SEO, Serveur & Performance)](#5-correctifs-techniques-obligatoires-seo-serveur--performance)
6. [Plan de Test & Recette Post-Implémentation](#6-plan-de-test--recette-post-implémentation)

---

## 1. Principes Directeurs & Arbitrages Stratégiques

Lors du brainstorming stratégique, les décisions suivantes ont été formellement validées :

- **Abandon de la vente éclatée au profit de 3 Packages progressifs** :
  - **Pack Starter (HTML5 & CSS3)** : 89 €
  - **Pack Web Pro (HTML/CSS + JavaScript ES6+ + Bonus Git/GitHub)** : 179 € (ou 2x 95 €)
  - **Pack Mentorat VIP (Pack Web Pro + 4h de Mentorat One-to-One privé)** : 389 € (ou 3x 135 €)
- **Harmonisation Terminologique (Rejet de « Cursus »)** :
  - Remplacer les termes vieillots ou académiques (« Nos cours », « Formations », « Nos cursus ») par « Nos Parcours » ou « Nos Packs ».
- **Suppression de la Section « Double Regard / Parents & Jeunes » sur la Homepage** :
  - Interdiction de scinder la homepage en deux colonnes explicites (« Pour toi le jeune » vs « Pour vous les parents »).
  - La homepage conserve une seule voix (dynamique, directe, tutoiement, axée sur les projets).
  - La réassurance des parents s'effectue de manière implicite (mentions légales carrées, paiement Stripe sécurisé, garantie 14 jours, vrai visage du formateur senior).
  - La seule mention explicite pour les parents est reléguée dans une question dédiée de la FAQ et dans le cocon sémantique du blog.

---

## 2. Matrice Sémantique des Mots-Clés (Short, Middle & Long-Tail)

L'agent de dev doit veiller à intégrer ces termes dans les balises d'en-tête (H1, H2, H3), les textes courants, les attributs alt des images et les métadonnées.

### 2.1 Cible Apprenants (16-25 ans) — Homepage, Parcours & Fiches Produits

| Type de Requête | Requêtes Cibles | Emplacement Cible |
| :--- | :--- | :--- |
| **Short-Tail**<br>*(Volume élevé)* | • apprendre à coder (6 600/m)<br>• cours javascript (2 400/m)<br>• cours html css (1 900/m)<br>• créer son site web (3 600/m)<br>• formation git github (880/m) | • H1 / H2 Homepage<br>• Titre de page `<title>`<br>• En-têtes des fiches packs |
| **Middle-Tail**<br>*(Intention forte)* | • apprendre à coder débutant<br>• cours de programmation en direct<br>• créer son portfolio développeur<br>• apprendre javascript de zéro<br>• mentor développement web | • H3 de section<br>• Sous-titres Hero & Packs<br>• Puces de bénéfices |
| **Long-Tail**<br>*(Conversion maximale)* | • comment apprendre à coder quand on est débutant<br>• peut-on apprendre à coder sans être fort en maths<br>• cours de code en direct avec mentor en ligne<br>• apprendre à coder en petits groupes interactifs<br>• faire un portfolio de développeur sans expérience | • Questions / Réponses FAQ<br>• Articles de blog pratiques<br>• Accroches de témoignages |

### 2.2 Cible Parents & Financeurs — Blog, FAQ & Page Stages Vacances

| Type de Requête | Requêtes Cibles | Emplacement Cible |
| :--- | :--- | :--- |
| **Short-Tail** | • cours informatique adolescent (800/m)<br>• stage de code vacances (1 200/m)<br>• initiation au code informatique (600/m)<br>• stage informatique jeune (700/m) | • Page `/stages-vacances`<br>• Titres d'articles de blog |
| **Middle-Tail** | • cours de programmation pour ado<br>• stage de code vacances toussaint<br>• cours informatique en ligne encadré<br>• formation numérique pour lycéen | • H2 des articles de blog<br>• Formulaire lead magnet |
| **Long-Tail** | • comment aider mon ado qui passe tout son temps sur son ordinateur<br>• transformer la passion des jeux vidéo en compétence informatique<br>• formation d'initiation au code pour lycéen préparant la spécialité NSI<br>• cours de programmation pour jeune avec paiement en plusieurs fois | • Articles de fond du blog<br>• Page dédiée aux parents dans le PDF du programme |

---

## 3. Nouvelle Architecture des Offres (Les 3 Packages)

### Données Techniques (pour mise à jour de `cours.js` et API Stripe)

```json
[
  {
    "id": "pack-starter",
    "slug": "pack-starter",
    "title": "Pack Starter – Les Fondations du Web",
    "level": "DEBUTANT",
    "priceInCents": 8900,
    "currency": "EUR",
    "stripePriceId": "price_starter_89",
    "modulesIncluded": ["HTML5 Sémantique", "CSS3 Moderne", "Flexbox & Grid", "Responsive Design"],
    "projectsCount": 2,
    "isMentored": false
  },
  {
    "id": "pack-web-pro",
    "slug": "pack-web-pro",
    "title": "Pack Web Pro – L'Autonomie Complète",
    "level": "INTERMEDIAIRE",
    "priceInCents": 17900,
    "currency": "EUR",
    "stripePriceId": "price_webpro_179",
    "installmentAvailable": true,
    "installmentText": "ou 2x 95 € sans frais",
    "modulesIncluded": ["Tout le Pack Starter", "JavaScript ES6+", "DOM & Événements", "API Fetch & Async", "Git & GitHub Offert"],
    "projectsCount": 6,
    "isMentored": false
  },
  {
    "id": "pack-mentorat-vip",
    "slug": "pack-mentorat-vip",
    "title": "Pack Mentorat VIP – L'Accompagnement Sur-Mesure",
    "level": "ACCOMPAGNE",
    "priceInCents": 38900,
    "currency": "EUR",
    "stripePriceId": "price_vip_389",
    "installmentAvailable": true,
    "installmentText": "ou 3x 135 € sans frais",
    "modulesIncluded": ["Tout le Pack Web Pro", "4 Heures de Mentorat 1-to-1 en Visio", "Revue de Code Ligne par Ligne", "Coaching CV Tech & GitHub", "Salon Discord VIP Privé"],
    "projectsCount": 6,
    "isMentored": true,
    "maxSeatsPerMonth": 10
  }
]
```

---

## 4. Spécifications Page par Page & Textes Prêts au Copier-Coller

### 4.1 Page d'Accueil (`index.html`)

#### A. Métadonnées `<head>`
```html
<title>NoSeumCode | Apprends le Développement Web Sans le Seum (HTML, CSS, JS)</title>
<meta name="description" content="Passe de zéro à tes premiers sites web en ligne. Des formations pratiques HTML, CSS et JavaScript avec projets réels, entraide active et mentorat individuel.">
<link rel="canonical" href="https://noseumcode.fr/">
<meta property="og:title" content="NoSeumCode | Apprends le Développement Web Sans le Seum">
<meta property="og:description" content="Des projets concrets, zéro cours théorique de 400 pages, du code propre et un accompagnement humain pour lancer tes projets web.">
<meta property="og:url" content="https://noseumcode.fr/">
<meta property="og:image" content="https://noseumcode.fr/images/og/partage-noseumcode.png">
```

#### B. Section Hero (Remplacement lignes 143-186)
- **Tag supérieur** : `<span class="section-tag">Formations Web Débutant & Intermédiaire</span>`
- **H1** :
```html
<h1 class="hero__title bangers-regular">
  Apprends à coder pour de vrai. <span class="gradient-text">Sans le seum.</span>
</h1>
```
- **Paragraphe sous-titre** :
```html
<p class="hero__paragraphe poppins-regular">
  Marre des tutoriels théoriques interminables où tu recopies du code sans rien comprendre ? Avec NoSeumCode, tu construis de vrais sites web dès ta première semaine, guidé pas à pas avec du code moderne et du mentorat direct.
</p>
```
- **Boutons CTA & Réassurance** :
```html
<div class="hero__buttons">
  <a href="#parcours" class="button button__primary bangers-regular">
    Voir les 3 Packs d'Apprentissage ↓
  </a>
  <button popovertarget="hubspot-popover" class="button button__secondary bangers-regular">
    Télécharger le Programme (PDF)
  </button>
</div>
<p class="hero__subtext-reassurance poppins-regular" style="font-size: 0.85rem; color: #94a3b8; margin-top: 0.75rem;">
  ✓ Projets 100% pratiques • ✓ Accès à vie aux mises à jour • ✓ Garantie 14 jours satisfait ou remboursé
</p>
```

#### C. Section Preuve Sociale & Boîte à Outils (À insérer entre Hero et Services)
```html
<section class="section section--trustbar" style="padding: 1.5rem 0; border-bottom: 1px solid rgba(255,255,255,0.08);">
  <div class="container text-center">
    <p style="font-size: 0.85rem; color: #94a3b8; margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 1px;">
      Les technologies et outils professionnels que tu vas maîtriser :
    </p>
    <div style="display: flex; justify-content: center; gap: 2rem; flex-wrap: wrap; align-items: center; opacity: 0.85;">
      <span class="tool-badge">HTML5 Sémantique</span>
      <span class="tool-badge">CSS3 & Flexbox</span>
      <span class="tool-badge">JavaScript ES6+</span>
      <span class="tool-badge">Git & GitHub</span>
      <span class="tool-badge">VS Code</span>
      <span class="tool-badge">Responsive Design</span>
    </div>
  </div>
</section>
```

#### D. Section "La Méthode NoSeumCode" (Remplacement lignes 191-236)
- **Tag** : La Méthode NoSeumCode
- **H2** : Trois piliers pour apprendre vite, sans décrocher
- **Carte 1** :
  - **H3** : Zéro théorie inutile, 100% de création
  - **Texte** : Oublie les cours magistraux de 400 pages et les vidéos où l'on regarde passivement quelqu'un d'autre taper du code. Ici, tu installes tes outils dès la première heure et tu construis des interfaces réelles qui tournent dans ton navigateur.
- **Carte 2** :
  - **H3** : Des projets que tu seras fier de montrer
  - **Texte** : À la fin de ton parcours, tu ne repars pas avec un simple fichier texte sur ton bureau. Tu possèdes des applications complètes, hébergées en ligne, versionnées proprement avec Git et GitHub, prêtes à être partagées à des recruteurs ou à tes clients.
- **Carte 3** :
  - **H3** : Un mentor et une communauté à tes côtés
  - **Texte** : La première cause d'abandon en programmation est une virgule manquante qui bloque ton écran pendant trois jours. Sur notre Discord privé, tu poses tes questions, partages ton code et obtiens de l'aide rapidement pour continuer d'avancer sereinement.

#### E. Section Offres : Les 3 Packages (Remplacement section `#courses` lignes 414-558)
- **ID de section** : `id="parcours"`
- **Tag** : Nos Parcours de Formation
- **H2** : Choisis le pack adapté à ton niveau et à tes ambitions
- **Sous-titre** : Accès immédiat, vidéos courtes et percutantes, exercices corrigés et garantie satisfait ou remboursé.

##### Carte 1 : Pack Starter (89 €)
```html
<article class="card card-white card-package">
  <div class="card__tag" style="background: rgba(0, 217, 255, 0.15); color: #00d9ff;">Idéal Débutant</div>
  <h3 class="bangers-regular" style="font-size: 1.8rem; margin: 0.5rem 0;">Pack Starter</h3>
  <p class="package-tagline" style="color: #64748b; font-size: 0.95rem;">Les fondations indispensables du web moderne.</p>
  <div class="package-price bangers-regular" style="font-size: 2.5rem; color: #070e18; margin: 1rem 0;">
    89 € <span style="font-size: 0.9rem; font-family: 'Poppins'; font-weight: normal; color: #64748b;">paiement unique</span>
  </div>
  <ul class="package-features poppins-regular" style="text-align: left; list-style: none; padding: 0; line-height: 1.8; font-size: 0.9rem; margin-bottom: 1.5rem;">
    <li>✓ <strong>Formation HTML5 Complète</strong> (Structure & SEO)</li>
    <li>✓ <strong>Formation CSS3 Moderne</strong> (Flexbox, Grid & Couleurs)</li>
    <li>✓ <strong>Responsive Design</strong> (Adapté mobile & tablettes)</li>
    <li>✓ <strong>2 Projets de Portfolio</strong> (Page Bio-Link + Landing Page)</li>
    <li>✓ <strong>Accès Communauté Discord</strong> d'entraide</li>
    <li>✓ <strong>Mises à jour à vie</strong> incluses</li>
  </ul>
  <button type="button" class="button button__primary bangers-regular" style="width: 100%;" onclick="initiateCourseEnrollment('pack-starter', 'Pack Starter', '89 €')">
    Choisir le Pack Starter • 89 €
  </button>
  <p style="font-size: 0.75rem; color: #94a3b8; margin-top: 0.5rem;">Accès immédiat • Garantie 14 jours</p>
</article>
```

##### Carte 2 : Pack Web Pro (179 € — Recommandé)
```html
<article class="card card-green card-package card-featured" style="border: 2px solid #00ff87; position: relative;">
  <div class="card__tag" style="background: #00ff87; color: #070e18; font-weight: bold;">Le Plus Populaire</div>
  <h3 class="bangers-regular" style="font-size: 1.8rem; margin: 0.5rem 0; color: #fff;">Pack Web Pro</h3>
  <p class="package-tagline" style="color: #cbd5e1; font-size: 0.95rem;">Deviens un développeur web frontend autonome.</p>
  <div class="package-price bangers-regular" style="font-size: 2.5rem; color: #00ff87; margin: 1rem 0;">
    179 € <span style="font-size: 0.9rem; font-family: 'Poppins'; font-weight: normal; color: #cbd5e1;">ou 2x 95 €</span>
  </div>
  <ul class="package-features poppins-regular" style="text-align: left; list-style: none; padding: 0; line-height: 1.8; font-size: 0.9rem; margin-bottom: 1.5rem; color: #fff;">
    <li>✓ <strong>Tout le Pack Starter inclus</strong> (HTML5 + CSS3)</li>
    <li>✓ <strong>Formation JavaScript Moderne (ES6+)</strong></li>
    <li>✓ <strong>Manipulation du DOM & Animations</strong> interactives</li>
    <li>✓ <strong>Connexion API & Données en temps réel</strong> (fetch/async)</li>
    <li>✓ <strong>4 Projets Portfolio Additionnels</strong> (Dashboard Gaming, etc.)</li>
    <li>🎁 <strong>BONUS OFFERT : Formation Git & GitHub</strong> (valeur 49 €)</li>
    <li>✓ <strong>Accès Prioritaire Discord</strong> & salons d'entraide</li>
  </ul>
  <button type="button" class="button button__primary bangers-regular" style="width: 100%; background: #00ff87; color: #070e18;" onclick="initiateCourseEnrollment('pack-web-pro', 'Pack Web Pro', '179 €')">
    Rejoindre le Pack Web Pro • 179 €
  </button>
  <p style="font-size: 0.75rem; color: #a0aec0; margin-top: 0.5rem;">Soit 2x 95 € sans frais • Garantie 14 jours</p>
</article>
```

##### Carte 3 : Pack Mentorat VIP (389 €)
```html
<article class="card card-white card-package">
  <div class="card__tag" style="background: rgba(255, 51, 102, 0.15); color: #ff3366;">10 Places / Mois</div>
  <h3 class="bangers-regular" style="font-size: 1.8rem; margin: 0.5rem 0;">Pack Mentorat VIP</h3>
  <p class="package-tagline" style="color: #64748b; font-size: 0.95rem;">L'accélération avec un formateur senior dédié.</p>
  <div class="package-price bangers-regular" style="font-size: 2.5rem; color: #070e18; margin: 1rem 0;">
    389 € <span style="font-size: 0.9rem; font-family: 'Poppins'; font-weight: normal; color: #64748b;">ou 3x 135 €</span>
  </div>
  <ul class="package-features poppins-regular" style="text-align: left; list-style: none; padding: 0; line-height: 1.8; font-size: 0.9rem; margin-bottom: 1.5rem;">
    <li>✓ <strong>L'intégralité du Pack Web Pro</strong> + Git & GitHub</li>
    <li>🎯 <strong>4H de Mentorat Individuel (1-to-1)</strong> en visio privée</li>
    <li>🔍 <strong>Revue de Code Ligne par Ligne</strong> de tes projets</li>
    <li>💼 <strong>Coaching Carrière & Audit Portfolio</strong> (CV + GitHub)</li>
    <li>💬 <strong>Canal Privé Direct avec ton Mentor</strong> sur Discord</li>
    <li>✓ <strong>Suivi personnalisé</strong> garanti sous 24h ouvrées</li>
  </ul>
  <button type="button" class="button button__primary bangers-regular" style="width: 100%;" onclick="initiateCourseEnrollment('pack-mentorat-vip', 'Pack Mentorat VIP', '389 €')">
    Postuler au Pack VIP • 389 €
  </button>
  <p style="font-size: 0.75rem; color: #94a3b8; margin-top: 0.5rem;">Soit 3x 135 € sans frais • 100% garanti</p>
</article>
```

#### F. Section FAQ (Remplacement lignes 710-777)
Remplacer les 5 questions actuelles par ces 6 questions optimisées levant les freins réels :

1. **Je n'ai jamais codé de ma vie. Est-ce que je peux vraiment suivre ?**  
   *Absolument. Le Pack Starter démarre de zéro complet. Aucune connaissance préalable en programmation n'est demandée. Tout est expliqué pas à pas avec des exemples concrets.*

2. **Est-ce qu'il faut être bon en maths pour réussir ?**  
   *Non, c'est une légende urbaine. Le développement web fait appel à de la logique et à de la structure, pas à des intégrales ou des théorèmes mathématiques. Si tu as un peu de bon sens, tu réussiras.*

3. **Pendant combien de temps ai-je accès aux cours ?**  
   *Ton accès est illimité et garanti à vie. Tu avances à ton propre rythme, selon ton emploi du temps. Si nous mettons à jour le cours, tu profites des ajouts gratuitement.*

4. **Je suis parent, puis-je offrir cette formation à mon enfant / adolescent ?**  
   *Tout à fait. Lors du paiement, vous pouvez renseigner vos coordonnées bancaires pour le règlement et indiquer l'adresse email de votre enfant pour son accès étudiant. Nos cours sont 100% encadrés, sans publicité, et forment à des compétences techniques réelles et utiles pour ses études.*

5. **Que se passe-t-il si la formation ne me convient pas ?**  
   *Tu ne prends aucun risque financier grâce à notre garantie 14 jours satisfait ou remboursé. Un simple message à notre support et tu es remboursé intégralement, sans justification exigée.*

6. **Proposez-vous le paiement en plusieurs fois ?**  
   *Oui. Tu peux régler le Pack Web Pro en 2 fois (2x 95 €) et le Pack Mentorat VIP en 3 fois (3x 135 €) directement par carte bancaire de façon sécurisée via Stripe.*

---

### 4.2 Page de Téléchargement du Lead Magnet (`thanks.html`)

#### A. Métadonnées `<head>`
```html
<meta name="robots" content="noindex, nofollow" />
<title>Ton programme est en route ! | NoSeumCode</title>
```

#### B. Structure des Téléchargements Réparée
- Programme Complet (PDF) : `documents/programme-complet.pdf` (espace supprimé)
- Guide HTML & CSS (PDF) : `documents/Cours-HTML-CSS.pdf`
- Mémento JavaScript (PDF) : `documents/Premiers-pas-avec-JavaScript.pdf`
- Guide Git & GitHub (PDF) : `documents/git&github.pdf` (lien réparé)

#### C. Bannière d'Upsell doux (Sous la grille de téléchargement)
```html
<div class="upsell-box" style="margin-top: 3rem; background: rgba(0, 255, 135, 0.08); border: 1px solid rgba(0, 255, 135, 0.3); border-radius: 12px; padding: 1.5rem; text-align: center;">
  <h3 class="bangers-regular" style="color: #00ff87; font-size: 1.5rem; margin-bottom: 0.5rem;">Envie de passer directement à la pratique ?</h3>
  <p style="color: #cbd5e1; font-size: 0.95rem; margin-bottom: 1rem;">
    Rejoins nos parcours interactifs dès 89 € avec garantie 14 jours satisfait ou remboursé.
  </p>
  <a href="index.html#parcours" class="button button__primary bangers-regular" style="display: inline-block;">
    Découvrir les 3 Packs NoSeumCode →
  </a>
</div>
```

---

### 4.3 Page de Confirmation de Commande (`success.html`)

#### A. Métadonnées `<head>`
```html
<meta name="robots" content="noindex, nofollow" />
<title>Paiement Confirmé ! Bienvenue sur NoSeumCode</title>
```

#### B. Contenu de Réassurance & Onboarding Immédiat
```html
<main id="success-content" class="thanks-container">
  <span class="thanks__icon" aria-hidden="true">🎉</span>
  <h1 class="thanks__title bangers-regular">Inscription Validée !</h1>
  <p class="thanks__message poppins-regular">
    Félicitations ! Ton accès complet est désormais activé. Un reçu détaillé ainsi que tes accès ont été envoyés à ton adresse email.
  </p>
  <div class="success-summary">
    <h3 class="bangers-regular">Tes 3 étapes pour bien démarrer :</h3>
    <ul>
      <li>1️⃣ <strong>Accède à ton espace étudiant</strong> : Retrouve l'ensemble de tes chapitres et vidéos sur ton tableau de bord.</li>
      <li>2️⃣ <strong>Rejoins la communauté Discord</strong> : Viens te présenter dans le salon <code>#nouveaux-élèves</code> pour débloquer tes accès.</li>
      <li>3️⃣ <strong>Configure ton éditeur</strong> : Suis le module d'installation pour préparer VS Code en moins de 10 minutes.</li>
    </ul>
  </div>
  <div class="success-actions">
    <a href="dashboard.html" class="button button__primary bangers-regular" id="btn-goto-dashboard">
      Accéder à Mon Espace de Cours 🚀
    </a>
    <a href="https://discord.gg/noseumcode" target="_blank" rel="noopener noreferrer" class="button button__secondary bangers-regular">
      Rejoindre le Discord Privé
    </a>
  </div>
</main>
```

---

### 4.4 Composants Globaux (`header.html` & `footer.html`)

#### A. Navigation Principale (`partials/header.html`)
Remplacer les liens actuels par :
- Accueil (`index.html`)
- Nos Parcours (`index.html#parcours`)
- La Méthode (`index.html#services`)
- FAQ (`index.html#faq`)
- Bouton Secondaire : *Se connecter*
- Bouton Primaire : *Télécharger le programme*

#### B. Footer & Pages Légales Obligatoires (`partials/footer.html`)
Créer les 3 fichiers HTML légaux et mettre à jour les liens du footer (qui pointaient tous vers `index.html`) :
- Mentions Légales → `mentions-legales.html` (Éditeur, SIRET, hébergeur o2switch)
- CGV → `cgv.html` (Tarifs des packs, droit de rétractation 14j, médiation de la consommation)
- Confidentialité → `confidentialite.html` (Gestion des données personnelles, Stripe, Brevo)

---

## 5. Correctifs Techniques Obligatoires (Serveur, SEO & Performance)

### 5.1 Fichier `.htaccess` (Déblocage CSP HubSpot & Cache)
Dans `frontend/.htaccess`, mettre à jour les directives suivantes :

```apache
# 1. Déblocage du Popover HubSpot et de la soumission de formulaires
Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://js.stripe.com https://js-eu1.hsforms.net https://js.hsforms.net; frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://forms.eu1.hsforms.com https://forms.hubspot.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https: https://*.stripe.com https://forms.hubspot.com; connect-src 'self' https://noseumcode.fr https://api.noseumcode.fr https://develop.noseumcode.fr http://localhost:8080 http://localhost:3000 https://api.stripe.com https://api.hsforms.com https://forms.hubspot.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self';"

# 2. Compléter le cache pour les images modernes et les polices
<IfModule mod_expires.c>
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/avif "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType font/woff2 "access plus 1 year"
</IfModule>
```

### 5.2 Fichier `robots.txt` & `sitemap.xml`

**`robots.txt`** :
```txt
User-agent: *
Allow: /
Disallow: /dashboard.html
Disallow: /thanks.html
Disallow: /success.html
Disallow: /reset-password.html
Disallow: /documents/
Disallow: /data/
Sitemap: https://noseumcode.fr/sitemap.xml
```

**`sitemap.xml`** :
- Supprimer `/dashboard.html` du sitemap.
- Corriger `<loc>https://noseumcode.fr/index.html</loc>` en `<loc>https://noseumcode.fr/</loc>`.

### 5.3 Compression des Images (Gain > 5 Mo)
- Remplacer `frontend/images/courses/git.webp` (2,73 Mo) et `frontend/images/courses/javascript.webp` (1,52 Mo) par de vraies images WebP compressées à 75% de qualité (taille cible : 45 à 65 Ko).
- Remplacer `frontend/images/favicon.png` (235 Ko) par un favicon optimisé de moins de 15 Ko.

---

## 6. Plan de Test & Recette Post-Implémentation

1. **Test Formulaire HubSpot** : Cliquer sur "Télécharger le programme", vérifier l'absence d'erreur CSP dans la console F12 et tester la bonne réception de l'email.
2. **Test Téléchargements `thanks.html`** : Vérifier que le bouton Git télécharge bien `git&github.pdf` et que le programme complet se télécharge sans erreur 404.
3. **Test Tunnel Stripe** : Tester le clic sur chaque pack (89 €, 179 €, 389 €) et vérifier que le montant transmis à la session Stripe Checkout correspond exactement au panier sélectionné.
4. **Audit SEO & Performance** : Relancer un test Google PageSpeed Insights mobile pour valider que le score LCP repasse sous les 2,5 secondes.
