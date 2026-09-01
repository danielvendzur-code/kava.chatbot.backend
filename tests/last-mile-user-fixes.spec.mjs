import { mkdirSync } from 'node:fs';
import { test, expect } from '@playwright/test';

const baseURL = process.env.BASE_URL || 'http://127.0.0.1:4173';
const artifactDir = 'artifacts/last-mile';
mkdirSync(artifactDir, { recursive: true });

const demos = [
  {
    slug: 'praziarnicka', url: '/?demo=praziarnicka', launcher: '#pz13-open', panel: '#pz13-widget',
    chatMode: '.pz13-mode button[data-mode="chat"]', advisorMode: '.pz13-mode button[data-mode="advisor"]',
    switch: '.pz13-mode', entry: '#pz13-advisor-entry', greeting: '.pz13-message--assistant .pz13-bubble',
    chips: '.pz13-chip', composer: '.pz13-composer'
  },
  {
    slug: 'diamonds', url: '/?demo=diamonds', launcher: '#launcherButton', panel: '#widget',
    chatMode: '.mode-switch button[data-mode="chat"]', advisorMode: '.mode-switch button[data-mode="advisor"]',
    switch: '.mode-switch', entry: '#openAdvisor', greeting: '.chat-line--assistant .chat-bubble',
    chips: '#quickChips button', composer: '.composer'
  },
  {
    slug: 'kaffa', url: '/?demo=kaffa', launcher: '#launcher', panel: '.kf-panel',
    chatMode: '.kf-switch button[data-view="chat"]', advisorMode: '.kf-switch button[data-view="advisor"]',
    switch: '.kf-switch', entry: '.kf-advisor-entry', greeting: '.kf-chat-seed .kf-message.bot',
    chips: '.kf-chip', composer: '.kf-composer'
  },
  {
    slug: 'vitazov', url: '/?demo=vitazov', launcher: '#openWidget', panel: '#widget',
    chatMode: '.mode__button[data-mode="chat"]', advisorMode: '.mode__button[data-mode="advisor"]',
    switch: '.mode', entry: '#openAdvisor', greeting: '.message:not(.message--user) .bubble',
    chips: '#quickChips .chip', composer: '.composer'
  },
  {
    slug: 'concept', url: '/?demo=concept', launcher: '#openWidget', panel: '#widget',
    chatMode: '.mode__button[data-mode="chat"]', advisorMode: '.mode__button[data-mode="advisor"]',
    switch: '.mode', entry: '#openAdvisor', greeting: '.message:not(.message--user) .bubble',
    chips: '#quickChips .chip', composer: '.composer__shell'
  },
  {
    slug: 'jolka', url: '/jolka.html', launcher: '#open', panel: '#widget',
    chatMode: '.mode__button[data-mode="chat"]', advisorMode: '.mode__button[data-mode="advisor"]',
    switch: '.mode', entry: '.entry', greeting: '.msg:not(.msg--user) .bubble',
    chips: '.chip', composer: '.composer__field'
  }
];

async function ready(page, demo) {
  await page.goto(`${baseURL}${demo.url}`, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.body.dataset.coffeeFinal && document.documentElement.dataset.coffeeReleaseReady === 'true');
}

async function box(page, selector) {
  const locator = page.locator(selector).first();
  await expect(locator).toBeVisible();
  const result = await locator.boundingBox();
  expect(result).not.toBeNull();
  return result;
}

for (const demo of demos) {
  test(`${demo.slug}: last-mile chat layout and 247 euro offer`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await ready(page, demo);

    const price = page.locator('.mcb-plan-price strong').first();
    await expect(price).toHaveText(/247\s*€/);

    await page.locator(demo.launcher).click({ force: true });
    await expect(page.locator(demo.panel)).toBeVisible();
    await page.locator(demo.chatMode).click({ force: true });

    const panelBox = await box(page, demo.panel);
    const switchBox = await box(page, demo.switch);
    const entryBox = await box(page, demo.entry);
    const greetingBox = await box(page, demo.greeting);
    const composerBox = await box(page, demo.composer);

    expect(switchBox.width / panelBox.width, `${demo.slug}: switch should be deliberately wide`).toBeGreaterThan(.88);
    const entryGap = entryBox.y - (switchBox.y + switchBox.height);
    expect(entryGap, `${demo.slug}: entry must not touch the switch`).toBeGreaterThanOrEqual(2);
    expect(entryGap, `${demo.slug}: entry must stay visually connected to the switch`).toBeLessThanOrEqual(30);
    expect(greetingBox.y - (entryBox.y + entryBox.height), `${demo.slug}: greeting must stay high in chat`).toBeLessThanOrEqual(30);
    expect(composerBox.height, `${demo.slug}: composer must remain compact`).toBeLessThanOrEqual(demo.slug === 'jolka' ? 52 : 58);

    const chips = page.locator(demo.chips).filter({ visible: true });
    expect(await chips.count(), `${demo.slug}: four quick questions remain visible`).toBeGreaterThanOrEqual(4);
    const chipStyle = await chips.first().evaluate((node) => {
      const style = getComputedStyle(node);
      return {
        fontSize: parseFloat(style.fontSize),
        background: style.backgroundColor,
        border: style.borderColor,
        color: style.color
      };
    });
    expect(chipStyle.fontSize).toBeGreaterThanOrEqual(12);
    expect(chipStyle.background).not.toBe('rgba(0, 0, 0, 0)');
    expect(chipStyle.color).not.toBe(chipStyle.background);

    await page.screenshot({ path: `${artifactDir}/${demo.slug}-chat.png`, fullPage: false });
  });
}

test('Praziarnicka launcher uses the official logo and the entry uses real coffee photography', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const demo = demos[0];
  await ready(page, demo);
  const launcherLogo = page.locator('.pz13-launcher__button img').first();
  await expect(launcherLogo).toBeVisible();
  await expect(launcherLogo).toHaveAttribute('src', /praziarnicka-(?:icon|logo)-official/);
  await page.locator(demo.launcher).click({ force: true });
  await page.locator(demo.chatMode).click({ force: true });
  const entryPaint = await page.locator('.pz13-advisor-entry > span:first-child').evaluate((node) => getComputedStyle(node).backgroundImage);
  expect(entryPaint).toContain('official-puccini.jpg');
});

test('Diamonds advisor uses large readable photo cards', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const demo = demos.find((item) => item.slug === 'diamonds');
  await ready(page, demo);
  await page.locator(demo.launcher).click({ force: true });
  await page.locator(demo.advisorMode).click({ force: true });
  const photo = page.locator('.answer-photo').first();
  const title = page.locator('.answer-copy b').first();
  await expect(photo).toBeVisible();
  await expect(title).toBeVisible();
  const photoBox = await photo.boundingBox();
  expect(photoBox.height).toBeGreaterThanOrEqual(105);
  const titlePaint = await title.evaluate((node) => ({ color: getComputedStyle(node).color, opacity: getComputedStyle(node).opacity }));
  expect(titlePaint.opacity).toBe('1');
  expect(titlePaint.color).not.toBe('rgba(0, 0, 0, 0)');
  await page.screenshot({ path: `${artifactDir}/diamonds-advisor.png`, fullPage: false });
});

test('Kaffa advisor enlarges photography and removes low-value grey copy', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const demo = demos.find((item) => item.slug === 'kaffa');
  await ready(page, demo);
  await page.locator(demo.launcher).click({ force: true });
  await page.locator(demo.advisorMode).click({ force: true });
  const visual = page.locator('.kf-option__visual').first();
  await expect(visual).toBeVisible();
  const visualBox = await visual.boundingBox();
  expect(visualBox.height).toBeGreaterThanOrEqual(104);
  const secondary = page.locator('.kf-option--photo .kf-option__copy small').first();
  if (await secondary.count()) await expect(secondary).toBeHidden();
  await page.screenshot({ path: `${artifactDir}/kaffa-advisor.png`, fullPage: false });
});

test('Concept uses orange primary state, blue hover and readable bubble text', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const demo = demos.find((item) => item.slug === 'concept');
  await ready(page, demo);
  await page.locator(demo.launcher).click({ force: true });
  await page.locator(demo.chatMode).click({ force: true });

  const indicator = page.locator('.mode__indicator');
  const indicatorColor = await indicator.evaluate((node) => getComputedStyle(node).backgroundColor);
  expect(indicatorColor).toBe('rgb(216, 93, 44)');

  const bubble = page.locator(demo.greeting).first();
  const bubblePaint = await bubble.evaluate((node) => ({ color: getComputedStyle(node).color, opacity: getComputedStyle(node).opacity }));
  expect(bubblePaint.opacity).toBe('1');
  expect(bubblePaint.color).not.toBe('rgba(0, 0, 0, 0)');

  const send = page.locator('.composer__send');
  await send.hover();
  await page.waitForTimeout(240);
  const hoverColor = await send.evaluate((node) => getComputedStyle(node).backgroundColor);
  expect(hoverColor).toBe('rgb(23, 127, 154)');

  await page.locator(demo.advisorMode).click({ force: true });
  const optionPhoto = page.locator('.option__photo').first();
  await expect(optionPhoto).toBeVisible();
  const optionBox = await optionPhoto.boundingBox();
  expect(optionBox.height).toBeGreaterThanOrEqual(104);
  await page.screenshot({ path: `${artifactDir}/concept-advisor.png`, fullPage: false });
});

test('Jolka disabled back remains readable and entry is separated from switch', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const demo = demos.find((item) => item.slug === 'jolka');
  await ready(page, demo);
  await page.locator(demo.launcher).click({ force: true });
  await page.locator(demo.advisorMode).click({ force: true });
  const back = page.locator('.back');
  await expect(back).toBeDisabled();
  const opacity = await back.evaluate((node) => parseFloat(getComputedStyle(node).opacity));
  expect(opacity).toBeGreaterThanOrEqual(.5);

  await page.locator(demo.chatMode).click({ force: true });
  const switchBox = await box(page, demo.switch);
  const entryBox = await box(page, demo.entry);
  expect(entryBox.y - (switchBox.y + switchBox.height)).toBeGreaterThanOrEqual(5);
  await page.screenshot({ path: `${artifactDir}/jolka-spacing.png`, fullPage: false });
});

test('Victory launcher logo is clipped cleanly inside the button', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const demo = demos.find((item) => item.slug === 'vitazov');
  await ready(page, demo);
  const logo = page.locator('.kv-launcher-logo img');
  await expect(logo).toBeVisible();
  const paint = await logo.evaluate((node) => ({ clipPath: getComputedStyle(node).clipPath, transform: getComputedStyle(node).transform }));
  expect(paint.clipPath).toContain('circle');
  expect(paint.transform).not.toBe('none');
});
