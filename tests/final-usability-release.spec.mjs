import { test, expect } from '@playwright/test';
import fs from 'node:fs';

const baseURL = process.env.BASE_URL || 'http://127.0.0.1:4173';
fs.mkdirSync('artifacts', { recursive:true });

const demos = [
  { slug:'praziarnicka', launcher:'#pz13-open', advisor:'.pz13-mode button[data-mode="advisor"]', chat:'.pz13-mode button[data-mode="chat"]', option:'.pz13-option', question:'.pz13-advisor__body', panel:'#pz13-widget', header:'.pz13-widget__head', finder:'.pz13-advisor-entry', messages:'.pz13-chat__messages', chip:'.pz13-chip' },
  { slug:'diamonds', launcher:'#launcherButton', advisor:'.mode-switch button[data-mode="advisor"]', chat:'.mode-switch button[data-mode="chat"]', option:'.answer-card', question:'#advisorContent', panel:'#widget', header:'.widget-head', finder:'#chatScreen .advisor-entry', messages:'#chatScreen .chat-messages', chip:'#chatScreen .quick-grid button' },
  { slug:'kaffa', launcher:'#launcher', advisor:'.kf-switch button[data-view="advisor"]', chat:'.kf-switch button[data-view="chat"]', option:'.kf-option', question:'.kf-stage', panel:'.kf-panel', header:'.kf-panel-head', finder:'.kf-advisor-entry', messages:'.kf-messages', chip:'.kf-chip' },
  { slug:'vitazov', launcher:'#openWidget', advisor:'.mode__button[data-mode="advisor"],.mode-switch button[data-mode="advisor"]', chat:'.mode__button[data-mode="chat"],.mode-switch button[data-mode="chat"]', option:'#advisorBody .option', question:'#advisorBody', panel:'#widget', header:'.widget__header,.widget-head', finder:'#chatScreen .advisor-entry', messages:'#chatMessages,.chat-messages,.chat', chip:'#quickChips .chip,#quickChips button,.chips button' },
  { slug:'concept', launcher:'#openWidget', advisor:'.mode__button[data-mode="advisor"],.mode-switch button[data-mode="advisor"]', chat:'.mode__button[data-mode="chat"],.mode-switch button[data-mode="chat"]', option:'#advisorBody .option', question:'#advisorBody', panel:'#widget', header:'.widget__header,.widget-head', finder:'#chatScreen .advisor-entry', messages:'#chatMessages,.chat-messages,.chat', chip:'#quickChips .chip,#quickChips button,.chips button' },
  { slug:'jolka', path:'/jolka.html', launcher:'#open', advisor:'.mode__button[data-mode="advisor"]', chat:'.mode__button[data-mode="chat"]', option:'#advisor .option', question:'#advisor', panel:'#widget', header:'.widget__header', finder:'#entry', messages:'#chat', chip:'.chips .chip,.quick-chips .chip,.chip' }
];

async function openDemo(page, demo, viewport = { width:1366, height:768 }) {
  await page.setViewportSize(viewport);
  await page.goto(demo.path ? `${baseURL}${demo.path}` : `${baseURL}/?demo=${demo.slug}`, { waitUntil:'domcontentloaded' });
  await page.waitForFunction(() => document.documentElement.dataset.coffeeRelease === 'client-ready');
  await page.waitForFunction(() => document.querySelector('.mc-owner')?.dataset.clientReadyOwner === 'true');
  await page.waitForFunction(() => [...document.styleSheets].some((sheet) => String(sheet.href || '').includes('coffee-client-ready.css')));
  await page.waitForTimeout(220);
}

async function noOverflow(locator, tolerance = 3) {
  return locator.evaluate((node, t) => ({
    ok: node.scrollHeight <= node.clientHeight + t,
    scrollHeight:node.scrollHeight,
    clientHeight:node.clientHeight,
    scrollWidth:node.scrollWidth,
    clientWidth:node.clientWidth
  }), tolerance);
}

async function pageMetrics(page) {
  return page.evaluate(() => ({ h:document.scrollingElement.scrollHeight, ih:innerHeight, w:document.scrollingElement.scrollWidth, iw:innerWidth }));
}

function center(box) { return box.x + box.width / 2; }

test('all six owner pages are concise, client-facing and contain no Môj Chatbot/AI/demo branding', async ({ page }) => {
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

    const text = await page.locator('body').innerText();
    expect(text).not.toMatch(/Môj Chatbot|mojchatbot\.sk|Návrh AI|AI poradca|Ukážka pre váš web|verzia\s*\d|version\s*\d/i);
    const metrics = await pageMetrics(page);
    expect(metrics.h).toBeLessThanOrEqual(metrics.ih + 1);
    expect(metrics.w).toBeLessThanOrEqual(metrics.iw + 1);
    await page.screenshot({ path:`artifacts/client-ready-${demo.slug}-owner.png`, fullPage:true });
  }
});

test('all six owner pages have a clean mobile composition without launcher overlap', async ({ page }) => {
  for (const demo of demos) {
    await openDemo(page, demo, { width:390, height:844 });
    const owner = page.locator('.mc-owner');
    await expect(owner.locator('.mc-owner-lockup')).toBeVisible();
    await expect(owner.locator('[data-release-open="advisor"]')).toBeVisible();
    await expect(owner.locator('[data-release-open="chat"]')).toBeVisible();
    await expect(owner.locator('.mc-owner-demo')).toBeHidden();
    await expect(owner.locator('.mc-owner-benefits > div')).toHaveCount(3);

    const keyFonts = await owner.locator('.mc-owner-copy h1,.mc-owner-copy>p,.mc-owner-actions button,.mc-owner-benefits b').evaluateAll((nodes) => nodes.filter((node) => getComputedStyle(node).display !== 'none').map((node) => parseFloat(getComputedStyle(node).fontSize)));
    expect(Math.min(...keyFonts)).toBeGreaterThanOrEqual(9);

    const metrics = await pageMetrics(page);
    expect(metrics.h).toBeLessThanOrEqual(metrics.ih + 1);
    expect(metrics.w).toBeLessThanOrEqual(metrics.iw + 1);
    const launcherBox = await page.locator(demo.launcher).boundingBox();
    const actionsBox = await owner.locator('.mc-owner-actions').boundingBox();
    expect(actionsBox.y + actionsBox.height).toBeLessThan(launcherBox.y - 25);
    await page.screenshot({ path:`artifacts/client-ready-${demo.slug}-owner-mobile.png`, fullPage:true });
  }
});

test('all six widgets have a clear header, CTA above welcome and compact readable chips', async ({ page }) => {
  for (const demo of demos) {
    await openDemo(page, demo, { width:390, height:844 });
    await page.locator(demo.launcher).click({ force:true });
    await expect(page.locator(demo.panel).first()).toBeVisible();
    await page.locator(demo.chat).first().click({ force:true });

    const header = page.locator(demo.header).first();
    const headerBorder = await header.evaluate((node) => parseFloat(getComputedStyle(node).borderBottomWidth));
    expect(headerBorder, `${demo.slug} header border`).toBeGreaterThanOrEqual(1.5);

    const finder = page.locator(demo.finder).first();
    const messages = page.locator(demo.messages).first();
    await expect(finder).toBeVisible();
    await expect(messages).toBeVisible();
    const finderBox = await finder.boundingBox();
    const messagesBox = await messages.boundingBox();
    expect(finderBox.y, `${demo.slug} finder before welcome`).toBeLessThan(messagesBox.y + 12);

    const chips = page.locator(demo.chip).filter({ visible:true });
    expect(await chips.count(), `${demo.slug} chips`).toBeGreaterThanOrEqual(4);
    const chipMetrics = await chips.first().evaluate((node) => ({ h:node.getBoundingClientRect().height, font:parseFloat(getComputedStyle(node).fontSize) }));
    expect(chipMetrics.h).toBeGreaterThanOrEqual(34);
    expect(chipMetrics.h).toBeLessThanOrEqual(48);
    expect(chipMetrics.font).toBeGreaterThanOrEqual(11);
    expect(chipMetrics.font).toBeLessThanOrEqual(13.5);

    const text = await page.locator('body').innerText();
    expect(text).not.toMatch(/Môj Chatbot|mojchatbot\.sk|AI poradca|verzia\s*\d|version\s*\d/i);
    await page.screenshot({ path:`artifacts/client-ready-${demo.slug}-chat-mobile.png`, fullPage:true });
  }
});

test('all six advisors keep every question inside one screen', async ({ page }) => {
  for (const demo of demos) {
    await openDemo(page, demo, { width:390, height:844 });
    await page.locator(demo.launcher).click({ force:true });
    await expect(page.locator(demo.panel).first()).toBeVisible();
    await page.locator(demo.advisor).first().click({ force:true });

    for (let step = 0; step < 4; step += 1) {
      const question = page.locator(demo.question).first();
      await expect(question).toBeVisible();
      const metrics = await noOverflow(question);
      expect(metrics.ok, `${demo.slug} step ${step + 1}: ${JSON.stringify(metrics)}`).toBeTruthy();
      const options = page.locator(demo.option).filter({ visible:true });
      expect(await options.count()).toBeGreaterThanOrEqual(2);
      const first = options.first();
      const box = await first.boundingBox();
      expect(box.height).toBeGreaterThanOrEqual(48);
      await first.click({ force:true });
      await page.waitForTimeout(720);
    }
    await page.screenshot({ path:`artifacts/client-ready-${demo.slug}-result-mobile.png`, fullPage:true });
  }
});

test('Praziarnicka uses the high-resolution semantic choice sprite and a stronger header', async ({ page }) => {
  const demo = demos[0];
  await openDemo(page, demo, { width:390, height:844 });
  await page.locator(demo.launcher).click();
  await page.locator(demo.advisor).click();
  await expect(page.locator('.pz13-option')).toHaveCount(4);
  await expect(page.locator('.pz13-option__img').first()).toBeHidden();
  const proxy = page.locator('.pz13-option__photo.is-proxy').first();
  await expect(proxy).toBeVisible();
  const proxyStyle = await proxy.evaluate((node) => ({ opacity:getComputedStyle(node).opacity, bg:getComputedStyle(node).backgroundImage }));
  expect(Number(proxyStyle.opacity)).toBeGreaterThanOrEqual(.99);
  expect(proxyStyle.bg).toContain('choice-sprite.png');
  const border = await page.locator('.pz13-widget__head').evaluate((node) => parseFloat(getComputedStyle(node).borderBottomWidth));
  expect(border).toBeGreaterThanOrEqual(1.5);
});

test('Diamonds is clickable and its closed panel never blocks the launcher', async ({ page }) => {
  const demo = demos.find((item) => item.slug === 'diamonds');
  await openDemo(page, demo, { width:390, height:844 });
  const closedPointer = await page.locator('#widget').evaluate((node) => getComputedStyle(node).pointerEvents);
  expect(closedPointer).toBe('none');
  await page.locator(demo.launcher).click();
  await expect(page.locator('#widget')).toHaveAttribute('aria-hidden', 'false');
  await page.locator(demo.advisor).click();
  await expect(page.locator('.answer-card').first()).toBeVisible();
  await page.locator('.answer-card').first().click({ force:true });
  await page.waitForTimeout(420);
  await expect(page.locator('#backButton')).toBeEnabled();
});

test('Kaffa is cream/ink, Concept is teal, and stale editorial/demo layers are gone', async ({ page }) => {
  const kaffa = demos.find((item) => item.slug === 'kaffa');
  await openDemo(page, kaffa, { width:390, height:844 });
  await page.locator(kaffa.launcher).click();
  await expect(page.locator('.kf-chat-editorial')).toHaveCount(0);
  const kaffaActive = await page.locator('.kf-switch button[aria-selected="true"],.kf-switch button.is-active').first().evaluate((node) => getComputedStyle(node).backgroundColor);
  expect(kaffaActive).toMatch(/rgb\(21, 20, 18\)/);

  const concept = demos.find((item) => item.slug === 'concept');
  await openDemo(page, concept, { width:390, height:844 });
  await page.locator(concept.launcher).click();
  const active = page.locator('.mode__button.is-active').first();
  const bg = await active.evaluate((node) => getComputedStyle(node).backgroundColor);
  expect(bg).toMatch(/rgb\(47, 119, 117\)/);
  expect(bg).not.toMatch(/rgb\(211,\s*10[0-9],\s*7[0-9]\)/);
});

test('Jolka keeps the strong header with a smaller teaser and finder immediately before chat', async ({ page }) => {
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
  const headerBg = await page.locator('.widget__header').evaluate((node) => getComputedStyle(node).backgroundImage);
  expect(headerBg).toContain('linear-gradient');
  await page.locator(demo.chat).click();
  const entryBox = await page.locator('#entry').boundingBox();
  const chatBox = await page.locator('#chat').boundingBox();
  expect(entryBox.y).toBeLessThan(chatBox.y + 2);
});
