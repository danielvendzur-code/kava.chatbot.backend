const {chromium}=require('playwright');const [,,slug]=process.argv;(async()=>{const b=await chromium.launch();
for(let i=0;i<4;i++){const p=await b.newPage({viewport:{width:390,height:800}});await p.route('**/api/**',r=>r.fulfill({status:503,body:'{}'}));
await p.goto(`${process.env.BASE||'http://127.0.0.1:8997'}/cosmetics.html?demo=${slug}`,{waitUntil:'networkidle'});await p.click('[data-open="chat"]');await p.waitForSelector('.cx-chips .cx-chip');
const lab=await p.locator('.cx-chips .cx-chip').nth(i).innerText();await p.locator('.cx-chips .cx-chip').nth(i).click();await p.waitForTimeout(2500);
const r=await p.evaluate(()=>{const l=[...document.querySelectorAll('.cx-message--assistant')].pop();return l.innerText.slice(0,200).replace(/\n/g,' ')+' | karty='+l.querySelectorAll('.lg-wine-card').length});console.log(lab,'=>',r);await p.close()}
await b.close()})();
