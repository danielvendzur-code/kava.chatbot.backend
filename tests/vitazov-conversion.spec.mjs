import { test, expect } from '@playwright/test';

const baseURL = process.env.BASE_URL || 'http://127.0.0.1:4173';
const demo = (query = '') => `${baseURL}/?demo=vitazov${query}`;

async function expectOpen(page) {
  await expect(page.locator('#widget')).toHaveClass(/is-open/);
  await expect(page.locator('#widget')).toHaveAttribute('aria-hidden', 'false');
}

async function choose(page, value, nextStep) {
  const option = page.locator(`.option[data-value="${value}"]`);
  await option.click();
  await expect(option).toHaveClass(/is-selected/);
  await expect(option.locator('.option__copy b')).toBeVisible();
  await page.waitForTimeout(500);
  if (nextStep) await expect(page.locator('#stepLabel')).toHaveText(nextStep);
}

test('landing is owner-facing, compact and photo-led', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(demo(), { waitUntil: 'domcontentloaded' });
  await expect(page.locator('h1')).toHaveText('Vitajte vo vašom návrhu AI poradcu pre Kávu Víťazov.');
  await expect(page.locator('.demo-copy > p')).toContainText('domov, do automatu aj kancelárie');
  await expect(page.locator('.demo-benefit')).toHaveCount(3);
  await expect(page.locator('.demo-benefit').nth(0)).toContainText('Menej váhania.');
  await expect(page.locator('.demo-benefit').nth(1)).toContainText('Konkrétna káva.');
  await expect(page.locator('.demo-benefit').nth(2)).toContainText('Domov aj firma.');
  await expect(page.locator('.demo-tag')).toBeHidden();
  await expect(page.locator('.kv-official-logo')).toHaveAttribute('src', /text-logo-tmave\.svg/);
  await expect(page.locator('.preview-panel')).toContainText('Office Blend');
  await expect(page.locator('.preview-pack .kv-preview-photo img')).toHaveCount(1);
  await expect(page.locator('#heroOpen')).toBeVisible();
  await expect(page.locator('button button')).toHaveCount(0);
  await expect(page.locator('a[href="tel:"]')).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBeLessThanOrEqual(900);
});

test('chat is customer-facing with stronger quick actions and no contact clutter', async ({ page }) => {
  await page.goto(demo('&qa=chat'), { waitUntil: 'domcontentloaded' });
  await expectOpen(page);
  await expect(page.locator('.message').first()).toContainText('Pomôžem vám vybrať kávu domov');
  await expect(page.locator('.chip')).toHaveCount(4);
  await expect(page.locator('.support-row')).toHaveCount(0);
  await expect(page.locator('.advisor-entry')).toHaveCount(0);
  const chipBox = await page.locator('.chip').first().boundingBox();
  const switchBox = await page.locator('.mode').boundingBox();
  expect(chipBox.height).toBeGreaterThanOrEqual(48);
  expect(switchBox.height).toBeGreaterThanOrEqual(60);
  expect(await page.evaluate(() => document.activeElement?.id)).not.toBe('chatInput');
});

test('advisor follows use → profile → drink → intensity and selects Victory Blend at home', async ({ page }) => {
  await page.goto(demo('&qa=advisor'), { waitUntil: 'domcontentloaded' });
  await expectOpen(page);
  await expect(page.locator('#stepName')).toHaveText('Použitie');
  const background = await page.locator('.option[data-value="home"] .option__icon').evaluate((node) => getComputedStyle(node).backgroundImage);
  expect(background).not.toBe('none');
  await choose(page, 'home', '2 / 4');
  await expect(page.locator('#stepName')).toHaveText('Chuť');
  await choose(page, 'balanced', '3 / 4');
  await choose(page, 'black', '4 / 4');
  await choose(page, 'balanced', null);
  await expect(page.locator('.result-head h2')).toHaveText('Victory Blend');
});

test('office and decaf paths map the verified range', async ({ page }) => {
  await page.goto(demo('&qa=advisor'), { waitUntil: 'domcontentloaded' });
  await choose(page, 'office', '2 / 4');
  await choose(page, 'classic', '3 / 4');
  await choose(page, 'milk', '4 / 4');
  await choose(page, 'caffeine', null);
  await expect(page.locator('.result-head h2')).toHaveText('Office Blend');
  await expect(page.locator('.result-button--primary')).toHaveAttribute('href', 'https://kavavitazov.sk/espresso-blend/');
  await expect(page.locator('.office-followup')).toBeVisible();

  await page.locator('#resetAll').click();
  await page.locator('[data-mode="advisor"]').click();
  await choose(page, 'home', '2 / 4');
  await choose(page, 'classic', '3 / 4');
  await choose(page, 'both', '4 / 4');
  await choose(page, 'decaf', null);
  await expect(page.locator('.result-head h2')).toHaveText('Bezkofeínová');
  await expect(page.locator('.result-button--primary')).toHaveAttribute('href', 'https://kavavitazov.sk/bezkofeinova-decaf/');
});

test('result is visually reduced to two secondary detail rows', async ({ page }) => {
  await page.goto(demo('&qa=office'), { waitUntil: 'domcontentloaded' });
  await expectOpen(page);
  await expect(page.locator('.product-visual .kv-result-photo img')).toHaveCount(1);
  await expect(page.locator('.result-detail').first()).toBeHidden();
  await expect(page.locator('.result-detail').nth(1)).toBeVisible();
  await expect(page.locator('.result-detail').nth(2)).toBeVisible();
  await expect(page.locator('.reason')).toBeVisible();
  await expect(page.locator('.result-button--primary')).toBeVisible();
});

test('mobile, fallback and reduced motion remain robust', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto(demo('&qa=advisor'), { waitUntil: 'domcontentloaded' });
  const panel = await page.locator('#widget').boundingBox();
  expect(panel.width).toBeLessThanOrEqual(374);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  const duration = await page.locator('.option').first().evaluate((node) => getComputedStyle(node).animationDuration);
  expect(['0s', '0.001s', '0.00001s', '1e-05s']).toContain(duration);

  await page.goto(demo('&qa=chat&apiError=1'), { waitUntil: 'domcontentloaded' });
  await page.locator('.chip').first().click();
  await expect(page.locator('.message--fallback')).toContainText('Overená lokálna odpoveď');
  await context.close();
});
