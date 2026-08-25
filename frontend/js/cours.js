// ========================================================
// NoSeumCode - Reusable Course Classroom Component (RBAC)
// ========================================================

const API_BASE = "http://localhost:8080";

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

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
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

  await loadInitialData();

  if (courseId) {
    await loadSingleCourse(courseId, requestedChapterId);
  } else {
    renderCourseCatalog();
  }
}

function getCourseImage(course) {
  if (course.imageUrl) return course.imageUrl;
  const title = ((course.title || "") + " " + (course.description || "")).toLowerCase();
  if (title.includes("html") || title.includes("css")) {
    return "images/courses/html.webp";
  }
  if (title.includes("javascript") || title.includes("js")) {
    return "images/courses/javascript.webp";
  }
  if (title.includes("git") || title.includes("github")) {
    return "images/courses/git.webp";
  }
  if (title.includes("java") || title.includes("spring")) {
    return "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop";
  }
  if (title.includes("architecture") || title.includes("ddd") || title.includes("clean")) {
    return "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop";
  }
  return "images/courses/html.webp";
}

async function loadInitialData() {
  // 1. Charger tous les cours
  const coursesRes = await coursApiFetch("/api/courses");
  if (coursesRes && coursesRes.ok) {
    allCourses = await coursesRes.json();
  } else {
    // Fallback seed courses complets
    allCourses = [
      {
        id: "html-css-starter-id",
        title: "HTML & CSS – Les Fondations du Web",
        description: "Apprends à structurer tes pages en HTML5 sémantique et à créer des designs modernes, responsives et accessibles avec CSS3, Flexbox et CSS Grid.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
        createdByName: "Admin CodeBangers",
        updatedByName: "Admin CodeBangers",
        imageUrl: "images/courses/html.webp",
        chaptersCount: 5
      },
      {
        id: "javascript-pro-starter-id",
        title: "JavaScript Moderne & DOM Interactif",
        description: "Donne vie à tes créations web : manipulation du DOM, requêtes API asynchrones, animations dynamiques et logique applicative complète.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 25).toISOString(),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
        createdByName: "Admin CodeBangers",
        updatedByName: "Admin CodeBangers",
        imageUrl: "images/courses/javascript.webp",
        chaptersCount: 6
      },
      {
        id: "git-github-starter-id",
        title: "Git & GitHub – L'Outil n°1 des Devs Pros",
        description: "Maîtrise le versioning de code, les branches de fonctionnalités, les Pull Requests collaboratives et crée un portfolio GitHub prêt pour l'embauche.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
        createdByName: "Admin CodeBangers",
        updatedByName: "Admin CodeBangers",
        imageUrl: "images/courses/git.webp",
        chaptersCount: 4
      },
      {
        id: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d",
        title: "Fullstack Java 21 & Spring Boot 3.4+",
        description: "Apprenez à concevoir des architectures backend robustes et performantes avec Java 21 (Virtual Threads, Records), Spring Boot 3, Spring Security, JWT RBAC et PostgreSQL.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        createdByName: "Admin CodeBangers",
        updatedByName: "Cédric Ragot (Enseignant)",
        imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop",
        chaptersCount: 4
      },
      {
        id: "b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e",
        title: "Clean Architecture & DDD en Pratique",
        description: "Maîtrisez le découplage métier absolu, l'architecture hexagonale (Ports & Adapters) et le Domain-Driven Design pour concevoir des applications modulaires, testables et scalables.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
        createdByName: "Cédric Ragot (Enseignant)",
        updatedByName: "Cédric Ragot (Enseignant)",
        imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop",
        chaptersCount: 3
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

  document.title = "Espace Formations - NoSeumCode";

  let roleHeaderTag = "";
  if (currentRole === "STUDENT") {
    roleHeaderTag = `<span class="course-badge-role">🎓 Mes Formations Inscrites</span>`;
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
          <h1 class="course-title" style="font-size: 2.8rem; margin: 0.5rem 0; color: var(--dark-navy);">Catalogue des Formations</h1>
          <p style="color: #64748b; font-size: 1.05rem; margin: 0;">Sélectionnez une formation pour accéder à votre espace de cours interactif.</p>
        </div>
        <div>
          ${roleHeaderTag}
          ${currentRole === "TEACHER" || currentRole === "ADMIN" ? `
            <button class="button button__primary bangers-regular" style="padding: 10px 20px; font-size: 1.1rem; margin-left: 0.75rem;" onclick="openCreateCourseModal()">
              + Créer une formation
            </button>
          ` : ""}
        </div>
      </div>

      <div class="card-grid">
        ${filteredCourses.map(course => {
          let enrollmentInfo = null;
          if (currentUser) {
            enrollmentInfo = userEnrollments.find(e => e.courseId === course.id);
          }

          let accessBadge = "";
          let actionBtn = "";
          const courseImg = getCourseImage(course);

          if (currentRole === "ADMIN" || currentRole === "TEACHER") {
            accessBadge = `<span style="background: rgba(0, 255, 135, 0.15); color: #00a85a; font-size: 0.75rem; font-weight: 700; padding: 4px 10px; border-radius: 999px; border: 1px solid rgba(0, 255, 135, 0.4);">✓ Accès Édition</span>`;
            actionBtn = `
              <a href="cours.html?id=${course.id}" class="card__link bangers-regular">
                Gérer le cours
                <svg class="card__chevron-darken" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </a>
            `;
          } else if (currentRole === "STUDENT") {
            if (!enrollmentInfo) {
              accessBadge = `<span style="background: #f1f5f9; color: #64748b; font-size: 0.75rem; font-weight: 700; padding: 4px 10px; border-radius: 999px; border: 1px solid #cbd5e1;">🔒 Non inscrit</span>`;
              actionBtn = `
                <button class="card__link bangers-regular" style="background:none; border:none; cursor:pointer; color: var(--dark-navy); width: 100%; text-align: left; padding: 0;" onclick="handleEnroll('${course.id}')">
                  S'inscrire à ce cours
                  <svg class="card__chevron-darken" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              `;
            } else {
              const isPaid = (enrollmentInfo.paymentStatus === "PAID" || enrollmentInfo.paymentStatus === "PAYÉ" || enrollmentInfo.paymentStatus === "FREE" || enrollmentInfo.paymentStatus === "GRATUIT");
              if (isPaid) {
                accessBadge = `<span style="background: rgba(0, 255, 135, 0.15); color: #00a85a; font-size: 0.75rem; font-weight: 700; padding: 4px 10px; border-radius: 999px; border: 1px solid rgba(0, 255, 135, 0.4);">✓ Inscrit • Payé</span>`;
                actionBtn = `
                  <a href="cours.html?id=${course.id}" class="card__link bangers-regular">
                    Continuer la formation
                    <svg class="card__chevron-darken" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </a>
                `;
              } else {
                accessBadge = `<span style="background: rgba(245, 158, 11, 0.15); color: #d97706; font-size: 0.75rem; font-weight: 700; padding: 4px 10px; border-radius: 999px; border: 1px solid rgba(245, 158, 11, 0.4);">⏳ Paiement en attente</span>`;
                actionBtn = `
                  <a href="cours.html?id=${course.id}" class="card__link bangers-regular" style="color:#d97706;">
                    Vérifier le statut
                    <svg class="card__chevron-darken" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </a>
                `;
              }
            }
          } else {
            // GUEST
            accessBadge = `<span style="background: #f1f5f9; color: #64748b; font-size: 0.75rem; font-weight: 700; padding: 4px 10px; border-radius: 999px; border: 1px solid #cbd5e1;">🔒 Connexion requise</span>`;
            actionBtn = `
              <a href="cours.html?id=${course.id}" class="card__link bangers-regular">
                Découvrir la formation
                <svg class="card__chevron-darken" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </a>
            `;
          }

          return `
            <article class="card card-white card-paddingtop">
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
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 0.25rem;">
                    <span class="section-tag" style="font-size: 0.75rem; margin-bottom: 0;">📚 FORMATION</span>
                    ${accessBadge}
                  </div>
                  <h3 class="card__title">${escapeHtml(course.title)}</h3>
                </div>
                <p class="card__paragraphe card__textGreen poppins-regular">
                  ${escapeHtml(course.description)}
                </p>
                <div style="display:flex; justify-content:space-between; align-items:center; font-size: 0.82rem; color: #64748b; margin-top: auto; padding-top: 0.75rem; border-top: 1px solid rgba(0,0,0,0.06);">
                  <span>👤 ${escapeHtml(course.createdByName || "Admin")}</span>
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
        <a href="cours.html" class="button button__primary bangers-regular" style="padding: 10px 24px; font-size: 1.1rem; text-decoration:none;">Retour au catalogue</a>
      </div>
    `;
    return;
  }

  // 3. Vérification des Droits d'Accès de l'Étudiant (Inscription & Statut de Paiement)
  if (currentRole === "STUDENT") {
    let enrollment = userEnrollments.find(e => e.courseId === currentCourse.id);

    // Détecter si le compte a un statut de paiement validé globalement ou par l'admin
    let storedPayment = currentUser.paymentStatus;
    try {
      const paymentMap = JSON.parse(localStorage.getItem("noseum_payments") || "{}");
      if (currentUser.id && paymentMap[currentUser.id]) storedPayment = paymentMap[currentUser.id];
      if (currentUser.email && paymentMap[currentUser.email]) storedPayment = paymentMap[currentUser.email];
    } catch (_) {}

    const isGlobalPaid = (storedPayment === "PAID" || storedPayment === "PAYÉ" || storedPayment === "FREE" || storedPayment === "GRATUIT");

    if (!enrollment && isGlobalPaid) {
      enrollment = {
        courseId: currentCourse.id,
        paymentStatus: "PAID",
        progress: 0
      };
      userEnrollments.push(enrollment);
    }
    
    // Si l'étudiant n'est pas inscrit à ce cours
    if (!enrollment) {
      renderAccessGate(
        "📚 Inscription Requise",
        `Vous êtes connecté mais vous n'êtes pas encore inscrit à la formation "<strong>${escapeHtml(currentCourse.title)}</strong>". Inscrivez-vous pour débloquer l'accès complet aux chapitres et exercices.`,
        "NOT_ENROLLED"
      );
      return;
    }

    // Si l'étudiant est inscrit mais que son paiement n'est pas validé (ex: PENDING, FAILED, REFUNDED)
    let pStatus = (enrollment.paymentStatus || "").toUpperCase();
    if (isGlobalPaid && (pStatus === "PENDING" || pStatus === "EN ATTENTE")) {
      pStatus = "PAID";
      enrollment.paymentStatus = "PAID";
    }

    const isPaid = (pStatus === "PAID" || pStatus === "PAYÉ" || pStatus === "FREE" || pStatus === "GRATUIT");

    if (!isPaid) {
      renderAccessGate(
        "⏳ Paiement en Attente de Validation",
        `Votre inscription à la formation "<strong>${escapeHtml(currentCourse.title)}</strong>" est bien enregistrée, mais votre paiement est actuellement avec le statut "<strong>${escapeHtml(pStatus || "EN ATTENTE")}</strong>". L'accès aux chapitres sera automatiquement débloqué dès confirmation Stripe ou validation manuelle par un administrateur.`,
        "PAYMENT_PENDING",
        pStatus
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
    if (currentCourse.id === "b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e") {
      courseChapters = [
        {
          id: "d1111111-1111-1111-1111-111111111111",
          title: "1. Fondamentaux du Domain-Driven Design (DDD)",
          position: 1,
          status: "APPROVED",
          createdByName: "Cédric Ragot (Enseignant)",
          updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9).toISOString(),
          content: `# 🧠 Fondamentaux du Domain-Driven Design (DDD)

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Le Domain-Driven Design replace le **Cœur Métier** au centre de toutes les décisions d'architecture logicielle.

### 🧩 Les briques tactiques fondamentales :
- **Entities** : Objets possédant une identité unique immuable.
- **Value Objects** : Objets immuables définis uniquement par leurs attributs (sans identifiant).
- **Aggregates & Root** : Frontières de consistance transactionnelle.

\`\`\`java
public record Money(BigDecimal amount, Currency currency) {
    public Money {
        if (amount.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Le montant ne peut être négatif");
        }
    }
}
\`\`\``
        },
        {
          id: "d2222222-2222-2222-2222-222222222222",
          title: "2. Architecture Hexagonale : Ports & Adaptateurs",
          position: 2,
          status: "PENDING_APPROVAL",
          createdByName: "Cédric Ragot (Enseignant)",
          updatedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
          content: `# 🔌 Architecture Hexagonale : Ports & Adaptateurs

*Note : Cette section a été modifiée par l'enseignant et est en cours de révision par un administrateur.*

L'architecture hexagonale garantit que le domaine métier ne dépend d'aucun framework (ni Spring, ni Hibernate, ni aucune base de données).

### 🔄 Les deux types de Ports :
1. **Inbound Ports (Drivers)** : Interfaces définissant les cas d'usage métiers (Use Cases).
2. **Outbound Ports (Driven)** : Interfaces requises par le domaine pour persister ou communiquer (ex: Repository interface).

\`\`\`java
// Port d'entrée (Use Case)
public interface RegisterUserUseCase {
    User execute(RegisterUserCommand command);
}

// Port de sortie (Port persistance)
public interface UserRepositoryPort {
    void save(User user);
    Optional<User> findById(UUID id);
}
\`\`\``
        },
        {
          id: "d3333333-3333-3333-3333-333333333333",
          title: "3. Transactional Outbox Pattern & EDA",
          position: 3,
          status: "APPROVED",
          createdByName: "Admin CodeBangers",
          updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
          content: `# ⚡ Transactional Outbox Pattern & EDA

Lorem ipsum dolor sit amet, consectetur adipiscing elit. L'Outbox Pattern résout le problème de la double écriture entre la base SQL et le broker de messages (Kafka, RabbitMQ).

### 📦 Fonctionnement :
- Les événements de domaine sont enregistrés dans une table SQL \`outbox_events\` au sein de la **même transaction** que les entités.
- Un poller ou un connecteur CDC (Change Data Capture / Debezium) publie ensuite les messages de manière asynchrone et garantie.

\`\`\`java
@Transactional
public void completeOrder(UUID orderId) {
    Order order = orderRepository.findById(orderId).orElseThrow();
    order.complete();
    orderRepository.save(order);
    
    outboxRepository.save(new OutboxMessage("OrderCompleted", order.getId()));
}
\`\`\``
        }
      ];
    } else {
      courseChapters = [
        {
          id: "c1111111-1111-1111-1111-111111111111",
          title: "1. Introduction & Écosystème Java 21 LTS",
          position: 1,
          status: "APPROVED",
          createdByName: "Admin CodeBangers",
          updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
          content: `# 🚀 Bienvenue dans Java 21 LTS

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Java 21 apporte des fonctionnalités majeures dont les **Virtual Threads (Project Loom)**, les **Record Patterns** et les **Sequenced Collections**.

### 🌟 Les points clés du module :
- **Virtual Threads** : Concurrence à haut débit sans surcharge de threads système.
- **Pattern Matching** : Simplification des switch et instanceof.
- **Record classes** : Immutabilité élégante pour vos DTO et Value Objects.

\`\`\`java
public record UserDto(UUID id, String email, Role role) {}

public void processUser(Object obj) {
    if (obj instanceof UserDto(var id, var email, var role)) {
        System.out.println("Utilisateur authentifié : " + email + " avec rôle : " + role);
    }
}
\`\`\``
        },
        {
          id: "c2222222-2222-2222-2222-222222222222",
          title: "2. Architecture en Couches & Persistance JPA",
          position: 2,
          status: "APPROVED",
          createdByName: "Cédric Ragot (Enseignant)",
          updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
          content: `# 🏛️ Architecture en Couches & Persistance JPA

Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

### 📐 Structuration recommandée :
1. **Controller Layer** : Exposition REST, validation des requêtes (\`@Valid\`).
2. **Service Layer** : Logique métier pure, gestion transactionnelle (\`@Transactional\`).
3. **Repository Layer** : Interfaces Spring Data JPA pour les opérations en base PostgreSQL.`
        },
        {
          id: "c3333333-3333-3333-3333-333333333333",
          title: "3. Sécurité Avancée, JWT & RBAC Zero Trust",
          position: 3,
          status: "APPROVED",
          createdByName: "Admin CodeBangers",
          updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
          content: `# 🛡️ Sécurité Avancée : JWT, RBAC & OWASP

Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. La sécurité repose sur le principe **Never Trust the Client**.`
        },
        {
          id: "c4444444-4444-4444-4444-444444444444",
          title: "4. Intégration OAuth2 Social Login",
          position: 4,
          status: "PENDING_APPROVAL",
          createdByName: "Cédric Ragot (Enseignant)",
          updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          content: `# 🌐 Intégration OAuth2 Social Login

*Note : Cette section a été modifiée par l'enseignant et est en cours de révision par l'administrateur.*`
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
    actionButtons = `
      <div style="display:flex; justify-content:center; gap: 1rem; flex-wrap:wrap;">
        <button class="button button__primary bangers-regular" style="padding: 12px 28px; font-size: 1.2rem; cursor:pointer;" onclick="handleEnroll('${currentCourse ? currentCourse.id : ''}')">
          ✨ S'inscrire à cette formation
        </button>
        <a href="cours.html" class="button button__secondary" style="padding: 12px 20px; text-decoration:none; display:inline-flex; align-items:center;">
          Voir tout le catalogue
        </a>
      </div>
    `;
  } else if (type === "PAYMENT_PENDING") {
    icon = "⏳";
    cardClass += " pending";
    actionButtons = `
      <div style="display:flex; justify-content:center; gap: 1rem; flex-wrap:wrap;">
        <button class="button button__primary bangers-regular" style="padding: 12px 28px; font-size: 1.15rem; cursor:pointer;" onclick="location.reload()">
          🔄 Vérifier mon statut de paiement
        </button>
        <a href="cours.html" class="button button__secondary" style="padding: 12px 20px; text-decoration:none; display:inline-flex; align-items:center;">
          Retour aux formations
        </a>
      </div>
    `;
  }

  contentArea.innerHTML = `
    <div class="catalog-container">
      <a href="cours.html" class="back-link bangers-regular">
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

  if (currentRole === "TEACHER") {
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
        <a href="cours.html" class="back-link bangers-regular" style="margin-bottom: 0;">
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
          ${courseChapters.map((chap) => {
            const isActive = chap.id === activeChapterId;
            const isPending = chap.status === "PENDING_APPROVAL";
            let statusIcon = "✓";
            let statusLabel = "";

            if (isPending) {
              statusIcon = "⏳";
              statusLabel = `<span style="font-size: 0.72rem; color: #fbbf24; font-weight: 700; background: rgba(245, 158, 11, 0.2); padding: 2px 6px; border-radius: 4px;">À valider</span>`;
            }

            return `
              <a class="chapter-nav-item ${isActive ? "active" : ""} ${isPending ? "pending" : ""}" onclick="switchActiveChapter('${chap.id}')">
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
  document.getElementById("modal-chapter-title").value = "";
  document.getElementById("modal-chapter-content").value = "# Titre de la section\n\nLorem ipsum dolor sit amet...\n\n```java\n// Code d'exemple\n```";

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
    window.location.href = `cours.html?id=${newCourse.id}`;
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
      body: JSON.stringify({ title, position: chap ? chap.position : 1 })
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

    await coursApiFetch(`/api/chapters/course/${courseId}`, {
      method: "POST",
      body: JSON.stringify({ title, position: newChap.position })
    });

    closeChapterModal();
    alert("🎉 Nouvelle section créée !");
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
  window.location.href = "cours.html";
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

  await coursApiFetch("/api/enrollments", {
    method: "POST",
    body: JSON.stringify({ courseId })
  });

  userEnrollments.push({
    courseId,
    paymentStatus: (currentUser.paymentStatus && currentUser.paymentStatus.toUpperCase().includes("PAID")) ? "PAID" : "PENDING",
    progress: 0
  });

  alert("🎉 Inscription confirmée !");
  window.location.href = `cours.html?id=${courseId}`;
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
