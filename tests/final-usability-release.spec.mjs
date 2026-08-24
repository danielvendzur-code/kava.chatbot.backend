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
  // The generic `.mc-owner` page was replaced by the per-roastery presentation
  // built in coffee-owner-brand.js, which marks its root with data-mcb-page.
  await page.waitForFunction(() => document.querySelector('[data-mcb-page="true"]') !== null);
  await page.waitForFunction(() => [...document.styleSheets].some((sheet) => String(sheet.href || '').includes('coffee-header-cleanup.css')));
  await page.waitForTimeout(180);
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

async function pageMetrics(page) {
  return page.evaluate(() => ({
    h:document.scrollingElement.scrollHeight,
    ih:innerHeight,
    w:document.scrollingElement.scrollWidth,
    iw:innerWidth
  }));
}

test('every owner page is that roastery\'s own, with a visible primary action', async ({ page }) => {
  // The six demos used to share one page whose only per-brand element was the
  // logo. Each headline is now written for that roastery, so no two pages may
  // open with the same one.
  const headlines = new Set();

  for (const demo of demos) {
    await openDemo(page, demo);
    const owner = page.locator('[data-mcb-page="true"]');
    await expect(owner).toBeVisible();

    const headline = (await owner.locator('.mcb-copy h1').innerText()).trim();
    expect(headline.length).toBeGreaterThan(0);
    expect(headlines.has(headline)).toBe(false);
    headlines.add(headline);

    // The primary action was rendering white on a transparent background,
    // which made it invisible on four of the six demos.
    const primary = owner.locator('[data-release-open="advisor"]').first();
    await expect(primary).toBeVisible();
    const paint = await primary.evaluate((node) => {
      const style = getComputedStyle(node);
      return { background: style.backgroundColor, color: style.color };
    });
    expect(paint.background).not.toBe('rgba(0, 0, 0, 0)');
    expect(paint.background).not.toBe('transparent');
    expect(paint.color).not.toBe(paint.background);

    await expect(owner.locator('[data-release-open="chat"]').first()).toBeVisible();
    await expect(owner.locator('a[href*="mojchatbot.sk/kontakt"]').first()).toBeVisible();

    // The customer clicks through a picker; the visual says so rather than
    // showing a typed question or a product photograph.
    await expect(owner.locator('.mcb-preview-options li')).toHaveCount(4);
    await expect(owner.locator('.mcb-preview-options li.is-picked')).toHaveCount(1);
    await expect(owner.locator('.mcb-preview-result')).toBeVisible();

    // Benefits, price and the way to reach us are all on the first screen.
    await expect(owner.locator('.mcb-benefits li').first()).toBeVisible();
    await expect(owner.locator('.mcb-plan')).toHaveCount(2);
    await expect(owner.locator('.mcb-plan-price strong').first()).toBeVisible();

    // Nothing that reads as a demo, a trial or an install instruction.
    const text = await owner.innerText();
    expect(text).not.toMatch(/Ukážka pripraven|riadok kódu|&lt;script|zdarma|trial|Návrh AI|umelá inteligencia/i);

    // One screen: the page must never grow a scrollbar.
    const metrics = await pageMetrics(page);
    expect(metrics.h).toBeLessThanOrEqual(metrics.ih + 1);
    expect(metrics.w).toBeLessThanOrEqual(metrics.iw + 1);
    await page.screenshot({ path:`artifacts/release-${demo.slug}-owner.png`, fullPage:true });
  }
});

test('every owner page stays readable and contained on a phone', async ({ page }) => {
  for (const demo of demos) {
    await openDemo(page, demo, { width:390, height:844 });
    const owner = page.locator('[data-mcb-page="true"]');
    await expect(owner.locator('.mcb-lockup')).toBeVisible();
    await expect(owner.locator('[data-release-open="advisor"]').first()).toBeVisible();
    await expect(owner.locator('[data-release-open="chat"]').first()).toBeVisible();
    await expect(owner.locator('.mcb-plan').first()).toBeVisible();
    await expect(owner.locator('.mcb-foot')).toBeVisible();

    // No explanatory text on this surface drops below 11 px.
    const sizes = await owner.locator('p, b, small, span, em, li, h1, button, a').evaluateAll((nodes) =>
      nodes.filter((node) => {
        const style = getComputedStyle(node);
        return style.display !== 'none' && style.visibility !== 'hidden' && node.textContent.trim();
      }).map((node) => parseFloat(getComputedStyle(node).fontSize))
    );
    expect(Math.min(...sizes)).toBeGreaterThanOrEqual(11);

    const metrics = await pageMetrics(page);
    expect(metrics.h).toBeLessThanOrEqual(metrics.ih + 1);
    expect(metrics.w).toBeLessThanOrEqual(metrics.iw + 1);
    await page.screenshot({ path:`artifacts/release-${demo.slug}-owner-mobile.png`, fullPage:true });
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

test('Praziarnicka header logo no longer sits inside a visible white tile', async ({ page }) => {
  const demo = demos[0];
  await openDemo(page, demo, { width:390, height:844 });
  await page.locator(demo.launcher).click();
  const head = page.locator('.pz13-widget__head');
  const logo = page.locator('.pz13-widget__brand > img');
  const cta = page.locator('.pz13-advisor-entry');
  await expect(cta).toBeVisible();
  await expect(logo).toBeVisible();

  const headStyle = await head.evaluate(node => ({
    bg:getComputedStyle(node).backgroundColor,
    border:parseFloat(getComputedStyle(node).borderBottomWidth)
  }));
  const logoStyle = await logo.evaluate(node => ({
    blend:getComputedStyle(node).mixBlendMode,
    bg:getComputedStyle(node).backgroundColor,
    border:parseFloat(getComputedStyle(node).borderTopWidth),
    fit:getComputedStyle(node).objectFit
  }));
  const ctaBorder = await cta.evaluate(node => parseFloat(getComputedStyle(node).borderTopWidth));
  const stageColor = await page.locator('.pz13-stage').evaluate(node => getComputedStyle(node).backgroundColor);

  expect(headStyle.bg).toMatch(/rgb\(255, 255, 255\)/);
  expect(headStyle.border).toBeGreaterThanOrEqual(1);
  expect(logoStyle.blend).toBe('multiply');
  expect(logoStyle.bg).toMatch(/rgba?\(0, 0, 0, 0\)/);
  expect(logoStyle.border).toBe(0);
  expect(logoStyle.fit).toBe('contain');
  expect(ctaBorder).toBeGreaterThanOrEqual(1);
  expect(stageColor).toMatch(/rgb\(255, 255, 255\)/);
  await page.screenshot({ path:'artifacts/release-praziarnicka-chat-mobile-final.png', fullPage:true });
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
