import { test, expect } from '@playwright/test';
import fs from 'node:fs';

const baseURL = process.env.BASE_URL || 'http://127.0.0.1:4173';
const demos = ['mylo','ponio','two','bellcoria','biofy','anemone'];
fs.mkdirSync('artifacts', { recursive:true });

async function openDemo(page, slug, viewport={width:1366,height:768}) {
  await page.setViewportSize(viewport);
  await page.goto(`${baseURL}/cosmetics.html?demo=${slug}`, { waitUntil:'networkidle' });
  await page.waitForFunction(() => document.documentElement.dataset.cosmeticsReady === 'true');
  await page.waitForTimeout(80);
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

test('all six cosmetics demos have a branded owner presentation that sells the solution', async ({ page }) => {
  for (const slug of demos) {
    await openDemo(page,slug);
    const owner=page.locator('.cx-owner');
    await expect(owner).toBeVisible();
    await expect(owner.locator('.cx-owner-brand .cx-wordmark')).toBeVisible();
    await expect(owner.locator('[data-open="advisor"]')).toBeVisible();
    await expect(owner.locator('[data-open="chat"]')).toBeVisible();
    await expect(owner.locator('.cx-owner-path > div')).toHaveCount(3);
    await expect(owner.locator('.cx-owner-benefits > div')).toHaveCount(3);
    await expect(owner.locator('.cx-owner-contact[href*="mojchatbot.sk/kontakt"]')).toBeVisible();
    const text=await owner.innerText();
    expect(text).not.toMatch(/umelá inteligencia|AI demo|match\s*%|zhoda\s*%/i);
    expect(text.length).toBeLessThan(1250);
    const metrics=await pageMetrics(page);
    expect(metrics.h,slug).toBeLessThanOrEqual(metrics.ih+1);
    expect(metrics.w,slug).toBeLessThanOrEqual(metrics.iw+1);
    await page.screenshot({path:`artifacts/cosmetics-${slug}-owner-desktop.png`,fullPage:true});
  }
});

test('all six owner presentations fit mobile and keep the important actions visible', async ({ page }) => {
  for (const slug of demos) {
    await openDemo(page,slug,{width:390,height:844});
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
    await page.screenshot({path:`artifacts/cosmetics-${slug}-owner-mobile.png`,fullPage:true});
  }
});

test('initial chat is simple, readable and removes selection clutter after the first message', async ({ page }) => {
  for (const slug of demos) {
    await openDemo(page,slug,{width:390,height:844});
    await page.locator('#cx-open').click();
    const widget=page.locator('#cx-widget');
    await expect(widget).toHaveClass(/is-open/);
    await expect(page.locator('.cx-mode button')).toHaveCount(2);
    await expect(page.locator('.cx-chip')).toHaveCount(4);
    const entry=page.locator('.cx-advisor-entry');
    const welcome=page.locator('.cx-message--assistant .cx-bubble').first();
    await expect(entry).toBeVisible();
    await expect(welcome).toBeVisible();
    const entryBox=await entry.boundingBox();
    const welcomeBox=await welcome.boundingBox();
    expect(entryBox.y,slug).toBeLessThan(welcomeBox.y);
    const chipHeight=await page.locator('.cx-chip').first().evaluate(n=>n.getBoundingClientRect().height);
    const chipFont=await page.locator('.cx-chip').first().evaluate(n=>parseFloat(getComputedStyle(n).fontSize));
    const bubbleFont=await welcome.evaluate(n=>parseFloat(getComputedStyle(n).fontSize));
    expect(chipHeight,slug).toBeGreaterThanOrEqual(39);
    expect(chipFont,slug).toBeGreaterThanOrEqual(10.4);
    expect(bubbleFont,slug).toBeGreaterThanOrEqual(12.5);
    await page.locator('.cx-chip').first().click();
    await expect(page.locator('.cx-message--user')).toHaveCount(1);
    await expect(page.locator('.cx-advisor-entry')).toHaveCount(0);
    await expect(page.locator('.cx-chip')).toHaveCount(0);
    await expect(page.locator('.cx-mode')).toBeVisible();
  }
});

test('every cosmetics advisor is four photographic no-scroll steps and ends on a real product', async ({ page }) => {
  for (const slug of demos) {
    await openDemo(page,slug,{width:390,height:844});
    await page.locator('#cx-teaser').click();
    await expect(page.locator('#cx-widget')).toHaveClass(/is-open/);
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
      const h=await options.first().evaluate(n=>n.getBoundingClientRect().height);
      expect(h,slug).toBeGreaterThanOrEqual(105);
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
    await page.screenshot({path:`artifacts/cosmetics-${slug}-result-mobile.png`,fullPage:true});
  }
});

test('brand systems are not just one identical recolored shell', async ({ page }) => {
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
