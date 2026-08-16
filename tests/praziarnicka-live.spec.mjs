import { test, expect } from '@playwright/test';
import fs from 'node:fs';

const baseURL = process.env.BASE_URL || 'http://127.0.0.1:4173';
const PZ = `${baseURL}/?demo=praziarnicka`;
fs.mkdirSync('artifacts', { recursive:true });

async function ready(page) {
  await page.goto(PZ, { waitUntil:'domcontentloaded' });
  await page.waitForFunction(() => document.documentElement.dataset.demoReady === 'true');
  await page.waitForFunction(() => document.documentElement.dataset.coffeeRelease === 'client-ready');
  await page.waitForFunction(() => document.querySelector('.mc-owner')?.dataset.clientReadyOwner === 'true');
  await page.waitForTimeout(180);
}

function center(box) { return box.x + box.width / 2; }

test('Praziarnicka client-ready owner page is concise and contains no self promotion', async ({ page }) => {
  await page.setViewportSize({ width:1366, height:768 });
  await ready(page);
  const owner = page.locator('.mc-owner');
  await expect(owner).toContainText('Menej hľadania.');
  await expect(owner).toContainText('Rýchlejšie ku káve.');
  await expect(owner.locator('.mc-owner-demo-card')).toHaveCount(2);
  await expect(owner.locator('.mc-owner-benefits > div')).toHaveCount(3);
  await expect(page.locator('a[href*="mojchatbot.sk"]')).toHaveCount(0);
  const text = await page.locator('body').innerText();
  expect(text).not.toMatch(/Môj Chatbot|mojchatbot\.sk|Návrh AI|AI poradca|verzia\s*\d/i);
  const size = await page.evaluate(() => ({ h:document.scrollingElement.scrollHeight, ih:innerHeight, w:document.scrollingElement.scrollWidth, iw:innerWidth }));
  expect(size.h).toBeLessThanOrEqual(size.ih + 1);
  expect(size.w).toBeLessThanOrEqual(size.iw + 1);
  await page.screenshot({ path:'artifacts/client-ready-praziarnicka-site-1366x768.png', fullPage:true });
});

test('initial chat puts find-your-coffee above the welcome message and the switch under the header', async ({ page }) => {
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
  const head = await page.locator('.pz13-widget__head').boundingBox();
  const switchBox = await page.locator('.pz13-mode').boundingBox();
  expect(Math.abs(center(panel) - center(switchBox))).toBeLessThanOrEqual(2);
  expect(switchBox.y).toBeGreaterThanOrEqual(head.y + head.height - 1);
  expect(switchBox.y).toBeLessThan(panel.y + panel.height * .25);
  expect(switchBox.width).toBeGreaterThan(panel.width * .8);
  await expect(page.locator('.pz13-mode button')).toHaveCount(2);
  await expect(page.locator('.pz13-mode button[data-mode="chat"]')).toHaveClass(/is-active/);

  const composer = await page.locator('.pz13-composer').boundingBox();
  expect(composer.y).toBeGreaterThan(switchBox.y + switchBox.height);
  expect(composer.y + composer.height).toBeLessThanOrEqual(panel.y + panel.height + 1);
  await page.screenshot({ path:'artifacts/client-ready-praziarnicka-mobile-chat.png', fullPage:true });
});

test('after first message the advisor CTA and quick chips disappear but the switch remains', async ({ page }) => {
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

test('preparation step renders four distinct high-resolution sprite crops and keeps the selected visual', async ({ page }) => {
  await page.setViewportSize({ width:571, height:813 });
  await ready(page);
  await page.locator('#pz13-open').click();
  await page.locator('.pz13-mode button[data-mode="advisor"]').click();

  const options = page.locator('.pz13-option');
  await expect(options).toHaveCount(4);
  const photos = page.locator('.pz13-option__photo.is-proxy');
  await expect(photos).toHaveCount(4);
  const visuals = await photos.evaluateAll((nodes) => nodes.map((node) => ({ bg:getComputedStyle(node).backgroundImage, pos:getComputedStyle(node).backgroundPosition, opacity:getComputedStyle(node).opacity })));
  expect(visuals.every((item) => item.bg.includes('choice-sprite.png'))).toBeTruthy();
  expect(visuals.every((item) => Number(item.opacity) >= .99)).toBeTruthy();
  expect(new Set(visuals.map((item) => item.pos)).size).toBe(4);

  const first = options.first();
  await first.click();
  await expect(first).toHaveClass(/is-selected/);
  await expect(first.locator('.pz13-option__photo.is-proxy')).toBeVisible();
  await page.screenshot({ path:'artifacts/client-ready-praziarnicka-preparation-571x813.png', fullPage:true });
});
