# Contexte du Projet — NoSeumCode

## Stack Technique
- **Frontend**: HTML5 sémantique, CSS Vanilla (Lightning CSS pour le bundle/minify), JavaScript Vanilla (ES6+).
- **Styles**: Architecture CSS modulaire (`styles/components/`, `styles/pages/`, `styles/typo/`, compilé dans `styles/dist/`).
- **Serveur de développement**: `live-server` (port 8080).
- **Backend / Intégrations**: HubSpot Forms embed, Apache (`.htaccess`).

## Architecture du projet
- `frontend/index.html`: Page d'accueil principale (hero, présentation, formations, blog, faq).
- `frontend/thanks.html`: Page de remerciement post-inscription avec cartes de téléchargement des programmes PDF (`frontend/documents/`).
- `frontend/article.html`: Page de lecture d'article dynamique basée sur `frontend/data/articles.json`.
- `frontend/en-construction.html`: Page d'attente / maintenance.
- `frontend/partials/`: Composants HTML partagés (`header.html`, `footer.html`, `popovers-shared.html`).
- `frontend/documents/`: Fichiers PDF téléchargeables (`programme-complet.pdf`, `Cours-HTML-CSS.pdf`, `Premiers-pas-avec-JavaScript.pdf`, `git&github.pdf`).
