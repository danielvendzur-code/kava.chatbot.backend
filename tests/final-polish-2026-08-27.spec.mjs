import { test, expect } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const baseURL = process.env.BASE_URL || 'http://127.0.0.1:4173';
const artifacts = 'artifacts/final-polish-2026-08-27';
mkdirSync(artifacts, { recursive: true });

async function waitReady(page, slug) {
  await page.waitForFunction((expected) => {
    if (expected === 'jolka') return document.body.dataset.coffeeFinal === 'jolka' && document.documentElement.dataset.coffeeReleaseFinal === '2026-08-27';
    return document.documentElement.dataset.coffeeReleaseFinal === '2026-08-27';
  }, slug);
}

async function openDemo(page, demo, viewport = { width: 568, height: 809 }) {
  await page.setViewportSize(viewport);
  await page.goto(`${baseURL}${demo.url}`, { waitUntil: 'domcontentloaded' });
  await waitReady(page, demo.slug);
  await page.locator(demo.launcher).click({ force: true });
  await expect(page.locator(demo.panel)).toBeVisible();
}

async function selectMode(page, selector) {
  await page.locator(selector).click({ force: true });
  await page.waitForTimeout(120);
}

async function metrics(page, selector) {
  const box = await page.locator(selector).first().boundingBox();
  expect(box, `${selector} must have a rendered box`).not.toBeNull();
  return box;
}

const demos = {
  praziarnicka: { slug:'praziarnicka', url:'/?demo=praziarnicka', launcher:'#pz13-open', panel:'#pz13-widget', chat:'.pz13-mode button[data-mode="chat"]', advisor:'.pz13-mode button[data-mode="advisor"]' },
  jolka: { slug:'jolka', url:'/jolka.html', launcher:'#open', panel:'#widget', chat:'.mode__button[data-mode="chat"]', advisor:'.mode__button[data-mode="advisor"]' },
  kaffa: { slug:'kaffa', url:'/?demo=kaffa', launcher:'#launcher', panel:'.kf-panel', chat:'.kf-switch button[data-view="chat"]', advisor:'.kf-switch button[data-view="advisor"]' },
  concept: { slug:'concept', url:'/?demo=concept', launcher:'#openWidget', panel:'#widget', chat:'.mode__button[data-mode="chat"]', advisor:'.mode__button[data-mode="advisor"]' },
  vitazov: { slug:'vitazov', url:'/?demo=vitazov', launcher:'#openWidget', panel:'#widget', chat:'.mode__button[data-mode="chat"]', advisor:'.mode__button[data-mode="advisor"]' },
  diamonds: { slug:'diamonds', url:'/?demo=diamonds', launcher:'#launcherButton', panel:'#widget', chat:'.mode-switch button[data-mode="chat"]', advisor:'.mode-switch button[data-mode="advisor"]' }
};

test('Praziarnicka is the reference: large switch, photo CTA and larger clean composer', async ({ page }) => {
  const demo = demos.praziarnicka;
  await openDemo(page, demo);
  await selectMode(page, demo.chat);

  const panel = await metrics(page, demo.panel);
  const mode = await metrics(page, '.pz13-mode');
  const entry = await metrics(page, '#pz13-advisor-entry');
  const composer = await metrics(page, '.pz13-composer');

  expect(panel.y).toBeGreaterThanOrEqual(8);
  expect(panel.y + panel.height).toBeLessThanOrEqual(809);
  expect(mode.height).toBeGreaterThanOrEqual(58);
  expect(entry.y - (mode.y + mode.height)).toBeLessThanOrEqual(18);
  expect(composer.height).toBeGreaterThanOrEqual(54);
  expect(composer.x - panel.x).toBeGreaterThanOrEqual(10);
  expect(panel.x + panel.width - (composer.x + composer.width)).toBeGreaterThanOrEqual(10);
  await expect(page.locator('#pz13-advisor-entry .cfr-praziarnicka-entry-photo')).toBeVisible();
  await page.screenshot({ path: `${artifacts}/praziarnicka-chat.png` });
});

test('Jolka remains the reference: separated selection card, readable back/progress, larger photos and no supplier note', async ({ page }) => {
  const demo = demos.jolka;
  await openDemo(page, demo);
  await selectMode(page, demo.chat);

  const mode = await metrics(page, '.mode');
  const entry = await metrics(page, '.entry');
  expect(mode.height).toBeGreaterThanOrEqual(58);
  expect(entry.y - (mode.y + mode.height)).toBeGreaterThanOrEqual(8);
  expect(await page.locator('.widget__note').count()).toBe(0);

  await selectMode(page, demo.advisor);
  const disabledBack = page.locator('#back');
  const opacity = await disabledBack.evaluate((node) => Number.parseFloat(getComputedStyle(node).opacity));
  expect(opacity).toBeGreaterThanOrEqual(0.65);
  const firstVisual = await metrics(page, '.option__visual');
  expect(firstVisual.height).toBeGreaterThanOrEqual(120);
  const copyColor = await page.locator('.option__copy small').first().evaluate((node) => getComputedStyle(node).color);
  expect(copyColor).not.toMatch(/rgba\([^)]*,\s*0\)/);
  await page.screenshot({ path: `${artifacts}/jolka-advisor.png` });
});

test('Kaffa is inset, compact, correctly ordered and photo-led', async ({ page }) => {
  const demo = demos.kaffa;
  await openDemo(page, demo);
  await selectMode(page, demo.chat);

  const panel = await metrics(page, demo.panel);
  const mode = await metrics(page, '.kf-switch');
  const entry = await metrics(page, '.kf-advisor-entry');
  const greeting = await metrics(page, '.kf-chat-seed .kf-message.bot');
  const composer = await metrics(page, '.kf-composer');

  expect(panel.y).toBeGreaterThanOrEqual(8);
  expect(panel.y + panel.height).toBeLessThanOrEqual(809);
  expect(panel.height).toBeLessThanOrEqual(650);
  expect(mode.height).toBeGreaterThanOrEqual(56);
  expect(entry.y - (mode.y + mode.height)).toBeLessThanOrEqual(16);
  expect(greeting.y - (entry.y + entry.height)).toBeLessThanOrEqual(16);
  expect(composer.x - panel.x).toBeGreaterThanOrEqual(12);
  expect(panel.x + panel.width - (composer.x + composer.width)).toBeGreaterThanOrEqual(12);

  await selectMode(page, demo.advisor);
  const photos = page.locator('.kf-option .cfr-option-photo');
  await expect(photos).toHaveCount(4);
  const sources = await photos.evaluateAll((nodes) => nodes.map((node) => node.getAttribute('src')));
  expect(new Set(sources).size).toBe(4);
  const stage = page.locator('.kf-stage');
  const scrollDelta = await stage.evaluate((node) => node.scrollHeight - node.clientHeight);
  expect(scrollDelta).toBeLessThanOrEqual(8);
  await page.screenshot({ path: `${artifacts}/kaffa-advisor.png` });
});

test('Concept has official cropped mark, orange-to-blue launcher, smooth switch, visible bot bubble and unclipped advisor selection', async ({ page }) => {
  const demo = demos.concept;
  await page.setViewportSize({ width: 568, height: 809 });
  await page.goto(`${baseURL}${demo.url}`, { waitUntil: 'domcontentloaded' });
  await waitReady(page, demo.slug);

  const launcher = page.locator(demo.launcher);
  await expect(launcher.locator('.cfr-concept-launcher-crop img[src*="concept-official-logo"]')).toBeVisible();
  expect(await launcher.evaluate((node) => getComputedStyle(node).backgroundColor)).toBe('rgb(223, 99, 69)');
  await launcher.hover();
  await page.waitForTimeout(330);
  expect(await launcher.evaluate((node) => getComputedStyle(node).backgroundColor)).toBe('rgb(39, 83, 165)');

  await launcher.click({ force: true });
  await selectMode(page, demo.chat);
  const panel = await metrics(page, demo.panel);
  const mode = await metrics(page, '.mode');
  expect(panel.y).toBeGreaterThanOrEqual(8);
  expect(panel.y + panel.height).toBeLessThanOrEqual(809);
  expect(mode.height).toBeGreaterThanOrEqual(56);
  await expect(page.locator('.message__avatar .cfr-concept-mark-crop img[src*="concept-official-logo"]').first()).toBeVisible();
  const bubble = page.locator('.message:not(.message--user) .bubble').first();
  await expect(bubble).toBeVisible();
  expect(Number.parseFloat(await bubble.evaluate((node) => getComputedStyle(node).borderTopWidth))).toBeGreaterThanOrEqual(1);
  const composer = await metrics(page, '.composer__shell');
  expect(composer.height).toBeGreaterThanOrEqual(52);
  expect(composer.x - panel.x).toBeGreaterThanOrEqual(12);
  expect(panel.x + panel.width - (composer.x + composer.width)).toBeGreaterThanOrEqual(12);

  const indicatorBefore = await metrics(page, '.mode__indicator');
  await selectMode(page, demo.advisor);
  const indicatorAfter = await metrics(page, '.mode__indicator');
  expect(indicatorAfter.x - indicatorBefore.x).toBeGreaterThan(mode.width * 0.35);
  await expect(page.locator('#stepName')).toBeHidden();
  await expect(page.locator('.question__kicker')).toBeHidden();

  const advisor = page.locator('#advisorBody');
  const firstOption = page.locator('#advisorBody .option').first();
  const advisorBox = await advisor.boundingBox();
  const optionBox = await firstOption.boundingBox();
  expect(optionBox.y).toBeGreaterThanOrEqual(advisorBox.y);
  await firstOption.click({ force: true });
  await page.waitForTimeout(80);
  const selectedShadow = await firstOption.evaluate((node) => getComputedStyle(node).boxShadow);
  expect(selectedShadow).not.toBe('none');
  await page.waitForTimeout(320);

  for (let step = 1; step < 4; step += 1) {
    await page.locator('#advisorBody .option').first().click({ force: true });
    await page.waitForTimeout(360);
  }
  await expect(page.locator('.result-main__copy h3')).toBeVisible();
  expect(await page.locator('.result-main__copy h3').evaluate((node) => Number.parseFloat(getComputedStyle(node).fontSize))).toBeGreaterThanOrEqual(22);
  await page.screenshot({ path: `${artifacts}/concept-result.png` });
});

test('Victory has a large official logo, corrected shell and real photo choices', async ({ page }) => {
  const demo = demos.vitazov;
  await page.setViewportSize({ width: 568, height: 809 });
  await page.goto(`${baseURL}${demo.url}`, { waitUntil: 'domcontentloaded' });
  await waitReady(page, demo.slug);

  await expect(page.locator('#openWidget .cfr-vitazov-launcher-logo')).toBeVisible();
  await page.locator(demo.launcher).click({ force: true });
  const logo = page.locator('.widget-brand .cfr-vitazov-header-logo');
  await expect(logo).toBeVisible();
  expect((await metrics(page, '.widget-brand .cfr-vitazov-header-logo')).height).toBeGreaterThanOrEqual(48);

  await selectMode(page, demo.chat);
  await expect(page.locator('#openAdvisor .cfr-vitazov-entry-photo')).toBeVisible();
  expect((await metrics(page, '.mode')).height).toBeGreaterThanOrEqual(56);
  expect((await metrics(page, '.composer')).height).toBeGreaterThanOrEqual(52);
  await expect(page.locator('.message__avatar .cfr-vitazov-avatar-logo').first()).toBeVisible();

  await selectMode(page, demo.advisor);
  const photos = page.locator('#advisorBody .option .cfr-vitazov-photo');
  await expect(photos).toHaveCount(4);
  const sources = await photos.evaluateAll((nodes) => nodes.map((node) => node.getAttribute('src')));
  expect(new Set(sources).size).toBe(4);
  const advisorDelta = await page.locator('#advisorBody').evaluate((node) => node.scrollHeight - node.clientHeight);
  expect(advisorDelta).toBeLessThanOrEqual(8);
  await page.screenshot({ path: `${artifacts}/vitazov-advisor.png` });
});

test('Diamonds keeps the repaired light shell and larger switch', async ({ page }) => {
  const demo = demos.diamonds;
  await openDemo(page, demo);
  await selectMode(page, demo.chat);
  expect((await metrics(page, '.mode-switch')).height).toBeGreaterThanOrEqual(56);
  await expect(page.locator('.widget-logo img[src*="diroastery-logo"]')).toBeVisible();
  expect(await page.locator('#widget').evaluate((node) => getComputedStyle(node).backgroundColor)).toBe('rgb(255, 255, 255)');
  await page.screenshot({ path: `${artifacts}/diamonds-chat.png` });
});