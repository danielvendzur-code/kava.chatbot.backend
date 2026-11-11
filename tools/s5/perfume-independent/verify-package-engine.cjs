'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),cp=require('node:child_process'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../../..'),commit=process.argv[2],out=process.argv[3];assert(/^[a-f0-9]{40}$/.test(commit));
const sandbox={module:{exports:{}}};vm.runInNewContext(cp.execFileSync('git',['-C',root,'show',commit+':advisor-core.js']).toString(),sandbox);const core=sandbox.module.exports;
const report={commit,scope:'Unchanged coordinator core with isolated candidate data; not registered or Preview QA',companies:{},paidModelCalls:0};
for(const slug of (process.argv.slice(4).length?process.argv.slice(4):['kintsugi','oraculum','furiosa','scentium'])){
 const dir=path.join(__dirname,'candidate-packages',slug),facts=JSON.parse(fs.readFileSync(path.join(dir,'verified-products.json'))),config=JSON.parse(fs.readFileSync(path.join(dir,'config.json'))),ctx={};vm.runInNewContext(fs.readFileSync(path.join(dir,'catalogue.js')).toString(),ctx);assert.equal(JSON.stringify(ctx.CX_CATALOGUES[slug]),JSON.stringify(facts));
 const engine=core.create(facts.products),leaves=[],questions=[];
 function walk(answers={}){const step=engine.steps(answers).find(s=>answers[s.key]===undefined);if(step){assert(['fragranceDirection','fragranceProfile'].includes(step.key));assert(step.options.length>1);questions.push({answers,step});for(const option of step.options)walk({...answers,[step.key]:option});return;}const r=engine.recommend(answers);assert(r.winner);assert.equal(r.matches.length,1);assert.equal(core.complementFor(engine.products,answers,r.winner),null);leaves.push({answers,id:r.winner.id,url:r.winner.url});}walk();assert.equal(leaves.length,facts.products.length);assert.equal(new Set(leaves.map(l=>l.id)).size,facts.products.length);
 for(const id of [...config.compareProductIds,...config.offlineReplyRequirements.flatMap(r=>r.productIds)])assert(facts.products.some(p=>p.id===id),id);
 report.companies[slug]={formulaCount:facts.products.length,leaves,questions,status:'PASS'};
}fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(Object.fromEntries(Object.entries(report.companies).map(([s,c])=>[s,{leaves:c.leaves.length,questions:c.questions.length}]))));
