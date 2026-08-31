import { test, expect } from '@playwright/test';
import fs from 'node:fs';

const baseURL = process.env.BASE_URL || 'http://127.0.0.1:4173';
fs.mkdirSync('artifacts', { recursive:true });

const demos = [
  { slug:'praziarnicka', chips:'.pz13-chip', launcher:'#pz13-open', advisor:'.pz13-mode button[data-mode="advisor"]', chat:'.pz13-mode button[data-mode="chat"]', option:'.pz13-option', question:'.pz13-advisor__body', panel:'#pz13-widget' },
  { slug:'diamonds', chips:'.quick-grid button', launcher:'#launcherButton', advisor:'.mode-switch button[data-mode="advisor"]', chat:'.mode-switch button[data-mode="chat"]', option:'.answer-card', question:'#advisorContent', panel:'#widget' },
  { slug:'kaffa', chips:'.kf-chip', launcher:'#launcher', advisor:'.kf-switch button[data-view="advisor"]', chat:'.kf-switch button[data-view="chat"]', option:'.kf-option', question:'.kf-stage', panel:'.kf-panel' },
  { slug:'vitazov', chips:'.chip', launcher:'#openWidget', advisor:'.mode__button[data-mode="advisor"],.mode-switch button[data-mode="advisor"]', chat:'.mode__button[data-mode="chat"],.mode-switch button[data-mode="chat"]', option:'#advisorBody .option', question:'#advisorBody', panel:'#widget' },
  { slug:'concept', chips:'.chip', launcher:'#openWidget', advisor:'.mode__button[data-mode="advisor"],.mode-switch button[data-mode="advisor"]', chat:'.mode__button[data-mode="chat"],.mode-switch button[data-mode="chat"]', option:'#advisorBody .option', question:'#advisorBody', panel:'#widget' },
  { slug:'jolka', chips:'#chips .chip', path:'/jolka.html', launcher:'#open', advisor:'.mode__button[data-mode="advisor"]', chat:'.mode__button[data-mode="chat"]', option:'#advisor .option', question:'#advisor', panel:'#widget' }
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
  for (const demo of demos) {
    await openDemo(page, demo);
    const owner = page.locator('[data-mcb-page="true"]');
    await expect(owner).toBeVisible();

    // The page says plainly what is on offer. It used to open with a slogan
    // written per roastery ("Poradca, ktorý pozná všetkých päť vašich káv"),
    // which read as an advert rather than as an explanation.
    await expect(owner.locator('.mcb-copy h1')).toHaveText('Kávový poradca na váš web.');
    await expect(owner.locator('.mcb-lead')).toContainText('nevedia, aké kávy máte');

    // The roastery is named by its own lockup and eyebrow. The old repetitive
    // "Pripravené pre…" sales copy was intentionally removed from this pass.
    const named = await owner.evaluate((node) => node.innerText);
    expect(named).not.toContain('Pripravené pre');
    await expect(owner.locator('.mcb-eyebrow')).not.toHaveText('');

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

    // The panel describes what the advisor does; it does not mock up a picker
    // with invented option labels.
    await expect(owner.locator('.mcb-figures li')).toHaveCount(3);
    await expect(owner.locator('.mcb-figures strong').first()).toBeVisible();

    // One price and the way to reach us are on the first screen.
    await expect(owner.locator('.mcb-plan')).toHaveCount(1);
    await expect(owner.locator('.mcb-plan-price strong')).toHaveCount(2);

    // Nothing that reads as a demo, a trial or an install instruction, and
    // nothing promised in the price that is billed separately.
    const text = await owner.innerText();
    expect(text).not.toMatch(/Ukážka pripraven|riadok kódu|&lt;script|zdarma|trial|Návrh AI|umelá inteligencia/i);
    expect(text).not.toMatch(/Priebežné úpravy ponuky/i);

    // One screen: the page must never grow a scrollbar.
    const metrics = await pageMetrics(page);
    expect(metrics.h).toBeLessThanOrEqual(metrics.ih + 1);
    expect(metrics.w).toBeLessThanOrEqual(metrics.iw + 1);
    await page.screenshot({ path:`artifacts/release-${demo.slug}-owner.png`, fullPage:true });
  }
});

test('the panel carries the conversation and nothing else', async ({ page }) => {
  for (const demo of demos) {
    await openDemo(page, demo);
    await page.locator(demo.launcher).first().click();
    await page.waitForTimeout(900);

    // Section captions and a strip of coffees under the greeting were both
    // added and both taken back out: the panel is the conversation, the four
    // quick questions and the composer.
    await expect(page.locator('.mcb-w-caption')).toHaveCount(0);
    await expect(page.locator('.mcs-starter')).toHaveCount(0);

    // Two of the four quick questions ask what the shop page cannot answer.
    const chips = await page.locator(demo.chips).allInnerTexts();
    expect(chips.length).toBeGreaterThanOrEqual(4);
    if (demo.slug === 'kaffa') {
      expect(chips.slice(0, 4)).toEqual(['Espresso blend', 'Niečo na filter', 'Nechcem kyslú', 'Chcem ovocnú']);
    } else {
      expect(chips.slice(0, 4)).toContain('Odkiaľ je káva?');
      expect(chips.slice(0, 4)).toContain('Porovnajte dve kávy');
    }
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
    await expect(owner.locator('.mcb-benefits')).toHaveCount(0);

    // The floating launcher may remain, but its large invitation bubble must
    // not cover pricing, add-on copy or the contact CTA on the one-screen pitch.
    const visibleTeasers = page.locator(
      '[data-mcb-teaser="true"],.launcher__teaser,.launcher-teaser,.teaser,.kf-teaser,.pz13-preview'
    ).filter({ visible:true });
    expect(await visibleTeasers.count()).toBe(0);

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
  test.setTimeout(60_000);
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
