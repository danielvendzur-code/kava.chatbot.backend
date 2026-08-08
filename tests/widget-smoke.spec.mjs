import { test, expect } from '@playwright/test';
import fs from 'node:fs';

const baseURL = process.env.BASE_URL || 'http://127.0.0.1:4173';
// Jolka is not here on purpose: it runs on its own entry point (jolka.html) and is
// covered by tests/jolka.spec.mjs. Everything below exercises the shared v8 engine.
const demos = [
  ['praziarnicka', 'Pražiarnička'],
  ['diamonds', 'Diamonds Roastery'],
  ['kaffa', 'Kaffa Roastery'],
  ['vitazov', 'Káva Víťazov'],
  ['concept', 'Concept Coffee Roasters']
];

fs.mkdirSync('artifacts', { recursive: true });

function watchConsole(page) {
  const failures = [];
  page.on('console', (message) => {
    if (message.type() === 'error') failures.push(message.text());
  });
  page.on('pageerror', (error) => failures.push(error.message));
  return failures;
}

async function openAdvisor(page) {
  await page.locator('#openWidget').click();
  await expect(page.locator('#widget')).toHaveClass(/is-open/);
  await page.locator('[data-mode="advisor"]').click();
  await expect(page.locator('#advisorScreen')).toHaveClass(/is-active/);
}

async function choose(page, value, nextStep) {
  const option = page.locator(`.option[data-value="${value}"]`);
  const title = option.locator('.option__copy b');
  const text = (await title.textContent()).trim();
  await option.click();
  await expect(option).toHaveClass(/is-selected/);
  await expect(title).toBeVisible();
  await expect(title).toHaveText(text);
  await page.waitForTimeout(720);
  if (nextStep) await expect(page.locator('#stepLabel')).toHaveText(nextStep);
}

test('one-screen proposal, round launcher and complete recommendation flow', async ({ page }) => {
  const errors = watchConsole(page);
  await page.setViewportSize({ width: 1440, height: 960 });
  await page.goto(`${baseURL}/?demo=praziarnicka`, { waitUntil: 'networkidle' });

  await expect(page.locator('h1')).toContainText('Pomôžte zákazníkovi');
  await expect(page.locator('.demo-benefit')).toHaveCount(3);
  expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBeLessThanOrEqual(960);

  const launcher = page.locator('.launcher__button');
  const launcherBox = await launcher.boundingBox();
  expect(Math.abs(launcherBox.width - launcherBox.height)).toBeLessThan(1);
  await expect(launcher).toHaveCSS('border-radius', '50%');

  await page.waitForTimeout(1450);
  await expect(page.locator('#launcherTeaser')).toHaveClass(/is-visible/);
  const teaserBox = await page.locator('#launcherTeaser').boundingBox();
  expect(teaserBox.y + teaserBox.height).toBeLessThan(launcherBox.y);
  await page.screenshot({ path: 'artifacts/coffee-v8-desktop-landing.png', fullPage: true });

  await page.locator('#openWidget').click();
  await expect(page.locator('.support-row a')).toHaveCount(3);
  await expect(page.locator('.chips .chip')).toHaveCount(4);
  await expect(page.locator('#widget')).toHaveCSS('border-radius', '34px');

  const chip = page.locator('.chip').first();
  const chipLabel = chip.locator('span');
  const chipText = (await chipLabel.textContent()).trim();
  await chip.click();
  await page.waitForTimeout(520);
  await expect(chipLabel).toBeVisible();
  await expect(chipLabel).toHaveText(chipText);
  await page.screenshot({ path: 'artifacts/coffee-v8-desktop-chat.png' });

  await page.locator('[data-mode="advisor"]').click();
  await expect(page.locator('.option')).toHaveCount(4);
  await expect(page.locator('.option__photo')).toHaveCount(4);
  const delays = await page.locator('.option').evaluateAll((nodes) => nodes.map((node) => getComputedStyle(node).animationDelay));
  expect(new Set(delays).size).toBeGreaterThan(1);

  await choose(page, 'automatic', '2 / 4');
  await choose(page, 'chocolate', '3 / 4');
  await choose(page, 'milk', '4 / 4');
  await choose(page, 'classic', null);

  await expect(page.locator('.result-card')).toBeVisible();
  await expect(page.locator('.result-product h3')).not.toBeEmpty();
  await page.screenshot({ path: 'artifacts/coffee-v8-desktop-result.png' });

  await page.locator('#choosePack').click();
  await page.locator('.choice-card[data-weight="500"]').click();
  await page.locator('.grind[data-grind="espresso"]').click();
  await expect(page.locator('#checkout')).toBeEnabled();
  await page.locator('#checkout').click();
  await expect(page.locator('.success h2')).toHaveText('Výber je pripravený');
  expect(errors).toEqual([]);
});

test('all routed v8 demos are personalized and use the same system', async ({ page }) => {
  for (const [slug, brand] of demos) {
    await page.goto(`${baseURL}/?demo=${slug}`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('.demo-brand__copy strong')).toHaveText(brand);
    await expect(page.locator('.owner-note')).toContainText('Dobrý deň');
    await expect(page.locator('.preview-answer strong')).not.toBeEmpty();
    await expect(page.locator('.widget-brand__copy strong')).toHaveText(brand);
  }
});

test('mobile widget stays rounded, opaque and does not open the keyboard', async ({ page }) => {
  const errors = watchConsole(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${baseURL}/?demo=concept`, { waitUntil: 'networkidle' });
  await openAdvisor(page);

  const panelBox = await page.locator('#widget').boundingBox();
  expect(panelBox.x).toBeGreaterThanOrEqual(7);
  expect(panelBox.width).toBeLessThanOrEqual(375);
  await expect(page.locator('#widget')).toHaveCSS('border-radius', '28px');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  expect(await page.evaluate(() => document.activeElement?.id)).not.toBe('chatInput');
  await expect(page.locator('.option')).toHaveCount(4);
  await page.locator('.option').first().click();
  await expect(page.locator('.option.is-selected .option__copy b')).toBeVisible();
  await page.screenshot({ path: 'artifacts/coffee-v8-mobile-advisor.png' });
  expect(errors).toEqual([]);
});
