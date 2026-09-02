import { mkdirSync } from 'node:fs';
import { test, expect } from '@playwright/test';

const baseURL = process.env.BASE_URL || 'http://127.0.0.1:4173';
const artifactDir = 'artifacts/full-release-audit';
mkdirSync(artifactDir, { recursive: true });

test.setTimeout(50_000);

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
  await page.waitForFunction(() => document.documentElement.dataset.coffeeReleaseReady === 'true', null, { timeout: 10_000 });
  await page.waitForTimeout(300);
}

async function expectLoadedImage(locator) {
  await expect(locator).toBeVisible();
  expect(await locator.evaluate((image) => image.complete && image.naturalWidth > 0 && image.naturalHeight > 0)).toBeTruthy();
}

async function expectContained(parent, child, tolerance = 1) {
  const [parentBox, childBox] = await Promise.all([parent.boundingBox(), child.boundingBox()]);
  expect(parentBox).not.toBeNull();
  expect(childBox).not.toBeNull();
  expect(childBox.x).toBeGreaterThanOrEqual(parentBox.x - tolerance);
  expect(childBox.y).toBeGreaterThanOrEqual(parentBox.y - tolerance);
  expect(childBox.x + childBox.width).toBeLessThanOrEqual(parentBox.x + parentBox.width + tolerance);
  expect(childBox.y + childBox.height).toBeLessThanOrEqual(parentBox.y + parentBox.height + tolerance);
}

async function expectOwnerOffer(page) {
  const ownerPage = page.locator('.mcb-page');
  await expect(ownerPage).toBeVisible();
  const plan = ownerPage.locator('.mcb-plan');
  await expect(plan).toContainText('Prvý mesiac zdarma');
  await expect(plan).toContainText('247');
  await expect(plan).toContainText('10');
  await expect(plan).toContainText('Nasadenie jedným riadkom kódu');
  await expect(ownerPage.locator('.mcb-pricing-side')).toContainText('Bez viazanosti');
  const trialDecoration = await plan.locator('.mcb-plan-trial').evaluate((element) => getComputedStyle(element, '::before').content);
  expect(['none', 'normal', '""']).toContain(trialDecoration);
  const planStyle = await plan.evaluate((element) => {
    const style = getComputedStyle(element);
    return { backgroundImage: style.backgroundImage, boxShadow: style.boxShadow };
  });
  expect(planStyle.backgroundImage).toBe('none');
  // A flat elevation is part of the approved card; a coloured glow is not.
  expect(planStyle.boxShadow).not.toMatch(/rgba?\((?!\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*0?\.[0-3])/);
}

async function expectLauncherInteraction(page) {
  const launcher = page.locator('#open');
  const launcherImage = launcher.locator('img');
  await expectLoadedImage(launcherImage);
  await expectContained(launcher, launcherImage, 1);
  const before = await launcher.evaluate((element) => ({
    backgroundImage: getComputedStyle(element).backgroundImage,
    logoTransition: getComputedStyle(element.querySelector('img')).transitionDuration
  }));
  expect(before.backgroundImage).toBe('none');
  expect(before.logoTransition.split(',').every((value) => value.trim() === '0s')).toBeTruthy();
  await launcher.hover();
  await page.waitForTimeout(80);
  expect(await launcher.evaluate((element) => getComputedStyle(element).backgroundImage)).toBe('none');
}

async function expectBrandGeometry(page) {
  const lockupLogo = page.locator('.mcb-lockup img').first();
  if (await lockupLogo.count()) {
    await expectLoadedImage(lockupLogo);
    const lockupBox = await lockupLogo.boundingBox();
    expect(lockupBox.width).toBeLessThanOrEqual(195);
    expect(lockupBox.height).toBeLessThanOrEqual(52);
  } else {
    await expect(page.locator('.mcb-wordmark')).toBeVisible();
  }

  await expectLauncherInteraction(page);
  await page.locator('#open').click();
  const widget = page.locator('#widget');
  await expect(widget).toHaveClass(/is-open/);
  await page.waitForTimeout(300);

  const header = widget.locator('.widget__header');
  const brand = widget.locator('.widget__brand');
  const brandImage = brand.locator(':scope > img');
  const actions = widget.locator('.widget__actions');
  await expectLoadedImage(brandImage);
  const brandImageBox = await brandImage.boundingBox();
  expect(brandImageBox.width).toBeLessThanOrEqual(112);
  expect(brandImageBox.height).toBeLessThanOrEqual(52);
  const brandImageStyle = await brandImage.evaluate((image) => {
    const style = getComputedStyle(image);
    const alpha = Number(style.backgroundColor.match(/rgba\([^,]+,[^,]+,[^,]+,\s*([\d.]+)\)/)?.[1] ?? 1);
    return { backgroundAlpha: alpha, borderWidth: style.borderWidth };
  });
  expect(brandImageStyle.backgroundAlpha).toBeLessThanOrEqual(.1);
  expect(brandImageStyle.borderWidth).toBe('0px');
  await expectContained(header, brand, 1);
  await expectContained(header, actions, 1);
  const [brandBox, actionsBox] = await Promise.all([brand.boundingBox(), actions.boundingBox()]);
  expect(brandBox.x + brandBox.width).toBeLessThanOrEqual(actionsBox.x + 1);
  expect(await widget.evaluate((element) => element.scrollWidth <= element.clientWidth + 1)).toBeTruthy();
}

async function expectCalmChatAndMedia(page) {
  await page.locator('.mode__button[data-mode="chat"]').click();
  await expect(page.locator('#chatScreen')).toHaveClass(/is-active/);

  const entry = page.locator('#entry');
  await expect(entry).toBeVisible();
  const radii = await entry.evaluate((element) => {
    const s = getComputedStyle(element);
    return [s.borderTopLeftRadius, s.borderTopRightRadius, s.borderBottomRightRadius, s.borderBottomLeftRadius];
  });
  expect(new Set(radii).size).toBe(1);
  const thumbRadii = await entry.locator('.entry__thumb').evaluate((element) => {
    const s = getComputedStyle(element);
    return [s.borderTopLeftRadius, s.borderTopRightRadius, s.borderBottomRightRadius, s.borderBottomLeftRadius];
  });
  expect(new Set(thumbRadii).size).toBe(1);

  const chip = page.locator('#chips .chip').first();
  await expect(chip).toBeVisible();
  expect(await chip.evaluate((element) => getComputedStyle(element).backgroundImage)).toBe('none');
  await chip.hover();
  await page.waitForTimeout(80);
  const chipHover = await chip.evaluate((element) => {
    const style = getComputedStyle(element);
    return { backgroundImage: style.backgroundImage, color: style.color };
  });
  expect(chipHover.backgroundImage).toBe('none');
  expect(chipHover.color).not.toBe('rgba(0, 0, 0, 0)');

  await page.locator('.mode__button[data-mode="advisor"]').click();
  const optionImage = page.locator('#advisor .option .option__visual img').first();
  await expectLoadedImage(optionImage);
  const imageBefore = await optionImage.evaluate((element) => ({ transform:getComputedStyle(element).transform, transition:getComputedStyle(element).transitionDuration }));
  await optionImage.hover();
  await page.waitForTimeout(120);
  const imageAfter = await optionImage.evaluate((element) => ({ transform:getComputedStyle(element).transform, overlay:getComputedStyle(element.parentElement, '::after').content }));
  expect(imageBefore.transform).toBe('none');
  expect(imageBefore.transition.split(',').every((value) => value.trim() === '0s')).toBeTruthy();
  expect(imageAfter.transform).toBe('none');
  expect(['none', 'normal', '""']).toContain(imageAfter.overlay);
}

for (const [slug, url] of demos) {
  test(`${slug}: mobile shared geometry, logos and full flow`, async ({ page }) => {
    const failures = monitor(page);
    await ready(page, url, { width:390, height:844 });
    await expectOwnerOffer(page);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
    await expectBrandGeometry(page);

    const widget = page.locator('#widget');
    await expect(widget.locator('.widget__note')).toHaveText('mojchatbot.sk');
    const widgetBox = await widget.boundingBox();
    expect(widgetBox).not.toBeNull();
    expect(widgetBox.x).toBeGreaterThanOrEqual(-1);
    expect(widgetBox.y).toBeGreaterThanOrEqual(-1);
    expect(widgetBox.x + widgetBox.width).toBeLessThanOrEqual(391);
    expect(widgetBox.y + widgetBox.height).toBeLessThanOrEqual(845);

    const mode = page.locator('#mode');
    await expect(mode).toBeVisible();
    expect((await mode.boundingBox()).width / widgetBox.width).toBeGreaterThan(.85);

    await expectCalmChatAndMedia(page);
    await page.locator('.mode__button[data-mode="chat"]').click();
    await expect(page.locator('#chat .msg .bubble').first()).toBeVisible();
    await expect(page.locator('#chips .chip')).toHaveCount(4);
    await expect(page.locator('#composer')).toBeVisible();
    expect(await page.locator('#chatScreen').evaluate((element) => element.scrollWidth <= element.clientWidth + 1)).toBeTruthy();

    await page.locator('#chips .chip').first().click();
    await expect(page.locator('#chat .msg--user')).toHaveCount(1);
    await expect(page.locator('#chat .msg:not(.msg--user)')).toHaveCount(2);

    await page.locator('.mode__button[data-mode="advisor"]').click();
    await expect(page.locator('#advisorScreen')).toHaveClass(/is-active/);
    for (let step = 0; step < 4; step += 1) {
      const options = page.locator('#advisor .option');
      await expect(options.first()).toBeVisible();
      await expectLoadedImage(options.first().locator('.option__visual img'));
      expect(await page.locator('#advisor').evaluate((element) => element.scrollWidth <= element.clientWidth + 1)).toBeTruthy();
      await options.first().click();
      await page.waitForTimeout(560);
    }

    await expect(page.locator('#advisor .result')).toBeVisible();
    await expectLoadedImage(page.locator('#advisor .result__photo'));
    await expect(page.locator('#advisorFoot #productCta')).toHaveAttribute('href', /^https:\/\//);
    await page.locator('#close').click();
    await expect(widget).not.toHaveClass(/is-open/);
    expect(failures).toEqual([]);
  });

  test(`${slug}: desktop owner page and widget stay inside viewport`, async ({ page }) => {
    const failures = monitor(page);
    await ready(page, url, { width:1366, height:768 });
    await expectOwnerOffer(page);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(1366);
    const pageGeometry = await page.locator('.mcb-page').evaluate((element) => ({ clientHeight:element.clientHeight, scrollHeight:element.scrollHeight }));
    expect(pageGeometry.scrollHeight).toBeLessThanOrEqual(pageGeometry.clientHeight + 2);
    await expectBrandGeometry(page);
    const widget = page.locator('#widget');
    const widgetBox = await widget.boundingBox();
    expect(widgetBox.x).toBeGreaterThanOrEqual(-1);
    expect(widgetBox.y).toBeGreaterThanOrEqual(-1);
    expect(widgetBox.x + widgetBox.width).toBeLessThanOrEqual(1367);
    expect(widgetBox.y + widgetBox.height).toBeLessThanOrEqual(769);
    await page.screenshot({ path:`${artifactDir}/${slug}-desktop.png`, fullPage:false });
    await page.locator('#close').click();
    expect(failures).toEqual([]);
  });
}
