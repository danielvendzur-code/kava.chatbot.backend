import { test, expect } from '@playwright/test';

const baseURL = process.env.BASE_URL || 'http://127.0.0.1:4173';
const demo = (query = '') => `${baseURL}/?demo=vitazov${query}`;

async function expectOpen(page) {
  await expect(page.locator('#widget')).toHaveClass(/is-open/);
  await expect(page.locator('#widget')).toHaveAttribute('aria-hidden', 'false');
}

test('landing has real recommendation, valid teaser and no blank phone', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(demo(), { waitUntil: 'domcontentloaded' });
  await expect(page.locator('.demo-benefit')).toHaveCount(3);
  await expect(page.locator('.preview-panel')).toContainText('Office Blend');
  await expect(page.locator('#heroOpen')).toBeVisible();
  await expect(page.locator('button button')).toHaveCount(0);
  await expect(page.locator('a[href="tel:"]')).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBeLessThanOrEqual(900);
});

test('office, home and decaf presets return the intended verified product', async ({ page }) => {
  const scenarios = [
    ['office', 'Office Blend', 'https://kavavitazov.sk/espresso-blend/'],
    ['home', 'Victory Blend', 'https://kavavitazov.sk/blend-arabica/'],
    ['decaf', 'Bezkofeínová', 'https://kavavitazov.sk/bezkofeinova-decaf/']
  ];
  for (const [flow, product, href] of scenarios) {
    await page.goto(demo(`&qa=${flow}`), { waitUntil: 'domcontentloaded' });
    await expectOpen(page);
    await expect(page.locator('.result-head h2')).toHaveText(product);
    await expect(page.locator('.result-detail')).toHaveCount(3);
    await expect(page.locator('.result-button--primary')).toHaveAttribute('href', href);
  }
});

test('office follow-up is optional and does not block recommendation', async ({ page }) => {
  await page.goto(demo('&qa=office'), { waitUntil: 'domcontentloaded' });
  await expect(page.locator('.result-head h2')).toHaveText('Office Blend');
  await expect(page.locator('.office-followup')).toBeVisible();
  await page.locator('.usage-options button').nth(1).click();
  await expect(page.locator('.usage-options button.is-selected')).toHaveText('1–3 kg');
});

test('mobile flow keeps selected text, avoids keyboard focus and contains panel', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto(demo('&qa=advisor'), { waitUntil: 'domcontentloaded' });
  await expectOpen(page);
  expect(await page.evaluate(() => document.activeElement?.id)).not.toBe('chatInput');
  await expect(page.locator('#stepName')).toHaveText('Použitie');
  await expect(page.locator('.option')).toHaveCount(4);
  await page.locator('.option[data-value="home"]').click();
  await expect(page.locator('.option.is-selected .option__copy b')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(360);
});

test('back, reset, scroll lock and API fallback remain functional', async ({ page }) => {
  await page.goto(demo('&qa=home'), { waitUntil: 'domcontentloaded' });
  await page.locator('#prevBtn').click();
  await expect(page.locator('#stepLabel')).toHaveText('4 / 4');
  await expect(page.locator('.option.is-selected')).toHaveCount(1);
  await page.locator('#resetAll').click();
  await expect(page.locator('[data-mode="chat"]')).toHaveClass(/is-active/);
  expect(await page.evaluate(() => document.body.classList.contains('widget-open') && getComputedStyle(document.body).position === 'fixed')).toBe(true);

  await page.goto(demo('&qa=chat&apiError=1'), { waitUntil: 'domcontentloaded' });
  await page.locator('.chip').first().click();
  await expect(page.locator('.message--fallback')).toContainText('Overená lokálna odpoveď');
});

test('reduced motion remains usable', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto(demo('&qa=advisor'), { waitUntil: 'domcontentloaded' });
  const duration = await page.locator('.option').first().evaluate((node) => getComputedStyle(node).animationDuration);
  expect(['0s', '0.001s', '0.00001s', '1e-05s']).toContain(duration);
  await page.locator('.option[data-value="home"]').click();
  await expect(page.locator('#stepLabel')).toHaveText('2 / 4');
  await context.close();
});
