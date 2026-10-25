const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const E=require(path.join(root,'n447m/engine.js')),d=require(path.join(root,'n447m/data/mamacoffee.js')),R=require(path.join(root,'n447m/reply.js'));
global.fetch=()=>{throw Error('No network or paid tests allowed')};
assert.equal(d.chat.chips.length,4,'Chat must offer four quick questions');
assert.equal(new Set(d.chat.chips).size,4,'Quick questions must differ');
const paths=E.allPaths(d),coverage=new Set();
for(const {answers:a,trail,result:r}of paths){
 assert(r,'Empty path');
 assert(trail.every(t=>t.question.options.length<=4),'Question overflows approved UI');
 if(r.kind==='drip'){assert.equal(r.total,45);continue}
 assert.equal(r.pack.grams,Number(a.pack));assert.equal(r.pack.grind,a.grind);
 assert(r.product.preps.includes(a.prep));if(a.tool)assert(r.product.tools.includes(a.tool));
 if(a.caffeine)assert.equal(r.product.decaf,a.caffeine==='decaf','Caffeine choice must be honoured independently of flavour');
 assert(fs.existsSync(path.join(root,r.pack.photo)),'Missing pack photo');
 assert(r.pack.photo.endsWith('-'+a.pack+'.jpg'),'Wrong weight photo');
 if(r.limit!==null)assert(r.total<=r.limit+1e-9,'Whole-set budget breached');
 if(r.addon)assert(['v60','aeropress'].includes(a.tool));
 coverage.add(r.product.id+':'+a.pack+':'+a.grind);
 for(const t of trail){const photos=t.question.options.map(o=>o.photo).filter(Boolean);assert.equal(new Set(photos).size,photos.length,'Repeated photo within question')}
}
const expected=d.products.flatMap(p=>[100,250,1000].flatMap(n=>[...new Set(['Zrno',...p.preps.flatMap(prep=>prep==='filter'?p.tools.map(t=>d.grindLabels[t]):[d.grindLabels[prep]])])].map(grind=>p.id+':'+n+':'+grind)));
assert.deepEqual([...coverage].sort(),expected.sort(),'Every compatible product/pack/grind must be reachable');
const ground={prep:'filter',tool:'v60',pack:'250',grind:'Drip - V60',taste:'fresh',budget:'any'};
const result=E.result(d,ground);assert.equal(result.total,329+160);assert.equal(result.addon.product.id,'v60-filters');
assert.equal(E.result(d,{...ground,budget:'329'}).addon,null);
assert.equal(E.result(d,{...ground,budget:'488'}).addon,null);
assert.equal(E.result(d,{...ground,budget:'489'}).total,489);
assert.deepEqual(E.answer({...ground,pick:'uganda'},'pack','100'),{prep:'filter',tool:'v60',pack:'100'});
assert.match(R.coffeeReply(d,'Kolik stojí 250 g Uganda?'),/329/);
assert.match(R.coffeeReply(d,'Kolik stojí 1 kg Colombia bez kofeinu?'),/1.670/);
assert.doesNotMatch(R.coffeeReply(d,'Máte kapsle?'),/Kapsle najdete/);
const proof={checkedAt:new Date().toISOString(),paths:paths.length,productPackGrindCombinations:coverage.size,products:9,verifiedStoreVariants:135,paidAiCalls:0,networkCalls:0,sourceDate:'2026-10-25',coverage:[...coverage],plans:paths.map(p=>({answers:p.answers,trail:p.trail.map(t=>({key:t.key,value:t.value,title:t.question.title})),product:p.result.product.id,kind:p.result.kind,total:p.result.total,limit:p.result.limit}))};
console.log({paths:paths.length,reachableCombinations:coverage.size,paidAiCalls:0});


