const {chromium}=require('playwright');const [,,slug,...qs]=process.argv;(async()=>{const b=await chromium.launch();
for(const q of qs){const p=await b.newPage({viewport:{width:390,height:800}});await p.route('**/api/**',r=>r.fulfill({status:503,body:'{}'}));
await p.goto(`${process.env.BASE||'http://127.0.0.1:8997'}/cosmetics.html?demo=${slug}`,{waitUntil:'networkidle'});await p.click('[data-open="chat"]');await p.waitForSelector('#cx-input');
await p.fill('#cx-input',q);await p.press('#cx-input','Enter');await p.waitForTimeout(2500);
const r=await p.evaluate(()=>{const l=[...document.querySelectorAll('.cx-message--assistant')].pop();return l.innerText.slice(0,160).replace(/\n/g,' ')+' | karty='+l.querySelectorAll('.lg-wine-card').length});console.log(q,'=>',r);await p.close()}
await b.close()})();
