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

  test('La boîte à outils est intégrée au bas du hero, centrée avec le titre au-dessus des outils', async ({ page }) => {
    await page.goto('/');
    const hero = page.locator('section.hero');
    const heroTrustbar = hero.locator('.hero__trustbar');
    await expect(heroTrustbar).toBeVisible();

    // Vérifier l'absence d'ancienne section trustbar hors du hero
    await expect(page.locator('main > section.section--trustbar')).toHaveCount(0);

    // Vérifier le titre au-dessus des outils
    const label = heroTrustbar.locator('.hero__trustbar-label');
    await expect(label).toBeVisible();
    await expect(label).toContainText('Les technologies et outils professionnels que tu vas maîtriser');

    const toolsContainer = heroTrustbar.locator('.hero__trustbar-tools');
    const tools = toolsContainer.locator('.tool-badge');
    await expect(tools).toHaveCount(6);
    await expect(tools.nth(0)).toContainText('HTML5 Sémantique');
    await expect(tools.nth(1)).toContainText('CSS3 & Flexbox');
    await expect(tools.nth(2)).toContainText('JavaScript ES6+');
    await expect(tools.nth(3)).toContainText('Git & GitHub');
    await expect(tools.nth(4)).toContainText('VS Code');
    await expect(tools.nth(5)).toContainText('Responsive Design');

    // Vérifier géométriquement que le titre est au-dessus des icônes/badges
    const labelBox = await label.boundingBox();
    const firstToolBox = await tools.first().boundingBox();
    expect(labelBox.y + labelBox.height).toBeLessThanOrEqual(firstToolBox.y);

    // Vérifier que le background du conteneur trustbar est transparent
    const bg = await heroTrustbar.evaluate((el) => window.getComputedStyle(el).backgroundColor);
    expect(bg).toBe('rgba(0, 0, 0, 0)');
  });

});
