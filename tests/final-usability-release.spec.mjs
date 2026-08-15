import { test, expect } from '@playwright/test';
import fs from 'node:fs';

const baseURL = process.env.BASE_URL || 'http://127.0.0.1:4173';
fs.mkdirSync('artifacts', { recursive:true });

const demos = [
  { slug:'praziarnicka', launcher:'#pz13-open', advisor:'.pz13-mode button[data-mode="advisor"]', chat:'.pz13-mode button[data-mode="chat"]', option:'.pz13-option', question:'.pz13-advisor__body', panel:'#pz13-widget' },
  { slug:'diamonds', launcher:'#launcherButton', advisor:'.mode-switch button[data-mode="advisor"]', chat:'.mode-switch button[data-mode="chat"]', option:'.answer-card', question:'#advisorContent', panel:'#widget' },
  { slug:'kaffa', launcher:'#launcher', advisor:'.kf-switch button[data-view="advisor"]', chat:'.kf-switch button[data-view="chat"]', option:'.kf-option', question:'.kf-stage', panel:'.kf-panel' },
  { slug:'vitazov', launcher:'#openWidget', advisor:'.mode__button[data-mode="advisor"],.mode-switch button[data-mode="advisor"]', chat:'.mode__button[data-mode="chat"],.mode-switch button[data-mode="chat"]', option:'#advisorBody .option', question:'#advisorBody', panel:'#widget' },
  { slug:'concept', launcher:'#openWidget', advisor:'.mode__button[data-mode="advisor"],.mode-switch button[data-mode="advisor"]', chat:'.mode__button[data-mode="chat"],.mode-switch button[data-mode="chat"]', option:'#advisorBody .option', question:'#advisorBody', panel:'#widget' },
  { slug:'jolka', path:'/jolka.html', launcher:'#open', advisor:'.mode__button[data-mode="advisor"]', chat:'.mode__button[data-mode="chat"]', option:'#advisor .option', question:'#advisor', panel:'#widget' }
];

async function openDemo(page, demo, viewport = { width:1366, height:768 }) {
  await page.setViewportSize(viewport);
  await page.goto(demo.path ? `${baseURL}${demo.path}` : `${baseURL}/?demo=${demo.slug}`, { waitUntil:'networkidle' });
  await page.waitForFunction(() => document.documentElement.dataset.coffeeRelease === '2026-08-final');
  await page.waitForFunction(() => document.querySelector('.mc-owner')?.dataset.ownerConversion === 'ready');
  await page.waitForTimeout(120);
}

async function noOverflow(locator, tolerance = 3) {
  return locator.evaluate((node, t) => ({
    ok: node.scrollHeight <= node.clientHeight + t,
    scrollHeight:node.scrollHeight,
    clientHeight:node.clientHeight,
    scrollWidth:node.scrollWidth,
    clientWidth:node.clientWidth
  }), tolerance);
}

test('all six owner pages stay minimal, clear and AI-free', async ({ page }) => {
  for (const demo of demos) {
    await openDemo(page, demo);
    const owner = page.locator('.mc-owner');
    await expect(owner).toBeVisible();
    await expect(owner).toContainText('Pomôžte zákazníkovi');
    await expect(owner).toContainText('vybrať správnu kávu');
    await expect(owner).toContainText('Vyskúšať Výber kávy');
    await expect(owner).toContainText('Skúsiť Chat');
    await expect(owner.locator('.mc-owner-head-cta[href*="mojchatbot.sk/kontakt"]')).toBeVisible();
    const text = await owner.innerText();
    expect(text).not.toMatch(/2\s*spôsoby pomoci|4\s*krátke kroky|1\s*konkrétny produkt/i);
    expect(text).not.toMatch(/Predajná pomoc priamo na vašom webe|Ukážka pre váš web/i);
    expect(text).not.toMatch(/Návrh AI|umelá inteligencia|overen[áou]\s+\d|match|zhoda\s*·\s*\d+\s*%/i);
    const pageMetrics = await page.evaluate(() => ({ h:document.scrollingElement.scrollHeight, ih:innerHeight, w:document.scrollingElement.scrollWidth, iw:innerWidth }));
    expect(pageMetrics.h).toBeLessThanOrEqual(pageMetrics.ih + 1);
    expect(pageMetrics.w).toBeLessThanOrEqual(pageMetrics.iw + 1);
    await page.screenshot({ path:`artifacts/release-${demo.slug}-owner.png`, fullPage:true });
  }
});

test('minimal owner CTA stays readable on mobile', async ({ page }) => {
  for (const demo of demos) {
    await openDemo(page, demo, { width:390, height:844 });
    const owner = page.locator('.mc-owner');
    await expect(owner.locator('.mc-owner-head-cta')).toBeVisible();
    await expect(owner.locator('[data-release-open="advisor"]')).toBeVisible();
    const sizes = await owner.locator('.mc-owner-head-cta, .mc-owner-actions button, .mc-owner-benefits b, .mc-owner-foot').evaluateAll((nodes) =>
      nodes.filter((node) => {
        const style = getComputedStyle(node);
        return style.display !== 'none' && style.visibility !== 'hidden';
      }).map((node) => parseFloat(getComputedStyle(node).fontSize))
    );
    expect(Math.min(...sizes)).toBeGreaterThanOrEqual(10.5);
    const metrics = await page.evaluate(() => ({ w:document.scrollingElement.scrollWidth, iw:innerWidth }));
    expect(metrics.w).toBeLessThanOrEqual(metrics.iw + 1);
  }
});

test('all six advisors keep every question inside one screen', async ({ page }) => {
  for (const demo of demos) {
    await openDemo(page, demo, { width:390, height:844 });
    await page.locator(demo.launcher).click();
    await expect(page.locator(demo.panel)).toBeVisible();
    await page.locator(demo.advisor).first().click();

    for (let step = 0; step < 4; step += 1) {
      const question = page.locator(demo.question).first();
      await expect(question).toBeVisible();
      const metrics = await noOverflow(question);
      expect(metrics.ok, `${demo.slug} step ${step + 1}: ${JSON.stringify(metrics)}`).toBeTruthy();
      const options = page.locator(demo.option).filter({ visible:true });
      expect(await options.count()).toBeGreaterThanOrEqual(2);
      const first = options.first();
      const box = await first.boundingBox();
      expect(box.height).toBeGreaterThanOrEqual(48);
      await first.click();
      await page.waitForTimeout(720);
    }

    await page.screenshot({ path:`artifacts/release-${demo.slug}-result-mobile.png`, fullPage:true });
  }
});

test('Diamonds controls are genuinely clickable and conversation starts near the top', async ({ page }) => {
  const demo = demos.find(item => item.slug === 'diamonds');
  await openDemo(page, demo, { width:390, height:844 });
  await page.locator(demo.launcher).click();
  await expect(page.locator('#widget')).toHaveAttribute('aria-hidden', 'false');
  await page.locator(demo.chat).click();
  const panelBox = await page.locator('#widget').boundingBox();
  const messagesBox = await page.locator('.chat-messages').boundingBox();
  expect(messagesBox.y).toBeLessThan(panelBox.y + panelBox.height * .45);
  await page.locator(demo.advisor).click();
  await expect(page.locator('.answer-card').first()).toBeVisible();
  await page.locator('.answer-card').first().click();
  await page.waitForTimeout(420);
  await expect(page.locator('#backButton')).toBeEnabled();
});

test('Praziarnicka has clear separation and an opaque chat surface', async ({ page }) => {
  const demo = demos[0];
  await openDemo(page, demo, { width:390, height:844 });
  await page.locator(demo.launcher).click();
  const head = page.locator('.pz13-widget__head');
  const cta = page.locator('.pz13-advisor-entry');
  await expect(cta).toBeVisible();
  const headBorder = await head.evaluate(node => parseFloat(getComputedStyle(node).borderBottomWidth));
  const ctaBorder = await cta.evaluate(node => parseFloat(getComputedStyle(node).borderTopWidth));
  const stageColor = await page.locator('.pz13-stage').evaluate(node => getComputedStyle(node).backgroundColor);
  expect(headBorder).toBeGreaterThanOrEqual(1);
  expect(ctaBorder).toBeGreaterThanOrEqual(1);
  expect(stageColor).toMatch(/rgb\(255, 255, 255\)/);
});

test('Kaffa brand and controls are readable and Victory composer stays polished', async ({ page }) => {
  const kaffa = demos.find(item => item.slug === 'kaffa');
  await openDemo(page, kaffa, { width:390, height:844 });
  await page.locator(kaffa.launcher).click();
  await expect(page.locator('.kf-widget-brand .kf-wordmark')).toBeVisible();
  const chipFont = await page.locator('.kf-chip').first().evaluate(node => parseFloat(getComputedStyle(node).fontSize));
  expect(chipFont).toBeGreaterThanOrEqual(11);
  const teaserFont = await page.locator('.kf-teaser span').evaluate(node => parseFloat(getComputedStyle(node).fontSize));
  expect(teaserFont).toBeGreaterThanOrEqual(11);

  const victory = demos.find(item => item.slug === 'vitazov');
  await openDemo(page, victory, { width:390, height:844 });
  await page.locator(victory.launcher).click();
  const input = page.locator('#chatInput');
  await expect(input).toBeVisible();
  const inputFont = await input.evaluate(node => parseFloat(getComputedStyle(node).fontSize));
  expect(inputFont).toBeGreaterThanOrEqual(13);
});

test('Jolka keeps coffee selection at the top, uncropped badge and softened header', async ({ page }) => {
  const jolka = demos.find(item => item.slug === 'jolka');
  await openDemo(page, jolka, { width:390, height:844 });
  await page.locator(jolka.launcher).click();
  const logo = page.locator('.widget__brand > img');
  await expect(logo).toHaveAttribute('src', '/assets/jolka/logo-badge.webp');
  const fit = await logo.evaluate(node => ({ fit:getComputedStyle(node).objectFit, w:node.getBoundingClientRect().width, h:node.getBoundingClientRect().height }));
  expect(fit.fit).toBe('contain');
  expect(fit.w).toBeGreaterThanOrEqual(42);
  expect(fit.h).toBeGreaterThanOrEqual(42);
  const headerBg = await page.locator('.widget__header').evaluate(node => getComputedStyle(node).backgroundImage);
  expect(headerBg).toContain('linear-gradient');

  await page.locator(jolka.chat).click();
  const entry = page.locator('#entry');
  const chat = page.locator('#chat');
  await expect(entry).toBeVisible();
  const entryBox = await entry.boundingBox();
  const chatBox = await chat.boundingBox();
  expect(entryBox.y).toBeLessThan(chatBox.y + 2);
  await page.locator(jolka.advisor).click();
  for (let i = 0; i < 4; i += 1) {
    await page.locator('#advisor .option').filter({ visible:true }).first().click();
    await page.waitForTimeout(720);
  }
  const badge = page.locator('.result__badge');
  if (await badge.count()) await expect(badge).not.toContainText(/\d+\s*%/);
});
