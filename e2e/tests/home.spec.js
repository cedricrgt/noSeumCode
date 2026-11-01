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
    await expect(mainHeader).toContainText('Deviens développeur web sans rester bloqué');
  });

  test('Le lien Ateliers Gratuits (Live) dans la navigation bascule en dark navy au hover', async ({ page }) => {
    await page.goto('/');
    const workshopsLink = page.locator('.navbar__link--workshops a');
    await expect(workshopsLink).toBeVisible();
    await expect(workshopsLink).toContainText('Ateliers Gratuits (Live)');

    await workshopsLink.hover();
    await expect(workshopsLink).toHaveCSS('color', 'rgb(10, 22, 40)');
  });

  test('Le lien actif dans la navigation conserve une police sombre et grasse (contraste sur fond clair)', async ({ page }) => {
    await page.goto('/');
    const activeLink = page.locator('.navbar__link.active');
    await expect(activeLink).toBeVisible();
    await expect(activeLink).toHaveCSS('font-weight', '700');
    await expect(activeLink).toHaveCSS('color', 'rgb(45, 55, 72)');
  });

});
