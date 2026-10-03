const { test, expect } = require('@playwright/test');

test.describe('Vérification du Frontend Code Bangers (NoSeumCode)', () => {
  
  test('La page d\'accueil charge correctement et affiche le bon titre', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/NoSeumCode/);
  });

  test('Le header principal est présent', async ({ page }) => {
    await page.goto('/');
    const mainHeader = page.locator('h1');
    await expect(mainHeader).toBeVisible();
    await expect(mainHeader).toContainText('Sans le seum');
  });

});
