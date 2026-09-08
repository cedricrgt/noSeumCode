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

    contentArea.innerHTML = `
      <section class="article-hero">
        <img src="${article.image}" alt="${article.title}" class="article-hero__image">
        <div class="article-hero__content">
          <h1 class="article-hero__title bangers-regular">${article.title}</h1>
          <p class="article-hero__subtitle poppins-regular">${article.subtitle}</p>
        </div>
      </section>
      <div class="article-container">
        <article>
          <a href="index.html" class="back-link bangers-regular">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Retour à l'accueil
          </a>
          
          <div class="article-tags">
            ${article.tags
              .map((tag) => `<span class="article-tag">${tag}</span>`)
              .join("")}
          </div>

          <p class="article-intro">${article.intro}</p>

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

          <div class="article-conclusion">
            <p class="poppins-regular">${article.conclusion}</p>
            <button type="button" class="button button__primary bangers-regular" onclick="window.openGlobalAuthModal ? window.openGlobalAuthModal('register') : openAuthModal('register')">
              Rejoindre NoSeumCode
            </button>
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
