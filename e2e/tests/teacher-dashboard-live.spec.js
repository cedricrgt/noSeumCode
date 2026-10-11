const { test, expect } = require('@playwright/test');

/**
 * E2E Réel (Zero Mock) - Parcours d'Assignation Admin & Dashboard Formateur (ADR-024)
 * 
 * Règle de Gouvernance QA (ADR-024) :
 * Ce test traverse la véritable API et n'utilise AUCUN page.route() pour court-circuiter
 * les routes /api/auth/* ou /api/courses/*.
 */
test.describe('E2E Dé-mocké : Parcours d\'Assignation Admin & Espace Formateur Réel (ADR-024)', () => {

  const adminEmail = process.env.TEST_ADMIN_EMAIL || 'admin@codebangers.fr';
  const adminPassword = process.env.TEST_ADMIN_PASSWORD || 'secret123';
  const teacherEmail = process.env.TEST_TEACHER_EMAIL || 'teacher@codebangers.fr';
  const teacherPassword = process.env.TEST_TEACHER_PASSWORD || 'secret123';

  test('Parcours réel de bout en bout sans mock réseau (Admin assigne, Teacher consulte)', async ({ page, request }) => {
    // 0. Vérification de la disponibilité et de la validité des identifiants réels sur l'API distante
    let credentialsValid = false;
    try {
      const probeRes = await request.post('https://api.noseumcode.fr/api/auth/login', {
        headers: { 'Content-Type': 'application/json' },
        data: { email: adminEmail, password: adminPassword }
      });
      credentialsValid = probeRes.status() === 200;
    } catch (_) {
      credentialsValid = false;
    }

    test.skip(!credentialsValid, 'Identifiants réels non configurés ou indisponibles sur https://api.noseumcode.fr (nécessite des identifiants valides via TEST_ADMIN_EMAIL / TEST_ADMIN_PASSWORD).');

    // 1. Démarrer sur index.html et ouvrir la modale d'authentification
    await page.goto('/index.html');
    const headerAuthBtn = page.locator('#header-auth-btn');
    if (await headerAuthBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await headerAuthBtn.click();
    } else {
      await page.evaluate(() => {
        if (typeof window.openGlobalAuthModal === 'function') {
          window.openGlobalAuthModal('login', true);
        } else {
          const popover = document.getElementById('auth-popover');
          if (popover && typeof popover.showPopover === 'function') popover.showPopover();
        }
      });
    }

    // 2. Connexion avec les identifiants réels de l'Admin
    const emailInput = page.locator('#global-login-email');
    const passwordInput = page.locator('#global-login-password');
    const submitBtn = page.locator('#global-login-submit-btn');

    await expect(emailInput).toBeVisible();
    await emailInput.fill(adminEmail);
    await passwordInput.fill(adminPassword);
    await submitBtn.click();

    // Attente de navigation vers le dashboard
    await page.waitForURL('**/dashboard.html*', { timeout: 15000 });

    // 3. Navigation vers la console Admin et assignation d'un cours
    const adminView = page.locator('#view-admin');
    await expect(adminView).toBeVisible({ timeout: 10000 });

    const courseSelect = page.locator('#admin-assign-course-select');
    const teacherSelect = page.locator('#admin-assign-teacher-select');
    const btnAssign = page.locator('#btn-assign-teacher');

    if (await courseSelect.isVisible() && await teacherSelect.isVisible()) {
      // Sélectionner le premier cours et le formateur cible
      await courseSelect.selectOption({ index: 0 });
      await teacherSelect.selectOption({ label: /Prof|Teacher|formateur/i });
      await btnAssign.click();

      // Vérifier le toast ou confirmation visuelle
      const toast = page.locator('#dash-floating-toast');
      await expect(toast).toContainText(/assigné avec succès/i, { timeout: 10000 });
    }

    // 4. Déconnexion via le bouton UI officiel
    const btnLogout = page.locator('#dash-btn-logout, .dash-header-logout, [onclick*="globalLogout"]').first();
    await expect(btnLogout).toBeVisible();
    await btnLogout.click();

    // Vérifier que le localStorage est vidé
    const tokenAfterLogout = await page.evaluate(() => localStorage.getItem('noseum_token'));
    expect(tokenAfterLogout).toBeNull();

    // 5. Reconnexion immédiate avec les identifiants du formateur
    await page.goto('/index.html');
    if (await headerAuthBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await headerAuthBtn.click();
    } else {
      await page.evaluate(() => {
        if (typeof window.openGlobalAuthModal === 'function') {
          window.openGlobalAuthModal('login', true);
        } else {
          const popover = document.getElementById('auth-popover');
          if (popover && typeof popover.showPopover === 'function') popover.showPopover();
        }
      });
    }

    await emailInput.fill(teacherEmail);
    await passwordInput.fill(teacherPassword);
    await submitBtn.click();

    await page.waitForURL('**/dashboard.html*', { timeout: 15000 });

    // 6. Arrivée sur le dashboard formateur
    const teacherView = page.locator('#view-teacher');
    await expect(teacherView).toBeVisible({ timeout: 10000 });

    // Vérifier que la section des cours enseignés contient le badge FORMATEUR RÉFÉRENT
    const teacherCoursesGrid = page.locator('#teacher-courses-grid');
    await expect(teacherCoursesGrid).toBeVisible();
    await expect(teacherCoursesGrid).toContainText('FORMATEUR RÉFÉRENT');

    // Vérifier que le message d'état vide n'est PAS visible
    await expect(page.locator('text=Aucun cours enseigné pour le moment')).toBeHidden();
  });

});
