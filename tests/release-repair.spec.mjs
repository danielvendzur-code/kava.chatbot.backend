import { test, expect } from '@playwright/test';

const baseURL = process.env.BASE_URL || 'http://127.0.0.1:4173';

const demos = [
  {
    slug: 'praziarnicka', url: '/?demo=praziarnicka', launcher: '#pz13-open', panel: '#pz13-widget',
    chatMode: '.pz13-mode button[data-mode="chat"]', advisorMode: '.pz13-mode button[data-mode="advisor"]',
    advisorPane: '.pz13-advisor__body', options: '.pz13-option', input: '#pz13-input', messages: '#pz13-messages', rows: '.pz13-message',
    composer: '.pz13-composer'
  },
  {
    slug: 'diamonds', url: '/?demo=diamonds', launcher: '#launcherButton', panel: '#widget',
    chatMode: '.mode-switch button[data-mode="chat"]', advisorMode: '.mode-switch button[data-mode="advisor"]',
    advisorPane: '.advisor-content', options: '.answer-card', input: '#chatInput', messages: '#chatMessages', rows: '.chat-line',
    composer: '.composer'
  },
  {
    slug: 'kaffa', url: '/?demo=kaffa', launcher: '#launcher', panel: '.kf-panel',
    chatMode: '.kf-switch button[data-view="chat"]', advisorMode: '.kf-switch button[data-view="advisor"]',
    advisorPane: '.kf-stage', options: '.kf-option', input: '#chatInput', messages: '#messages', rows: '.kf-message-row',
    composer: '.kf-composer'
  },
  {
    slug: 'vitazov', url: '/?demo=vitazov', launcher: '#openWidget', panel: '#widget',
    chatMode: '.mode__button[data-mode="chat"]', advisorMode: '.mode__button[data-mode="advisor"]',
    advisorPane: '#advisorBody', options: '#advisorBody .option', input: '#chatInput', messages: '#chatMessages', rows: '.message',
    composer: '.composer'
  },
  {
    slug: 'concept', url: '/?demo=concept', launcher: '#openWidget', panel: '#widget',
    chatMode: '.mode__button[data-mode="chat"]', advisorMode: '.mode__button[data-mode="advisor"]',
    advisorPane: '.advisor', options: '.advisor .option', input: '#chatInput', messages: '#chatMessages', rows: '.message',
    composer: '.composer__shell'
  },
  {
    slug: 'jolka', url: '/jolka.html', launcher: '#open', panel: '#widget',
    chatMode: '.mode__button[data-mode="chat"]', advisorMode: '.mode__button[data-mode="advisor"]',
    advisorPane: '#advisor', options: '#advisor .option', input: '#input', messages: '#chat', rows: '.msg',
    composer: '.composer__field'
  }
];

async function ready(page, demo, viewport = { width: 390, height: 844 }) {
  await page.setViewportSize(viewport);
  await page.goto(`${baseURL}${demo.url}`, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.body.dataset.coffeeFinal && document.documentElement.dataset.coffeeReleaseReady === 'true');
  await page.waitForTimeout(420);
}

async function openMode(page, demo, mode) {
  await page.locator(demo.launcher).click({ force: true });
  await expect(page.locator(demo.panel)).toBeVisible();
  await page.waitForTimeout(480);
  const selector = mode === 'advisor' ? demo.advisorMode : demo.chatMode;
  await page.locator(selector).click({ force: true });
  await page.waitForTimeout(220);
}

function rgb(value) {
  return (value.match(/[\d.]+/g) || []).slice(0, 3).map(Number);
}

function luminance([r = 0, g = 0, b = 0]) {
  const channel = (value) => {
    const v = value / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrast(foreground, background) {
  const a = luminance(rgb(foreground));
  const b = luminance(rgb(background));
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

test('Praziarnicka active Chat pill has readable text', async ({ page }) => {
  const demo = demos[0];
  await ready(page, demo);
  await openMode(page, demo, 'chat');
  const button = page.locator(demo.chatMode);
  const paint = await button.evaluate((node) => {
    const style = getComputedStyle(node);
    return { color: style.color, background: style.backgroundColor };
  });
  const switchBackground = await page.locator('.pz13-mode').evaluate((node) => getComputedStyle(node).backgroundColor);
  const effectiveBackground = paint.background === 'rgba(0, 0, 0, 0)' ? switchBackground : paint.background;
  expect(contrast(paint.color, effectiveBackground)).toBeGreaterThanOrEqual(4.5);
});

for (const demo of demos) {
  test(`${demo.slug}: first advisor decision fits without scrolling`, async ({ page }) => {
    await ready(page, demo);
    await openMode(page, demo, 'advisor');
    const pane = page.locator(demo.advisorPane).first();
    await expect(pane).toBeVisible();
    await expect(page.locator(demo.options).first()).toBeVisible();

    const metrics = await pane.evaluate((node) => ({
      clientHeight: node.clientHeight,
      scrollHeight: node.scrollHeight,
      scrollTop: node.scrollTop,
      rect: node.getBoundingClientRect().toJSON()
    }));
    const lastBox = await page.locator(demo.options).last().boundingBox();
    const panelBox = await page.locator(demo.panel).boundingBox();

    expect(metrics.scrollTop, `${demo.slug}: initial advisor is pre-scrolled`).toBe(0);
    expect(metrics.scrollHeight - metrics.clientHeight, `${demo.slug}: first decision requires vertical scrolling`).toBeLessThanOrEqual(3);
    expect(lastBox.y + lastBox.height, `${demo.slug}: last option is clipped`).toBeLessThanOrEqual(panelBox.y + panelBox.height + 1);
    expect(panelBox.height, `${demo.slug}: panel exceeds the viewport`).toBeLessThanOrEqual(844.5);
  });
}

for (const demo of demos) {
  test(`${demo.slug}: sending keeps the previous conversation visible`, async ({ page }) => {
    await page.route('**/api/chat', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 550));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ reply: 'Testovacia odpoveď z katalógu.' })
      });
    });

    await ready(page, demo);
    await openMode(page, demo, 'chat');

    const messageBox = page.locator(demo.messages).first();
    const initialRows = await page.locator(demo.rows).count();
    expect(initialRows).toBeGreaterThanOrEqual(1);

    const firstRow = page.locator(demo.rows).first();
    const initialText = (await firstRow.textContent())?.trim().replace(/\d{1,2}:\d{2}\s*$/, '').trim();
    expect(initialText).toBeTruthy();

    const input = page.locator(demo.input);
    await input.fill('Ktorá káva je vhodná na filter?');
    await input.press('Enter');
    await page.waitForTimeout(120);

    expect(await page.locator(demo.rows).count(), `${demo.slug}: previous rows were replaced while waiting`).toBeGreaterThan(initialRows);
    await expect(firstRow).toContainText(initialText);

    const overlap = await firstRow.evaluate((row, selector) => {
      const container = document.querySelector(selector);
      if (!(container instanceof HTMLElement)) return 0;
      const a = row.getBoundingClientRect();
      const b = container.getBoundingClientRect();
      return Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
    }, demo.messages);
    expect(overlap, `${demo.slug}: typing state pushed all prior context out of view`).toBeGreaterThan(6);

    await page.waitForTimeout(700);
    expect(await page.locator(demo.rows).count(), `${demo.slug}: final reply lost conversation history`).toBeGreaterThanOrEqual(initialRows + 2);
    await expect(firstRow).toContainText(initialText);
    await expect(page.locator(demo.composer).first()).toBeVisible();
  });
}

test('Kaffa follows the approved 468x640 compact chat contract', async ({ page }) => {
  const demo = demos.find((item) => item.slug === 'kaffa');
  await ready(page, demo, { width: 1000, height: 760 });
  await openMode(page, demo, 'chat');

  const box = await page.locator('.kf-panel').boundingBox();
  expect(Math.round(box.width)).toBe(468);
  expect(Math.round(box.height)).toBe(640);

  const chips = page.locator('.kf-chip');
  await expect(chips).toHaveCount(4);
  expect(await chips.allTextContents()).toEqual([
    'Espresso blend',
    'Niečo na filter',
    'Nechcem kyslú',
    'Chcem ovocnú'
  ]);
  await expect(page.locator('.kf-advisor-entry')).toBeVisible();
  await expect(page.locator('.kf-chat-seed .kf-message.bot')).toBeVisible();
  await expect(page.locator('.kf-composer')).toBeVisible();
});

test('Diamonds has a dark branded launcher, light panel and one native teaser close', async ({ page }) => {
  const demo = demos.find((item) => item.slug === 'diamonds');
  await ready(page, demo, { width: 1000, height: 760 });

  await expect(page.locator('.teaser')).toContainText('Nájdite svoju kávu');
  await expect(page.locator('.teaser')).toContainText('4 otázky · jedno odporúčanie');
  const closeControls = page.locator('.teaser button').filter({ has: page.locator('svg') });
  expect(await page.locator('.teaser #teaserClose').count()).toBe(1);
  expect(await closeControls.count()).toBeLessThanOrEqual(1);

  const launcherPaint = await page.locator('#launcherButton').evaluate((node) => {
    const style = getComputedStyle(node);
    return { background: style.backgroundColor, border: style.borderColor, shadow: style.boxShadow };
  });
  expect(luminance(rgb(launcherPaint.background))).toBeLessThan(0.15);
  expect(launcherPaint.shadow).not.toContain('0, 0, 0');

  await openMode(page, demo, 'chat');
  const panelPaint = await page.locator('#widget').evaluate((node) => getComputedStyle(node).backgroundColor);
  expect(luminance(rgb(panelPaint))).toBeGreaterThan(0.8);
  const logo = page.locator('.widget-logo img[src*="diroastery-logo"]');
  await expect(logo).toBeVisible();
  expect((await logo.boundingBox()).width).toBeGreaterThanOrEqual(80);
});

test('Victory has the official logo and four distinct context photos on step one', async ({ page }) => {
  const demo = demos.find((item) => item.slug === 'vitazov');
  await ready(page, demo, { width: 1000, height: 760 });
  await openMode(page, demo, 'advisor');

  const logo = page.locator('.widget-brand img[src*="vitazov-logo"]');
  await expect(logo).toBeVisible();
  expect((await logo.boundingBox()).width).toBeGreaterThanOrEqual(120);

  const photos = page.locator('#advisorBody .option .cf-context-photo');
  await expect(photos).toHaveCount(4);
  const sources = await photos.evaluateAll((nodes) => nodes.map((node) => node.getAttribute('src')));
  expect(new Set(sources).size).toBe(4);
  sources.forEach((source) => expect(source).toMatch(/^\/assets\/jolka\/method\//));
});
