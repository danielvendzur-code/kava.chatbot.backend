'use strict';
// Probe only. Two synthetic fixtures establish the existing core contract; no merchant facts or network/model calls.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const core=require('../../../advisor-core.js');
const fixture=(id,direction,note)=>({id,name:id,category:'fragrance',kind:'Eau de Parfum',available:true,priceAmount:100,currency:'EUR',volume:'50 ml',url:'https://example.invalid/'+id,photo:'/fixture-'+id+'.webp',source:{series:'s5',categoryLocked:true,kindLocked:true,suitabilityEvidence:{},fragrance:{notes:[note]},selectionTraitsEvidence:{fixture:true},selectionTraits:{fragranceDirection:direction,fragranceProfile:note}}});
const engine=core.create([fixture('citrus-fixture','green','bergamot'),fixture('woody-fixture','wood','sandalwood')]);
const answers={fragranceDirection:'wood',fragranceProfile:'sandalwood'};
const result=engine.recommend(answers);
assert.equal(result.matches.length,2);
assert.equal(result.winner.id,'citrus-fixture');
const report={type:'EXISTING_ENGINE_GAP_CONFIRMED',fixturesOnly:true,modelCalls:0,steps:engine.steps({}),answers,actualMatches:result.matches.map(p=>p.id),actualWinner:result.winner.id,required:'Opt-in fragranceDirection/fragranceProfile filtering and questions from source-evidenced note preferences. No skincare field relabeling.'};
fs.writeFileSync('n447/s5/dokazy/perfume-worker/engine-probe.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report));
