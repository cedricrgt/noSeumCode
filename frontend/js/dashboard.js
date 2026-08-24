/**
 * NoSeumCode - Dashboard Multi-Rôles, Notifications & Authentification Sociale
 */

const API_BASE = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
  ? "http://localhost:8080"
  : "";

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

// Init on Load
document.addEventListener("DOMContentLoaded", async () => {
  parseAuthFromUrl();
  loadStoredAuth();
  setupEventListeners();
  await refreshDashboardData();
  startNotificationPolling();
});

// ==========================================
// 1. Auth & Session Management
// ==========================================

function parseAuthFromUrl() {
  const hash = window.location.hash.substring(1);
  if (!hash) return;

  const params = new URLSearchParams(hash);
  const token = params.get("token");
  const role = params.get("role");
  const userName = params.get("userName");
  const firstName = params.get("firstName");

  if (token) {
    currentAuth.token = token;
    currentAuth.user.role = role || "STUDENT";
    if (userName) currentAuth.user.userName = decodeURIComponent(userName);
    if (firstName) currentAuth.user.firstName = decodeURIComponent(firstName);

    localStorage.setItem("noseum_token", token);
    localStorage.setItem("noseum_user", JSON.stringify(currentAuth.user));

    // Clear hash without reloading
    history.replaceState(null, null, window.location.pathname);
  }
}

function loadStoredAuth() {
  const savedToken = localStorage.getItem("noseum_token");
  const savedUser = localStorage.getItem("noseum_user");

  if (savedToken) {
    currentAuth.token = savedToken;
  }
  if (savedUser) {
    try {
      currentAuth.user = JSON.parse(savedUser);
    } catch (e) {
      console.error("Error parsing stored user:", e);
    }
  }

  updateUserUI();
}

function updateUserUI() {
  const userFullNameEl = document.getElementById("dash-user-fullname");
  const userAvatarEl = document.getElementById("dash-user-avatar");
  const userEmailEl = document.getElementById("dash-user-email");
  const roleBadgeEl = document.getElementById("dash-role-badge");
  const heroTitleEl = document.getElementById("dash-hero-title");
  const heroSubtitleEl = document.getElementById("dash-hero-subtitle");

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

  const role = currentAuth.user.role || "STUDENT";

  if (roleBadgeEl) {
    if (role === "TEACHER") {
      roleBadgeEl.className = "dash-badge-teacher";
      roleBadgeEl.textContent = "👨‍🏫 FORMATEUR / ENSEIGNANT";
    } else if (role === "ADMIN") {
      roleBadgeEl.className = "dash-badge-admin";
      roleBadgeEl.textContent = "🛡️ ADMINISTRATEUR";
    } else {
      roleBadgeEl.className = "dash-badge-student";
      roleBadgeEl.textContent = "🎓 APPRENANT";
    }
  }

  if (heroTitleEl && heroSubtitleEl) {
    if (role === "TEACHER") {
      heroTitleEl.textContent = "ESPACE CRÉATION & FORMATEUR";
      heroSubtitleEl.textContent = "Rédigez et publiez vos modules de cours. Vos soumissions sont transmises à la validation administrative.";
    } else if (role === "ADMIN") {
      heroTitleEl.textContent = "CONSOLE D'ADMINISTRATION";
      heroSubtitleEl.textContent = "Validez les cours soumis par les formateurs, supervisez les inscriptions et gérez les publications.";
    } else {
      heroTitleEl.textContent = "TABLEAU DE BORD APPRENANT";
      heroSubtitleEl.textContent = "Retrouvez vos formations en cours, suivez votre progression et téléchargez vos certifications.";
    }
  }

  // Toggle View Panels strictly according to assigned role
  const studentView = document.getElementById("view-student");
  const teacherView = document.getElementById("view-teacher");
  const adminView = document.getElementById("view-admin");

  if (studentView) studentView.style.display = role === "STUDENT" ? "block" : "none";
  if (teacherView) teacherView.style.display = role === "TEACHER" ? "block" : "none";
  if (adminView) adminView.style.display = role === "ADMIN" ? "block" : "none";
}

function logout() {
  localStorage.removeItem("noseum_token");
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

  if (currentAuth.user.role === "STUDENT") {
    await loadStudentCourses();
  } else if (currentAuth.user.role === "TEACHER") {
    await loadTeacherData();
  } else if (currentAuth.user.role === "ADMIN") {
    await loadAdminData();
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
  if (dropdown) {
    dropdown.classList.toggle("open");
  }
}

function startNotificationPolling() {
  setInterval(async () => {
    await fetchNotifications();
  }, 15000);
}

// ==========================================
// 4. Student View (Enrolled Courses & Viewer)
// ==========================================

async function loadStudentCourses() {
  const res = await apiFetch("/api/enrollments/my-courses");
  if (res && res.ok) {
    enrolledCourses = await res.json();
  } else if (enrolledCourses.length === 0) {
    enrolledCourses = [
      {
        id: "enr-1",
        courseId: "c-1",
        courseTitle: "Fullstack Java 21 & Spring Boot 3",
        courseDescription: "De zéro au déploiement cloud : API REST, JPA, Spring Security, Flyway et frontend moderne.",
        progress: 65,
        paymentStatus: "PAID"
      },
      {
        id: "enr-2",
        courseId: "c-2",
        courseTitle: "Clean Architecture & DDD en Pratique",
        courseDescription: "Maîtrisez les ports, adaptateurs, patterns CQRS et les architectures modulaires d'entreprise.",
        progress: 25,
        paymentStatus: "PAID"
      }
    ];
  }

  renderStudentCourses();
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

  enrolledCourses.forEach(course => {
    const card = document.createElement("div");
    card.className = "dash-card";
    card.innerHTML = `
      <div>
        <h4 class="dash-card-title">${escapeHtml(course.courseTitle)}</h4>
        <p class="dash-card-desc">${escapeHtml(course.courseDescription || "Accédez à tous les modules validés.")}</p>
        <div class="progress-bar-container">
          <div class="progress-info">
            <span>Progression</span>
            <span>${course.progress || 0}%</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill" style="width: ${course.progress || 0}%;"></div>
          </div>
        </div>
      </div>
      <button class="dash-btn dash-btn-primary" onclick="openCourseViewer('${course.courseId}', '${escapeHtml(course.courseTitle)}')">
        <span>📖 Continuer la formation</span>
      </button>
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
// 5. Teacher View (Course & Section Editing)
// ==========================================

async function loadTeacherData() {
  const res = await apiFetch("/api/courses");
  if (res && res.ok) {
    allAvailableCourses = await res.json();
  } else if (allAvailableCourses.length === 0) {
    allAvailableCourses = [
      { id: "c-1", title: "Fullstack Java 21 & Spring Boot 3" },
      { id: "c-2", title: "Clean Architecture & DDD en Pratique" },
      { id: "c-3", title: "Docker, Kubernetes & Déploiement Cloud" }
    ];
  }

  // Load teacher chapters
  if (teacherChapters.length === 0) {
    teacherChapters = [
      {
        id: "chap-101",
        courseId: "c-1",
        courseTitle: "Fullstack Java 21 & Spring Boot 3",
        title: "Introduction aux Records et Pattern Matching Java 21",
        position: 1,
        status: "APPROVED",
        submittedAt: "2026-08-20T10:00:00"
      },
      {
        id: "chap-102",
        courseId: "c-1",
        courseTitle: "Fullstack Java 21 & Spring Boot 3",
        title: "Mise en place de Spring Security & OAuth2 Social Login",
        position: 2,
        status: "PENDING_APPROVAL",
        submittedAt: "2026-08-24T09:30:00"
      },
      {
        id: "chap-103",
        courseId: "c-2",
        courseTitle: "Clean Architecture & DDD en Pratique",
        title: "Gestion des Événements de Domaine avec Kafka",
        position: 3,
        status: "REJECTED",
        rejectionReason: "Veuillez inclure le schéma architectural du Transactional Outbox Pattern avant de republier.",
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
      statusLabel = "🟢 Validé & En ligne";
    } else if (chapter.status === "PENDING_APPROVAL") {
      statusPillClass = "pending";
      statusLabel = "🟡 En attente de validation Admin";
    } else if (chapter.status === "REJECTED") {
      statusPillClass = "rejected";
      statusLabel = "🔴 Refusé par l'Admin";
    }

    card.innerHTML = `
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
          <span style="font-size: 0.8rem; color: var(--dash-neon-blue); font-weight: 600;">${escapeHtml(chapter.courseTitle || "Formation")}</span>
          <span class="status-pill ${statusPillClass}">${statusLabel}</span>
        </div>
        <h4 class="dash-card-title">${escapeHtml(chapter.title)}</h4>
        <p class="dash-card-desc">Position dans le cours : ${chapter.position}</p>
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
        <button class="dash-btn dash-btn-secondary" style="flex:1;" onclick="openEditChapterModal('${chapter.id}')">✏️ Modifier</button>
        ${chapter.status !== "PENDING_APPROVAL" && chapter.status !== "APPROVED" ? `
          <button class="dash-btn dash-btn-primary" style="flex:1;" onclick="submitChapter('${chapter.id}')">🚀 Soumettre</button>
        ` : ""}
      </div>
    `;
    grid.appendChild(card);
  });
}

function openAddChapterModal() {
  const modal = document.getElementById("add-chapter-modal");
  const courseSelect = document.getElementById("chapter-course-select");

  if (courseSelect) {
    courseSelect.innerHTML = allAvailableCourses.map(c => `
      <option value="${c.id}">${escapeHtml(c.title)}</option>
    `).join("");
  }

  if (modal) modal.style.display = "flex";
}

async function handleSaveChapter(event) {
  event.preventDefault();
  const courseId = document.getElementById("chapter-course-select").value;
  const title = document.getElementById("chapter-title-input").value;
  const position = parseInt(document.getElementById("chapter-position-input").value || "1", 10);

  const selectedCourse = allAvailableCourses.find(c => c.id === courseId) || { title: "Formation" };

  const newChapter = {
    id: "chap-" + Date.now(),
    courseId,
    courseTitle: selectedCourse.title,
    title,
    position,
    status: "PENDING_APPROVAL",
    submittedAt: new Date().toISOString()
  };

  teacherChapters.unshift(newChapter);

  // Send to backend API
  await apiFetch(`/api/chapters/course/${courseId}`, {
    method: "POST",
    body: JSON.stringify({ title, position })
  });

  // Add system notification for testing
  notifications.unshift({
    id: "notif-" + Date.now(),
    title: "Section soumise pour validation",
    message: `Votre section "${title}" a été envoyée aux administrateurs pour examen.`,
    type: "COURSE_SUBMISSION",
    isRead: false,
    createdAt: new Date().toISOString()
  });

  renderNotifications();
  renderTeacherDashboard();
  closeModal("add-chapter-modal");

  alert("Section enregistrée et soumise à la validation de l'administrateur !");
}

function openEditChapterModal(chapterId) {
  const chapter = teacherChapters.find(c => c.id === chapterId);
  if (!chapter) return;

  const newTitle = prompt("Modifier le titre de la section :", chapter.title);
  if (newTitle && newTitle.trim()) {
    chapter.title = newTitle.trim();
    chapter.status = "PENDING_APPROVAL";
    chapter.rejectionReason = null;
    renderTeacherDashboard();
    alert("Section mise à jour et repassée en attente de validation !");
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
// 6. Admin View (Validation Queue & Decisions)
// ==========================================

async function loadAdminData() {
  const res = await apiFetch("/api/chapters/pending-approval");
  if (res && res.ok) {
    pendingAdminChapters = await res.json();
  } else if (pendingAdminChapters.length === 0) {
    pendingAdminChapters = [
      {
        id: "chap-admin-1",
        courseTitle: "Fullstack Java 21 & Spring Boot 3",
        title: "Mise en place de Spring Security & OAuth2 Social Login",
        createdByName: "Cedric Ragot (Enseignant)",
        position: 2,
        submittedAt: new Date(Date.now() - 1000 * 60 * 35).toISOString()
      },
      {
        id: "chap-admin-2",
        courseTitle: "Clean Architecture & DDD en Pratique",
        title: "Architecture Hexagonale : Ports & Adaptateurs",
        createdByName: "Jane Doe (Enseignante)",
        position: 4,
        submittedAt: new Date(Date.now() - 1000 * 60 * 95).toISOString()
      }
    ];
  }

  renderAdminDashboard();
  await loadAdminUsers();
}

let adminUsersList = [];

async function loadAdminUsers() {
  const tbody = document.getElementById("admin-users-table-body");
  if (!tbody) return;

  const res = await apiFetch("/api/users");
  if (res && res.ok) {
    adminUsersList = await res.json();
    renderAdminUsers();
  } else {
    tbody.innerHTML = `
      <tr>
        <td colspan="4" style="padding: 1.5rem; text-align: center; color: var(--dash-text-muted);">
          Impossible de charger les utilisateurs ou privilèges administrateur requis.
        </td>
      </tr>
    `;
  }
}

function renderAdminUsers() {
  const tbody = document.getElementById("admin-users-table-body");
  if (!tbody) return;

  tbody.innerHTML = "";

  if (adminUsersList.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4" style="padding: 1.5rem; text-align: center; color: var(--dash-text-muted);">
          Aucun utilisateur trouvé.
        </td>
      </tr>
    `;
    return;
  }

  adminUsersList.forEach(user => {
    const tr = document.createElement("tr");
    tr.style.borderBottom = "1px solid #f1f5f9";
    tr.style.transition = "background 0.15s ease";

    const initial = (user.firstName ? user.firstName[0] : (user.userName ? user.userName[0] : "U")).toUpperCase();
    const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.userName;

    let roleBadgeClass = "dash-badge-student";
    let roleBadgeLabel = "🎓 APPRENANT";
    if (user.role === "TEACHER") {
      roleBadgeClass = "dash-badge-teacher";
      roleBadgeLabel = "👨‍🏫 ENSEIGNANT";
    } else if (user.role === "ADMIN") {
      roleBadgeClass = "dash-badge-admin";
      roleBadgeLabel = "🛡️ ADMIN";
    }

    tr.innerHTML = `
      <td style="padding: 1rem 1.25rem;">
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <div style="width: 36px; height: 36px; border-radius: 50%; background: #e2e8f0; color: #1e293b; font-weight: 700; display: flex; align-items: center; justify-content: center; font-size: 0.85rem;">
            ${escapeHtml(initial)}
          </div>
          <div>
            <div style="font-weight: 600; color: var(--dash-dark-navy);">${escapeHtml(fullName)}</div>
            <div style="font-size: 0.75rem; color: var(--dash-text-muted);">@${escapeHtml(user.userName)}</div>
          </div>
        </div>
      </td>
      <td style="padding: 1rem 1.25rem; color: var(--dash-text-muted);">
        ${escapeHtml(user.email)}
      </td>
      <td style="padding: 1rem 1.25rem;">
        <span class="${roleBadgeClass}">${roleBadgeLabel}</span>
      </td>
      <td style="padding: 1rem 1.25rem; text-align: right;">
        <div style="display: inline-flex; align-items: center; gap: 0.5rem;">
          <select id="role-select-${user.id}" class="form-select" style="padding: 0.35rem 0.6rem; font-size: 0.8rem; width: auto; background: #fff;">
            <option value="STUDENT" ${user.role === "STUDENT" ? "selected" : ""}>🎓 Apprenant</option>
            <option value="TEACHER" ${user.role === "TEACHER" ? "selected" : ""}>👨‍🏫 Enseignant</option>
            <option value="ADMIN" ${user.role === "ADMIN" ? "selected" : ""}>🛡️ Admin</option>
          </select>
          <button class="button button__primary" style="padding: 6px 14px; font-size: 0.8rem;" onclick="handleAssignUserRole('${user.id}')">
            Appliquer
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
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
    // Retry with PUT as fallback
    response = await apiFetch(`/api/users/${userId}/role`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole })
    });
  }

  if (response && response.ok) {
    const updatedUser = await response.json();
    alert(`✅ Rôle de ${userName} mis à jour avec succès : ${newRole}`);
    await loadAdminUsers();
  } else {
    let errMsg = "Échec de la modification du rôle.";
    if (response) {
      try {
        const data = await response.json();
        if (data.message) errMsg = data.message;
      } catch (_) {}
    }
    alert(`❌ Accès refusé ou erreur backend : ${errMsg}`);
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
        <p style="font-size: 1.2rem; margin-bottom: 0.5rem; color: #fff;">🎉 Aucune modification en attente de validation</p>
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
          <span class="status-pill pending">🟡 En attente de validation</span>
        </div>
        <h4 class="dash-card-title">${escapeHtml(item.title)}</h4>
        <p style="font-size: 0.85rem; color: var(--dash-text-muted); margin-bottom: 0.25rem;">
          <strong>Auteur :</strong> ${escapeHtml(item.createdByName || "Enseignant")}
        </p>
        <p style="font-size: 0.8rem; color: rgba(255,255,255,0.4); margin-bottom: 1.25rem;">
          Soumis le : ${new Date(item.submittedAt).toLocaleString("fr-FR")}
        </p>
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

function logout() {
  localStorage.removeItem("noseum_token");
  localStorage.removeItem("noseum_user");
  window.location.href = "index.html";
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
    }
  });
}
