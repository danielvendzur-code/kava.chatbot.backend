import { test, expect } from '@playwright/test';
import fs from 'node:fs';

const baseURL = process.env.BASE_URL || 'http://127.0.0.1:4173';
const PZ = `${baseURL}/?demo=praziarnicka`;
fs.mkdirSync('artifacts', { recursive: true });

async function ready(page) {
  await page.goto(PZ, { waitUntil:'networkidle' });
  await page.waitForFunction(() => document.documentElement.dataset.demoReady === 'true');
}

function center(box) { return box.x + box.width / 2; }

test('Praziarnicka background reads as the branded customer website', async ({ page }) => {
  await page.setViewportSize({ width:1366, height:768 });
  await ready(page);

  await expect(page.locator('.pz13-site-logo img')).toHaveAttribute('src', '/brand/praziarnicka-logo-official.png');
  await expect(page.locator('.pz13-site-hero')).toBeVisible();
  await expect(page.locator('.pz13-site-copy')).toContainText('Vitajte v Pražiarničke');
  await expect(page.locator('.pz13-site-copy')).toContainText('Prémiová kvalita');
  await expect(page.locator('.pz13-site-products')).toContainText('Naša ponuka', { ignoreCase:true });
  await expect(page.locator('.pz13-site-product')).toHaveCount(4);
  await expect(page.locator('.pz13-proof > div')).toHaveCount(4);
  await expect(page.locator('body')).not.toContainText('AKO TO FUNGUJE PRE ZÁKAZNÍKA');
  await expect(page.locator('body')).not.toContainText('PROBLÉM');

  const size = await page.evaluate(() => ({ h:document.scrollingElement.scrollHeight, ih:innerHeight, w:document.scrollingElement.scrollWidth, iw:innerWidth }));
  expect(size.h).toBeLessThanOrEqual(size.ih + 1);
  expect(size.w).toBeLessThanOrEqual(size.iw + 1);
  await page.screenshot({ path:'artifacts/final-praziarnicka-site-1366x768.png', fullPage:true });
});

test('initial chat puts find-your-coffee above the welcome message and switch centered at bottom', async ({ page }) => {
  await page.setViewportSize({ width:390, height:844 });
  await ready(page);
  await page.locator('#pz13-open').click();
  await expect(page.locator('#pz13-widget')).toHaveClass(/is-open/);

  const advisor = page.locator('.pz13-advisor-entry');
  const welcome = page.locator('.pz13-message--assistant .pz13-bubble').first();
  await expect(advisor).toBeVisible();
  await expect(welcome).toBeVisible();
  const advisorBox = await advisor.boundingBox();
  const welcomeBox = await welcome.boundingBox();
  expect(advisorBox.y + advisorBox.height).toBeLessThan(welcomeBox.y + 3);

  const panel = await page.locator('#pz13-widget').boundingBox();
  const switchBox = await page.locator('.pz13-mode').boundingBox();
  expect(Math.abs(center(panel) - center(switchBox))).toBeLessThanOrEqual(2);
  expect(switchBox.y).toBeGreaterThan(panel.y + panel.height * .78);
  await expect(page.locator('.pz13-mode button')).toHaveCount(2);
  await expect(page.locator('.pz13-mode button[data-mode="chat"]')).toHaveClass(/is-active/);

  const composer = await page.locator('.pz13-composer').boundingBox();
  expect(composer.y + composer.height).toBeLessThanOrEqual(switchBox.y + 1);
  await page.screenshot({ path:'artifacts/final-praziarnicka-mobile-chat.png', fullPage:true });
});

test('after first message the advisor CTA and quick chips disappear but bottom switch remains', async ({ page }) => {
  await page.setViewportSize({ width:390, height:844 });
  await ready(page);
  await page.locator('#pz13-open').click();
  await page.locator('#pz13-input').fill('Káva do automatu');
  await page.locator('#pz13-input').press('Enter');

  await expect(page.locator('.pz13-message--user')).toContainText('Káva do automatu');
  await expect(page.locator('.pz13-advisor-entry')).toHaveCount(0);
  await expect(page.locator('.pz13-chip')).toHaveCount(0);
  await expect(page.locator('.pz13-mode')).toBeVisible();
  await page.locator('.pz13-mode button[data-mode="advisor"]').click();
  await expect(page.locator('.pz13-advisor')).toBeVisible();
});

test('preparation step has four different real images that remain on the selected card', async ({ page }) => {
  await page.setViewportSize({ width:571, height:813 });
  await ready(page);
  await page.locator('#pz13-open').click();
  await page.locator('.pz13-mode button[data-mode="advisor"]').click();

  const images = page.locator('.pz13-option__img');
  await expect(images).toHaveCount(4);
  const srcs = await images.evaluateAll(nodes => nodes.map(node => node.getAttribute('src')));
  expect(new Set(srcs).size).toBe(4);
  expect(srcs).toEqual(expect.arrayContaining([
    '/assets/praziarnicka/prep-automatic.webp',
    '/assets/praziarnicka/prep-lever.webp',
    '/assets/praziarnicka/prep-moka.webp',
    '/assets/praziarnicka/prep-filter.webp'
  ]));

  const first = page.locator('.pz13-option').first();
  await first.click();
  await expect(first).toHaveClass(/is-selected/);
  await expect(first.locator('.pz13-option__img')).toBeVisible();
  await page.screenshot({ path:'artifacts/final-praziarnicka-preparation-571x813.png', fullPage:true });
});
