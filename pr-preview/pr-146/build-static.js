const fs = require("fs");
const path = require("path");

const FRONTEND_DIR = __dirname;
const BUILD_DIR = path.join(FRONTEND_DIR, "dist");
const PARTIALS_DIR = path.join(FRONTEND_DIR, "partials");
const DATA_DIR = path.join(FRONTEND_DIR, "data");
const BLOG_DIR = path.join(BUILD_DIR, "blog");

console.log("Starting SSG build...");

const copyRecursiveSync = (src, dest) => {
  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach(childItemName => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
};

if (!fs.existsSync(BUILD_DIR)) {
  fs.mkdirSync(BUILD_DIR, { recursive: true });
}

fs.readdirSync(FRONTEND_DIR).forEach(file => {
  if (["node_modules", "partials", "dist", "build-static.js", "package.json", "package-lock.json", "build.sh", ".env.example", "data"].includes(file)) return;
  copyRecursiveSync(path.join(FRONTEND_DIR, file), path.join(BUILD_DIR, file));
});

if (fs.existsSync(DATA_DIR)) {
  copyRecursiveSync(DATA_DIR, path.join(BUILD_DIR, "data"));
}

const headerHtml = fs.readFileSync(path.join(PARTIALS_DIR, "header.html"), "utf8");
const footerHtml = fs.readFileSync(path.join(PARTIALS_DIR, "footer.html"), "utf8");
const popoversHtml = fs.readFileSync(path.join(PARTIALS_DIR, "popovers-shared.html"), "utf8");

const processHtmlFile = (filePath) => {
  if (filePath.endsWith("article.html")) return;
  let content = fs.readFileSync(filePath, "utf8");
  content = content.replace(/<div id="header-placeholder"><\/div>/g, headerHtml);
  content = content.replace(/<div id="footer-placeholder"><\/div>/g, footerHtml);
  content = content.replace(/<div id="popovers-placeholder"><\/div>/g, popoversHtml);
  
  // Nettoyage des scripts de rendu CSR client
  content = content.replace(/<script\b[^>]*?\bsrc=["'][^"']*?article(?:\.min)?\.js(?:\?[^"']*)?["'][^>]*?>\s*<\/script>\s*/gi, "");
  
  // Les pages interactives conservent header.min.js (auth, stripe checkout, cart)
  const isInteractive = ["index.html", "dashboard.html", "app.html", "workshops.html", "starter.html", "pack-web.html"].some(p => filePath.endsWith(p));
  if (!isInteractive) {
    content = content.replace(/<script\b[^>]*?\bsrc=["'][^"']*?header(?:\.min)?\.js(?:\?[^"']*)?["'][^>]*?>\s*<\/script>\s*/gi, "");
  }
  
  fs.writeFileSync(filePath, content, "utf8");
};

const findHtmlFiles = (dir) => {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(findHtmlFiles(filePath));
    } else if (filePath.endsWith(".html")) {
      results.push(filePath);
    }
  });
  return results;
};

const htmlFiles = findHtmlFiles(BUILD_DIR);
htmlFiles.forEach(processHtmlFile);

console.log("Generating Blog Pages (SSG)...");
if (!fs.existsSync(BLOG_DIR)) fs.mkdirSync(BLOG_DIR, { recursive: true });

const articlesData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, "articles.json"), "utf8"));
const templateHtml = fs.readFileSync(path.join(FRONTEND_DIR, "article.html"), "utf8");

for (const [id, article] of Object.entries(articlesData)) {
  let content = templateHtml;
  
  content = content.replace(/href="(?!(https?:|#|\/))([^"]+?\.(?:css|html|xml|png|jpg|webp|js|svg)(?:\?[^"]*)?)"/g, 'href="../$2"');
  content = content.replace(/src="(?!(https?:|#|\/))([^"]+?\.(?:js|png|jpg|webp|svg)(?:\?[^"]*)?)"/g, 'src="../$2"');
  
  content = content.replace(/<title>.*?<\/title>/, `<title>${article.title} - NoSeumCode</title>`);
  content = content.replace(/<meta name="description" id="meta-description" content=".*?">/, `<meta name="description" id="meta-description" content="${article.description}">`);
  content = content.replace(/<meta property="og:title" id="og-title" content=".*?">/, `<meta property="og:title" id="og-title" content="${article.title}">`);
  content = content.replace(/<meta property="og:description" id="og-description" content=".*?">/, `<meta property="og:description" id="og-description" content="${article.description}">`);
  content = content.replace(/<meta property="og:image" id="og-image" content=".*?">/, `<meta property="og:image" id="og-image" content="${article.image}">`);
  content = content.replace(/<meta property="og:url" content=".*?">/, `<meta property="og:url" content="https://noseumcode.fr/blog/${id}.html">`);
  
  let adjustedHeaderHtml = headerHtml.replace(/href="(?!(http|#))([^"]+)"/g, 'href="../$2"').replace(/src="(?!(http|#))([^"]+)"/g, 'src="../$2"');
  let adjustedFooterHtml = footerHtml.replace(/href="(?!(http|#))([^"]+)"/g, 'href="../$2"').replace(/src="(?!(http|#))([^"]+)"/g, 'src="../$2"');
  let adjustedPopoversHtml = popoversHtml.replace(/href="(?!(http|#))([^"]+)"/g, 'href="../$2"').replace(/src="(?!(http|#))([^"]+)"/g, 'src="../$2"');
  
  content = content.replace(/<div id="header-placeholder"><\/div>/g, adjustedHeaderHtml);
  content = content.replace(/<div id="footer-placeholder"><\/div>/g, adjustedFooterHtml);
  content = content.replace(/<div id="popovers-placeholder"><\/div>/g, adjustedPopoversHtml);
  content = content.replace(/<script\b[^>]*?\bsrc=["'][^"']*?header(?:\.min)?\.js(?:\?[^"']*)?["'][^>]*?>\s*<\/script>\s*/gi, "");
  content = content.replace(/<script\b[^>]*?\bsrc=["'][^"']*?article(?:\.min)?\.js(?:\?[^"']*)?["'][^>]*?>\s*<\/script>\s*/gi, "");
  
  const schemaLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://noseumcode.fr/" },
          { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://noseumcode.fr/index.html#blog" },
          { "@type": "ListItem", "position": 3, "name": article.title, "item": `https://noseumcode.fr/blog/${id}.html` }
        ]
      },
      {
        "@type": "Article",
        "headline": article.title,
        "description": article.description,
        "image": article.image,
        "author": { "@type": "Person", "name": "Cédric Ragot", "jobTitle": "Ingénieur Senior & Formateur NoSeumCode" },
        "publisher": { "@type": "Organization", "name": "NoSeumCode", "logo": { "@type": "ImageObject", "url": "https://noseumcode.fr/images/favicon.png" } },
        "datePublished": "2026-09-30",
        "dateModified": "2026-09-30",
        "mainEntityOfPage": `https://noseumcode.fr/blog/${id}.html`
      }
    ]
  };
  
  const schemaScript = `\n    <script id="schema-article" type="application/ld+json">\n${JSON.stringify(schemaLd, null, 2)}\n    </script>`;
  content = content.replace('</head>', `${schemaScript}\n  </head>`);
  
  const articleHtmlBody = `
      <section class="article-hero">
        <img src="../${article.image.replace('https://noseumcode.fr/', '')}" alt="${article.title}" class="article-hero__image">
        <div class="article-hero__content">
          <h1 class="article-hero__title bangers-regular">${article.title}</h1>
          <p class="article-hero__subtitle poppins-regular">${article.subtitle}</p>
        </div>
      </section>
      <div class="article-container">
        <nav aria-label="Fil d'Ariane" class="breadcrumb">
          <ol class="breadcrumb__list">
            <li class="breadcrumb__item"><a href="../index.html" class="breadcrumb__link">Accueil</a></li>
            <li class="breadcrumb__separator" aria-hidden="true">/</li>
            <li class="breadcrumb__item"><a href="../index.html#blog" class="breadcrumb__link">Blog</a></li>
            <li class="breadcrumb__separator" aria-hidden="true">/</li>
            <li class="breadcrumb__item" aria-current="page">${article.title}</li>
          </ol>
        </nav>
        <article>
          <div class="article-meta">
            <div class="article-meta__author">
              <img src="../images/mentor-cedric.webp" alt="Cédric Ragot" class="article-meta__avatar" width="34" height="34" />
              <span>Par Cédric Ragot</span>
            </div>
            <div class="article-meta__item">
              <span aria-hidden="true">•</span>
              <time datetime="2026-09-30">30 septembre 2026</time>
            </div>
            <div class="article-meta__item">
              <span aria-hidden="true">•</span>
              <span>Lecture : ~5 min</span>
            </div>
          </div>
          <div class="article-tags">
            ${article.tags.map(tag => `<span class="article-tag">${tag}</span>`).join('')}
          </div>
          <p class="article-intro">${article.intro}</p>
          <div class="article-body">
            ${article.sections.map(sec => `
              <section class="article-section">
                <h2 class="bangers-regular">${sec.heading}</h2>
                <p>${sec.text}</p>
              </section>
            `).join('')}
          </div>
          <aside class="article-cta-box">
            <div class="article-cta-box__content">
              <span class="section-tag" style="background: rgba(0, 255, 135, 0.15); color: #00ff87;">Passe à l'action</span>
              <h3 class="bangers-regular">Prêt à construire tes propres projets web ?</h3>
              <p class="poppins-regular">
                Rejoins nos parcours interactifs dès 299 € (ou 3x 109 € sans frais) avec garantie 14 jours satisfait ou remboursé, ou télécharge notre programme complet de formation.
              </p>
              <div class="article-cta-box__buttons">
                <a href="../index.html#parcours" class="button button__primary bangers-regular">
                  Découvrir les Packs NoSeumCode ↓
                </a>
                <button type="button" popovertarget="hubspot-popover" class="button button__secondary bangers-regular">
                  Télécharger le Programme (PDF)
                </button>
              </div>
            </div>
          </aside>
          <section class="article-author-card">
            <div class="article-author-card__avatar">
              <img src="../images/mentor-cedric.webp" alt="Cédric Ragot, mentor NoSeumCode" width="80" height="80" loading="lazy">
            </div>
            <div class="article-author-card__info">
              <h3 class="bangers-regular">Cédric Ragot</h3>
              <p class="article-author-card__role">Ingénieur Senior &amp; Formateur NoSeumCode</p>
              <p class="article-author-card__bio">
                Ingénieur senior et formateur, il a développé des plateformes web complexes en production avant de fonder NoSeumCode pour enseigner le code aux débutants avec une pédagogie 100% pratique, humaine et sans jargon inutile.
              </p>
            </div>
          </section>
          <div class="article-conclusion">
            <p class="poppins-regular">${article.conclusion}</p>
            <a href="../index.html#parcours" class="button button__primary bangers-regular">
              Rejoindre NoSeumCode
            </a>
          </div>
          <div style="margin-top: 3rem; text-align: center;">
            <a href="../index.html" class="back-link bangers-regular" style="font-size: 1.15rem;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              ← Retour à l'accueil
            </a>
          </div>
        </article>
  `;
  
  content = content.replace(/<main id="article-content">[\s\S]*?<\/main>/, `<main id="article-content">\n        <div class="article-container">\n${articleHtmlBody}\n        </div>\n      </main>`);
  
  fs.writeFileSync(path.join(BLOG_DIR, `${id}.html`), content, "utf8");
  const frontendBlogDir = path.join(FRONTEND_DIR, "blog");
  if (!fs.existsSync(frontendBlogDir)) fs.mkdirSync(frontendBlogDir, { recursive: true });
  fs.writeFileSync(path.join(frontendBlogDir, `${id}.html`), content, "utf8");
  console.log(`Generated blog post: /blog/${id}.html`);
}

if (fs.existsSync(path.join(BUILD_DIR, "article.html"))) {
  fs.unlinkSync(path.join(BUILD_DIR, "article.html"));
}

console.log("Build SSG finished.");
