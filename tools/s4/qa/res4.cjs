const {chromium}=require('playwright');const [,,slug,seq,out,full]=process.argv;const S=(seq||'').split(',').filter(x=>x!=='').map(Number);(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:800}});p.on('pageerror',e=>console.log('ERR',String(e)));
await p.route('**/api/**',r=>r.fulfill({status:500,body:'{}'}));
await p.goto(`${process.env.BASE||'http://127.0.0.1:8997'}/cosmetics.html?demo=${slug}`,{waitUntil:'networkidle'});await p.click('[data-open="advisor"]');await p.waitForTimeout(500);
for(let i=0;i<10;i++){const c=p.locator('.cx-quality-stage [data-choice]');if(!await c.count())break;await c.nth(S[i]||0).click();await p.waitForTimeout(300);}
await p.waitForTimeout(400);
if(full){const h=await p.evaluate(()=>{const b=document.querySelector('.cx-quality-stage .cx-quality-body');return b.scrollHeight});await p.setViewportSize({width:390,height:Math.min(h+260,3000)});await p.waitForTimeout(300);}
await p.screenshot({path:out});await b.close()})();
