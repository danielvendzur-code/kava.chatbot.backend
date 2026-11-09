// screenshoty výsledku pre 3 cesty × 320/390/1280: node shots3.cjs slug outdir "0,0,0" "1,0,1" ...
const {chromium}=require('playwright');const [,,slug,out,...paths]=process.argv;(async()=>{const b=await chromium.launch();
for(const [w,h] of [[320,568],[390,800],[1280,800]])for(const [k,seq] of paths.entries()){const S=seq.split(',').filter(x=>x!=='').map(Number);
const p=await b.newPage({viewport:{width:w,height:h}});await p.route('**/api/**',r=>r.fulfill({status:500,body:'{}'}));
await p.goto(`${process.env.BASE||'http://127.0.0.1:8997'}/cosmetics.html?demo=${slug}`,{waitUntil:'networkidle'});await p.click('[data-open="advisor"]');await p.waitForTimeout(500);
const picked=[];for(let i=0;i<10;i++){const c=p.locator('.cx-quality-stage [data-choice]');if(!await c.count())break;const n=Math.min(S[i]||0,await c.count()-1);picked.push((await c.nth(n).innerText()).split('\n')[0]);await c.nth(n).click();await p.waitForTimeout(300);}
await p.waitForTimeout(400);const hh=await p.evaluate(()=>document.querySelector('.cx-quality-stage .cx-quality-body')?.scrollHeight||800);await p.setViewportSize({width:w,height:Math.min(hh+260,3200)});await p.waitForTimeout(300);
const f=`${out}/${slug}-cesta${k+1}-${w}.png`;await p.screenshot({path:f});console.log(f,'|',picked.join(' → '));await p.close();}
await b.close()})();
