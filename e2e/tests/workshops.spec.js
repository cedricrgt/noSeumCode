const { test, expect } = require('@playwright/test');

test.describe('Page des Ateliers Découvertes (workshops.html)', () => {

  test('La page workshops.html se charge sans erreur JavaScript et affiche les ateliers', async ({ page }) => {
    const pageErrors = [];
    page.on('pageerror', (err) => {
      pageErrors.push(err.message);
    });

    await page.goto('/workshops.html');
    await expect(page).toHaveTitle(/Ateliers Découvertes Gratuits/);

    // Vérifier l'absence d'erreur JS de parsing ou d'exécution
    expect(pageErrors).toEqual([]);

    // Vérifier que la grille d'ateliers est bien alimentée avec au moins un atelier
    const cards = page.locator('#workshops-grid .workshop-card');
    await expect(cards.first()).toBeVisible({ timeout: 5000 });
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(1);

    // Vérifier le bouton d'action d'au moins un atelier
    const registerBtn = page.locator('#workshops-grid .workshop-btn--register');
    await expect(registerBtn.first()).toBeVisible();
  });

});
