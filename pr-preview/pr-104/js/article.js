async function loadArticle() {
  const contentArea = document.getElementById("article-content");
  const params = new URLSearchParams(window.location.search);
  const articleId = params.get("id");

  if (!articleId) {
    contentArea.innerHTML =
      '<div class="article-container"><h1>Article non trouvé</h1><a href="index.html">Retour</a></div>';
    return;
  }

  try {
    const response = await fetch("data/articles.json");
    if (!response.ok) throw new Error("Erreur lors du chargement des données");
    
    const articlesData = await response.json();
    const article = articlesData[articleId];

    if (!article) {
      contentArea.innerHTML =
        '<div class="article-container"><h1>Article non trouvé</h1><a href="index.html">Retour</a></div>';
      return;
    }

    document.title = `${article.title} - NoSeumCode`;
    const metaDesc = document.getElementById("meta-description");
    if (metaDesc) metaDesc.setAttribute("content", article.description);

    const ogTitle = document.getElementById("og-title");
    if (ogTitle) ogTitle.setAttribute("content", article.title);

    const ogDesc = document.getElementById("og-description");
    if (ogDesc) ogDesc.setAttribute("content", article.description);

    const ogImg = document.getElementById("og-image");
    if (ogImg) ogImg.setAttribute("content", article.image);

    // Injection Schema.org JSON-LD
    let schemaScript = document.getElementById("schema-article");
    if (!schemaScript) {
      schemaScript = document.createElement("script");
      schemaScript.id = "schema-article";
      schemaScript.type = "application/ld+json";
      document.head.appendChild(schemaScript);
    }
    const currentUrl = window.location.href;
    schemaScript.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Accueil",
              "item": "https://noseumcode.fr/"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Blog",
              "item": "https://noseumcode.fr/index.html#blog"
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": article.title,
              "item": currentUrl
            }
          ]
        },
        {
          "@type": "Article",
          "headline": article.title,
          "description": article.description,
          "image": article.image,
          "author": {
            "@type": "Person",
            "name": "Cédric Ragot",
            "jobTitle": "Ingénieur Senior & Formateur NoSeumCode"
          },
          "publisher": {
            "@type": "Organization",
            "name": "NoSeumCode",
            "logo": {
              "@type": "ImageObject",
              "url": "https://noseumcode.fr/images/favicon.png"
            }
          },
          "datePublished": "2026-09-30",
          "dateModified": "2026-09-30",
          "mainEntityOfPage": currentUrl
        }
      ]
    });

    contentArea.innerHTML = `
      <section class="article-hero">
        <img src="${article.image}" alt="${article.title}" class="article-hero__image">
        <div class="article-hero__content">
          <h1 class="article-hero__title bangers-regular">${article.title}</h1>
          <p class="article-hero__subtitle poppins-regular">${article.subtitle}</p>
        </div>
      </section>
      <div class="article-container">
        <nav aria-label="Fil d'Ariane" class="breadcrumb">
          <ol class="breadcrumb__list">
            <li class="breadcrumb__item"><a href="index.html" class="breadcrumb__link">Accueil</a></li>
            <li class="breadcrumb__separator" aria-hidden="true">/</li>
            <li class="breadcrumb__item"><a href="index.html#blog" class="breadcrumb__link">Blog</a></li>
            <li class="breadcrumb__separator" aria-hidden="true">/</li>
            <li class="breadcrumb__item" aria-current="page">${article.title}</li>
          </ol>
        </nav>

        <article>
          <div class="article-meta">
            <div class="article-meta__author">
              <img src="images/mentor-cedric.webp" alt="Cédric Ragot" class="article-meta__avatar" width="34" height="34" />
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
            ${article.tags
              .map((tag) => `<span class="article-tag">${tag}</span>`)
              .join("")}
          </div>

          <p class="article-intro">${article.intro}</p>

          <div class="article-body">
            ${article.sections
              .map(
                (section) => `
              <section class="article-section">
                <h2 class="bangers-regular">${section.heading}</h2>
                <p>${section.text}</p>
              </section>
            `
              )
              .join("")}
          </div>

          <!-- Encadré d'appel à l'action contextuel (Sprint 16 / Task 16.3) -->
          <aside class="article-cta-box">
            <div class="article-cta-box__content">
              <span class="section-tag" style="background: rgba(0, 255, 135, 0.15); color: #00ff87;">Passe à l'action</span>
              <h3 class="bangers-regular">Prêt à construire tes propres projets web ?</h3>
              <p class="poppins-regular">
                Rejoins nos parcours interactifs dès 89 € avec garantie 14 jours satisfait ou remboursé, ou télécharge notre programme complet de formation.
              </p>
              <div class="article-cta-box__buttons">
                <a href="index.html#parcours" class="button button__primary bangers-regular">
                  Découvrir les 3 Packs NoSeumCode →
                </a>
                <button type="button" popovertarget="hubspot-popover" class="button button__secondary bangers-regular">
                  Télécharger le Programme (PDF)
                </button>
              </div>
            </div>
          </aside>

          <!-- Bio auteur formateur -->
          <section class="article-author-card">
            <div class="article-author-card__avatar">
              <img src="images/mentor-cedric.webp" alt="Cédric Ragot, mentor NoSeumCode" width="80" height="80" loading="lazy">
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
            <a href="index.html#parcours" class="button button__primary bangers-regular">
              Rejoindre NoSeumCode
            </a>
          </div>

          <div style="margin-top: 3rem; text-align: center;">
            <a href="index.html" class="back-link bangers-regular" style="font-size: 1.15rem;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              ← Retour à l'accueil
            </a>
          </div>
        </article>
      </div>
    `;
  } catch (error) {
    console.error("Error loading article:", error);
    contentArea.innerHTML =
      '<div class="article-container"><h1>Erreur lors du chargement</h1><p>Vérifiez que vous utilisez bien un serveur local (Live Server).</p><a href="index.html">Retour</a></div>';
  }
}

document.addEventListener("DOMContentLoaded", loadArticle);
