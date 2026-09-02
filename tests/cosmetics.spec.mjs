import { test, expect } from '@playwright/test';
import fs from 'node:fs';

const baseURL = process.env.BASE_URL || 'http://127.0.0.1:4173';
const demos = ['mylo','ponio','two','bellcoria','biofy','anemone'];
fs.mkdirSync('artifacts', { recursive:true });

async function openDemo(page, slug, viewport={width:1366,height:768}, settle=120) {
  await page.setViewportSize(viewport);
  await page.goto(`${baseURL}/cosmetics.html?demo=${slug}`, { waitUntil:'domcontentloaded' });
  await page.waitForFunction(() => document.documentElement.dataset.cosmeticsReady === 'true');
  await page.waitForTimeout(settle);
}

async function capture(page, path) {
  const session = await page.context().newCDPSession(page);
  try {
    const { data } = await session.send('Page.captureScreenshot', { format:'png', fromSurface:true, captureBeyondViewport:true });
    fs.writeFileSync(path, Buffer.from(data, 'base64'));
  } finally {
    await session.detach();
  }
}

async function pageMetrics(page) {
  return page.evaluate(() => ({ h:document.scrollingElement.scrollHeight, ih:innerHeight, w:document.scrollingElement.scrollWidth, iw:innerWidth }));
}

async function noOverflow(locator, tolerance=3) {
  return locator.evaluate((node,t) => ({
    ok:node.scrollHeight<=node.clientHeight+t && node.scrollWidth<=node.clientWidth+t,
    sh:node.scrollHeight,ch:node.clientHeight,sw:node.scrollWidth,cw:node.clientWidth
  }), tolerance);
}

test('all six cosmetics demos keep the Codex owner composition and calm pricing', async ({ page }) => {
  test.setTimeout(60000);
  for (const slug of demos) {
    await openDemo(page,slug,{width:1366,height:768},300);
    const owner=page.locator('.cx-owner');
    await expect(owner).toBeVisible();
    await expect(owner.locator('.cx-owner-brand .cx-wordmark')).toBeVisible();
    await expect(owner.locator('[data-open="advisor"]')).toBeVisible();
    await expect(owner.locator('[data-open="chat"]')).toBeVisible();
    await expect(owner.locator('.cx-owner-path > div')).toHaveCount(3);
    await expect(owner.locator('.cx-owner-offer')).toContainText('Prvý mesiac zdarma');
    await expect(owner.locator('.cx-owner-offer')).toContainText('247 €');
    await expect(owner.locator('.cx-owner-offer')).toContainText('10 €');
    await expect(owner.locator('.cx-owner-offer')).toContainText('Nasadenie na web jedným riadkom kódu');
    const pricing=owner.locator('.cx-plan-summary > span');
    const pricingStyle=await pricing.evaluate(node=>({
      pseudo:getComputedStyle(node,'::before').content,
      font:parseFloat(getComputedStyle(node).fontSize)
    }));
    expect(['none','normal','""']).toContain(pricingStyle.pseudo);
    expect(pricingStyle.font,slug).toBeGreaterThanOrEqual(12);
    const visualCard=owner.locator('.cx-owner-visual-card');
    const visualStyle=await visualCard.evaluate(node=>({
      blur:getComputedStyle(node).backdropFilter || getComputedStyle(node).webkitBackdropFilter,
      overlay:getComputedStyle(node.closest('.cx-owner-visual'),'::after').display
    }));
    expect(visualStyle.blur === 'none' || visualStyle.blur === '',slug).toBeTruthy();
    expect(visualStyle.overlay,slug).toBe('none');
    expect(await owner.locator('.cx-owner-visual > img').evaluate(image => image.complete && image.naturalWidth > 0)).toBeTruthy();
    const text=await owner.innerText();
    expect(text).not.toMatch(/umelá inteligencia|AI demo|match\s*%|zhoda\s*%/i);
    const metrics=await pageMetrics(page);
    expect(metrics.h,slug).toBeLessThanOrEqual(metrics.ih+1);
    expect(metrics.w,slug).toBeLessThanOrEqual(metrics.iw+1);
    await capture(page,`artifacts/cosmetics-${slug}-owner-desktop.png`);
  }
});

test('all six owner presentations fit mobile and keep launcher access', async ({ page }) => {
  test.setTimeout(60000);
  for (const slug of demos) {
    await openDemo(page,slug,{width:390,height:844},250);
    await expect(page.locator('.cx-owner-brand')).toBeVisible();
    await expect(page.locator('.cx-owner-contact')).toBeVisible();
    await expect(page.locator('[data-open="advisor"]')).toBeVisible();
    await expect(page.locator('[data-open="chat"]')).toBeVisible();
    await expect(page.locator('.cx-owner-visual')).toBeVisible();
    await expect(page.locator('.cx-launcher-button')).toBeVisible();
    await expect(page.locator('.cx-teaser')).toBeHidden();
    const metrics=await pageMetrics(page);
    expect(metrics.h,slug).toBeLessThanOrEqual(metrics.ih+1);
    expect(metrics.w,slug).toBeLessThanOrEqual(metrics.iw+1);
    const controls=page.locator('.cx-owner-contact,.cx-owner-actions button');
    const heights=await controls.evaluateAll(nodes=>nodes.map(n=>n.getBoundingClientRect().height));
    expect(Math.min(...heights),slug).toBeGreaterThanOrEqual(36);
  }
});

test('launcher and chips change state without radial fill animation on all brands', async ({ page }) => {
  for (const slug of demos) {
    await openDemo(page,slug,{width:1366,height:768});
    const launcher=page.locator('.cx-launcher-button');
    const before=await launcher.evaluate(node=>({
      bg:getComputedStyle(node).backgroundColor,
      image:getComputedStyle(node).backgroundImage,
      transition:getComputedStyle(node).transitionProperty,
      wordmarkSize:parseFloat(getComputedStyle(node.querySelector('.cx-wordmark')).fontSize)
    }));
    expect(before.image,slug).toBe('none');
    expect(before.transition,slug).not.toContain('background-color');
    expect(before.wordmarkSize,slug).toBeGreaterThanOrEqual(10);
    await launcher.hover();
    await page.waitForTimeout(25);
    const after=await launcher.evaluate(node=>({bg:getComputedStyle(node).backgroundColor,image:getComputedStyle(node).backgroundImage}));
    expect(after.image,slug).toBe('none');
    expect(after.bg,slug).not.toBe(before.bg);

    await page.locator('[data-open="chat"]').click();
    const chip=page.locator('.cx-chip').first();
    const chipBefore=await chip.evaluate(node=>({bg:getComputedStyle(node).backgroundColor,border:getComputedStyle(node).borderColor,image:getComputedStyle(node).backgroundImage}));
    expect(chipBefore.image,slug).toBe('none');
    await chip.hover();
    await page.waitForTimeout(80);
    const chipAfter=await chip.evaluate(node=>({bg:getComputedStyle(node).backgroundColor,border:getComputedStyle(node).borderColor,image:getComputedStyle(node).backgroundImage,color:getComputedStyle(node).color}));
    expect(chipAfter.image,slug).toBe('none');
    expect(chipAfter.bg,slug).not.toBe(chipBefore.bg);
    expect(chipAfter.border,slug).not.toBe(chipBefore.border);
    expect(chipAfter.color,slug).not.toBe('rgb(255, 255, 255)');
  }
});

test('initial chat stays readable and removes selection clutter after first message', async ({ page }) => {
  for (const slug of demos) {
    await openDemo(page,slug,{width:390,height:844});
    await page.locator('[data-open="chat"]').click();
    const widget=page.locator('#cx-widget');
    await expect(widget).toHaveClass(/is-open/);
    await expect(page.locator('.cx-mode button')).toHaveCount(2);
    await expect(page.locator('.cx-chip')).toHaveCount(4);
    const entry=page.locator('.cx-advisor-entry');
    const welcome=page.locator('.cx-message--assistant .cx-bubble').first();
    await expect(entry).toBeVisible();
    await expect(welcome).toBeVisible();
    await expect(page.locator('.cx-message-avatar')).toBeVisible();
    await expect(page.locator('.cx-widget-note')).toHaveText('mojchatbot.sk');
    const header=await page.locator('.cx-widget-brand').evaluate(node=>({display:getComputedStyle(node).display,divider:getComputedStyle(node.querySelector(':scope > span')).borderLeftWidth}));
    expect(header.display,slug).toBe('grid');
    expect(header.divider,slug).toBe('0px');
    const chipHeight=await page.locator('.cx-chip').first().evaluate(n=>n.getBoundingClientRect().height);
    const bubbleFont=await welcome.evaluate(n=>parseFloat(getComputedStyle(n).fontSize));
    expect(chipHeight,slug).toBeGreaterThanOrEqual(39);
    expect(bubbleFont,slug).toBeGreaterThanOrEqual(12.5);
    await page.locator('.cx-chip').first().click();
    await expect(page.locator('.cx-message--user')).toHaveCount(1);
    await expect(page.locator('.cx-advisor-entry')).toHaveCount(0);
    await expect(page.locator('.cx-chip')).toHaveCount(0);
  }
});

test('every cosmetics advisor keeps four photographic no-scroll steps with stable images', async ({ page }) => {
  test.setTimeout(60000);
  for (const slug of demos) {
    await openDemo(page,slug,{width:390,height:844});
    await page.locator('[data-open="advisor"]').click();
    await expect(page.locator('#cx-widget')).toHaveClass(/is-open/);
    for (let step=0; step<4; step+=1) {
      const body=page.locator('.cx-advisor-body');
      await expect(body).toBeVisible();
      const metrics=await noOverflow(body);
      expect(metrics.ok,`${slug} step ${step+1}: ${JSON.stringify(metrics)}`).toBeTruthy();
      const options=page.locator('.cx-option');
      await expect(options).toHaveCount(4);
      expect(await options.locator('img').evaluateAll(images=>images.every(image=>image.complete&&image.naturalWidth>0)),slug).toBeTruthy();
      const image=options.first().locator('img');
      const before=await image.evaluate(node=>({transform:getComputedStyle(node).transform,filter:getComputedStyle(node).filter}));
      await options.first().hover();
      await page.waitForTimeout(120);
      const after=await image.evaluate(node=>({transform:getComputedStyle(node).transform,filter:getComputedStyle(node).filter}));
      expect(before.transform,slug).toBe('none');
      expect(after.transform,slug).toBe('none');
      expect(after.filter,slug).toBe('none');
      await options.first().click();
      await page.waitForTimeout(300);
    }
    const result=page.locator('.cx-result');
    await expect(result).toBeVisible();
    await expect(result.locator('.cx-product h2')).not.toHaveText('');
    const productLink=result.locator('.cx-product-price a');
    await expect(productLink).toHaveAttribute('href',/^https:\/\//);
    await expect(productLink).toContainText('Pozrieť produkt');
    await expect(result.locator('.cx-result-note')).toContainText('nie zdravotná diagnóza');
  }
});

test('brand systems remain distinct rather than one recolored shell', async ({ page }) => {
  const fingerprints=[];
  for (const slug of demos) {
    await openDemo(page,slug);
    fingerprints.push(await page.evaluate(() => {
      const visual=getComputedStyle(document.querySelector('.cx-owner-visual'));
      const title=getComputedStyle(document.querySelector('.cx-owner-copy h1'));
      const action=getComputedStyle(document.querySelector('.cx-owner-actions button'));
      return [visual.borderRadius,title.fontFamily,title.fontWeight,action.borderRadius,getComputedStyle(document.body).backgroundColor].join('|');
    }));
  }
  expect(new Set(fingerprints).size).toBeGreaterThanOrEqual(4);
});
