import { test, expect } from '@playwright/test';
import fs from 'node:fs';

/**
 * Pražiareň Jolka only. This suite never touches the shared v8 demos.
 * /api/chat has no static handler under the test server, so chat answers here come
 * from the offline fallback — which is exactly what we want to assert.
 */
const baseURL = process.env.BASE_URL || 'http://127.0.0.1:4173';
const JOLKA = `${baseURL}/jolka.html`;

fs.mkdirSync('artifacts', { recursive: true });

// POST /api/chat has no handler under the static test server; that 501 is the
// fallback path this suite deliberately exercises.
const API_NOISE = /Unsupported method \('POST'\)|Failed to load resource.*(501|404)/;

function watchConsole(page) {
  const failures = [];
  page.on('console', (m) => { if (m.type() === 'error' && !API_NOISE.test(m.text())) failures.push(m.text()); });
  page.on('pageerror', (e) => failures.push(e.message));
  return failures;
}

// Selecting confirms the step and glides on by itself.
async function answer(page, value) {
  const option = page.locator(`.option[data-value="${value}"]`);
  await option.click();
  await expect(option).toHaveClass(/is-selected/);
  await expect(option.locator('.option__copy b')).toBeVisible();
  await page.waitForTimeout(700);
}

async function runAdvisor(page, values) {
  for (const value of values) await answer(page, value);
  await expect(page.locator('.result__headline h2')).toBeVisible();
  return (await page.locator('.result__headline h2').textContent()).trim();
}

test('owner landing carries the real Jolka identity and photography', async ({ page }) => {
  const errors = watchConsole(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(JOLKA, { waitUntil: 'networkidle' });

  await expect(page.locator('h1')).toContainText('Vitajte vo vašom návrhu kávového poradcu');
  await expect(page.locator('.demo-flag')).toContainText('Kávový poradca');
  await expect(page.locator('.hero__hint')).not.toContainText(/Funguje s reálnou ponukou|overenou 8\. 8\. 2026/i);
  await expect(page.locator('.hero__lead')).toContainText('klasickými zmesami a výberovou kávou');
  await expect(page.locator('.benefit')).toHaveCount(3);

  // official wordmark, not a generated companion mark
  await expect(page.locator('.lockup img')).toHaveAttribute('src', '/assets/jolka/logo-ink.webp');

  // real photography on the landing
  const photos = await page.locator('.showcase__photo, .showcase__card img').evaluateAll((els) =>
    els.map((el) => ({ src: el.getAttribute('src'), w: el.naturalWidth }))
  );
  expect(photos.length).toBeGreaterThanOrEqual(2);
  photos.forEach((p) => expect(p.w, `${p.src} failed to decode`).toBeGreaterThan(0));

  // owner-facing benefits, and the third-party attribution stays visible
  await expect(page.locator('.perks li')).toHaveCount(4);
  await expect(page.locator('.page__by')).toContainText('mojchatbot.sk');

  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(1440);
  await page.screenshot({ path: 'artifacts/jolka-desktop-landing.png' });
  expect(errors).toEqual([]);
});

test('advisor is four weighted steps and lands on a real product page', async ({ page }) => {
  const errors = watchConsole(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(JOLKA, { waitUntil: 'networkidle' });
  await page.locator('#heroOpen').click();
  await expect(page.locator('#widget')).toHaveClass(/is-open/);

  // advisor is the default mode, not chat
  await expect(page.locator('#advisorScreen')).toHaveClass(/is-active/);
  await expect(page.locator('#stepTitle')).toHaveText('Krok 1 zo 4');
  await expect(page.locator('.option')).toHaveCount(4);
  await expect(page.locator('.option__visual img')).toHaveCount(4);

  await answer(page, 'fruity');
  await expect(page.locator('#stepTitle')).toHaveText('Krok 2 zo 4');
  await expect(page.locator('.option__visual img')).toHaveCount(4);
  await answer(page, 'filter');
  await expect(page.locator('.option__visual img')).toHaveCount(3);
  await answer(page, 'black');
  await expect(page.locator('.option__visual img')).toHaveCount(4);
  await answer(page, 'bright');

  await expect(page.locator('.result__headline h2')).toHaveText('Ethiopia SIDAMO GR.2');
  await expect(page.locator('.result__photo')).toBeVisible();
  await expect(page.locator('.result__price b')).toHaveText('14,00 €');
  await expect(page.locator('.fact__value .dots i.on')).toHaveCount(4);
  await expect(page.locator('#productCta')).toHaveAttribute(
    'href',
    'https://www.praziarenjolka.sk/produkt/ethiopia-sidamo/'
  );

  // buy CTA is reachable without scrolling
  const cta = await page.locator('#productCta').boundingBox();
  const widget = await page.locator('#widget').boundingBox();
  expect(cta.y + cta.height).toBeLessThanOrEqual(widget.y + widget.height + 1);

  await page.screenshot({ path: 'artifacts/jolka-desktop-result.png' });
  expect(errors).toEqual([]);
});

test('scoring separates classic, milk, balanced, fruity and experimental', async ({ page }) => {
  // Five full advisor runs, each on a fresh load. The recommendation now lands
  // after a deliberate "Premýšľam…" beat, which adds about three seconds across
  // the five and pushed this past the default budget. The assertions below are
  // about scoring, not speed.
  test.setTimeout(60_000);
  await page.setViewportSize({ width: 1440, height: 900 });
  const results = [];
  for (const values of [
    ['chocolate', 'automat', 'milk', 'none'],
    ['bold', 'lever', 'milk', 'none'],
    ['balanced', 'moka', 'black', 'mild'],
    ['fruity', 'filter', 'black', 'bright'],
    ['fruity', 'filter', 'black', 'explore']
  ]) {
    await page.goto(JOLKA, { waitUntil: 'domcontentloaded' });
    await page.locator('#heroOpen').click();
    results.push(await runAdvisor(page, values));
  }
  expect(new Set(results).size).toBe(5);
  expect(results[4]).toBe('Vietnam Lang Biang');
});

test('back keeps the answer, alternative swaps the product, reset clears everything', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(JOLKA, { waitUntil: 'networkidle' });
  await page.locator('#heroOpen').click();

  await expect(page.locator('#back')).toBeDisabled();
  await expect(page.locator('#back')).toContainText('Späť');
  await answer(page, 'chocolate');
  await expect(page.locator('#stepTitle')).toHaveText('Krok 2 zo 4');

  await page.locator('#back').click();
  await expect(page.locator('#stepTitle')).toHaveText('Krok 1 zo 4');
  await expect(page.locator('.option.is-selected')).toHaveCount(1);
  await expect(page.locator('.option.is-selected')).toHaveAttribute('data-value', 'chocolate');

  await answer(page, 'chocolate');
  await answer(page, 'automat');
  await answer(page, 'milk');
  await answer(page, 'none');

  const first = await page.locator('.result__headline h2').textContent();
  const altName = (await page.locator('.alt__card b').textContent()).trim();
  await page.locator('.alt__card').click();
  await expect(page.locator('.result__headline h2')).toHaveText(altName);
  expect(altName).not.toBe(first.trim());

  await page.locator('#reset').click();
  await expect(page.locator('#stepTitle')).toHaveText('Krok 1 zo 4');
  await expect(page.locator('.option.is-selected')).toHaveCount(0);
});

test('chat has four large chips, removes the handoff after first message, and answers offline', async ({ page }) => {
  const errors = watchConsole(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(JOLKA, { waitUntil: 'networkidle' });
  await page.locator('#heroOpen').click();
  await page.locator('.mode__button[data-mode="chat"]').click();

  await expect(page.locator('.chip')).toHaveCount(4);
  await expect(page.locator('.chip')).toHaveText([
    'Nízka acidita',
    'Káva na cappuccino',
    'Ovocný filter',
    'Niečo netradičné'
  ]);
  const heights = await page.locator('.chip').evaluateAll((els) => els.map((e) => e.getBoundingClientRect().height));
  heights.forEach((h) => expect(h).toBeGreaterThanOrEqual(44));

  // no phone / e-mail / contact row anywhere
  const body = await page.locator('body').innerHTML();
  expect(body).not.toMatch(/tel:|mailto:/);
  await expect(page.locator('.widget__note')).toContainText('mojchatbot.sk');

  // welcome conversation is visually above the optional handoff
  await expect(page.locator('.msg .bubble')).toHaveCount(1);
  await expect(page.locator('#entry')).toBeVisible();
  const chatY = (await page.locator('#chat').boundingBox()).y;
  const entryY = (await page.locator('#entry').boundingBox()).y;
  expect(chatY).toBeLessThan(entryY);

  // A quick chip is a real user message too: handoff disappears immediately.
  await page.locator('.chip').nth(3).click();
  await expect(page.locator('.msg--user .bubble')).toHaveText('Niečo netradičné');
  await expect(page.locator('#entry')).toBeHidden();
  await expect(page.locator('.msg:not(.msg--user) .bubble').last()).toContainText('Vietnam Lang Biang', { timeout: 5000 });

  // The persistent top switch is now the only route back to the advisor.
  await expect(page.locator('.mode__button[data-mode="advisor"]')).toBeVisible();
  await page.locator('.mode__button[data-mode="advisor"]').click();
  await expect(page.locator('#advisorScreen')).toHaveClass(/is-active/);
  expect(errors).toEqual([]);
});

test('dialog semantics: escape, focus return, focus trap and scroll lock', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(JOLKA, { waitUntil: 'networkidle' });

  await expect(page.locator('#widget')).toHaveAttribute('aria-hidden', 'true');
  await page.locator('#open').click();
  await expect(page.locator('#widget')).toHaveAttribute('aria-hidden', 'false');
  await expect(page.locator('#open')).toHaveAttribute('aria-expanded', 'true');
  expect(await page.evaluate(() => getComputedStyle(document.body).overflow)).toBe('hidden');

  for (let i = 0; i < 14; i++) {
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => !!document.activeElement?.closest('#widget'))).toBe(true);
  }

  await page.keyboard.press('Escape');
  await expect(page.locator('#widget')).toHaveAttribute('aria-hidden', 'true');
  expect(await page.evaluate(() => document.activeElement?.id)).toBe('open');
  // The page behind the widget is a single screen and never scrolls, so the
  // release of the dialog's lock is the marker coming off the body — not a
  // scrollbar reappearing.
  expect(await page.evaluate(() => document.body.classList.contains('mcb-dialog-open'))).toBe(false);
  const rest = await page.evaluate(() => ({
    scrollHeight: document.scrollingElement.scrollHeight,
    innerHeight: window.innerHeight
  }));
  expect(rest.scrollHeight).toBeLessThanOrEqual(rest.innerHeight + 1);
});

for (const [width, height] of [[390, 844], [360, 800]]) {
  test(`mobile ${width}x${height}: fullscreen, no overflow, CTA and send reachable`, async ({ page }) => {
    const errors = watchConsole(page);
    await page.setViewportSize({ width, height });
    await page.goto(JOLKA, { waitUntil: 'networkidle' });
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);

    await page.locator('#open').click();
    await expect(page.locator('#widget')).toHaveClass(/is-open/);
    await page.waitForTimeout(400); // let the opening transform settle before measuring
    const box = await page.locator('#widget').boundingBox();
    expect(Math.round(box.width)).toBe(width);
    expect(Math.round(box.x)).toBe(0);
    expect(await page.evaluate(() => document.activeElement?.id)).not.toBe('input');

    await runAdvisor(page, ['chocolate', 'automat', 'milk', 'none']);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    await expect(page.locator('#productCta')).toBeVisible();

    await page.locator('.mode__button[data-mode="chat"]').click();
    await expect(page.locator('.send')).toBeVisible();
    const chips = await page.locator('.chip').evaluateAll((els) => els.map((e) => e.getBoundingClientRect().height));
    chips.forEach((h) => expect(h).toBeGreaterThanOrEqual(44));
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);

    await page.screenshot({ path: `artifacts/jolka-mobile-${width}.png` });
    expect(errors).toEqual([]);
  });
}

test('every advisor step is photographic and fits its pane without scrolling', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(JOLKA, { waitUntil: 'networkidle' });
  await page.locator('#heroOpen').click();
  for (const value of ['chocolate', 'automat', 'milk', 'none']) {
    const state = await page.evaluate(() => {
      const a = document.querySelector('#advisor');
      const imgs = [...a.querySelectorAll('.option__visual img')];
      return {
        spill: a.scrollHeight - a.clientHeight,
        options: a.querySelectorAll('.option').length,
        decoded: imgs.filter((i) => i.complete && i.naturalWidth > 0).length
      };
    });
    expect(state.spill, `step ${value} overflows its pane`).toBeLessThanOrEqual(0);
    expect(state.decoded, `step ${value} is missing photos`).toBe(state.options);
    await answer(page, value);
  }
});

test('no nested interactive elements and no text below 11px', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(JOLKA, { waitUntil: 'networkidle' });
  await page.locator('#open').click();
  await runAdvisor(page, ['fruity', 'filter', 'black', 'explore']);

  expect(await page.evaluate(() => document.querySelectorAll('button button, button a, a button').length)).toBe(0);
  const tiny = await page.evaluate(() =>
    [...document.querySelectorAll('body *')]
      .filter((el) => el.children.length === 0 && el.textContent.trim())
      .map((el) => parseFloat(getComputedStyle(el).fontSize))
      .filter((size) => size < 11)
  );
  expect(tiny).toEqual([]);
});
