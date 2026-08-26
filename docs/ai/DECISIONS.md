# Architecture Decisions — NoSeumCode

## Décisions

### ADR-001: Liens de ressources statiques en chemins relatifs
- **Statut**: Acceptée
- **Contexte**: Les assets statiques (CSS, JS, PDF) étaient référencés parfois avec un slash initial `/` et parfois en relatif. Cela provoquait des erreurs 404 sur les sous-chemins et les serveurs de prévisualisation comme `live-server`.
- **Décision**: Utiliser des chemins relatifs cohérents (ex: `documents/fichier.pdf`, `styles/dist/...`) sur toutes les pages HTML.
- **Alternative rejetée**: Forcer des chemins absolus `/documents/...`, ce qui casse le support du déploiement en sous-dossier ou sur des serveurs de développement locaux sans racine dédiée.
