// prejde všetky cesty natívneho poradcu a vypíše nadpisy a možnosti
const {chromium}=require('playwright');const slug=process.argv[2];(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:800}});
await p.route('**/api/**',r=>r.fulfill({status:500,body:'{}'}));
const open=async()=>{await p.goto(`${process.env.BASE||'http://127.0.0.1:8997'}/cosmetics.html?demo=${slug}`,{waitUntil:'networkidle'});await p.click('[data-open="advisor"]');await p.waitForTimeout(300);};
const seen=new Set();const walk=async(path)=>{await open();for(const i of path){await p.locator('.cx-quality-stage [data-choice]').nth(i).click();await p.waitForTimeout(150);}
 const info=await p.evaluate(()=>({h:document.querySelector('.cx-quality-stage .cx-quality-body h2')?.textContent,o:[...document.querySelectorAll('.cx-quality-stage [data-choice]')].map(e=>e.innerText.split('\n')[0]+(e.querySelector('img')?'':' [BEZ FOTKY]')),r:document.querySelector('.cx-quality-product.is-primary h2')?.textContent}));
 if(info.r){console.log('  '.repeat(path.length)+'=> '+info.r);return}
 console.log('  '.repeat(path.length)+info.h+' :: '+info.o.join(' | '));
 for(let i=0;i<info.o.length;i++){if(/Další možnosti|Ďalšie/.test(info.o[i]))continue;await walk(path.concat(i));}};
await walk([]);await b.close()})();
