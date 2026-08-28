import { mkdirSync } from 'node:fs';
import { test, expect } from '@playwright/test';

const baseURL = process.env.BASE_URL || 'http://127.0.0.1:4173';
const artifactDir = 'artifacts/full-release-audit';
mkdirSync(artifactDir, { recursive: true });

test.setTimeout(45_000);

const demos = [
  {
    slug:'praziarnicka', url:'/?demo=praziarnicka', launcher:'#pz13-open', panel:'#pz13-widget',
    switch:'.pz13-mode', chatMode:'.pz13-mode button[data-mode="chat"]', advisorMode:'.pz13-mode button[data-mode="advisor"]',
    entry:'#pz13-advisor-entry', greeting:'.pz13-message--assistant .pz13-bubble', chips:'.pz13-chip', composer:'.pz13-composer',
    options:'.pz13-option', optionVisual:'.pz13-option__visual', close:'#pz13-close', launcherImage:'img.cra-launcher-photo'
  },
  {
    slug:'diamonds', url:'/?demo=diamonds', launcher:'#launcherButton', panel:'#widget',
    switch:'.mode-switch', chatMode:'.mode-switch button[data-mode="chat"]', advisorMode:'.mode-switch button[data-mode="advisor"]',
    entry:'#openAdvisor', greeting:'.chat-line--assistant .chat-bubble', chips:'#quickChips button', composer:'.composer',
    options:'.answer-card', optionVisual:'.answer-photo', close:'#closeWidget', launcherImage:'img.cra-diamonds-launcher'
  },
  {
    slug:'kaffa', url:'/?demo=kaffa', launcher:'#launcher', panel:'.kf-panel',
    switch:'.kf-switch', chatMode:'.kf-switch button[data-view="chat"]', advisorMode:'.kf-switch button[data-view="advisor"]',
    entry:'.kf-advisor-entry', greeting:'.kf-chat-seed .kf-message.bot', chips:'.kf-chip', composer:'.kf-composer',
    options:'.kf-option', optionVisual:'.kf-option__visual', close:'#closeWidget'
  },
  {
    slug:'vitazov', url:'/?demo=vitazov', launcher:'#openWidget', panel:'#widget',
    switch:'.mode', chatMode:'.mode__button[data-mode="chat"]', advisorMode:'.mode__button[data-mode="advisor"]',
    entry:'#openAdvisor', greeting:'.message:not(.message--user) .bubble', chips:'#quickChips .chip', composer:'.composer',
    options:'#advisorBody .option', optionVisual:'.option__photo', close:'#closeWidget'
  },
  {
    slug:'concept', url:'/?demo=concept', launcher:'#openWidget', panel:'#widget',
    switch:'.mode', chatMode:'.mode__button[data-mode="chat"]', advisorMode:'.mode__button[data-mode="advisor"]',
    entry:'#openAdvisor', greeting:'.message:not(.message--user) .bubble', chips:'#quickChips .chip', composer:'.composer__shell',
    options:'.option', optionVisual:'.option__photo', close:'#closeWidget'
  },
  {
    slug:'jolka', url:'/jolka.html', launcher:'#open', panel:'#widget',
    switch:'.mode', chatMode:'.mode__button[data-mode="chat"]', advisorMode:'.mode__button[data-mode="advisor"]',
    entry:'.entry', greeting:'.msg:not(.msg--user) .bubble', chips:'.chip', composer:'.composer__field',
    options:'.option', optionVisual:'.option__media,.option__photo', close:'#close'
  }
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
    if (!url.startsWith(baseURL)) return;
    if (url.endsWith('/api/chat')) return;
    failures.push(`request failed: ${url} :: ${request.failure()?.errorText || 'unknown'}`);
  });
  return failures;
}

async function ready(page, demo, viewport) {
  await page.setViewportSize(viewport);
  await page.goto(`${baseURL}${demo.url}`, { waitUntil:'domcontentloaded' });
  await page.waitForFunction(() => document.documentElement.dataset.coffeeReleaseReady === 'true', null, { timeout:10_000 });
  await page.waitForTimeout(80);
}

async function visibleBox(page, selector) {
  const locator = page.locator(selector).first();
  await expect(locator).toBeVisible();
  const box = await locator.boundingBox();
  expect(box).not.toBeNull();
  return box;
}

async function expectLoadedVisual(locator) {
  await expect(locator).toBeVisible();
  const state = await locator.evaluate((node) => {
    const img = node.matches('img') ? node : node.querySelector('img');
    const style = getComputedStyle(node);
    return {
      hasImage: Boolean(img),
      imageLoaded: img ? img.complete && img.naturalWidth > 0 && img.naturalHeight > 0 : false,
      backgroundImage: style.backgroundImage,
      backgroundColor: style.backgroundColor,
      html: node.innerHTML.trim()
    };
  });
  expect(
    state.imageLoaded ||
    (state.backgroundImage && state.backgroundImage !== 'none') ||
    state.html.length > 0,
    'visual surface is empty'
  ).toBeTruthy();
}

for (const demo of demos) {
  test(`${demo.slug}: mobile release has a real launcher and coherent chat/advisor geometry`, async ({ page }) => {
    const failures = monitor(page);
    await ready(page, demo, { width:390, height:844 });

    const price = page.locator('.mcb-plan-price strong').first();
    if (await price.count()) await expect(price).toHaveText(/247\s*€/);

    const launcher = page.locator(demo.launcher);
    const launcherBox = await visibleBox(page, demo.launcher);
    expect(launcherBox.width).toBeGreaterThanOrEqual(56);
    expect(launcherBox.height).toBeGreaterThanOrEqual(56);

    if (demo.launcherImage) {
      const img = launcher.locator(demo.launcherImage);
      await expect(img).toBeVisible();
      expect(await img.evaluate((node) => node.complete && node.naturalWidth > 0)).toBeTruthy();
      expect(await img.evaluate((node) => Number(getComputedStyle(node).opacity))).toBeGreaterThanOrEqual(.95);
    } else {
      await expectLoadedVisual(launcher);
    }

    await page.screenshot({ path:`${artifactDir}/${demo.slug}-mobile-owner.png`, fullPage:false });

    await launcher.click({ force:true });
    const panelBox = await visibleBox(page, demo.panel);
    expect(panelBox.x).toBeGreaterThanOrEqual(-1);
    expect(panelBox.y).toBeGreaterThanOrEqual(-1);
    expect(panelBox.x + panelBox.width).toBeLessThanOrEqual(391);
    expect(panelBox.y + panelBox.height).toBeLessThanOrEqual(845);

    await page.locator(demo.chatMode).click({ force:true });
    const switchBox = await visibleBox(page, demo.switch);
    const entryBox = await visibleBox(page, demo.entry);
    const greetingBox = await visibleBox(page, demo.greeting);
    const composerBox = await visibleBox(page, demo.composer);

    expect(switchBox.width / panelBox.width, 'mode switch is too narrow').toBeGreaterThan(.85);
    expect(switchBox.height, 'mode switch is too short').toBeGreaterThanOrEqual(48);
    const entryGap = entryBox.y - (switchBox.y + switchBox.height);
    expect(entryGap, 'entry overlaps the mode switch').toBeGreaterThanOrEqual(-1);
    expect(entryGap, 'entry is detached from the mode switch').toBeLessThanOrEqual(32);
    expect(greetingBox.y - (entryBox.y + entryBox.height), 'greeting is too low').toBeLessThanOrEqual(32);
    expect(composerBox.y + composerBox.height).toBeLessThanOrEqual(panelBox.y + panelBox.height + 1);

    const chips = page.locator(demo.chips).filter({ visible:true });
    expect(await chips.count(), 'four quick actions must remain visible').toBeGreaterThanOrEqual(4);
    const firstChipStyle = await chips.first().evaluate((node) => {
      const style = getComputedStyle(node);
      return { font:parseFloat(style.fontSize), background:style.backgroundColor, color:style.color };
    });
    expect(firstChipStyle.font).toBeGreaterThanOrEqual(11);
    expect(firstChipStyle.background).not.toBe('rgba(0, 0, 0, 0)');
    expect(firstChipStyle.color).not.toBe(firstChipStyle.background);

    await page.screenshot({ path:`${artifactDir}/${demo.slug}-mobile-chat.png`, fullPage:false });

    await page.locator(demo.advisorMode).click({ force:true });
    const options = page.locator(demo.options).filter({ visible:true });
    await expect(options).toHaveCount(4);
    const optionBoxes = await options.evaluateAll((nodes) => nodes.map((node) => {
      const rect = node.getBoundingClientRect();
      return { x:rect.x, y:rect.y, width:rect.width, height:rect.height };
    }));
    for (const box of optionBoxes) {
      expect(box.width).toBeGreaterThan(100);
      expect(box.height).toBeGreaterThan(70);
      expect(box.x).toBeGreaterThanOrEqual(-1);
      expect(box.x + box.width).toBeLessThanOrEqual(391);
      expect(box.y + box.height).toBeLessThanOrEqual(845);
    }

    for (const option of await options.all()) {
      const visual = option.locator(demo.optionVisual).first();
      if (await visual.count()) await expectLoadedVisual(visual);
    }

    await page.screenshot({ path:`${artifactDir}/${demo.slug}-mobile-advisor.png`, fullPage:false });

    const close = page.locator(demo.close);
    await close.hover();
    const closeColor = await close.evaluate((node) => getComputedStyle(node).color.match(/[\d.]+/g)?.slice(0,3).map(Number) || [0,0,0]);
    expect(closeColor[0]).toBeGreaterThan(closeColor[1] + 20);
    expect(closeColor[0]).toBeGreaterThan(closeColor[2] + 20);
    await close.click({ force:true });

    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
    expect(failures).toEqual([]);
  });

  test(`${demo.slug}: desktop owner/launcher is contained and visually usable`, async ({ page }) => {
    const failures = monitor(page);
    await ready(page, demo, { width:1366, height:768 });
    const launcherBox = await visibleBox(page, demo.launcher);
    expect(launcherBox.x + launcherBox.width).toBeLessThanOrEqual(1367);
    expect(launcherBox.y + launcherBox.height).toBeLessThanOrEqual(769);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(1366);
    await page.screenshot({ path:`${artifactDir}/${demo.slug}-desktop-owner.png`, fullPage:false });
    expect(failures).toEqual([]);
  });
}
