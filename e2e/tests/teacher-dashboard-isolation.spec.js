const { test, expect } = require('@playwright/test');

test.describe('Isolation du Dashboard Enseignant et Interface Admin d\'Assignation (Sprint 28)', () => {

  const teacherUser = {
    id: 'teacher-alice-uuid',
    userName: 'alice_prof',
    firstName: 'Alice',
    lastName: 'Dupont',
    email: 'alice@noseumcode.com',
    role: 'TEACHER'
  };

  const adminUser = {
    id: 'admin-cedric-uuid',
    userName: 'cedric_admin',
    firstName: 'Cédric',
    lastName: 'Admin',
    email: 'admin@noseumcode.com',
    role: 'ADMIN'
  };

  async function setupAuth(page, user) {
    await page.addInitScript((userData) => {
      localStorage.setItem('noseum_token', 'mock-jwt-token-sprint28');
      localStorage.setItem('noseum_user', JSON.stringify(userData));
    }, user);
  }

  async function setupCommonRoutes(page, currentUser) {
    await page.route('**/api/auth/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(currentUser)
      });
    });

    await page.route('**/api/notifications', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([])
      });
    });

    await page.route('**/api/discord/status', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ linked: false })
      });
    });
  }

  // =========================================================================
  // Test 1 - Vue Enseignant Filtrée & État Vide Bienveillant
  // =========================================================================
  test('Test 1 - Vue Enseignant Filtrée : le sélecteur ne propose que le cours assigné', async ({ page }) => {
    await setupAuth(page, teacherUser);
    await setupCommonRoutes(page, teacherUser);

    const singleAssignedCourse = {
      id: 'course-clean-arch-101',
      title: 'Clean Architecture & Spring Boot 3',
      description: 'Formation avancée',
      assignedTeachers: [{ id: 'teacher-alice-uuid', firstName: 'Alice', email: 'alice@noseumcode.com' }]
    };

    // Route spécifique : l'enseignant n'a qu'un seul cours assigné
    await page.route('**/api/courses/my-assigned-courses', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([singleAssignedCourse])
      });
    });

    await page.route('**/api/chapters/course/course-clean-arch-101/all', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 'chap-hexagonal-01',
            courseId: 'course-clean-arch-101',
            courseTitle: 'Clean Architecture & Spring Boot 3',
            title: 'Ports & Adapters en Java',
            position: 1,
            status: 'APPROVED'
          }
        ])
      });
    });

    await page.goto('/dashboard.html');

    // Vérifier l'affichage de l'espace formateur
    const teacherView = page.locator('#view-teacher');
    await expect(teacherView).toBeVisible();

    const heroTitle = page.locator('#dash-hero-title');
    await expect(heroTitle).toContainText('ESPACE CRÉATION & FORMATEUR');

    // Vérifier la présence du chapitre du cours assigné
    const chapterCard = page.locator('#teacher-sections-list');
    await expect(chapterCard).toContainText('Ports & Adapters en Java');

    // Ouvrir la modale d'ajout de section
    const btnAddChapter = page.locator('button:has-text("Ajouter une nouvelle section")');
    await expect(btnAddChapter).toBeVisible();
    await btnAddChapter.click();

    const modal = page.locator('#add-chapter-modal');
    await expect(modal).toBeVisible();

    // Vérifier que le sélecteur ne contient QUE le cours assigné
    const courseSelect = page.locator('#chapter-course-select');
    await expect(courseSelect).toBeVisible();

    const options = courseSelect.locator('option');
    await expect(options).toHaveCount(1);
    await expect(options.first()).toHaveAttribute('value', 'course-clean-arch-101');
    await expect(options.first()).toContainText('Clean Architecture & Spring Boot 3');

    // Vérifier qu'aucun cours tiers non assigné n'apparaît
    await expect(courseSelect).not.toContainText('HTML & CSS');
    await expect(courseSelect).not.toContainText('JavaScript Fondamentaux');
  });

  test('Test 1bis - État vide formateur : message bienveillant si aucun cours attribué', async ({ page }) => {
    await setupAuth(page, teacherUser);
    await setupCommonRoutes(page, teacherUser);

    // Formateur avec 0 cours attribué
    await page.route('**/api/courses/my-assigned-courses', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([])
      });
    });

    await page.goto('/dashboard.html');

    const teacherView = page.locator('#view-teacher');
    await expect(teacherView).toBeVisible();

    // Vérifier l'état vide bienveillant
    const emptyState = page.locator('.teacher-empty-state');
    await expect(emptyState).toBeVisible();
    await expect(emptyState).toContainText('Aucun cours ne vous a encore été attribué. Contactez l\'administrateur.');

    // Tenter de cliquer sur Ajouter une nouvelle section -> Bloqué avec toast d'erreur
    const btnAddChapter = page.locator('button:has-text("Ajouter une nouvelle section")');
    await btnAddChapter.click();

    // La modale reste masquée
    const modal = page.locator('#add-chapter-modal');
    await expect(modal).not.toBeVisible();

    // Annonce d'accessibilité et notification toast
    const announcer = page.locator('#a11y-status-announcer');
    await expect(announcer).toContainText('aucun cours ne vous a été attribué');
  });

  // =========================================================================
  // Test 2 - Blocage sur Cours Tiers (Manipulation client & Rejet API 403)
  // =========================================================================
  test('Test 2 - Blocage sur Cours Tiers : rejet côté client en cas de manipulation du sélecteur', async ({ page }) => {
    await setupAuth(page, teacherUser);
    await setupCommonRoutes(page, teacherUser);

    await page.route('**/api/courses/my-assigned-courses', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 'course-clean-arch-101',
            title: 'Clean Architecture & Spring Boot 3',
            assignedTeachers: [{ id: 'teacher-alice-uuid', firstName: 'Alice' }]
          }
        ])
      });
    });

    await page.route('**/api/chapters/course/**/all', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
    });

    await page.goto('/dashboard.html');

    const btnAddChapter = page.locator('button:has-text("Ajouter une nouvelle section")');
    await btnAddChapter.click();

    // Simulation d'une altération DOM côté client (injection d'un cours non assigné)
    await page.evaluate(() => {
      const select = document.getElementById('chapter-course-select');
      const unauthorizedOption = document.createElement('option');
      unauthorizedOption.value = 'course-forbidden-999';
      unauthorizedOption.text = 'Cours Non Assigné Hack';
      select.appendChild(unauthorizedOption);
      select.value = 'course-forbidden-999';

      document.getElementById('chapter-title-input').value = 'Tentative de section pirate';
      document.getElementById('chapter-content-input').value = 'Contenu non autorisé';

      // Déclencher la soumission
      const form = document.getElementById('add-chapter-form');
      form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    });

    // Vérifier l'interception et le toast d'interdiction
    const announcer = page.locator('#a11y-status-announcer');
    await expect(announcer).toContainText('Action non autorisée : vous n\'enseignez pas ce cours.');

    const toast = page.locator('#dash-floating-toast');
    await expect(toast).toContainText('Action non autorisée : vous n\'enseignez pas ce cours.');
  });

  test('Test 2bis - Blocage sur Cours Tiers : gestion de l\'erreur 403 renvoyée par le backend', async ({ page }) => {
    await setupAuth(page, teacherUser);
    await setupCommonRoutes(page, teacherUser);

    await page.route('**/api/courses/my-assigned-courses', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 'course-clean-arch-101',
            title: 'Clean Architecture & Spring Boot 3',
            assignedTeachers: [{ id: 'teacher-alice-uuid', firstName: 'Alice' }]
          }
        ])
      });
    });

    await page.route('**/api/chapters/course/**/all', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
    });

    // Le backend rejette avec 403 Forbidden
    await page.route('**/api/chapters/course/course-clean-arch-101', async (route) => {
      await route.fulfill({
        status: 403,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Action non autorisée : vous n\'enseignez pas ce cours.' })
      });
    });

    await page.goto('/dashboard.html');

    const btnAddChapter = page.locator('button:has-text("Ajouter une nouvelle section")');
    await btnAddChapter.click();

    await page.locator('#chapter-title-input').fill('Nouveau chapitre rejeté par le serveur');
    await page.locator('#chapter-content-input').fill('Contenu de test');

    const btnSubmit = page.locator('#add-chapter-modal button[type="submit"]');
    await btnSubmit.click();

    // Vérifier la notification d'erreur 403
    const announcer = page.locator('#a11y-status-announcer');
    await expect(announcer).toContainText('Action non autorisée : vous n\'enseignez pas ce cours.');
  });

  // =========================================================================
  // Test 3 - Parcours Admin d'Assignation & Retrait de Formateur
  // =========================================================================
  test('Test 3 - Parcours Admin : assignation et retrait de formateur avec feedback vocal', async ({ page }) => {
    await setupAuth(page, adminUser);
    await setupCommonRoutes(page, adminUser);

    const initialCourse = {
      id: 'course-devops-501',
      title: 'DevOps & CI/CD Pipeline Expert',
      createdByName: 'Admin Cédric',
      updatedByName: 'Admin Cédric',
      assignedTeachers: []
    };

    const teacherToAssign = {
      id: 'teacher-bob-uuid',
      userName: 'bob_devops',
      firstName: 'Bob',
      lastName: 'DevOps',
      email: 'bob@codebangers.fr',
      role: 'TEACHER'
    };

    await page.route('**/api/courses/all', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([initialCourse])
      });
    });

    await page.route('**/api/users?role=TEACHER', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([teacherToAssign])
      });
    });

    await page.route('**/api/users', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: adminUser.id, role: 'ADMIN', userName: 'cedric_admin' },
          teacherToAssign
        ])
      });
    });

    await page.route('**/api/chapters/pending-approval', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
    });

    // Interception de l'assignation POST
    await page.route('**/api/courses/course-devops-501/teachers/teacher-bob-uuid', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            ...initialCourse,
            assignedTeachers: [teacherToAssign]
          })
        });
      } else if (route.request().method() === 'DELETE') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            ...initialCourse,
            assignedTeachers: []
          })
        });
      } else {
        await route.continue();
      }
    });

    await page.goto('/dashboard.html');

    // Vérifier l'accès à la vue Admin
    const adminView = page.locator('#view-admin');
    await expect(adminView).toBeVisible();

    // Naviguer vers la gestion des formations (onglet "Formations actives")
    const statCoursesCard = page.locator('#stat-card-courses');
    await expect(statCoursesCard).toBeVisible();
    await statCoursesCard.click();

    const coursesTab = page.locator('#admin-tab-courses');
    await expect(coursesTab).toBeVisible();

    // Vérifier le tableau des cours avec état initial sans formateur
    const coursesTable = page.locator('#admin-courses-table');
    await expect(coursesTable).toContainText('DevOps & CI/CD Pipeline Expert');
    await expect(coursesTable).toContainText('Aucun formateur assigné');

    // 1. Bouton d'ouverture du popover d'affectation
    const btnOpenAssign = page.locator('#btn-assign-teacher-course-devops-501');
    await expect(btnOpenAssign).toBeVisible();
    await expect(btnOpenAssign).toHaveAttribute('aria-expanded', 'false');

    await btnOpenAssign.click();
    await expect(btnOpenAssign).toHaveAttribute('aria-expanded', 'true');

    // 2. Vérifier la présence du popover accessible et son libellé explicite
    const popover = page.locator('#assign-teacher-form-course-devops-501');
    await expect(popover).toBeVisible();

    const label = popover.locator('#assign-label-course-devops-501');
    await expect(label).toBeVisible();
    await expect(label).toContainText('Assigner un formateur au cours DevOps & CI/CD Pipeline Expert');

    // 3. Tester la navigation clavier : la touche Échap doit refermer le popover
    await page.keyboard.press('Escape');
    await expect(popover).not.toBeVisible();
    await expect(btnOpenAssign).toHaveAttribute('aria-expanded', 'false');

    // Ré-ouvrir le popover pour procéder à l'assignation
    await btnOpenAssign.click();
    await expect(popover).toBeVisible();

    // 4. Sélectionner Bob DevOps dans la liste déroulante
    const teacherSelect = popover.locator('#assign-teacher-select-course-devops-501');
    await teacherSelect.selectOption('teacher-bob-uuid');

    // 5. Valider l'affectation
    const btnSubmitAssign = popover.locator('button[type="submit"]');
    await btnSubmitAssign.click();

    // Popover fermé et retour d'information
    await expect(popover).not.toBeVisible();

    const announcer = page.locator('#a11y-status-announcer');
    await expect(announcer).toContainText('Formateur assigné avec succès au cours.');

    // 6. Vérifier la présence immédiate du badge formateur dans la ligne de cours
    const badgesContainer = page.locator('#teacher-badges-course-devops-501');
    await expect(badgesContainer).toBeVisible();
    await expect(badgesContainer).toContainText('Bob DevOps');

    const badge = badgesContainer.locator('.teacher-badge[data-teacher-id="teacher-bob-uuid"]');
    await expect(badge).toBeVisible();

    // Bouton de retrait avec aria-label descriptif
    const btnRemove = badge.locator('.teacher-badge-remove-btn');
    await expect(btnRemove).toBeVisible();
    await expect(btnRemove).toHaveAttribute('aria-label', /Retirer Bob DevOps du cours DevOps & CI\/CD Pipeline Expert/);

    // 7. Retrait du formateur avec confirmation de dialogue
    page.on('dialog', async (dialog) => {
      expect(dialog.message()).toContain('Êtes-vous sûr de vouloir retirer Bob DevOps');
      await dialog.accept();
    });

    await btnRemove.click();

    // Vérifier que le badge disparaît et le texte d'état vide réapparaît
    await expect(badge).not.toBeVisible();
    await expect(badgesContainer).toContainText('Aucun formateur assigné');

    // Vérifier le message vocal poli de confirmation du retrait
    await expect(announcer).toContainText('retiré du cours avec succès');
  });

  // =========================================================================
  // Test 4 - Vue Enseignant : Mes Cours Actifs & Tableau des Chapitres avec Détails
  // =========================================================================
  test('Test 4 - Vue Enseignant : Affichage des cours actifs et tableau des chapitres avec détails déroulants', async ({ page }) => {
    await setupAuth(page, teacherUser);
    await setupCommonRoutes(page, teacherUser);

    const assignedCourse = {
      id: 'course-clean-arch-101',
      title: 'Clean Architecture & Spring Boot 3',
      description: 'Formation avancée Spring Boot',
      chaptersCount: 12,
      assignedTeachers: [{ id: 'teacher-alice-uuid', firstName: 'Alice', email: 'alice@noseumcode.com' }]
    };

    const enrolledCourse = {
      courseId: 'course-enrolled-202',
      courseTitle: 'TypeScript & React Avancé',
      courseDescription: 'Maîtrise du frontend moderne',
      progress: 60,
      tier: 'STARTER'
    };

    await page.route('**/api/courses/my-assigned-courses', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([assignedCourse])
      });
    });

    await page.route('**/api/enrollments/my-courses', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([enrolledCourse])
      });
    });

    await page.route('**/api/chapters/course/course-clean-arch-101/all', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 'chap-clean-01',
            courseId: 'course-clean-arch-101',
            courseTitle: 'Clean Architecture & Spring Boot 3',
            title: 'Ports & Adapters en Java',
            position: 1,
            status: 'APPROVED',
            content: 'Contenu pédagogique complet sur l\'inversion de dépendances',
            submittedAt: '2026-10-10T14:30:00Z'
          }
        ])
      });
    });

    await page.goto('/dashboard.html');

    // 1. Vérifier la section "Mes cours enseignés"
    await expect(page.locator('#view-teacher')).toContainText('Mes cours enseignés');
    const activeCoursesSection = page.locator('#teacher-courses-grid');
    await expect(activeCoursesSection).toBeVisible();

    // Vérifier les deux cartes de formation
    await expect(activeCoursesSection).toContainText('Clean Architecture & Spring Boot 3');
    await expect(activeCoursesSection).toContainText('FORMATEUR RÉFÉRENT');
    await expect(activeCoursesSection).toContainText('TypeScript & React Avancé');
    await expect(activeCoursesSection).toContainText('EN COURS');
    await expect(activeCoursesSection).toContainText('60% complété');

    // 2. Vérifier la structure du tableau des sections de cours
    const table = page.locator('#teacher-chapters-table');
    await expect(table).toBeVisible();

    const row = page.locator('#chapter-row-chap-clean-01');
    await expect(row).toBeVisible();
    await expect(row).toContainText('Clean Architecture & Spring Boot 3');
    await expect(row).toContainText('Ports & Adapters en Java');
    await expect(row).toContainText('#1');
    await expect(row).toContainText('Validé & En ligne');

    // 3. Tester le dropdown / ligne déroulante de détails
    const detailRow = page.locator('#chapter-detail-row-chap-clean-01');
    await expect(detailRow).toBeHidden();

    const btnDetail = page.locator('#btn-chapter-detail-chap-clean-01');
    await expect(btnDetail).toHaveAttribute('aria-expanded', 'false');

    // Clic pour dérouler
    await btnDetail.click();
    await expect(detailRow).toBeVisible();
    await expect(btnDetail).toHaveAttribute('aria-expanded', 'true');
    await expect(detailRow).toContainText('Contenu pédagogique complet sur l\'inversion de dépendances');

    // Clic pour refermer
    await btnDetail.click();
    await expect(detailRow).toBeHidden();
    await expect(btnDetail).toHaveAttribute('aria-expanded', 'false');
  });

  // =========================================================================
  // Test 5 - Découplage Vue Enseignant Réel vs Vue Formateur Admin
  // =========================================================================
  test('Test 5 - Découplage : l\'enseignant réel voit ses cours assignés, l\'admin en vue formateur voit tout le catalogue', async ({ page }) => {
    await setupAuth(page, adminUser);
    await setupCommonRoutes(page, adminUser);

    let calledMyAssigned = false;
    let calledAllCourses = false;

    const catalogCourses = [
      { id: 'course-cat-1', title: 'HTML & CSS Fondations', description: 'Bases du web', chaptersCount: 5 },
      { id: 'course-cat-2', title: 'JavaScript Moderne', description: 'ES6+ et DOM', chaptersCount: 8 }
    ];

    await page.route('**/api/courses/my-assigned-courses', async (route) => {
      calledMyAssigned = true;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([])
      });
    });

    await page.route('**/api/courses', async (route) => {
      calledAllCourses = true;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(catalogCourses)
      });
    });

    await page.route('**/api/chapters/pending', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
    });
    await page.route('**/api/enrollments/stats', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ totalEnrollments: 0 }) });
    });
    await page.route('**/api/courses/*/teachers', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
    });
    await page.route('**/api/users/teachers', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
    });
    await page.route('**/api/enrollments/my-courses', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
    });

    await page.goto('/dashboard.html');

    // Admin clique sur la "Vue Formateur"
    const btnTeacherView = page.locator('#btn-view-teacher');
    await expect(btnTeacherView).toBeVisible();
    await btnTeacherView.click();

    // Vérifier que c'est bien /api/courses qui a été sollicité pour l'admin
    expect(calledAllCourses).toBe(true);
    expect(calledMyAssigned).toBe(false);

    // Vérifier que la section "Mes cours enseignés" affiche bien les cours du catalogue
    const teacherCoursesGrid = page.locator('#teacher-courses-grid');
    await expect(teacherCoursesGrid).toBeVisible();
    await expect(teacherCoursesGrid).toContainText('HTML & CSS Fondations');
    await expect(teacherCoursesGrid).toContainText('JavaScript Moderne');
  });

});
