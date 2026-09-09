const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const frontendDir = __dirname;
const stylesDir = path.join(frontendDir, 'styles');
const distDir = path.join(stylesDir, 'dist');

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

function concatFiles(outputFile, inputFiles) {
  const contents = inputFiles
    .filter(filePath => {
      if (!fs.existsSync(filePath)) {
        console.warn(`⚠️ Fichier introuvable ignoré : ${filePath}`);
        return false;
      }
      return true;
    })
    .map(filePath => fs.readFileSync(filePath, 'utf8'));

  fs.writeFileSync(outputFile, contents.join('\n\n'), 'utf8');
  console.log(`  → concat: ${path.relative(frontendDir, outputFile)}`);
}

function minifyFile(inputPath) {
  const outputPath = inputPath.replace(/\.css$/, '.min.css');
  try {
    execSync(`npx --yes lightningcss-cli --minify --bundle "${inputPath}" -o "${outputPath}"`, {
      stdio: 'ignore'
    });
  } catch (_) {
    const raw = fs.readFileSync(inputPath, 'utf8');
    const minified = raw
      .replace(/\/\*[\s\S]*?\*/g, '')
      .replace(/\s+/g, ' ')
      .replace(/\s*([{}:;,])\s*/g, '$1')
      .replace(/;}/g, '}')
      .trim();
    fs.writeFileSync(outputPath, minified, 'utf8');
  }
  console.log(`  → minify: ${path.relative(frontendDir, outputPath)}`);
}

const BASE_FILES = [
  path.join(stylesDir, 'reset.css'),
  path.join(stylesDir, 'typo', 'typography.css'),
  path.join(stylesDir, 'components', 'utilities.css'),
  path.join(stylesDir, 'components', 'buttons.css'),
  path.join(stylesDir, 'components', 'cards.css'),
  path.join(stylesDir, 'components', 'popover.css'),
  path.join(stylesDir, 'components', 'header.css'),
  path.join(stylesDir, 'components', 'banner.css'),
  path.join(stylesDir, 'components', 'promo-popup.css')
];

// 1. Homepage
console.log('📦 Construction du bundle homepage.css…');
const homepageDist = path.join(distDir, 'homepage.css');
concatFiles(homepageDist, [
  ...BASE_FILES,
  path.join(stylesDir, 'pages', 'thanks.css'),
  path.join(stylesDir, 'pages', 'homepage', 'hero.css'),
  path.join(stylesDir, 'pages', 'homepage', 'presentation.css'),
  path.join(stylesDir, 'pages', 'homepage', 'courses.css'),
  path.join(stylesDir, 'pages', 'homepage', 'blog.css'),
  path.join(stylesDir, 'pages', 'homepage', 'faq.css'),
  path.join(stylesDir, 'pages', 'homepage', 'footer.css')
]);
minifyFile(homepageDist);

// 2. Thanks
console.log('📦 Construction du bundle thanks.css…');
const thanksDist = path.join(distDir, 'thanks.css');
concatFiles(thanksDist, [
  ...BASE_FILES,
  path.join(stylesDir, 'pages', 'thanks.css'),
  path.join(stylesDir, 'pages', 'homepage', 'footer.css')
]);
minifyFile(thanksDist);

// 3. Article
console.log('📦 Construction du bundle article.css…');
const articleDist = path.join(distDir, 'article.css');
concatFiles(articleDist, [
  ...BASE_FILES,
  path.join(stylesDir, 'pages', 'article.css'),
  path.join(stylesDir, 'pages', 'homepage', 'footer.css')
]);
minifyFile(articleDist);

// 4. En construction
console.log('📦 Construction du bundle en-construction.css…');
const enConstDist = path.join(distDir, 'en-construction.css');
concatFiles(enConstDist, [
  ...BASE_FILES,
  path.join(stylesDir, 'pages', 'en-construction.css'),
  path.join(stylesDir, 'pages', 'homepage', 'footer.css')
]);
minifyFile(enConstDist);

console.log('\n✅ Bundles CSS générés avec succès dans frontend/styles/dist/ !');
