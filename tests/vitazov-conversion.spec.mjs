import { test, expect } from '@playwright/test';

const baseURL = process.env.BASE_URL || 'http://127.0.0.1:4173';
const demo = (query = '') => `${baseURL}/?demo=vitazov${query}`;

async function expectOpen(page) {
  const widget = page.locator('#widget');
  await expect(widget).toHaveClass(/is-open/);
  await expect(widget).toHaveAttribute('aria-hidden', 'false');
  await expect(widget).toHaveCSS('transform', 'none');
}

async function choose(page, value, nextStep) {
  const option = page.locator(`.option[data-value="${value}"]`);
  await expect(option).toBeVisible();
  await option.click();
  if (nextStep) await expect(page.locator('#stepLabel')).toHaveText(nextStep);
  else await expect(page.locator('.result-head h2')).toBeVisible();
}

async function chooseOffice(page) {
  await choose(page, 'office', '2 z 4');
  await choose(page, 'classic', '3 z 4');
  await choose(page, 'milk', '4 z 4');
  await choose(page, 'caffeine', null);
}

async function chooseDiscovery(page) {
  await choose(page, 'discovery', '2 z 4');
  await choose(page, 'fruity', '3 z 4');
  await choose(page, 'black', '4 z 4');
  await choose(page, 'balanced', null);
}

test('landing is owner-facing, compact and photo-led', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(demo(), { waitUntil: 'domcontentloaded' });
  await expect(page.locator('h1')).toHaveText('Káva domov aj do firmy. Vybraná za minútu.');
  await expect(page.locator('.demo-copy > p')).toContainText('štyri krátke otázky');
  await expect(page.locator('.demo-benefit')).toHaveCount(3);
  await expect(page.locator('.demo-benefit').nth(0)).toContainText('Odpovie 24/7');
  await expect(page.locator('.demo-benefit').nth(1)).toContainText('Vyberie konkrétnu kávu');
  await expect(page.locator('.demo-benefit').nth(2)).toContainText('Zvýši objednávku');
  await expect(page.locator('.demo-tag')).toContainText('mojchatbot.sk');
  await expect(page.locator('.kv-official-logo')).toHaveAttribute('src', '/assets/vitazov-logo.svg');
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
  await expect(page.locator('.advisor-entry')).toHaveCount(1);
  await expect(page.locator('.advisor-entry')).toContainText('Nájsť svoju kávu');
  await expect(page.locator('.widget-credit')).toHaveCount(0);
  const chipBox = await page.locator('.chip').first().boundingBox();
  const entryBox = await page.locator('.advisor-entry').boundingBox();
  const switchBox = await page.locator('.mode').boundingBox();
  expect(chipBox.height).toBeGreaterThanOrEqual(40);
  expect(chipBox.height).toBeLessThanOrEqual(46);
  expect(entryBox.height).toBeLessThanOrEqual(70);
  expect(switchBox.height).toBeGreaterThanOrEqual(56);
  expect(await page.evaluate(() => document.activeElement?.id)).not.toBe('chatInput');
});

test('advisor follows use → profile → drink → intensity and selects Victory Blend at home', async ({ page }) => {
  await page.goto(demo('&qa=advisor'), { waitUntil: 'domcontentloaded' });
  await expectOpen(page);
  await expect(page.locator('#stepName')).toHaveText('Použitie');
  const semanticPhoto = page.locator('.option[data-value="home"] .option__photo .parity-choice-img');
  await expect(semanticPhoto).toBeVisible();
  await expect(semanticPhoto).toHaveAttribute('src', /\/assets\/jolka\/method\/(moka|automat|filter|black|milk|both|lever)\.webp/);
  await choose(page, 'home', '2 z 4');
  await expect(page.locator('#stepName')).toHaveText('Chuť');
  await choose(page, 'balanced', '3 z 4');
  await expect(page.locator('#stepName')).toHaveText('Nápoj');
  await choose(page, 'black', '4 z 4');
  await expect(page.locator('#stepName')).toHaveText('Sila');
  await choose(page, 'balanced', null);
  await expect(page.locator('.result-head h2')).toHaveText('Victory Blend');
});

test('office and decaf paths map the verified range', async ({ page }) => {
  await page.goto(demo('&qa=advisor'), { waitUntil: 'domcontentloaded' });
  await chooseOffice(page);
  await expect(page.locator('.result-head h2')).toHaveText('Office Blend');
  await expect(page.locator('.kv-final-actions a')).toHaveAttribute('href', 'https://kavavitazov.sk/espresso-blend/');
  await expect(page.locator('.office-followup')).toBeHidden();
  await expect(page.locator('.kv-final-upsell')).toBeVisible();

  await page.locator('#resetAll').click();
  await page.locator('[data-mode="advisor"]').click();
  await choose(page, 'home', '2 z 4');
  await choose(page, 'classic', '3 z 4');
  await choose(page, 'both', '4 z 4');
  await choose(page, 'decaf', null);
  await expect(page.locator('.result-head h2')).toHaveText('Bezkofeínová');
  await expect(page.locator('.kv-final-actions a')).toHaveAttribute('href', 'https://kavavitazov.sk/bezkofeinova-decaf/');
});

test('result shows three decisive detail rows and commerce actions', async ({ page }) => {
  await page.goto(demo('&qa=advisor'), { waitUntil: 'domcontentloaded' });
  await chooseOffice(page);
  await expect(page.locator('.product-visual .kv-result-photo img')).toHaveCount(1);
  await expect(page.locator('.result-detail')).toHaveCount(3);
  await expect(page.locator('.result-detail').nth(0).locator('small')).toHaveText('Komu sedí');
  await expect(page.locator('.result-detail').nth(1).locator('small')).toHaveText('Príprava');
  await expect(page.locator('.result-detail').nth(2).locator('small')).toHaveText('Chuť');
  await expect(page.locator('.reason')).toBeVisible();
  await expect(page.locator('.kv-final-packs')).toBeVisible();
  await expect(page.locator('.kv-final-upsell')).toBeVisible();
  await expect(page.locator('.kv-final-add')).toBeVisible();
  await expect(page.locator('.kv-next-best-action')).toHaveCount(0);
});

test('discovery path keeps one visible, relevant commerce upsell', async ({ page }) => {
  await page.goto(demo('&qa=advisor'), { waitUntil: 'domcontentloaded' });
  await chooseDiscovery(page);
  await expect(page.locator('.result-head h2')).toHaveText('Etiópia');
  await expect(page.locator('.kv-final-upsell')).toBeVisible();
  await expect(page.locator('.kv-final-upsell')).toContainText('Darčekové balenie');
  await expect(page.locator('.kv-next-best-action')).toBeHidden();
});

test('mobile, fallback and reduced motion remain robust', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto(demo('&qa=advisor'), { waitUntil: 'domcontentloaded' });
  await expectOpen(page);
  const panel = await page.locator('#widget').boundingBox();
  expect(panel.width).toBeLessThanOrEqual(390);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  const duration = await page.locator('.option').first().evaluate((node) => getComputedStyle(node).animationDuration);
  expect(['0s', '0.001s', '0.00001s', '1e-05s']).toContain(duration);

  await page.goto(demo('&qa=chat&apiError=1'), { waitUntil: 'domcontentloaded' });
  await page.locator('.chip').first().click();
  await expect(page.locator('.message--fallback')).toContainText('Overená lokálna odpoveď');
  await context.close();
});
