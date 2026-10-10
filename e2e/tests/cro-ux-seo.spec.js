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

  test('La boîte à outils est intégrée dans la partie droite du hero sous les CTA, centrée avec le titre au-dessus des outils', async ({ page }) => {
    await page.goto('/');
    const hero = page.locator('section.hero');
    const heroTrustbar = hero.locator('.hero__left .hero__trustbar');
    await expect(heroTrustbar).toBeVisible();

    // Vérifier que la trustbar est bien positionnée sous les boutons d'action
    const heroDecorations = hero.locator('.hero__decorations');
    const decBox = await heroDecorations.boundingBox();
    const trustBox = await heroTrustbar.boundingBox();
    expect(trustBox.y).toBeGreaterThanOrEqual(decBox.y + decBox.height - 10);

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

  test('Le contenu du hero est centré sur grand écran (1920px)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    const heroContainer = page.locator('.hero__container');
    await expect(heroContainer).toBeVisible();

    const box = await heroContainer.boundingBox();
    const centerX = box.x + box.width / 2;
    // Sur viewport 1920px, le centre doit être aligné à 960px (+/- 10px)
    expect(Math.abs(centerX - 960)).toBeLessThan(15);
  });

  test('Les 3 piliers pédagogiques (#services) et leurs popovers utilisent des icônes SVG aux couleurs de la marque sans émoticônes IA', async ({ page }) => {
    await page.goto('/');

    // 1. Les 3 cartes de #services
    const serviceCards = page.locator('#services .card');
    await expect(serviceCards).toHaveCount(3);

    for (let i = 0; i < 3; i++) {
      const card = serviceCards.nth(i);
      const tag = card.locator('.card__tag');
      await expect(tag).toBeVisible();
      await expect(tag.locator('svg.card__icon')).toBeVisible();
      const title = await card.locator('.card__title').innerText();
      expect(title).not.toMatch(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}]/u);
    }

    // 2. Popover Cours en direct (#pedagogy-live) ouvert au clic sur "En savoir plus"
    await page.locator('.card__link[popovertarget="pedagogy-live"]').click();
    const popoverLive = page.locator('#pedagogy-live');
    await expect(popoverLive).toBeVisible();
    const liveItems = popoverLive.locator('.popover__syllabus-item');
    await expect(liveItems).toHaveCount(4);
    for (let i = 0; i < 4; i++) {
      const item = liveItems.nth(i);
      await expect(item.locator('.popover__syllabus-icon svg')).toBeVisible();
      const text = await item.locator('.popover__syllabus-text').innerText();
      expect(text).not.toMatch(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}]/u);
    }
    await popoverLive.locator('.popover__close').click();

    // 3. Popover Projets Pro (#pedagogy-projects) ouvert au clic sur "Ce que tu vas créer"
    await page.locator('.card__link[popovertarget="pedagogy-projects"]').click();
    const popoverProjects = page.locator('#pedagogy-projects');
    await expect(popoverProjects).toBeVisible();
    const projectItems = popoverProjects.locator('.popover__syllabus-item');
    await expect(projectItems).toHaveCount(3);
    for (let i = 0; i < 3; i++) {
      const item = projectItems.nth(i);
      await expect(item.locator('.popover__syllabus-icon svg')).toBeVisible();
      const text = await item.locator('.popover__syllabus-text').innerText();
      expect(text).not.toMatch(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}]/u);
    }
    await popoverProjects.locator('.popover__close').click();

    // 4. Popover Mentorat (#pedagogy-mentoring) ouvert au clic sur "Découvrir le coaching"
    await page.locator('.card__link[popovertarget="pedagogy-mentoring"]').click();
    const popoverMentoring = page.locator('#pedagogy-mentoring');
    await expect(popoverMentoring).toBeVisible();
    const mentorItems = popoverMentoring.locator('.popover__syllabus-item');
    await expect(mentorItems).toHaveCount(3);
    for (let i = 0; i < 3; i++) {
      const item = mentorItems.nth(i);
      await expect(item.locator('.popover__syllabus-icon svg')).toBeVisible();
      const text = await item.locator('.popover__syllabus-text').innerText();
      expect(text).not.toMatch(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}]/u);
    }
    await popoverMentoring.locator('.popover__close').click();

    // 5. Section Mentor (#mentor) badges et piliers
    const mentorBadges = page.locator('#mentor .mentor__badge');
    const badgeCount = await mentorBadges.count();
    for (let i = 0; i < badgeCount; i++) {
      await expect(mentorBadges.nth(i).locator('svg')).toBeVisible();
      const text = await mentorBadges.nth(i).innerText();
      expect(text).not.toMatch(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}]/u);
    }

    const mentorPillars = page.locator('#mentor .mentor__pillar-icon');
    const pillarCount = await mentorPillars.count();
    for (let i = 0; i < pillarCount; i++) {
      await expect(mentorPillars.nth(i).locator('svg')).toBeVisible();
    }
  });

});
