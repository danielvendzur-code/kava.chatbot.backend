const {chromium}=require('playwright');const [,,slug,seq]=process.argv;(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:800}});p.on('pageerror',e=>console.log('ERR',String(e)));
await p.route('**/api/**',r=>r.fulfill({status:503,body:'{}'}));
await p.goto(`${process.env.BASE||'http://127.0.0.1:8997'}/cosmetics.html?demo=${slug}`,{waitUntil:'networkidle'});await p.click('[data-open="advisor"]');await p.waitForTimeout(500);
const S=seq.split(',').map(Number);for(let i=0;i<10;i++){const c=p.locator('.cx-quality-stage [data-choice]');if(!await c.count())break;await c.nth(S[i]||0).click();await p.waitForTimeout(300);}
const btn=p.locator('[data-result-chat], [data-mode="chat"]').first();await p.locator('[data-result-chat]').first().click().catch(async()=>await btn.click());await p.waitForTimeout(800);
console.log(await p.evaluate(()=>[...document.querySelectorAll('.cx-message--assistant')].map(x=>x.innerText.replace(/\n/g,' ').slice(0,140)).join(' || ')));await b.close()})();
