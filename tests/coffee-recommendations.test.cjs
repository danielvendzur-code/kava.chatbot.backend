const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const source=fs.readFileSync('coffee-jolka-app.js','utf8');
const functions=source.slice(source.indexOf('  const WEIGHTS ='),source.indexOf('  const state ='));
function load(file) {
 const context={window:{}};
 vm.runInNewContext(fs.readFileSync(file,'utf8'),context);
 context.products=context.window.JOLKA.products;
 vm.runInNewContext(functions+'\nthis.api={rank,parseCoffeeRequest,recommendationReason};',context);
 context.brand=context.window.JOLKA.brand;
 context.state={chatPreferences:{}};
 context.esc=value=>String(value??'');
 const fallback=source.slice(source.indexOf('  function namedProducts('),source.indexOf('  /* Two bounds,'));
 vm.runInNewContext(fallback+'\nthis.fallbackAnswer=fallbackAnswer;',context);
 return {data:context.window.JOLKA,...context.api,fallbackAnswer:context.fallbackAnswer};
}
const files=['jolka/jolka-data.js',...fs.readdirSync('.').filter(f=>f.endsWith('-jolka-data.js'))];
for(const file of files) {
 const {data,rank,parseCoffeeRequest}=load(file);
 test(file+': preparation, milk, acidity and caffeine stay valid for every answer combination',()=>{
  for(const taste of ['chocolate','balanced','fruity','bold'])
  for(const prep of ['automat','lever','moka','filter'])
  for(const drink of ['black','milk','both'])
  for(const acidity of ['none','mild','bright','explore'])
  for(const caffeine of ['regular','decaf']) {
   const ranked=rank({taste,prep,drink,acidity,caffeine});
   for(const {product} of ranked) {
    assert.ok(product.prep[prep]>=0.6,product.name+' preparation');
    assert.ok(product.drink[drink]>=0.6,product.name+' drink');
    assert.equal(!!product.decaf,caffeine==='decaf',product.name+' caffeine');
    if(acidity==='none'||acidity==='mild') assert.ok(product.acidity<=1,product.name+' acidity');
   }
  }
 });
 test(file+': decaf request takes precedence over filter/espresso words',()=>{
  for(const q of ['filter bez kofeínu','Chcem bezkofeínovú kávu do automatu','espresso decaf s mliekom']) {
   const parsed=parseCoffeeRequest(q);
   assert.equal(parsed.caffeine,'decaf');
   for(const {product} of rank(parsed)) assert.equal(product.decaf,true);
  }
 });
}
test('specific requests and negation',()=>{
 const {rank,parseCoffeeRequest}=load('kaffa-jolka-data.js');
 assert.equal(parseCoffeeRequest('Nechcem bezkofeínovú kávu').caffeine,'regular');
 assert.equal(parseCoffeeRequest('Nemám rád kyslú kávu').acidity,'none');
 assert.equal(parseCoffeeRequest('filter bez mlieka').drink,'black');
 assert.equal(rank(parseCoffeeRequest('automat bez kofeínu')).length,0);
 assert.equal(rank({taste:'fruity',prep:'automat',drink:'black',acidity:'bright'})[0].product.id,'mokka');
});
test('result has no invented percentage or cart confirmation',()=>{
 assert.ok(!source.includes('matchPercent'));
 assert.ok(!source.includes('Pridané do košíka'));
 assert.ok(source.includes('Pozrieť kávu v e-shope'));
});
const sentDemos={
 'jolka/jolka-data.js':['ethiopia-sidamo','brazil-cerrado'],
 'simplecoffee-jolka-data.js':['running','oro'],
 'zlatezrnko-jolka-data.js':['tanzania','india'],
 'ebenica-jolka-data.js':['kenya','impulso'],
 'becafe-jolka-data.js':['baragwi','crema']
};
for(const [file,[filter,automatic]] of Object.entries(sentDemos)) test(file+': representative customers get concrete suitable products',()=>{
 const {rank}=load(file);
 assert.equal(rank({prep:'filter',taste:'fruity',drink:'black',acidity:'bright'})[0].product.id,filter);
 assert.equal(rank({prep:'automat',taste:'chocolate',drink:'black',acidity:'none'})[0].product.id,automatic);
});
test('October 16 availability and product corrections',()=>{
 for(const [file,id] of [['coffeesheep-jolka-data.js','aceh'],['readyafter-jolka-data.js','burundi'],['grandroastery-jolka-data.js','eldiviso'],['kavoholik-jolka-data.js','janosik']]) {
  const {rank}=load(file);
  assert.ok(rank({taste:'bold',prep:'filter',acidity:'explore'}).every(r=>r.product.id!==id));
  assert.ok(rank({taste:'chocolate',prep:'automat'}).every(r=>r.product.id!==id));
 }
 const ready=load('readyafter-jolka-data.js');
 const filterResult=ready.rank({prep:'filter',drink:'black',taste:'fruity'})[0].product;
 assert.ok(filterResult.sourceEvidence.preparation.includes('filter'));
 assert.equal(filterResult.available,true);
 assert.equal(filterResult.prep.filter,1);
 assert.ok(filterResult.taste.fruity>0);
 assert.equal(ready.rank({prep:'filter',caffeine:'decaf'}).length,0);
 const veronia=load('coffeeveronia-jolka-data.js').data;
 assert.equal(veronia.products.find(p=>p.id==='espresso').price,'9,90 €');
 assert.equal(load('kavoholik-jolka-data.js').data.products.find(p=>p.id==='stur').priceUnit,'250 g');
 const api=fs.readFileSync('api/chat.js','utf8');
 const blocks=api.slice(api.indexOf('const DEMOS=' )>=0?api.indexOf('const DEMOS='):api.indexOf('const DEMOS ='),api.indexOf('function setCors'));
 for(const removed of ['Indonesia Aceh Gayo','Colombia El Diviso Natural','Burundi Rumanda Muraho Natural Anaerobic','Espresso káva Jánošík']) {
  const entries=blocks.split('\n').filter(line=>line.includes(removed));
  for(const entry of entries) assert.ok(entry.includes('nepotvrdená, neodporúčať'),removed+' must not be recommendable');
 }
});

test('prices answer the named coffee and never silently substitute the hero coffee',()=>{
 const {fallbackAnswer}=load('kaffa-jolka-data.js');
 const answer=fallbackAnswer('Koľko stojí Kamundu?');
 assert.ok(answer.includes('13,98 €'));
 assert.ok(!answer.includes('11,90'));
 assert.ok(!/\d+[,.]\d+ €/.test(fallbackAnswer('Koľko stojí káva?')));
});
test('caffeine negation and milk restrictions remain explicit',()=>{
 const {parseCoffeeRequest}=load('kaffa-jolka-data.js');
 assert.equal(parseCoffeeRequest('Nechcem kávu bez kofeínu').caffeine,'regular');
 assert.equal(parseCoffeeRequest('Nechcem kofeínovú kávu').caffeine,'decaf');
 assert.equal(parseCoffeeRequest('Nechcem kávu s mliekom').drink,'black');
});

test('today\'s source-backed automatic choices return an actual coffee',()=>{
 for(const slug of ['coffeesheep','readyafter','grandroastery','kavoholik']){
  const ranked=load(slug+'-jolka-data.js').rank({prep:'automat',drink:'black',acidity:'none',taste:'chocolate'});
  assert.ok(ranked.length>0,slug+' must not pass by returning an empty list');
  assert.equal(ranked[0].product.available,true);
 }
});
test('Ready After includes every individual source coffee and recovers nested taste and preparation fields',()=>{
 const {data,rank}=load('readyafter-jolka-data.js');
 assert.equal(data.products.length,40);
 for(const product of data.products) assert.ok(product.notes.length>0,product.name);
 const moonlight=data.products.find(p=>p.id==='d91ecac075de');
 assert.ok(moonlight.notes.includes('čučoriedky'));
 assert.equal(moonlight.prep.automat,1);
 assert.ok(rank({prep:'automat',drink:'milk',taste:'fruity'}).some(r=>r.product.id===moonlight.id));
});
test('Veronia filter coffees cannot be offered as espresso and unverified decaf stays excluded',()=>{
 const {rank,data}=load('coffeeveronia-jolka-data.js');
 for(const {product} of rank({prep:'lever'})) assert.ok(!['costarica','rwanda'].includes(product.id));
 assert.ok(rank({prep:'moka'}).some(r=>r.product.id==='etiopia'));
 assert.equal(rank({caffeine:'decaf'}).length,0);
 assert.equal(data.products.find(p=>p.id==='santos').acidity,null);
});
