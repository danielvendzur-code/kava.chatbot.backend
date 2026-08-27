import { test, expect } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const baseURL = process.env.BASE_URL || 'http://127.0.0.1:4173';
const artifacts = 'artifacts/final-polish-2026-08-27';
mkdirSync(artifacts, { recursive: true });

async function waitReady(page, slug) {
  if (slug === 'jolka') {
    await page.waitForFunction(() => document.body.dataset.coffeeFinal === 'jolka');
  } else {
    await page.waitForFunction(() => document.documentElement.dataset.coffeeFinalPolish === '2026-08-27');
  }
}

async function openDemo(page, demo, viewport = { width: 568, height: 809 }) {
  await page.setViewportSize(viewport);
  await page.goto(`${baseURL}${demo.url}`, { waitUntil: 'networkidle' });
  await waitReady(page, demo.slug);
  await page.locator(demo.launcher).click({ force: true });
  await expect(page.locator(demo.panel)).toBeVisible();
}

async function selectMode(page, selector) {
  await page.locator(selector).click({ force: true });
  await page.waitForTimeout(80);
}

async function metrics(page, selector) {
  const box = await page.locator(selector).first().boundingBox();
  expect(box, `${selector} must have a rendered box`).not.toBeNull();
  return box;
}

const demos = {
  praziarnicka: {
    slug: 'praziarnicka', url: '/?demo=praziarnicka', launcher: '#pz13-open', panel: '#pz13-widget',
    chat: '.pz13-mode button[data-mode="chat"]', advisor: '.pz13-mode button[data-mode="advisor"]'
  },
  jolka: {
    slug: 'jolka', url: '/jolka.html', launcher: '#open', panel: '#widget',
    chat: '.mode__button[data-mode="chat"]', advisor: '.mode__button[data-mode="advisor"]'
  },
  kaffa: {
    slug: 'kaffa', url: '/?demo=kaffa', launcher: '#launcher', panel: '.kf-panel',
    chat: '.kf-switch button[data-view="chat"]', advisor: '.kf-switch button[data-view="advisor"]'
  },
  concept: {
    slug: 'concept', url: '/?demo=concept', launcher: '#openWidget', panel: '#widget',
    chat: '.mode__button[data-mode="chat"]', advisor: '.mode__button[data-mode="advisor"]'
  },
  vitazov: {
    slug: 'vitazov', url: '/?demo=vitazov', launcher: '#openWidget', panel: '#widget',
    chat: '.mode__button[data-mode="chat"]', advisor: '.mode__button[data-mode="advisor"]'
  },
  diamonds: {
    slug: 'diamonds', url: '/?demo=diamonds', launcher: '#launcherButton', panel: '#widget',
    chat: '.mode-switch button[data-mode="chat"]', advisor: '.mode-switch button[data-mode="advisor"]'
  }
};

test('Praziarnicka is the compact reference: larger switch, photo CTA and polished composer', async ({ page }) => {
  const demo = demos.praziarnicka;
  await openDemo(page, demo);
  await selectMode(page, demo.chat);

  const panel = await metrics(page, demo.panel);
  const mode = await metrics(page, '.pz13-mode');
  const entry = await metrics(page, '#pz13-advisor-entry');
  const composer = await metrics(page, '.pz13-composer');

  expect(panel.y).toBeGreaterThanOrEqual(8);
  expect(panel.y + panel.height).toBeLessThanOrEqual(809);
  expect(mode.height).toBeGreaterThanOrEqual(54);
  expect(entry.y - (mode.y + mode.height)).toBeLessThanOrEqual(18);
  expect(composer.height).toBeGreaterThanOrEqual(52);
  expect(composer.x - panel.x).toBeGreaterThanOrEqual(10);
  expect(panel.x + panel.width - (composer.x + composer.width)).toBeGreaterThanOrEqual(10);
  await expect(page.locator('#pz13-advisor-entry .cfp-praziarnicka-entry-photo')).toBeVisible();

  await page.screenshot({ path: `${artifacts}/praziarnicka-chat.png` });
});

test('Jolka remains the reference: large switch, separated entry, readable advisor and no supplier note', async ({ page }) => {
  const demo = demos.jolka;
  await openDemo(page, demo);
  await selectMode(page, demo.chat);

  const mode = await metrics(page, '.mode');
  const entry = await metrics(page, '.entry');
  expect(mode.height).toBeGreaterThanOrEqual(56);
  expect(entry.y - (mode.y + mode.height)).toBeGreaterThanOrEqual(8);
  expect(await page.locator('.widget__note').count()).toBe(0);

  await selectMode(page, demo.advisor);
  const disabledBack = page.locator('#back');
  const opacity = await disabledBack.evaluate((node) => Number.parseFloat(getComputedStyle(node).opacity));
  expect(opacity).toBeGreaterThanOrEqual(0.65);
  const firstVisual = await metrics(page, '.option__visual');
  expect(firstVisual.height).toBeGreaterThanOrEqual(110);
  const copyColor = await page.locator('.option__copy small').first().evaluate((node) => getComputedStyle(node).color);
  expect(copyColor).not.toMatch(/rgba\([^)]*,\s*0\)/);

  await page.screenshot({ path: `${artifacts}/jolka-advisor.png` });
});

test('Kaffa is inset, ordered correctly and every first-step choice has a real photo', async ({ page }) => {
  const demo = demos.kaffa;
  await openDemo(page, demo);
  await selectMode(page, demo.chat);

  const panel = await metrics(page, demo.panel);
  const mode = await metrics(page, '.kf-switch');
  const entry = await metrics(page, '.kf-advisor-entry');
  const greeting = await metrics(page, '.kf-chat-seed .kf-message.bot');
  const footer = await metrics(page, '.kf-chat-footer');
  const composer = await metrics(page, '.kf-composer');

  expect(panel.y).toBeGreaterThanOrEqual(8);
  expect(panel.y + panel.height).toBeLessThanOrEqual(809);
  expect(mode.height).toBeGreaterThanOrEqual(54);
  expect(entry.y - (mode.y + mode.height)).toBeLessThanOrEqual(18);
  expect(greeting.y - (entry.y + entry.height)).toBeLessThanOrEqual(18);
  expect(footer.x - panel.x).toBeGreaterThanOrEqual(0);
  expect(composer.x - panel.x).toBeGreaterThanOrEqual(12);
  expect(panel.x + panel.width - (composer.x + composer.width)).toBeGreaterThanOrEqual(12);

  await selectMode(page, demo.advisor);
  const photos = page.locator('.kf-option .cfp-option-photo');
  await expect(photos).toHaveCount(4);
  const sources = await photos.evaluateAll((nodes) => nodes.map((node) => node.getAttribute('src')));
  expect(new Set(sources).size).toBe(4);
  const stage = page.locator('.kf-stage');
  const scrollDelta = await stage.evaluate((node) => node.scrollHeight - node.clientHeight);
  expect(scrollDelta).toBeLessThanOrEqual(5);

  await page.screenshot({ path: `${artifacts}/kaffa-advisor.png` });
});

test('Concept uses orange-to-blue brand launcher, round logo avatar and clean advisor hierarchy', async ({ page }) => {
  const demo = demos.concept;
  await page.setViewportSize({ width: 568, height: 809 });
  await page.goto(`${baseURL}${demo.url}`, { waitUntil: 'networkidle' });
  await waitReady(page, demo.slug);

  const launcher = page.locator(demo.launcher);
  await expect(launcher.locator('img.cfp-concept-launcher-logo')).toBeVisible();
  const basePaint = await launcher.evaluate((node) => getComputedStyle(node).backgroundColor);
  expect(basePaint).toBe('rgb(223, 99, 69)');
  await launcher.hover();
  await page.waitForTimeout(300);
  const hoverPaint = await launcher.evaluate((node) => getComputedStyle(node).backgroundColor);
  expect(hoverPaint).toBe('rgb(36, 63, 136)');

  await launcher.click({ force: true });
  await selectMode(page, demo.chat);
  const mode = await metrics(page, '.mode');
  expect(mode.height).toBeGreaterThanOrEqual(54);
  const avatar = page.locator('.message__avatar').first();
  await expect(avatar.locator('img[src*="concept-official-logo"]')).toBeVisible();
  const avatarBox = await avatar.boundingBox();
  const radius = await avatar.evaluate((node) => Number.parseFloat(getComputedStyle(node).borderRadius));
  expect(radius).toBeGreaterThanOrEqual(avatarBox.width / 2 - 2);
  const bubbleBorder = await page.locator('.message:not(.message--user) .bubble').first().evaluate((node) => getComputedStyle(node).borderTopWidth);
  expect(Number.parseFloat(bubbleBorder)).toBeGreaterThanOrEqual(1);
  const composer = await metrics(page, '.composer__shell');
  const panel = await metrics(page, demo.panel);
  expect(composer.x - panel.x).toBeGreaterThanOrEqual(12);
  expect(panel.x + panel.width - (composer.x + composer.width)).toBeGreaterThanOrEqual(12);

  await selectMode(page, demo.advisor);
  await expect(page.locator('.question__kicker')).toBeHidden();
  const advisor = page.locator('#advisorBody');
  const firstOption = page.locator('#advisorBody .option').first();
  await expect(firstOption).toBeVisible();
  const advisorBox = await advisor.boundingBox();
  const optionBox = await firstOption.boundingBox();
  expect(optionBox.y).toBeGreaterThanOrEqual(advisorBox.y - 1);

  for (let step = 0; step < 4; step += 1) {
    await page.locator('#advisorBody .option').first().click({ force: true });
    await page.waitForTimeout(380);
  }
  await expect(page.locator('.result-main__copy h3')).toBeVisible();
  const resultFont = await page.locator('.result-main__copy h3').evaluate((node) => Number.parseFloat(getComputedStyle(node).fontSize));
  expect(resultFont).toBeGreaterThanOrEqual(20);

  await page.screenshot({ path: `${artifacts}/concept-result.png` });
});

test('Victory uses the official logo everywhere and photo-led advisor cards', async ({ page }) => {
  const demo = demos.vitazov;
  await page.setViewportSize({ width: 568, height: 809 });
  await page.goto(`${baseURL}${demo.url}`, { waitUntil: 'networkidle' });
  await waitReady(page, demo.slug);

  await expect(page.locator('#openWidget .cfp-vitazov-launcher-logo')).toBeVisible();
  await page.locator(demo.launcher).click({ force: true });
  await expect(page.locator('.widget-brand .cfp-vitazov-header-logo')).toBeVisible();
  const headerLogo = await metrics(page, '.widget-brand .cfp-vitazov-header-logo');
  expect(headerLogo.height).toBeGreaterThanOrEqual(44);

  await selectMode(page, demo.chat);
  await expect(page.locator('#openAdvisor .cfp-vitazov-entry-photo')).toBeVisible();
  const mode = await metrics(page, '.mode');
  expect(mode.height).toBeGreaterThanOrEqual(54);
  const composer = await metrics(page, '.composer');
  expect(composer.height).toBeGreaterThanOrEqual(50);

  await selectMode(page, demo.advisor);
  const photos = page.locator('#advisorBody .option .cfp-vitazov-photo');
  await expect(photos).toHaveCount(4);
  const sources = await photos.evaluateAll((nodes) => nodes.map((node) => node.getAttribute('src')));
  expect(new Set(sources).size).toBe(4);

  await page.screenshot({ path: `${artifacts}/vitazov-advisor.png` });
});

test('Diamonds keeps the repaired light premium shell and larger smooth switch', async ({ page }) => {
  const demo = demos.diamonds;
  await openDemo(page, demo);
  await selectMode(page, demo.chat);
  const mode = await metrics(page, '.mode-switch');
  expect(mode.height).toBeGreaterThanOrEqual(54);
  await expect(page.locator('.widget-logo img[src*="diroastery-logo"]')).toBeVisible();
  const panelBackground = await page.locator('#widget').evaluate((node) => getComputedStyle(node).backgroundColor);
  expect(panelBackground).toBe('rgb(255, 255, 255)');
  await page.screenshot({ path: `${artifacts}/diamonds-chat.png` });
});
