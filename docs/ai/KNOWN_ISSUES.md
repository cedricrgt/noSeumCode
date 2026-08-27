# Known Issues — NoSeumCode

## Issues Ouvertes

*(Aucune issue ouverte actuellement)*

## Issues Résolues

### ISSUE-001: Téléchargement des PDF redirigeait vers du HTML dans thanks.html
- **Sévérité**: 🔴 critique
- **Description**: Sur Chrome, cliquer sur les boutons de téléchargement de `thanks.html` téléchargeait un fichier `.html` au lieu du `.pdf`.
- **Cause**: Les chemins d'accès (`href`) utilisaient des chemins absolus avec un slash initial (`/documents/...`) ou un chemin parent erroné (`../documents/...`). Lorsque le site était servi localement ou dans un sous-dossier, le serveur renvoyait la page 404/index HTML, que l'attribut `download` sauvegardait sous format HTML.
- **Résolution**: Chemins relatifs `documents/...` corrigés avec attributs explicites `download="nom-fichier.pdf"`.

---

## Fausses Hypothèses à Éviter
- Ne pas supposer que les chemins relatifs à la racine (`/documents/...`) fonctionnent de manière identique en environnement local (`live-server`, sous-dossiers) et en production sans configuration de virtual host dédiée. Toujours privilégier des chemins relatifs cohérents (`documents/...`).
