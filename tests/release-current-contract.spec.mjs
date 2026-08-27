import { test, expect } from '@playwright/test';

const baseURL = process.env.BASE_URL || 'http://127.0.0.1:4173';

async function waitRelease(page) {
  await page.waitForFunction(() =>
    document.documentElement.dataset.coffeeReleaseReady === 'true' &&
    document.documentElement.dataset.coffeeReleaseFinal === '2026-08-27'
  );
}

async function expectCurrentOwner(page, path, brand, logoPart) {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${baseURL}${path}`, { waitUntil: 'domcontentloaded' });
  await waitRelease(page);

  const owner = page.locator('[data-mcb-page="true"]');
  await expect(owner).toBeVisible();
  await expect(owner.locator('h1')).toHaveText('Kávový poradca na váš web.');
  await expect(owner.locator('.mcb-eyebrow')).toContainText(brand);
  await expect(owner.locator('.mcb-figures li')).toHaveCount(3);
  await expect(owner.locator('.mcb-plan-price')).toContainText('297');
  await expect(owner.locator('.mcb-plan-price')).toContainText('10');
  await expect(owner.locator('.mcb-lockup img')).toHaveAttribute('src', new RegExp(logoPart));

  const contact = owner.locator('a[href*="mojchatbot.sk/kontakt"]').first();
  await expect(contact).toBeVisible();
  const href = await contact.getAttribute('href');
  expect(href).toContain('source=coffee-demo-');
  expect(href).toContain('company=');
  expect(href).toContain('web=');
  expect(href).toContain('demo=');
}

test('Jolka owner page uses the current one-screen sales contract', async ({ page }) => {
  await expectCurrentOwner(page, '/jolka.html', 'Pražiareň Jolka', 'logo-ink');
  await expect(page.locator('.widget__note')).toHaveCount(0);
});

test('Jolka current chat keeps four useful chips and returns an offline answer', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${baseURL}/jolka.html`, { waitUntil: 'domcontentloaded' });
  await waitRelease(page);

  await page.locator('#open').click();
  await page.locator('.mode__button[data-mode="chat"]').click();

  await expect(page.locator('.chip')).toHaveText([
    'Nízka acidita',
    'Káva do mlieka',
    'Odkiaľ je káva?',
    'Porovnajte dve kávy'
  ]);
  await expect(page.locator('#entry')).toBeVisible();

  const botBefore = await page.locator('.msg:not(.msg--user) .bubble').count();
  await page.locator('.chip').first().click();
  await expect(page.locator('.msg--user .bubble').last()).toHaveText('Nízka acidita');
  await expect(page.locator('#entry')).toBeHidden();
  await expect.poll(async () => page.locator('.msg:not(.msg--user) .bubble').count(), { timeout: 6000 }).toBeGreaterThan(botBefore);
  const answer = (await page.locator('.msg:not(.msg--user) .bubble').last().innerText()).trim();
  expect(answer.length).toBeGreaterThan(20);
});

test('Victory owner page uses the current one-screen sales contract', async ({ page }) => {
  await expectCurrentOwner(page, '/?demo=vitazov', 'Káva Víťazov', 'vitazov-logo');
});
