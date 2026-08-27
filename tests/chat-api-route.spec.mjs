import { test, expect } from '@playwright/test';

const baseURL = process.env.BASE_URL || 'http://127.0.0.1:4173';
const demos = [
  ['praziarnicka', '/?demo=praziarnicka'],
  ['diamonds', '/?demo=diamonds'],
  ['kaffa', '/?demo=kaffa'],
  ['vitazov', '/?demo=vitazov'],
  ['concept', '/?demo=concept'],
  ['jolka', '/jolka.html']
];

for (const [slug, path] of demos) {
  test(`${slug}: final release restores the canonical chat fetch`, async ({ page }) => {
    await page.goto(`${baseURL}${path}`, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => document.documentElement.dataset.coffeeApiRoute === 'stable');
    const state = await page.evaluate(() => ({
      stableType: typeof window.__COFFEE_STABLE_FETCH__,
      sameFunction: window.fetch === window.__COFFEE_STABLE_FETCH__,
      release: document.documentElement.dataset.coffeeReleaseFinal,
      apiRoute: document.documentElement.dataset.coffeeApiRoute
    }));
    expect(state.stableType).toBe('function');
    expect(state.sameFunction).toBe(true);
    expect(state.release).toBe('2026-08-27');
    expect(state.apiRoute).toBe('stable');
  });
}

test('Concept waits for a provider response beyond the obsolete 1.6 second cutoff', async ({ page }) => {
  await page.goto(`${baseURL}/?demo=concept`, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.documentElement.dataset.coffeeApiRoute === 'stable');

  await page.evaluate(() => {
    const passthrough = window.fetch;
    window.fetch = async (input, init) => {
      const url = typeof input === 'string' ? input : input?.url || '';
      if (url === '/api/chat' || url.endsWith('/api/chat')) {
        await new Promise((resolve) => setTimeout(resolve, 2100));
        return new Response(JSON.stringify({ reply: 'Pomalá AI odpoveď dorazila správne.' }), {
          status: 200,
          headers: { 'content-type': 'application/json' }
        });
      }
      return passthrough(input, init);
    };
  });

  await page.locator('#openWidget').click({ force: true });
  await expect(page.locator('#widget')).toBeVisible();
  const input = page.locator('#chatInput');
  await input.fill('Ktorú kávu odporúčate?');
  const sentAt = Date.now();
  await input.press('Enter');

  await page.waitForTimeout(1750);
  await expect(page.locator('.message .bubble').filter({ hasText: 'Pomalá AI odpoveď dorazila správne.' })).toHaveCount(0);
  await expect(page.locator('.message .bubble').filter({ hasText: 'Pomalá AI odpoveď dorazila správne.' })).toBeVisible({ timeout: 2000 });
  expect(Date.now() - sentAt).toBeGreaterThanOrEqual(2000);
});
