import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import vm from 'node:vm';
const root=fileURLToPath(new URL('../',import.meta.url));
const brands=['jolka','simplecoffee','zlatezrnko','ebenica','becafe','coffeesheep','readyafter','coffeeveronia','grandroastery','kavoholik'];
const canonical=url=>{const u=new URL(url);return u.hostname.replace(/^www\./,'')+u.pathname.replace(/\/$/,'');};
let failed=0;
for(const slug of brands){
 const snapshot=JSON.parse(readFileSync(resolve(root,'data/coffee-catalog-audit',slug+'.json'),'utf8'));
 const file=slug==='jolka'?'jolka/jolka-data.js':slug+'-jolka-data.js';
 const context={window:{}};
 vm.runInNewContext(readFileSync(resolve(root,file),'utf8'),context);
 const data=context.window.JOLKA;
 const urls=new Set(data.products.map(p=>canonical(p.url)));
 const missing=snapshot.products.filter(p=>p.kind==='coffee'&&!urls.has(canonical(p.url)));
 const missingNames=missing.slice(0,3).map(p=>p.name).join('; ');
 const date=Date.parse(snapshot.checkedOn+'T00:00:00Z');
 const stale=!Number.isFinite(date)||Date.now()-date>24*60*60*1000;
 const reason=!snapshot.inventoryVerified?'INVENTORY NOT FULLY VERIFIED':stale?'SNAPSHOT STALE':missing.length?'COFFEE PRODUCTS MISSING':snapshot.recommendationAttributeReviewComplete===false?'ATTRIBUTE REVIEW NOT COMPLETE':'OK';
 console.log(`${slug}: ${reason}; ${data.products.length} demo records; ${snapshot.reportedCategoryItems??'unknown'} category items (includes packs/gifts); ${missing.length} missing individual product pages${missingNames?' — '+missingNames:''}`);
 if(reason!=='OK')failed++;
}
if(failed){console.error(`Catalogue review failed for ${failed}/${brands.length} demos. This is not a browser or recommendation-quality pass.`);process.exitCode=1;}
