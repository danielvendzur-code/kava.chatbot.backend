import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const [root,out, ...slugs]=process.argv.slice(2);
const base=process.env.QA_BASE||'http://127.0.0.1:8798';
const handler=(await import(root+'/api/cosmetics-chat.js')).default;
await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({...(process.env.CHROMIUM?{executablePath:process.env.CHROMIUM}:{}),args:['--no-sandbox']});
const results=[];
for(const slug of slugs)for(const vp of [{name:'desktop',width:1440,height:900},{name:'mobile',width:390,height:844},{name:'small',width:360,height:800}]){
 const page=await browser.newPage({viewport:vp});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 page.on('response',r=>{if(r.status()>=400&&!r.url().includes('/api/'))errors.push(r.status()+' '+r.url());});
 await page.route('**/api/cosmetics-chat',async route=>{
  const req={method:'POST',headers:{origin:'http://127.0.0.1:8798'},body:route.request().postDataJSON()};let payload,status=200;
  await handler(req,{setHeader(){},status(s){status=s;return this},json(v){payload=v;return this},end(){}});
  await route.fulfill({status,contentType:'application/json',body:JSON.stringify(payload)});
 });
 const imageCheck=async()=>{
  await page.locator('.cx-catalogue-stage img').evaluateAll(imgs=>imgs.forEach(i=>i.loading='eager'));
  await page.waitForFunction(()=>[...document.querySelectorAll('.cx-catalogue-stage img')].every(i=>i.complete&&i.naturalWidth>0),null,{timeout:8000});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'horizontal overflow');
 };
 const shot=async name=>page.screenshot({path:`${out}/${slug}-${vp.name}-${name}.png`});
 try{
  await page.goto(base+'/cosmetics.html?demo='+slug,{waitUntil:'networkidle'});
  await shot('owner');await page.locator('[data-open="chat"]').click();await page.locator('[data-mode="advisor"]').click();
  await imageCheck();await shot('guide');
  const groups=await page.evaluate(()=>window.CX_CATALOGUE_QA.groups.map(x=>x[0]));
  for(const category of groups){
   await page.locator('#cx-reset').click();await page.locator(`[data-choice="${category}"]`).click();
   await imageCheck();if(vp.name!=='small')await shot(category+'-types');
   for(let step=1;step<4;step++){
    if(step===3){const eligible=await page.evaluate(()=>window.CX_CATALOGUE_QA.comparablePackages(window.CX_CATALOGUE_QA.selected()));assert.equal(await page.locator('[data-choice="small"],[data-choice="large"]').count(),eligible?2:0,'invalid packaging sort');}
    await page.locator('[data-choice]').first().click();await imageCheck();
   }
   const count=await page.locator('.cx-catalogue-card').count();assert.ok(count>0,'empty result');
   const ids=await page.locator('.cx-catalogue-card').evaluateAll(cards=>cards.map(c=>c.dataset.productId));
   assert.equal(new Set(ids).size,ids.length,'duplicate SKU');
   const wrong=await page.evaluate(({ids,category})=>window.CX_CATALOGUE_QA.products.filter(p=>ids.includes(p.id)&&p.category!==category),{ids,category});assert.deepEqual(wrong,[],'cross-category result');
   if(vp.name!=='small')await shot(category+'-result');
  }
  if(groups.includes('face')) {
   await page.locator('#cx-reset').click();await page.locator('[data-choice="face"]').click();
   await page.locator('[data-face-advisor]').click();
   for(let step=0;step<4;step++){
    await page.locator('.cx-progress b').filter({hasText:String(step+1)+'/4'}).waitFor();
    await page.waitForFunction(()=>[...document.querySelectorAll('.cx-option img')].every(i=>i.complete&&i.naturalWidth>0));
    if(step===3&&['noili','two'].includes(slug))assert.equal(await page.locator('.cx-option').first().getAttribute('data-value'),'cream');
    const photos=await page.locator('.cx-option img').evaluateAll(a=>a.map(i=>i.getAttribute('src')));assert.ok(photos.length>0);assert.ok(photos.every(src=>src.startsWith('/assets/catalogue/')),'generic original-flow photo');
    await page.locator('.cx-option').first().click();await page.waitForTimeout(480);
   }
   await page.locator('.cx-result').waitFor({state:'visible'});
   assert.ok(await page.locator('.cx-result').count()>0,'original face advisor failed');
   if(['noili','two'].includes(slug)){const href=await page.locator('.cx-result a').first().getAttribute('href');assert.equal(await page.evaluate(url=>window.CX_CATALOGUE_QA.products.find(x=>x.url===url)?.kind,href),'Pleťové krémy','serum recommended for cream choice');}
   if(slug==='noili')assert.ok(!await page.locator('.cx-result').innerText().then(t=>/vzorka|2 ml/.test(t)),'sample selected as full face product');
   if(vp.name!=='small')await shot('face-original-result');
  }
  await page.locator('[data-catalogue-mode]').click();await imageCheck();
  const n=await page.evaluate(()=>window.CX_CATALOGUE_QA.products.length);assert.equal(await page.locator('.cx-catalogue-card').count(),n,'missing catalogue SKU');
  await shot('catalogue');
  const first=await page.evaluate(()=>window.CX_CATALOGUE_QA.products[0]);await page.locator('.cx-catalogue-search input').fill(first.name.slice(0,8));assert.ok(await page.locator('.cx-catalogue-card').count()>0,'search cannot find own product');
  await page.locator('.cx-catalogue-search input').fill('zzqnotaproduct');assert.equal(await page.locator('.cx-catalogue-card').count(),0);assert.equal(await page.locator('.cx-catalogue-empty').count(),1);
  await page.locator('.cx-catalogue-search input').fill('');
  for(const category of groups){await page.locator(`[data-filter="${category}"]`).click();assert.equal(await page.locator('.cx-catalogue-card').count(),await page.evaluate(c=>window.CX_CATALOGUE_QA.products.filter(p=>p.category===c).length,category));}
  await page.locator('[data-mode="chat"]').click();await page.locator('#cx-input').fill('Máte produkty na vlasy?');await page.locator('#cx-form').evaluate(form=>form.requestSubmit());
  await page.waitForFunction(()=>document.querySelectorAll('.cx-message--assistant').length>=2);assert.ok(await page.locator('.cx-message--assistant').count()>=2,'missing chatbot response');
  assert.equal(await page.locator('.cx-message--assistant .cx-message-avatar').count(),await page.locator('.cx-message--assistant').count(),'missing brand avatar');
  const logos=await page.locator('.cx-message--assistant .cx-company-message-logo').evaluateAll(a=>a.map(x=>({url:getComputedStyle(x).getPropertyValue('--cx-company-message-art'),w:x.getBoundingClientRect().width,h:x.getBoundingClientRect().height})));if(slug!=='ponio')assert.equal(logos.length,await page.locator('.cx-message--assistant').count(),'missing real emblem');assert.ok(logos.every(x=>x.w>=24&&x.h>=24));if(['noili','two'].includes(slug))assert.ok(logos.every(x=>x.url.includes('/assets/catalogue/logos/'+slug+'-symbol.png')),'wrong logo source');
  const samples=await page.evaluate(()=>window.COSMETICS_DEMOS.brands[document.body.dataset.cosmeticsDemo].products.some(p=>p.isSample));assert.equal(samples,false,'sample leaked into default advisor');
  await shot('chat');assert.deepEqual(errors,[],'browser errors');results.push({slug,viewport:vp.name,status:'PASS',products:n,categories:groups});
 }catch(e){await shot('FAIL');results.push({slug,viewport:vp.name,status:'FAIL',error:String(e),browserErrors:errors});console.log(slug,vp.name,String(e),JSON.stringify(errors));}
 await page.close();
}
await browser.close();await fs.writeFile(out+'/results.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results));if(results.some(x=>x.status==='FAIL'))process.exitCode=1;
