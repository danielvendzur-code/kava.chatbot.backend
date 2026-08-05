import { test, expect } from '@playwright/test';
import fs from 'node:fs';

const baseURL = process.env.BASE_URL || 'http://127.0.0.1:4173';
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
  await page.locator('#heroOpen').click();
  await expect(page.locator('#widget')).toHaveClass(/is-open/);
  await page.locator('[data-mode="advisor"]').click();
  await expect(page.locator('#advisorScreen')).toHaveClass(/is-active/);
}

async function chooseAndContinue(page, value) {
  const option = page.locator(`.option[data-value="${value}"]`);
  await option.click();
  await expect(option).toHaveClass(/is-selected/);
  await expect(option.locator('.option__copy b')).toBeVisible();
  await expect(option.locator('.option__copy small')).toBeVisible();
  await page.locator('#nextBtn').click();
}

test('desktop proposal and complete purchase recommendation flow', async ({ page }) => {
  const errors = watchConsole(page);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(baseURL, { waitUntil: 'networkidle' });

  await expect(page.locator('h1')).toContainText('Káva, ktorá sadne');
  await expect(page.locator('.product-strip__items button')).toHaveCount(5);
  await page.screenshot({ path: 'artifacts/praziarnicka-desktop-landing.png', fullPage: true });

  await page.locator('#openWidget').click();
  await expect(page.locator('.support-row a')).toHaveCount(3);
  await expect(page.locator('.chips .chip')).toHaveCount(4);

  const chip = page.locator('.chip').first();
  const chipLabel = chip.locator('span');
  const chipText = (await chipLabel.textContent()).trim();
  await chip.click();
  await expect(chipLabel).toBeVisible();
  await expect(chipLabel).toHaveText(chipText);
  await page.screenshot({ path: 'artifacts/praziarnicka-desktop-chat.png' });

  await page.locator('[data-mode="advisor"]').click();
  await chooseAndContinue(page, 'automatic');
  await chooseAndContinue(page, 'gentle');
  await chooseAndContinue(page, 'black');
  await chooseAndContinue(page, 'classic');

  await expect(page.locator('.result-card')).toBeVisible();
  await expect(page.locator('.result-product h3')).not.toBeEmpty();
  await page.screenshot({ path: 'artifacts/praziarnicka-desktop-result.png' });

  await page.locator('#choosePack').click();
  await page.locator('.weight[data-weight="500"]').click();
  await page.locator('.grind[data-grind="espresso"]').click();
  await expect(page.locator('#checkout')).toBeEnabled();
  await page.locator('#checkout').click();
  await expect(page.locator('.success h2')).toHaveText('Káva je pripravená');
  expect(errors).toEqual([]);
});

test('mobile widget is fullscreen, opaque, stable and does not summon keyboard', async ({ page }) => {
  const errors = watchConsole(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(baseURL, { waitUntil: 'networkidle' });
  await openAdvisor(page);

  const panelBox = await page.locator('#widget').boundingBox();
  expect(panelBox.x).toBe(0);
  expect(panelBox.width).toBeGreaterThanOrEqual(389);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  expect(await page.evaluate(() => document.activeElement?.id)).not.toBe('chatInput');
  await expect(page.locator('.proposal-page')).toHaveCSS('visibility', 'hidden');
  await expect(page.locator('#widget')).toHaveCSS('background-color', 'rgb(255, 253, 250)');

  await expect(page.locator('.option')).toHaveCount(4);
  await page.locator('.option').first().click();
  await expect(page.locator('.option.is-selected .option__copy b')).toBeVisible();
  await expect(page.locator('.option.is-selected .option__copy small')).toBeVisible();
  await page.waitForTimeout(80);
  await page.screenshot({ path: 'artifacts/praziarnicka-mobile-advisor.png' });
  expect(errors).toEqual([]);
});
