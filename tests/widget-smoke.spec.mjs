import { test, expect } from '@playwright/test';
import fs from 'node:fs';

const baseURL = process.env.BASE_URL || 'http://127.0.0.1:4173';
fs.mkdirSync('artifacts', { recursive: true });

const demos = [
  { slug:'praziarnicka', title:/Pražiarnička/, resource:'praziarnicka-v12.js', launcher:'#pz-launcher', teaser:'#pz-preview', teaserTitle:'#pz-preview b', teaserSub:'#pz-preview span', input:'#pz-input', bot:'.pz-bubble-assistant' },
  { slug:'diamonds', title:/Diamonds Roastery/, resource:'coffee-diamonds-final.js', launcher:'#launcherButton', teaser:'#teaser', teaserTitle:'#teaser strong', teaserSub:'#teaser span', input:'#chatInput', bot:'.chat-line:not(.chat-line--user) .chat-bubble' },
  { slug:'kaffa', title:/Kaffa Roastery/, resource:'kaffa-final.js', launcher:'#launcher', teaser:'#teaser', teaserTitle:'#teaser b', teaserSub:'#teaser span', input:'#chatInput', bot:'.kf-message.bot' },
  { slug:'vitazov', title:/Káva Víťazov/, resource:'coffee-vitazov-final.js', launcher:'#openWidget', teaser:'#launcherTeaser', teaserTitle:'#launcherTeaser b', teaserSub:'#launcherTeaser span', input:'#chatInput', bot:'.message:not(.message--user) .bubble' },
  { slug:'concept', title:/Concept Coffee Roasters/, resource:'concept-seasonal-init.js', launcher:'#openWidget', teaser:'#launcherTeaser', teaserTitle:'#launcherTeaser b', teaserSub:'#launcherTeaser span', input:'#chatInput', bot:'.message:not(.message--user) .bubble' }
];

function watchConsole(page) {
  const failures = [];
  const seen = new Set();
  const add = value => { if (!seen.has(value)) { seen.add(value); failures.push(value); } };
  const onConsole = message => {
    if (message.type() !== 'error') return;
    const location = message.location();
    add(`console: ${message.text()}${location?.url ? ` @ ${location.url}` : ''}`);
  };
  const onPageError = error => add(`pageerror: ${error.message}`);
  const onResponse = response => {
    if (response.status() >= 400) add(`http ${response.status()}: ${response.url()}`);
  };
  const onRequestFailed = request => add(`request failed: ${request.url()} :: ${request.failure()?.errorText || 'unknown'}`);
  page.on('console', onConsole);
  page.on('pageerror', onPageError);
  page.on('response', onResponse);
  page.on('requestfailed', onRequestFailed);
  return { failures, stop(){ page.off('console', onConsole); page.off('pageerror', onPageError); page.off('response', onResponse); page.off('requestfailed', onRequestFailed); } };
}

async function waitForDemo(page) {
  await page.waitForFunction(() => {
    const pz = document.querySelector('#praziarnicka-root');
    const shared = document.querySelector('#coffee-demo-root');
    return Boolean((pz && pz.childElementCount) || (shared && shared.childElementCount));
  });
  await page.waitForFunction(() => document.documentElement.dataset.jolkaParity === 'ready');
  await page.waitForTimeout(120);
}

async function px(locator, property) {
  return locator.evaluate((node, prop) => parseFloat(getComputedStyle(node)[prop]), property);
}

test('all five routed demos reach Jolka-parity owner readability and fit 1366x768', async ({ page }) => {
  await page.setViewportSize({ width:1366, height:768 });
  for (const demo of demos) {
    const consoleWatch = watchConsole(page);
    await page.goto(`${baseURL}/?demo=${demo.slug}`, { waitUntil:'networkidle' });
    await waitForDemo(page);
    await expect(page).toHaveTitle(demo.title);

    const resources = await page.evaluate(() => performance.getEntriesByType('resource').map(entry => entry.name));
    expect(resources.some(url => url.includes(demo.resource))).toBeTruthy();
    expect(resources.some(url => url.includes('coffee-jolka-parity.css'))).toBeTruthy();

    const metrics = await page.evaluate(() => ({
      scrollHeight:document.scrollingElement.scrollHeight,
      scrollWidth:document.scrollingElement.scrollWidth,
      innerHeight:window.innerHeight,
      innerWidth:window.innerWidth,
      text:document.body.innerText.trim()
    }));
    expect(metrics.scrollHeight).toBeLessThanOrEqual(metrics.innerHeight + 1);
    expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.innerWidth + 1);
    expect(metrics.text.length).toBeGreaterThan(80);
    expect(metrics.text).not.toMatch(/Návrh AI|Vyskúšajte AI|Interaktívny návrh|Funguje s reálnou ponukou|overenou 8\. 8\. 2026/i);

    const strip = page.locator('.parity-bottom');
    await expect(strip).toBeVisible();
    await expect(strip.locator('.parity-bottom__item')).toHaveCount(4);

    const launcher = page.locator(demo.launcher);
    await expect(launcher).toBeVisible();
    const launcherBox = await launcher.boundingBox();
    expect(launcherBox.width).toBeGreaterThanOrEqual(68);
    expect(launcherBox.height).toBeGreaterThanOrEqual(68);

    const teaser = page.locator(demo.teaser);
    await expect(teaser).toBeVisible();
    expect(await px(page.locator(demo.teaserTitle), 'fontSize')).toBeGreaterThanOrEqual(12.5);
    expect(await px(page.locator(demo.teaserSub), 'fontSize')).toBeGreaterThanOrEqual(10.5);
    const teaserBox = await teaser.boundingBox();
    expect(teaserBox.y + teaserBox.height).toBeLessThan(700);

    expect(consoleWatch.failures).toEqual([]);
    consoleWatch.stop();
    await page.screenshot({ path:`artifacts/final-${demo.slug}-1366x768.png`, fullPage:true });
  }
});

test('all five chats visibly answer and use readable chips/bubbles', async ({ page }) => {
  await page.setViewportSize({ width:1366, height:768 });
  for (const demo of demos) {
    const consoleWatch = watchConsole(page);
    await page.goto(`${baseURL}/?demo=${demo.slug}`, { waitUntil:'networkidle' });
    await waitForDemo(page);
    await page.locator(demo.launcher).click({ force:true });
    const input = page.locator(demo.input);
    await expect(input).toBeVisible({ timeout:5000 });

    const chips = page.locator('.pz-chip,#quickChips .chip,#quickChips button,.kf-chip').filter({ visible:true });
    const chipCount = await chips.count();
    expect(chipCount).toBeGreaterThanOrEqual(4);
    const chipFont = await chips.first().evaluate(node => parseFloat(getComputedStyle(node).fontSize));
    expect(chipFont).toBeGreaterThanOrEqual(11);

    if (demo.slug === 'kaffa') {
      const panel = page.locator('.kf-panel');
      await expect(panel).toBeVisible();
      const panelStyle = await panel.evaluate(node => {
        const style = getComputedStyle(node);
        return { opacity:parseFloat(style.opacity), background:style.backgroundColor };
      });
      expect(panelStyle.opacity).toBeGreaterThanOrEqual(.99);
      expect(panelStyle.background).not.toBe('rgba(0, 0, 0, 0)');
      expect(await page.locator('.kf-widget-brand .kf-widget-title,.kf-widget-brand .kf-widget-bubble').filter({ visible:true }).count()).toBe(0);
    }

    const bots = page.locator(demo.bot);
    const before = await bots.count();
    await input.fill('Akú kávu do automatu?');
    await input.press('Enter');
    await expect.poll(async () => await bots.count(), { timeout:6000 }).toBeGreaterThan(before);
    const last = bots.last();
    await expect(last).toBeVisible();
    const reply = (await last.innerText()).trim();
    expect(reply.length).toBeGreaterThan(20);
    const bubbleMetrics = await last.evaluate(node => {
      const style = getComputedStyle(node);
      return { font:parseFloat(style.fontSize), bg:style.backgroundColor, color:style.color, opacity:parseFloat(style.opacity) };
    });
    expect(bubbleMetrics.font).toBeGreaterThanOrEqual(12);
    expect(bubbleMetrics.opacity).toBeGreaterThanOrEqual(.95);
    expect(bubbleMetrics.bg).not.toBe('rgba(0, 0, 0, 0)');
    expect(bubbleMetrics.bg).not.toBe('transparent');

    expect(consoleWatch.failures).toEqual([]);
    consoleWatch.stop();
    await page.screenshot({ path:`artifacts/final-${demo.slug}-widget.png`, fullPage:true });
  }
});

test('Káva Víťazov advisor uses distinct semantic photos and readable option text', async ({ page }) => {
  await page.setViewportSize({ width:571, height:813 });
  await page.goto(`${baseURL}/?demo=vitazov`, { waitUntil:'networkidle' });
  await waitForDemo(page);
  await page.locator('#openWidget').click({ force:true });
  await page.locator('#openAdvisor').click();
  const options = page.locator('#advisorBody .option');
  await expect(options.first()).toBeVisible();
  expect(await options.count()).toBeGreaterThanOrEqual(4);
  const images = page.locator('#advisorBody .parity-choice-img');
  await expect(images).toHaveCount(await options.count());
  const srcs = await images.evaluateAll(nodes => nodes.map(node => node.getAttribute('src')));
  expect(new Set(srcs).size).toBeGreaterThanOrEqual(3);
  for (const option of await options.all()) {
    const title = option.locator('.option__copy b');
    const description = option.locator('.option__copy small');
    expect(await px(title, 'fontSize')).toBeGreaterThanOrEqual(11.5);
    expect(await px(description, 'fontSize')).toBeGreaterThanOrEqual(9);
    const clipped = await option.evaluate(node => node.scrollHeight > node.clientHeight + 2);
    expect(clipped).toBeFalsy();
  }
  await page.screenshot({ path:'artifacts/final-vitazov-advisor-571x813.png', fullPage:true });
});

test('all five routed demos remain horizontally contained at 571x813', async ({ page }) => {
  await page.setViewportSize({ width:571, height:813 });
  for (const demo of demos) {
    const consoleWatch = watchConsole(page);
    await page.goto(`${baseURL}/?demo=${demo.slug}`, { waitUntil:'networkidle' });
    await waitForDemo(page);
    const metrics = await page.evaluate(() => ({ scrollWidth:document.scrollingElement.scrollWidth, innerWidth:window.innerWidth, text:document.body.innerText.trim() }));
    expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.innerWidth + 1);
    expect(metrics.text.length).toBeGreaterThan(20);
    expect(consoleWatch.failures).toEqual([]);
    consoleWatch.stop();
  }
});

test('Jolka stays standalone and unchanged by the parity layer', async ({ page }) => {
  const consoleWatch = watchConsole(page);
  await page.setViewportSize({ width:1366, height:768 });
  await page.goto(`${baseURL}/jolka.html`, { waitUntil:'networkidle' });
  await page.waitForFunction(() => document.body.innerText.trim().length > 20);
  expect(await page.locator('link[data-jolka-parity]').count()).toBe(0);
  expect(await page.locator('script[src="/coffee-jolka-parity.js"]').count()).toBe(0);
  const metrics = await page.evaluate(() => ({ scrollHeight:document.scrollingElement.scrollHeight, scrollWidth:document.scrollingElement.scrollWidth, innerHeight:window.innerHeight, innerWidth:window.innerWidth }));
  expect(metrics.scrollHeight).toBeLessThanOrEqual(metrics.innerHeight + 1);
  expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.innerWidth + 1);
  expect(consoleWatch.failures).toEqual([]);
  consoleWatch.stop();
  await page.screenshot({ path:'artifacts/final-jolka-1366x768.png', fullPage:true });
});
