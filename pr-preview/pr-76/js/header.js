// Configuration globale de l'API
const isLocalDev =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1" ||
  window.location.hostname.startsWith("192.168.") ||
  window.location.hostname.startsWith("10.") ||
  window.location.hostname.endsWith(".local");

window.API_BASE_URL = isLocalDev
  ? `http://${window.location.hostname}:8080`
  : "https://api.noseumcode.fr"; // Production backend URL


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

async function loadHeader() {
  const headerPlaceholder = document.getElementById("header-placeholder");
  if (!headerPlaceholder) return;

  try {

    const headerResponse = await fetch("partials/header.html");
    if (!headerResponse.ok) throw new Error("Failed to load header");
    let headerHtml = await headerResponse.text();
    headerHtml = headerHtml.replace(/http:\/\/localhost:8080/g, window.API_BASE_URL);
    headerPlaceholder.innerHTML = sanitizePartialHTML(headerHtml);

    await updatePromoBanner();

    const popoversPlaceholder = document.getElementById("popovers-placeholder");
    if (popoversPlaceholder) {
      const popoversResponse = await fetch("partials/popovers-shared.html");
      if (popoversResponse.ok) {
        const popoversHtml = await popoversResponse.text();
        popoversPlaceholder.innerHTML = sanitizePartialHTML(popoversHtml);

        // Inject dynamic OAuth2 URLs based on current environment (API_BASE_URL)
        const oauthLinks = [
          { id: "social-login-google",    provider: "google" },
          { id: "social-login-discord",   provider: "discord" },
          { id: "social-register-google", provider: "google" },
          { id: "social-register-discord",  provider: "discord" },
        ];
        oauthLinks.forEach(({ id, provider }) => {
          const el = document.getElementById(id);
          if (el) el.href = `${window.API_BASE_URL}/oauth2/authorization/${provider}`;
        });

        await loadSchedule();
      }
    }

    setActiveNavLink();
    checkUserAuthHeader();
    initPromoPopup();
    updateHeaderHeightVar();

  } catch (error) {
    console.error("Error loading header:", error);
  }
}

function updateHeaderHeightVar() {
  const header = document.querySelector(".header");
  if (header) {
    const h = header.offsetHeight;
    if (h > 0) {
      document.documentElement.style.setProperty("--header-height", `${h}px`);
    }
  }
}

window.addEventListener("resize", updateHeaderHeightVar);

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
  "html-css": "c1000000-0000-0000-0000-000000000001",
  "javascript": "c2000000-0000-0000-0000-000000000002",
  "git-github": "c3000000-0000-0000-0000-000000000003"
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
 */
function closeStripePaywall() {
  const modal = document.getElementById("stripe-paywall-modal");
  if (modal) {
    if (typeof modal.hidePopover === "function" && modal.matches && modal.matches(":popover-open")) {
      try { modal.hidePopover(); } catch (_) {}
    } else {
      modal.style.display = "none";
    }
  }

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
window.closeStripePaywall = closeStripePaywall;

/**
 * Ouvre le Paywall NoSeumCode intégré directement dans la page.
 * Utilise Stripe Embedded Checkout pour garder l'utilisateur sur le site noseumcode.fr.
 */
async function openStripePaywall(courseId, courseTitle, priceText) {
  courseId = resolveCourseId(courseId);

  // Fermer les popovers de cours et d'authentification
  document.querySelectorAll("[popover]").forEach(p => {
    if (p.id && (p.id.startsWith("course-") || p.id === "auth-popover") && p.matches && p.matches(":popover-open")) {
      try { p.hidePopover(); } catch (_) { }
    }
  });

  const token = localStorage.getItem("noseum_token");
  const userStr = localStorage.getItem("noseum_user");

  // Si non connecté : mémoriser et ouvrir la modale d'inscription
  if (!token || !userStr) {
    sessionStorage.setItem("noseum_pending_checkout_course_id", courseId);
    sessionStorage.setItem("noseum_pending_checkout_course_title", courseTitle || "");
    sessionStorage.setItem("noseum_pending_checkout_course_price", priceText || "");

    openGlobalAuthModal("register");
    showGlobalAuthAlert(`🎓 Créez votre compte pour débloquer "${courseTitle || "votre formation"}" (${priceText || ""}). Le terminal de paiement sécurisé s'affichera directement après connexion.`, "info");
    return;
  }

  const modal = document.getElementById("stripe-paywall-modal");
  if (!modal) {
    console.warn("Modale paywall #stripe-paywall-modal introuvable, redirection classique.");
    window.location.href = `cours.html?id=${encodeURIComponent(courseId)}&checkout=true`;
    return;
  }

  // Mettre à jour les informations du cours dans la modale
  const titleEl = document.getElementById("paywall-course-title");
  if (titleEl) {
    titleEl.textContent = courseTitle || "Débloquer la Formation";
  }
  const priceEl = document.getElementById("paywall-course-price");
  if (priceEl && priceText) {
    priceEl.textContent = priceText;
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
        embedded: true,
        returnUrl: returnUrl,
        successUrl: returnUrl
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
          window.location.href = `cours.html?id=${encodeURIComponent(courseId)}`;
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
        window.location.href = `cours.html?id=${encodeURIComponent(courseId)}`;
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
async function initiateCourseEnrollment(courseId, courseTitle, priceText) {
  courseId = resolveCourseId(courseId);
  await openStripePaywall(courseId, courseTitle, priceText);
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

      const pendingCourseId = sessionStorage.getItem("noseum_pending_checkout_course_id");
      if (pendingCourseId) {
        const pendingTitle = sessionStorage.getItem("noseum_pending_checkout_course_title") || "";
        const pendingPrice = sessionStorage.getItem("noseum_pending_checkout_course_price") || "";
        sessionStorage.removeItem("noseum_pending_checkout_course_id");
        sessionStorage.removeItem("noseum_pending_checkout_course_title");
        sessionStorage.removeItem("noseum_pending_checkout_course_price");

        showGlobalAuthAlert("💳 Connexion réussie ! Ouverture du terminal de paiement sécurisé...", "success");
        setTimeout(async () => {
          closeGlobalAuthModal();
          await openStripePaywall(pendingCourseId, pendingTitle, pendingPrice);
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

      const pendingCourseId = sessionStorage.getItem("noseum_pending_checkout_course_id");
      if (pendingCourseId) {
        const pendingTitle = sessionStorage.getItem("noseum_pending_checkout_course_title") || "";
        const pendingPrice = sessionStorage.getItem("noseum_pending_checkout_course_price") || "";
        sessionStorage.removeItem("noseum_pending_checkout_course_id");
        sessionStorage.removeItem("noseum_pending_checkout_course_title");
        sessionStorage.removeItem("noseum_pending_checkout_course_price");

        showGlobalAuthAlert("🎉 Compte créé ! Ouverture du terminal de paiement sécurisé...", "success");
        setTimeout(async () => {
          closeGlobalAuthModal();
          await openStripePaywall(pendingCourseId, pendingTitle, pendingPrice);
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
    const response = await fetch("partials/footer.html");
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
    const response = await fetch("data/schedule.json");
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

  try {
    const response = await fetch("data/schedule.json");
    if (!response.ok) return;
    const data = await response.json();

    if (!data.sessions || !Array.isArray(data.sessions)) return;

    const topics = data.sessions.map(item => item.topic.toUpperCase()).join(", ");
    const datesArr = data.sessions.map(item => {
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

      const btn = document.createElement("button");
      btn.setAttribute("popovertarget", "promo-popup");
      btn.className = "promo-banner__cta bangers-regular";
      btn.textContent = "VOIR LE PLANNING";
      span.appendChild(btn);

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
  await loadHeader();
  await loadFooter();
  initScrollEffect();
});

