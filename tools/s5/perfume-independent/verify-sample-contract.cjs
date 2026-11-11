'use strict';
// An explicit in-memory proposal experiment; never write or serve a replacement shared engine.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../../..'),commit=process.argv[2],output=process.argv[3];assert(/^[a-f0-9]{40}$/.test(commit));
const original=cp.execFileSync('git',['-C',root,'show',commit+':advisor-core.js']).toString();
const before="p.category==='fragrance'&&p.source?.series==='s5'";
const after="(p.category==='fragrance'||(p.category==='samples'&&p.isSample===true&&p.source?.sampleSegment==='fragrance'))&&p.source?.series==='s5'";
assert.equal(original.split(before).length,2,'Proposal must target exactly one known predicate');
function instantiate(code){const ctx={module:{exports:{}}};vm.runInNewContext(code,ctx);return ctx.module.exports;}
const baseline=instantiate(original),proposal=instantiate(original.replace(before,after)),report={commit,scope:'Original core failure reproduced; explicit opt-in proposal tested only in memory. No shared engine edits, no replacement runtime, no browser/Preview claim.',paidModelCalls:0,baseline:{},proposal:{},regressionControls:{}};
function tree(core,products){const e=core.create(products),leaves=[],questions=[];function walk(answers={}){const step=e.steps(answers).find(s=>answers[s.key]===undefined);if(step){assert(['fragranceDirection','fragranceProfile'].includes(step.key),step.key);assert(step.options.length>1);questions.push({answers,step});for(const v of step.options)walk({...answers,[step.key]:v});return;}const r=e.recommend(answers);assert(r.winner);assert.equal(r.matches.length,1);assert.equal(core.complementFor(e.products,answers,r.winner),null);leaves.push({answers,id:r.winner.id,url:r.winner.url});}walk();assert.equal(leaves.length,products.length);assert.equal(new Set(leaves.map(r=>r.id)).size,products.length);return {formulaCount:products.length,questions,leaves};}
for(const slug of ['essentique','fragrancesamples']){
 const products=JSON.parse(fs.readFileSync(path.join(__dirname,'candidate-packages',slug,'verified-products.json'))).products,e=baseline.create(products);assert(e.products.every(p=>p.category==='samples'&&p.isSample));report.baseline[slug]={normalizedCategory:'samples',isSamplePreserved:true,steps:e.steps({}),unfilteredMatches:e.recommend({}).matches.length,fragranceTraitFiltering:e.recommend({fragranceProfile:products[0].id}).matches.length,status:'BLOCKED_CURRENT_CORE_DOES_NOT_FILTER_FRAGRANCE_SAMPLES'};assert.equal(e.recommend({fragranceProfile:products[0].id}).matches.length,products.length);
 report.proposal[slug]=tree(proposal,products);const control=products.map(p=>({...p,source:{...p.source,sampleSegment:undefined}}));assert.equal(JSON.stringify(baseline.create(control).steps({})),JSON.stringify(proposal.create(control).steps({})));report.regressionControls[slug+'-without-opt-in']='UNCHANGED';
}
for(const slug of ['scentisimo','kintsugi','oraculum']){
 const src=cp.execFileSync('git',['-C',root,'show',commit+':catalogues/'+slug+'.js']).toString(),ctx={};vm.runInNewContext(src,ctx);const products=ctx.CX_CATALOGUES[slug].products;assert.equal(JSON.stringify(tree(baseline,products)),JSON.stringify(tree(proposal,products)));report.regressionControls[slug]='EXISTING_FULL_BOTTLE_TREE_UNCHANGED';
}
fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({baseline:Object.fromEntries(Object.entries(report.baseline).map(([s,r])=>[s,r.status])),proposal:Object.fromEntries(Object.entries(report.proposal).map(([s,r])=>[s,r.leaves.length])),regressions:report.regressionControls}));
