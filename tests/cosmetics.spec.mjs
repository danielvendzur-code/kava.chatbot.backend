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
    const { data } = await session.send('Page.captureScreenshot', {
      format:'png', fromSurface:true, captureBeyondViewport:true
    });
    fs.writeFileSync(path, Buffer.from(data, 'base64'));
  } finally {
    await session.detach();
  }
}

async function pageMetrics(page) {
  return page.evaluate(() => ({
    h:document.scrollingElement.scrollHeight, ih:innerHeight,
    w:document.scrollingElement.scrollWidth, iw:innerWidth
  }));
}

async function noOverflow(locator, tolerance=3) {
  return locator.evaluate((node,t) => ({
    ok:node.scrollHeight<=node.clientHeight+t && node.scrollWidth<=node.clientWidth+t,
    sh:node.scrollHeight,ch:node.clientHeight,sw:node.scrollWidth,cw:node.clientWidth
  }), tolerance);
}

test('all six cosmetics demos keep branded owner presentation and shared commercial offer', async ({ page }) => {
  test.setTimeout(60000);
  for (const slug of demos) {
    await openDemo(page,slug,{width:1366,height:768},350);
    const owner=page.locator('.cx-owner');
    await expect(owner).toBeVisible();
    await expect(owner.locator('.cx-owner-brand .cx-wordmark')).toBeVisible();
    await expect(owner.locator('[data-open="advisor"]')).toBeVisible();
    await expect(owner.locator('[data-open="chat"]')).toBeVisible();
    await expect(owner.locator('.cx-owner-path > div')).toHaveCount(3);
    await expect(owner.locator('.cx-owner-offer > div')).toHaveCount(3);
    await expect(owner.locator('.cx-owner-contact[href*="mojchatbot.sk/kontakt"]')).toBeVisible();
    await expect(owner.locator('.cx-owner-kicker')).toHaveText('PRODUKTOVÝ PORADCA NA VÁŠ WEB');
    await expect(owner.locator('.cx-owner-offer')).toContainText('Prvý mesiac zdarma');
    await expect(owner.locator('.cx-owner-offer')).toContainText('247 €');
    await expect(owner.locator('.cx-owner-offer')).toContainText('10 €');
    await expect(owner.locator('.cx-owner-offer')).toContainText('Nasadenie na web jedným riadkom kódu');
    expect(await owner.locator('.cx-owner-visual > img').evaluate(image => image.complete && image.naturalWidth > 0)).toBeTruthy();
    const pricingDot = await owner.locator('.cx-plan-summary > span').evaluate(node => getComputedStyle(node,'::before').content);
    expect(['none','normal','""'].includes(pricingDot),slug).toBeTruthy();
    const visualCardBlur = await owner.locator('.cx-owner-visual-card').evaluate(node => getComputedStyle(node).backdropFilter || getComputedStyle(node).webkitBackdropFilter || 'none');
    expect(visualCardBlur,slug).toBe('none');
    const text=await owner.innerText();
    expect(text).not.toMatch(/umelá inteligencia|AI demo|match\s*%|zhoda\s*%/i);
    expect(text.length).toBeLessThan(1250);
    const metrics=await pageMetrics(page);
    expect(metrics.h,slug).toBeLessThanOrEqual(metrics.ih+1);
    expect(metrics.w,slug).toBeLessThanOrEqual(metrics.iw+1);
    await capture(page,`artifacts/cosmetics-${slug}-owner-desktop.png`);
  }
});

test('all six owner presentations fit mobile and keep the important actions visible', async ({ page }) => {
  test.setTimeout(60000);
  for (const slug of demos) {
    await openDemo(page,slug,{width:390,height:844},350);
    await expect(page.locator('.cx-owner-brand')).toBeVisible();
    await expect(page.locator('.cx-owner-contact')).toBeVisible();
    await expect(page.locator('[data-open="advisor"]')).toBeVisible();
    await expect(page.locator('[data-open="chat"]')).toBeVisible();
    await expect(page.locator('.cx-owner-visual')).toBeVisible();
    const metrics=await pageMetrics(page);
    expect(metrics.h,slug).toBeLessThanOrEqual(metrics.ih+1);
    expect(metrics.w,slug).toBeLessThanOrEqual(metrics.iw+1);
    const controls=page.locator('.cx-owner-contact,.cx-owner-actions button');
    const heights=await controls.evaluateAll(nodes=>nodes.map(n=>n.getBoundingClientRect().height));
    expect(Math.min(...heights),slug).toBeGreaterThanOrEqual(36);
    await capture(page,`artifacts/cosmetics-${slug}-owner-mobile.png`);
  }
});

test('initial chat keeps Codex layout but uses calm chips, clean status and coffee-like preview copy', async ({ page }) => {
  for (const slug of demos) {
    await openDemo(page,slug,{width:390,height:844});
    await expect(page.locator('#cx-teaser b')).toHaveText('Neviete, čo vybrať?');
    await expect(page.locator('#cx-teaser span')).toHaveText('4 otázky · jedno odporúčanie');
    await page.locator('#cx-open').click();
    const widget=page.locator('#cx-widget');
    await expect(widget).toHaveClass(/is-open/);
    await expect(page.locator('.cx-mode button')).toHaveCount(2);
    await expect(page.locator('.cx-mode button').first()).toHaveAttribute('data-mode','advisor');
    await expect(page.locator('.cx-chip')).toHaveCount(4);
    await expect(page.locator('.cx-widget-brand > span')).toHaveText('Online poradca');
    const statusStyle=await page.locator('.cx-widget-brand > span').evaluate(node=>({border:getComputedStyle(node).borderLeftWidth,padding:getComputedStyle(node).paddingLeft}));
    expect(statusStyle.border,slug).toBe('0px');
    expect(parseFloat(statusStyle.padding),slug).toBeLessThanOrEqual(1);

    const entry=page.locator('.cx-advisor-entry');
    const welcome=page.locator('.cx-message--assistant .cx-bubble').first();
    await expect(entry).toBeVisible();
    await expect(welcome).toBeVisible();
    await expect(page.locator('.cx-message-avatar')).toBeVisible();
    await expect(page.locator('.cx-widget-note')).toHaveText('mojchatbot.sk');
    const entryBox=await entry.boundingBox();
    const welcomeBox=await welcome.boundingBox();
    expect(entryBox.y,slug).toBeLessThan(welcomeBox.y);
    const chipHeight=await page.locator('.cx-chip').first().evaluate(n=>n.getBoundingClientRect().height);
    const chipFont=await page.locator('.cx-chip').first().evaluate(n=>parseFloat(getComputedStyle(n).fontSize));
    const bubbleFont=await welcome.evaluate(n=>parseFloat(getComputedStyle(n).fontSize));
    expect(chipHeight,slug).toBeGreaterThanOrEqual(39);
    expect(chipFont,slug).toBeGreaterThanOrEqual(10.4);
    expect(bubbleFont,slug).toBeGreaterThanOrEqual(12.5);

    const chip=page.locator('.cx-chip').first();
    const before=await chip.evaluate(node=>({border:getComputedStyle(node).borderColor,bg:getComputedStyle(node).backgroundColor}));
    await chip.hover();
    await page.waitForTimeout(220);
    const hoverStyle=await chip.evaluate(node=>({
      image:getComputedStyle(node).backgroundImage,
      color:getComputedStyle(node).color,
      border:getComputedStyle(node).borderColor,
      bg:getComputedStyle(node).backgroundColor
    }));
    expect(hoverStyle.image,slug).toBe('none');
    expect(hoverStyle.color,slug).not.toBe('rgb(255, 255, 255)');
    expect(hoverStyle.border,slug).not.toBe(before.border);
    expect(hoverStyle.bg,slug).not.toBe(before.bg);

    await capture(page,`artifacts/cosmetics-${slug}-chat-mobile.png`);
    await chip.click();
    await expect(page.locator('.cx-message--user')).toHaveCount(1);
    await expect(page.locator('.cx-advisor-entry')).toHaveCount(0);
    await expect(page.locator('.cx-chip')).toHaveCount(0);
    await expect(page.locator('.cx-mode')).toBeVisible();
  }
});

test('every cosmetics advisor preserves four photographic no-scroll steps and stable images', async ({ page }) => {
  test.setTimeout(60000);
  for (const slug of demos) {
    await openDemo(page,slug,{width:390,height:844});
    await page.locator('#cx-open').click();
    await expect(page.locator('#cx-widget')).toHaveClass(/is-open/);
    await page.locator('.cx-mode button[data-mode="advisor"]').click();
    await expect(page.locator('.cx-mode button[data-mode="advisor"]')).toHaveClass(/is-active/);

    for (let step=0; step<4; step+=1) {
      const body=page.locator('.cx-advisor-body');
      await expect(body).toBeVisible();
      const metrics=await noOverflow(body);
      expect(metrics.ok,`${slug} step ${step+1}: ${JSON.stringify(metrics)}`).toBeTruthy();
      const options=page.locator('.cx-option');
      await expect(options).toHaveCount(4);
      const visible=await options.evaluateAll(nodes=>nodes.every(n=>n.getClientRects().length>0));
      expect(visible,slug).toBeTruthy();
      const imageCount=await options.locator('img').count();
      expect(imageCount,slug).toBe(4);
      expect(await options.locator('img').evaluateAll(images=>images.every(image=>image.complete&&image.naturalWidth>0)),slug).toBeTruthy();
      const transformBefore=await options.first().locator('img').evaluate(img=>getComputedStyle(img).transform);
      await options.first().hover();
      await page.waitForTimeout(180);
      const transformAfter=await options.first().locator('img').evaluate(img=>getComputedStyle(img).transform);
      expect(transformBefore,slug).toBe('none');
      expect(transformAfter,slug).toBe('none');
      const h=await options.first().evaluate(n=>n.getBoundingClientRect().height);
      expect(h,slug).toBeGreaterThanOrEqual(105);
      if(step===0) await capture(page,`artifacts/cosmetics-${slug}-advisor-mobile.png`);
      await options.first().click();
      await page.waitForTimeout(300);
    }

    const result=page.locator('.cx-result');
    await expect(result).toBeVisible();
    await expect(result.locator('.cx-product h2')).not.toHaveText('');
    const productLink=result.locator('.cx-product-price a');
    await expect(productLink).toHaveAttribute('href',/^https:\/\//);
    await expect(productLink).toContainText('Pozrieť produkt');
    await expect(result).not.toContainText(/\d+\s*%/);
    await expect(result.locator('.cx-result-note')).toContainText('nie zdravotná diagnóza');
    await capture(page,`artifacts/cosmetics-${slug}-result-mobile.png`);
  }
});

test('brand systems remain distinct rather than recolored clones', async ({ page }) => {
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
