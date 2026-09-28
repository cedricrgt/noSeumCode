/**
 * NoSeumCode - Dashboard Multi-Rôles, Notifications & Authentification Sociale
 */

const API_BASE = window.API_BASE_URL;

// State
let currentAuth = {
  token: null,
  user: {
    id: "demo-user-id",
    userName: "Alex Dev",
    firstName: "Alex",
    lastName: "Codeur",
    email: "alex@noseumcode.com",
    role: "STUDENT", // STUDENT, TEACHER, ADMIN
    avatarUrl: null
  }
};

let notifications = [];
let enrolledCourses = [];
let pendingAdminChapters = [];
let teacherChapters = [];
let allAvailableCourses = [];

// Bespoke Brand SVGs (NoSeumCode Style - Zero AI Emojis)
const ICONS = {
  student: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -2px; margin-right: 4px;" aria-hidden="true"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`,
  teacher: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -2px; margin-right: 4px;" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><line x1="9" y1="7" x2="15" y2="7"/><line x1="9" y1="11" x2="13" y2="11"/></svg>`,
  admin: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -2px; margin-right: 4px;" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  check: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -2px; margin-right: 3px;" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>`,
  clock: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -2px; margin-right: 3px;" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  cross: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -2px; margin-right: 3px;" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  refund: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -2px; margin-right: 3px;" aria-hidden="true"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>`,
  trash: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -2px; margin-right: 3px;" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
  ban: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -2px; margin-right: 3px;" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>`,
  unlock: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -2px; margin-right: 3px;" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>`,
  restore: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -2px; margin-right: 3px;" aria-hidden="true"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>`,
  book: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -2px; margin-right: 4px;" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
  users: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -2px; margin-right: 3px;" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  calendar: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -2px; margin-right: 3px;" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  chat: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -2px; margin-right: 3px;" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  voice: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -2px; margin-right: 3px;" aria-hidden="true"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>`,
  bot: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -2px; margin-right: 3px;" aria-hidden="true"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/></svg>`,
  refresh: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -2px; margin-right: 3px;" aria-hidden="true"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-1.19"/></svg>`,
  external: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -2px; margin-right: 3px;" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`,
  edit: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -2px; margin-right: 3px;" aria-hidden="true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
  send: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -2px; margin-right: 3px;" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`,
  user: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -2px; margin-right: 4px;" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  discord: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>`
};

// Init on Load
document.addEventListener("DOMContentLoaded", async () => {
  parseAuthFromUrl();
  setupEventListeners();
  await loadStoredAuth();
  await refreshDashboardData();
  startNotificationPolling();
});

// ==========================================
// 1. Auth & Session Management
// ==========================================

function normalizeRole(role) {
  // Role must come exclusively from the validated JWT claim — never derive it from client-side data.
  if (!role) return "STUDENT";
  const clean = String(role).replace(/^ROLE_/i, "").trim().toUpperCase();
  if (clean === "ADMIN") return "ADMIN";
  if (clean === "TEACHER" || clean === "PROF" || clean === "FORMATEUR" || clean === "ENSEIGNANT") return "TEACHER";
  return "STUDENT";
}

function parseAuthFromUrl() {
  const hash = window.location.hash.substring(1);
  if (!hash) return;

  const params = new URLSearchParams(hash);
  const token = params.get("token");
  const refreshToken = params.get("refreshToken");
  const role = params.get("role");
  const userName = params.get("userName");
  const firstName = params.get("firstName");
  const discordStatus = params.get("discord_status");
  const discordError = params.get("discord_error");

  if (discordStatus === "linked") {
    sessionStorage.setItem("noseum_discord_linked", "true");
  } else if (discordError === "access_denied") {
    sessionStorage.setItem("noseum_discord_denied", "true");
  }

  if (token) {
    currentAuth.token = token;
    currentAuth.user.role = normalizeRole(role, email);
    if (userName) currentAuth.user.userName = decodeURIComponent(userName);
    if (firstName) currentAuth.user.firstName = decodeURIComponent(firstName);
    if (email) currentAuth.user.email = decodeURIComponent(email);

    localStorage.setItem("noseum_token", token);
    if (refreshToken) {
      localStorage.setItem("noseum_refresh_token", refreshToken);
    }
    localStorage.setItem("noseum_user", JSON.stringify(currentAuth.user));
  }

  if (token || discordStatus || discordError) {
    // Clear hash without reloading
    history.replaceState(null, null, window.location.pathname);
  }
}

async function loadStoredAuth() {
  const savedToken = localStorage.getItem("noseum_token");
  const savedUser = localStorage.getItem("noseum_user");

  if (!savedToken || !savedUser) {
    window.location.href = "index.html";
    return;
  }

  currentAuth.token = savedToken;
  try {
    currentAuth.user = JSON.parse(savedUser);
    currentAuth.user.role = normalizeRole(currentAuth.user.role, currentAuth.user.email);
  } catch (e) {
    console.error("Error parsing stored user:", e);
    logout();
    return;
  }

  updateUserUI();

  // Notification après liaison de compte Discord (Sprint 11)
  if (sessionStorage.getItem("noseum_discord_linked") === "true") {
    sessionStorage.removeItem("noseum_discord_linked");
    setTimeout(() => {
      showGlobalDashboardToast("Ton compte Discord a été associé avec succès ! Vos rôles et accès au serveur NoSeumCode sont à jour.", "success");
    }, 300);
  }
  if (sessionStorage.getItem("noseum_discord_denied") === "true") {
    sessionStorage.removeItem("noseum_discord_denied");
    setTimeout(() => {
      showGlobalDashboardToast("L'autorisation Discord a été annulée.", "info");
    }, 300);
  }

  // Notification de confirmation après réservation directe ou redirection post-auth
  if (sessionStorage.getItem("noseum_workshop_just_registered") === "true") {
    sessionStorage.removeItem("noseum_workshop_just_registered");
    setTimeout(() => {
      showGlobalDashboardToast("Félicitations ! Votre place pour l'atelier découverte a été confirmée.", "success");
    }, 200);
  }

  // Synchronisation proactive du paiement si redirection depuis Stripe Checkout (?session_id=...)
  const urlParams = new URLSearchParams(window.location.search);
  const stripeSessionId = urlParams.get("session_id");
  if (stripeSessionId && currentAuth.token) {
    try {
      const syncRes = await apiFetch(`/api/payments/confirm-session?session_id=${encodeURIComponent(stripeSessionId)}`);
      if (syncRes && syncRes.ok) {
        showGlobalDashboardToast("Paiement validé avec succès ! Vos accès et cours sont maintenant débloqués.", "success");
        const cleanUrl = window.location.pathname + window.location.hash;
        window.history.replaceState(null, null, cleanUrl);
      }
    } catch (e) {
      console.warn("Échec de confirmation synchrone session Stripe:", e);
    }
  }

  // Si un achat de formation est en attente, basculer immédiatement vers le checkout du cours
  const pendingCourseId = sessionStorage.getItem("noseum_pending_checkout_course_id");
  if (pendingCourseId) {
    sessionStorage.removeItem("noseum_pending_checkout_course_id");
    sessionStorage.removeItem("noseum_pending_checkout_course_title");
    sessionStorage.removeItem("noseum_pending_checkout_course_price");
    window.location.href = `parcours.html?id=${encodeURIComponent(pendingCourseId)}&auto_checkout=true`;
    return;
  }

  // Si une inscription à un atelier découverte Toussaint est encore en attente (ex: redirection post-auth ou OAuth)
  const pendingWorkshopId = localStorage.getItem("noseum_pending_workshop_id") || sessionStorage.getItem("noseum_pending_workshop_id");
  if (pendingWorkshopId) {
    localStorage.removeItem("noseum_pending_workshop_id");
    sessionStorage.removeItem("noseum_pending_workshop_id");
    try {
      const regRes = await apiFetch(`/api/user-workshops/${pendingWorkshopId}`, { method: "POST" });
      if (regRes && (regRes.ok || regRes.status === 201 || regRes.status === 409)) {
        setTimeout(() => {
          showGlobalDashboardToast("Félicitations ! Votre place pour l'atelier découverte a été confirmée.", "success");
        }, 200);
      } else {
        const errJson = await regRes.json().catch(() => ({}));
        showGlobalDashboardToast(errJson.message || "Impossible de réserver cet atelier (jauge complète).", "error");
      }
    } catch (e) {
      console.error("Erreur auto-inscription workshop:", e);
    }
  }

  // Valider si le compte existe réellement en base de données PostgreSQL
  try {
    const res = await apiFetch("/api/auth/me");
    if (res) {
      if (res.status === 401 || res.status === 404) {
        console.warn("Session expirée ou compte supprimé de la base de données. Déconnexion.");
        logout();
        return;
      }
      if (res.ok) {
        const freshUser = await res.json();
        currentAuth.user.role = normalizeRole(freshUser.role, freshUser.email);
        currentAuth.user.firstName = freshUser.firstName;
        currentAuth.user.lastName = freshUser.lastName;
        currentAuth.user.email = freshUser.email;
        currentAuth.user.userName = freshUser.userName;
        localStorage.setItem("noseum_user", JSON.stringify(currentAuth.user));
        updateUserUI();
      }
    }
  } catch (_) {}
}

let activeDashboardView = null;

function updateUserUI() {
  const userFullNameEl = document.getElementById("dash-user-fullname");
  const userAvatarEl = document.getElementById("dash-user-avatar");
  const userEmailEl = document.getElementById("dash-user-email");
  const roleBadgeEl = document.getElementById("dash-role-badge");
  const heroTitleEl = document.getElementById("dash-hero-title");
  const heroSubtitleEl = document.getElementById("dash-hero-subtitle");
  const adminSwitcher = document.getElementById("admin-view-switcher");

  const displayName = currentAuth.user.firstName
    ? `${currentAuth.user.firstName} ${currentAuth.user.lastName || ""}`.trim()
    : (currentAuth.user.userName || "Apprenant");

  if (userFullNameEl) userFullNameEl.textContent = displayName;
  if (userEmailEl && currentAuth.user.email) userEmailEl.textContent = currentAuth.user.email;

  if (userAvatarEl) {
    const initials = (currentAuth.user.firstName ? currentAuth.user.firstName[0] : (currentAuth.user.userName ? currentAuth.user.userName[0] : "U")) +
                     (currentAuth.user.lastName ? currentAuth.user.lastName[0] : "");
    userAvatarEl.textContent = initials.toUpperCase();
  }

  const role = normalizeRole(currentAuth.user.role, currentAuth.user.email);
  currentAuth.user.role = role;

  if (roleBadgeEl) {
    if (role === "TEACHER") {
      roleBadgeEl.className = "dash-badge-teacher";
      roleBadgeEl.innerHTML = `${ICONS.teacher} FORMATEUR / ENSEIGNANT`;
    } else if (role === "ADMIN") {
      roleBadgeEl.className = "dash-badge-admin";
      roleBadgeEl.innerHTML = `${ICONS.admin} ADMINISTRATEUR`;
    } else {
      roleBadgeEl.className = "dash-badge-student";
      roleBadgeEl.innerHTML = `${ICONS.student} APPRENANT`;
    }
  }

  // Afficher le sélecteur rapide de vue si l'utilisateur est ADMIN
  if (adminSwitcher) {
    adminSwitcher.style.display = (role === "ADMIN") ? "inline-flex" : "none";
  }

  // Si aucune vue n'a été manuellement choisie, adopter la vue par défaut du rôle
  if (!activeDashboardView) {
    activeDashboardView = role;
  }

  applyDashboardView(activeDashboardView);
}

function applyDashboardView(viewRole) {
  const heroTitleEl = document.getElementById("dash-hero-title");
  const heroSubtitleEl = document.getElementById("dash-hero-subtitle");
  const studentView = document.getElementById("view-student");
  const teacherView = document.getElementById("view-teacher");
  const adminView = document.getElementById("view-admin");

  // Mise à jour des boutons du switcher
  const btnAdmin = document.getElementById("btn-view-admin");
  const btnTeacher = document.getElementById("btn-view-teacher");
  const btnStudent = document.getElementById("btn-view-student");

  if (btnAdmin) btnAdmin.className = (viewRole === "ADMIN") ? "button button__primary" : "button button__secondary";
  if (btnTeacher) btnTeacher.className = (viewRole === "TEACHER") ? "button button__primary" : "button button__secondary";
  if (btnStudent) btnStudent.className = (viewRole === "STUDENT") ? "button button__primary" : "button button__secondary";

  if (heroTitleEl && heroSubtitleEl) {
    if (viewRole === "TEACHER") {
      heroTitleEl.textContent = "ESPACE CRÉATION & FORMATEUR";
      heroSubtitleEl.textContent = "Rédigez et publiez vos modules de cours. Vos soumissions sont transmises à la validation administrative.";
    } else if (viewRole === "ADMIN") {
      heroTitleEl.textContent = "CONSOLE D'ADMINISTRATION";
      heroSubtitleEl.textContent = "Validez les cours soumis par les formateurs, supervisez les inscriptions et gérez les publications.";
    } else {
      heroTitleEl.textContent = "TABLEAU DE BORD APPRENANT";
      heroSubtitleEl.textContent = "Retrouvez vos formations en cours, suivez votre progression et téléchargez vos certifications.";
    }
  }

  if (studentView) studentView.style.display = (viewRole === "STUDENT") ? "block" : "none";
  if (teacherView) teacherView.style.display = (viewRole === "TEACHER") ? "block" : "none";
  if (adminView) adminView.style.display = (viewRole === "ADMIN") ? "block" : "none";
}

async function manuallySwitchDashboardView(targetRole) {
  activeDashboardView = targetRole;
  applyDashboardView(targetRole);

  if (targetRole === "STUDENT") {
    await loadStudentCourses();
    await loadStudentWorkshops();
    await loadDiscordStatus();
  } else if (targetRole === "TEACHER") {
    await loadTeacherData();
  } else if (targetRole === "ADMIN") {
    await loadAdminData();
  }
}

function logout() {
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
  currentAuth.token = null;
  window.location.href = "index.html";
}


// ==========================================
// 2. Data Fetching & Sync
// ==========================================

async function apiFetch(endpoint, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  if (currentAuth.token) {
    headers["Authorization"] = `Bearer ${currentAuth.token}`;
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    });
    return response;
  } catch (error) {
    console.warn(`Backend connection to ${endpoint} failed, utilizing local reactive state:`, error);
    return null;
  }
}

async function refreshDashboardData() {
  await fetchNotifications();

  const role = normalizeRole(currentAuth.user.role, currentAuth.user.email);
  currentAuth.user.role = role;

  if (role === "ADMIN") {
    await loadAdminData();
  } else if (role === "TEACHER") {
    await loadTeacherData();
  } else {
    await loadStudentCourses();
    await loadStudentWorkshops();
    await loadDiscordStatus();
  }
}

// ==========================================
// 3. Notifications Module
// ==========================================

async function fetchNotifications() {
  const res = await apiFetch("/api/notifications");
  if (res && res.ok) {
    notifications = await res.json();
  } else if (notifications.length === 0) {
    // Demo mock notifications
    notifications = [
      {
        id: "notif-1",
        title: "Nouvelle section en attente",
        message: "L'enseignant Cedric a soumis 'Architecture Microservices' pour validation.",
        type: "COURSE_SUBMISSION",
        isRead: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString()
      },
      {
        id: "notif-2",
        title: "Section validée !",
        message: "Votre section 'Introduction à Spring Security' a été validée par l'admin.",
        type: "COURSE_APPROVED",
        isRead: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 140).toISOString()
      }
    ];
  }

  renderNotifications();
}

function renderNotifications() {
  const notifListEl = document.getElementById("notif-list");
  const unreadBadgeEl = document.getElementById("notif-unread-badge");

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (unreadBadgeEl) {
    if (unreadCount > 0) {
      unreadBadgeEl.textContent = unreadCount;
      unreadBadgeEl.style.display = "block";
    } else {
      unreadBadgeEl.style.display = "none";
    }
  }

  if (!notifListEl) return;
  notifListEl.innerHTML = "";

  if (notifications.length === 0) {
    notifListEl.innerHTML = `<li style="text-align: center; color: var(--dash-text-muted); padding: 1rem;">Aucune notification</li>`;
    return;
  }

  notifications.forEach(n => {
    const li = document.createElement("li");
    li.className = `notif-item ${n.isRead ? "read" : ""}`;
    li.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <div class="notif-item-title">${escapeHtml(n.title)}</div>
        ${!n.isRead ? `<button onclick="markNotificationRead('${n.id}')" style="background:none; border:none; color:var(--dash-neon-green); cursor:pointer; font-size:0.75rem;">✓ Lu</button>` : ""}
      </div>
      <div class="notif-item-msg">${escapeHtml(n.message)}</div>
      <div class="notif-item-date">${formatRelativeTime(n.createdAt)}</div>
    `;
    notifListEl.appendChild(li);
  });
}

async function markNotificationRead(id) {
  const notif = notifications.find(n => n.id === id);
  if (notif) notif.isRead = true;
  renderNotifications();
  await apiFetch(`/api/notifications/${id}/read`, { method: "PATCH" });
}

async function markAllNotificationsRead() {
  notifications.forEach(n => n.isRead = true);
  renderNotifications();
  await apiFetch("/api/notifications/read-all", { method: "PATCH" });
}

function toggleNotifDropdown() {
  const dropdown = document.getElementById("notif-dropdown");
  const bellBtn = document.getElementById("notif-bell-btn");
  if (dropdown) {
    const isOpen = dropdown.classList.toggle("open");
    if (bellBtn) {
      bellBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    }
  }
}

function startNotificationPolling() {
  if (window._dashPollInterval) clearInterval(window._dashPollInterval);
  window._dashPollInterval = setInterval(async () => {
    await fetchNotifications();
    if (currentAuth.user && currentAuth.user.role === "ADMIN") {
      await loadAdminUsers();
      await loadAdminPendingChapters();
    }
  }, 6000);
}

// ==========================================
// 4. Student View (Enrolled Courses & Viewer)
// ==========================================

async function loadStudentCourses() {
  const res = await apiFetch("/api/enrollments/my-courses");
  if (res && res.ok) {
    enrolledCourses = await res.json();
  } else {
    enrolledCourses = [];
  }

  renderStudentCourses();
}

function getCourseImageForTitle(title, desc = "") {
  const combined = ((title || "") + " " + (desc || "")).toLowerCase();
  if (combined.includes("html") || combined.includes("css")) return "images/courses/html.webp";
  if (combined.includes("javascript") || combined.includes("js")) return "images/courses/javascript.webp";
  if (combined.includes("git") || combined.includes("github")) return "images/courses/git.webp";
  if (combined.includes("java") || combined.includes("spring")) return "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop";
  if (combined.includes("architecture") || combined.includes("ddd")) return "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop";
  return "images/courses/html.webp";
}

function renderStudentCourses() {
  const grid = document.getElementById("student-courses-grid");
  const countEl = document.getElementById("stat-student-enrolled-count");
  const progressEl = document.getElementById("stat-student-avg-progress");

  if (countEl) countEl.textContent = enrolledCourses.length;

  if (progressEl) {
    const avg = enrolledCourses.length
      ? Math.round(enrolledCourses.reduce((acc, c) => acc + (c.progress || 0), 0) / enrolledCourses.length)
      : 0;
    progressEl.textContent = `${avg}%`;
  }

  if (!grid) return;
  grid.innerHTML = "";

  if (enrolledCourses.length === 0) {
    grid.innerHTML = `
      <div style="text-align: center; padding: 3rem 2rem; background: #ffffff; border-radius: 20px; border: 2px dashed #cbd5e1; grid-column: 1 / -1;">
        <div style="width: 54px; height: 54px; border-radius: 12px; background: rgba(0, 255, 135, 0.1); color: #008748; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 0.75rem;">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
        </div>
        <h3 style="font-size: 1.2rem; color: var(--dash-dark-navy); margin-bottom: 0.5rem;">Aucune formation en cours</h3>
        <p style="color: var(--dash-text-muted); font-size: 0.95rem; margin-bottom: 1.5rem;">
          Vous n'êtes inscrit à aucun cours pour le moment. Parcourez notre catalogue pour démarrer votre apprentissage.
        </p>
        <a href="parcours.html" class="button button__primary bangers-regular" style="text-decoration: none; padding: 10px 22px; font-size: 1.2rem; display: inline-block;">
          Découvrir les formations →
        </a>
      </div>
    `;
    return;
  }

  enrolledCourses.forEach(course => {
    const imgUrl = getCourseImageForTitle(course.courseTitle, course.courseDescription);
    const tier = (course.tier || "STARTER").toUpperCase();
    const tierLabel = tier === "STARTER" ? "Pack Fondations" : (tier === "VIP" ? "Pack Mentorat VIP" : "Pack Dynamique");
    const tierColor = tier === "STARTER" ? "#2563eb" : (tier === "VIP" ? "#d97706" : "#7c3aed");
    const tierBg = tier === "STARTER" ? "rgba(37, 99, 235, 0.12)" : (tier === "VIP" ? "rgba(217, 119, 6, 0.12)" : "rgba(124, 58, 237, 0.12)");
    const cohortBadge = course.cohortName ? `<span style="font-size: 0.72rem; color: #0284c7; background: rgba(2, 132, 199, 0.12); padding: 2px 7px; border-radius: 4px; font-weight: 600; display: inline-flex; align-items: center; gap: 3px;">${ICONS.users}${escapeHtml(course.cohortName)}</span>` : "";
    const replayBadge = (tier === "STARTER" || course.lifetimeAccess) ? `<span style="font-size: 0.72rem; color: #059669; background: rgba(5, 150, 105, 0.12); padding: 2px 7px; border-radius: 4px; font-weight: 600; display: inline-flex; align-items: center; gap: 3px;">${ICONS.clock}Replay à vie</span>` : "";

    const card = document.createElement("article");
    card.className = "card card-white card-paddingtop";
    card.style.overflow = "hidden";
    card.innerHTML = `
      <header class="card__imageContainer">
        <img
          class="card__image"
          src="${imgUrl}"
          alt="${escapeHtml(course.courseTitle)}"
          width="400"
          height="250"
          loading="lazy"
          decoding="async"
        />
      </header>
      <main class="card__main">
        <div class="card__header">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 0.35rem; flex-wrap:wrap; gap: 0.4rem;">
            <div style="display:flex; gap:0.4rem; align-items:center; flex-wrap:wrap;">
              <span class="section-tag" style="font-size: 0.72rem; margin-bottom: 0; display: inline-flex; align-items: center; gap: 3px;">${ICONS.student} EN COURS</span>
              <span style="background: ${tierBg}; color: ${tierColor}; font-size: 0.72rem; font-weight: 700; padding: 2px 7px; border-radius: 4px;">${tierLabel}</span>
              ${cohortBadge}
              ${replayBadge}
            </div>
            <span style="font-size: 0.78rem; font-weight: 700; color: #00a85a; background: rgba(0,255,135,0.15); padding: 2px 8px; border-radius: 999px;">${course.progress || 0}% complété</span>
          </div>
          <h3 class="card__title" style="font-size: 1.35rem;">${escapeHtml(course.courseTitle)}</h3>
        </div>
        <p class="card__paragraphe card__textGreen poppins-regular" style="font-size: 0.92rem;">
          ${escapeHtml(course.courseDescription || "Accédez à tous les modules validés et poursuivez votre progression.")}
        </p>
        
        <div class="progress-bar-container" style="margin: 0.5rem 0 1rem 0;">
          <div class="progress-track" style="height: 8px; border-radius: 99px; background: #e2e8f0; overflow: hidden;">
            <div class="progress-fill" style="width: ${course.progress || 0}%; height: 100%; background: linear-gradient(90deg, #00ff87, #00d9ff); border-radius: 99px;"></div>
          </div>
        </div>

        <a href="parcours.html?id=${course.courseId}" class="card__link bangers-regular" style="margin-top: auto;">
          Continuer la formation
          <svg class="card__chevron-darken" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>
      </main>
    `;
    grid.appendChild(card);
  });
}

function openCourseViewer(courseId, title) {
  const modal = document.getElementById("course-viewer-modal");
  const titleEl = document.getElementById("viewer-course-title");
  const contentEl = document.getElementById("viewer-course-curriculum");

  if (titleEl) titleEl.textContent = title;
  if (contentEl) {
    contentEl.innerHTML = `
      <div style="margin-bottom: 1.5rem;">
        <h5 style="color: var(--dash-neon-green); font-size: 1.1rem; margin-bottom: 0.5rem;">Module 1 : Fondations & Architecture</h5>
        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 1rem;">
          <p style="margin: 0 0 0.5rem 0; font-weight: 600;">1.1 Initialisation du projet et configuration des entités</p>
          <p style="color: var(--dash-text-muted); font-size: 0.85rem; margin-bottom: 1rem;">Dans cette section validée, nous explorons la modélisation relationnelle avec PostgreSQL et Flyway.</p>
          <div style="display: flex; gap: 0.75rem;">
            <button class="dash-btn dash-btn-success" style="font-size: 0.8rem; padding: 0.4rem 0.8rem;" onclick="alert('Section marquée comme terminée ! Progression mise à jour.')">✓ Marquer comme terminé</button>
          </div>
        </div>
      </div>
      <div>
        <h5 style="color: var(--dash-neon-green); font-size: 1.1rem; margin-bottom: 0.5rem;">Module 2 : Sécurité & OAuth2 Multi-Fournisseurs</h5>
        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 1rem;">
          <p style="margin: 0 0 0.5rem 0; font-weight: 600;">2.1 Authentification Spring Security (Google, GitHub, Facebook, Discord)</p>
          <p style="color: var(--dash-text-muted); font-size: 0.85rem; margin-bottom: 1rem;">Mise en place de CustomOAuth2UserService, tokens JWT HS256 et gestion des rôles.</p>
          <button class="dash-btn dash-btn-secondary" style="font-size: 0.8rem; padding: 0.4rem 0.8rem;" onclick="alert('Lancement de la vidéo du cours...')">▶ Visionner le cours</button>
        </div>
      </div>
    `;
  }

  if (modal) modal.style.display = "flex";
}

// ==========================================
// 4b. Ateliers Découvertes Toussaint (Student Workshops)
// ==========================================

let enrolledWorkshops = [];

function formatWorkshopDate(isoString) {
  if (!isoString) return "";
  try {
    const d = new Date(isoString);
    const days = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
    const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];
    const dayName = days[d.getDay()];
    const dayNum = String(d.getDate()).padStart(2, "0");
    const monthName = months[d.getMonth()];
    const hours = String(d.getHours()).padStart(2, "0");
    const mins = String(d.getMinutes()).padStart(2, "0");
    return `${dayName} ${dayNum} ${monthName} • ${hours}h${mins === "00" ? "" : mins}`;
  } catch (_) {
    return isoString;
  }
}

async function loadStudentWorkshops() {
  const grid = document.getElementById("student-workshops-grid");
  if (!grid) return;

  try {
    const res = await apiFetch("/api/user-workshops/me");
    if (res && res.ok) {
      enrolledWorkshops = await res.json();
    } else {
      enrolledWorkshops = [];
    }
  } catch (err) {
    console.error("Erreur chargement ateliers apprenant:", err);
    enrolledWorkshops = [];
  }

  renderStudentWorkshops();
}

function renderStudentWorkshops() {
  const grid = document.getElementById("student-workshops-grid");
  if (!grid) return;

  grid.innerHTML = "";

  if (enrolledWorkshops.length === 0) {
    grid.innerHTML = `
      <div style="text-align: center; padding: 2.5rem 2rem; background: #ffffff; border-radius: 20px; border: 2px dashed #cbd5e1; grid-column: 1 / -1;">
        <div style="width: 50px; height: 50px; border-radius: 12px; background: rgba(0, 217, 255, 0.1); color: #0099b8; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 0.75rem;">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        </div>
        <h3 style="font-size: 1.15rem; color: var(--dash-dark-navy); margin-bottom: 0.5rem;">Aucun atelier découverte réservé</h3>
        <p style="color: var(--dash-text-muted); font-size: 0.95rem; margin-bottom: 1.25rem;">
          Profitez des vacances de Toussaint pour coder en direct pendant 2h avec votre mentor (ateliers 100% gratuits, jauge stricte de 6 élèves max).
        </p>
        <a href="workshops.html" class="button button__primary bangers-regular" style="text-decoration: none; padding: 10px 22px; font-size: 1.1rem; display: inline-block;">
          Réserver ma place gratuite →
        </a>
      </div>
    `;
    return;
  }

  enrolledWorkshops.forEach(reg => {
    const card = document.createElement("article");
    card.className = "dash-course-card";
    card.style.display = "flex";
    card.style.flexDirection = "column";
    card.style.justifyContent = "space-between";
    card.style.padding = "1.5rem";

    const dateStr = reg.startDate ? formatWorkshopDate(reg.startDate) : "Session Toussaint";

    card.innerHTML = `
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
          <span style="background: rgba(0, 217, 255, 0.12); color: #0099b8; font-weight: 700; font-size: 0.75rem; padding: 0.25rem 0.6rem; border-radius: 6px; text-transform: uppercase;">
            ${escapeHtml(reg.workshopTheme || "Atelier Découverte")}
          </span>
          <span style="font-size: 0.85rem; color: var(--dash-text-muted); font-weight: 600; display: inline-flex; align-items: center; gap: 4px;">
            ${ICONS.calendar} ${escapeHtml(dateStr)}
          </span>
        </div>
        <h3 style="font-size: 1.2rem; font-weight: 700; color: var(--dash-dark-navy); margin-bottom: 0.5rem; line-height: 1.3;">
          ${escapeHtml(reg.workshopTitle || "Atelier NoSeumCode")}
        </h3>
        <p style="font-size: 0.9rem; color: var(--dash-text-muted); line-height: 1.5; margin-bottom: 1.25rem;">
          ${escapeHtml(reg.workshopDescription || "Session live interactive de 2h sur Google Meet.")}
        </p>
      </div>

      <div style="border-top: 1px solid #e2e8f0; padding-top: 1rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
        <span style="font-size: 0.85rem; color: #059669; font-weight: 600; display: inline-flex; align-items: center; gap: 0.35rem;">
          ${ICONS.check} Place confirmée (6 max)
        </span>
        <button type="button" onclick="cancelStudentWorkshop('${reg.workshopId}')" class="button button__secondary" style="font-size: 0.8rem; padding: 0.4rem 0.8rem; color: #e11d48; border-color: rgba(225,29,72,0.3); background: rgba(225,29,72,0.05); cursor: pointer;">
          Libérer ma place
        </button>
      </div>
    `;

    grid.appendChild(card);
  });
}

async function cancelStudentWorkshop(workshopId) {
  if (!confirm("Voulez-vous vraiment annuler votre inscription à cet atelier ? Cela permettra de libérer votre place pour un autre élève.")) {
    return;
  }

  try {
    const res = await apiFetch(`/api/user-workshops/workshop/${workshopId}`, { method: "DELETE" });
    if (res && (res.ok || res.status === 204)) {
      alert("Votre place a été libérée avec succès.");
      await loadStudentWorkshops();
    } else {
      alert("Impossible d'annuler votre inscription pour le moment.");
    }
  } catch (err) {
    console.error("Erreur annulation atelier:", err);
    alert("Erreur de connexion au serveur.");
  }
}

// ==========================================
// 4c. Portail Client Stripe (Factures & Abonnements)
// ==========================================

async function openStripeCustomerPortal() {
  const token = localStorage.getItem("noseum_token") || currentAuth.token;
  if (!token) {
    alert("Veuillez vous connecter pour accéder à vos factures.");
    return;
  }

  const btnHeader = document.querySelector(".dash-btn-notifications");
  const btnCard = document.getElementById("btn-open-stripe-portal");
  const originalHeaderHtml = btnHeader ? btnHeader.innerHTML : null;
  const originalCardHtml = btnCard ? btnCard.innerHTML : null;

  try {
    if (btnHeader) {
      btnHeader.disabled = true;
      btnHeader.style.opacity = "0.7";
      btnHeader.innerHTML = `<span>Chargement...</span>`;
    }
    if (btnCard) {
      btnCard.disabled = true;
      btnCard.style.opacity = "0.7";
      btnCard.innerHTML = `<span>Ouverture Stripe...</span>`;
    }

    const response = await apiFetch("/api/payments/create-customer-portal-session", {
      method: "POST"
    });

    if (!response) {
      throw new Error("Impossible de joindre le serveur.");
    }

    if (response.status === 401) {
      alert("Votre session a expiré. Veuillez vous reconnecter.");
      logout();
      return;
    }

    const data = await response.json();

    if (response.ok && data.portalUrl) {
      window.location.href = data.portalUrl;
    } else {
      const errorMsg = data.error || "Impossible d'accéder au portail Stripe pour le moment.";
      alert(`Erreur portail : ${errorMsg}`);
    }
  } catch (error) {
    console.error("Erreur lors de l'accès au portail Stripe:", error);
    alert("Une erreur est survenue lors de l'accès à vos factures Stripe. Veuillez réessayer ultérieurement.");
  } finally {
    if (btnHeader && originalHeaderHtml) {
      btnHeader.disabled = false;
      btnHeader.style.opacity = "1";
      btnHeader.innerHTML = originalHeaderHtml;
    }
    if (btnCard && originalCardHtml) {
      btnCard.disabled = false;
      btnCard.style.opacity = "1";
      btnCard.innerHTML = originalCardHtml;
    }
  }
}

window.openStripeCustomerPortal = openStripeCustomerPortal;

// ==========================================
// 4d. Communauté Discord & Liaison Compte Apprenant (Sprint 11)
// ==========================================

async function loadDiscordStatus() {
  const container = document.getElementById("discord-card-container");
  if (!container) return;

  try {
    const response = await apiFetch("/api/discord/status");
    if (!response || !response.ok) {
      if (response && response.status === 401) return;
      throw new Error("Impossible de charger le statut Discord.");
    }

    const data = await response.json();
    renderDiscordCard(data);
    updateDiscordHeaderButton(data);
  } catch (error) {
    console.warn("Erreur chargement Discord:", error);
    if (container) {
      container.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
          <p style="margin: 0; color: #94a3b8; font-size: 0.9rem;">
            Impossible de charger le statut Discord pour le moment.
          </p>
          <button class="button button__secondary" style="padding: 6px 12px; font-size: 0.85rem;" onclick="loadDiscordStatus()">
            Réessayer
          </button>
        </div>
      `;
    }
  }
}

function updateDiscordHeaderButton(data) {
  const btnHeader = document.getElementById("btn-discord-header");
  const labelHeader = document.getElementById("discord-header-label");
  if (!btnHeader || !labelHeader) return;

  if (data && data.linked) {
    labelHeader.textContent = `@${data.discordUsername || "Discord"}`;
    btnHeader.style.background = "rgba(88, 101, 242, 0.1)";
    btnHeader.style.borderColor = "rgba(88, 101, 242, 0.35)";
    btnHeader.style.color = "#4752c4";
  } else {
    labelHeader.textContent = "Discord";
    btnHeader.style.background = "#f8fafc";
    btnHeader.style.borderColor = "#e2e8f0";
    btnHeader.style.color = "#64748b";
  }
}

function renderDiscordCard(data) {
  const container = document.getElementById("discord-card-container");
  if (!container) return;

  if (!data || !data.linked) {
    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1.5rem;">
        <div style="max-width: 680px;">
          <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.5rem;">
            <div style="width: 32px; height: 32px; border-radius: 8px; background: rgba(88, 101, 242, 0.12); color: #5865F2; display: inline-flex; align-items: center; justify-content: center;">
              ${ICONS.discord}
            </div>
            <h3 style="margin: 0; font-size: 1.25rem; font-weight: 700; color: var(--dash-dark-navy, #0a1628);">
              Rejoins le serveur Discord de la communauté NoSeumCode
            </h3>
          </div>
          <p style="margin: 0 0 1.2rem 0; color: var(--dash-text-muted, #718096); font-size: 0.95rem; line-height: 1.6;">
            Associe ton compte Discord en un clic pour débloquer automatiquement tes salons privés de cohorte, participer aux sessions live hebdomadaires, poser tes questions à Cédric et échanger avec les autres apprenants.
          </p>
          <div style="display: flex; flex-wrap: wrap; gap: 0.75rem; font-size: 0.85rem;">
            <span style="display: inline-flex; align-items: center; gap: 0.4rem; background: #f8fafc; border: 1px solid #e2e8f0; color: #475569; padding: 0.35rem 0.75rem; border-radius: 8px; font-weight: 500;">${ICONS.chat} Entraide 7j/7</span>
            <span style="display: inline-flex; align-items: center; gap: 0.4rem; background: #f8fafc; border: 1px solid #e2e8f0; color: #475569; padding: 0.35rem 0.75rem; border-radius: 8px; font-weight: 500;">${ICONS.voice} Salons vocaux live</span>
            <span style="display: inline-flex; align-items: center; gap: 0.4rem; background: #f8fafc; border: 1px solid #e2e8f0; color: #475569; padding: 0.35rem 0.75rem; border-radius: 8px; font-weight: 500;">${ICONS.bot} Rôles automatiques</span>
          </div>
        </div>
        <div>
          <button id="btn-connect-discord" class="button button__primary bangers-regular" onclick="connectDiscordAccount()" style="background: #5865F2; border-color: #5865F2; display: inline-flex; align-items: center; gap: 0.6rem; min-height: 48px; padding: 0.75rem 1.6rem; font-size: 1rem; cursor: pointer; color: #ffffff;" aria-label="Associer mon compte Discord">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
          </button>
        </div>
      </div>
    `;
    return;
  }

  const roleBadges = (data.assignedRoleNames || []).map(r => `
    <span style="background: rgba(88, 101, 242, 0.08); border: 1px solid rgba(88, 101, 242, 0.25); color: #4752c4; padding: 0.3rem 0.7rem; border-radius: 9999px; font-size: 0.8rem; font-weight: 600; display: inline-flex; align-items: center; gap: 4px;">
      ${ICONS.admin} @${escapeHtml(r)}
    </span>
  `).join("");

  const avatarSrc = data.discordAvatar || "images/favicon.png";

  container.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1.5rem;">
      <div style="display: flex; align-items: center; gap: 1.25rem; flex-wrap: wrap;">
        <img src="${escapeHtml(avatarSrc)}" alt="Avatar Discord" style="width: 58px; height: 58px; border-radius: 50%; border: 2px solid #5865F2; object-fit: cover; box-shadow: 0 4px 12px rgba(88, 101, 242, 0.2);" onerror="this.src='images/favicon.png'">
        <div>
          <div style="display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap;">
            <h3 style="margin: 0; font-size: 1.25rem; font-weight: 700; color: var(--dash-dark-navy, #0a1628);">
              @${escapeHtml(data.discordUsername || "Apprenant")}
            </h3>
            <span style="background: rgba(0, 255, 135, 0.15); border: 1px solid rgba(0, 168, 90, 0.3); color: #008748; padding: 0.25rem 0.6rem; border-radius: 6px; font-size: 0.75rem; font-weight: 700;">
              ● COMPTE ASSOCIÉ
            </span>
          </div>
          <p style="margin: 0.35rem 0 0.5rem 0; color: var(--dash-text-muted, #718096); font-size: 0.88rem; display: inline-flex; align-items: center; gap: 4px;">
            ${data.serverJoined ? ICONS.check + ' Membre actif du serveur Discord NoSeumCode' : ICONS.clock + ' En attente de rejoindre le serveur'}
          </p>
          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center;">
            <span style="font-size: 0.82rem; font-weight: 600; color: #475569;">Rôles actifs :</span>
            ${roleBadges.length > 0 ? roleBadges : '<span style="font-size: 0.8rem; color: #94a3b8;">Aucun rôle pour le moment</span>'}
          </div>
        </div>
      </div>
      <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
        <a href="${escapeHtml(data.inviteUrl || 'https://discord.gg/noseumcode')}" target="_blank" rel="noopener noreferrer" class="button button__primary bangers-regular" style="background: #5865F2; border-color: #5865F2; text-decoration: none; display: inline-flex; align-items: center; gap: 0.5rem; min-height: 42px; padding: 0.6rem 1.25rem; font-size: 0.95rem; color: #ffffff;">
          ${ICONS.external} Ouvrir Discord
        </a>
        <button id="btn-sync-discord" class="button button__secondary bangers-regular" onclick="syncDiscordRoles()" style="min-height: 42px; padding: 0.6rem 1.1rem; font-size: 0.95rem; cursor: pointer; display: inline-flex; align-items: center; gap: 0.4rem;" title="Resynchroniser mes rôles Discord">
          ${ICONS.refresh} Synchroniser
        </button>
        <button onclick="unlinkDiscordAccount()" style="font-size: 0.82rem; font-weight: 600; padding: 0.55rem 0.9rem; border-radius: 8px; border: 1px solid #fecdd3; background: #fff1f2; color: #e11d48; cursor: pointer; transition: background 0.2s;" title="Dissocier ce compte Discord">
          Dissocier
        </button>
      </div>
    </div>
  `;
}

async function connectDiscordAccount() {
  const btn = document.getElementById("btn-connect-discord");
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<span>Redirection Discord...</span>`;
  }

  try {
    const redirectTarget = encodeURIComponent(`${window.location.origin}/dashboard.html`);
    const token = currentAuth.token;
    if (!token) {
      throw new Error("Session expirée. Veuillez vous reconnecter.");
    }

    // Détermination dynamique de l'URL du backend (api.noseumcode.fr en prod/develop, localhost:8080 en dev local)
    const backendBase = window.API_BASE_URL || API_BASE || "https://api.noseumcode.fr";
    const linkUrl = `${backendBase}/oauth2/authorization/discord?redirect_uri=${redirectTarget}&link_token=${encodeURIComponent(token)}`;
    window.location.href = linkUrl;
  } catch (error) {
    console.error("Erreur liaison Discord:", error);
    showGlobalDashboardToast("❌ Impossible de joindre Discord. Réessayez ultérieurement.", "error");
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
        </svg>
        <span>Associer mon compte Discord ➔</span>
      `;
    }
  }
}


async function syncDiscordRoles() {
  const btn = document.getElementById("btn-sync-discord");
  const originalHtml = btn ? btn.innerHTML : null;
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<span>⏳ Synchronisation...</span>`;
  }

  try {
    const response = await apiFetch("/api/discord/sync", { method: "POST" });
    if (!response || !response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || "Erreur lors de la synchronisation des rôles.");
    }
    const data = await response.json();
    renderDiscordCard(data);
    showGlobalDashboardToast("✅ Rôles Discord synchronisés avec succès !", "success");
  } catch (error) {
    console.error("Erreur sync Discord:", error);
    showGlobalDashboardToast(`❌ ${error.message}`, "error");
  } finally {
    if (btn && originalHtml) {
      btn.disabled = false;
      btn.innerHTML = originalHtml;
    }
  }
}

async function unlinkDiscordAccount() {
  const confirmed = window.confirm("Êtes-vous sûr de vouloir dissocier votre compte Discord ? Vos rôles NoSeumCode sur le serveur ne seront plus mis à jour.");
  if (!confirmed) return;

  try {
    const response = await apiFetch("/api/discord/unlink", { method: "POST" });
    if (!response || !response.ok) {
      throw new Error("Impossible de dissocier le compte Discord.");
    }
    showGlobalDashboardToast("ℹ️ Votre compte Discord a été dissocié.", "success");
    await loadDiscordStatus();
  } catch (error) {
    console.error("Erreur dissociation Discord:", error);
    showGlobalDashboardToast("❌ Erreur lors de la dissociation du compte.", "error");
  }
}

function scrollToDiscordSection() {
  const section = document.getElementById("discord-section");
  if (section) {
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

window.loadDiscordStatus = loadDiscordStatus;
window.connectDiscordAccount = connectDiscordAccount;
window.syncDiscordRoles = syncDiscordRoles;
window.unlinkDiscordAccount = unlinkDiscordAccount;
window.scrollToDiscordSection = scrollToDiscordSection;

// ==========================================
// 4e. Export HubSpot CRM (Ateliers Découvertes) & Notifications
// ==========================================

function showGlobalDashboardToast(message, type = "success") {
  let toast = document.getElementById("dash-floating-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "dash-floating-toast";
    toast.style.cssText = "position: fixed; top: 24px; right: 24px; z-index: 99999; max-width: 450px; padding: 1rem 1.25rem; border-radius: 12px; font-weight: 600; font-size: 0.95rem; box-shadow: 0 10px 25px rgba(0,0,0,0.15); transition: all 0.3s ease; display: none;";
    document.body.appendChild(toast);
  }

  if (type === "success") {
    toast.style.background = "#ecfdf5";
    toast.style.color = "#065f46";
    toast.style.border = "1px solid #10b981";
  } else if (type === "info") {
    toast.style.background = "#eff6ff";
    toast.style.color = "#1e40af";
    toast.style.border = "1px solid #3b82f6";
  } else {
    toast.style.background = "#fef2f2";
    toast.style.color = "#991b1b";
    toast.style.border = "1px solid #ef4444";
  }

  toast.innerHTML = message;
  toast.style.display = "block";
  toast.style.opacity = "1";

  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => { toast.style.display = "none"; }, 300);
  }, 5000);
}
window.showGlobalDashboardToast = showGlobalDashboardToast;

async function downloadHubspotCsv(workshopId = null) {
  const token = localStorage.getItem("noseum_token") || currentAuth.token;
  if (!token) {
    alert("Veuillez vous connecter avec un compte administrateur.");
    return;
  }

  try {
    showGlobalDashboardToast("⏳ Génération du fichier CSV HubSpot en cours...", "success");
    const url = workshopId
      ? `${API_BASE}/api/user-workshops/export/hubspot-csv?workshopId=${encodeURIComponent(workshopId)}`
      : `${API_BASE}/api/user-workshops/export/hubspot-csv`;

    const res = await fetch(url, {
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (!res.ok) {
      alert("Erreur lors de l'exportation des inscrits (accès administrateur requis).");
      return;
    }

    const blob = await res.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = downloadUrl;
    const now = new Date().toISOString().slice(0, 10);
    a.download = `hubspot_inscrits_workshops_${now}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(downloadUrl);
    showGlobalDashboardToast("✅ Export CSV HubSpot téléchargé avec succès !", "success");
  } catch (err) {
    console.error("Erreur téléchargement CSV HubSpot:", err);
    alert("Impossible de télécharger le fichier d'export CSV.");
  }
}
window.downloadHubspotCsv = downloadHubspotCsv;

// ==========================================
// 5. Teacher View (Course & Section Editing)
// ==========================================

async function loadTeacherData() {
  const res = await apiFetch("/api/courses");
  if (res && res.ok) {
    allAvailableCourses = await res.json();
  } else if (allAvailableCourses.length === 0) {
    allAvailableCourses = [
      { id: "c1000000-0000-0000-0000-000000000001", title: "HTML & CSS – Les Fondations du Web" },
      { id: "c3000000-0000-0000-0000-000000000003", title: "Git & GitHub – L'outil n°1 des devs pro" },
      { id: "c2000000-0000-0000-0000-000000000002", title: "JavaScript – L'interactivité au bout des doigts" }
    ];
  }

  // Load teacher chapters
  if (teacherChapters.length === 0) {
    teacherChapters = [
      {
        id: "chap-101",
        courseId: "c1000000-0000-0000-0000-000000000001",
        courseTitle: "HTML & CSS – Les Fondations du Web",
        title: "Structure Sémantique & Accessibilité Web",
        position: 1,
        content: "# Structure Sémantique & Accessibilité Web\n\nApprenez à structurer des pages HTML5 modernes respectant les standards WCAG et le SEO sémantique.",
        status: "APPROVED",
        submittedAt: "2026-08-20T10:00:00"
      },
      {
        id: "chap-102",
        courseId: "c2000000-0000-0000-0000-000000000002",
        courseTitle: "JavaScript – L'interactivité au bout des doigts",
        title: "Manipulation du DOM & Gestionnaires d'Événements",
        position: 2,
        content: "# Manipulation du DOM\n\nSélection et manipulation dynamique des nœuds DOM en Vanilla JavaScript moderne.",
        status: "PENDING_APPROVAL",
        submittedAt: "2026-08-24T09:30:00"
      },
      {
        id: "chap-103",
        courseId: "c3000000-0000-0000-0000-000000000003",
        courseTitle: "Git & GitHub – L'outil n°1 des devs pro",
        title: "Gestion des Branches & Pull Requests",
        position: 3,
        content: "# Git & Pull Requests\n\nWorkflow GitHub professionnel avec validation de commits et merge sans conflit.",
        status: "REJECTED",
        rejectionReason: "Veuillez détailler les commandes de résolution de conflits (git merge --abort / git checkout).",
        submittedAt: "2026-08-23T14:15:00"
      }
    ];
  }

  renderTeacherDashboard();
}

function renderTeacherDashboard() {
  const grid = document.getElementById("teacher-sections-list");
  const statPublished = document.getElementById("stat-teacher-published");
  const statPending = document.getElementById("stat-teacher-pending");
  const statRejected = document.getElementById("stat-teacher-rejected");

  const publishedCount = teacherChapters.filter(c => c.status === "APPROVED").length;
  const pendingCount = teacherChapters.filter(c => c.status === "PENDING_APPROVAL").length;
  const rejectedCount = teacherChapters.filter(c => c.status === "REJECTED").length;

  if (statPublished) statPublished.textContent = publishedCount;
  if (statPending) statPending.textContent = pendingCount;
  if (statRejected) statRejected.textContent = rejectedCount;

  if (!grid) return;
  grid.innerHTML = "";

  teacherChapters.forEach(chapter => {
    const card = document.createElement("div");
    card.className = "dash-card";

    let statusPillClass = "draft";
    let statusLabel = "Brouillon";

    if (chapter.status === "APPROVED") {
      statusPillClass = "approved";
      statusLabel = "Validé & En ligne";
    } else if (chapter.status === "PENDING_APPROVAL") {
      statusPillClass = "pending";
      statusLabel = "En attente de validation";
    } else if (chapter.status === "REJECTED") {
      statusPillClass = "rejected";
      statusLabel = "Refusé par l'Admin";
    }

    card.innerHTML = `
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
          <span style="font-size: 0.8rem; color: var(--dash-neon-blue); font-weight: 600;">${escapeHtml(chapter.courseTitle || "Formation")}</span>
          <span class="status-pill ${statusPillClass}">${statusLabel}</span>
        </div>
        <h4 class="dash-card-title">${escapeHtml(chapter.title)}</h4>
        <p class="dash-card-desc">Position dans le cours : ${chapter.position}</p>
        ${chapter.content ? `
          <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 0.6rem 0.75rem; margin-top: 0.5rem; max-height: 80px; overflow: hidden; font-size: 0.8rem; color: var(--dash-text-muted); font-family: monospace; white-space: pre-line;">
            ${escapeHtml(chapter.content.slice(0, 150))}${chapter.content.length > 150 ? "..." : ""}
          </div>
        ` : ""}
        ${chapter.status === "REJECTED" && chapter.rejectionReason ? `
          <div class="alert-box danger" style="margin-top: 0.5rem;">
            <div>
              <strong>Motif du refus :</strong><br>
              ${escapeHtml(chapter.rejectionReason)}
            </div>
          </div>
        ` : ""}
      </div>
      <div style="display: flex; gap: 0.75rem; margin-top: 1rem;">
        <button class="dash-btn dash-btn-secondary" style="flex:1; display: inline-flex; align-items: center; justify-content: center; gap: 0.35rem;" onclick="openEditChapterModal('${chapter.id}')">${ICONS.edit} Modifier</button>
        ${chapter.status !== "PENDING_APPROVAL" && chapter.status !== "APPROVED" ? `
          <button class="dash-btn dash-btn-primary" style="flex:1; display: inline-flex; align-items: center; justify-content: center; gap: 0.35rem;" onclick="submitChapter('${chapter.id}')">${ICONS.send} Soumettre</button>
        ` : ""}
      </div>
    `;
    grid.appendChild(card);
  });
}

function openAddChapterModal() {
  const modal = document.getElementById("add-chapter-modal");
  const titleHeading = document.getElementById("add-chapter-modal-title");
  const chapterIdInput = document.getElementById("chapter-id-input");
  const titleInput = document.getElementById("chapter-title-input");
  const positionInput = document.getElementById("chapter-position-input");
  const contentInput = document.getElementById("chapter-content-input");
  const courseSelect = document.getElementById("chapter-course-select");

  if (titleHeading) titleHeading.textContent = "Ajouter une Section de Cours";
  if (chapterIdInput) chapterIdInput.value = "";
  if (titleInput) titleInput.value = "";
  if (positionInput) positionInput.value = "1";
  if (contentInput) contentInput.value = "# Titre de niveau 1\n\n## Sous-titre de section\n\nContenu pédagogique avec explications, texte en **gras**, en *italique* ou en `code inline`.\n\n- Point clé 1\n- Point clé 2\n\n```java\n// Code d'exemple\npublic class Demo {\n    // ...\n}\n```";

  if (courseSelect) {
    courseSelect.innerHTML = allAvailableCourses.map(c => `
      <option value="${c.id}">${escapeHtml(c.title)}</option>
    `).join("");
    courseSelect.disabled = false;
  }

  if (modal) modal.style.display = "flex";
}

function openEditChapterModal(chapterId) {
  const chapter = teacherChapters.find(c => c.id === chapterId);
  if (!chapter) return;

  const modal = document.getElementById("add-chapter-modal");
  const titleHeading = document.getElementById("add-chapter-modal-title");
  const chapterIdInput = document.getElementById("chapter-id-input");
  const titleInput = document.getElementById("chapter-title-input");
  const positionInput = document.getElementById("chapter-position-input");
  const contentInput = document.getElementById("chapter-content-input");
  const courseSelect = document.getElementById("chapter-course-select");

  if (titleHeading) titleHeading.textContent = "✏️ Modifier la Section de Cours";
  if (chapterIdInput) chapterIdInput.value = chapter.id;
  if (titleInput) titleInput.value = chapter.title || "";
  if (positionInput) positionInput.value = chapter.position || 1;
  if (contentInput) contentInput.value = chapter.content || "";

  if (courseSelect) {
    courseSelect.innerHTML = allAvailableCourses.map(c => `
      <option value="${c.id}" ${c.id === chapter.courseId ? "selected" : ""}>${escapeHtml(c.title)}</option>
    `).join("");
    courseSelect.disabled = true;
  }

  if (modal) modal.style.display = "flex";
}

async function handleSaveChapter(event) {
  event.preventDefault();
  const chapterId = document.getElementById("chapter-id-input").value;
  const courseId = document.getElementById("chapter-course-select").value;
  const title = document.getElementById("chapter-title-input").value.trim();
  const position = parseInt(document.getElementById("chapter-position-input").value || "1", 10);
  const content = document.getElementById("chapter-content-input").value;

  if (!title) return;

  if (chapterId) {
    // Modification d'une section existante
    const chapter = teacherChapters.find(c => c.id === chapterId);
    if (chapter) {
      chapter.title = title;
      chapter.position = position;
      chapter.content = content;
      chapter.status = "PENDING_APPROVAL";
      chapter.rejectionReason = null;
      chapter.submittedAt = new Date().toISOString();
    }

    // Envoyer la modification au backend API pour validation
    await apiFetch(`/api/chapters/${chapterId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, position, content })
    });

    notifications.unshift({
      id: "notif-" + Date.now(),
      title: "Section mise à jour et soumise",
      message: `Votre section "${title}" a été mise à jour avec son contenu et renvoyée pour validation.`,
      type: "COURSE_SUBMISSION",
      isRead: false,
      createdAt: new Date().toISOString()
    });

    renderNotifications();
    renderTeacherDashboard();
    closeModal("add-chapter-modal");
    alert("✅ Section mise à jour avec succès et soumise à la validation de l'administrateur !");
  } else {
    // Création d'une nouvelle section
    const selectedCourse = allAvailableCourses.find(c => c.id === courseId) || { title: "Formation" };

    const newChapter = {
      id: "chap-" + Date.now(),
      courseId,
      courseTitle: selectedCourse.title,
      title,
      position,
      content,
      status: "PENDING_APPROVAL",
      submittedAt: new Date().toISOString()
    };

    teacherChapters.unshift(newChapter);

    // Send to backend API
    await apiFetch(`/api/chapters/course/${courseId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, position, content })
    });

    notifications.unshift({
      id: "notif-" + Date.now(),
      title: "Section soumise pour validation",
      message: `Votre section "${title}" avec son contenu pédagogique a été envoyée aux administrateurs pour examen.`,
      type: "COURSE_SUBMISSION",
      isRead: false,
      createdAt: new Date().toISOString()
    });

    renderNotifications();
    renderTeacherDashboard();
    closeModal("add-chapter-modal");
    alert("Section enregistrée avec son contenu et soumise à la validation de l'administrateur !");
  }
}

async function submitChapter(chapterId) {
  const chapter = teacherChapters.find(c => c.id === chapterId);
  if (!chapter) return;

  chapter.status = "PENDING_APPROVAL";
  chapter.rejectionReason = null;
  renderTeacherDashboard();

  await apiFetch(`/api/chapters/${chapterId}/submit`, { method: "POST" });
  alert("Section soumise avec succès aux administrateurs !");
}

// ==========================================
// 6. Admin View (Tabs, Approvals, Courses, Members & RBAC)
// ==========================================

let adminCoursesList = [];
let adminUsersList = [];
let currentSortColumn = "createdAt";
let currentSortAsc = false;

async function switchAdminTab(tabName) {
  // Update active state on stat cards
  const cards = {
    pending: document.getElementById("admin-tab-card-pending"),
    courses: document.getElementById("admin-tab-card-courses"),
    users: document.getElementById("admin-tab-card-users")
  };

  const tabs = {
    pending: document.getElementById("admin-tab-pending"),
    courses: document.getElementById("admin-tab-courses"),
    users: document.getElementById("admin-tab-users")
  };

  Object.keys(cards).forEach(key => {
    if (cards[key]) {
      if (key === tabName) {
        cards[key].classList.add("active");
      } else {
        cards[key].classList.remove("active");
      }
    }
  });

  Object.keys(tabs).forEach(key => {
    if (tabs[key]) {
      tabs[key].style.display = (key === tabName) ? "block" : "none";
    }
  });

  if (tabName === "users") {
    await loadAdminUsers();
  } else if (tabName === "pending") {
    await loadAdminPendingChapters();
  } else if (tabName === "courses") {
    await loadAdminCourses();
  }
}

async function loadAdminData() {
  await Promise.all([
    loadAdminPendingChapters(),
    loadAdminCourses(),
    loadAdminUsers()
  ]);
}

async function loadAdminPendingChapters() {
  const res = await apiFetch("/api/chapters/pending-approval");
  if (res && res.ok) {
    pendingAdminChapters = await res.json();
  } else if (pendingAdminChapters.length === 0) {
    pendingAdminChapters = [
      {
        id: "chap-admin-1",
        courseTitle: "JavaScript – L'interactivité au bout des doigts",
        title: "Manipulation du DOM & Gestionnaires d'Événements",
        createdByName: "Cedric Ragot (Enseignant)",
        position: 2,
        content: "# Manipulation du DOM\n\nSélection et manipulation dynamique des nœuds DOM en Vanilla JavaScript moderne.",
        submittedAt: new Date(Date.now() - 1000 * 60 * 35).toISOString()
      },
      {
        id: "chap-admin-2",
        courseTitle: "HTML & CSS – Les Fondations du Web",
        title: "Mise en page moderne avec CSS Grid & Flexbox",
        createdByName: "Ada Lovelace (Enseignante)",
        position: 2,
        content: "# CSS Grid & Flexbox\n\nConception de grilles responsives fluides sans framework tiers.",
        submittedAt: new Date(Date.now() - 1000 * 60 * 95).toISOString()
      }
    ];
  }

  const statPending = document.getElementById("stat-admin-pending");
  if (statPending) statPending.textContent = pendingAdminChapters.length;

  renderAdminDashboard();
}

async function loadAdminCourses() {
  const tbody = document.getElementById("admin-courses-table-body");
  const statCourses = document.getElementById("stat-admin-courses");

  const res = await apiFetch("/api/courses");
  if (res && res.ok) {
    adminCoursesList = await res.json();
  } else if (adminCoursesList.length === 0) {
    adminCoursesList = [
      {
        id: "c1000000-0000-0000-0000-000000000001",
        title: "HTML & CSS – Les Fondations du Web",
        createdByName: "Cedric Ragot",
        updatedByName: "Cedric Ragot",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
        chaptersCount: 3
      },
      {
        id: "c2000000-0000-0000-0000-000000000002",
        title: "JavaScript – L'interactivité au bout des doigts",
        createdByName: "Ada Lovelace",
        updatedByName: "Ada Lovelace",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
        chaptersCount: 3
      },
      {
        id: "c3000000-0000-0000-0000-000000000003",
        title: "Git & GitHub – L'outil n°1 des devs pro",
        createdByName: "Admin CodeBangers",
        updatedByName: "Admin CodeBangers",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
        updatedAt: new Date().toISOString(),
        chaptersCount: 3
      }
    ];
  }

  if (statCourses) statCourses.textContent = adminCoursesList.length;
  renderAdminCourses();
}

function renderAdminCourses() {
  const tbody = document.getElementById("admin-courses-table-body");
  if (!tbody) return;

  tbody.innerHTML = "";

  if (adminCoursesList.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="padding: 2rem; text-align: center; color: var(--dash-text-muted);">
          Aucune formation active trouvée.
        </td>
      </tr>
    `;
    return;
  }

  adminCoursesList.forEach(course => {
    const tr = document.createElement("tr");
    tr.style.borderBottom = "1px solid #f1f5f9";

    const createdFormatted = course.createdAt ? new Date(course.createdAt).toLocaleDateString("fr-FR", {
      day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit"
    }) : "—";

    const updatedFormatted = course.updatedAt ? new Date(course.updatedAt).toLocaleDateString("fr-FR", {
      day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit"
    }) : "—";

    tr.innerHTML = `
      <td style="padding: 1rem 1.25rem;">
        <a href="parcours.html?id=${course.id}" class="course-title-link" target="_blank" title="Cliquez pour accéder à la formation" style="display: inline-flex; align-items: center; gap: 5px;">
          ${ICONS.book} ${escapeHtml(course.title)}
          <span style="font-size: 0.75rem; color: #00d9ff;">↗</span>
        </a>
      </td>
      <td style="padding: 1rem 1.25rem; font-weight: 500; color: var(--dash-dark-navy);">
        ${escapeHtml(course.createdByName || "Admin")}
      </td>
      <td style="padding: 1rem 1.25rem; color: var(--dash-text-muted); font-size: 0.82rem;">
        ${escapeHtml(createdFormatted)}
      </td>
      <td style="padding: 1rem 1.25rem; font-weight: 500; color: var(--dash-dark-navy);">
        ${escapeHtml(course.updatedByName || course.createdByName || "Admin")}
      </td>
      <td style="padding: 1rem 1.25rem; color: var(--dash-text-muted); font-size: 0.82rem;">
        ${escapeHtml(updatedFormatted)}
      </td>
      <td style="padding: 1rem 1.25rem; text-align: center;">
        <span style="background: #e2e8f0; color: #1e293b; font-weight: 700; padding: 0.25rem 0.6rem; border-radius: 999px; font-size: 0.8rem;">
          ${course.chaptersCount || 0}
        </span>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

async function loadAdminUsers() {
  const tbody = document.getElementById("admin-users-table-body");
  const statUsers = document.getElementById("stat-admin-users");

  const res = await apiFetch("/api/users");
  if (res && res.ok) {
    adminUsersList = await res.json();
  } else if (adminUsersList.length === 0) {
    adminUsersList = [
      {
        id: "e1111111-1111-1111-1111-111111111111",
        userName: "admin",
        firstName: "Admin",
        lastName: "CodeBangers",
        email: "admin@codebangers.fr",
        role: "ADMIN",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
        isDeleted: false,
        isBlocked: false,
        enrolledCoursesCount: 2,
        paymentStatus: "PAYÉ"
      }
    ];
  }

  if (statUsers) statUsers.textContent = adminUsersList.length;
  sortAdminUsers(currentSortColumn, false);
}

function sortAdminUsers(column, toggle = true) {
  if (toggle) {
    if (currentSortColumn === column) {
      currentSortAsc = !currentSortAsc;
    } else {
      currentSortColumn = column;
      currentSortAsc = true;
    }
  }

  // Update sort icons in table headers
  const columns = ["fullName", "email", "role", "createdAt", "enrolledCoursesCount", "paymentStatus", "status"];
  columns.forEach(col => {
    const icon = document.getElementById(`sort-icon-${col}`);
    if (icon) {
      if (col === currentSortColumn) {
        icon.textContent = currentSortAsc ? "▲" : "▼";
        icon.style.opacity = "1";
        icon.style.color = "#00ff87";
      } else {
        icon.textContent = "↕️";
        icon.style.opacity = "0.4";
        icon.style.color = "inherit";
      }
    }
  });

  adminUsersList.sort((a, b) => {
    let valA, valB;

    switch (column) {
      case "fullName":
        valA = `${a.firstName || ""} ${a.lastName || ""}`.trim().toLowerCase();
        valB = `${b.firstName || ""} ${b.lastName || ""}`.trim().toLowerCase();
        break;
      case "email":
        valA = (a.email || "").toLowerCase();
        valB = (b.email || "").toLowerCase();
        break;
      case "role":
        valA = a.role || "";
        valB = b.role || "";
        break;
      case "createdAt":
        valA = new Date(a.createdAt || 0).getTime();
        valB = new Date(b.createdAt || 0).getTime();
        break;
      case "enrolledCoursesCount":
        valA = a.enrolledCoursesCount || 0;
        valB = b.enrolledCoursesCount || 0;
        break;
      case "paymentStatus":
        valA = a.paymentStatus || "";
        valB = b.paymentStatus || "";
        break;
      case "status":
        const aDel = a.isDeleted === true || a.deleted === true;
        const bDel = b.isDeleted === true || b.deleted === true;
        const aBlk = a.isBlocked === true || a.blocked === true;
        const bBlk = b.isBlocked === true || b.blocked === true;
        valA = aDel ? "DELETED" : (aBlk ? "BLOCKED" : "ACTIVE");
        valB = bDel ? "DELETED" : (bBlk ? "BLOCKED" : "ACTIVE");
        break;
      default:
        valA = a[column];
        valB = b[column];
    }

    if (valA < valB) return currentSortAsc ? -1 : 1;
    if (valA > valB) return currentSortAsc ? 1 : -1;
    return 0;
  });

  renderAdminUsers();
}

function renderAdminUsers() {
  const tbody = document.getElementById("admin-users-table-body");
  if (!tbody) return;

  tbody.innerHTML = "";

  if (adminUsersList.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="padding: 2rem; text-align: center; color: var(--dash-text-muted);">
          Aucun utilisateur trouvé.
        </td>
      </tr>
    `;
    return;
  }

  adminUsersList.forEach(user => {
    const tr = document.createElement("tr");
    tr.id = `user-row-${user.id}`;
    tr.style.borderBottom = "1px solid #f1f5f9";
    tr.style.transition = "background 0.15s ease";
    tr.style.cursor = "pointer";
    tr.onclick = (e) => {
      // Ignorer si on clique sur un select ou un bouton
      if (e.target.closest("button") || e.target.closest("select") || e.target.closest("a")) return;
      toggleUserDetailRow(user.id);
    };

    const initial = (user.firstName ? user.firstName[0] : (user.userName ? user.userName[0] : "U")).toUpperCase();
    const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.userName;

    let roleBadgeClass = "dash-badge-student";
    let roleBadgeLabel = `${ICONS.student} APPRENANT`;
    if (user.role === "TEACHER") {
      roleBadgeClass = "dash-badge-teacher";
      roleBadgeLabel = `${ICONS.teacher} ENSEIGNANT`;
    } else if (user.role === "ADMIN") {
      roleBadgeClass = "dash-badge-admin";
      roleBadgeLabel = `${ICONS.admin} ADMIN`;
    }

    // Payment badge
    const pStatus = (user.paymentStatus || "FREE").toUpperCase();
    let paymentBadgeClass = "payment-badge-free";
    let paymentLabel = "Gratuit";

    if (pStatus === "PAID" || pStatus === "PAYÉ") {
      paymentBadgeClass = "payment-badge-paid";
      paymentLabel = "✓ Payé";
    } else if (pStatus === "PENDING" || pStatus === "EN ATTENTE") {
      paymentBadgeClass = "payment-badge-pending";
      paymentLabel = "En attente";
    } else if (pStatus === "REFUNDED" || pStatus === "REMBOURSÉ") {
      paymentBadgeClass = "payment-badge-refunded";
      paymentLabel = "Remboursé";
    } else if (pStatus === "FAILED" || pStatus === "ÉCHOUÉ") {
      paymentBadgeClass = "payment-badge-failed";
      paymentLabel = "Échoué";
    }

    // Account status badge
    const isDeleted = user.isDeleted === true || user.deleted === true;
    const isBlocked = user.isBlocked === true || user.blocked === true;

    let statusBadgeHtml = `<span class="status-badge-active">● Actif</span>`;
    if (isDeleted) {
      statusBadgeHtml = `<span class="status-badge-deleted">${ICONS.trash} Supprimé</span>`;
    } else if (isBlocked) {
      statusBadgeHtml = `<span class="status-badge-banned">${ICONS.ban} Banni</span>`;
    }

    const createdFormatted = user.createdAt ? new Date(user.createdAt).toLocaleDateString("fr-FR", {
      day: "2-digit", month: "2-digit", year: "numeric"
    }) : "—";

    const isOpen = !!openUserDetailsMap[user.id];

    tr.innerHTML = `
      <td style="padding: 1rem 1.25rem;">
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <span id="chevron-${user.id}" style="transition: transform 0.2s ease; display: inline-block; font-size: 0.8rem; color: #64748b; transform: ${isOpen ? "rotate(180deg)" : "rotate(0deg)"};">
            ▼
          </span>
          <div style="width: 36px; height: 36px; border-radius: 50%; background: #e2e8f0; color: #1e293b; font-weight: 700; display: flex; align-items: center; justify-content: center; font-size: 0.85rem;">
            ${escapeHtml(initial)}
          </div>
          <div>
            <div style="font-weight: 600; color: var(--dash-dark-navy); display: flex; align-items: center; gap: 0.35rem;">
              ${escapeHtml(fullName)}
            </div>
            <div style="font-size: 0.75rem; color: var(--dash-text-muted);">@${escapeHtml(user.userName)}</div>
          </div>
        </div>
      </td>
      <td style="padding: 1rem 1.25rem; color: var(--dash-text-muted); font-size: 0.85rem;">
        ${escapeHtml(user.email)}
      </td>
      <td style="padding: 1rem 1.25rem;">
        <span class="${roleBadgeClass}">${roleBadgeLabel}</span>
      </td>
      <td style="padding: 1rem 1.25rem; color: var(--dash-text-muted); font-size: 0.82rem;">
        ${escapeHtml(createdFormatted)}
      </td>
      <td style="padding: 1rem 1.25rem; text-align: center;">
        <span style="background: #f1f5f9; color: var(--dash-dark-navy); font-weight: 700; padding: 0.2rem 0.6rem; border-radius: 6px; font-size: 0.8rem;">
          ${user.enrolledCoursesCount || 0}
        </span>
      </td>
      <td style="padding: 0.75rem 1.25rem;" onclick="event.stopPropagation()">
        <select id="user-pay-select-${user.id}" class="form-select" 
                style="padding: 0.35rem 0.6rem; font-size: 0.8rem; font-weight: 600; width: auto; background: #fff; border: 1.5px solid #cbd5e1; border-radius: 8px; cursor: pointer;"
                onchange="handleUpdateUserGlobalPaymentStatus('${user.id}', this.value)"
                title="Modifier le statut de paiement global de l'utilisateur">
          <option value="PAID" ${pStatus === "PAID" || pStatus === "PAYÉ" ? "selected" : ""}>✓ Payé</option>
          <option value="PENDING" ${pStatus === "PENDING" || pStatus === "EN ATTENTE" ? "selected" : ""}>En attente</option>
          <option value="FAILED" ${pStatus === "FAILED" || pStatus === "ÉCHOUÉ" ? "selected" : ""}>Échoué</option>
          <option value="REFUNDED" ${pStatus === "REFUNDED" || pStatus === "REMBOURSÉ" ? "selected" : ""}>Remboursé</option>
        </select>
      </td>
      <td style="padding: 1rem 1.25rem;">
        ${statusBadgeHtml}
      </td>
      <td style="padding: 1rem 1.25rem; text-align: right;">
        <div style="display: inline-flex; align-items: center; gap: 0.4rem; flex-wrap: wrap; justify-content: flex-end;">
          <button class="button button__secondary" style="padding: 4px 10px; font-size: 0.75rem;" onclick="event.stopPropagation(); toggleUserDetailRow('${user.id}')">
            ${isOpen ? "▲ Fermer" : "▼ Détails & Cours"}
          </button>
          <select id="role-select-${user.id}" class="form-select" style="padding: 0.25rem 0.5rem; font-size: 0.75rem; width: auto; background: #fff;" onclick="event.stopPropagation()">
            <option value="STUDENT" ${user.role === "STUDENT" ? "selected" : ""}>Apprenant</option>
            <option value="TEACHER" ${user.role === "TEACHER" ? "selected" : ""}>Enseignant</option>
            <option value="ADMIN" ${user.role === "ADMIN" ? "selected" : ""}>Admin</option>
          </select>
          <button class="button button__primary" style="padding: 4px 10px; font-size: 0.75rem;" onclick="event.stopPropagation(); handleAssignUserRole('${user.id}')" title="Appliquer le rôle">
            Rôle
          </button>
          ${isBlocked ? `
            <button class="dash-btn dash-btn-success" style="padding: 4px 8px; font-size: 0.75rem; display: inline-flex; align-items: center; gap: 3px;" onclick="event.stopPropagation(); handleToggleBlockUser('${user.id}', true)" title="Débloquer l'utilisateur">
              ${ICONS.unlock} Débloquer
            </button>
          ` : `
            <button class="dash-btn dash-btn-warning" style="padding: 4px 8px; font-size: 0.75rem; display: inline-flex; align-items: center; gap: 3px;" onclick="event.stopPropagation(); handleToggleBlockUser('${user.id}', false)" title="Bannir / Bloquer l'utilisateur">
              ${ICONS.ban} Bannir
            </button>
          `}
          ${isDeleted ? `
            <button class="dash-btn dash-btn-info" style="padding: 4px 8px; font-size: 0.75rem; display: inline-flex; align-items: center; gap: 3px;" onclick="event.stopPropagation(); handleToggleDeleteUser('${user.id}', true)" title="Restaurer l'utilisateur">
              ${ICONS.restore}
            </button>
          ` : `
            <button class="dash-btn dash-btn-danger" style="padding: 4px 8px; font-size: 0.75rem; display: inline-flex; align-items: center; gap: 3px;" onclick="event.stopPropagation(); handleToggleDeleteUser('${user.id}', false)" title="Supprimer l'utilisateur">
              ${ICONS.trash}
            </button>
          `}
        </div>
      </td>
    `;
    tbody.appendChild(tr);

    // Ligne détaillée déroulante
    const detailTr = document.createElement("tr");
    detailTr.id = `user-detail-row-${user.id}`;
    detailTr.className = "user-detail-row";
    detailTr.style.display = isOpen ? "table-row" : "none";
    detailTr.style.background = "#f8fafc";
    detailTr.style.borderBottom = "2px solid #e2e8f0";

    detailTr.innerHTML = `
      <td colspan="8" style="padding: 1.25rem 1.5rem;">
        <div style="background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; padding: 1.5rem; box-shadow: 0 4px 14px rgba(0,0,0,0.03);">
          
          <!-- En-tête du profil détaillé -->
          <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; border-bottom: 1px solid #f1f5f9; padding-bottom: 1rem; margin-bottom: 1.25rem;">
            <div>
              <h4 style="font-size: 1.15rem; font-weight: 700; color: var(--dash-dark-navy); margin-bottom: 0.35rem; display: flex; align-items: center; gap: 0.5rem;">
                <span style="display: inline-flex; align-items: center; gap: 6px;">${ICONS.user} Informations Détaillées : ${escapeHtml(fullName)}</span>
              </h4>
              <div style="font-size: 0.82rem; color: var(--dash-text-muted); display: flex; flex-wrap: wrap; gap: 1rem;">
                <span>UUID : <code style="background: #f1f5f9; padding: 2px 6px; border-radius: 4px; color: #0f172a;">${user.id}</code></span>
                <span>Email : <strong>${escapeHtml(user.email)}</strong></span>
                <span>Provider : <strong style="color: #0284c7;">${escapeHtml(user.provider || "LOCAL")}</strong></span>
                <span>Inscription : <strong>${escapeHtml(createdFormatted)}</strong></span>
              </div>
            </div>
            <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
              <span class="${roleBadgeClass}">${roleBadgeLabel}</span>
              <div style="display: inline-flex; align-items: center; gap: 0.35rem; background: #f8fafc; border: 1px solid #e2e8f0; padding: 0.25rem 0.6rem; border-radius: 8px;">
                <span style="font-size: 0.75rem; font-weight: 600; color: var(--dash-text-muted);">Paiement global :</span>
                <select class="form-select" style="padding: 0.2rem 0.4rem; font-size: 0.75rem; font-weight: 600; width: auto; background: #fff; border: 1px solid #cbd5e1;"
                        onchange="handleUpdateUserGlobalPaymentStatus('${user.id}', this.value)">
                  <option value="PAID" ${pStatus === "PAID" || pStatus === "PAYÉ" ? "selected" : ""}>✓ Payé</option>
                  <option value="PENDING" ${pStatus === "PENDING" || pStatus === "EN ATTENTE" ? "selected" : ""}>En attente</option>
                  <option value="FAILED" ${pStatus === "FAILED" || pStatus === "ÉCHOUÉ" ? "selected" : ""}>Échoué</option>
                  <option value="REFUNDED" ${pStatus === "REFUNDED" || pStatus === "REMBOURSÉ" ? "selected" : ""}>Remboursé</option>
                </select>
              </div>
              ${statusBadgeHtml}
            </div>
          </div>

          <!-- Section Gestion des Formations & Statut de Paiement par Cours -->
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.85rem; flex-wrap: wrap; gap: 0.5rem;">
              <h5 style="font-size: 1rem; font-weight: 700; color: var(--dash-dark-navy); display: flex; align-items: center; gap: 0.5rem;">
                <span style="display: inline-flex; align-items: center; gap: 5px;">${ICONS.book} Formations & Statut de Paiement par Cours</span>
              </h5>
              <span style="font-size: 0.8rem; color: var(--dash-text-muted);">
                Définissez le statut de paiement individuel pour chaque formation :
              </span>
            </div>

            <div id="user-courses-container-${user.id}">
              <div style="text-align: center; padding: 1.5rem; color: var(--dash-text-muted); font-size: 0.85rem;">
                Chargement des formations et des statuts de paiement...
              </div>
            </div>
          </div>

        </div>
      </td>
    `;
    tbody.appendChild(detailTr);

    if (isOpen) {
      loadUserCourseEnrollments(user.id);
    }
  });
}

let openUserDetailsMap = {};

async function toggleUserDetailRow(userId) {
  const detailRow = document.getElementById(`user-detail-row-${userId}`);
  const chevron = document.getElementById(`chevron-${userId}`);
  if (!detailRow) return;

  const isCurrentlyOpen = detailRow.style.display !== "none";
  if (isCurrentlyOpen) {
    detailRow.style.display = "none";
    if (chevron) chevron.style.transform = "rotate(0deg)";
    delete openUserDetailsMap[userId];
  } else {
    detailRow.style.display = "table-row";
    if (chevron) chevron.style.transform = "rotate(180deg)";
    openUserDetailsMap[userId] = true;
    await loadUserCourseEnrollments(userId);
  }
}

async function loadUserCourseEnrollments(userId) {
  const container = document.getElementById(`user-courses-container-${userId}`);
  if (!container) return;

  // 1. Récupérer les cours disponibles sur la plateforme
  if (!adminCoursesList || adminCoursesList.length === 0) {
    const resCourses = await apiFetch("/api/courses");
    if (resCourses && resCourses.ok) {
      adminCoursesList = await resCourses.json();
    }
  }

  // 2. Récupérer les inscriptions réelles de l'utilisateur
  let userEnrollments = [];
  try {
    const resEnroll = await apiFetch(`/api/enrollments/user/${userId}`);
    if (resEnroll && resEnroll.ok) {
      userEnrollments = await resEnroll.json();
    }
  } catch (_) {}

  if (!adminCoursesList || adminCoursesList.length === 0) {
    container.innerHTML = `<div style="padding: 1rem; text-align:center; color:#94a3b8;">Aucune formation disponible sur la plateforme.</div>`;
    return;
  }

  // Filtrer uniquement les cours auxquels l'utilisateur est inscrit
  const enrolledItems = [];
  userEnrollments.forEach(enrollment => {
    const course = adminCoursesList.find(c => c.id === enrollment.courseId) || {
      id: enrollment.courseId,
      title: enrollment.courseTitle || "Formation",
      chaptersCount: 0
    };
    enrolledItems.push({ enrollment, course });
  });

  // Cours disponibles pour inscription manuelle
  const availableToEnroll = adminCoursesList.filter(course => {
    return !userEnrollments.some(e => e.courseId === course.id);
  });

  let html = "";

  if (enrolledItems.length === 0) {
    html += `
      <div style="background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 12px; padding: 1.5rem; text-align: center; color: var(--dash-text-muted); font-size: 0.88rem; margin-bottom: 1rem;">
        Cet utilisateur n'est actuellement inscrit à <strong>aucune formation</strong>.
      </div>
    `;
  } else {
    html += `
      <div style="overflow-x: auto; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff; margin-bottom: 1rem;">
        <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; text-align: left;">
          <thead>
            <tr style="background: #f8fafc; border-bottom: 1px solid #e2e8f0; color: var(--dash-dark-navy); font-weight: 700;">
              <th style="padding: 0.75rem 1rem;">Formation Inscrite</th>
              <th style="padding: 0.75rem 1rem; text-align: center;">Progression</th>
              <th style="padding: 0.75rem 1rem; text-align: center; width: 240px;">Statut de Paiement</th>
              <th style="padding: 0.75rem 1rem; text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody>
    `;

    enrolledItems.forEach(({ enrollment, course }) => {
      const progress = enrollment ? (enrollment.progress || 0) : 0;
      const status = enrollment ? (enrollment.paymentStatus || "PENDING").toUpperCase() : "PENDING";

      html += `
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 0.75rem 1rem;">
            <div style="font-weight: 600; color: var(--dash-dark-navy); font-size: 0.9rem;">${escapeHtml(course.title)}</div>
            <div style="font-size: 0.75rem; color: var(--dash-text-muted);">${course.chaptersCount || 0} chapitres</div>
          </td>
          <td style="padding: 0.75rem 1rem; text-align: center;">
            <div style="font-weight: 600; font-size: 0.8rem; color: var(--dash-dark-navy);">${progress}%</div>
            <div style="width: 70px; height: 5px; background: #e2e8f0; border-radius: 999px; margin: 3px auto 0; overflow: hidden;">
              <div style="width: ${progress}%; height: 100%; background: #00ff87;"></div>
            </div>
          </td>
          <td style="padding: 0.75rem 1rem; text-align: center;">
            <select id="course-pay-select-${userId}-${course.id}" class="form-select" style="padding: 0.35rem 0.6rem; font-size: 0.8rem; font-weight: 600; background: #fff; width: 100%; border: 1.5px solid #cbd5e1;" 
                    onchange="handleUpdateCoursePaymentStatus('${userId}', '${course.id}', this.value)">
              <option value="PAID" ${status === "PAID" ? "selected" : ""}>✓ Payé (Accès complet)</option>
              <option value="PENDING" ${status === "PENDING" ? "selected" : ""}>En attente de paiement</option>
              <option value="FAILED" ${status === "FAILED" ? "selected" : ""}>Échoué</option>
              <option value="REFUNDED" ${status === "REFUNDED" ? "selected" : ""}>Remboursé</option>
            </select>
          </td>
          <td style="padding: 0.75rem 1rem; text-align: right;">
            <div style="display: inline-flex; align-items: center; gap: 0.4rem;">
              <a href="parcours.html?id=${course.id}" target="_blank" class="button button__secondary" style="padding: 4px 10px; font-size: 0.75rem; text-decoration: none; display: inline-block;">
                Accéder ↗
              </a>
              <button class="dash-btn dash-btn-danger" style="padding: 4px 8px; font-size: 0.75rem; display: inline-flex; align-items: center; justify-content: center;" onclick="handleAdminUnenrollUser('${userId}', '${enrollment.id}')" title="Désinscrire l'utilisateur de cette formation">
                ${ICONS.trash}
              </button>
            </div>
          </td>
        </tr>
      `;
    });

    html += `</tbody></table></div>`;
  }

  // Barre d'ajout manuel à une nouvelle formation
  if (availableToEnroll.length > 0) {
    html += `
      <div style="display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap; background: #f8fafc; padding: 0.85rem 1rem; border-radius: 12px; border: 1px solid #e2e8f0;">
        <span style="font-weight: 600; font-size: 0.82rem; color: var(--dash-dark-navy);">+ Inscrire à une autre formation :</span>
        <select id="select-enroll-${userId}" class="form-select" style="padding: 0.35rem 0.65rem; font-size: 0.8rem; width: auto; background: #fff;">
          ${availableToEnroll.map(c => `<option value="${c.id}">${escapeHtml(c.title)}</option>`).join("")}
        </select>
        <button class="button button__primary" style="padding: 5px 12px; font-size: 0.78rem;" onclick="handleAdminEnrollUser('${userId}')">
          Inscrire l'utilisateur
        </button>
      </div>
    `;
  }

  container.innerHTML = html;
}

async function handleAdminEnrollUser(userId) {
  const select = document.getElementById(`select-enroll-${userId}`);
  if (!select || !select.value) return;

  const courseId = select.value;
  const res = await apiFetch(`/api/enrollments/user/${userId}/course/${courseId}/payment-status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ paymentStatus: "PAID" })
  });

  if (res && res.ok) {
    showGlobalDashboardToast("Utilisateur inscrit avec succès !", "success");
  } else {
    await apiFetch(`/api/enrollments/user/${userId}/course/${courseId}/payment-status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentStatus: "PAID" })
    });
    showGlobalDashboardToast("Utilisateur inscrit avec succès !", "success");
  }

  await loadAdminUsers();
  await loadUserCourseEnrollments(userId);
}

async function handleAdminUnenrollUser(userId, enrollmentId) {
  if (!confirm("Voulez-vous vraiment désinscrire cet utilisateur de cette formation ?")) return;

  const res = await apiFetch(`/api/enrollments/${enrollmentId}`, {
    method: "DELETE"
  });

  if (res && (res.ok || res.status === 204)) {
    showGlobalDashboardToast("Inscription supprimée avec succès.", "info");
  }

  await loadAdminUsers();
  await loadUserCourseEnrollments(userId);
}

async function handleUpdateCoursePaymentStatus(userId, courseId, newStatus) {
  const targetUser = adminUsersList.find(u => u.id === userId);
  const userName = targetUser ? (targetUser.firstName || targetUser.userName) : "l'utilisateur";

  let response = await apiFetch(`/api/enrollments/user/${userId}/course/${courseId}/payment-status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ paymentStatus: newStatus })
  });

  if (!response || !response.ok) {
    response = await apiFetch(`/api/enrollments/user/${userId}/course/${courseId}/payment-status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentStatus: newStatus })
    });
  }

  if (response && response.ok) {
    showGlobalDashboardToast(`Statut de cours mis à jour (${newStatus}) pour ${userName}.`, "success");
  } else {
    showGlobalDashboardToast("Erreur lors de la mise à jour du statut.", "error");
  }

  // Mettre à jour la liste des utilisateurs pour recalculer le statut global
  await loadAdminUsers();
  await loadUserCourseEnrollments(userId);
}

async function handleUpdateUserGlobalPaymentStatus(userId, newStatus) {
  const targetUser = adminUsersList.find(u => u.id === userId);
  const userName = targetUser ? (targetUser.firstName || targetUser.userName) : "l'utilisateur";

  try {
    const res = await apiFetch(`/api/payments/user/${userId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        paymentStatus: newStatus,
        source: "ADMIN_MANUAL",
        reason: `Mise à jour manuelle par administrateur vers ${newStatus}`
      })
    });

    if (res && res.ok) {
      showGlobalDashboardToast(`Statut global de ${userName} mis à jour : ${newStatus}`, "success");
    } else {
      showGlobalDashboardToast("Erreur lors de la mise à jour du statut global.", "error");
    }
  } catch (err) {
    console.error("Erreur update payment status:", err);
    showGlobalDashboardToast("Erreur réseau.", "error");
  }

  await loadAdminUsers();
  if (openUserDetailsMap[userId]) {
    await loadUserCourseEnrollments(userId);
  }
}

async function handleAssignUserRole(userId) {
  const select = document.getElementById(`role-select-${userId}`);
  if (!select) return;

  const newRole = select.value;
  const targetUser = adminUsersList.find(u => u.id === userId);
  const userName = targetUser ? (targetUser.firstName || targetUser.userName) : "l'utilisateur";

  let response = await apiFetch(`/api/users/${userId}/role`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role: newRole })
  });

  if (!response || !response.ok) {
    response = await apiFetch(`/api/users/${userId}/role`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole })
    });
  }

  if (response && response.ok) {
    alert(`✅ Rôle de ${userName} mis à jour avec succès : ${newRole}`);
    await loadAdminUsers();
  } else {
    // Si fallback démo
    if (targetUser) {
      targetUser.role = newRole;
      renderAdminUsers();
      alert(`✅ Rôle de ${userName} mis à jour : ${newRole}`);
    } else {
      let errMsg = "Échec de la modification du rôle.";
      if (response) {
        try {
          const data = await response.json();
          if (data.message) errMsg = data.message;
        } catch (_) {}
      }
      alert(`❌ Erreur : ${errMsg}`);
    }
  }
}

async function handleToggleBlockUser(userId, isCurrentlyBlocked) {
  const targetUser = adminUsersList.find(u => u.id === userId);
  const userName = targetUser ? (targetUser.firstName || targetUser.userName) : "l'utilisateur";

  const action = isCurrentlyBlocked ? "unblock" : "block";
  const actionLabel = isCurrentlyBlocked ? "débloquer" : "bannir / bloquer";

  if (!confirm(`Êtes-vous sûr de vouloir ${actionLabel} ${userName} ?`)) return;

  let response = await apiFetch(`/api/users/${userId}/${action}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({})
  });

  if (!response || !response.ok) {
    response = await apiFetch(`/api/users/${userId}/${action}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({})
    });
  }

  if (response && response.ok) {
    alert(`✅ Compte de ${userName} ${isCurrentlyBlocked ? "débloqué" : "banni"} avec succès.`);
    await loadAdminUsers();
  } else {
    let errMsg = "Erreur lors de l'opération.";
    if (response) {
      try {
        const data = await response.json();
        if (data.message) errMsg = data.message;
      } catch (_) {}
    }
    alert(`❌ Échec : ${errMsg}`);
  }
}

async function handleToggleDeleteUser(userId, isCurrentlyDeleted) {
  const targetUser = adminUsersList.find(u => u.id === userId);
  const userName = targetUser ? (targetUser.firstName || targetUser.userName) : "l'utilisateur";

  if (isCurrentlyDeleted) {
    // Restore
    let response = await apiFetch(`/api/users/${userId}/restore`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({})
    });
    if (!response || !response.ok) {
      response = await apiFetch(`/api/users/${userId}/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
      });
    }

    if (response && response.ok) {
      showGlobalDashboardToast(`Compte de ${userName} restauré avec succès.`, "success");
      await loadAdminUsers();
    } else {
      let errMsg = "Erreur lors de la restauration du compte.";
      if (response) {
        try {
          const data = await response.json();
          if (data.message) errMsg = data.message;
        } catch (_) {}
      }
      showGlobalDashboardToast(`Échec : ${errMsg}`, "error");
    }
  } else {
    // Soft delete
    if (!confirm(`Confirmer la suppression (soft-delete) de ${userName} ? (Les données restent conservées en base avec le statut DELETED).`)) return;

    let response = await apiFetch(`/api/users/${userId}`, {
      method: "DELETE"
    });
    if (!response || !response.ok) {
      response = await apiFetch(`/api/users/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
      });
    }

    if (response && response.ok) {
      showGlobalDashboardToast(`Utilisateur ${userName} marqué comme supprimé.`, "info");
      await loadAdminUsers();
    } else {
      let errMsg = "Erreur lors de la suppression.";
      if (response) {
        try {
          const data = await response.json();
          if (data.message) errMsg = data.message;
        } catch (_) {}
      }
      showGlobalDashboardToast(`Échec : ${errMsg}`, "error");
    }
  }
}





function renderAdminDashboard() {
  const listEl = document.getElementById("admin-pending-list");
  const statPending = document.getElementById("stat-admin-pending");

  if (statPending) statPending.textContent = pendingAdminChapters.length;

  if (!listEl) return;
  listEl.innerHTML = "";

  if (pendingAdminChapters.length === 0) {
    listEl.innerHTML = `
      <div style="background: var(--dash-card-bg); border: 1px solid var(--dash-card-border); border-radius: 16px; padding: 2.5rem; text-align: center; color: var(--dash-text-muted);">
        <p style="font-size: 1.2rem; margin-bottom: 0.5rem; color: #fff;">Aucune modification en attente de validation</p>
        <p style="margin: 0;">Toutes les sections soumises par les enseignants ont été traitées.</p>
      </div>
    `;
    return;
  }

  pendingAdminChapters.forEach(item => {
    const card = document.createElement("div");
    card.className = "dash-card";
    card.innerHTML = `
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
          <span style="font-size: 0.85rem; color: var(--dash-neon-blue); font-weight: 600;">${escapeHtml(item.courseTitle || "Formation")}</span>
          <span class="status-pill pending">${ICONS.clock} En attente de validation</span>
        </div>
        <h4 class="dash-card-title">${escapeHtml(item.title)}</h4>
        <p style="font-size: 0.85rem; color: var(--dash-text-muted); margin-bottom: 0.25rem;">
          <strong>Auteur :</strong> ${escapeHtml(item.createdByName || "Enseignant")}
        </p>
        <p style="font-size: 0.8rem; color: rgba(255,255,255,0.4); margin-bottom: 0.75rem;">
          Soumis le : ${new Date(item.submittedAt).toLocaleString("fr-FR")}
        </p>
        ${item.content ? `
          <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 0.6rem 0.75rem; margin-bottom: 1rem; max-height: 110px; overflow-y: auto; font-family: monospace; font-size: 0.8rem; white-space: pre-wrap; color: #cbd5e1;">
            ${escapeHtml(item.content)}
          </div>
        ` : ""}
      </div>
      <div style="display: flex; gap: 0.75rem;">
        <button class="dash-btn dash-btn-success" style="flex:1;" onclick="adminApproveChapter('${item.id}', '${escapeHtml(item.title)}')">
          ✓ Valider et Publier
        </button>
        <button class="dash-btn dash-btn-danger" style="flex:1;" onclick="adminPromptRejectChapter('${item.id}', '${escapeHtml(item.title)}')">
          ✕ Rejeter
        </button>
      </div>
    `;
    listEl.appendChild(card);
  });
}

async function adminApproveChapter(chapterId, title) {
  pendingAdminChapters = pendingAdminChapters.filter(c => c.id !== chapterId);
  renderAdminDashboard();

  await apiFetch(`/api/chapters/${chapterId}/approve`, { method: "POST" });

  notifications.unshift({
    id: "notif-" + Date.now(),
    title: "Section approuvée",
    message: `Vous avez validé et publié la section "${title}".`,
    type: "COURSE_APPROVED",
    isRead: false,
    createdAt: new Date().toISOString()
  });

  renderNotifications();
  alert(`La section "${title}" a été approuvée et est désormais visible pour tous les étudiants inscrits !`);
}

function adminPromptRejectChapter(chapterId, title) {
  const reason = prompt(`Motif du refus pour la section "${title}" :`, "Veuillez détailler les exemples de code.");
  if (reason !== null) {
    adminRejectChapter(chapterId, title, reason);
  }
}

async function adminRejectChapter(chapterId, title, reason) {
  pendingAdminChapters = pendingAdminChapters.filter(c => c.id !== chapterId);
  renderAdminDashboard();

  await apiFetch(`/api/chapters/${chapterId}/reject`, {
    method: "POST",
    body: JSON.stringify({ reason })
  });

  notifications.unshift({
    id: "notif-" + Date.now(),
    title: "Section refusée",
    message: `Vous avez refusé la section "${title}". Motif : ${reason}`,
    type: "COURSE_REJECTED",
    isRead: false,
    createdAt: new Date().toISOString()
  });

  renderNotifications();
  alert(`La section "${title}" a été refusée. L'enseignant a été notifié du motif.`);
}

// ==========================================
// 7. Auth Modal & Social Login Handlers
function openAuthModal(tab = "login") {
  switchAuthTab(tab);
  const modal = document.getElementById("auth-modal");
  if (modal) modal.style.display = "flex";
}


function switchAuthTab(tab) {
  const loginForm = document.getElementById("auth-login-form");
  const registerForm = document.getElementById("auth-register-form");
  const tabLoginBtn = document.getElementById("tab-btn-login");
  const tabRegisterBtn = document.getElementById("tab-btn-register");

  if (tab === "login") {
    if (loginForm) loginForm.style.display = "block";
    if (registerForm) registerForm.style.display = "none";
    if (tabLoginBtn) {
      tabLoginBtn.classList.add("dash-btn-primary");
      tabLoginBtn.classList.remove("dash-btn-secondary");
    }
    if (tabRegisterBtn) {
      tabRegisterBtn.classList.add("dash-btn-secondary");
      tabRegisterBtn.classList.remove("dash-btn-primary");
    }
  } else {
    if (loginForm) loginForm.style.display = "none";
    if (registerForm) registerForm.style.display = "block";
    if (tabRegisterBtn) {
      tabRegisterBtn.classList.add("dash-btn-primary");
      tabRegisterBtn.classList.remove("dash-btn-secondary");
    }
    if (tabLoginBtn) {
      tabLoginBtn.classList.add("dash-btn-secondary");
      tabLoginBtn.classList.remove("dash-btn-primary");
    }
  }
}


if (typeof window.togglePasswordVisibility === "undefined") {
  window.togglePasswordVisibility = function(inputId, btnId) {
    const input = document.getElementById(inputId);
    const btn = document.getElementById(btnId);
    if (!input || !btn) return;

    const isPassword = input.type === "password";
    input.type = isPassword ? "text" : "password";

    btn.setAttribute("aria-label", isPassword ? "Masquer le mot de passe" : "Afficher le mot de passe");
    btn.setAttribute("title", isPassword ? "Masquer le mot de passe" : "Afficher le mot de passe");

    if (isPassword) {
      btn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00ff87" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
          <line x1="1" y1="1" x2="23" y2="23"></line>
        </svg>
      `;
    } else {
      btn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
      `;
    }
  };
}

async function handleEmailLogin(e) {
  e.preventDefault();
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  const res = await apiFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });

  if (res && res.ok) {
    const data = await res.json();
    currentAuth.token = data.accessToken;
    currentAuth.user = {
      id: data.userId,
      userName: data.userName,
      firstName: data.firstName || data.userName,
      lastName: data.lastName || "",
      email: data.email,
      role: data.role || "STUDENT",
      avatarUrl: data.avatarUrl
    };
    localStorage.setItem("noseum_token", data.accessToken);
    localStorage.setItem("noseum_user", JSON.stringify(currentAuth.user));
    closeModal("auth-modal");
    updateUserUI();
    refreshDashboardData();
    alert("Connexion réussie !");
  } else {
    alert("Identifiants incorrects ou serveur indisponible.");
  }
}

async function handleEmailRegister(e) {
  e.preventDefault();
  const userName = document.getElementById("reg-username").value;
  const firstName = document.getElementById("reg-firstname").value;
  const lastName = document.getElementById("reg-lastname").value;
  const email = document.getElementById("reg-email").value;
  const password = document.getElementById("reg-password").value;
  const role = document.getElementById("reg-role").value;

  const res = await apiFetch("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ userName, firstName, lastName, email, password, role })
  });

  if (res && res.ok) {
    const data = await res.json();
    currentAuth.token = data.accessToken;
    currentAuth.user = {
      id: data.userId,
      userName: data.userName,
      firstName: data.firstName || data.userName,
      lastName: data.lastName || "",
      email: data.email,
      role: data.role || role,
      avatarUrl: data.avatarUrl
    };
    localStorage.setItem("noseum_token", data.accessToken);
    localStorage.setItem("noseum_user", JSON.stringify(currentAuth.user));
    closeModal("auth-modal");
    updateUserUI();
    refreshDashboardData();
    alert("Compte créé avec succès ! Bienvenue sur NoSeumCode.");
  } else {
    alert("Erreur lors de la création du compte (email ou nom d'utilisateur déjà utilisé).");
  }
}

// ==========================================
// 8. Helpers & Event Listeners
// ==========================================

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.style.display = "none";
}

function escapeHtml(str) {
  if (!str) return "";
  return str.replace(/[&<>'"]/g, tag => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;"
  }[tag] || tag));
}

function formatRelativeTime(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  const diffMinutes = Math.floor((Date.now() - date.getTime()) / (1000 * 60));

  if (diffMinutes < 1) return "À l'instant";
  if (diffMinutes < 60) return `Il y a ${diffMinutes} min`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `Il y a ${diffHours} h`;
  return date.toLocaleDateString("fr-FR");
}

function setupEventListeners() {
  document.addEventListener("click", (e) => {
    const dropdown = document.getElementById("notif-dropdown");
    const bellBtn = document.getElementById("notif-bell-btn");
    if (dropdown && bellBtn && !dropdown.contains(e.target) && !bellBtn.contains(e.target)) {
      dropdown.classList.remove("open");
      bellBtn.setAttribute("aria-expanded", "false");
    }
  });
}
