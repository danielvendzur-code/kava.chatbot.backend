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
 return {data:context.window.JOLKA,...context.api};
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
