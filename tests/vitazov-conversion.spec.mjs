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

test('page behind the widget is the roastery shop, not a pitch for the chatbot', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(demo(), { waitUntil: 'domcontentloaded' });
  await expect(page.locator('h1')).toHaveText('Káva domov aj do firmy.');
  await expect(page.locator('.cs-hero__copy p')).toContainText('Pražíme na Slovensku');
  await expect(page.locator('.cs-logo img')).toHaveAttribute('src', '/assets/vitazov-logo.svg');
  await expect(page.locator('.cs-card')).toHaveCount(4);
  await expect(page.locator('.cs-card').first()).toContainText('od 15,90 €');
  await expect(page.locator('.cs-proof div')).toHaveCount(4);
  // Vendor copy about the advisor itself has no place on the shop's own page.
  await expect(page.locator('.diamonds-page, .demo-page')).not.toContainText('Odpovie 24/7');
  await expect(page.locator('.demo-benefit')).toHaveCount(0);
  await expect(page.locator('.parity-bottom')).toHaveCount(0);
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
  // Chips are compact pills that still hold readable copy.
  const chipBox = await page.locator('.chip').first().boundingBox();
  const entryBox = await page.locator('.advisor-entry').boundingBox();
  const switchBox = await page.locator('.mode').boundingBox();
  expect(chipBox.height).toBeGreaterThanOrEqual(36);
  expect(chipBox.height).toBeLessThanOrEqual(44);
  expect(chipBox.width).toBeLessThan(200);
  const chipSize = await page.locator('.chip').first().evaluate((n) => parseFloat(getComputedStyle(n).fontSize));
  expect(chipSize).toBeGreaterThanOrEqual(13);
  expect(entryBox.height).toBeLessThanOrEqual(70);
  expect(switchBox.height).toBeGreaterThanOrEqual(50);
  expect(await page.evaluate(() => document.activeElement?.id)).not.toBe('chatInput');
});

test('advisor follows use → profile → drink → intensity and selects Victory Blend at home', async ({ page }) => {
  await page.goto(demo('&qa=advisor'), { waitUntil: 'domcontentloaded' });
  await expectOpen(page);
  await expect(page.locator('#stepName')).toHaveText('Použitie');
  // Every answer is illustrated from Víťazov's own choice sprite. Jolka's
  // brewing photos used to be pasted over all of them, which meant the taste
  // step answered "čokoláda a orechy" with a picture of an espresso machine.
  const semanticPhoto = page.locator('.option[data-value="home"] .option__photo');
  await expect(semanticPhoto).toBeVisible();
  await expect(page.locator('.parity-choice-img')).toHaveCount(0);
  const sprite = await semanticPhoto.evaluate((n) => getComputedStyle(n).backgroundImage);
  expect(sprite).toContain('vitazov-choice-sprite');
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
  await expect(page.locator('.kv-final-cta')).toHaveAttribute('href', 'https://kavavitazov.sk/espresso-blend/');
  await expect(page.locator('.office-followup')).toBeHidden();

  await page.locator('#resetAll').click();
  await page.locator('[data-mode="advisor"]').click();
  await choose(page, 'home', '2 z 4');
  await choose(page, 'classic', '3 z 4');
  await choose(page, 'both', '4 z 4');
  await choose(page, 'decaf', null);
  await expect(page.locator('.result-head h2')).toHaveText('Bezkofeínová');
  await expect(page.locator('.kv-final-cta')).toHaveAttribute('href', 'https://kavavitazov.sk/bezkofeinova-decaf/');
});

test('result shows three decisive detail rows and one real closing action', async ({ page }) => {
  await page.goto(demo('&qa=advisor'), { waitUntil: 'domcontentloaded' });
  await chooseOffice(page);
  await expect(page.locator('.product-visual .kv-result-photo img')).toHaveCount(1);
  await expect(page.locator('.result-detail')).toHaveCount(3);
  await expect(page.locator('.result-detail').nth(0).locator('small')).toHaveText('Komu sedí');
  await expect(page.locator('.result-detail').nth(1).locator('small')).toHaveText('Príprava');
  await expect(page.locator('.result-detail').nth(2).locator('small')).toHaveText('Chuť');
  // The taste row used to print the raw scoring token ("classic").
  await expect(page.locator('.result-detail').nth(2)).not.toContainText(/^(classic|balanced|fruity|strong|decaf)$/);
  await expect(page.locator('.reason')).toBeVisible();
  // The pack picker, gift-box upsell and add-to-cart button never reached a
  // basket; one link to the real product replaces them.
  await expect(page.locator('.kv-final-packs')).toHaveCount(0);
  await expect(page.locator('.kv-final-upsell')).toHaveCount(0);
  await expect(page.locator('.kv-final-add')).toHaveCount(0);
  await expect(page.locator('.kv-final-cta')).toBeVisible();
  await expect(page.locator('.kv-final-cta')).toContainText('Pozrieť produkt v e-shope');
  await expect(page.locator('.kv-next-best-action')).toHaveCount(0);
});

test('discovery path ends on the discovered product, with no simulated basket', async ({ page }) => {
  await page.goto(demo('&qa=advisor'), { waitUntil: 'domcontentloaded' });
  await chooseDiscovery(page);
  await expect(page.locator('.result-head h2')).toHaveText('Etiópia');
  await expect(page.locator('.kv-final-cta')).toHaveAttribute('href', 'https://kavavitazov.sk/prazena-kava-etiopia/');
  await expect(page.locator('.kv-final-upsell')).toHaveCount(0);
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
  // The reply still arrives from the verified catalogue when the API is down;
  // it just no longer announces its own plumbing to the customer.
  await expect(page.locator('.message--fallback')).toBeVisible();
  await expect(page.locator('.message--fallback')).not.toContainText('Overená lokálna odpoveď');
  await expect(page.locator('.message--fallback time, .message--fallback small')).toHaveCount(0);
  await context.close();
});
