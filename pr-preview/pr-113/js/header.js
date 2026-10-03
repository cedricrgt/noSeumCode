// Configuration globale de l'API
// Par défaut, le frontend communique avec le backend déployé sur la VM Oracle Cloud (https://api.noseumcode.fr).
// Cela permet de tester les fonctionnalités en local (ex: port 3000) directement avec les vraies données Oracle.
// Possibilité d'orienter vers un backend local (localhost:8080) via :
// - Paramètre URL: ?api=local ou ?backend=local
// - Commande console: localStorage.setItem('noseum_api_target', 'local')
(function initApiBaseUrl() {
  if (typeof window === "undefined") return;

  try {
    const params = new URLSearchParams(window.location.search);
    const queryTarget = params.get("api") || params.get("backend");
    if (queryTarget === "local") {
      localStorage.setItem("noseum_api_target", "local");
    } else if (queryTarget === "oracle" || queryTarget === "prod" || queryTarget === "remote") {
      localStorage.removeItem("noseum_api_target");
      localStorage.removeItem("noseum_api_url");
    }
  } catch (_) {}

  const customUrl = typeof localStorage !== "undefined" ? localStorage.getItem("noseum_api_url") : null;
  if (customUrl) {
    window.API_BASE_URL = customUrl;
    return;
  }

  const target = typeof localStorage !== "undefined" ? localStorage.getItem("noseum_api_target") : null;
  if (target === "local") {
    const host = window.location.hostname || "localhost";
    window.API_BASE_URL = `http://${host}:8080`;
    return;
  }

  // Par défaut (local port 3000, 5500, develop ou prod) : Oracle Cloud VM API
  window.API_BASE_URL = "https://api.noseumcode.fr";
})();


/**
 * Sanitizes a raw HTML string fetched from the dev server by stripping
 * all <script> elements. This is needed because live-server injects a
 * live-reload <script> into every .html file it serves, which corrupts
 * partial HTML fragments when they are set via innerHTML.
 *
 * Using DOMParser is more reliable than regex: the browser correctly
 * parses the full HTML (including injected scripts), we remove all
 * script nodes from the parsed DOM, then return the clean body content.
 */
function sanitizePartialHTML(rawText) {
  const doc = new DOMParser().parseFromString(rawText, "text/html");
  doc.querySelectorAll("script").forEach((s) => s.remove());
  return doc.body.innerHTML;
}

function resolveAssetPath(relPath) {
  if (document.querySelector("base[href]")) return relPath;
  if (window.location.pathname.includes("/formations")) return "/" + relPath;
  return relPath;
}

async function loadPartials() {
  const headerPlaceholder = document.getElementById("header-placeholder");
  const popoversPlaceholder = document.getElementById("popovers-placeholder");
  const footerPlaceholder = document.getElementById("footer-placeholder");

  const fetches = [];

  if (headerPlaceholder) {
    fetches.push(
      fetch(resolveAssetPath("partials/header.html"))
        .then((res) => (res.ok ? res.text() : ""))
        .then((html) => ({ type: "header", html }))
        .catch((err) => ({ type: "header", error: err }))
    );
  }

  if (popoversPlaceholder) {
    fetches.push(
      fetch(resolveAssetPath("partials/popovers-shared.html"))
        .then((res) => (res.ok ? res.text() : ""))
        .then((html) => ({ type: "popovers", html }))
        .catch((err) => ({ type: "popovers", error: err }))
    );
  }

  if (footerPlaceholder) {
    fetches.push(
      fetch(resolveAssetPath("partials/footer.html"))
        .then((res) => (res.ok ? res.text() : ""))
        .then((html) => ({ type: "footer", html }))
        .catch((err) => ({ type: "footer", error: err }))
    );
  }

  try {
    const results = await Promise.all(fetches);

    for (const item of results) {
      if (item.error) {
        console.error(`Error loading partial ${item.type}:`, item.error);
        continue;
      }

      if (item.type === "header" && headerPlaceholder && item.html) {
        let headerHtml = item.html.replace(/http:\/\/localhost:8080/g, window.API_BASE_URL);
        headerPlaceholder.innerHTML = sanitizePartialHTML(headerHtml);
        updatePromoBanner();

        // Visual staging badge on develop subdomain to clearly indicate pre-production environment
        if (window.location.hostname === "develop.noseumcode.fr" && !document.getElementById("dev-env-indicator")) {
          const devBanner = document.createElement("div");
          devBanner.id = "dev-env-indicator";
          devBanner.style.cssText = "background: #0f172a; color: #38bdf8; text-align: center; font-size: 0.78rem; font-family: 'Poppins', sans-serif; padding: 6px 12px; border-top: 1px solid rgba(56, 189, 248, 0.25); font-weight: 500; display: flex; align-items: center; justify-content: center; gap: 8px; z-index: 99999; position: fixed; bottom: 0; left: 0; width: 100%; pointer-events: none;";
          devBanner.innerHTML = "<span>🛠️</span> <span><strong>Environnement de test NoSeumCode</strong> (develop.noseumcode.fr) — Espace réservé à la pré-production.</span>";
          document.body.appendChild(devBanner);
        }
      } else if (item.type === "popovers" && popoversPlaceholder && item.html) {
        popoversPlaceholder.innerHTML = sanitizePartialHTML(item.html);

        // Inject dynamic OAuth2 URLs based on current environment (API_BASE_URL)
        const oauthLinks = [
          { id: "social-login-google",    provider: "google" },
          { id: "social-login-discord",   provider: "discord" },
          { id: "social-register-google", provider: "google" },
          { id: "social-register-discord",  provider: "discord" },
        ];
        const redirectTarget = encodeURIComponent(`${window.location.origin}/dashboard.html`);
        oauthLinks.forEach(({ id, provider }) => {
          const el = document.getElementById(id);
          if (el) el.href = `${window.API_BASE_URL}/oauth2/authorization/${provider}?redirect_uri=${redirectTarget}`;
        });

        loadSchedule();
      } else if (item.type === "footer" && footerPlaceholder && item.html) {
        footerPlaceholder.innerHTML = item.html;
      }
    }

    setActiveNavLink();
    checkUserAuthHeader();
    initPromoPopup();
    updateHeaderHeightVar();
  } catch (error) {
    console.error("Error loading partials:", error);
  }
}

async function loadHeader() {
  return loadPartials();
}

function updateHeaderHeightVar() {
  window.requestAnimationFrame(() => {
    const header = document.querySelector(".header");
    if (header) {
      const isMobile = window.innerWidth <= 768;
      const expected = isMobile ? 118 : 153;
      const h = header.offsetHeight;
      if (h > 0 && Math.abs(h - expected) > 2) {
        document.documentElement.style.setProperty("--header-height", `${h}px`);
      }
    }
  });
}

window.addEventListener("resize", updateHeaderHeightVar);
window.loadPartials = loadPartials;
window.loadHeader = loadHeader;

// ========================================================
// Authentification Globale & Pop-up Modal
// ========================================================

// L'URL de base est maintenant définie globalement via window.API_BASE_URL en haut du fichier

async function refreshAuthToken() {
  const refreshToken = localStorage.getItem("noseum_refresh_token");
  if (!refreshToken) return false;

  try {
    const res = await fetch(`${window.API_BASE_URL}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken })
    });

    if (res.ok) {
      const data = await res.json();
      if (data.accessToken) {
        localStorage.setItem("noseum_token", data.accessToken);
        if (data.refreshToken) {
          localStorage.setItem("noseum_refresh_token", data.refreshToken);
        }
        return true;
      }
    }
  } catch (err) {
    console.warn("Échec du rafraîchissement du token:", err);
  }
  return false;
}
window.refreshAuthToken = refreshAuthToken;

async function checkUserAuthHeader() {
  const token = localStorage.getItem("noseum_token");
  const userStr = localStorage.getItem("noseum_user");
  const authBtn = document.getElementById("header-auth-btn");
  const userBadge = document.getElementById("header-user-badge");
  const avatarText = document.getElementById("header-user-avatar-text");
  const userNameText = document.getElementById("header-user-name-text");
  if (token && userStr) {
    try {
      const user = JSON.parse(userStr);
      if (authBtn) authBtn.style.display = "none";
      if (userBadge) userBadge.style.display = "flex";

      const displayName = user.firstName || user.userName || "Mon Espace";
      if (userNameText) userNameText.textContent = displayName;
      if (avatarText) {
        const initial = (user.firstName ? user.firstName[0] : (user.userName ? user.userName[0] : "U")).toUpperCase();
        avatarText.textContent = initial;
      }

      // Valider en arrière-plan si le compte existe toujours dans PostgreSQL
      fetch(`${window.API_BASE_URL}/api/auth/me`, {
        headers: { "Authorization": `Bearer ${token}` }
      }).then(async res => {
        if (res.status === 401) {
          const refreshed = await refreshAuthToken();
          if (!refreshed) {
            console.warn("Session expirée, déconnexion.");
            localStorage.removeItem("noseum_token");
            localStorage.removeItem("noseum_refresh_token");
            localStorage.removeItem("noseum_user");
            if (authBtn) authBtn.style.display = "inline-flex";
            if (userBadge) userBadge.style.display = "none";
          }
        } else if (res.status === 404) {
          console.warn("Compte supprimé de la base, déconnexion.");
          localStorage.removeItem("noseum_token");
          localStorage.removeItem("noseum_refresh_token");
          localStorage.removeItem("noseum_user");
          if (authBtn) authBtn.style.display = "inline-flex";
          if (userBadge) userBadge.style.display = "none";
        }
      }).catch(() => { });

    } catch (e) {
      console.error("Error parsing user session:", e);
    }
  } else {
    if (authBtn) authBtn.style.display = "inline-flex";
    if (userBadge) userBadge.style.display = "none";
  }
}

function openGlobalAuthModal(tab = "login", isDirectLogin = false) {
  if (isDirectLogin) {
    sessionStorage.removeItem("noseum_pending_checkout_course_id");
    sessionStorage.removeItem("noseum_pending_checkout_course_title");
    sessionStorage.removeItem("noseum_pending_checkout_course_price");
  }

  const popover = document.getElementById("auth-popover");
  if (!popover) return;

  // Fermer les autres popovers ouverts s'il y en a
  document.querySelectorAll("[popover]").forEach(p => {
    if (p !== popover && p.matches && p.matches(":popover-open") && typeof p.hidePopover === "function") {
      try { p.hidePopover(); } catch (e) { }
    }
  });

  switchGlobalAuthTab(tab);
  clearGlobalAuthAlert();

  if (typeof popover.showPopover === "function" && !popover.matches(":popover-open")) {
    popover.showPopover();
  } else {
    popover.style.display = "flex";
  }
}
window.openGlobalAuthModal = openGlobalAuthModal;
window.openAuthModal = openGlobalAuthModal;

function closeGlobalAuthModal() {
  const popover = document.getElementById("auth-popover");
  if (!popover) return;

  if (typeof popover.hidePopover === "function" && popover.matches(":popover-open")) {
    popover.hidePopover();
  } else {
    popover.style.display = "none";
  }
}

function switchGlobalAuthTab(tab) {
  const loginView = document.getElementById("global-auth-login-view");
  const regView = document.getElementById("global-auth-register-view");
  const forgotView = document.getElementById("global-auth-forgot-view");
  const loginBtn = document.getElementById("global-tab-btn-login");
  const regBtn = document.getElementById("global-tab-btn-register");

  clearGlobalAuthAlert();

  if (tab === "login") {
    if (loginView) loginView.style.display = "block";
    if (regView) regView.style.display = "none";
    if (forgotView) forgotView.style.display = "none";
    if (loginBtn) {
      loginBtn.className = "button button__primary bangers-regular";
      loginBtn.style.background = "";
      loginBtn.style.color = "";
    }
    if (regBtn) {
      regBtn.className = "button button__secondary bangers-regular";
      regBtn.style.background = "transparent";
      regBtn.style.color = "#fff";
    }
  } else if (tab === "forgot") {
    if (loginView) loginView.style.display = "none";
    if (regView) regView.style.display = "none";
    if (forgotView) forgotView.style.display = "block";
    if (loginBtn) {
      loginBtn.className = "button button__secondary bangers-regular";
      loginBtn.style.background = "transparent";
      loginBtn.style.color = "#fff";
    }
    if (regBtn) {
      regBtn.className = "button button__secondary bangers-regular";
      regBtn.style.background = "transparent";
      regBtn.style.color = "#fff";
    }
  } else {
    if (loginView) loginView.style.display = "none";
    if (regView) regView.style.display = "block";
    if (forgotView) forgotView.style.display = "none";
    if (regBtn) {
      regBtn.className = "button button__primary bangers-regular";
      regBtn.style.background = "";
      regBtn.style.color = "";
    }
    if (loginBtn) {
      loginBtn.className = "button button__secondary bangers-regular";
      loginBtn.style.background = "transparent";
      loginBtn.style.color = "#fff";
    }
    const birthDateInput = document.getElementById("global-reg-birthdate");
    if (birthDateInput && !birthDateInput.max) {
      birthDateInput.max = new Date().toISOString().split("T")[0];
    }
    if (typeof toggleSocialRegisterButtons === "function") {
      toggleSocialRegisterButtons();
    }
  }
}

function showGlobalAuthAlert(message, type = "error") {
  const alertEl = document.getElementById("global-auth-alert");
  if (!alertEl) return;

  alertEl.style.display = "block";
  alertEl.textContent = message;

  if (type === "success") {
    alertEl.style.background = "rgba(0, 255, 135, 0.15)";
    alertEl.style.border = "1px solid #00ff87";
    alertEl.style.color = "#00ff87";
  } else if (type === "info") {
    alertEl.style.background = "rgba(0, 229, 255, 0.15)";
    alertEl.style.border = "1px solid #00e5ff";
    alertEl.style.color = "#00e5ff";
  } else {
    alertEl.style.background = "rgba(255, 51, 102, 0.15)";
    alertEl.style.border = "1px solid #ff3366";
    alertEl.style.color = "#ff3366";
  }
}

function clearGlobalAuthAlert() {
  const alertEl = document.getElementById("global-auth-alert");
  if (alertEl) {
    alertEl.style.display = "none";
    alertEl.textContent = "";
  }
}

// ========================================================
// Tunnel de Vente & Monétisation Stripe Checkout Global
// ========================================================

const COURSE_SLUG_MAP = {
  "pack-starter": "c1000000-0000-0000-0000-000000000001",
  "starter": "c1000000-0000-0000-0000-000000000001",
  "html-css": "c1000000-0000-0000-0000-000000000001",
  "fondations": "c1000000-0000-0000-0000-000000000001",
  "pack-fondations": "c1000000-0000-0000-0000-000000000001",
  "pack-web-pro": "c2000000-0000-0000-0000-000000000002",
  "web-pro": "c2000000-0000-0000-0000-000000000002",
  "javascript": "c2000000-0000-0000-0000-000000000002",
  "dynamique": "c2000000-0000-0000-0000-000000000002",
  "pack-dynamique": "c2000000-0000-0000-0000-000000000002",
  "web": "c2000000-0000-0000-0000-000000000002",
  "pack-web": "c2000000-0000-0000-0000-000000000002",
  "pack-mentorat-vip": "c3000000-0000-0000-0000-000000000003",
  "mentorat-vip": "c3000000-0000-0000-0000-000000000003",
  "vip": "c3000000-0000-0000-0000-000000000003",
  "pack-vip": "c3000000-0000-0000-0000-000000000003",
  "git-github": "c3000000-0000-0000-0000-000000000003",
  "goat": "c3000000-0000-0000-0000-000000000003"
};

function resolveCourseId(idOrSlug) {
  if (!idOrSlug) return "";
  return COURSE_SLUG_MAP[idOrSlug] || idOrSlug;
}

let currentStripeEmbeddedInstance = null;

/**
 * Charge dynamiquement le SDK Stripe.js s'il n'est pas encore présent sur la page.
 */
function ensureStripeJsLoaded() {
  if (typeof window.Stripe === "function") {
    return Promise.resolve(window.Stripe);
  }
  return new Promise((resolve, reject) => {
    const existing = document.querySelector('script[src*="js.stripe.com"]');
    if (existing) {
      if (typeof window.Stripe === "function") {
        resolve(window.Stripe);
      } else {
        existing.addEventListener("load", () => resolve(window.Stripe));
        existing.addEventListener("error", () => reject(new Error("Échec du chargement de Stripe.js")));
      }
      return;
    }
    const script = document.createElement("script");
    script.src = "https://js.stripe.com/v3/";
    script.async = true;
    script.onload = () => resolve(window.Stripe);
    script.onerror = () => reject(new Error("Impossible de charger le SDK Stripe.js"));
    document.head.appendChild(script);
  });
}
window.ensureStripeJsLoaded = ensureStripeJsLoaded;

/**
 * Ferme le Paywall intégré et détruit proprement l'instance Stripe Embedded Checkout.
 * Intercepte la fermeture (post-abandon) avec la proposition downsell si aucun add-on mentor n'a été choisi.
 */
function closeStripePaywall() {
  const ctx = window.currentPaywallContext || {};
  if (!ctx.addon && sessionStorage.getItem("mentor_downsell_shown") !== "true") {
    const modalDownsell = document.getElementById("mentor-downsell-modal");
    if (modalDownsell) {
      showMentorDownsellModal(() => {
        executeCloseStripePaywall();
      });
      return;
    }
  }
  executeCloseStripePaywall();
}
window.closeStripePaywall = closeStripePaywall;

function executeCloseStripePaywall() {
  const modal = document.getElementById("stripe-paywall-modal");
  if (modal) {
    if (typeof modal.hidePopover === "function" && modal.matches && modal.matches(":popover-open")) {
      try { modal.hidePopover(); } catch (_) {}
    } else {
      modal.style.display = "none";
    }
  }

  const modalDownsell = document.getElementById("mentor-downsell-modal");
  if (modalDownsell) modalDownsell.style.display = "none";

  const drawer = document.getElementById("mentor-addon-drawer");
  if (drawer) drawer.style.display = "none";

  if (currentStripeEmbeddedInstance) {
    try {
      currentStripeEmbeddedInstance.destroy();
    } catch (err) {
      console.warn("Erreur lors de la destruction de l'instance Stripe Embedded:", err);
    }
    currentStripeEmbeddedInstance = null;
  }

  const container = document.getElementById("stripe-checkout");
  if (container) {
    container.innerHTML = "";
  }
  const loading = document.getElementById("paywall-loading");
  if (loading) {
    loading.style.display = "flex";
  }
  const alertEl = document.getElementById("paywall-error-alert");
  if (alertEl) {
    alertEl.style.display = "none";
    alertEl.textContent = "";
  }
}

/**
 * Affiche la modale downsell pour proposer 2 sessions pour 89 €.
 */
function showMentorDownsellModal(onRejectCallback) {
  if (sessionStorage.getItem("mentor_downsell_shown") === "true") {
    if (typeof onRejectCallback === "function") onRejectCallback();
    return;
  }
  sessionStorage.setItem("mentor_downsell_shown", "true");

  const modalDownsell = document.getElementById("mentor-downsell-modal");
  if (!modalDownsell) {
    if (typeof onRejectCallback === "function") onRejectCallback();
    return;
  }

  modalDownsell.style.display = "flex";

  const acceptBtn = document.getElementById("btn-accept-downsell");
  const rejectBtn = document.getElementById("btn-reject-downsell");

  if (acceptBtn) {
    acceptBtn.onclick = () => {
      modalDownsell.style.display = "none";
      const ctx = window.currentPaywallContext || {};
      const courseId = ctx.courseId || "starter";
      const baseAmount = parseInt((ctx.priceText || "").replace(/[^0-9]/g, "")) || (ctx.tier === "STARTER" ? 299 : 449);
      const newPrice = (baseAmount + 89) + " €";
      const baseTitle = (ctx.courseTitle || "Pack").replace(/ \+ Suivi Mentor.*/g, "");
      openStripePaywall(courseId, baseTitle + " + Suivi Mentor (2 sessions)", newPrice, ctx.tier, ctx.cohortId, "mentor_downsell_2sessions");
    };
  }

  if (rejectBtn) {
    rejectBtn.onclick = () => {
      modalDownsell.style.display = "none";
      if (typeof onRejectCallback === "function") {
        onRejectCallback();
      }
    };
  }
}
window.showMentorDownsellModal = showMentorDownsellModal;

/**
 * Ouvre le Paywall NoSeumCode intégré directement dans la page.
 * Utilise Stripe Embedded Checkout pour garder l'utilisateur sur le site noseumcode.fr.
 */

function getPaywallSyllabusHtml(tier, addon) {
  let syllabusHtml = "";
  if (tier === "STARTER") {
    syllabusHtml = `
      <div style="margin-bottom: 0.85rem; font-weight: 600; color: #60a5fa; font-size: 0.95rem;">
        🧱 Pack Starter – Les Fondations du Web (HTML5 & CSS3 Moderne)
      </div>
      <div style="display: flex; flex-direction: column; gap: 0.75rem;">
        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 0.75rem 0.9rem;">
          <strong style="color: #fff; display: block; margin-bottom: 0.25rem;">Module 1 : HTML5 Sémantique & Structure Web Professionnelle</strong>
          <span style="color: #94a3b8; font-size: 0.83rem;">Comprendre l'architecture du Web et les standards W3C. Maîtrise des balises sémantiques modernes (&lt;header&gt;, &lt;main&gt;, &lt;section&gt;, &lt;article&gt;, &lt;nav&gt;, &lt;footer&gt;). Accessibilité web native (a11y) et optimisation SEO dès la conception.</span>
        </div>
        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 0.75rem 0.9rem;">
          <strong style="color: #fff; display: block; margin-bottom: 0.25rem;">Module 2 : CSS3 Moderne, Flexbox & CSS Grid</strong>
          <span style="color: #94a3b8; font-size: 0.83rem;">Cascade, spécificité et Custom Properties (variables CSS). Conception d'interfaces élégantes avec Flexbox pour l'alignement et CSS Grid pour les layouts complexes. Maîtrise du responsive design mobile-first (smartphones, tablettes, 4K).</span>
        </div>
        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 0.75rem 0.9rem;">
          <strong style="color: #fff; display: block; margin-bottom: 0.25rem;">Module 3 : Responsive Design & Expérience Mobile</strong>
          <span style="color: #94a3b8; font-size: 0.83rem;">Media queries, adaptabilité fluide, typographie responsive et performance d'affichage sur tous les écrans.</span>
        </div>
        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 0.75rem 0.9rem;">
          <strong style="color: #fff; display: block; margin-bottom: 0.25rem;">Module 4 : 2 Projets de Portfolio Complets</strong>
          <span style="color: #94a3b8; font-size: 0.83rem;">Création et déploiement de deux projets concrets : une page Bio-Link personnalisée et une Landing Page produit responsive professionnelle.</span>
        </div>
      </div>
      <div style="margin-top: 0.85rem; padding: 0.65rem 0.85rem; background: rgba(37, 99, 235, 0.12); border: 1px solid rgba(37, 99, 235, 0.3); border-radius: 8px; font-size: 0.82rem; color: #93c5fd;">
        ✨ <strong>Inclus :</strong> Accès immédiat et mises à jour à vie • Communauté Discord d'entraide • Éligible Klarna 3x 109 € sans frais • Garantie 14 jours satisfait ou remboursé.
      </div>
    `;
  } else {
    // WEB (Pack Web Pro)
    syllabusHtml = `
      <div style="margin-bottom: 0.85rem; font-weight: 600; color: #00ff87; font-size: 0.95rem;">
        ⚡ Pack Web Pro – L'Autonomie Complète (Pack Starter + JS ES6+ + Bonus Git)
      </div>
      <div style="display: flex; flex-direction: column; gap: 0.75rem;">
        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 0.75rem 0.9rem;">
          <strong style="color: #fff; display: block; margin-bottom: 0.25rem;">Tout le Pack Starter Inclus</strong>
          <span style="color: #94a3b8; font-size: 0.83rem;">HTML5 sémantique, CSS3 moderne, Flexbox, Grid, responsive design et 2 premiers projets.</span>
        </div>
        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 0.75rem 0.9rem;">
          <strong style="color: #fff; display: block; margin-bottom: 0.25rem;">JavaScript Moderne (ES6+) & Algorithmique</strong>
          <span style="color: #94a3b8; font-size: 0.83rem;">Variables modernes (const, let), structures logiques, boucles, fonctions fléchées, tableaux (map, filter, reduce).</span>
        </div>
        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 0.75rem 0.9rem;">
          <strong style="color: #fff; display: block; margin-bottom: 0.25rem;">Manipulation du DOM & Animations Interactives</strong>
          <span style="color: #94a3b8; font-size: 0.83rem;">Gestion des événements utilisateurs (clics, formulaires, frappes clavier), modification du contenu en temps réel.</span>
        </div>
        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 0.75rem 0.9rem;">
          <strong style="color: #fff; display: block; margin-bottom: 0.25rem;">APIs REST, Async/Await & Données en Temps Réel</strong>
          <span style="color: #94a3b8; font-size: 0.83rem;">Protocole HTTP, Promesses et async/await. Connexion d'APIs externes avec fetch, gestion du chargement et affichage dynamique.</span>
        </div>
        <div style="background: rgba(0, 255, 135, 0.08); border: 1px solid rgba(0, 255, 135, 0.25); border-radius: 8px; padding: 0.75rem 0.9rem;">
          <strong style="color: #00ff87; display: block; margin-bottom: 0.25rem;">🎁 BONUS OFFERT : Formation Git & GitHub (valeur 49 €)</strong>
          <span style="color: #cbd5e1; font-size: 0.83rem;">Dépôts locaux, commits conventionnels, branches, merge et travail collaboratif GitHub comme en entreprise.</span>
        </div>
        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 0.75rem 0.9rem;">
          <strong style="color: #fff; display: block; margin-bottom: 0.25rem;">6 Projets Portfolio Prêts à Être Présentés</strong>
          <span style="color: #94a3b8; font-size: 0.83rem;">4 projets dynamiques additionnels (dont un Dashboard Gaming interactif) hébergés en ligne.</span>
        </div>
      </div>
      <div style="margin-top: 0.85rem; padding: 0.65rem 0.85rem; background: rgba(0, 255, 135, 0.12); border: 1px solid rgba(0, 255, 135, 0.3); border-radius: 8px; font-size: 0.82rem; color: #a7f3d0;">
        ✨ <strong>Inclus :</strong> Tout le Pack Starter + JS + Bonus Git/GitHub • Accès prioritaire Discord • Éligible Klarna 3x 160 € sans frais • Garantie 14 jours.
      </div>
    `;
  }

  if (addon === "mentor_4sessions") {
    syllabusHtml += `
      <div style="margin-top: 0.85rem; background: rgba(0, 255, 135, 0.08); border: 1px solid rgba(0, 255, 135, 0.35); border-radius: 8px; padding: 0.75rem 0.9rem;">
        <strong style="color: #00ff87; display: block; margin-bottom: 0.25rem;">✨ Suivi Mentor Inclus (4 sessions individuelles de 1h)</strong>
        <span style="color: #cbd5e1; font-size: 0.83rem;">4 sessions individuelles en visio 1-to-1 avec Cédric Ragot : diagnostic personnalisé, revues de code ligne par ligne, déblocage direct et coaching carrière. Garantie satisfait ou remboursé dès la 1ère session.</span>
      </div>
    `;
  } else if (addon === "mentor_downsell_2sessions") {
    syllabusHtml += `
      <div style="margin-top: 0.85rem; background: rgba(0, 255, 135, 0.08); border: 1px solid rgba(0, 255, 135, 0.35); border-radius: 8px; padding: 0.75rem 0.9rem;">
        <strong style="color: #00ff87; display: block; margin-bottom: 0.25rem;">✨ Suivi Mentor Inclus (2 sessions individuelles de 1h)</strong>
        <span style="color: #cbd5e1; font-size: 0.83rem;">2 sessions individuelles en visio 1-to-1 avec Cédric Ragot : revue de code et déblocage personnalisé sur tes projets.</span>
      </div>
    `;
  }

  return syllabusHtml;
}
window.getPaywallSyllabusHtml = getPaywallSyllabusHtml;

async function openStripePaywall(courseId, courseTitle, priceText, tier, cohortId, addonParam) {
  const urlParams = new URLSearchParams(window.location.search);
  const addon = addonParam || urlParams.get('addon') || sessionStorage.getItem('noseum_pending_checkout_addon') || null;
  
  courseId = resolveCourseId(courseId) || "c1000000-0000-0000-0000-000000000001";

  if (!tier) {
    const t = (courseTitle || "").toLowerCase();
    const idStr = (courseId || "").toLowerCase();
    if (idStr.includes("starter") || t.includes("starter") || t.includes("fondation")) {
      tier = "STARTER";
    } else {
      tier = "WEB";
    }
  }

  if (!courseTitle) {
    if (tier === "STARTER") {
      courseTitle = addon === "mentor_4sessions" ? "Pack Starter + Suivi Mentor" : (addon === "mentor_downsell_2sessions" ? "Pack Starter + Suivi Mentor (2 sessions)" : "Pack Starter — Fondations Web");
    } else {
      courseTitle = addon === "mentor_4sessions" ? "Pack Web Pro + Suivi Mentor" : (addon === "mentor_downsell_2sessions" ? "Pack Web Pro + Suivi Mentor (2 sessions)" : "Pack Web — JavaScript & APIs");
    }
  }

  if (!priceText) {
    if (tier === "STARTER") {
      priceText = addon === "mentor_4sessions" ? "498 €" : (addon === "mentor_downsell_2sessions" ? "388 €" : "299 €");
    } else {
      priceText = addon === "mentor_4sessions" ? "648 €" : (addon === "mentor_downsell_2sessions" ? "538 €" : "449 €");
    }
  }

  window.currentPaywallContext = { courseId, courseTitle, priceText, tier, cohortId, addon };

  // 1. VÉRIFICATION D'AUTHENTIFICATION EN PREMIER LIEU
  const token = localStorage.getItem("noseum_token");
  const userStr = localStorage.getItem("noseum_user");

  if (!token || !userStr) {
    sessionStorage.setItem("noseum_pending_checkout_course_id", courseId);
    sessionStorage.setItem("noseum_pending_checkout_course_title", courseTitle || "");
    sessionStorage.setItem("noseum_pending_checkout_course_price", priceText || "");
    sessionStorage.setItem("noseum_pending_checkout_tier", tier || "");
    if (addon) {
      sessionStorage.setItem("noseum_pending_checkout_addon", addon);
    } else {
      sessionStorage.removeItem("noseum_pending_checkout_addon");
    }

    openGlobalAuthModal("register");
    showGlobalAuthAlert(`🎓 Connectez-vous ou créez votre compte pour acheter "${courseTitle}" (${priceText}). Le paiement sécurisé s'affichera directement après connexion.`, "info");
    return;
  }

  // 2. Vérifier que la modale paywall est disponible dans le DOM (attente si loadPartials est en cours)
  let modal = document.getElementById("stripe-paywall-modal");
  if (!modal) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    modal = document.getElementById("stripe-paywall-modal");
  }
  if (!modal) {
    console.warn("Modale paywall #stripe-paywall-modal introuvable, redirection vers le catalogue.");
    window.location.href = `parcours.html?id=${encodeURIComponent(courseId)}&checkout=true${addon ? `&addon=${encodeURIComponent(addon)}` : ''}`;
    return;
  }

  if (!modal.dataset.toggleListenerAttached) {
    modal.dataset.toggleListenerAttached = "true";
    modal.addEventListener("toggle", (e) => {
      if (e.newState === "closed") {
        executeCloseStripePaywall();
      }
    });
  }

  // Fermer les popovers de cours et d'authentification
  document.querySelectorAll("[popover]").forEach(p => {
    if (p.id && (p.id.startsWith("course-") || p.id === "auth-popover") && p.matches && p.matches(":popover-open")) {
      try { p.hidePopover(); } catch (_) { }
    }
  });

  // Mettre à jour les informations du cours dans la modale
  const titleEl = document.getElementById("paywall-course-title");
  if (titleEl) {
    titleEl.textContent = courseTitle || "Débloquer la Formation";
  }
  const priceEl = document.getElementById("paywall-course-price");
  if (priceEl && priceText) {
    priceEl.textContent = priceText;
  }

  const syllabusContent = document.getElementById("paywall-syllabus-content");
  if (syllabusContent) {
    syllabusContent.innerHTML = getPaywallSyllabusHtml(tier, addon);
  }

  // Masquer tout overlay downsell ou drawer précédemment ouvert
  const modalDownsell = document.getElementById("mentor-downsell-modal");
  if (modalDownsell) modalDownsell.style.display = "none";
  const drawer = document.getElementById("mentor-addon-drawer");
  if (drawer) drawer.style.display = "none";

  // Rappel discret Suivi Mentor si non sélectionné (Section 2.3 & 4.3)
  const reminderEl = document.getElementById("paywall-mentor-reminder");
  if (reminderEl) {
    if (!addon) {
      reminderEl.style.display = "flex";
      const apiBase = window.API_BASE_URL || "";
      fetch(apiBase + "/api/cohorts/current")
        .then(r => r.ok ? r.json() : Promise.reject())
        .then(data => {
          let slots = 3;
          const tierKey = (tier || "starter").toLowerCase().includes("web") ? "web_pro" : "starter";
          if (data && data[tierKey] && typeof data[tierKey].mentor_slots_remaining === "number") {
            slots = data[tierKey].mentor_slots_remaining;
          }
          const slotsEl = document.getElementById("paywall-mentor-slots");
          if (slotsEl) {
            slotsEl.textContent = slots > 0 ? (slots + " place" + (slots > 1 ? "s" : "") + " restante" + (slots > 1 ? "s" : "")) : "complet pour cette cohorte";
          }
        })
        .catch(() => {});
    } else {
      reminderEl.style.display = "none";
    }
  }

  const loadingEl = document.getElementById("paywall-loading");
  if (loadingEl) loadingEl.style.display = "flex";

  const alertEl = document.getElementById("paywall-error-alert");
  if (alertEl) {
    alertEl.style.display = "none";
    alertEl.textContent = "";
  }

  const container = document.getElementById("stripe-checkout");
  if (container) container.innerHTML = "";

  // Afficher la modale
  if (typeof modal.showPopover === "function" && !modal.matches(":popover-open")) {
    try { modal.showPopover(); } catch (_) { modal.style.display = "flex"; }
  } else {
    modal.style.display = "flex";
  }

  try {
    // 1. S'assurer que le SDK Stripe.js est prêt
    const StripeObj = await ensureStripeJsLoaded();

    // 2. Appeler l'API backend pour créer la session Stripe Embedded
    const apiBase = window.API_BASE_URL || "";
    const returnUrl = `${window.location.origin}/success.html?course_id=${encodeURIComponent(courseId)}&session_id={CHECKOUT_SESSION_ID}`;

    const res = await fetch(`${apiBase}/api/payments/create-checkout-session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        courseId: courseId,
        tier: tier || undefined,
        cohortId: cohortId || undefined,
        embedded: true,
        returnUrl: returnUrl,
        successUrl: returnUrl,
        addon: addon || undefined
      })
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      if (errData.message && errData.message.includes("déjà acheté")) {
        if (alertEl) {
          alertEl.style.display = "block";
          alertEl.textContent = "Vous avez déjà accès à cette formation ! Redirection vers vos cours...";
        }
        setTimeout(() => {
          closeStripePaywall();
          window.location.href = `parcours.html?id=${encodeURIComponent(courseId)}`;
        }, 1500);
        return;
      }
      throw new Error(errData.message || errData.error || "Impossible d'initialiser le paiement sécurisé.");
    }

    const data = await res.json();

    if (data.sessionId === "free_course") {
      if (alertEl) {
        alertEl.style.display = "block";
        alertEl.style.background = "rgba(0, 255, 135, 0.15)";
        alertEl.style.border = "1px solid #00ff87";
        alertEl.style.color = "#00ff87";
        alertEl.textContent = "🎉 Formation gratuite validée avec succès ! Redirection...";
      }
      setTimeout(() => {
        closeStripePaywall();
        window.location.href = `parcours.html?id=${encodeURIComponent(courseId)}`;
      }, 1200);
      return;
    }

    if (!data.clientSecret) {
      throw new Error("Clé de session sécurisée (clientSecret) non reçue. Assurez-vous que le backend est à jour.");
    }

    if (data.amount && priceEl) {
      priceEl.textContent = `${(data.amount / 100).toFixed(0)} €`;
    }

    // Nettoyer toute instance précédente
    if (currentStripeEmbeddedInstance) {
      try { currentStripeEmbeddedInstance.destroy(); } catch (_) {}
      currentStripeEmbeddedInstance = null;
    }

    // 3. Initialiser Stripe Embedded Checkout et le monter dans la modale
    const publishableKey = data.publishableKey || "pk_test_2BsFfeoXfXOvjtOnGf24JH6E00S9sVcIEG";
    const stripe = StripeObj(publishableKey);

    const checkout = await stripe.initEmbeddedCheckout({
      clientSecret: data.clientSecret
    });

    currentStripeEmbeddedInstance = checkout;

    if (loadingEl) loadingEl.style.display = "none";
    checkout.mount("#stripe-checkout");

  } catch (err) {
    console.error("Erreur lors de l'initialisation du paywall Stripe:", err);
    if (loadingEl) loadingEl.style.display = "none";
    if (alertEl) {
      alertEl.style.display = "block";
      alertEl.textContent = "❌ " + (err.message || "Erreur lors de l'ouverture du terminal de paiement.");
    }
  }
}
window.openStripePaywall = openStripePaywall;

/**
 * Fonction de compatibilité appelant le paywall in-app
 */
async function redirectToStripeCheckout(courseId) {
  await openStripePaywall(courseId);
}
window.redirectToStripeCheckout = redirectToStripeCheckout;

/**
 * Déclenche l'inscription ou l'achat d'un cours depuis les popovers et boutons du site.
 * Ouvre le Paywall NoSeumCode intégré directement dans la page.
 */
async function initiateCourseEnrollment(courseId, courseTitle, priceText, tier, cohortId) {
  courseId = resolveCourseId(courseId);
  if (typeof window.trackConversion === 'function') {
    window.trackConversion('checkout_initiate', {
      course_id: courseId,
      course_title: courseTitle,
      price: priceText,
      tier: tier || 'STANDARD',
      cohort_id: cohortId || undefined
    });
  }
  await openStripePaywall(courseId, courseTitle, priceText, tier, cohortId);
}
window.initiateCourseEnrollment = initiateCourseEnrollment;

window.togglePasswordVisibility = function (inputId, btnId) {
  const input = document.getElementById(inputId);
  const btn = document.getElementById(btnId);
  if (!input || !btn) return;

  const isPassword = input.type === "password";
  input.type = isPassword ? "text" : "password";

  btn.setAttribute("aria-label", isPassword ? "Masquer le mot de passe" : "Afficher le mot de passe");
  btn.setAttribute("title", isPassword ? "Masquer le mot de passe" : "Afficher le mot de passe");

  if (isPassword) {
    // Eye-off icon (indicating click will hide password)
    btn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00ff87" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
        <line x1="1" y1="1" x2="23" y2="23"></line>
      </svg>
    `;
  } else {
    // Normal Eye icon (indicating click will show password)
    btn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </svg>
    `;
  }
};

async function handleGlobalEmailLogin(e) {
  e.preventDefault();
  const email = document.getElementById("global-login-email").value.trim();
  const password = document.getElementById("global-login-password").value;
  const submitBtn = document.getElementById("global-login-submit-btn");

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = "CONNEXION EN COURS...";
  }

  try {
    const response = await fetch(`${window.API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    if (response.ok) {
      const data = await response.json();
      const user = {
        id: data.userId,
        userName: data.userName,
        firstName: data.firstName || data.userName,
        lastName: data.lastName || "",
        email: data.email,
        role: data.role || "STUDENT",
        avatarUrl: data.avatarUrl
      };

      localStorage.setItem("noseum_token", data.accessToken);
      if (data.refreshToken) {
        localStorage.setItem("noseum_refresh_token", data.refreshToken);
      }
      localStorage.setItem("noseum_user", JSON.stringify(user));
      checkUserAuthHeader();

      const pendingWorkshopId = localStorage.getItem("noseum_pending_workshop_id") || sessionStorage.getItem("noseum_pending_workshop_id");
      const pendingCourseId = sessionStorage.getItem("noseum_pending_checkout_course_id");

      if (pendingWorkshopId) {
        showGlobalAuthAlert("🎉 Connexion réussie ! Réservation de ton atelier en cours...", "success");
        setTimeout(async () => {
          closeGlobalAuthModal();
          try {
            await fetch(`${window.API_BASE_URL}/api/user-workshops/${pendingWorkshopId}`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${data.accessToken}`
              }
            });
            localStorage.removeItem("noseum_pending_workshop_id");
            sessionStorage.removeItem("noseum_pending_workshop_id");
          } catch (err) {
            console.warn("Erreur auto-inscription workshop post-login:", err);
          }
          sessionStorage.setItem("noseum_workshop_just_registered", "true");
          window.location.href = "dashboard.html";
        }, 400);
      } else if (pendingCourseId) {
        const pendingTitle = sessionStorage.getItem("noseum_pending_checkout_course_title") || "";
        const pendingPrice = sessionStorage.getItem("noseum_pending_checkout_course_price") || "";
        const pendingTier = sessionStorage.getItem("noseum_pending_checkout_tier") || "";
        const pendingAddon = sessionStorage.getItem("noseum_pending_checkout_addon") || null;
        sessionStorage.removeItem("noseum_pending_checkout_course_id");
        sessionStorage.removeItem("noseum_pending_checkout_course_title");
        sessionStorage.removeItem("noseum_pending_checkout_course_price");
        sessionStorage.removeItem("noseum_pending_checkout_tier");
        sessionStorage.removeItem("noseum_pending_checkout_addon");

        showGlobalAuthAlert("💳 Connexion réussie ! Ouverture du terminal de paiement sécurisé...", "success");
        setTimeout(async () => {
          closeGlobalAuthModal();
          await openStripePaywall(pendingCourseId, pendingTitle, pendingPrice, pendingTier, null, pendingAddon);
        }, 400);
      } else {
        showGlobalAuthAlert("✅ Connexion réussie ! Redirection vers votre espace...", "success");
        setTimeout(() => {
          closeGlobalAuthModal();
          window.location.href = "dashboard.html";
        }, 800);
      }
    } else {
      let errMsg = "Email ou mot de passe incorrect.";
      try {
        const errData = await response.json();
        if (errData.message) errMsg = errData.message;
      } catch (_) { }
      showGlobalAuthAlert(`❌ ${errMsg}`, "error");
    }
  } catch (err) {
    console.error("Login error:", err);
    showGlobalAuthAlert("❌ Impossible de joindre le serveur. Assurez-vous que le backend est démarré.", "error");
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = "SE CONNECTER";
    }
  }
}

// ========================================================
// Validation de l'âge (Restriction légale < 16 ans)
// ========================================================

function calculateAge(birthDateString) {
  if (!birthDateString) return null;
  const birthDate = new Date(birthDateString);
  if (isNaN(birthDate.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}
window.calculateAge = calculateAge;

function validateGlobalAge() {
  const birthDateInput = document.getElementById("global-reg-birthdate");
  const ageWarning = document.getElementById("global-reg-age-warning");
  const submitBtn = document.getElementById("global-reg-submit-btn");
  if (!birthDateInput) return true;

  if (!birthDateInput.value) {
    if (ageWarning) ageWarning.style.display = "none";
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.style.opacity = "1";
      submitBtn.style.cursor = "pointer";
    }
    return true;
  }

  const age = calculateAge(birthDateInput.value);

  // Date future ou invalide
  if (age === null || age < 0) {
    if (ageWarning) {
      ageWarning.style.display = "block";
      ageWarning.innerHTML = "⚠️ <strong>Date invalide :</strong> La date de naissance ne peut pas être dans le futur.";
    }
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.style.opacity = "0.5";
      submitBtn.style.cursor = "not-allowed";
    }
    return false;
  }

  // Moins de 16 ans
  if (age < 16) {
    if (ageWarning) {
      ageWarning.style.display = "block";
      ageWarning.innerHTML = "⚠️ <strong>Accès restreint :</strong> Pour des raisons légales, l'accès est interdit aux personnes de moins de 16 ans. Seul un adulte titulaire de l'autorité parentale peut créer et gérer un compte pour un mineur.";
    }
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.style.opacity = "0.5";
      submitBtn.style.cursor = "not-allowed";
    }
    return false;
  }

  // 16 ans et plus : valide
  if (ageWarning) {
    ageWarning.style.display = "none";
  }
  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.style.opacity = "1";
    submitBtn.style.cursor = "pointer";
  }
  return true;
}
window.validateGlobalAge = validateGlobalAge;

// ========================================================
// Gestion de l'opt-in d'âge pour les Réseaux Sociaux
// ========================================================

function toggleSocialRegisterButtons() {
  const checkbox = document.getElementById("social-age-consent");
  const grid = document.getElementById("social-register-grid");
  const warning = document.getElementById("social-age-warning");
  const container = document.getElementById("social-age-container");
  if (!checkbox || !grid) return;

  if (checkbox.checked) {
    grid.style.opacity = "1";
    grid.style.filter = "none";
    if (warning) warning.style.display = "none";
    if (container) {
      container.style.borderColor = "rgba(0, 255, 135, 0.4)";
      container.style.background = "rgba(0, 255, 135, 0.05)";
    }
  } else {
    grid.style.opacity = "0.45";
    grid.style.filter = "grayscale(0.8)";
    if (container) {
      container.style.borderColor = "rgba(255, 255, 255, 0.15)";
      container.style.background = "rgba(255, 255, 255, 0.04)";
    }
  }
}
window.toggleSocialRegisterButtons = toggleSocialRegisterButtons;

function handleSocialRegisterClick(e) {
  const checkbox = document.getElementById("social-age-consent");
  const warning = document.getElementById("social-age-warning");
  const container = document.getElementById("social-age-container");

  if (!checkbox || !checkbox.checked) {
    if (e && typeof e.preventDefault === "function") {
      e.preventDefault();
    }
    if (warning) {
      warning.style.display = "block";
    }
    if (container) {
      container.style.borderColor = "rgba(239, 68, 68, 0.6)";
      container.style.background = "rgba(239, 68, 68, 0.08)";
    }
    showGlobalAuthAlert("⚠️ Veuillez cocher la case d'attestation d'âge avant de continuer.", "error");
    if (checkbox) checkbox.focus();
    return false;
  }
  return true;
}
window.handleSocialRegisterClick = handleSocialRegisterClick;

async function handleGlobalEmailRegister(e) {
  e.preventDefault();

  const birthDateInput = document.getElementById("global-reg-birthdate");
  const birthDateValue = birthDateInput ? birthDateInput.value : "";
  const age = calculateAge(birthDateValue);

  if (age === null || !birthDateValue) {
    showGlobalAuthAlert("❌ Veuillez renseigner votre date de naissance.", "error");
    if (birthDateInput) birthDateInput.focus();
    return;
  }

  if (age < 16) {
    validateGlobalAge();
    showGlobalAuthAlert("❌ Pour des raisons légales, l'accès est interdit aux moins de 16 ans. Seul un adulte disposant de l'autorité parentale peut créer un compte.", "error");
    return;
  }

  const firstName = document.getElementById("global-reg-firstname").value.trim();
  const lastName = document.getElementById("global-reg-lastname").value.trim();
  const userName = document.getElementById("global-reg-username").value.trim();
  const email = document.getElementById("global-reg-email").value.trim();
  const password = document.getElementById("global-reg-password").value;
  const role = "STUDENT";
  const submitBtn = document.getElementById("global-reg-submit-btn");

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = "CRÉATION EN COURS...";
  }

  try {
    const response = await fetch(`${window.API_BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, userName, email, password, role })
    });

    if (response.ok) {
      const data = await response.json();
      const user = {
        id: data.userId,
        userName: data.userName,
        firstName: data.firstName || firstName,
        lastName: data.lastName || lastName,
        email: data.email,
        role: data.role || role,
        avatarUrl: data.avatarUrl
      };

      localStorage.setItem("noseum_token", data.accessToken);
      if (data.refreshToken) {
        localStorage.setItem("noseum_refresh_token", data.refreshToken);
      }
      localStorage.setItem("noseum_user", JSON.stringify(user));
      checkUserAuthHeader();

      const pendingWorkshopId = localStorage.getItem("noseum_pending_workshop_id") || sessionStorage.getItem("noseum_pending_workshop_id");
      const pendingCourseId = sessionStorage.getItem("noseum_pending_checkout_course_id");

      if (pendingWorkshopId) {
        showGlobalAuthAlert("🎉 Compte créé avec succès ! Confirmation de ton atelier en cours...", "success");
        setTimeout(async () => {
          closeGlobalAuthModal();
          try {
            await fetch(`${window.API_BASE_URL}/api/user-workshops/${pendingWorkshopId}`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${data.accessToken}`
              }
            });
            localStorage.removeItem("noseum_pending_workshop_id");
            sessionStorage.removeItem("noseum_pending_workshop_id");
          } catch (err) {
            console.warn("Erreur auto-inscription workshop post-register:", err);
          }
          sessionStorage.setItem("noseum_workshop_just_registered", "true");
          window.location.href = "dashboard.html";
        }, 400);
      } else if (pendingCourseId) {
        const pendingTitle = sessionStorage.getItem("noseum_pending_checkout_course_title") || "";
        const pendingPrice = sessionStorage.getItem("noseum_pending_checkout_course_price") || "";
        const pendingTier = sessionStorage.getItem("noseum_pending_checkout_tier") || "";
        const pendingAddon = sessionStorage.getItem("noseum_pending_checkout_addon") || null;
        sessionStorage.removeItem("noseum_pending_checkout_course_id");
        sessionStorage.removeItem("noseum_pending_checkout_course_title");
        sessionStorage.removeItem("noseum_pending_checkout_course_price");
        sessionStorage.removeItem("noseum_pending_checkout_tier");
        sessionStorage.removeItem("noseum_pending_checkout_addon");

        showGlobalAuthAlert("🎉 Compte créé ! Ouverture du terminal de paiement sécurisé...", "success");
        setTimeout(async () => {
          closeGlobalAuthModal();
          await openStripePaywall(pendingCourseId, pendingTitle, pendingPrice, pendingTier, null, pendingAddon);
        }, 400);
      } else {
        showGlobalAuthAlert("🎉 Compte créé avec succès ! Bienvenue sur NoSeumCode.", "success");
        setTimeout(() => {
          closeGlobalAuthModal();
          window.location.href = "dashboard.html";
        }, 1000);
      }
    } else {
      let errMsg = "Erreur lors de l'inscription (email ou pseudo déjà utilisé).";
      try {
        const errData = await response.json();
        if (errData.message) errMsg = errData.message;
      } catch (_) { }
      showGlobalAuthAlert(`❌ ${errMsg}`, "error");
    }
  } catch (err) {
    console.error("Register error:", err);
    showGlobalAuthAlert("❌ Impossible de joindre le serveur. Assurez-vous que le backend est démarré.", "error");
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = "CRÉER MON COMPTE";
    }
  }
}

async function handleGlobalForgotPassword(e) {
  e.preventDefault();
  const emailInput = document.getElementById("global-forgot-email");
  const email = emailInput ? emailInput.value.trim() : "";
  const submitBtn = document.getElementById("global-forgot-submit-btn");

  if (!email) {
    showGlobalAuthAlert("Veuillez renseigner votre email.", "error");
    return;
  }

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = "ENVOI EN COURS...";
  }

  try {
    await fetch(`${window.API_BASE_URL}/api/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });

    // Message rassurant et sécurisé conforme OWASP
    showGlobalAuthAlert("✅ Si cette adresse email est associée à un compte, un lien de réinitialisation vous a été envoyé. Vérifiez vos emails.", "success");
    if (emailInput) emailInput.value = "";
  } catch (err) {
    console.error("Forgot password error:", err);
    showGlobalAuthAlert("❌ Impossible de joindre le serveur. Veuillez réessayer plus tard.", "error");
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = "ENVOYER LE LIEN";
    }
  }
}
window.handleGlobalForgotPassword = handleGlobalForgotPassword;

async function globalLogout() {
  const refreshToken = localStorage.getItem("noseum_refresh_token");
  if (refreshToken) {
    try {
      fetch(`${window.API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken })
      }).catch(() => {});
    } catch (_) {}
  }
  localStorage.removeItem("noseum_token");
  localStorage.removeItem("noseum_refresh_token");
  localStorage.removeItem("noseum_user");
  checkUserAuthHeader();
  if (window.location.pathname.includes("dashboard")) {
    window.location.href = "index.html";
  }
}

async function loadFooter() {
  const footerPlaceholder = document.getElementById("footer-placeholder");
  if (!footerPlaceholder) return;

  try {
    const response = await fetch(resolveAssetPath("partials/footer.html"));
    if (!response.ok) throw new Error("Failed to load footer");
    const footerHTML = await response.text();
    footerPlaceholder.innerHTML = footerHTML;
  } catch (error) {
    console.error("Error loading footer:", error);
  }
}

async function loadSchedule() {
  const tbody = document.getElementById("promo-schedule-body");
  if (!tbody) return;

  try {
    const response = await fetch(resolveAssetPath("data/schedule.json"));
    if (!response.ok) throw new Error("Failed to load schedule");
    const data = await response.json();

    const popoverTitle = document.querySelector(".promo-popup__title");
    if (popoverTitle && data.title) {
      popoverTitle.textContent = `${data.title} ${data.emoji || ""}`;
    }

    const popoverSubtitle = document.querySelector(".promo-popup__subtitle");
    if (popoverSubtitle && data.subtitle) {
      popoverSubtitle.textContent = data.subtitle;
    }

    tbody.innerHTML = "";

    if (data.sessions && Array.isArray(data.sessions)) {
      data.sessions.forEach(item => {
        const tr = document.createElement("tr");
        const td1 = document.createElement("td");
        const td2 = document.createElement("td");

        td1.textContent = item.date;
        td2.textContent = item.topic;

        tr.appendChild(td1);
        tr.appendChild(td2);
        tbody.appendChild(tr);
      });
    }
  } catch (error) {
    console.error("Error loading schedule:", error);
  }
}

async function updatePromoBanner() {
  const track = document.querySelector(".promo-banner__track");
  if (!track) return;

  const promoBanner = document.querySelector(".promo-banner");
  if (promoBanner && !promoBanner.dataset.pauseListenersAttached) {
    promoBanner.dataset.pauseListenersAttached = "true";
    promoBanner.addEventListener("mouseenter", () => {
      track.style.animationPlayState = "paused";
    });
    promoBanner.addEventListener("mouseleave", () => {
      track.style.animationPlayState = "";
    });
    promoBanner.addEventListener("touchstart", () => {
      track.style.animationPlayState = "paused";
    }, { passive: true });
    promoBanner.addEventListener("touchend", () => {
      setTimeout(() => {
        track.style.animationPlayState = "";
      }, 1500);
    }, { passive: true });
  }

  const targetUrl = resolveAssetPath("workshops.html");

  const navigateToWorkshops = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (window.location.pathname.endsWith("workshops.html") || window.location.pathname.endsWith("workshops")) {
      const targetSection = document.getElementById("workshops-grid") || document.getElementById("planning-title");
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }
    window.location.href = targetUrl;
  };

  // Bind handlers on existing fallback CTAs
  track.querySelectorAll(".promo-banner__cta").forEach((cta) => {
    cta.setAttribute("href", targetUrl);
    cta.addEventListener("click", navigateToWorkshops);
    cta.addEventListener("touchend", navigateToWorkshops);
  });

  try {
    const response = await fetch(resolveAssetPath("data/schedule.json"));
    if (!response.ok) return;
    const data = await response.json();

    if (!data.sessions || !Array.isArray(data.sessions)) return;

    const topics = data.sessions.map((item) => item.topic.toUpperCase()).join(", ");
    const datesArr = data.sessions.map((item) => {
      const match = item.date.match(/\d{2}\/\d{2}/);
      return match ? match[0] : item.date;
    });

    let datesStr = datesArr.join(", ");
    if (datesArr.length > 1) {
      const last = datesArr.pop();
      datesStr = datesArr.join(", ") + " ET " + last;
    }

    const titleText = data.title || "WORKSHOPS GRATUITS";
    const emoji = data.emoji || "✨";

    const buildBannerItem = () => {
      const span = document.createElement("span");
      span.className = "promo-banner__item";

      const textNode = document.createTextNode(`${emoji} ${titleText} : ${topics} ! `);
      span.appendChild(textNode);

      const link = document.createElement("a");
      link.href = targetUrl;
      link.className = "promo-banner__cta bangers-regular";
      link.textContent = "DÉCOUVRIR LES ATELIERS (6 PLACES MAX)";
      link.setAttribute("role", "button");
      link.setAttribute("aria-label", "Découvrir les ateliers pratiques, 6 places maximum");

      link.addEventListener("click", navigateToWorkshops);
      link.addEventListener("touchend", navigateToWorkshops);
      span.appendChild(link);

      return span;
    };

    track.innerHTML = "";
    // Duplicate item for infinite scroll effect
    track.appendChild(buildBannerItem());
    track.appendChild(buildBannerItem());
  } catch (error) {
    console.error("Error updating banner:", error);
  }
}

function setActiveNavLink() {
  const navLinks = document.querySelectorAll(".navbar__link");
  const currentPath = window.location.pathname;

  navLinks.forEach((link) => {
    const anchor = link.querySelector("a");
    if (!anchor) return;

    const href = anchor.getAttribute("href");

    const isHomePage =
      currentPath.endsWith("/") ||
      currentPath.endsWith("/index.html") ||
      currentPath.endsWith("index.html");

    if (isHomePage && (href === "index.html" || href === "/")) {
      link.classList.add("active");
    } else if (currentPath.includes("dashboard") && href && href.includes("dashboard")) {
      link.classList.add("active");
    } else if ((currentPath.includes("cours") || currentPath.includes("parcours")) && href && (href.includes("cours") || href.includes("parcours"))) {
      link.classList.add("active");
    } else if (currentPath.includes("workshops") && href && href.includes("workshops")) {
      link.classList.add("active");
    }
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");
    });
  });
}

function initPromoPopup() {
  const promoPopup = document.getElementById("promo-popup");
  if (!promoPopup) return;

  // Fermeture lors d'un clic en dehors du pop-up (backdrop)
  promoPopup.addEventListener("click", (e) => {
    if (e.target === promoPopup && typeof promoPopup.hidePopover === "function") {
      promoPopup.hidePopover();
    }
  });
}

function initScrollEffect() {
  const header = document.querySelector(".header");
  if (!header) return;

  window.addEventListener(
    "scroll",
    () => {
      const currentScroll = window.scrollY;
      if (currentScroll > 100) {
        header.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.1)";
      } else {
        header.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.08)";
      }
    },
    { passive: true }
  );
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadPartials();
  initScrollEffect();
});


window.openMentorDrawer = function() {
  const drawer = document.getElementById("mentor-addon-drawer");
  if (drawer) {
    drawer.style.display = "block";
    setTimeout(() => { drawer.style.right = "0"; }, 10);
    const btn = document.getElementById("btn-drawer-add-mentor");
    if (btn) {
      btn.onclick = () => {
        closeMentorDrawer();
        const ctx = window.currentPaywallContext || {};
        const courseId = ctx.courseId || "starter";
        const basePrice = parseInt((ctx.priceText || "").replace(/[^0-9]/g, "")) || (ctx.tier === "STARTER" ? 299 : 449);
        const newPrice = (basePrice + 199) + " €";
        const newTitle = (ctx.courseTitle || "Pack").replace(/ \+ Suivi Mentor.*/g, "") + " + Suivi Mentor";
        openStripePaywall(courseId, newTitle, newPrice, ctx.tier, ctx.cohortId, "mentor_4sessions");
      };
    }
  }
};

window.closeMentorDrawer = function() {
  const drawer = document.getElementById("mentor-addon-drawer");
  if (drawer) {
    drawer.style.right = "-400px";
    setTimeout(() => { drawer.style.display = "none"; }, 300);
  }
  const ctx = window.currentPaywallContext || {};
  if (!ctx.addon && sessionStorage.getItem("mentor_downsell_shown") !== "true") {
    setTimeout(() => {
      showMentorDownsellModal();
    }, 350);
  }
};

