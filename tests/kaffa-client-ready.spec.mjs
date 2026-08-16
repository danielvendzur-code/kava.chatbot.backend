import { test, expect } from '@playwright/test';

const baseURL = process.env.BASE_URL || 'http://127.0.0.1:4173';

test('Kaffa text submit immediately returns a grounded local answer and stays readable', async ({ page }) => {
  await page.setViewportSize({ width:390, height:844 });
  await page.goto(`${baseURL}/?demo=kaffa`, { waitUntil:'domcontentloaded' });
  await page.waitForFunction(() => document.documentElement.dataset.coffeeRelease === 'client-ready');
  await page.waitForFunction(() => document.querySelector('.mc-owner')?.dataset.clientReadyOwner === 'true');
  await page.locator('#launcher').click({ force:true });
  await expect(page.locator('.kf-panel')).toBeVisible();

  const input = page.locator('#chatInput');
  await input.fill('Akú kávu do automatu?');
  await page.locator('.kf-send').click({ force:true });

  await expect(page.locator('.kf-message.user').last()).toContainText('Akú kávu do automatu?');
  await expect(page.locator('.kf-message.bot').last()).toContainText('Mokka');
  const font = await page.locator('.kf-message.bot').last().evaluate((node) => parseFloat(getComputedStyle(node).fontSize));
  expect(font).toBeGreaterThanOrEqual(12);
});
