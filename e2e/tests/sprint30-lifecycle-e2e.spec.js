const { test, expect } = require('@playwright/test');

/**
 * Sprint 30 — Suite E2E Réelle & Dé-mockée (ADR-024)
 * 
 * Règle de Gouvernance QA (ADR-024) :
 * INTERDICTION formelle d'utiliser page.route() pour intercepter les APIs métier
 * (/api/auth/*, /api/courses/*, /api/chapters/*).
 * 
 * Ce test traverse la véritable API Spring Boot et la base de données PostgreSQL réelle
 * pour valider le cycle de vie complet multi-rôles :
 * - Étape 1 : Administrateur (Assignation d'un formateur référent)
 * - Étape 2 : Formateur (Cloisonnement, consultation du badge référent et rejet 403 sur cours tiers)
 * - Étape 3 : Apprenant (Accès Discord Scène Live et Salons Vocaux Manga permanents)
 */

test.describe('Sprint 30 — Cycle de Vie Complet E2E Dé-mocké (ADR-024)', () => {

  const apiUrl = process.env.API_BASE_URL || 'http://localhost:8080';
  const adminEmail = process.env.TEST_ADMIN_EMAIL || 'admin@codebangers.fr';
  const adminPassword = process.env.TEST_ADMIN_PASSWORD || 'secret123';
  const teacherEmail = process.env.TEST_TEACHER_EMAIL || 'teacher@codebangers.fr';
  const teacherPassword = process.env.TEST_TEACHER_PASSWORD || 'secret123';
  const studentEmail = process.env.TEST_STUDENT_EMAIL || 'student@codebangers.fr';
  const studentPassword = process.env.TEST_STUDENT_PASSWORD || 'secret123';

  // Helper pour se connecter via l'interface utilisateur réelle
  async function loginViaUI(page, email, password) {
    await page.goto('/index.html');
    const headerAuthBtn = page.locator('#header-auth-btn');
    if (await headerAuthBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await headerAuthBtn.click();
    } else {
      await page.evaluate(() => {
        if (typeof window.openGlobalAuthModal === 'function') {
          window.openGlobalAuthModal('login', true);
        }
      });
    }

    const emailInput = page.locator('#global-login-email');
    const passwordInput = page.locator('#global-login-password');
    const submitBtn = page.locator('#global-login-submit-btn');

    await expect(emailInput).toBeVisible({ timeout: 10000 });
    await emailInput.fill(email);
    await passwordInput.fill(password);
    await submitBtn.click();

    await page.waitForURL('**/dashboard.html*', { timeout: 15000 });
  }

  // Pré-requis : Vérifier que le serveur backend réel répond
  test.beforeAll(async ({ request }) => {
    const health = await request.get(`${apiUrl}/actuator/health`).catch(() => null);
    expect(health, `Le serveur backend réel sur ${apiUrl} doit être actif (actuator/health)`).not.toBeNull();
    expect(health.status()).toBe(200);
  });

  // Injection de la cible d'API locale (sans mock réseau)
  test.beforeEach(async ({ page }) => {
    await page.addInitScript((targetUrl) => {
      localStorage.setItem('noseum_api_url', targetUrl);
      localStorage.setItem('noseum_api_target', 'local');
    }, apiUrl);
  });

  test('Cycle de vie complet multi-rôles : Admin -> Formateur -> Apprenant (Zero Mock)', async ({ page }) => {
    // Collecter les erreurs de la console pour vérifier l'absence d'erreurs JS
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        const text = msg.text();
        // Ignore deliberate 403 security test and non-critical assets
        if (
          !text.includes('favicon.ico') &&
          !text.includes('ERR_CONNECTION_REFUSED') &&
          !text.includes('status of 403')
        ) {
          consoleErrors.push(text);
        }
      }
    });

    // Gérer automatiquement les dialogues de confirmation (e.g. suppression formateur)
    page.on('dialog', async dialog => {
      await dialog.accept();
    });

    // =========================================================================
    // ÉTAPE 1 : Administrateur — Connexion & Assignation d'un formateur référent
    // =========================================================================
    await loginViaUI(page, adminEmail, adminPassword);

    // Vérifier l'affichage de la console Admin
    const adminView = page.locator('#view-admin');
    await expect(adminView).toBeVisible({ timeout: 10000 });

    // Accès à la section "Gestion des formations actives"
    const statCoursesCard = page.locator('#stat-card-courses');
    await expect(statCoursesCard).toBeVisible();
    await statCoursesCard.click();

    const adminCoursesTab = page.locator('#admin-tab-courses');
    await expect(adminCoursesTab).toBeVisible();

    // Attente du chargement de la table des cours depuis l'API réelle
    const coursesTableBody = page.locator('#admin-courses-table-body');
    await expect(coursesTableBody.locator('tr').first()).toBeVisible({ timeout: 10000 });

    // Sélectionner la première ligne de cours
    const firstCourseRow = coursesTableBody.locator('tr').first();
    const btnOpenAssign = firstCourseRow.locator('.btn-open-assign-teacher');
    await expect(btnOpenAssign).toBeVisible();

    // Si le formateur est déjà assigné sur cette ligne, le retirer d'abord pour tester l'assignation
    const existingBadge = firstCourseRow.locator(`.teacher-badge[data-teacher-id="22222222-2222-2222-2222-222222222222"]`);
    if (await existingBadge.count() > 0) {
      const removeBtn = existingBadge.locator('.teacher-badge-remove-btn');
      await removeBtn.click();
      await page.waitForTimeout(500);
    }

    // Ouvrir la popover d'assignation
    await btnOpenAssign.click();
    await expect(btnOpenAssign).toHaveAttribute('aria-expanded', 'true');

    // Vérifier l'apparition de la popover
    const assignPopover = firstCourseRow.locator('.assign-teacher-popover');
    await expect(assignPopover).toBeVisible();

    // Sélectionner le formateur cible et valider l'affectation
    const selectTeacher = assignPopover.locator('select');
    await expect(selectTeacher).toBeVisible();
    // Sélection par valeur (ID du formateur) ou index
    await selectTeacher.selectOption('22222222-2222-2222-2222-222222222222');

    const btnSubmitAssign = assignPopover.locator('button[type="submit"]');
    await btnSubmitAssign.click();

    // Assertion : Toast et badge immédiatement visible dans la ligne
    const floatingToast = page.locator('#dash-floating-toast');
    await expect(floatingToast).toContainText(/assigné avec succès/i, { timeout: 10000 });

    // Vérifier l'annonce vocale ARIA
    const announcer = page.locator('#a11y-status-announcer');
    await expect(announcer).toContainText(/assigné avec succès/i);

    // Assertion : Le badge formateur est affiché dans la ligne
    const teacherBadge = firstCourseRow.locator('.teacher-badge');
    await expect(teacherBadge.first()).toBeVisible();

    // =========================================================================
    // ÉTAPE 2 : Formateur — Déconnexion, Reconnexion & Cloisonnement RBAC
    // =========================================================================
    // Déconnexion complète via le bouton UI officiel
    const btnLogout = page.locator('#dash-btn-logout, .dash-header-logout, [onclick*="globalLogout"]').first();
    await expect(btnLogout).toBeVisible();
    await btnLogout.click();

    // Assertion : Tokens purgés du localStorage
    await page.waitForTimeout(500);
    const tokenAfterLogout = await page.evaluate(() => localStorage.getItem('noseum_token'));
    const userAfterLogout = await page.evaluate(() => localStorage.getItem('noseum_user'));
    expect(tokenAfterLogout).toBeNull();
    expect(userAfterLogout).toBeNull();

    // Connexion immédiate en tant qu'enseignant
    await loginViaUI(page, teacherEmail, teacherPassword);

    // Vérifier que la vue active affichée est l'espace Enseignant
    const teacherView = page.locator('#view-teacher');
    await expect(teacherView).toBeVisible({ timeout: 10000 });

    // Vérifier que #teacher-courses-grid contient la carte du cours assigné avec le badge FORMATEUR RÉFÉRENT
    const teacherCoursesGrid = page.locator('#teacher-courses-grid');
    await expect(teacherCoursesGrid).toBeVisible();
    await expect(teacherCoursesGrid).toContainText('FORMATEUR RÉFÉRENT', { timeout: 10000 });

    // Vérifier les boutons d'action du cours
    const courseCard = teacherCoursesGrid.locator('.card').first();
    await expect(courseCard.locator('a:has-text("Accéder au cours")')).toBeVisible();
    await expect(courseCard.locator('button:has-text("Programme")')).toBeVisible();
    await expect(courseCard.locator('button:has-text("Scène Live")')).toBeVisible();

    // Test de sécurité ABAC/RBAC : tentative d'édition illégitime sur un cours non attribué
    const illicitAttemptStatus = await page.evaluate(async (apiUrl) => {
      const token = localStorage.getItem('noseum_token');
      const res = await fetch(`${apiUrl}/api/chapters/course/00000000-0000-0000-0000-000000000099`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title: 'Tentative Piratage', position: 99 })
      });
      return res.status;
    }, apiUrl);

    // Le backend doit rejeter avec HTTP 403 Forbidden
    expect(illicitAttemptStatus).toBe(403);

    // =========================================================================
    // ÉTAPE 3 : Apprenant — Espaces Discord Scène & Salons Vocaux Manga
    // =========================================================================
    // Déconnexion de l'enseignant
    await btnLogout.click();
    await page.waitForTimeout(500);

    // Connexion en tant qu'apprenant inscrit
    await loginViaUI(page, studentEmail, studentPassword);

    // Vérifier l'affichage de l'espace Apprenant
    const studentView = page.locator('#view-student');
    await expect(studentView).toBeVisible({ timeout: 10000 });

    // Bouton de direct Scène Live Discord présent
    const btnStudentStage = page.locator('#btn-student-join-stage');
    await expect(btnStudentStage).toBeVisible();

    // Vérifier la présence des 3 salons vocaux Manga permanents dans l'espace Apprenant
    const luffyRoom = studentView.locator('text=luffy-code-lab');
    const gokuRoom = studentView.locator('text=goku-dojo-live');
    const narutoRoom = studentView.locator('text=naruto-team-hub');

    await expect(luffyRoom).toBeVisible({ timeout: 10000 });
    await expect(gokuRoom).toBeVisible();
    await expect(narutoRoom).toBeVisible();

    // Vérifier qu'aucune fuite de token n'est exposée dans le DOM
    const bodyText = await page.locator('body').innerText();
    const currentToken = await page.evaluate(() => localStorage.getItem('noseum_token'));
    if (currentToken && currentToken.length > 20) {
      expect(bodyText).not.toContain(currentToken);
    }

    // Vérifier l'absence d'erreurs console critiques
    expect(consoleErrors).toEqual([]);
  });

  test('Accessibilité Clavier (WCAG 2.2 AA) : Ouverture, Escape et restitution du focus sur la popover', async ({ page }) => {
    // Connexion Admin via UI
    await loginViaUI(page, adminEmail, adminPassword);

    const adminView = page.locator('#view-admin');
    await expect(adminView).toBeVisible({ timeout: 10000 });

    // Basculer vers l'onglet formations
    await page.locator('#stat-card-courses').click();
    await expect(page.locator('#admin-tab-courses')).toBeVisible();

    // Cibler le premier bouton d'assignation
    const btnAssign = page.locator('.btn-open-assign-teacher').first();
    await expect(btnAssign).toBeVisible();
    await expect(btnAssign).toHaveAttribute('aria-haspopup', 'dialog');
    await expect(btnAssign).toHaveAttribute('aria-expanded', 'false');

    // 1. Navigation au clavier : Focus et activation avec Enter
    await btnAssign.focus();
    await page.keyboard.press('Enter');

    // Popover ouverte
    await expect(btnAssign).toHaveAttribute('aria-expanded', 'true');
    const popover = page.locator('.assign-teacher-popover:visible').first();
    await expect(popover).toBeVisible();

    // 2. Touche Escape : fermeture et restitution du focus
    await page.keyboard.press('Escape');

    // Vérifier fermeture
    await expect(popover).toBeHidden();
    await expect(btnAssign).toHaveAttribute('aria-expanded', 'false');

    // Vérifier que le focus est restitué au bouton déclencheur
    const isFocused = await btnAssign.evaluate(el => el === document.activeElement);
    expect(isFocused).toBe(true);
  });

});
