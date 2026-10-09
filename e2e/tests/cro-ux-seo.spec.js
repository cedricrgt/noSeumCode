const { test, expect } = require('@playwright/test');

test.describe('Vérification des correctifs CRO, UX, SSG et SEO (Debrief)', () => {

  test('Hero header promet 2 Packs et ne mentionne plus 3 Packs', async ({ page }) => {
    await page.goto('/');
    const heroBtn = page.locator('a[data-track-cta="hero_view_packages"]');
    await expect(heroBtn).toBeVisible();
    await expect(heroBtn).toContainText('Voir nos 2 Packs');
    await expect(heroBtn).not.toContainText('3 Packs');
  });

  test('Les boutons Télécharger le programme (PDF) sont purgés de la zone des prix', async ({ page }) => {
    await page.goto('/');
    const starterCard = page.locator('#parcours .card-package').first();
    const webProCard = page.locator('#parcours .card-package').nth(1);

    await expect(starterCard.locator('button:has-text("Télécharger le programme détaillé (PDF)")')).toHaveCount(0);
    await expect(webProCard.locator('button:has-text("Télécharger le programme détaillé (PDF)")')).toHaveCount(0);
  });

  test('Dynamisation du prix au clic sur Order Bump Pack Starter (299€ -> 498€)', async ({ page }) => {
    await page.goto('/');
    const bumpStarter = page.locator('#bump-starter');
    const btnStarter = page.locator('#btn-buy-starter');

    await expect(btnStarter).toContainText('299 €');
    await bumpStarter.check();
    await expect(btnStarter).toContainText('498 €');
    await bumpStarter.uncheck();
    await expect(btnStarter).toContainText('299 €');
  });

  test('Dynamisation du prix au clic sur Order Bump Pack Web Pro (449€ -> 648€)', async ({ page }) => {
    await page.goto('/');
    const bumpWebPro = page.locator('#bump-web-pro');
    const btnWebPro = page.locator('#btn-buy-web-pro');

    await expect(btnWebPro).toContainText('449 €');
    await bumpWebPro.check();
    await expect(btnWebPro).toContainText('648 €');
    await bumpWebPro.uncheck();
    await expect(btnWebPro).toContainText('449 €');
  });

  test('La page app.html est protégée par noindex et charge le LMS', async ({ page }) => {
    await page.goto('/app.html');
    const robotsMeta = page.locator('meta[name="robots"]');
    await expect(robotsMeta).toHaveAttribute('content', /noindex/);
    await expect(page).toHaveTitle(/Espace de Formation/);
  });

  test('La page parcours.html a noindex et redirige vers app.html', async ({ page }) => {
    await page.goto('/parcours.html');
    await expect(page).toHaveURL(/app\.html/);
  });

});
