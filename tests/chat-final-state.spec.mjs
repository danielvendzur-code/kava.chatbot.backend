import { test, expect } from '@playwright/test';

const baseURL = process.env.BASE_URL || 'http://127.0.0.1:4173';

const demos = [
  { slug:'praziarnicka', launcher:'#pz13-open', input:'#pz13-input', bot:'.pz13-message--assistant .pz13-bubble', panel:'#pz13-widget', chat:'.pz13-chat' },
  { slug:'diamonds', launcher:'#launcherButton', input:'#chatInput', bot:'.chat-line:not(.chat-line--user) .chat-bubble', panel:'#widget', chat:'#chatScreen' },
  { slug:'kaffa', launcher:'#launcher', input:'#chatInput', bot:'.kf-message.bot', panel:'.kf-panel', chat:'.kf-chat' },
  { slug:'vitazov', launcher:'#openWidget', input:'#chatInput', bot:'.message:not(.message--user) .bubble', panel:'#widget', chat:'#chatScreen' },
  { slug:'concept', launcher:'#openWidget', input:'#chatInput', bot:'.message:not(.message--user) .bubble', panel:'#widget', chat:'#chatScreen' }
];

async function waitForDemo(page, slug) {
  await page.waitForFunction(() => {
    const pz = document.querySelector('#praziarnicka-root');
    const shared = document.querySelector('#coffee-demo-root');
    return Boolean((pz && pz.childElementCount) || (shared && shared.childElementCount));
  });
  if (slug === 'praziarnicka') {
    await page.waitForFunction(() => document.documentElement.dataset.demoReady === 'true');
  } else {
    await page.waitForFunction(() => document.documentElement.dataset.jolkaParity === 'ready');
  }
}

async function visibleNodeStates(page, selector) {
  return page.evaluate((sel) => [...document.querySelectorAll(sel)]
    .filter((node) => {
      if (!node.isConnected || node.getClientRects().length === 0) return false;
      const style = getComputedStyle(node);
      return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity || 1) > 0;
    })
    .map((node) => {
      const style = getComputedStyle(node);
      return {
        text: (node.textContent || '').trim(),
        font: Number.parseFloat(style.fontSize),
        opacity: Number.parseFloat(style.opacity || '1'),
        background: style.backgroundColor,
        color: style.color,
        connected: node.isConnected
      };
    }), selector);
}

function rgb(value) {
  const parts = value?.match(/[\d.]+/g)?.slice(0, 3).map(Number) || [];
  return parts.length === 3 ? parts : null;
}

function luminance(parts) {
  const channel = (value) => {
    const s = value / 255;
    return s <= .03928 ? s / 12.92 : ((s + .055) / 1.055) ** 2.4;
  };
  return .2126 * channel(parts[0]) + .7152 * channel(parts[1]) + .0722 * channel(parts[2]);
}

function contrast(foreground, background) {
  const fg = rgb(foreground);
  const bg = rgb(background);
  if (!fg || !bg) return 21;
  const a = luminance(fg);
  const b = luminance(bg);
  return (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
}

for (const demo of demos) {
  test(`${demo.slug} chat settles to a readable final reply`, async ({ page }) => {
    await page.setViewportSize({ width:1366, height:768 });
    await page.goto(`${baseURL}/?demo=${demo.slug}`, { waitUntil:'networkidle' });
    await waitForDemo(page, demo.slug);
    await page.locator(demo.launcher).click({ force:true });

    await expect(page.locator(demo.panel)).toBeVisible();
    await expect(page.locator(demo.chat)).toBeVisible();
    const input = page.locator(demo.input);
    await expect(input).toBeVisible({ timeout:5000 });

    const chips = page.locator('.pz13-chip,.pz-chip,#quickChips .chip,#quickChips button,.kf-chip').filter({ visible:true });
    expect(await chips.count()).toBeGreaterThanOrEqual(4);
    const chipFont = await chips.first().evaluate((node) => Number.parseFloat(getComputedStyle(node).fontSize));
    expect(chipFont).toBeGreaterThanOrEqual(11);

    const initialTexts = new Set((await visibleNodeStates(page, demo.bot)).map((state) => state.text));

    await input.fill('Akú kávu do automatu?');
    await input.press('Enter');

    let finalState = null;
    await expect.poll(async () => {
      const states = await visibleNodeStates(page, demo.bot);
      const candidate = states.findLast((state) =>
        state.connected &&
        !initialTexts.has(state.text) &&
        Number.isFinite(state.font) &&
        state.font >= 12 &&
        Number.isFinite(state.opacity) &&
        state.opacity >= .95 &&
        state.text.length > 20 &&
        !/Premýšľam|Načítavam|Pripravujem|\.\.\.|…/i.test(state.text)
      );
      if (!candidate) return false;
      finalState = candidate;
      return true;
    }, { timeout:6000, intervals:[100, 180, 300, 450] }).toBeTruthy();

    expect(finalState).not.toBeNull();
    expect(finalState.connected).toBeTruthy();
    expect(finalState.font).toBeGreaterThanOrEqual(12);
    expect(finalState.opacity).toBeGreaterThanOrEqual(.95);
    expect(contrast(finalState.color, finalState.background)).toBeGreaterThanOrEqual(3.5);
  });
}
