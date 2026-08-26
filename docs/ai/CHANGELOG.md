# Changelog — NoSeumCode

## [2026-08-26] Correction des liens de téléchargement PDF dans thanks.html
- **Conversation**: Correction du bug de téléchargement Chrome vers .html
- **Ce qui a changé**:
  - Dans [thanks.html](file:///d:/Archive-mac/dev/code-bangers/frontend/thanks.html), correction des URLs `href` qui ciblaient `/documents/...` et `../documents/...`.
  - Passage en chemins relatifs directs `documents/...` et ajout des attributs explicites `download="nom.pdf"`.
- **Résultat**: Les 4 fichiers PDF sont désormais correctement téléchargés par le navigateur sans redirection 404 / HTML.
