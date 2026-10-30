# CAHIER DES CHARGES : Urgences Vitales CRO/SEO, Optimisation IA & Architecture Statique

**Projet** : NoSeumCode (https://noseumcode.fr)  
**Date** : 2026-10-03  
**Statut** : Document de spécification pour les Sprints 17, 18 et 19  

---

## Synthèse des Phases et Sprints

### Phase 1 : Urgences Vitales (Sprint 17 — Objectif 24h)
Ces points corrigent des régressions critiques détruisant actuellement le taux de conversion et l'indexation Google.

1. **CRO / Tarification — Aberration du 3x** :
   - Faille : Le paiement en 3x ne peut pas être moins cher que le comptant (ex: Starter à 299 € comptant vs 3x 99 € = 297 € ; Web Pro à 449 € comptant vs 3x 149 € = 447 €).
   - Solution : Starter à 299 € comptant ou 3x 109 € (327 €) ; Web Pro à 449 € comptant ou 3x 160 € (480 €).
   - Fichiers cibles : `frontend/js/cours.js`, `frontend/formations/starter.html`, `frontend/formations/pack-web.html`, Stripe checkout.

2. **SEO / Redirections — Suppression de `<meta http-equiv="refresh">`** :
   - Faille : Les redirections par balise meta dans `cours.html` et `course.html` détruisent le PageRank et créent des frictions crawler.
   - Solution : Supprimer les balises `<meta http-equiv="refresh">` et configurer des redirections 301 HTTP au niveau d'Apache dans `frontend/.htaccess`.

3. **SEO / Indexation — Balise canonical cannibale sur `article.html`** :
   - Faille : La balise `<link rel="canonical" href="https://noseumcode.fr/article.html">` ordonne à Google de désindexer tous les articles de blog individuels servis avec des paramètres d'URL.
   - Solution : Retirer immédiatement cette balise statique erronée.

4. **UX / Lead Gen — CTA Hero sur `workshops.html`** :
   - Faille : Absence de bouton d'appel à l'action au-dessus de la ligne de flottaison sur mobile et desktop.
   - Solution : Ajouter un CTA direct et contrasté dans le hero header sans nécessiter de défilement.

5. **CRO / Entonnoir — Nettoyage de `thanks.html`** :
   - Faille : 4 boutons de téléchargement dispersent l'attention du prospect.
   - Solution : Fusionner les ressources en un seul pack téléchargeable (« Télécharger le Pack Complet ») et utiliser l'espace libéré pour pousser l'offre commerciale.

---

### Phase 2 : Optimisation Stratégique et IA (Sprint 18 — Objectif 1 semaine)
Ces points renforcent l'autorité, la réassurance et l'éligibilité aux moteurs de réponse IA.

1. **AEO (IA) / JSON-LD — Schema.org Course & FAQPage** :
   - Insérer le balisage Schema.org `Course` sur `index.html` pour les deux packs principaux.
   - Ajouter le schéma `FAQPage` sur la section FAQ.
   - Objectif : Sourçage fiable par Perplexity, ChatGPT, Claude et Google AI Overviews.

2. **UX / Offre Mentorat — Transformation en Order Bump HTML** :
   - Sortir le "Suivi Mentor" de la grille de prix principale pour simplifier le choix de premier niveau.
   - Intégrer l'option sous forme d'**Order Bump** (case à cocher +199 €) juste avant le paiement.
   - Contrainte technique : Texte et prix obligatoirement dans le HTML initial (pilotés par CSS/formulaires), pas injectés en JavaScript, afin de rester lisibles par les bots.

3. **Copywriting / Autorité — Activation de la Preuve Sociale** :
   - Remplir et styliser la section "Preuve Sociale" de `index.html`.
   - Remplacer les simples badges d'outils par de vrais retours clients, témoignages concrets et captures de la communauté Discord.

4. **Copywriting / Réassurance — Macaron Garantie 14 Jours** :
   - Sortir la garantie "14 jours satisfait ou remboursé" du petit texte discret en bas de page.
   - Créer un macaron visuel massif et valorisant à proximité immédiate des boutons d'achat pour inverser le risque perçu.

---

### Phase 3 : Assainissement de l'Architecture (Sprint 19 — Objectif 1 mois)
Ces chantiers structurent le site pour maximiser l'acquisition organique pérenne.

1. **Suppression du Client-Side Rendering (CSR) toxique sur Header et Footer** :
   - Problème : L'injection via JavaScript (`<div id="header-placeholder">`) empêche l'exploration des liens de navigation par la plupart des crawlers IA et robots.
   - Solution : Script de build Node.js (`build-static.js`) assemblant `header.html`, les pages et `footer.html` en fichiers HTML statiques complets avant déploiement, sans framework lourd.

2. **Rendu Statique du Blog (SSG Blog)** :
   - Problème : `article.html?id=...` charge le contenu via JS et constitue un trou noir SEO.
   - Solution : Générer une page physique par article (ex: `/blog/apprendre-a-coder.html`) contenant le texte en dur, des balises `<title>`, `<meta>` et Schema.org uniques.

3. **Cohérence Déterministe du Sitemap** :
   - Aligner rigoureusement les URLs déclarées dans `sitemap.xml` avec l'architecture réelle des fichiers statiques générés.
