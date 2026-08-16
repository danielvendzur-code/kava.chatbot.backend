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
  if (slug === 'praziarnicka') await page.waitForFunction(() => document.documentElement.dataset.demoReady === 'true');
  await page.waitForFunction(() => document.documentElement.dataset.coffeeRelease === 'client-ready');
  await page.waitForFunction(() => document.querySelector('.mc-owner')?.dataset.clientReadyOwner === 'true');
}

async function visibleNodeMetrics(page, selector) {
  return page.evaluate((sel) => {
    const nodes = [...document.querySelectorAll(sel)].filter((node) => {
      if (!node.isConnected || node.getClientRects().length === 0) return false;
      const style = getComputedStyle(node);
      return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity || 1) > 0;
    });
    const node = nodes.at(-1);
    if (!node) return null;
    const style = getComputedStyle(node);
    return {
      text:(node.textContent || '').trim(),
      font:Number.parseFloat(style.fontSize),
      opacity:Number.parseFloat(style.opacity || '1'),
      background:style.backgroundColor,
      connected:node.isConnected
    };
  }, selector);
}

function expectLight(rgb) {
  const values = rgb?.match(/[\d.]+/g)?.slice(0, 3).map(Number) || [];
  if (values.length === 3) expect(Math.max(...values)).toBeGreaterThan(70);
}

test('all five chats settle to a readable connected final reply', async ({ page }) => {
  await page.setViewportSize({ width:1366, height:768 });
  for (const demo of demos) {
    await page.goto(`${baseURL}/?demo=${demo.slug}`, { waitUntil:'domcontentloaded' });
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

    await input.fill('Akú kávu do automatu?');
    await input.press('Enter');
    await expect.poll(async () => {
      const state = await visibleNodeMetrics(page, demo.bot);
      return Boolean(state && state.connected && Number.isFinite(state.font) && state.font >= 12 && Number.isFinite(state.opacity) && state.opacity >= .95 && state.text.length > 20 && !/Premýšľam|Načítavam|\.\.\./i.test(state.text));
    }, { timeout:7000, intervals:[100,200,350,500] }).toBeTruthy();

    const finalState = await visibleNodeMetrics(page, demo.bot);
    expect(finalState.connected).toBeTruthy();
    expect(finalState.font).toBeGreaterThanOrEqual(12);
    expect(finalState.opacity).toBeGreaterThanOrEqual(.95);
    expectLight(finalState.background);
  }
});
