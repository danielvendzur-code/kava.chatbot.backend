/* Run: node tools/powerlogy-test.mjs. No network or paid model call is permitted. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
import {answer,catalogueFor,DEMOS} from '../api/chat-powerlogy.js';
const require=createRequire(import.meta.url),E=require('../n447c/engine.js'),R=require('../n447c/reply.js'),data=DEMOS.powerlogy;
const network=globalThis.fetch;let attemptedNetwork=0;globalThis.fetch=()=>{attemptedNetwork++;throw Error('Network disabled in Powerlogy regression tests')};
try {
 const paths=E.allPaths(data);
 for(const {answers:a,result:r,trail} of paths){
  assert.ok(r?.priceVerified&&r.pack.verifiedAt,'Every result has a verified concrete variant');
  assert.equal(r.pack.grams,Number(a.pack));assert.equal(r.pack.source,r.pack.url);
  assert.ok(fs.existsSync(new URL('..'+r.pack.photo,import.meta.url)),'Matching package photo');
  assert.equal(r.total,r.pack.price+(r.addon?.price||0));if(r.limit!==null)assert.ok(r.total<=r.limit);
  if(a.detailProcess)assert.equal(a.detailProcess,'blend:'+r.product.blend);
  assert.ok(r.reasons.length>=2&&r.next.items.length);assert.ok(!(a.prep==='filter'&&r.product.id==='strong'));
  for(const {question:q} of trail){const photos=q.options.map(o=>o.photo).filter(Boolean);assert.equal(new Set(photos).size,photos.length)}
 }
 const strong=data.products[1],a={prep:'espresso',pack:'900'};
 assert.equal(E.packFor(data,strong,{...a,budget:'12.95'}),null,'Do not silently substitute the cheaper 250 g');
 assert.ok(E.packFor(data,strong,{...a,budget:'39.95'}));assert.equal(E.packFor(data,strong,{...a,budget:'39.94'}),null);
 const addons={...data,addonFor:()=>({price:5,product:{name:'Fixture accessory'}})},base={prep:'espresso',pack:'250',detailProcess:'blend:arabica'};
 assert.equal(E.result(addons,{...base,budget:'12.95'}).addon,null);
 assert.equal(E.result(addons,{...base,budget:'17.95'}).total,17.95);
 assert.deepEqual(E.answer({...base,budget:'any'},'prep','filter'),{prep:'filter'});
 assert.deepEqual(E.answer({...base,budget:'any'},'pack','900'),{prep:'espresso',pack:'900'});
 assert.match(R.coffeeReply(data,'Som tehotná, môžem piť kávu?'),/Neposudzuje/);
 assert.match(R.coffeeReply(data,'Máte bez kofeínu?'),/Obe kávy.*obsahujú kofeín/);
 const prices=R.coffeeReply(data,'Koľko stojí 900 g?');assert.match(prices,/39,95/);assert.doesNotMatch(prices,/250 g|11,55|12,95/);
 const out=await answer({demoId:'powerlogy',messages:[{role:'user',content:'900 g Strong cena'}]},{ai:async args=>{assert.equal(args.brand,'Powerlogy');return args.draft}});assert.equal(out.status,200);assert.match(out.json.reply,/39,95/);
 const fallback=await answer({demoId:'powerlogy',messages:[{role:'user',content:'Aký je rozdiel?'}]},{ai:async()=>null});assert.equal(fallback.json.fallback,true);
 assert.equal((await answer({demoId:'black',messages:[{role:'user',content:'cena'}]})).status,400);
 assert.equal((await answer({demoId:'powerlogy',messages:[]})).status,400);
 assert.equal(catalogueFor(data).products.flatMap(p=>p.facts).length,4);assert.equal(attemptedNetwork,0);
 console.log(JSON.stringify({slug:'powerlogy',paths:paths.length,maxQuestions:Math.max(...paths.map(p=>p.trail.length)),verifiedVariants:4,paidAiCalls:0,networkAttempts:attemptedNetwork,pass:true}));
}finally{globalThis.fetch=network}
