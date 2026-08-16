import { test, expect } from '@playwright/test';
import fs from 'node:fs';

const baseURL = process.env.BASE_URL || 'http://127.0.0.1:4173';
fs.mkdirSync('artifacts', { recursive:true });

const demos = [
  { slug:'praziarnicka', launcher:'#pz13-open', advisor:'.pz13-mode button[data-mode="advisor"]', chat:'.pz13-mode button[data-mode="chat"]', option:'.pz13-option', question:'.pz13-advisor__body', panel:'#pz13-widget', header:'.pz13-widget__head', finder:'.pz13-advisor-entry', welcome:'.pz13-message--assistant .pz13-bubble', chip:'.pz13-chip' },
  { slug:'diamonds', launcher:'#launcherButton', advisor:'.mode-switch button[data-mode="advisor"]', chat:'.mode-switch button[data-mode="chat"]', option:'.answer-card', question:'#advisorContent', panel:'#widget', header:'.widget-head', finder:'#chatScreen .advisor-entry', welcome:'.chat-line:not(.chat-line--user) .chat-bubble', chip:'#chatScreen .quick-grid button' },
  { slug:'kaffa', launcher:'#launcher', advisor:'.kf-switch button[data-view="advisor"]', chat:'.kf-switch button[data-view="chat"]', option:'.kf-option', question:'.kf-stage', panel:'.kf-panel', header:'.kf-panel-head', finder:'.kf-advisor-entry', welcome:'.kf-message.bot', chip:'.kf-chip' },
  { slug:'vitazov', launcher:'#openWidget', advisor:'.mode__button[data-mode="advisor"],.mode-switch button[data-mode="advisor"]', chat:'.mode__button[data-mode="chat"],.mode-switch button[data-mode="chat"]', option:'#advisorBody .option', question:'#advisorBody', panel:'#widget', header:'.widget__header,.widget-head', finder:'#chatScreen .advisor-entry', welcome:'.message:not(.message--user) .bubble', chip:'#quickChips .chip,#quickChips button,.chips button' },
  { slug:'concept', launcher:'#openWidget', advisor:'.mode__button[data-mode="advisor"],.mode-switch button[data-mode="advisor"]', chat:'.mode__button[data-mode="chat"],.mode-switch button[data-mode="chat"]', option:'#advisorBody .option', question:'#advisorBody', panel:'#widget', header:'.widget__header,.widget-head', finder:'#chatScreen .advisor-entry', welcome:'.message:not(.message--user) .bubble', chip:'#quickChips .chip,#quickChips button,.chips button' },
  { slug:'jolka', path:'/jolka.html', launcher:'#open', advisor:'.mode__button[data-mode="advisor"]', chat:'.mode__button[data-mode="chat"]', option:'#advisor .option', question:'#advisor', panel:'#widget', header:'.widget__header', finder:'#entry', welcome:'.msg:not(.msg--user) .bubble', chip:'.chip' }
];

async function openDemo(page, demo, viewport = { width:1366, height:768 }) {
  await page.setViewportSize(viewport);
  await page.goto(demo.path ? `${baseURL}${demo.path}` : `${baseURL}/?demo=${demo.slug}`, { waitUntil:'domcontentloaded' });
  await page.waitForFunction(() => document.documentElement.dataset.coffeeRelease === 'client-ready');
  await page.waitForFunction(() => document.querySelector('.mc-owner')?.dataset.clientReadyOwner === 'true');
  await page.waitForFunction(() => [...document.styleSheets].some((sheet) => String(sheet.href || '').includes('coffee-client-ready.css')));
  await page.waitForTimeout(220);
}

async function pageMetrics(page) {
  return page.evaluate(() => ({ h:document.scrollingElement.scrollHeight, ih:innerHeight, w:document.scrollingElement.scrollWidth, iw:innerWidth }));
}

async function noOverflow(locator, tolerance = 3) {
  return locator.evaluate((node, t) => ({ ok:node.scrollHeight <= node.clientHeight + t, sh:node.scrollHeight, ch:node.clientHeight, sw:node.scrollWidth, cw:node.clientWidth }), tolerance);
}

test('all six owner pages are concise, branded and free of self-promotion/legacy layers', async ({ page }) => {
  for (const demo of demos) {
    await openDemo(page, demo);
    const owner = page.locator('.mc-owner');
    await expect(owner).toBeVisible();
    await expect(owner).toContainText('Menej hľadania.');
    await expect(owner).toContainText('Rýchlejšie ku káve.');
    await expect(owner).toContainText('Vyskúšať Výber kávy');
    await expect(owner).toContainText('Skúsiť Chat');
    await expect(owner.locator('.mc-owner-demo-card')).toHaveCount(2);
    await expect(owner.locator('.mc-owner-benefits > div')).toHaveCount(3);
    await expect(page.locator('a[href*="mojchatbot.sk"]')).toHaveCount(0);
    await expect(page.locator('script[src="/coffee-jolka-parity.js"]')).toHaveCount(0);
    await expect(page.locator('script[src="/coffee-owner-conversion.js"]')).toHaveCount(0);
    await expect(page.locator('link[href="/coffee-no-black.css"],link[href="/coffee-no-black-lock.css"]')).toHaveCount(0);
    const text = await page.locator('body').innerText();
    expect(text).not.toMatch(/Môj Chatbot|mojchatbot\.sk|Návrh AI|AI poradca|Ukážka pre váš web|verzia\s*\d|version\s*\d/i);
    const metrics = await pageMetrics(page);
    expect(metrics.h).toBeLessThanOrEqual(metrics.ih + 1);
    expect(metrics.w).toBeLessThanOrEqual(metrics.iw + 1);
    await page.screenshot({ path:`artifacts/client-ready-${demo.slug}-owner.png`, fullPage:true });
  }
});

test('all six mobile owner pages keep the core pitch and actions above launcher overlap', async ({ page }) => {
  for (const demo of demos) {
    await openDemo(page, demo, { width:390, height:844 });
    const owner = page.locator('.mc-owner');
    await expect(owner.locator('.mc-owner-lockup')).toBeVisible();
    await expect(owner.locator('[data-release-open="advisor"]')).toBeVisible();
    await expect(owner.locator('[data-release-open="chat"]')).toBeVisible();
    await expect(owner.locator('.mc-owner-demo')).toBeHidden();
    const metrics = await pageMetrics(page);
    expect(metrics.h).toBeLessThanOrEqual(metrics.ih + 1);
    expect(metrics.w).toBeLessThanOrEqual(metrics.iw + 1);
    const launcher = await page.locator(demo.launcher).boundingBox();
    const actions = await owner.locator('.mc-owner-actions').boundingBox();
    expect(actions.y + actions.height, `${demo.slug} owner CTA clear of launcher`).toBeLessThan(launcher.y - 20);
    await page.screenshot({ path:`artifacts/client-ready-${demo.slug}-owner-mobile.png`, fullPage:true });
  }
});

test('all six widgets have strong headers, one switch, finder immediately before welcome and compact chips', async ({ page }) => {
  for (const demo of demos) {
    await openDemo(page, demo, { width:390, height:844 });
    await page.locator(demo.launcher).click({ force:true });
    await expect(page.locator(demo.panel).first()).toBeVisible();
    await page.locator(demo.chat).filter({ visible:true }).first().click({ force:true });

    const border = await page.locator(demo.header).filter({ visible:true }).first().evaluate((node) => parseFloat(getComputedStyle(node).borderBottomWidth));
    expect(border, `${demo.slug} header`).toBeGreaterThanOrEqual(1.5);
    const finder = page.locator(demo.finder).filter({ visible:true }).first();
    const welcome = page.locator(demo.welcome).filter({ visible:true }).first();
    await expect(finder).toBeVisible();
    await expect(welcome).toBeVisible();
    const finderBox = await finder.boundingBox();
    const welcomeBox = await welcome.boundingBox();
    expect(finderBox.y + finderBox.height, `${demo.slug} finder directly above welcome`).toBeLessThanOrEqual(welcomeBox.y + 5);

    const chips = page.locator(demo.chip).filter({ visible:true });
    expect(await chips.count(), `${demo.slug} quick chips`).toBeGreaterThanOrEqual(4);
    const metric = await chips.first().evaluate((node) => ({ h:node.getBoundingClientRect().height, font:parseFloat(getComputedStyle(node).fontSize) }));
    expect(metric.h).toBeGreaterThanOrEqual(34);
    expect(metric.h).toBeLessThanOrEqual(48);
    expect(metric.font).toBeGreaterThanOrEqual(11);
    expect(metric.font).toBeLessThanOrEqual(13.5);
    await page.screenshot({ path:`artifacts/client-ready-${demo.slug}-chat-mobile.png`, fullPage:true });
  }
});

test('all six four-step selectors fit the mobile pane without scrolling', async ({ page }) => {
  for (const demo of demos) {
    await openDemo(page, demo, { width:390, height:844 });
    await page.locator(demo.launcher).click({ force:true });
    const advisorButton = page.locator(demo.advisor).filter({ visible:true }).first();
    await expect(advisorButton).toBeVisible();
    await advisorButton.click({ force:true });
    for (let step = 0; step < 4; step += 1) {
      const question = page.locator(demo.question).filter({ visible:true }).first();
      await expect(question).toBeVisible();
      const fit = await noOverflow(question);
      expect(fit.ok, `${demo.slug} step ${step + 1}: ${JSON.stringify(fit)}`).toBeTruthy();
      const options = page.locator(demo.option).filter({ visible:true });
      expect(await options.count()).toBeGreaterThanOrEqual(2);
      const first = options.first();
      expect((await first.boundingBox()).height).toBeGreaterThanOrEqual(48);
      await first.click({ force:true });
      await page.waitForTimeout(720);
    }
    await page.screenshot({ path:`artifacts/client-ready-${demo.slug}-result-mobile.png`, fullPage:true });
  }
});

test('Praziarnicka uses high-resolution semantic sprite crops instead of the tiny prep thumbnails', async ({ page }) => {
  const demo = demos[0];
  await openDemo(page, demo, { width:571, height:813 });
  await page.locator(demo.launcher).click();
  await page.locator(demo.advisor).filter({ visible:true }).first().click();
  const photos = page.locator('.pz13-option__photo.is-proxy');
  await expect(photos).toHaveCount(4);
  const visuals = await photos.evaluateAll((nodes) => nodes.map((node) => ({ bg:getComputedStyle(node).backgroundImage, pos:getComputedStyle(node).backgroundPosition, opacity:Number(getComputedStyle(node).opacity) })));
  expect(visuals.every((item) => item.bg.includes('choice-sprite.png'))).toBeTruthy();
  expect(visuals.every((item) => item.opacity >= .99)).toBeTruthy();
  expect(new Set(visuals.map((item) => item.pos)).size).toBe(4);
  await expect(page.locator('.pz13-option__img').first()).toBeHidden();
});

test('Diamonds is truly clickable and the closed panel cannot cover the launcher', async ({ page }) => {
  const demo = demos.find((item) => item.slug === 'diamonds');
  await openDemo(page, demo, { width:390, height:844 });
  expect(await page.locator('#widget').evaluate((node) => getComputedStyle(node).pointerEvents)).toBe('none');
  await page.locator(demo.launcher).click();
  await expect(page.locator('#widget')).toHaveAttribute('aria-hidden', 'false');
  await page.locator(demo.advisor).filter({ visible:true }).first().click();
  await expect(page.locator('.answer-card').first()).toBeVisible();
  await page.locator('.answer-card').first().click({ force:true });
  await page.waitForTimeout(420);
  await expect(page.locator('#backButton')).toBeEnabled();
});

test('Kaffa uses cream/ink and Concept uses teal rather than the old blue/orange casts', async ({ page }) => {
  const kaffa = demos.find((item) => item.slug === 'kaffa');
  await openDemo(page, kaffa, { width:390, height:844 });
  await page.locator(kaffa.launcher).click();
  await expect(page.locator('.kf-chat-editorial')).toHaveCount(0);
  const kaffaBg = await page.locator('.kf-switch button[aria-selected="true"],.kf-switch button.is-active').filter({ visible:true }).first().evaluate((node) => getComputedStyle(node).backgroundColor);
  expect(kaffaBg).toMatch(/rgb\(21, 20, 18\)/);

  const concept = demos.find((item) => item.slug === 'concept');
  await openDemo(page, concept, { width:390, height:844 });
  await page.locator(concept.launcher).click();
  const conceptBg = await page.locator('.mode__button.is-active').filter({ visible:true }).first().evaluate((node) => getComputedStyle(node).backgroundColor);
  expect(conceptBg).toMatch(/rgb\(47, 119, 117\)/);
});

test('Jolka keeps its strong brown header but uses a smaller teaser and compact chips', async ({ page }) => {
  const demo = demos.find((item) => item.slug === 'jolka');
  await openDemo(page, demo, { width:390, height:844 });
  const teaser = page.locator('.launcher__teaser');
  if (await teaser.count()) {
    const sizes = await teaser.evaluate((node) => ({ w:node.getBoundingClientRect().width, title:parseFloat(getComputedStyle(node.querySelector('b')).fontSize), secondary:parseFloat(getComputedStyle(node.querySelector('span')).fontSize) }));
    expect(sizes.w).toBeLessThanOrEqual(244);
    expect(sizes.title).toBeLessThanOrEqual(14);
    expect(sizes.secondary).toBeLessThanOrEqual(12);
  }
  await page.locator(demo.launcher).click();
  expect(await page.locator('.widget__header').evaluate((node) => getComputedStyle(node).backgroundImage)).toContain('linear-gradient');
  const chips = page.locator(demo.chip).filter({ visible:true });
  if (await chips.count()) {
    const font = await chips.first().evaluate((node) => parseFloat(getComputedStyle(node).fontSize));
    expect(font).toBeLessThanOrEqual(12.2);
  }
});
