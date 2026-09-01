import { mkdirSync } from 'node:fs';
import { test, expect } from '@playwright/test';

const baseURL = process.env.BASE_URL || 'http://127.0.0.1:4173';
const artifactDir = 'artifacts/full-release-audit';
mkdirSync(artifactDir, { recursive: true });

test.setTimeout(45_000);

const demos = [
  ['praziarnicka', '/praziarnicka.html'],
  ['diamonds', '/diamonds.html'],
  ['kaffa', '/kaffa.html'],
  ['vitazov', '/vitazov.html'],
  ['concept', '/concept.html'],
  ['jolka', '/jolka.html']
];

function monitor(page) {
  const failures = [];
  page.on('pageerror', (error) => failures.push(`pageerror: ${error.message}`));
  page.on('console', (message) => {
    if (message.type() !== 'error') return;
    const text = message.text();
    if (/Unsupported method \('POST'\)|Failed to load resource.*(501|404)/.test(text)) return;
    failures.push(`console: ${text}`);
  });
  page.on('requestfailed', (request) => {
    const url = request.url();
    if (!url.startsWith(baseURL) || url.endsWith('/api/chat')) return;
    failures.push(`request failed: ${url} :: ${request.failure()?.errorText || 'unknown'}`);
  });
  return failures;
}

async function ready(page, url, viewport) {
  await page.setViewportSize(viewport);
  await page.goto(`${baseURL}${url}`, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => {
    if (location.pathname === '/jolka.html') return Boolean(document.querySelector('#widget .mode'));
    return document.documentElement.dataset.coffeeReleaseReady === 'true';
  }, null, { timeout: 10_000 });
  await page.waitForTimeout(250);
}

async function expectLoadedImage(locator) {
  await expect(locator).toBeVisible();
  expect(await locator.evaluate((image) => image.complete && image.naturalWidth > 0 && image.naturalHeight > 0)).toBeTruthy();
}

for (const [slug, url] of demos) {
  test(`${slug}: clean mobile Jolka contract`, async ({ page }) => {
    const failures = monitor(page);
    await ready(page, url, { width: 390, height: 844 });

    await expect(page.locator('.page')).toBeVisible();
    await expectLoadedImage(page.locator('.lockup img'));
    await expectLoadedImage(page.locator('.showcase__photo'));

    const launcher = page.locator('#open');
    await expect(launcher).toBeVisible();
    const launcherBox = await launcher.boundingBox();
    expect(launcherBox?.width).toBeGreaterThanOrEqual(56);
    expect(launcherBox?.height).toBeGreaterThanOrEqual(56);

    await launcher.click();
    const widget = page.locator('#widget');
    await expect(widget).toHaveClass(/is-open/);
    const widgetBox = await widget.boundingBox();
    expect(widgetBox).not.toBeNull();
    expect(widgetBox.x).toBeGreaterThanOrEqual(-1);
    expect(widgetBox.y).toBeGreaterThanOrEqual(-1);
    expect(widgetBox.x + widgetBox.width).toBeLessThanOrEqual(391);
    expect(widgetBox.y + widgetBox.height).toBeLessThanOrEqual(845);

    const mode = page.locator('#mode');
    await expect(mode).toBeVisible();
    expect((await mode.boundingBox())?.width / widgetBox.width).toBeGreaterThan(.85);

    await page.locator('.mode__button[data-mode="chat"]').click();
    await expect(page.locator('#chatScreen')).toHaveClass(/is-active/);
    await expect(page.locator('#entry')).toBeVisible();
    await expect(page.locator('#chat .msg .bubble').first()).toBeVisible();
    await expect(page.locator('#chips .chip')).toHaveCount(4);
    await expect(page.locator('#composer')).toBeVisible();

    await page.locator('#chips .chip').first().click();
    await expect(page.locator('#chat .msg--user')).toHaveCount(1);
    await expect(page.locator('#chat .msg:not(.msg--user)')).toHaveCount(2);

    await page.locator('.mode__button[data-mode="advisor"]').click();
    await expect(page.locator('#advisorScreen')).toHaveClass(/is-active/);
    await expect(page.locator('#advisor .option')).toHaveCount(4);
    for (let step = 0; step < 4; step += 1) {
      const options = page.locator('#advisor .option');
      await expect(options.first()).toBeVisible();
      const image = options.first().locator('.option__visual img');
      await expectLoadedImage(image);
      await options.first().click();
      await page.waitForTimeout(620);
    }

    await expect(page.locator('#advisor .result')).toBeVisible();
    await expectLoadedImage(page.locator('#advisor .result__photo'));
    await expect(page.locator('#advisorFoot #productCta')).toHaveAttribute('href', /^https:\/\//);

    await page.locator('#close').click();
    await expect(widget).not.toHaveClass(/is-open/);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
    expect(failures).toEqual([]);
  });

  test(`${slug}: desktop owner presentation is contained`, async ({ page }) => {
    const failures = monitor(page);
    await ready(page, url, { width: 1366, height: 768 });
    await expect(page.locator('.page')).toBeVisible();
    await expect(page.locator('#open')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(1366);
    await page.screenshot({ path: `${artifactDir}/${slug}-desktop.png`, fullPage: false });
    expect(failures).toEqual([]);
  });
}
