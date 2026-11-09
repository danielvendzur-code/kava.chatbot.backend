const {chromium}=require('playwright');const [,,slug,out]=process.argv;(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:800}});p.on('pageerror',e=>console.log('ERR',String(e)));
await p.route('**/api/**',r=>r.fulfill({status:503,body:'{}'}));
await p.goto(`${process.env.BASE||'http://127.0.0.1:8997'}/cosmetics.html?demo=${slug}`,{waitUntil:'networkidle'});await p.click('[data-open="chat"]');await p.waitForSelector('.cx-chips .cx-chip');
await p.locator('.cx-chips .cx-chip[data-s3-action="compare"]').click();await p.waitForTimeout(500);
const t=p.locator('[data-s4-prod]');console.log('tiles',await t.count());await t.nth(0).click();await t.nth(2).click();await p.waitForTimeout(800);
console.log(await p.evaluate(()=>[...document.querySelectorAll('.cx-message--assistant')].pop().innerText.replace(/\n/g,' | ')));
await p.screenshot({path:out});await b.close()})();
