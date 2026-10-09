// ========================================================
// NoSeumCode - Reusable Course Classroom Component (RBAC)
// ========================================================

const API_BASE = (typeof window !== "undefined" && window.API_BASE_URL) ? window.API_BASE_URL : "https://api.noseumcode.fr";

let allCourses = [];
let userEnrollments = [];
let currentCourse = null;
let courseChapters = [];
let activeChapterId = null;
let currentRole = "GUEST"; // "GUEST", "STUDENT", "TEACHER", "ADMIN"
let currentUser = null;

function getAuthToken() {
  return localStorage.getItem("noseum_token") || "";
}

function getStoredUser() {
  try {
    const raw = localStorage.getItem("noseum_user");
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
}

async function coursApiFetch(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const base = (typeof window !== "undefined" && window.API_BASE_URL)
    ? window.API_BASE_URL
    : (API_BASE || "https://api.noseumcode.fr");

  try {
    const res = await fetch(`${base}${endpoint}`, {
      ...options,
      headers
    });
    return res;
  } catch (err) {
    console.warn("API Fetch error, fallback enabled:", err);
    return null;
  }
}

// ========================================================
// 1. Initialisation & Routing
// ========================================================

async function initCoursPage() {
  currentUser = getStoredUser();
  if (currentUser && currentUser.role) {
    currentRole = currentUser.role.toUpperCase();
  } else {
    currentRole = "GUEST";
  }

  const params = new URLSearchParams(window.location.search);
  let courseId = params.get("id");
  let requestedChapterId = params.get("chap");
  const autoCheckout = params.get("auto_checkout") === "true" || params.get("checkout") === "true";

  await loadInitialData();

  if (courseId) {
    await loadSingleCourse(courseId, requestedChapterId);
    if (autoCheckout) {
      setTimeout(() => {
        initiateStripeCheckout(courseId);
      }, 300);
    }
  } else {
    renderCourseCatalog();
  }
}

function getCourseImage(course) {
  if (course.imageUrl) return course.imageUrl;
  const title = ((course.title || "") + " " + (course.description || "")).toLowerCase();
  if (title.includes("vip") || title.includes("goat") || title.includes("mentorat")) {
    return "images/courses/javascript.webp";
  }
  if (title.includes("html") || title.includes("css") || title.includes("fondation")) {
    return "images/courses/html.webp";
  }
  if (title.includes("javascript") || title.includes("js") || title.includes("dynamique")) {
    return "images/courses/javascript.webp";
  }
  if (title.includes("git") || title.includes("github")) {
    return "images/courses/html.webp";
  }
  if (title.includes("java") || title.includes("spring")) {
    return "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop";
  }
  if (title.includes("architecture") || title.includes("ddd") || title.includes("clean")) {
    return "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop";
  }
  return "images/courses/html.webp";
}

function formatCoursePrice(course) {
  if (course && course.priceInCents && course.priceInCents > 0) {
    return (course.priceInCents / 100).toFixed(0) + " €";
  }
  const tier = course && (course.requiredTier || "").toUpperCase();
  if (tier === "VIP" || (course && (course.slug === "pack-mentorat-vip" || (course.title && (course.title.toLowerCase().includes("vip") || course.title.toLowerCase().includes("goat")))))) {
    return "648 €";
  }
  if (tier === "STARTER" || (course && (course.slug === "pack-starter" || course.slug === "html-css" || (course.title && course.title.toLowerCase().includes("starter"))))) {
    return "299 €";
  }
  return "449 €";
}

async function loadInitialData() {
  // 1. Charger tous les cours
  const coursesRes = await coursApiFetch("/api/courses");
  if (coursesRes && coursesRes.ok) {
    const rawCourses = await coursesRes.json();
    // Aligner sur les 3 Packages officiels (ADR-013, Sprint 14 & Briefing 2026-09)
    allCourses = rawCourses.map(course => {
      const slug = (course.slug || "").toLowerCase();
      const title = (course.title || "").toLowerCase();
      if (course.id === "c1000000-0000-0000-0000-000000000001" || slug === "html-css" || slug === "pack-starter" || title.includes("starter") || title.includes("fondation")) {
        return {
          ...course,
          slug: "pack-starter",
          title: "Pack Starter – Les Fondations du Web",
          description: "Les fondations indispensables du web moderne : structure HTML5, design CSS3, Flexbox & Grid, responsive mobile et 2 projets portfolio complets.",
          priceInCents: course.priceInCents || 29900,
          requiredTier: "STARTER",
          level: "DEBUTANT",
          imageUrl: course.imageUrl || "images/courses/html.webp"
        };
      }
      if (course.id === "c2000000-0000-0000-0000-000000000002" || slug === "javascript" || slug === "pack-web-pro" || slug === "pack-web" || title.includes("web pro") || title.includes("dynamique")) {
        return {
          ...course,
          slug: "pack-web-pro",
          title: "Pack Web Pro – L'Autonomie Complète",
          description: "Deviens un développeur web frontend autonome : tout le Pack Starter + JavaScript ES6+, manipulation du DOM, requêtes API et bonus Git & GitHub offert.",
          priceInCents: course.priceInCents || 44900,
          requiredTier: "WEB",
          level: "INTERMEDIAIRE",
          imageUrl: course.imageUrl || "images/courses/javascript.webp"
        };
      }
      if (course.id === "c3000000-0000-0000-0000-000000000003" || slug === "git-github" || slug === "pack-mentorat-vip" || title.includes("vip") || title.includes("mentorat")) {
        return {
          ...course,
          slug: "pack-mentorat-vip",
          title: "Pack Mentorat VIP – L'Accompagnement Sur-Mesure",
          description: "L'accélération ultime avec un formateur senior dédié : tout le Pack Web Pro + 4h de mentorat individuel en visio, revues de code et coaching carrière.",
          priceInCents: course.priceInCents || 64800,
          requiredTier: "VIP",
          level: "ACCOMPAGNE",
          imageUrl: course.imageUrl || "images/courses/javascript.webp"
        };
      }
      return course;
    });
  } else {
    // Fallback seed 2 packs officiels (Starter 299 €, Web Pro 449 €)
    allCourses = [
      {
        id: "c1000000-0000-0000-0000-000000000001",
        slug: "pack-starter",
        title: "Pack Starter – Les Fondations du Web",
        description: "Les fondations indispensables du web moderne : structure HTML5, design CSS3, Flexbox & Grid, responsive mobile et 2 projets portfolio complets.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
        createdByName: "Admin CodeBangers",
        updatedByName: "Admin CodeBangers",
        imageUrl: "images/courses/html.webp",
        priceInCents: 8900,
        currency: "EUR",
        level: "DEBUTANT",
        requiredTier: "STARTER",
        isPublished: true,
        chaptersCount: 4
      },
      {
        id: "c2000000-0000-0000-0000-000000000002",
        slug: "pack-web-pro",
        title: "Pack Web Pro – L'Autonomie Complète",
        description: "Deviens un développeur web frontend autonome : tout le Pack Starter + JavaScript ES6+, manipulation du DOM, requêtes API et bonus Git & GitHub offert.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 25).toISOString(),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
        createdByName: "Admin CodeBangers",
        updatedByName: "Admin CodeBangers",
        imageUrl: "images/courses/javascript.webp",
        priceInCents: 17900,
        currency: "EUR",
        level: "INTERMEDIAIRE",
        requiredTier: "WEB",
        isPublished: true,
        chaptersCount: 6
      },
      {
        id: "c3000000-0000-0000-0000-000000000003",
        slug: "pack-mentorat-vip",
        title: "Pack Mentorat VIP – L'Accompagnement Sur-Mesure",
        description: "L'accélération ultime avec un formateur senior dédié : tout le Pack Web Pro + 4h de mentorat individuel en visio, revues de code et coaching carrière.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
        createdByName: "Cédric Ragot",
        updatedByName: "Cédric Ragot",
        imageUrl: "images/courses/javascript.webp",
        priceInCents: 64800,
        currency: "EUR",
        level: "ACCOMPAGNE",
        requiredTier: "VIP",
        isPublished: true,
        chaptersCount: 6
      }
    ];
  }

  // 2. Charger les inscriptions de l'utilisateur connecté si STUDENT
  if (currentUser) {
    const enrollRes = await coursApiFetch("/api/enrollments/my-courses");
    if (enrollRes && enrollRes.ok) {
      userEnrollments = await enrollRes.json();
    } else {
      userEnrollments = [];
    }
  }
}

// ========================================================
// 2. Vue Catalogue / Hub des Formations
// ========================================================

function renderCourseCatalog() {
  const contentArea = document.getElementById("cours-content");
  if (!contentArea) return;

  document.title = "Espace de Formation - NoSeumCode";

  let roleHeaderTag = "";
  if (currentRole === "STUDENT") {
    roleHeaderTag = `<span class="course-badge-role">🎓 Mes Parcours Inscrits</span>`;
  } else if (currentRole === "TEACHER") {
    roleHeaderTag = `<span class="course-badge-role">👨‍🏫 Espace Enseignant (Édition)</span>`;
  } else if (currentRole === "ADMIN") {
    roleHeaderTag = `<span class="course-badge-role">🛡️ Administration Globale</span>`;
  }

  let filteredCourses = allCourses;

  contentArea.innerHTML = `
    <div class="catalog-container">
      <div class="catalog-header">
        <div>
          <a href="index.html" class="back-link bangers-regular" style="margin-bottom: 0.5rem;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Retour à l'accueil
          </a>
          <h1 class="course-title" style="font-size: 2.8rem; margin: 0.5rem 0; color: var(--dark-navy);">Nos Parcours</h1>
          <p style="color: #64748b; font-size: 1.05rem; margin: 0;">Accès immédiat, vidéos courtes et percutantes, exercices corrigés et garantie satisfait ou remboursé.</p>
        </div>
        <div>
          ${roleHeaderTag}
          ${currentRole === "TEACHER" || currentRole === "ADMIN" ? `
            <button class="button button__primary bangers-regular" style="padding: 10px 20px; font-size: 1.1rem; margin-left: 0.75rem;" onclick="openCreateCourseModal()">
              + Créer un parcours
            </button>
          ` : ""}
        </div>
      </div>

      <!-- Bannière Les 3 Packs & Klarna BNPL -->
      <div style="background: rgba(0, 255, 135, 0.08); border: 1px solid rgba(0, 255, 135, 0.3); border-radius: 12px; padding: 1rem 1.25rem; margin-bottom: 2rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <span style="font-size: 1.5rem;">🔥</span>
          <div>
            <strong style="color: var(--dark-navy); font-size: 1.05rem;">Nouvelle Offre NoSeumCode : Les 3 Packs d'Apprentissage Web</strong>
            <p style="margin: 0; font-size: 0.88rem; color: #475569;">Paiement fractionné en 2x ou 3x sans frais disponible avec <strong>Klarna</strong> • Accès à vie et garantie 14 jours satisfait ou remboursé.</p>
          </div>
        </div>
        <span style="background: #ffb3c7; color: #0a0a0a; font-weight: 700; font-size: 0.78rem; padding: 4px 10px; border-radius: 999px;">Paiement Klarna 2x/3x</span>
      </div>

      <div class="card-grid">
        ${filteredCourses.map(course => {
          let enrollmentInfo = null;
          if (currentUser) {
            enrollmentInfo = userEnrollments.find(e => e.courseId === course.id);
          }

          const price = formatCoursePrice(course);
          const rawTier = (course.requiredTier || "").toUpperCase();
          const slug = (course.slug || "").toLowerCase();
          
          let tier = "STARTER";
          let tierLabel = "Pack Starter";
          let levelLabel = "Débutant";
          let tierColor = "#0284c7";
          let tierBg = "rgba(2, 132, 199, 0.12)";
          let popularBadge = `<span style="background: rgba(0, 217, 255, 0.15); color: #00d9ff; font-size: 0.72rem; font-weight: 700; padding: 2px 8px; border-radius: 4px;">Idéal Débutant</span>`;
          let installmentHtml = `<div style="font-size: 0.8rem; color: #334155; display: flex; align-items: center; gap: 0.35rem; margin-top: 0.4rem;"><span style="background: #ffb3c7; color: #0a0a0a; font-weight: 700; font-size: 0.68rem; padding: 1px 5px; border-radius: 3px;">Klarna</span> ou <strong>3x 109 €</strong> sans frais</div>`;
          let featuresHtml = `
            <ul class="package-features poppins-regular" style="text-align: left; list-style: none; padding: 0; line-height: 1.6; font-size: 0.82rem; margin: 0.75rem 0; color: #475569;">
              <li>✓ <strong>Formation HTML5 Complète</strong> (Structure & SEO)</li>
              <li>✓ <strong>Formation CSS3 Moderne</strong> (Flexbox & Grid)</li>
              <li>✓ <strong>Responsive Design</strong> (Mobile-First)</li>
              <li>✓ <strong>2 Projets de Portfolio</strong> (Bio-Link + Landing Page)</li>
              <li>✓ <strong>Accès Communauté Discord</strong> d'entraide</li>
            </ul>
          `;
          let isFeatured = false;
          let btnText = `Choisir le Pack Starter • 299 €`;

          if (rawTier === "VIP" || slug === "pack-mentorat-vip" || slug === "git-github" || (course.title && course.title.toLowerCase().includes("vip"))) {
            tier = "VIP";
            tierLabel = "Pack Mentorat VIP";
            levelLabel = "Accompagné";
            tierColor = "#d97706";
            tierBg = "rgba(217, 119, 6, 0.12)";
            popularBadge = `<span style="background: rgba(255, 51, 102, 0.15); color: #ff3366; font-size: 0.72rem; font-weight: 700; padding: 2px 8px; border-radius: 4px;">10 Places / Mois</span>`;
            installmentHtml = `<div style="font-size: 0.8rem; color: #334155; display: flex; align-items: center; gap: 0.35rem; margin-top: 0.4rem;"><span style="background: #ffb3c7; color: #0a0a0a; font-weight: 700; font-size: 0.68rem; padding: 1px 5px; border-radius: 3px;">Klarna</span> ou <strong>3x 135 €</strong> sans frais</div>`;
            featuresHtml = `
              <ul class="package-features poppins-regular" style="text-align: left; list-style: none; padding: 0; line-height: 1.6; font-size: 0.82rem; margin: 0.75rem 0; color: #475569;">
                <li>✓ <strong>L'intégralité du Pack Web Pro</strong> + Git & GitHub</li>
                <li>🎯 <strong>4H de Mentorat Individuel (1-to-1)</strong> en visio</li>
                <li>🔍 <strong>Revue de Code Ligne par Ligne</strong> de tes projets</li>
                <li>💼 <strong>Coaching Carrière & Audit Portfolio</strong> (CV + GitHub)</li>
                <li>💬 <strong>Canal Privé Direct avec ton Mentor</strong> sur Discord</li>
              </ul>
            `;
            btnText = `Postuler au Pack Web Pro + Mentor • 648 €`;
          } else if (rawTier === "WEB" || slug === "pack-web-pro" || slug === "javascript" || (course.title && (course.title.toLowerCase().includes("web pro") || course.title.toLowerCase().includes("dynamique")))) {
            tier = "WEB";
            tierLabel = "Pack Web Pro (Recommandé)";
            levelLabel = "Intermédiaire";
            tierColor = "#059669";
            tierBg = "rgba(16, 185, 129, 0.15)";
            popularBadge = `<span style="background: #00ff87; color: #070e18; font-size: 0.72rem; font-weight: 700; padding: 2px 8px; border-radius: 4px;">Le Plus Populaire</span>`;
            installmentHtml = `<div style="font-size: 0.8rem; color: #334155; display: flex; align-items: center; gap: 0.35rem; margin-top: 0.4rem;"><span style="background: #ffb3c7; color: #0a0a0a; font-weight: 700; font-size: 0.68rem; padding: 1px 5px; border-radius: 3px;">Klarna</span> ou <strong>3x 160 €</strong> sans frais</div>`;
            featuresHtml = `
              <ul class="package-features poppins-regular" style="text-align: left; list-style: none; padding: 0; line-height: 1.6; font-size: 0.82rem; margin: 0.75rem 0; color: #475569;">
                <li>✓ <strong>Tout le Pack Starter inclus</strong> (HTML5 + CSS3)</li>
                <li>✓ <strong>Formation JavaScript Moderne (ES6+)</strong></li>
                <li>✓ <strong>Manipulation du DOM & Animations</strong></li>
                <li>✓ <strong>Connexion API & Données en direct</strong> (Fetch/Async)</li>
                <li>🎁 <strong>BONUS OFFERT : Formation Git & GitHub</strong></li>
                <li>✓ <strong>6 Projets de Portfolio au total</strong></li>
              </ul>
            `;
            isFeatured = true;
            btnText = `Rejoindre le Pack Web Pro • 449 €`;
          }

          let accessBadge = "";
          let actionBtn = "";
          const courseImg = getCourseImage(course);

          if (currentRole === "ADMIN" || currentRole === "TEACHER") {
            accessBadge = `<span style="background: rgba(0, 255, 135, 0.15); color: #00a85a; font-size: 0.75rem; font-weight: 700; padding: 4px 10px; border-radius: 999px; border: 1px solid rgba(0, 255, 135, 0.4);">✓ Accès Édition</span>`;
            actionBtn = `
              <a href="app.html?id=${course.id}" class="card__link bangers-regular">
                Gérer le parcours
                <svg class="card__chevron-darken" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </a>
            `;
          } else if (currentRole === "STUDENT") {
            if (!enrollmentInfo) {
              accessBadge = `<span style="background: #f1f5f9; color: #64748b; font-size: 0.75rem; font-weight: 700; padding: 4px 10px; border-radius: 999px; border: 1px solid #cbd5e1;">🔒 Non inscrit</span>`;
              actionBtn = `
                <div style="display:flex; gap:0.5rem; flex-wrap:wrap; width:100%;">
                  <button class="button button__primary bangers-regular" style="flex:1; padding: 8px 12px; font-size: 1rem; cursor:pointer;" onclick="initiateStripeCheckout('${course.id}')">
                    💳 ${btnText}
                  </button>
                  <button class="button button__secondary bangers-regular" style="padding: 8px 12px; font-size: 0.95rem; cursor:pointer;" onclick="handleEnroll('${course.id}')">
                    Aperçu
                  </button>
                </div>
              `;
            } else {
              const isPaid = (enrollmentInfo.paymentStatus === "PAID" || enrollmentInfo.paymentStatus === "PAYÉ");
              if (isPaid) {
                accessBadge = `<span style="background: rgba(0, 255, 135, 0.15); color: #00a85a; font-size: 0.75rem; font-weight: 700; padding: 4px 10px; border-radius: 999px; border: 1px solid rgba(0, 255, 135, 0.4);">✓ Inscrit • Payé</span>`;
                actionBtn = `
                  <a href="app.html?id=${course.id}" class="card__link bangers-regular">
                    Continuer le parcours
                    <svg class="card__chevron-darken" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </a>
                `;
              } else {
                accessBadge = `<span style="background: rgba(245, 158, 11, 0.15); color: #d97706; font-size: 0.75rem; font-weight: 700; padding: 4px 10px; border-radius: 999px; border: 1px solid rgba(245, 158, 11, 0.4);">⏳ Aperçu • En attente</span>`;
                actionBtn = `
                  <div style="display:flex; gap:0.5rem; flex-wrap:wrap; width:100%;">
                    <button class="button button__primary bangers-regular" style="flex:1; padding: 8px 12px; font-size: 1rem; cursor:pointer;" onclick="initiateStripeCheckout('${course.id}')">
                      💳 Débloquer (${price})
                    </button>
                    <a href="app.html?id=${course.id}" class="button button__secondary bangers-regular" style="padding: 8px 12px; font-size: 0.95rem; text-decoration:none; display:inline-flex; align-items:center;">
                      Aperçu
                    </a>
                  </div>
                `;
              }
            }
          } else {
            // GUEST
            accessBadge = `<span style="background: #f1f5f9; color: #64748b; font-size: 0.75rem; font-weight: 700; padding: 4px 10px; border-radius: 999px; border: 1px solid #cbd5e1;">🔒 Connexion requise</span>`;
            actionBtn = `
              <div style="display:flex; gap:0.5rem; flex-wrap:wrap; width:100%;">
                <button class="button button__primary bangers-regular" style="flex:1; padding: 8px 12px; font-size: 1rem; cursor:pointer;" onclick="initiateStripeCheckout('${course.id}')">
                  💳 ${btnText}
                </button>
                <a href="app.html?id=${course.id}" class="button button__secondary bangers-regular" style="padding: 8px 12px; font-size: 0.95rem; text-decoration:none; display:inline-flex; align-items:center;">
                  Aperçu
                </a>
              </div>
            `;
          }

          const featuredBorder = isFeatured ? 'style="border: 2px solid #00ff87; position: relative; box-shadow: 0 8px 30px rgba(0, 255, 135, 0.12);"' : '';

          return `
            <article class="card card-white card-paddingtop" ${featuredBorder}>
              <header class="card__imageContainer">
                <img
                  class="card__image"
                  src="${courseImg}"
                  alt="${escapeHtml(course.title)}"
                  width="400"
                  height="250"
                  loading="lazy"
                  decoding="async"
                />
              </header>
              <main class="card__main">
                <div class="card__header">
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 0.4rem;">
                    <div style="display:flex; gap:0.4rem; align-items:center; flex-wrap:wrap;">
                      <span class="section-tag" style="font-size: 0.72rem; margin-bottom: 0;">📚 ${escapeHtml(levelLabel)}</span>
                      <span style="background: ${tierBg}; color: ${tierColor}; font-size: 0.72rem; font-weight: 700; padding: 2px 7px; border-radius: 4px;">${tierLabel}</span>
                      ${popularBadge}
                      <span class="price-tag bangers-regular" style="font-size: 1.15rem; color: #008744; background: rgba(0, 255, 135, 0.15); padding: 2px 8px; border-radius: 6px; font-weight: 700;">${price}</span>
                    </div>
                    ${accessBadge}
                  </div>
                  <h3 class="card__title">${escapeHtml(course.title)}</h3>
                </div>
                <p class="card__paragraphe card__textGreen poppins-regular">
                  ${escapeHtml(course.description)}
                </p>
                ${featuresHtml}
                ${installmentHtml}
                <div style="display:flex; justify-content:space-between; align-items:center; font-size: 0.82rem; color: #64748b; margin-top: auto; padding-top: 0.75rem; border-top: 1px solid rgba(0,0,0,0.06);">
                  <span>👤 ${escapeHtml(course.createdByName || "Cédric Ragot")}</span>
                  <span>📅 ${new Date(course.updatedAt || Date.now()).toLocaleDateString("fr-FR")}</span>
                </div>
                <div style="margin-top: 0.75rem;">
                  ${actionBtn}
                </div>
              </main>
            </article>
          `;
        }).join("")}
      </div>

      <!-- Section Pour qui c'est fait ? (Reassurance & Maillage Interne Blog) -->
      <div style="margin-top: 3.5rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 2.25rem 2rem; text-align: left;">
        <h3 class="bangers-regular" style="font-size: 1.8rem; color: var(--dark-navy); margin-bottom: 0.75rem;">
          Pour qui sont faits nos parcours ?
        </h3>
        <p style="color: #475569; font-size: 1rem; line-height: 1.7; margin-bottom: 1rem;">
          Nos formations s'adressent à toute personne motivée (débutant complet, lycéen, étudiant ou adulte en reconversion) désirant créer de vrais projets web sans perdre son temps dans des cours théoriques interminables.
        </p>
        <div style="background: rgba(0, 255, 135, 0.1); border-left: 4px solid #00a85a; padding: 0.9rem 1.25rem; border-radius: 0 8px 8px 0; margin-top: 1rem;">
          <strong style="color: var(--dark-navy);">Tu te demandes s'il faut être fort en maths pour réussir ?</strong>
          <span style="color: #334155; display: block; font-size: 0.95rem; margin-top: 0.25rem;">
            Spoiler : aucune équation n'est demandée pour coder des sites web. <a href="blog/faut-il-etre-bon-en-maths-pour-apprendre-a-coder" style="color: #047857; font-weight: 700; text-decoration: underline;">Lire l'analyse complète de notre ingénieur formateur →</a>
          </span>
        </div>
      </div>
    </div>
  `;
}

// ========================================================
// 3. Vue Salle de Cours & Validation des Droits RBAC
// ========================================================

async function loadSingleCourse(courseId, requestedChapterId) {
  const contentArea = document.getElementById("cours-content");

  // 1. Vérifier si l'utilisateur est connecté
  if (currentRole === "GUEST" || !currentUser) {
    renderAccessGate(
      "🔒 Connexion Requise",
      "Vous devez être connecté à votre compte NoSeumCode pour accéder au lecteur de formation et aux chapitres interactifs.",
      "GUEST"
    );
    return;
  }

  // 2. Récupérer les données du cours
  currentCourse = allCourses.find(c => c.id === courseId);
  if (!currentCourse) {
    const res = await coursApiFetch(`/api/courses/${courseId}`);
    if (res && res.ok) {
      currentCourse = await res.json();
    }
  }

  if (!currentCourse) {
    contentArea.innerHTML = `
      <div class="access-gate-card">
        <h2 class="access-gate-title">Formation introuvable</h2>
        <p class="access-gate-desc">Le cours demandé n'existe pas ou a été supprimé.</p>
        <a href="app.html" class="button button__primary bangers-regular" style="padding: 10px 24px; font-size: 1.1rem; text-decoration:none;">Retour au catalogue</a>
      </div>
    `;
    return;
  }

  // 3. Vérification des Droits d'Accès de l'Étudiant (Inscription & Statut de Paiement)
  if (currentRole === "STUDENT") {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");

    // Si un session_id Stripe est présent et que le paiement n'est pas encore synchronisé
    if (sessionId && currentUser) {
      try {
        const syncRes = await coursApiFetch(`/api/payments/confirm-session?session_id=${encodeURIComponent(sessionId)}`);
        if (syncRes && syncRes.ok) {
          const enrollRes = await coursApiFetch("/api/enrollments/my-courses");
          if (enrollRes && enrollRes.ok) {
            userEnrollments = await enrollRes.json();
          }
        }
      } catch (e) {
        console.warn("Vérification session Stripe dans cours.js:", e);
      }
    }

    let enrollment = userEnrollments.find(e => e.courseId === currentCourse.id);

    // Si l'étudiant n'est pas encore inscrit à ce cours, inviter à s'inscrire
    if (!enrollment) {
      renderAccessGate(
        "📚 Inscription Requise",
        `Vous êtes connecté mais vous n'êtes pas encore inscrit à la formation "<strong>${escapeHtml(currentCourse.title)}</strong>". Inscrivez-vous gratuitement pour débloquer l'aperçu de la première section.`,
        "NOT_ENROLLED"
      );
      return;
    }
  }

  // 4. Chargement des chapitres du cours
  const chapRes = await coursApiFetch(`/api/chapters/course/${currentCourse.id}/all`);
  if (chapRes && chapRes.ok) {
    courseChapters = await chapRes.json();
  } else {
    // Fallback chapters
    if (currentCourse.id === "c1000000-0000-0000-0000-000000000001" || currentCourse.slug === "pack-starter" || currentCourse.slug === "html-css") {
      courseChapters = [
        {
          id: "c1000001-0000-0000-0000-000000000001",
          title: "1. Structure & Sémantique HTML5 (Aperçu Gratuit)",
          position: 1,
          status: "APPROVED",
          createdByName: "Admin CodeBangers",
          updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
          content: `# 🚀 Structure & Sémantique HTML5\n\nLe HTML5 moderne structure le web de façon accessible et performante.\n\n## Points clés :\n- Balises sémantiques : <header>, <main>, <nav>, <section>, <article>, <footer>.\n- Accessibilité (a11y) dès la conception.\n- SEO technique et référencement optimal.`
        },
        {
          id: "c1000002-0000-0000-0000-000000000002",
          title: "2. CSS3 Moderne, Flexbox & CSS Grid",
          position: 2,
          status: "APPROVED",
          createdByName: "Admin CodeBangers",
          updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
          content: `# 🎨 CSS3 Moderne, Flexbox & Grid\n\nDonne du style et structure tes mises en page comme un pro.`
        },
        {
          id: "c1000003-0000-0000-0000-000000000003",
          title: "3. Responsive Web Design & Animations CSS",
          position: 3,
          status: "APPROVED",
          createdByName: "Admin CodeBangers",
          updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
          content: `# 📱 Responsive Web Design & Animations\n\nAssure une expérience irréprochable sur mobile, tablette et desktop.`
        }
      ];
    } else if (currentCourse.id === "c2000000-0000-0000-0000-000000000002" || currentCourse.slug === "pack-web-pro" || currentCourse.slug === "javascript") {
      courseChapters = [
        {
          id: "c2000001-0000-0000-0000-000000000001",
          title: "1. Premiers Pas avec JavaScript & ES6+ (Aperçu Gratuit)",
          position: 1,
          status: "APPROVED",
          createdByName: "Admin CodeBangers",
          updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
          content: `# ⚡ Premiers Pas avec JavaScript\n\nJavaScript est le langage de programmation du navigateur web.\n\n## Les fondamentaux abordés :\n- Variables modernes : const et let.\n- Types de données et fonctions fléchées.\n- Manipulation de base.`
        },
        {
          id: "c2000002-0000-0000-0000-000000000002",
          title: "2. Manipulation du DOM & Événements",
          position: 2,
          status: "APPROVED",
          createdByName: "Admin CodeBangers",
          updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
          content: `# 🎮 Manipulation du DOM & Événements\n\nLe DOM te permet de manipuler les éléments HTML en temps réel.`
        },
        {
          id: "c2000003-0000-0000-0000-000000000003",
          title: "3. API Fetch & Programmation Asynchrone",
          position: 3,
          status: "APPROVED",
          createdByName: "Admin CodeBangers",
          updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          content: `# 🌐 API Fetch & Asynchronisme\n\nConnecte ton application à des données externes et des serveurs backend.`
        }
      ];
    } else if (currentCourse.id === "c3000000-0000-0000-0000-000000000003" || currentCourse.slug === "pack-mentorat-vip" || currentCourse.slug === "git-github") {
      courseChapters = [
        {
          id: "c3000001-0000-0000-0000-000000000001",
          title: "1. Installation, Configuration & Premiers Commits (Aperçu Gratuit)",
          position: 1,
          status: "APPROVED",
          createdByName: "Admin CodeBangers",
          updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
          content: `# 💾 Premiers Pas avec Git\n\nGit est le système de gestion de versions décentralisé le plus populaire au monde.\n\n## Commandes indispensables :\n- git init\n- git add\n- git commit`
        },
        {
          id: "c3000002-0000-0000-0000-000000000002",
          title: "2. Branches, Merge & Résolution de conflits",
          position: 2,
          status: "APPROVED",
          createdByName: "Admin CodeBangers",
          updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
          content: `# 🌿 Branches & Stratégies de Merge\n\nIsole tes fonctionnalités sans impacter la branche principale.`
        },
        {
          id: "c3000003-0000-0000-0000-000000000003",
          title: "3. Collaboration GitHub, Pull Requests & Code Review",
          position: 3,
          status: "APPROVED",
          createdByName: "Admin CodeBangers",
          updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          content: `# 🤝 Collaboration GitHub & Pull Requests\n\nTravaille en équipe comme dans les plus grandes entreprises tech.`
        }
      ];
    } else {
      // Fallback par défaut sur les chapitres HTML & CSS
      courseChapters = [
        {
          id: "c1000001-0000-0000-0000-000000000001",
          title: "1. Structure & Sémantique HTML5 (Aperçu Gratuit)",
          position: 1,
          status: "APPROVED",
          createdByName: "Admin CodeBangers",
          updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
          content: "# 🚀 Structure & Sémantique HTML5\n\nLe HTML5 moderne structure le web de façon accessible et performante.\n\n## Points clés :\n- Balises sémantiques : <header>, <main>, <nav>, <section>, <article>, <footer>.\n- Accessibilité (a11y) dès la conception.\n- SEO technique et référencement optimal."
        },
        {
          id: "c1000002-0000-0000-0000-000000000002",
          title: "2. CSS3 Moderne, Flexbox & CSS Grid",
          position: 2,
          status: "APPROVED",
          createdByName: "Admin CodeBangers",
          updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
          content: "# 🎨 CSS3 Moderne, Flexbox & Grid\n\nDonne du style et structure tes mises en page comme un pro."
        },
        {
          id: "c1000003-0000-0000-0000-000000000003",
          title: "3. Responsive Web Design & Animations CSS",
          position: 3,
          status: "APPROVED",
          createdByName: "Admin CodeBangers",
          updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          content: "# 📱 Responsive Web Design & Animations\n\nAssure une expérience irréprochable sur mobile, tablette et desktop."
        }
      ];
    }
  }

  // Pour un étudiant, masquer les chapitres non approuvés
  if (currentRole === "STUDENT") {
    courseChapters = courseChapters.filter(c => c.status === "APPROVED");
  }

  if (requestedChapterId && courseChapters.some(c => c.id === requestedChapterId)) {
    activeChapterId = requestedChapterId;
  } else {
    activeChapterId = courseChapters[0]?.id || null;
  }

  renderClassroom();
}

function renderAccessGate(title, description, type, extraStatus = "") {
  const contentArea = document.getElementById("cours-content");
  if (!contentArea) return;

  let icon = "🔒";
  let cardClass = "access-gate-card";
  let actionButtons = "";

  if (type === "GUEST") {
    icon = "👤";
    cardClass += " guest";
    actionButtons = `
      <button class="button button__primary bangers-regular" style="padding: 12px 28px; font-size: 1.2rem; cursor:pointer;" onclick="if(typeof openGlobalAuthModal==='function'){openGlobalAuthModal('login');}else if(typeof openAuthModal==='function'){openAuthModal('login');}">
        🚀 Se Connecter / Créer un compte
      </button>
    `;
  } else if (type === "NOT_ENROLLED") {
    icon = "📚";
    cardClass += " not-enrolled";
    const priceText = formatCoursePrice(currentCourse);
    actionButtons = `
      <div style="display:flex; justify-content:center; gap: 1rem; flex-wrap:wrap;">
        <button class="button button__primary bangers-regular" style="padding: 12px 28px; font-size: 1.2rem; cursor:pointer;" onclick="initiateStripeCheckout('${currentCourse ? currentCourse.id : ''}')">
          💳 Acheter l'accès complet (${priceText})
        </button>
        <button class="button button__secondary bangers-regular" style="padding: 12px 20px; font-size: 1rem; cursor:pointer;" onclick="handleEnroll('${currentCourse ? currentCourse.id : ''}')">
          👀 Voir l'aperçu gratuit
        </button>
      </div>
    `;
  } else if (type === "PAYMENT_PENDING") {
    icon = "⏳";
    cardClass += " pending";
    const priceText = formatCoursePrice(currentCourse);
    actionButtons = `
      <div style="display:flex; justify-content:center; gap: 1rem; flex-wrap:wrap;">
        <button class="button button__primary bangers-regular" style="padding: 12px 28px; font-size: 1.2rem; cursor:pointer;" onclick="initiateStripeCheckout('${currentCourse ? currentCourse.id : ''}')">
          💳 Finaliser mon achat (${priceText})
        </button>
        <button class="button button__secondary bangers-regular" style="padding: 12px 20px; font-size: 1rem; cursor:pointer;" onclick="location.reload()">
          🔄 Vérifier mon statut
        </button>
      </div>
    `;
  }

  contentArea.innerHTML = `
    <div class="catalog-container">
      <a href="app.html" class="back-link bangers-regular">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Retour à toutes les formations
      </a>

      <div class="${cardClass}">
        <div class="access-gate-icon">${icon}</div>
        <h2 class="access-gate-title">${title}</h2>
        <p class="access-gate-desc">${description}</p>
        ${actionButtons}
      </div>
    </div>
  `;
}

// ========================================================
// 4. Rendu de l'Espace de Lecture Interactif
// ========================================================

function renderClassroom() {
  const contentArea = document.getElementById("cours-content");
  if (!contentArea || !currentCourse) return;

  document.title = `${currentCourse.title} - Formation NoSeumCode`;

  let roleBadgeLabel = "🎓 Étudiant (Consultation)";
  let roleNoticeHtml = "";
  const currentEnrollment = userEnrollments.find(e => e.courseId === currentCourse.id);
  const isPaidUser = currentEnrollment && (currentEnrollment.paymentStatus === "PAID" || currentEnrollment.paymentStatus === "PAYÉ");

  if (currentRole === "STUDENT") {
    if (isPaidUser) {
      roleBadgeLabel = "✓ Formation Débloquée (Payé)";
    } else {
      roleBadgeLabel = "👁️ Aperçu Gratuit (Paiement en attente)";
      const coursePrice = formatCoursePrice(currentCourse);
      roleNoticeHtml = `
        <div class="role-notice-banner" style="background: linear-gradient(135deg, rgba(0, 255, 135, 0.1) 0%, rgba(96, 239, 255, 0.1) 100%); border: 1px solid rgba(0, 255, 135, 0.35); border-radius: 10px; padding: 1rem 1.25rem; margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap;">
          <div>
            <span style="font-weight: 700; color: var(--dark-navy); font-size: 1.05rem;">✨ Vous consultez l'aperçu gratuit de la section 1</span>
            <p style="margin: 0.25rem 0 0 0; color: #475569; font-size: 0.9rem;">Débloquez toutes les vidéos, exercices et l'accès permanent en validant votre inscription.</p>
          </div>
          <button class="button button__primary bangers-regular" style="padding: 8px 20px; font-size: 1.15rem; cursor: pointer; white-space: nowrap; box-shadow: 0 4px 12px rgba(0,255,135,0.3);" onclick="initiateStripeCheckout('${currentCourse.id}')">
            💳 Débloquer tout (${coursePrice})
          </button>
        </div>
      `;
    }
  } else if (currentRole === "TEACHER") {
    roleBadgeLabel = "👨‍🏫 Enseignant (Édition autorisée)";
    roleNoticeHtml = `
      <div class="role-notice-banner role-notice-teacher">
        ℹ️ <strong>Espace Enseignant :</strong> Vous avez accès à la modification de ce cours et de ses sections. Conformément aux règles de sécurité, toute modification est soumise à la validation d'un Administrateur avant d'être publiée pour les étudiants.
      </div>
    `;
  } else if (currentRole === "ADMIN") {
    roleBadgeLabel = "🛡️ Administrateur (Gestion Totale)";
    roleNoticeHtml = `
      <div class="role-notice-banner role-notice-admin">
        ⚡ <strong>Espace Administrateur :</strong> Vous avez tous les droits de création, modification, validation et suppression sur cette formation.
      </div>
    `;
  }

  const activeChap = courseChapters.find(c => c.id === activeChapterId) || courseChapters[0];

  contentArea.innerHTML = `
    <!-- Header Banner -->
    <div class="course-header-banner">
      <div class="course-header-top">
        <a href="app.html" class="back-link bangers-regular" style="margin-bottom: 0;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Toutes les formations
        </a>
        <div style="display:flex; align-items:center; gap: 0.75rem;">
          <div class="course-badge-role">
            ${roleBadgeLabel}
          </div>
          ${currentRole === "TEACHER" || currentRole === "ADMIN" ? `
            <button class="button button__secondary" style="padding: 6px 14px; font-size: 0.82rem;" onclick="openEditCourseModal()">
              ✏️ Modifier le cours
            </button>
          ` : ""}
          ${currentRole === "ADMIN" ? `
            <button class="dash-btn dash-btn-danger" style="padding: 6px 14px; font-size: 0.82rem;" onclick="handleDeleteCourse('${currentCourse.id}')">
              🗑️ Supprimer le cours
            </button>
          ` : ""}
        </div>
      </div>
      <h1 class="course-title">${escapeHtml(currentCourse.title)}</h1>
      <p class="course-description">${escapeHtml(currentCourse.description || "")}</p>
      <div class="course-metadata-row">
        <span>👤 Auteur : <strong>${escapeHtml(currentCourse.createdByName || "Admin")}</strong></span>
        <span>🕒 Mis à jour : <strong>${new Date(currentCourse.updatedAt || Date.now()).toLocaleDateString("fr-FR")}</strong></span>
        <span>📚 ${courseChapters.length} sections actives</span>
      </div>
    </div>

    ${roleNoticeHtml ? `<div style="max-width: 1300px; margin: 0 auto 1.5rem; padding: 0 1.5rem;">${roleNoticeHtml}</div>` : ""}

    <!-- Main Classroom Grid -->
    <div class="course-main-layout">
      <!-- Sidebar Navigation -->
      <aside class="course-sidebar">
        <div class="course-sidebar-title">
          <span>📑 SOMMAIRE</span>
          <span style="font-size: 0.85rem; color: #00ff87;">${courseChapters.filter(c => c.status === "APPROVED").length}/${courseChapters.length}</span>
        </div>

        <nav class="chapter-nav-list">
          ${courseChapters.map((chap, index) => {
            const isActive = chap.id === activeChapterId;
            const isPending = chap.status === "PENDING_APPROVAL";
            const isPreview = Boolean(chap.isFreePreview || chap.position === 1 || chap.position === 0 || index === 0);
            const isStudent = currentRole === "STUDENT";
            const isLocked = isStudent && !isPaidUser && !isPreview;

            let statusIcon = "✓";
            let statusLabel = "";

            if (isPending) {
              statusIcon = "⏳";
              statusLabel = `<span style="font-size: 0.72rem; color: #fbbf24; font-weight: 700; background: rgba(245, 158, 11, 0.2); padding: 2px 6px; border-radius: 4px;">À valider</span>`;
            } else if (isLocked) {
              statusIcon = "🔒";
              statusLabel = `<span style="font-size: 0.72rem; color: #94a3b8; font-weight: 600;">Verrouillé</span>`;
            } else if (isStudent && !isPaidUser && isPreview) {
              statusIcon = "👁️";
              statusLabel = `<span style="font-size: 0.72rem; color: #00a85a; font-weight: 700; background: rgba(0, 255, 135, 0.15); padding: 2px 6px; border-radius: 4px;">Aperçu gratuit</span>`;
            }

            return `
              <a class="chapter-nav-item ${isActive ? "active" : ""} ${isPending ? "pending" : ""} ${isLocked ? "locked" : ""}" onclick="switchActiveChapter('${chap.id}')">
                <div style="display: flex; align-items: center; gap: 0.5rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                  <span>${statusIcon}</span>
                  <span>${escapeHtml(chap.title)}</span>
                </div>
                ${statusLabel}
              </a>
            `;
          }).join("")}
        </nav>

        ${currentRole === "TEACHER" || currentRole === "ADMIN" ? `
          <button class="button button__primary" style="width: 100%; margin-top: 1.25rem; padding: 8px; font-size: 0.85rem;" onclick="openAddChapterModal()">
            + Ajouter une section
          </button>
        ` : ""}
      </aside>

      <!-- Main Content Panel -->
      <section class="chapter-content-panel">
        ${renderChapterContent(activeChap)}
      </section>
    </div>
  `;
}

function renderChapterContent(chapter) {
  if (!chapter) {
    return `<p style="color: #94a3b8; text-align: center;">Aucun contenu disponible pour cette section.</p>`;
  }

  const currentEnrollment = userEnrollments.find(e => e.courseId === currentCourse.id);
  const isPaidUser = currentEnrollment && (currentEnrollment.paymentStatus === "PAID" || currentEnrollment.paymentStatus === "PAYÉ");
  const isStudent = currentRole === "STUDENT";
  const isPreview = Boolean(chapter.isFreePreview || chapter.position === 1 || chapter.position === 0);
  const isLocked = isStudent && !isPaidUser && !isPreview;

  if (isLocked || (isStudent && !isPaidUser && !chapter.content)) {
    return `
      <div class="chapter-header">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; flex-wrap: wrap; margin-bottom: 0.5rem;">
          <h2 class="chapter-title">${escapeHtml(chapter.title)}</h2>
          <span style="background: rgba(245, 158, 11, 0.2); color: #d97706; border: 1px solid rgba(245, 158, 11, 0.4); font-size: 0.8rem; font-weight: 700; padding: 4px 10px; border-radius: 999px;">
            🔒 Section réservée aux membres
          </span>
        </div>
        <div style="font-size: 0.85rem; color: #64748b;">
          Programme complet NoSeumCode
        </div>
      </div>

      <div class="access-gate-card pending" style="margin: 2.5rem auto; max-width: 620px; text-align: center; padding: 2.5rem 1.5rem; border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 12px; background: #fff;">
        <div class="access-gate-icon" style="font-size: 3rem; margin-bottom: 1rem;">🔒</div>
        <h3 class="access-gate-title" style="font-size: 1.8rem; margin-bottom: 0.75rem; color: var(--dark-navy);">Contenu Verrouillé</h3>
        <p class="access-gate-desc" style="color: #64748b; font-size: 1rem; line-height: 1.6; margin-bottom: 1.5rem;">
          Cette section nécessite une inscription avec paiement validé. Débloquez immédiatement l'intégralité du cours pour accéder à toutes les leçons et vidéos.
        </p>
        <div style="display:flex; justify-content:center; gap: 1rem; flex-wrap:wrap;">
          <button class="button button__primary bangers-regular" style="padding: 12px 28px; font-size: 1.25rem; cursor:pointer; box-shadow: 0 4px 15px rgba(0, 255, 135, 0.4);" onclick="initiateStripeCheckout('${currentCourse ? currentCourse.id : ''}')">
            💳 Débloquer toute la formation (${formatCoursePrice(currentCourse)})
          </button>
          <button class="button button__secondary bangers-regular" style="padding: 12px 20px; font-size: 1rem; cursor:pointer;" onclick="location.reload()">
            🔄 Vérifier mon paiement
          </button>
        </div>
      </div>
    `;
  }

  const isPending = chapter.status === "PENDING_APPROVAL";
  const formattedDate = chapter.updatedAt ? new Date(chapter.updatedAt).toLocaleDateString("fr-FR", {
    day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit"
  }) : "—";

  let actionButtonsHtml = "";

  if (currentRole === "STUDENT") {
    actionButtonsHtml = `
      <button class="button button__primary bangers-regular" style="padding: 10px 24px; font-size: 1.15rem;" onclick="markChapterComplete('${chapter.id}')">
        ✓ MARQUER COMME TERMINÉ
      </button>
    `;
  } else if (currentRole === "TEACHER") {
    actionButtonsHtml = `
      <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
        <button class="button button__primary bangers-regular" style="padding: 8px 18px; font-size: 1.1rem;" onclick="openEditChapterModal('${chapter.id}')">
          ✏️ MODIFIER CETTE SECTION
        </button>
      </div>
    `;
  } else if (currentRole === "ADMIN") {
    actionButtonsHtml = `
      <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
        <button class="button button__primary bangers-regular" style="padding: 8px 18px; font-size: 1.1rem;" onclick="openEditChapterModal('${chapter.id}')">
          ✏️ MODIFIER
        </button>
        ${isPending ? `
          <button class="dash-btn dash-btn-success" style="padding: 8px 16px; font-weight: 700;" onclick="handleApproveChapter('${chapter.id}')">
            ✅ Valider & Publier
          </button>
          <button class="dash-btn dash-btn-warning" style="padding: 8px 16px; font-weight: 700;" onclick="handleRejectChapter('${chapter.id}')">
            ❌ Rejeter
          </button>
        ` : ""}
        <button class="dash-btn dash-btn-danger" style="padding: 8px 16px; font-weight: 700;" onclick="handleDeleteChapter('${chapter.id}')">
          🗑️ Supprimer la section
        </button>
      </div>
    `;
  }

  return `
    <div class="chapter-header">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; flex-wrap: wrap; margin-bottom: 0.5rem;">
        <h2 class="chapter-title">${escapeHtml(chapter.title)}</h2>
        ${isPending ? `
          <span style="background: rgba(245, 158, 11, 0.2); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.4); font-size: 0.8rem; font-weight: 700; padding: 4px 10px; border-radius: 999px;">
            ⏳ En attente de validation admin
          </span>
        ` : `
          <span style="background: rgba(0, 255, 135, 0.15); color: #00ff87; border: 1px solid rgba(0, 255, 135, 0.3); font-size: 0.8rem; font-weight: 700; padding: 4px 10px; border-radius: 999px;">
            ✓ Section validée
          </span>
        `}
      </div>
      <div style="font-size: 0.85rem; color: #64748b;">
        Auteur : <strong>${escapeHtml(chapter.createdByName || "Enseignant")}</strong> • Dernière modification : ${formattedDate}
      </div>
    </div>

    <div class="rendered-markdown">
      ${parseMarkdown(chapter.content || "# Contenu du cours\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit.")}
    </div>

    <div class="course-actions-bar">
      <div>
        <span style="font-size: 0.85rem; color: #64748b;">NoSeumCode • Plateforme d'Apprentissage Fullstack</span>
      </div>
      <div>
        ${actionButtonsHtml}
      </div>
    </div>
  `;
}

// ========================================================
// 5. Gestion des Modales & Appels API (CRUD)
// ========================================================

function switchActiveChapter(chapId) {
  activeChapterId = chapId;
  const panel = document.querySelector(".chapter-content-panel");
  const chap = courseChapters.find(c => c.id === chapId);
  if (panel && chap) {
    panel.innerHTML = renderChapterContent(chap);
    document.querySelectorAll(".chapter-nav-item").forEach(el => el.classList.remove("active"));
    event?.currentTarget?.classList.add("active");
  }
}

function openEditChapterModal(chapId) {
  const chapter = courseChapters.find(c => c.id === chapId);
  if (!chapter) return;

  document.getElementById("modal-chapter-heading").textContent = "✏️ MODIFIER LA SECTION";
  document.getElementById("modal-chapter-id").value = chapter.id;
  document.getElementById("modal-course-id").value = currentCourse.id;
  document.getElementById("modal-chapter-title").value = chapter.title;
  document.getElementById("modal-chapter-content").value = chapter.content || "";

  const teacherWarning = document.getElementById("modal-teacher-warning");
  if (teacherWarning) {
    teacherWarning.style.display = (currentRole === "TEACHER") ? "flex" : "none";
  }

  document.getElementById("chapter-edit-modal").style.display = "flex";
}

function openAddChapterModal() {
  document.getElementById("modal-chapter-heading").textContent = "+ AJOUTER UNE NOUVELLE SECTION";
  document.getElementById("modal-chapter-id").value = "";
  document.getElementById("modal-course-id").value = currentCourse.id;
  document.getElementById("modal-chapter-content").value = "# Titre de niveau 1\n\n## Sous-titre de section\n\nContenu pédagogique avec explications, texte en **gras**, en *italique* ou en `code inline`.\n\n- Point clé 1\n- Point clé 2\n\n```java\n// Code d'exemple\npublic class Demo {\n    // ...\n}\n```";

  const teacherWarning = document.getElementById("modal-teacher-warning");
  if (teacherWarning) {
    teacherWarning.style.display = (currentRole === "TEACHER") ? "flex" : "none";
  }

  document.getElementById("chapter-edit-modal").style.display = "flex";
}

function closeChapterModal() {
  document.getElementById("chapter-edit-modal").style.display = "none";
}

function openEditCourseModal() {
  if (!currentCourse) return;
  document.getElementById("modal-course-heading").textContent = "✏️ MODIFIER LE COURS";
  document.getElementById("manage-course-id").value = currentCourse.id;
  document.getElementById("manage-course-title").value = currentCourse.title;
  document.getElementById("manage-course-description").value = currentCourse.description || "";
  document.getElementById("course-manage-modal").style.display = "flex";
}

function openCreateCourseModal() {
  document.getElementById("modal-course-heading").textContent = "+ CRÉER UNE NOUVELLE FORMATION";
  document.getElementById("manage-course-id").value = "";
  document.getElementById("manage-course-title").value = "";
  document.getElementById("manage-course-description").value = "";
  document.getElementById("course-manage-modal").style.display = "flex";
}

function closeCourseManageModal() {
  document.getElementById("course-manage-modal").style.display = "none";
}

async function handleSaveCourse(event) {
  event.preventDefault();
  const courseId = document.getElementById("manage-course-id").value;
  const title = document.getElementById("manage-course-title").value.trim();
  const description = document.getElementById("manage-course-description").value.trim();

  if (courseId) {
    // Modification du cours
    await coursApiFetch(`/api/courses/${courseId}`, {
      method: "PUT",
      body: JSON.stringify({ title, description })
    });
    if (currentCourse) {
      currentCourse.title = title;
      currentCourse.description = description;
      currentCourse.updatedAt = new Date().toISOString();
    }
    closeCourseManageModal();
    alert("✅ Formation mise à jour avec succès.");
    renderClassroom();
  } else {
    // Création d'un nouveau cours
    const res = await coursApiFetch("/api/courses", {
      method: "POST",
      body: JSON.stringify({ title, description })
    });
    let newCourse;
    if (res && res.ok) {
      newCourse = await res.json();
    } else {
      newCourse = {
        id: "course-" + Date.now(),
        title,
        description,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdByName: currentUser ? (currentUser.firstName || currentUser.userName) : "Admin"
      };
    }
    allCourses.unshift(newCourse);
    closeCourseManageModal();
    alert("🎉 Formation créée avec succès !");
    window.location.href = `app.html?id=${newCourse.id}`;
  }
}

async function handleSaveChapter(event) {
  event.preventDefault();
  const chapId = document.getElementById("modal-chapter-id").value;
  const courseId = document.getElementById("modal-course-id").value;
  const title = document.getElementById("modal-chapter-title").value.trim();
  const content = document.getElementById("modal-chapter-content").value;

  if (chapId) {
    const chap = courseChapters.find(c => c.id === chapId);
    if (chap) {
      chap.title = title;
      chap.content = content;
      chap.updatedAt = new Date().toISOString();
      if (currentRole === "TEACHER") {
        chap.status = "PENDING_APPROVAL";
      }
    }

    await coursApiFetch(`/api/chapters/${chapId}`, {
      method: "PUT",
      body: JSON.stringify({ title, position: chap ? chap.position : 1, content })
    });

    closeChapterModal();
    if (currentRole === "TEACHER") {
      alert("✅ Section modifiée ! Elle a été automatiquement soumise à la validation d'un Administrateur.");
    } else {
      alert("✅ Section mise à jour avec succès.");
    }
  } else {
    const newChap = {
      id: "chap-" + Date.now(),
      title,
      position: courseChapters.length + 1,
      status: (currentRole === "ADMIN") ? "APPROVED" : "PENDING_APPROVAL",
      createdByName: currentUser ? (currentUser.firstName || currentUser.userName) : "Enseignant",
      updatedAt: new Date().toISOString(),
      content
    };
    courseChapters.push(newChap);
    activeChapterId = newChap.id;

    const res = await coursApiFetch(`/api/chapters/course/${courseId}`, {
      method: "POST",
      body: JSON.stringify({ title, position: newChap.position, content })
    });

    if (res && res.ok) {
      try {
        const saved = await res.json();
        if (saved && saved.id) {
          newChap.id = saved.id;
        }
      } catch (_) {}
    }

    closeChapterModal();
    alert("🎉 Nouvelle section créée avec son contenu !");
  }

  renderClassroom();
}

async function handleApproveChapter(chapId) {
  if (currentRole !== "ADMIN") return;

  await coursApiFetch(`/api/chapters/${chapId}/approve`, {
    method: "POST"
  });

  const chap = courseChapters.find(c => c.id === chapId);
  if (chap) chap.status = "APPROVED";

  alert("✅ Section validée et publiée avec succès !");
  renderClassroom();
}

async function handleRejectChapter(chapId) {
  if (currentRole !== "ADMIN") return;

  const reason = prompt("Indiquez le motif du refus (optionnel) :");
  if (reason === null) return;

  await coursApiFetch(`/api/chapters/${chapId}/reject`, {
    method: "POST",
    body: JSON.stringify({ reason })
  });

  const chap = courseChapters.find(c => c.id === chapId);
  if (chap) chap.status = "REJECTED";

  alert("❌ Section refusée. L'enseignant a été notifié.");
  renderClassroom();
}

async function handleDeleteChapter(chapId) {
  if (currentRole !== "ADMIN") {
    alert("⛔ Action interdite : Seul un Administrateur peut supprimer une section.");
    return;
  }

  if (!confirm("Confirmer la suppression de cette section ? (Soft delete)")) return;

  await coursApiFetch(`/api/chapters/${chapId}`, {
    method: "DELETE"
  });

  courseChapters = courseChapters.filter(c => c.id !== chapId);
  activeChapterId = courseChapters[0]?.id || null;
  alert("🗑️ Section supprimée.");
  renderClassroom();
}

async function handleDeleteCourse(courseId) {
  if (currentRole !== "ADMIN") {
    alert("⛔ Action interdite : Seul un Administrateur peut supprimer une formation.");
    return;
  }

  if (!confirm("⚠️ Attention : Confirmer la suppression complète de cette formation ?")) return;

  await coursApiFetch(`/api/courses/${courseId}`, {
    method: "DELETE"
  });

  alert("🗑️ Formation supprimée.");
  window.location.href = "app.html";
}

/**
 * Déclenche la création d'une Stripe Checkout Session sécurisée et redirige l'apprenant.
 */
async function initiateStripeCheckout(courseId) {
  if (!courseId) {
    if (currentCourse && currentCourse.id) {
      courseId = currentCourse.id;
    } else {
      alert("Identifiant de formation introuvable.");
      return;
    }
  }

  // Trouver le cours pour enrichir le paywall et le contexte d'achat
  const course = (typeof allCourses !== "undefined" && Array.isArray(allCourses))
    ? allCourses.find(c => c.id === courseId || c.slug === courseId)
    : (typeof currentCourse !== "undefined" ? currentCourse : null);

  const courseTitle = course ? course.title : (courseId.toLowerCase().includes("starter") ? "Pack Starter – Les Fondations du Web" : "Pack Web Pro – L'Autonomie Complète");

  let tier = "WEB";
  if (course && course.requiredTier) {
    tier = course.requiredTier.toUpperCase();
  } else if (courseId.toLowerCase().includes("starter") || courseTitle.toLowerCase().includes("starter")) {
    tier = "STARTER";
  }

  const urlParams = new URLSearchParams(window.location.search);
  const addon = urlParams.get("addon") || sessionStorage.getItem("noseum_pending_checkout_addon") || null;

  let priceText = tier === "STARTER" ? "299 €" : "449 €";
  if (addon === "mentor_4sessions") {
    priceText = tier === "STARTER" ? "498 €" : "648 €";
  } else if (addon === "mentor_downsell_2sessions") {
    priceText = tier === "STARTER" ? "388 €" : "538 €";
  } else if (course && course.priceInCents) {
    priceText = `${(course.priceInCents / 100).toFixed(0)} €`;
  }

  if (!currentUser) {
    sessionStorage.setItem("noseum_pending_checkout_course_id", courseId);
    sessionStorage.setItem("noseum_pending_checkout_course_title", courseTitle);
    sessionStorage.setItem("noseum_pending_checkout_course_price", priceText);
    sessionStorage.setItem("noseum_pending_checkout_tier", tier);
    if (addon) {
      sessionStorage.setItem("noseum_pending_checkout_addon", addon);
    } else {
      sessionStorage.removeItem("noseum_pending_checkout_addon");
    }

    if (typeof openGlobalAuthModal === "function") {
      openGlobalAuthModal("register");
      if (typeof showGlobalAuthAlert === "function") {
        showGlobalAuthAlert(`🎓 Connectez-vous ou créez votre compte pour acheter "${courseTitle}" (${priceText}). Le paiement sécurisé s'affichera directement après connexion.`, "info");
      }
    } else if (typeof openAuthModal === "function") {
      openAuthModal("register");
    } else {
      alert("Veuillez vous connecter ou créer un compte pour acheter cette formation.");
    }
    return;
  }

  // Visual feedback on button if clicked
  let clickedBtn = null;
  let originalHtml = "";
  if (typeof window !== "undefined" && window.event && window.event.target) {
    clickedBtn = window.event.target.closest("button");
  }

  if (typeof window.openStripePaywall === "function") {
    await window.openStripePaywall(courseId, courseTitle, priceText, tier, null, addon);
  } else if (typeof window.openAuthModal === "function" && !currentUser) {
    window.openAuthModal("login");
  } else {
    window.location.href = `app.html?id=${encodeURIComponent(courseId)}&checkout=true${addon ? `&addon=${encodeURIComponent(addon)}` : ''}`;
  }
}

async function handleEnroll(courseId) {
  if (!currentUser) {
    if (typeof openAuthModal === "function") {
      openAuthModal("login");
    } else {
      alert("Veuillez vous connecter pour vous inscrire.");
    }
    return;
  }

  const res = await coursApiFetch("/api/enrollments", {
    method: "POST",
    body: JSON.stringify({ courseId })
  });

  if (res && res.ok) {
    const createdEnrollment = await res.json();
    userEnrollments.push(createdEnrollment);
  } else {
    // Recharger depuis l'API pour resynchroniser
    const enrollRes = await coursApiFetch("/api/enrollments/my-courses");
    if (enrollRes && enrollRes.ok) {
      userEnrollments = await enrollRes.json();
    }
  }

  alert("🎉 Inscription confirmée ! Vous avez accès à l'aperçu gratuit de la section 1.");
  window.location.href = `app.html?id=${courseId}`;
}

function markChapterComplete(chapId) {
  alert("🎉 Félicitations ! Section validée. Votre progression a été enregistrée.");
}

// ========================================================
// 6. Parser Markdown
// ========================================================

function parseMarkdown(md) {
  if (!md) return "";

  let html = escapeHtml(md);

  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  html = html.replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>');
  html = html.replace(/```([a-z]*)\n([\s\S]*?)```/gim, '<pre><code class="language-$1">$2</code></pre>');
  html = html.replace(/`([^`]+)`/gim, '<code>$1</code>');
  html = html.replace(/\*\*([^*]+)\*\*/gim, '<strong>$1</strong>');
  html = html.replace(/\*([^*]+)\*/gim, '<em>$1</em>');
  html = html.replace(/^\- (.*$)/gim, '<li>$1</li>');
  html = html.replace(/\n\n+/g, '</p><p>');
  html = '<p>' + html + '</p>';
  html = html.replace(/<p><(h[1-3]|pre|blockquote|li)/g, '<$1');
  html = html.replace(/<\/(h[1-3]|pre|blockquote|li)><\/p>/g, '</$1>');

  return html;
}

function escapeHtml(text) {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

document.addEventListener("DOMContentLoaded", initCoursPage);
