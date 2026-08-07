import { test, expect } from '@playwright/test';
import fs from 'node:fs';

const baseURL = 'http://127.0.0.1:4173';
const demos = [['praziarnicka','Pražiarnička'],['diamonds','Diamonds'],['kaffa','Kaffa'],['vitazov','Káva Víťazov'],['concept','Concept'],['jolka','Jolka']];
fs.mkdirSync('artifacts/final-matrix', { recursive: true });

const optionSelector = '.pz-option:visible,.option:visible,.kf-option:visible,.answer-card:visible,.advisor-option:visible,.choice-card:visible';
const chipSelector = '.pz-chip:visible,.chip:visible,.kf-chip:visible,.quick-grid button:visible,.quick-questions button:visible,.chips button:visible';

function runtimeErrors(page) {
  const errors = [];
  page.on('pageerror', error => errors.push(`page: ${error.message}`));
  page.on('console', message => { if (message.type() === 'error' && !/favicon/i.test(message.text())) errors.push(`console: ${message.text()}`); });
  return errors;
}
async function clickFirstVisible(page, selectors) {
  for (const selector of selectors) { const locator = page.locator(selector).first(); if (await locator.isVisible().catch(() => false)) { await locator.click(); return locator; } }
  throw new Error(`No visible target from ${selectors.join(', ')}`);
}
async function visiblePanel(page) {
  for (const selector of ['.kf-panel:visible','#pzWidget:visible','#widget:visible','.pz-widget:visible','.widget:visible','[role="dialog"]:visible']) { const locator = page.locator(selector).first(); if (await locator.isVisible().catch(() => false)) return locator; }
  throw new Error('No visible widget panel');
}
async function openDemo(page, slug, mobile) {
  await page.goto(`${baseURL}/?demo=${slug}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);
  await page.screenshot({ path: `artifacts/final-matrix/${slug}-${mobile ? 'mobile' : 'desktop'}-landing.png`, fullPage: !mobile });
  await clickFirstVisible(page, ['#pzHeroOpen','#heroOpen','#openWidget','#launcherButton','#pzLauncher','#launcher','.launcher__button','.pz-launcher']);
  await page.waitForTimeout(300);
  return visiblePanel(page);
}
async function selectMode(page, mode) {
  const selectors = mode === 'chat' ? ['[data-mode="chat"]:visible','[data-view="chat"]:visible'] : ['[data-mode="advisor"]:visible','[data-view="advisor"]:visible'];
  await clickFirstVisible(page, selectors); await page.waitForTimeout(140);
}
async function assertChat(page, panel, slug, mobile = false) {
  await selectMode(page, 'chat');
  const input = panel.locator('input:visible').last(); await expect(input).toBeVisible();
  if (mobile) expect(await page.evaluate(() => document.activeElement?.tagName === 'INPUT')).toBe(false);
  const send = panel.locator('form button[type="submit"]:visible,.composer__send:visible,.pz-send:visible,.kf-send:visible').last(); await expect(send).toBeVisible();
  const sendBox = await send.boundingBox(); expect(sendBox).not.toBeNull(); expect(sendBox.width).toBeGreaterThanOrEqual(40); expect(sendBox.height).toBeGreaterThanOrEqual(40);
  const chips = panel.locator(chipSelector); const chipCount = await chips.count(); expect(chipCount).toBeGreaterThanOrEqual(4);
  for (let i = 0; i < Math.min(4, chipCount); i++) { const chip = chips.nth(i); const box = await chip.boundingBox(); expect(box).not.toBeNull(); expect(box.height).toBeGreaterThanOrEqual(42); expect((await chip.innerText()).trim().length).toBeGreaterThan(2); }
  await expect(panel.getByText('Zavolať', { exact: false })).toHaveCount(0);
  await page.screenshot({ path: `artifacts/final-matrix/${slug}-${mobile ? 'mobile' : 'desktop'}-chat.png` });
}
async function finishAdvisor(page, panel, slug, mobile = false) {
  await selectMode(page, 'advisor'); await page.waitForTimeout(180);
  let options = panel.locator(optionSelector); expect(await options.count()).toBeGreaterThanOrEqual(3);
  await page.screenshot({ path: `artifacts/final-matrix/${slug}-${mobile ? 'mobile' : 'desktop'}-advisor.png` });
  await options.first().click(); await page.waitForTimeout(110);
  const selected = panel.locator('.is-selected:visible,[aria-pressed="true"]:visible').first(); await expect(selected).toBeVisible();
  await page.screenshot({ path: `artifacts/final-matrix/${slug}-${mobile ? 'mobile' : 'desktop'}-selected.png` });
  for (let guard = 0; guard < 7; guard++) { await page.waitForTimeout(620); options = panel.locator(optionSelector); if (await options.count() === 0) break; await options.first().click(); }
  await page.waitForTimeout(720);
  const text = await panel.innerText();
  expect(text).toMatch(/Prečo práve|Odporúčanie|Vaša káva|sedí najviac|Výsledok/i);
  expect(/zhoda[^\n]{0,80}%|%[^\n]{0,80}zhoda/i.test(text)).toBe(false);
  expect(text.toLowerCase()).not.toContain('bez falošného skóre');
  const loadedPhotoCount = await panel.locator('img:visible').evaluateAll(imgs => imgs.filter(img => img.complete && img.naturalWidth >= 80 && img.naturalHeight >= 80).length); expect(loadedPhotoCount).toBeGreaterThanOrEqual(1);
  const kaffaCTA = panel.locator('.kf-result-cta:visible'); if (await kaffaCTA.count()) await expect(kaffaCTA.first()).toBeInViewport();
  await page.screenshot({ path: `artifacts/final-matrix/${slug}-${mobile ? 'mobile' : 'desktop'}-result.png` });
}

for (const [slug, brand] of demos) {
  test(`${brand} desktop director gate`, async ({ page }) => {
    const errors = runtimeErrors(page); await page.setViewportSize({ width: 1440, height: 900 }); const panel = await openDemo(page, slug, false);
    const box = await panel.boundingBox(); expect(box).not.toBeNull(); expect(box.width).toBeGreaterThanOrEqual(420); expect(box.width).toBeLessThanOrEqual(560); expect(box.height).toBeGreaterThanOrEqual(620); expect(box.height).toBeLessThanOrEqual(820);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(1440);
    await assertChat(page, panel, slug, false); await finishAdvisor(page, panel, slug, false); expect(errors).toEqual([]);
  });
  test(`${brand} mobile director gate`, async ({ page }) => {
    const errors = runtimeErrors(page); await page.setViewportSize({ width: 390, height: 844 }); const panel = await openDemo(page, slug, true);
    const box = await panel.boundingBox(); expect(box).not.toBeNull(); expect(box.x).toBeGreaterThanOrEqual(0); expect(box.y).toBeGreaterThanOrEqual(0); expect(box.width).toBeGreaterThanOrEqual(360); expect(box.width).toBeLessThanOrEqual(390); expect(box.x + box.width).toBeLessThanOrEqual(391); expect(box.y + box.height).toBeLessThanOrEqual(845);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
    await assertChat(page, panel, slug, true); await finishAdvisor(page, panel, slug, true); expect(errors).toEqual([]);
  });
}