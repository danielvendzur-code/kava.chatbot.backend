import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';import assert from 'node:assert/strict';
const [out,...slugs]=process.argv.slice(2);await fs.mkdir(out,{recursive:true});const base=process.env.QA_BASE||'http://127.0.0.1:8800';
const newBrowser=()=>chromium.launch({executablePath:process.env.CHROMIUM||'/tmp/chromium',args:['--no-sandbox','--single-process','--no-zygote']});const results=[];
for(const slug of slugs)for(const vp of [{name:'desktop',width:1440,height:900},{name:'mobile',width:390,height:844},{name:'small',width:360,height:800}]){
 const browser=await newBrowser();const page=await browser.newPage({viewport:vp});const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400&&!r.url().includes('/api/'))errors.push(r.status()+' '+r.url());});
 // Exercise deterministic product fallback when the API is unavailable.
 await page.route('**/api/**',async route=>{const req=route.request();if(req.method()!=='POST')return route.fulfill({status:405,body:'{}'});const body=req.postDataJSON();assert.equal(body.demoId||body.demo,slug);await route.fulfill({status:503,contentType:'application/json',body:'{"error":"QA fallback"}'});});
 const shot=async n=>page.screenshot({animations:'disabled',path:`${out}/${slug}-${vp.name}-${n}.png`});
 try{
  await page.goto(base+'/'+slug+'.html',{waitUntil:'networkidle'});await shot('owner');assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  const products=await page.evaluate(()=>window.JOLKA.products);assert.ok(products.length>=5);assert.ok(products.some(p=>p.decaf));
  await page.locator('#heroOpen').click();
  for(const scenario of [['chocolate','automat','milk','none'],['fruity','filter','black','bright']]){
   if(scenario[0]==='fruity')await page.locator('#reset').click();
   for(let step=0;step<4;step++){
    await page.locator('#stepTitle').filter({hasText:`Krok ${step+1} zo 4`}).waitFor();
    await page.locator('.option__visual img').evaluateAll(a=>a.forEach(i=>i.loading='eager'));
    await page.waitForFunction(()=>[...document.querySelectorAll('.option__visual img')].every(i=>i.complete&&i.naturalWidth>0));
    const photos=await page.locator('.option__visual img').evaluateAll(a=>a.map(i=>i.getAttribute('src')));assert.ok(photos.every(p=>p.startsWith('/assets/'+slug+'/')),'generic option photograph');
    if(step===0)await shot(scenario[0]+'-guide');
    await page.locator('.option[data-value="'+scenario[step]+'"]').click();
   }
   await page.locator('#productCta').waitFor();const url=await page.locator('#productCta').getAttribute('href');const p=products.find(p=>p.url===url);assert.ok(p,'unknown result');assert.equal(await page.locator('.result__price b').innerText(),p.price);assert.equal(await page.locator('.result__price span').innerText(),'/ '+p.priceUnit);await shot(scenario[0]+'-result');
   assert.equal(await page.locator('#addToCart').innerText().then(x=>x.includes('Otvoriť v e-shope')),true);
  }
  await page.locator('[data-coffee-offer]').click();assert.equal(await page.locator('#coffeeOffer article').count(),products.length);
  await page.waitForFunction(()=>[...document.querySelectorAll('#coffeeOffer img')].every(i=>i.complete&&i.naturalWidth>0));await shot('offer');
  const input=page.locator('#coffeeOffer input');await input.fill('zzqnone');assert.equal(await page.locator('#coffeeOffer article').count(),0);await input.fill(products[0].name);assert.ok(await page.locator('#coffeeOffer article').count()>0);await input.fill('');
  await page.locator('[data-mode="chat"]').click();await page.locator('#input').fill('Bez kofeínu');await page.locator('#composer').evaluate(f=>f.requestSubmit());await page.waitForFunction(()=>document.querySelectorAll('.msg:not(.msg--user):not(#typing)').length>=2);
  const last=await page.locator('.msg:not(.msg--user)').last().innerText();assert.ok(products.filter(p=>p.decaf).some(p=>last.includes(p.name)),last);
  const logos=await page.locator('.msg:not(.msg--user) .cx-company-message-logo').evaluateAll(a=>a.map(x=>({url:getComputedStyle(x).getPropertyValue('--cx-company-message-art'),w:x.getBoundingClientRect().width})));assert.equal(logos.length,await page.locator('.msg:not(.msg--user)').count());assert.ok(logos.every(x=>x.url.includes('/assets/'+slug+'/symbol.png')&&x.w>=24));await shot('chat');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert.deepEqual(errors,[]);results.push({slug,viewport:vp.name,status:'PASS',products:products.length});
 }catch(e){await shot('FAIL');results.push({slug,viewport:vp.name,status:'FAIL',error:String(e),errors});console.log(slug,vp.name,String(e));}
 await page.close();await browser.close();
}
await fs.writeFile(out+'/results.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results));if(results.some(r=>r.status==='FAIL'))process.exitCode=1;
