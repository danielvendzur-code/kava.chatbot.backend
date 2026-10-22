const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),context={};vm.createContext(context);
for(const f of ['coffee-catalogues/praziarnicka.js','coffee-difference-core.js'])vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),context);
const core=context.CXCoffeeDifferenceCore,pool=context.CX_COFFEE_CATALOGUES.praziarnicka.products.filter(p=>p.available!==false&&p.kind==='Káva'&&!p.decaf&&p.taste?.chocolate>=.5);
const notes=core.next(pool,{});assert.equal(notes.key,'detailNotes');assert.equal(notes.options.length,2);
const chocolate=notes.options.find(o=>o.title==='čokoláda');assert.ok(chocolate);
const answers={detailNotes:chocolate.value},composition=core.next(pool,answers);assert.equal(composition.key,'detailComposition');assert.ok(composition.options.some(o=>o.value==='0'));assert.ok(composition.options.some(o=>o.value==='25'));
for(const o of composition.options){const a={...answers,detailComposition:o.value},matches=pool.filter(p=>core.matches(p,a));assert.ok(matches.length);assert.equal(core.next(matches,a),null);}
const cuba=notes.options.find(o=>o.title.includes('tabak'));assert.ok(cuba);const chosen=pool.filter(p=>core.matches(p,{detailNotes:cuba.value}));assert.equal(chosen.length,1);assert.match(chosen[0].name,/Cuba/);
assert.equal(core.next([{name:'Nepomenovaná káva A',notes:[]},{name:'Nepomenovaná káva B',notes:[]}]),null,'Unknown facts cannot become a question');
assert.equal(core.next([{name:'A',notes:['kakao','orechy']},{name:'B',notes:['orechy','kakao']}]),null,'Reordered identical notes are not a difference');
assert.ok(notes.options.every(o=>o.textOnly&&o.title&&o.detail));console.log('PASS factual notes, composition, exact matching, unknown facts and identical note groups.');

assert.equal(core.labelNote('orechy',true),'ořechy');assert.equal(core.labelNote('orechy',false),'orechy');
