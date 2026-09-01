import { test, expect } from '@playwright/test';

const baseURL = process.env.BASE_URL || 'http://127.0.0.1:4173';

const demos = [
  {
    slug:'praziarnicka', url:'/?demo=praziarnicka', launcher:'#pz13-open', panel:'#pz13-widget',
    chatMode:'.pz13-mode button[data-mode="chat"]', advisorMode:'.pz13-mode button[data-mode="advisor"]',
    switch:'.pz13-mode', entry:'#pz13-advisor-entry', greeting:'.pz13-message--assistant .pz13-bubble',
    chips:'.pz13-chip', composer:'.pz13-composer', close:'#pz13-close', progress:'.pz13-progress i',
    avatar:'.pz13-avatar img[src*="praziarnicka"]'
  },
  {
    slug:'diamonds', url:'/?demo=diamonds', launcher:'#launcherButton', panel:'#widget',
    chatMode:'.mode-switch button[data-mode="chat"]', advisorMode:'.mode-switch button[data-mode="advisor"]',
    switch:'.mode-switch', entry:'#openAdvisor', greeting:'.chat-line--assistant .chat-bubble',
    chips:'#quickChips button', composer:'.composer', close:'#closeWidget', progress:'.progress-track,.progress-fill',
    avatar:'.chat-logo img[src*="diroastery-logo"]'
  },
  {
    slug:'kaffa', url:'/?demo=kaffa', launcher:'#launcher', panel:'.kf-panel',
    chatMode:'.kf-switch button[data-view="chat"]', advisorMode:'.kf-switch button[data-view="advisor"]',
    switch:'.kf-switch', entry:'.kf-advisor-entry', greeting:'.kf-chat-seed .kf-message.bot',
    chips:'.kf-chip', composer:'.kf-composer', close:'#closeWidget', progress:'.kf-progress-dots i',
    avatar:'.kf-bot-avatar .kf-wordmark'
  },
  {
    slug:'vitazov', url:'/?demo=vitazov', launcher:'#openWidget', panel:'#widget',
    chatMode:'.mode__button[data-mode="chat"]', advisorMode:'.mode__button[data-mode="advisor"]',
    switch:'.mode', entry:'#openAdvisor', greeting:'.message:not(.message--user) .bubble',
    chips:'#quickChips .chip', composer:'.composer', close:'#closeWidget', progress:'#progress i',
    avatar:'.message__avatar img[src*="vitazov-logo"]'
  },
  {
    slug:'concept', url:'/?demo=concept', launcher:'#openWidget', panel:'#widget',
    chatMode:'.mode__button[data-mode="chat"]', advisorMode:'.mode__button[data-mode="advisor"]',
    switch:'.mode', entry:'#openAdvisor', greeting:'.message:not(.message--user) .bubble',
    chips:'#quickChips .chip', composer:'.composer__shell', close:'#closeWidget', progress:'#progress i',
    avatar:'.message__avatar img[src*="concept-official-logo"]'
  },
  {
    slug:'jolka', url:'/jolka.html', launcher:'#open', panel:'#widget',
    chatMode:'.mode__button[data-mode="chat"]', advisorMode:'.mode__button[data-mode="advisor"]',
    switch:'.mode', entry:'.entry', greeting:'.msg:not(.msg--user) .bubble',
    chips:'.chip', composer:'.composer__field', close:'#close', progress:'.progress i',
    avatar:'.msg__avatar img[src*="jolka"]'
  }
];

async function ready(page, demo) {
  await page.goto(`${baseURL}${demo.url}`, { waitUntil:'domcontentloaded' });
  await page.waitForFunction(() => document.body.dataset.coffeeFinal && document.documentElement.dataset.coffeeReleaseReady === 'true');
}

async function box(page, selector) {
  const locator = page.locator(selector).first();
  await expect(locator).toBeVisible();
  return locator.boundingBox();
}

for (const demo of demos) {
  test(`${demo.slug}: final mobile chat follows the approved compact order`, async ({ page }) => {
    await page.setViewportSize({ width:390, height:844 });
    await ready(page, demo);
    await page.locator(demo.launcher).click({ force:true });
    await expect(page.locator(demo.panel)).toBeVisible();
    await page.locator(demo.chatMode).click({ force:true });

    const switchBox = await box(page, demo.switch);
    const entryBox = await box(page, demo.entry);
    const greetingBox = await box(page, demo.greeting);
    const composerBox = await box(page, demo.composer);

    expect(entryBox.y - (switchBox.y + switchBox.height), `${demo.slug}: empty gap above advisor CTA`).toBeLessThanOrEqual(28);
    expect(greetingBox.y - (entryBox.y + entryBox.height), `${demo.slug}: greeting is not directly below advisor CTA`).toBeLessThanOrEqual(30);
    expect(composerBox.height, `${demo.slug}: composer is too tall`).toBeLessThanOrEqual(demo.slug === 'jolka' ? 50 : 54);

    const chips = page.locator(demo.chips).filter({ visible:true });
    expect(await chips.count(), `${demo.slug}: four quick chips must stay visible`).toBeGreaterThanOrEqual(4);
    const chipPaint = await chips.first().evaluate((node) => {
      const style = getComputedStyle(node);
      return { background:style.backgroundColor, border:style.borderColor, font:parseFloat(style.fontSize) };
    });
    expect(chipPaint.font).toBeGreaterThanOrEqual(12);
    expect(chipPaint.background === 'rgba(0, 0, 0, 0)' && chipPaint.border === 'rgba(0, 0, 0, 0)').toBeFalsy();

    await expect(page.locator(demo.avatar).first()).toBeVisible();

    const close = page.locator(demo.close);
    await close.hover();
    const closePaint = await close.evaluate((node) => {
      const match = getComputedStyle(node).color.match(/[\d.]+/g)?.slice(0,3).map(Number) || [0,0,0];
      return match;
    });
    expect(closePaint[0]).toBeGreaterThan(closePaint[1] + 30);
    expect(closePaint[0]).toBeGreaterThan(closePaint[2] + 30);

    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  });
}

test('all six brands fill quick chips radially from the centre', async ({ page }) => {
  await page.setViewportSize({ width:1000, height:760 });
  for (const demo of demos) {
    await ready(page, demo);
    await page.locator(demo.launcher).click({ force:true });
    await expect(page.locator(demo.panel)).toBeVisible();
    await expect(page.locator(demo.chatMode)).toBeVisible();
    await page.locator(demo.chatMode).click({ force:true });
    const chip = page.locator(demo.chips).filter({ visible:true }).first();
    await expect(chip).toBeVisible();
    const rest = await chip.evaluate((node) => {
      const style = getComputedStyle(node);
      return { image:style.backgroundImage, size:style.backgroundSize, position:style.backgroundPosition };
    });
    expect(rest.image, `${demo.slug}: radial fill is missing`).toContain('radial-gradient');
    expect(rest.size, `${demo.slug}: fill should start collapsed`).toMatch(/^(0px|0%) (0px|0%)$/);
    expect(rest.position, `${demo.slug}: fill must originate in the centre`).toMatch(/50%/);
    await chip.hover();
    await page.waitForTimeout(540);
    const hoverPaint = await chip.evaluate((node) => {
      const style = getComputedStyle(node);
      return { size:style.backgroundSize, color:style.color };
    });
    const hoverSize = hoverPaint.size;
    expect(hoverSize, `${demo.slug}: radial fill did not expand`).not.toMatch(/^(0px|0%) (0px|0%)$/);
    if (demo.slug === 'praziarnicka') {
      const channels = hoverPaint.color.match(/[\d.]+/g)?.slice(0,3).map(Number) || [0,0,0];
      expect(Math.min(...channels), 'praziarnicka: filled chip label must stay light').toBeGreaterThan(230);
    }
  }
});

test('all six owner pages explain the free month, recurring price and one-line install', async ({ page }) => {
  for (const demo of demos) {
    await ready(page, demo);
    await expect(page.locator('.mcb-plan-trial')).toHaveText('1. mesiac zdarma');
    await expect(page.locator('.mcb-plan-price')).toContainText('247 €');
    await expect(page.locator('.mcb-plan-price')).toContainText('10 €');
    await expect(page.locator('.mcb-plan')).toContainText('Nasadenie na web jedným riadkom kódu');
    await expect(page.locator('.mcb-pricing-side')).toContainText('Bez viazanosti');
  }
});

test('Jolka keeps the first advisor controls readable and the warm finish intentional', async ({ page }) => {
  await page.setViewportSize({ width:1000, height:760 });
  const demo = demos.find((item) => item.slug === 'jolka');
  await ready(page, demo);
  await page.locator(demo.launcher).click({ force:true });
  await expect(page.locator(demo.panel)).toBeVisible();
  await page.locator(demo.advisorMode).click({ force:true });

  const backPaint = await page.locator('#back').evaluate((node) => {
    const style = getComputedStyle(node);
    return { color:style.color, background:style.backgroundColor, opacity:style.opacity };
  });
  const backChannels = backPaint.color.match(/[\d.]+/g)?.slice(0,3).map(Number) || [255,255,255];
  expect(Math.min(...backChannels), 'Jolka: disabled back control must not be white').toBeLessThan(170);
  expect(parseFloat(backPaint.opacity)).toBeGreaterThanOrEqual(.95);
  expect(backPaint.background).not.toBe('rgba(0, 0, 0, 0)');

  const titlePaint = await page.locator('#stepTitle').evaluate((node) => getComputedStyle(node).color);
  const titleChannels = titlePaint.match(/[\d.]+/g)?.slice(0,3).map(Number) || [255,255,255];
  expect(Math.min(...titleChannels), 'Jolka: step title must remain readable').toBeLessThan(100);

  await page.locator(demo.chatMode).click({ force:true });
  const chip = page.locator('.chips .chip').filter({ visible:true }).first();
  const chipTiming = await chip.evaluate((node) => getComputedStyle(node).transitionDuration);
  expect(Math.max(...(chipTiming.match(/[\d.]+/g) || []).map(Number))).toBeGreaterThanOrEqual(1.1);
  const notePaint = await page.locator('.widget__note').evaluate((node) => {
    const style = getComputedStyle(node);
    return { background:style.backgroundColor, topBorder:style.borderTopWidth };
  });
  expect(notePaint.background).not.toBe('rgba(0, 0, 0, 0)');
  expect(notePaint.topBorder).toBe('0px');
});

test('Praziarnicka uses four distinct non-Kaffa preparation photos', async ({ page }) => {
  await page.setViewportSize({ width:390, height:844 });
  const demo = demos[0];
  await ready(page, demo);
  await page.locator(demo.launcher).click({ force:true });
  await page.locator(demo.advisorMode).click({ force:true });
  const photos = page.locator('.pz13-option__img.cf-real-photo');
  await expect(photos).toHaveCount(4);
  const sources = await photos.evaluateAll((nodes) => nodes.map((node) => node.getAttribute('src')));
  expect(new Set(sources).size).toBe(4);
  expect(sources).toEqual(expect.arrayContaining([
    '/assets/praziarnicka/prep-automatic.webp',
    '/assets/praziarnicka/prep-lever.webp',
    '/assets/praziarnicka/prep-moka.webp',
    '/assets/praziarnicka/prep-filter.webp'
  ]));
});

test('Victory exposes a colored header, large official logo and four progress segments', async ({ page }) => {
  await page.setViewportSize({ width:390, height:844 });
  const demo = demos.find((item) => item.slug === 'vitazov');
  await ready(page, demo);
  await page.waitForTimeout(420);
  await page.locator(demo.launcher).click({ force:true });
  const header = page.locator('.widget__header');
  const logo = page.locator('.widget-brand__mark img[src*="vitazov-logo"]');
  await expect(logo).toBeVisible();
  const logoBox = await logo.boundingBox();
  expect(logoBox.width).toBeGreaterThanOrEqual(100);
  const background = await header.evaluate((node) => getComputedStyle(node).backgroundImage || getComputedStyle(node).backgroundColor);
  expect(background).not.toMatch(/rgba\(0, 0, 0, 0\)|transparent/);
  await page.waitForTimeout(320);
  await page.locator(demo.advisorMode).click({ force:true });
  await expect(page.locator('#progress i')).toHaveCount(4);
  await expect(page.locator('#progress')).toBeVisible();
  await page.waitForTimeout(260);
  const widths = await page.locator('#progress i').evaluateAll((nodes) => nodes.map((node) => node.getBoundingClientRect().width));
  widths.forEach((width) => expect(width).toBeGreaterThan(8));
});

test('every owner pitch has a prominent price and fully prefilled contact CTA', async ({ page }) => {
  await page.setViewportSize({ width:1366, height:768 });
  for (const demo of demos) {
    await ready(page, demo);
    const owner = page.locator('[data-mcb-page="true"]');
    await expect(owner).toBeVisible();
    const price = owner.locator('.mcb-plan-price strong').first();
    await expect(price).toBeVisible();
    expect(await price.evaluate((node) => parseFloat(getComputedStyle(node).fontSize))).toBeGreaterThanOrEqual(42);

    const contact = owner.locator('a[href*="mojchatbot.sk/kontakt"]').first();
    await expect(contact).toBeVisible();
    const href = await contact.getAttribute('href');
    const url = new URL(href);
    expect(url.searchParams.get('source')).toBe(`coffee-demo-${demo.slug}`);
    expect(url.searchParams.get('company')).toBeTruthy();
    expect(url.searchParams.get('web')).toMatch(/^https:\/\//);
    expect(url.searchParams.get('demo')).toMatch(/^http/);
  }
});
