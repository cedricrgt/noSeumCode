#!/bin/bash

# ============================================================
# NoSeumCode – Build Script
# Concatène tous les CSS en un seul bundle pour la prod
# Usage: ./build.sh
# ============================================================

set -e

OUTPUT="styles/bundle.css"

echo "🏗️  Build NoSeumCode..."

# Supprimer l'ancien bundle
rm -f "$OUTPUT"

# Ordre d'import (respecte les dépendances)
CSS_FILES=(
  "styles/reset.css"
  "styles/typo/typography.css"
  "styles/components/utilities.css"
  "styles/components/buttons.css"
  "styles/components/cards.css"
  "styles/components/popover.css"
  "styles/components/header.css"
  "styles/components/banner.css"
  "styles/components/promo-popup.css"
  "styles/pages/thanks.css"
  "styles/pages/article.css"
  "styles/pages/en-construction.css"
  "styles/pages/homepage/hero.css"
  "styles/pages/homepage/presentation.css"
  "styles/pages/homepage/courses.css"
  "styles/pages/homepage/blog.css"
  "styles/pages/homepage/faq.css"
  "styles/pages/homepage/footer.css"
)

for file in "${CSS_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "/* === $file === */" >> "$OUTPUT"
    cat "$file" >> "$OUTPUT"
    echo "" >> "$OUTPUT"
  else
    echo "⚠️  Fichier manquant : $file"
  fi
done

echo "✅  Bundle CSS généré : $OUTPUT ($(du -h $OUTPUT | cut -f1))"
echo "🎉  Build terminé !"
