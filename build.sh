#!/bin/bash

set -e

STYLES="styles"
DIST="$STYLES/dist"

mkdir -p "$DIST"

# ─── Helpers ────────────────────────────────────────────────────────────────

concat() {
  local output="$1"
  shift
  cat "$@" > "$output"
  echo "  → concat: $output"
}

minify() {
  local input="$1"
  local output="${input%.css}.min.css"
  npx --yes lightningcss-cli --minify --bundle "$input" -o "$output" 2>/dev/null \
    || cp "$input" "$output"
  echo "  → minify: $output"
}

# ─── Shared base (reset + typo + all components) ────────────────────────────

BASE_FILES=(
  "$STYLES/reset.css"
  "$STYLES/typo/typography.css"
  "$STYLES/components/utilities.css"
  "$STYLES/components/buttons.css"
  "$STYLES/components/cards.css"
  "$STYLES/components/popover.css"
  "$STYLES/components/header.css"
  "$STYLES/components/banner.css"
  "$STYLES/components/promo-popup.css"
)

# ─── Homepage bundle ────────────────────────────────────────────────────────

echo "Building homepage bundle…"
concat "$DIST/homepage.css" \
  "${BASE_FILES[@]}" \
  "$STYLES/pages/thanks.css" \
  "$STYLES/pages/homepage/hero.css" \
  "$STYLES/pages/homepage/presentation.css" \
  "$STYLES/pages/homepage/courses.css" \
  "$STYLES/pages/homepage/blog.css" \
  "$STYLES/pages/homepage/faq.css" \
  "$STYLES/pages/homepage/footer.css"
minify "$DIST/homepage.css"

# ─── Thanks bundle ──────────────────────────────────────────────────────────

echo "Building thanks bundle…"
concat "$DIST/thanks.css" \
  "${BASE_FILES[@]}" \
  "$STYLES/pages/thanks.css" \
  "$STYLES/pages/homepage/footer.css"
minify "$DIST/thanks.css"

# ─── Article bundle ─────────────────────────────────────────────────────────

echo "Building article bundle…"
concat "$DIST/article.css" \
  "${BASE_FILES[@]}" \
  "$STYLES/pages/article.css" \
  "$STYLES/pages/homepage/footer.css"
minify "$DIST/article.css"

# ─── En-construction bundle ─────────────────────────────────────────────────

echo "Building en-construction bundle…"
concat "$DIST/en-construction.css" \
  "${BASE_FILES[@]}" \
  "$STYLES/pages/en-construction.css" \
  "$STYLES/pages/homepage/footer.css"
minify "$DIST/en-construction.css"

echo ""
echo "✅ CSS bundles built in $DIST/"
ls -lh "$DIST/"*.min.css

# ─── Image optimization ─────────────────────────────────────────────────────

IMG_SRC="images"
IMG_DIST="images/dist"

if command -v convert &>/dev/null; then
  echo ""
  echo "Optimizing images…"

  mkdir -p "$IMG_DIST/courses" "$IMG_DIST/header"

  # Course images: cards displayed at ~320x250 CSS → 640x500 WebP @2x retina
  for src in "$IMG_SRC/courses/git.webp" "$IMG_SRC/courses/html.webp" "$IMG_SRC/courses/javascript.webp"; do
    name=$(basename "$src" .jpg)
    out="$IMG_DIST/courses/$name.webp"
    convert "$src" -resize 640x500^ -gravity center -extent 640x500 -quality 80 "$out"
    echo "  → $out ($(du -sh "$out" | cut -f1))"
  done

  # Logo: displayed at 80×60 CSS → 160×120 WebP @2x retina
  convert "$IMG_SRC/header/logo.png" -resize 160x120 -quality 90 "$IMG_DIST/header/logo.webp"
  echo "  → $IMG_DIST/header/logo.webp ($(du -sh "$IMG_DIST/header/logo.webp" | cut -f1))"

  echo "✅ Images optimized in $IMG_DIST/"
else
  echo ""
  echo "⚠️  ImageMagick not found — skipping image optimization (run: brew install imagemagick)"
fi

