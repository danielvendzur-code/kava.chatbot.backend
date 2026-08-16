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

async function visibleReplies(page, selector) {
  return page.evaluate((sel) => [...document.querySelectorAll(sel)].filter((node) => {
    if (!node.isConnected || node.getClientRects().length === 0) return false;
    const style = getComputedStyle(node);
    return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity || 1) > .9;
  }).map((node) => ({ text:(node.textContent || '').trim(), font:Number.parseFloat(getComputedStyle(node).fontSize) })), selector);
}

for (const demo of demos) {
  test(`${demo.slug} chat returns a readable reply after a real user message`, async ({ page }) => {
    await page.setViewportSize({ width:1366, height:768 });
    await page.goto(`${baseURL}/?demo=${demo.slug}`, { waitUntil:'domcontentloaded' });
    await waitForDemo(page, demo.slug);
    await page.locator(demo.launcher).click({ force:true });
    await expect(page.locator(demo.panel)).toBeVisible();
    await expect(page.locator(demo.chat)).toBeVisible();

    const input = page.locator(demo.input);
    await expect(input).toBeVisible({ timeout:5000 });
    const before = await visibleReplies(page, demo.bot);
    await input.fill('Akú kávu do automatu?');
    await input.press('Enter');

    await expect.poll(async () => {
      const replies = await visibleReplies(page, demo.bot);
      const last = replies.at(-1);
      const newReply = replies.length > before.length || (last && last.text !== before.at(-1)?.text);
      return Boolean(newReply && last && Number.isFinite(last.font) && last.font >= 12 && last.text.length > 12 && !/Premýšľam|Načítavam|\.\.\./i.test(last.text));
    }, { timeout:10000, intervals:[100,200,350,500,800] }).toBeTruthy();
  });
}
