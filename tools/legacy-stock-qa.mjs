import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const [root,out]=process.argv.slice(2),base=process.env.QA_BASE||'http://127.0.0.1:8798';
const handler=(await import(root+'/api/cosmetics-chat.js')).default;
const ledger=JSON.parse(await fs.readFile(root+'/research/legacy-stock-2026-10-10.json','utf8'));
const b=await chromium.launch({args:['--no-sandbox']});await fs.mkdir(out,{recursive:true});const results=[];
for(const vp of [{name:'desktop',width:1440,height:900},{name:'mobile',width:390,height:844},{name:'small',width:360,height:800}]){
 const p=await b.newPage({viewport:vp}),errors=[];p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400&&!r.url().includes('/api/'))errors.push(r.status()+' '+r.url());});
 await p.route('**/api/cosmetics-chat',async route=>{let payload,status=200;await handler({method:'POST',headers:{origin:'http://127.0.0.1:8798'},body:route.request().postDataJSON()},{setHeader(){},status(s){status=s;return this},json(x){payload=x;return this},end(){}});await route.fulfill({status,contentType:'application/json',body:JSON.stringify(payload)});});
 try{
  await p.goto(base+'/cosmetics.html?demo=modrapupava',{waitUntil:'networkidle'});
  assert.deepEqual(await p.evaluate(()=>window.COSMETICS_DEMOS.brands.modrapupava.products.map(x=>x.id)),ledger.products.map(x=>x.id));
  await p.locator('[data-open="chat"]').click();await p.locator('[data-mode="advisor"]').click();
  for(const [name,values]of [['dry',['dry','hydrate','simple','cream']],['oily',['oily','clarity','simple','oil']],['sensitive',['sensitive','calm','target','oil']]]){
   await p.locator('#cx-reset').click();await p.locator('[data-mode="advisor"]').click();
   for(let step=0;step<4;step++){
    await p.locator('.cx-progress b').filter({hasText:String(step+1)+'/4'}).waitFor();
    await p.waitForFunction(()=>[...document.querySelectorAll('.cx-option')].every(x=>Number(getComputedStyle(x).opacity)>.98));
    await p.waitForFunction(()=>[...document.querySelectorAll('.cx-option img')].every(i=>i.complete&&i.naturalWidth>0&&getComputedStyle(i).display!=='none'&&Number(getComputedStyle(i).opacity)>.98&&i.getBoundingClientRect().width>20));
    assert.ok((await p.locator('.cx-option img').evaluateAll(a=>a.map(x=>x.getAttribute('src')))).every(src=>src.startsWith('/assets/catalogue/modrapupava-stock-')),'unverified photo in choices');
    assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    if(step===0&&name==='dry')await p.screenshot({path:out+'/modrapupava-'+vp.name+'-choices.png'});
    await p.locator('.cx-option[data-value="'+values[step]+'"]').click();await p.waitForTimeout(650);
   }
   await p.locator('.cx-result').waitFor();const text=await p.locator('.cx-result').innerText();assert.ok(!text.includes('Energy'),'sold-out recommendation');
   const href=await p.locator('.cx-result a').first().getAttribute('href');assert.ok(ledger.products.some(x=>x.url===href),'unverified variant URL');
   if(name==='dry')await p.screenshot({path:out+'/modrapupava-'+vp.name+'-result.png'});
  }
  await p.locator('[data-mode="chat"]').click();await p.locator('#cx-input').fill('Aké máte pleťové sérum?');const response=p.waitForResponse('**/api/cosmetics-chat');await p.locator('#cx-form').evaluate(f=>f.requestSubmit());await response;await p.waitForTimeout(100);await p.waitForFunction(()=>document.querySelectorAll('.cx-message--assistant').length>=2);
  assert.ok(!(await p.locator('.cx-message--assistant').allTextContents()).join(' ').includes('Energy'),'sold-out chat product');
  assert.equal(await p.locator('.cx-message--assistant .cx-message-avatar').count(),await p.locator('.cx-message--assistant').count());
  const hrefs=await p.locator('.cx-message--assistant a').evaluateAll(a=>a.map(x=>x.href));assert.ok(hrefs.length>=1);assert.ok(hrefs.every(url=>ledger.products.some(x=>x.url===url)),'unverified chat link');
  const logos=await p.locator('.cx-message--assistant .cx-company-message-logo').evaluateAll(a=>a.map(x=>getComputedStyle(x).getPropertyValue('--cx-company-message-art')));assert.equal(logos.length,await p.locator('.cx-message--assistant').count());assert.ok(logos.every(x=>x.includes('/assets/catalogue/logos/modrapupava-symbol.png')));
  assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await p.screenshot({path:out+'/modrapupava-'+vp.name+'-chat.png'});assert.deepEqual(errors,[]);results.push({slug:'modrapupava',viewport:vp.name,status:'PASS',products:3,paths:3});
 }catch(e){results.push({slug:'modrapupava',viewport:vp.name,status:'FAIL',error:String(e),browserErrors:errors});await p.screenshot({path:out+'/modrapupava-'+vp.name+'-FAIL.png'});}
 await p.close();
}
await b.close();await fs.writeFile(out+'/results.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results));if(results.some(x=>x.status==='FAIL'))process.exitCode=1;
