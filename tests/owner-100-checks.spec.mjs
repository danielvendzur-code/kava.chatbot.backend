import { test, expect } from '@playwright/test';
import fs from 'node:fs';

const baseURL = process.env.BASE_URL || 'http://127.0.0.1:4173';
const coffee = [
  'praziarnicka','diamonds','kaffa','vitazov','concept','jolka','goriffee','readyafter',
  'coffeesheep','zlatezrnko','becafe','simplecoffee','ebenica','casadelcaffe',
  'coffeeveronia','grandroastery','coffeein','kavoholik'
];
const skincare = [
  'mylo','ponio','two','bellcoria','biofy','anemone','modrapupava','facederma',
  'cyprianus','panakeia','barboralori','bellmedi','lavelin','kvitok','soaphoria',
  'syncare','fytopharma','natureal'
];

fs.mkdirSync('artifacts/owner-100-audit', { recursive:true });

const report = { passed:0, failed:0, checks:[] };

function record(name, ok, details='') {
  const item = { name, ok:Boolean(ok), details:String(details || '') };
  report.checks.push(item);
  if (item.ok) report.passed += 1;
  else report.failed += 1;
}

function overlap(a,b,t=0) {
  if (!a || !b) return true;
  return a.x < b.x + b.width - t &&
    a.x + a.width > b.x + t &&
    a.y < b.y + b.height - t &&
    a.y + a.height > b.y + t;
}

function contained(parent, child, t=1) {
  if (!parent || !child) return false;
  return child.x >= parent.x - t &&
    child.y >= parent.y - t &&
    child.x + child.width <= parent.x + parent.width + t &&
    child.y + child.height <= parent.y + parent.height + t;
}

async function box(locator) {
  try { return await locator.boundingBox(); } catch { return null; }
}

async function loadedImage(locator) {
  try {
    if (!await locator.count()) return false;
    return await locator.evaluate(img => img.complete && img.naturalWidth > 0 && img.naturalHeight > 0);
  } catch { return false; }
}

async function clipped(locator, tolerance=2) {
  try {
    return await locator.evaluate((n,t) =>
      n.scrollWidth > n.clientWidth + t || n.scrollHeight > n.clientHeight + t, tolerance);
  } catch { return true; }
}

async function auditCoffeeDesktop(page, slug) {
  await page.setViewportSize({ width:1366, height:768 });
  await page.goto(`${baseURL}/${slug}.html`, { waitUntil:'domcontentloaded' });
  await page.waitForSelector('.mcb-page', { timeout:10000 });
  await page.waitForTimeout(280);

  const owner = page.locator('.mcb-page');
  const main = owner.locator('.mcb-main');
  const frame = owner.locator('.mcb-frame');
  const visual = owner.locator('.mcb-visual');
  const benefits = owner.locator('.mcb-keeps--side li');
  const history = benefits.last();
  const pricing = owner.locator('.mcb-pricing');
  const price = owner.locator('.mcb-price');
  const terms = owner.locator('.mcb-price-terms');
  const termTitle = terms.locator('b');
  const termNote = terms.locator('p');
  const cta = terms.locator('a');

  const [mainBox, frameBox, visualBox, priceBox, pricingBox, historyBox, ctaBox, termTitleBox, termNoteBox] =
    await Promise.all([box(main),box(frame),box(visual),box(price),box(pricing),box(history),box(cta),box(termTitle),box(termNote)]);
  const benefitBoxes = await benefits.evaluateAll(nodes => nodes.map(n => {
    const r=n.getBoundingClientRect(); return {x:r.x,y:r.y,width:r.width,height:r.height};
  }));

  const metrics = await page.evaluate(() => ({
    sw:document.scrollingElement.scrollWidth, sh:document.scrollingElement.scrollHeight,
    iw:innerWidth, ih:innerHeight
  }));
  const ownerText = await owner.innerText();

  record(`coffee/${slug}/desktop no horizontal overflow`, metrics.sw <= metrics.iw + 1, JSON.stringify(metrics));
  record(`coffee/${slug}/desktop no vertical overflow`, metrics.sh <= metrics.ih + 1, JSON.stringify(metrics));
  record(`coffee/${slug}/four benefits`, await benefits.count() === 4);
  record(`coffee/${slug}/history visible`, await history.isVisible());
  record(`coffee/${slug}/history not clipped`, !(await clipped(history)));
  record(`coffee/${slug}/frame above price`, frameBox && pricingBox && frameBox.y + frameBox.height <= pricingBox.y + 2,
    JSON.stringify({frameBox,pricingBox}));
  record(`coffee/${slug}/history does not overlap price`, !overlap(historyBox, pricingBox, 1),
    JSON.stringify({historyBox,pricingBox}));
  record(`coffee/${slug}/price CTA visible`, await cta.isVisible());
  record(`coffee/${slug}/price CTA contained`, contained(priceBox, ctaBox, 2), JSON.stringify({priceBox,ctaBox}));
  record(`coffee/${slug}/CTA not over trial`, !overlap(ctaBox, termTitleBox, 1), JSON.stringify({ctaBox,termTitleBox}));
  record(`coffee/${slug}/CTA not over terms`, !overlap(ctaBox, termNoteBox, 1), JSON.stringify({ctaBox,termNoteBox}));
  record(`coffee/${slug}/price compact width`, priceBox && priceBox.width <= 690, JSON.stringify(priceBox));
  record(`coffee/${slug}/price has vertical weight`, priceBox && priceBox.height >= 112, JSON.stringify(priceBox));
  record(`coffee/${slug}/visual substantial`, visualBox && visualBox.width >= 240 && visualBox.height >= 240, JSON.stringify(visualBox));
  record(`coffee/${slug}/hero image loaded`, await loadedImage(visual.locator('img')));
  record(`coffee/${slug}/right column reaches content edge`, mainBox && frameBox &&
    Math.abs((mainBox.x + mainBox.width) - (frameBox.x + frameBox.width)) <= 3,
    JSON.stringify({mainBox,frameBox}));
  record(`coffee/${slug}/benefit cards do not overlap`, benefitBoxes.every((a,i) =>
    benefitBoxes.every((b,j) => i===j || !overlap(a,b,1))), JSON.stringify(benefitBoxes));
  record(`coffee/${slug}/no install claim`, !/Nasadenie za vás/i.test(ownerText));
  record(`coffee/${slug}/no included product-link claim`, !/Preklik rovno na produkt/i.test(ownerText));
}

async function auditSkincareDesktop(page, slug) {
  await page.setViewportSize({ width:1366, height:768 });
  await page.goto(`${baseURL}/cosmetics.html?demo=${slug}`, { waitUntil:'domcontentloaded' });
  await page.waitForFunction(() => document.documentElement.dataset.cosmeticsReady === 'true', null, { timeout:10000 });
  await page.waitForTimeout(220);

  const owner = page.locator('.cx-owner');
  const hero = owner.locator('.cx-owner-hero');
  const frame = owner.locator('.cx-owner-frame');
  const visual = owner.locator('.cx-owner-visual');
  const benefits = owner.locator('.cx-keeps--side li');
  const history = benefits.last();
  const pricing = owner.locator('.cx-owner-offer');
  const price = owner.locator('.cx-price');
  const terms = owner.locator('.cx-price-terms');
  const termTitle = terms.locator('b');
  const termNote = terms.locator('p');
  const cta = terms.locator('a');

  const [heroBox,frameBox,visualBox,pricingBox,priceBox,historyBox,ctaBox,termTitleBox,termNoteBox] =
    await Promise.all([box(hero),box(frame),box(visual),box(pricing),box(price),box(history),box(cta),box(termTitle),box(termNote)]);
  const benefitBoxes = await benefits.evaluateAll(nodes => nodes.map(n => {
    const r=n.getBoundingClientRect(); return {x:r.x,y:r.y,width:r.width,height:r.height};
  }));
  const metrics = await page.evaluate(() => ({
    sw:document.scrollingElement.scrollWidth, sh:document.scrollingElement.scrollHeight,
    iw:innerWidth, ih:innerHeight
  }));
  const ownerText = await owner.innerText();

  record(`skin/${slug}/desktop no horizontal overflow`, metrics.sw <= metrics.iw + 1, JSON.stringify(metrics));
  record(`skin/${slug}/desktop no vertical overflow`, metrics.sh <= metrics.ih + 1, JSON.stringify(metrics));
  record(`skin/${slug}/four benefits`, await benefits.count() === 4);
  record(`skin/${slug}/history visible`, await history.isVisible());
  record(`skin/${slug}/history not clipped`, !(await clipped(history)));
  record(`skin/${slug}/frame above price`, frameBox && pricingBox && frameBox.y + frameBox.height <= pricingBox.y + 2,
    JSON.stringify({frameBox,pricingBox}));
  record(`skin/${slug}/history does not overlap price`, !overlap(historyBox, pricingBox, 1),
    JSON.stringify({historyBox,pricingBox}));
  record(`skin/${slug}/price CTA visible`, await cta.isVisible());
  record(`skin/${slug}/price CTA contained`, contained(priceBox, ctaBox, 2), JSON.stringify({priceBox,ctaBox}));
  record(`skin/${slug}/CTA not over trial`, !overlap(ctaBox, termTitleBox, 1), JSON.stringify({ctaBox,termTitleBox}));
  record(`skin/${slug}/CTA not over terms`, !overlap(ctaBox, termNoteBox, 1), JSON.stringify({ctaBox,termNoteBox}));
  record(`skin/${slug}/price compact width`, priceBox && priceBox.width <= 690, JSON.stringify(priceBox));
  record(`skin/${slug}/price has vertical weight`, priceBox && priceBox.height >= 112, JSON.stringify(priceBox));
  record(`skin/${slug}/visual substantial`, visualBox && visualBox.width >= 240 && visualBox.height >= 240, JSON.stringify(visualBox));
  record(`skin/${slug}/hero image loaded`, await loadedImage(visual.locator('img')));
  record(`skin/${slug}/right column reaches content edge`, heroBox && frameBox &&
    Math.abs((heroBox.x + heroBox.width) - (frameBox.x + frameBox.width)) <= 3,
    JSON.stringify({heroBox,frameBox}));
  record(`skin/${slug}/benefit cards do not overlap`, benefitBoxes.every((a,i) =>
    benefitBoxes.every((b,j) => i===j || !overlap(a,b,1))), JSON.stringify(benefitBoxes));
  record(`skin/${slug}/no install claim`, !/Nasadenie za vás/i.test(ownerText));
  record(`skin/${slug}/no included product-link claim`, !/Preklik rovno na produkt/i.test(ownerText));
  record(`skin/${slug}/old metric strip removed`, await owner.locator('.cx-owner-figures').count() === 0);
  record(`skin/${slug}/online hidden while closed`, !(await page.locator('.cx-status').isVisible()));
}

async function auditMobile(page, kind, slug) {
  await page.setViewportSize({ width:390, height:844 });
  const url = kind === 'coffee' ? `${baseURL}/${slug}.html` : `${baseURL}/cosmetics.html?demo=${slug}`;
  await page.goto(url, { waitUntil:'domcontentloaded' });
  if (kind === 'skin') {
    await page.waitForFunction(() => document.documentElement.dataset.cosmeticsReady === 'true', null, { timeout:10000 });
  } else {
    await page.waitForSelector('.mcb-page', { timeout:10000 });
  }
  await page.waitForTimeout(140);

  const root = page.locator(kind === 'coffee' ? '.mcb-page' : '.cx-owner');
  const price = root.locator(kind === 'coffee' ? '.mcb-price' : '.cx-price');
  const terms = root.locator(kind === 'coffee' ? '.mcb-price-terms' : '.cx-price-terms');
  const cta = terms.locator('a');
  const [priceBox,ctaBox] = await Promise.all([box(price),box(cta)]);
  const metrics = await page.evaluate(() => ({ sw:document.scrollingElement.scrollWidth, iw:innerWidth }));
  record(`${kind}/${slug}/mobile horizontal containment`, metrics.sw <= metrics.iw + 1, JSON.stringify(metrics));
  record(`${kind}/${slug}/mobile price visible`, await price.isVisible());
  record(`${kind}/${slug}/mobile CTA visible`, await cta.isVisible());
  record(`${kind}/${slug}/mobile CTA contained in price`, contained(priceBox,ctaBox,2), JSON.stringify({priceBox,ctaBox}));
  record(`${kind}/${slug}/mobile price not clipped`, !(await clipped(price)));
  record(`${kind}/${slug}/mobile CTA text readable`, (await cta.innerText()).trim().length >= 5);
}

async function barboraSubjectDelta(page, imageSelector, frameSelector) {
  return page.evaluate(({imageSelector,frameSelector}) => {
    const img=document.querySelector(imageSelector);
    const frame=document.querySelector(frameSelector);
    if (!img || !frame || !img.complete || !img.naturalWidth) return {ok:false, reason:'image/frame unavailable'};

    const size=180;
    const canvas=document.createElement('canvas');
    canvas.width=size; canvas.height=size;
    const ctx=canvas.getContext('2d',{willReadFrequently:true});
    ctx.drawImage(img,0,0,size,size);
    const data=ctx.getImageData(0,0,size,size).data;
    let minX=size,maxX=-1,minY=size,maxY=-1,count=0;
    for(let y=0;y<size;y+=1){
      for(let x=0;x<size;x+=1){
        const i=(y*size+x)*4;
        const r=data[i],g=data[i+1],b=data[i+2],a=data[i+3];
        const lum=.2126*r+.7152*g+.0722*b;
        if(a>200 && lum<205){
          minX=Math.min(minX,x); maxX=Math.max(maxX,x);
          minY=Math.min(minY,y); maxY=Math.max(maxY,y); count+=1;
        }
      }
    }
    if(count<100 || maxX<minX) return {ok:false,reason:'subject not detected',count};
    const sourceCenterX=((minX+maxX)/2)/size*img.naturalWidth;
    const ir=img.getBoundingClientRect();
    const fr=frame.getBoundingClientRect();
    const scale=ir.width/img.naturalWidth;
    const displayedCenter=ir.left+sourceCenterX*scale;
    const frameCenter=fr.left+fr.width/2;
    return {
      ok:true, delta:displayedCenter-frameCenter,
      sourceBox:{minX,maxX,minY,maxY,count}, imageRect:{x:ir.x,width:ir.width}, frameRect:{x:fr.x,width:fr.width}
    };
  }, {imageSelector,frameSelector});
}

test('owner presentation: 100+ collision, readability and brand checks', async ({ page }) => {
  test.setTimeout(180000);

  for (const slug of coffee) await auditCoffeeDesktop(page, slug);
  for (const slug of skincare) await auditSkincareDesktop(page, slug);

  for (const slug of coffee) await auditMobile(page, 'coffee', slug);
  for (const slug of skincare) await auditMobile(page, 'skin', slug);

  // Barbora Lori gets additional brand-specific visual checks.
  await page.setViewportSize({ width:1366, height:768 });
  await page.goto(`${baseURL}/cosmetics.html?demo=barboralori`, { waitUntil:'domcontentloaded' });
  await page.waitForFunction(() => document.documentElement.dataset.cosmeticsReady === 'true');
  await page.waitForTimeout(200);

  const launcher=page.locator('.cx-launcher-button');
  const initials=launcher.locator('.cx-barbora-initials');
  const [launcherBox,initialsBox]=await Promise.all([box(launcher),box(initials)]);
  record('barboralori launcher is circle', launcherBox && Math.abs(launcherBox.width-launcherBox.height)<=1, JSON.stringify(launcherBox));
  record('barboralori launcher uses BL', (await initials.innerText()).trim()==='BL');
  record('barboralori BL centered in launcher', launcherBox && initialsBox &&
    Math.abs((launcherBox.x+launcherBox.width/2)-(initialsBox.x+initialsBox.width/2))<=3 &&
    Math.abs((launcherBox.y+launcherBox.height/2)-(initialsBox.y+initialsBox.height/2))<=3,
    JSON.stringify({launcherBox,initialsBox}));
  record('barboralori BL readable size', await initials.evaluate(n=>parseFloat(getComputedStyle(n).fontSize))>=24);

  const heroDelta=await barboraSubjectDelta(page,'.cx-owner-visual > img','.cx-owner-visual');
  record('barboralori jar optically centered on owner page', heroDelta.ok && Math.abs(heroDelta.delta)<=24, JSON.stringify(heroDelta));

  record('barboralori full header logo loaded', await loadedImage(page.locator('.cx-owner-brand .cx-logo')));
  record('barboralori online hidden while widget closed', !(await page.locator('.cx-status').isVisible()));

  await page.locator('[data-open="chat"]').click();
  await page.waitForTimeout(160);
  record('barboralori online visible only in open widget', await page.locator('.cx-status').isVisible());
  record('barboralori widget full logo loaded', await loadedImage(page.locator('.cx-widget-brand .cx-logo')));
  const avatar=page.locator('.cx-message-avatar .cx-barbora-initials').first();
  record('barboralori assistant avatar uses BL', await avatar.count() === 1 && (await avatar.innerText()).trim()==='BL');

  const entryImage=page.locator('.cx-advisor-entry .cx-advisor-entry-photo img');
  if (await entryImage.count()) {
    const entryDelta=await barboraSubjectDelta(page,'.cx-advisor-entry .cx-advisor-entry-photo img','.cx-advisor-entry .cx-advisor-entry-photo');
    record('barboralori jar centered in chatbot entry', entryDelta.ok && Math.abs(entryDelta.delta)<=12, JSON.stringify(entryDelta));
  } else {
    record('barboralori jar centered in chatbot entry', false, 'advisor entry image missing');
  }

  await page.screenshot({ path:'artifacts/owner-100-audit/barboralori-owner-widget.png', fullPage:true });

  fs.writeFileSync('artifacts/owner-100-audit/report.json', JSON.stringify(report,null,2));
  console.log(`OWNER_AUDIT_TOTAL=${report.checks.length}`);
  console.log(`OWNER_AUDIT_PASSED=${report.passed}`);
  console.log(`OWNER_AUDIT_FAILED=${report.failed}`);
  if (report.failed) {
    console.log('OWNER_AUDIT_FAILURES=' + JSON.stringify(report.checks.filter(x=>!x.ok),null,2));
  }

  expect(report.checks.length).toBeGreaterThanOrEqual(100);
  expect(report.failed, JSON.stringify(report.checks.filter(x=>!x.ok),null,2)).toBe(0);
});
