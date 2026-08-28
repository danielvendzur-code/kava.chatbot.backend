import { test, expect } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const baseURL = process.env.BASE_URL || 'http://127.0.0.1:4173';
const auditDemo = process.env.AUDIT_DEMO;
const artifacts = `artifacts/agent-${auditDemo || 'unknown'}`;
mkdirSync(artifacts, { recursive: true });

const demos = {
  praziarnicka: {
    url:'/?demo=praziarnicka', launcher:'#pz13-open', panel:'#pz13-widget',
    chat:'.pz13-mode button[data-mode="chat"]', advisor:'.pz13-mode button[data-mode="advisor"]', mode:'.pz13-mode',
    greeting:'.pz13-message--assistant .pz13-bubble', chips:'.pz13-chip', composer:'.pz13-composer',
    question:'.pz13-advisor__body h2', option:'.pz13-option', photo:'.pz13-option__img'
  },
  jolka: {
    url:'/jolka.html', launcher:'#open', panel:'#widget',
    chat:'.mode__button[data-mode="chat"]', advisor:'.mode__button[data-mode="advisor"]', mode:'.mode',
    greeting:'#chat .msg:not(.msg--user) .bubble', chips:'.chip', composer:'.composer__field',
    question:'#advisor .question h2', option:'#advisor .option', photo:'#advisor .option__visual img'
  },
  kaffa: {
    url:'/?demo=kaffa', launcher:'#launcher', panel:'.kf-panel',
    chat:'.kf-switch button[data-view="chat"]', advisor:'.kf-switch button[data-view="advisor"]', mode:'.kf-switch',
    greeting:'.kf-chat-seed .kf-message.bot', chips:'.kf-chip', composer:'.kf-composer',
    question:'.kf-question h2', option:'.kf-option', photo:'.kf-option__visual img'
  },
  concept: {
    url:'/?demo=concept', launcher:'#openWidget', panel:'#widget',
    chat:'.mode__button[data-mode="chat"]', advisor:'.mode__button[data-mode="advisor"]', mode:'#modeSwitch',
    greeting:'.message:not(.message--user) .bubble', chips:'.chip', composer:'.composer__shell',
    question:'#advisorBody .question h2', option:'#advisorBody .option', photo:'#advisorBody .option__photo img'
  },
  vitazov: {
    url:'/?demo=vitazov', launcher:'#openWidget', panel:'#widget',
    chat:'.mode__button[data-mode="chat"]', advisor:'.mode__button[data-mode="advisor"]', mode:'.mode',
    greeting:'.message:not(.message--user) .bubble', chips:'.chip', composer:'.composer',
    question:'#advisorBody .question h2', option:'#advisorBody .option', photo:'#advisorBody .option__photo img'
  },
  diamonds: {
    url:'/?demo=diamonds', launcher:'#launcherButton', panel:'#widget',
    chat:'.mode-switch button[data-mode="chat"]', advisor:'.mode-switch button[data-mode="advisor"]', mode:'.mode-switch',
    greeting:'.chat-line--assistant .chat-bubble', chips:'#quickChips button', composer:'.composer',
    question:'#advisorContent .question-view h2', option:'#advisorContent .answer-card', photo:'#advisorContent .answer-photo img'
  }
};

if (!demos[auditDemo]) throw new Error(`Unknown AUDIT_DEMO: ${auditDemo}`);
const demo = demos[auditDemo];

async function ready(page) {
  await page.waitForFunction((slug) => {
    const release = document.documentElement.dataset.coffeeReleaseReady === 'true';
    const six = document.documentElement.dataset.coffeeSixAuditReady === 'true';
    const current = document.body.dataset.coffeeFinal;
    return release && six && (slug !== 'jolka' || current === 'jolka');
  }, auditDemo);
}

async function open(page, viewport) {
  await page.setViewportSize(viewport);
  await page.goto(`${baseURL}${demo.url}`, { waitUntil:'domcontentloaded' });
  await ready(page);
  await expect(page.locator(demo.launcher)).toBeVisible();
  await page.locator(demo.launcher).click({ force:true });
  await expect(page.locator(demo.panel)).toBeVisible();
  await page.waitForTimeout(180);
}

async function renderedBox(page, selector) {
  const box = await page.locator(selector).first().boundingBox();
  expect(box, `${auditDemo}: ${selector} must render`).not.toBeNull();
  return box;
}

async function assertContained(page, viewport) {
  const panel = await renderedBox(page, demo.panel);
  expect(panel.x).toBeGreaterThanOrEqual(-1);
  expect(panel.y).toBeGreaterThanOrEqual(-1);
  expect(panel.x + panel.width).toBeLessThanOrEqual(viewport.width + 1);
  expect(panel.y + panel.height).toBeLessThanOrEqual(viewport.height + 1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(viewport.width + 1);
}

async function assertPhotoSet(page) {
  const photos = page.locator(demo.photo).filter({ visible:true });
  expect(await photos.count()).toBeGreaterThanOrEqual(2);
  const decoded = await photos.evaluateAll((nodes) => nodes.map((img) => ({
    complete: img.complete,
    naturalWidth: img.naturalWidth,
    width: img.getBoundingClientRect().width,
    height: img.getBoundingClientRect().height,
    fit: getComputedStyle(img).objectFit
  })));
  decoded.forEach((img) => {
    expect(img.complete).toBeTruthy();
    expect(img.naturalWidth).toBeGreaterThan(0);
    expect(img.width).toBeGreaterThan(48);
    expect(img.height).toBeGreaterThan(48);
    expect(['cover','contain']).toContain(img.fit);
  });
}

test(`${auditDemo}: independent desktop/tablet and mobile release audit`, async ({ page }) => {
  const tablet = { width:568, height:809 };
  await open(page, tablet);
  await assertContained(page, tablet);

  await page.locator(demo.chat).click({ force:true });
  await page.waitForTimeout(160);
  const mode = await renderedBox(page, demo.mode);
  expect(mode.height).toBeGreaterThanOrEqual(auditDemo === 'diamonds' ? 56 : 58);
  const greeting = page.locator(demo.greeting).first();
  await expect(greeting).toBeVisible();
  const greetingBox = await greeting.boundingBox();
  expect(greetingBox.width).toBeGreaterThanOrEqual(120);
  expect(greetingBox.height).toBeGreaterThanOrEqual(34);

  const chips = page.locator(demo.chips).filter({ visible:true });
  expect(await chips.count()).toBeGreaterThanOrEqual(4);
  const composer = await renderedBox(page, demo.composer);
  const panel = await renderedBox(page, demo.panel);
  expect(composer.x - panel.x).toBeGreaterThanOrEqual(8);
  expect(panel.x + panel.width - (composer.x + composer.width)).toBeGreaterThanOrEqual(8);
  expect(composer.height).toBeGreaterThanOrEqual(48);

  if (auditDemo === 'praziarnicka') {
    const entry = await renderedBox(page, '#pz13-advisor-entry');
    expect(entry.y).toBeGreaterThan(mode.y + mode.height + 2);
    expect(panel.height).toBeLessThanOrEqual(650);
  }
  if (auditDemo === 'jolka') {
    const entry = await renderedBox(page, '#entry');
    const firstChip = await renderedBox(page, '.chip');
    expect(entry.y).toBeLessThan(greetingBox.y);
    expect(greetingBox.y + greetingBox.height).toBeLessThan(firstChip.y);
    expect(firstChip.y - (greetingBox.y + greetingBox.height)).toBeLessThanOrEqual(52);
    expect(firstChip.y + firstChip.height).toBeLessThan(composer.y + 2);
    expect(await page.locator('#back').evaluate((node) => getComputedStyle(node).opacity)).toBe('1');
  }
  if (auditDemo === 'kaffa') {
    expect(panel.width).toBeGreaterThanOrEqual(550);
    expect(panel.height).toBeLessThanOrEqual(650);
    expect(mode.height).toBeGreaterThanOrEqual(60);
    const entry = await renderedBox(page, '.kf-advisor-entry');
    const leftInset = entry.x - panel.x;
    const rightInset = panel.x + panel.width - (entry.x + entry.width);
    expect(Math.abs(leftInset - rightInset)).toBeLessThanOrEqual(2);
  }
  if (auditDemo === 'concept') {
    await expect(page.locator('#openWidget .six-concept-logo img[src*="concept-official-logo"]')).toBeVisible();
    await expect(page.locator('.concept-widget-logo[src*="concept-official-logo"]')).toBeVisible();
    const bubbleBorder = await greeting.evaluate((node) => parseFloat(getComputedStyle(node).borderTopWidth));
    expect(bubbleBorder).toBeGreaterThanOrEqual(1);
  }
  if (auditDemo === 'vitazov') {
    const header = page.locator('.widget__header');
    expect(await header.evaluate((node) => getComputedStyle(node).backgroundColor)).toBe('rgb(13, 73, 61)');
    const logo = page.locator('.widget-brand img[src*="vitazov-logo"]');
    await expect(logo).toBeVisible();
    expect((await logo.boundingBox()).width).toBeGreaterThanOrEqual(100);
    expect(mode.height).toBeGreaterThanOrEqual(60);
    const screen = await renderedBox(page, '#chatScreen');
    expect(screen.width).toBeGreaterThan(panel.width - 4);
    const entry = await renderedBox(page, '#openAdvisor');
    expect(entry.width).toBeGreaterThan(panel.width - 40);
    const composerBox = await renderedBox(page, '#chatForm');
    expect(composerBox.width).toBeGreaterThan(panel.width - 40);
    await expect(page.locator('#chatMessages .message__avatar .six-vitazov-avatar').first()).toBeVisible();
  }
  if (auditDemo === 'diamonds') {
    await expect(page.locator('.widget-logo img[src*="diroastery-logo"]')).toBeVisible();
    expect(await page.locator('#widget').evaluate((node) => getComputedStyle(node).backgroundColor)).toBe('rgb(255, 255, 255)');
  }

  await page.screenshot({ path:`${artifacts}/${auditDemo}-chat-568.png`, fullPage:true });

  await page.locator(demo.advisor).click({ force:true });
  await page.waitForTimeout(200);
  await expect(page.locator(demo.question).first()).toBeVisible();
  const options = page.locator(demo.option).filter({ visible:true });
  expect(await options.count()).toBeGreaterThanOrEqual(2);
  await assertPhotoSet(page);

  if (auditDemo === 'kaffa') expect((await renderedBox(page, '.kf-option__visual')).height).toBeGreaterThanOrEqual(88);
  if (auditDemo === 'vitazov') expect((await renderedBox(page, '#advisorBody .option__photo')).height).toBeGreaterThanOrEqual(88);
  if (auditDemo === 'diamonds') {
    const photo = await renderedBox(page, '#advisorContent .answer-photo');
    expect(photo.width / photo.height).toBeGreaterThanOrEqual(1.7);
  }

  await page.screenshot({ path:`${artifacts}/${auditDemo}-advisor-568.png`, fullPage:true });

  const mobile = { width:390, height:844 };
  await open(page, mobile);
  await assertContained(page, mobile);
  await page.locator(demo.chat).click({ force:true });
  await page.waitForTimeout(140);
  await expect(page.locator(demo.greeting).first()).toBeVisible();
  await expect(page.locator(demo.composer).first()).toBeVisible();
  if (auditDemo === 'jolka') {
    const mobileGreeting = await renderedBox(page, demo.greeting);
    const mobileChip = await renderedBox(page, '.chip');
    expect(mobileChip.y - (mobileGreeting.y + mobileGreeting.height)).toBeLessThanOrEqual(58);
  }
  await page.screenshot({ path:`${artifacts}/${auditDemo}-chat-390.png`, fullPage:true });
});
