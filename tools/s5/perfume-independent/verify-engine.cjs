'use strict';
// Read an immutable coordinator commit; never edit the shared core or registry.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),cp=require('node:child_process'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../../..');
const commit=process.argv[2];assert(/^[a-f0-9]{40}$/.test(commit),'Pass exact coordinator commit');
const output=path.resolve(process.argv[3]);
const read=p=>cp.execFileSync('git',['-C',root,'show',commit+':'+p]);
const sandbox={module:{exports:{}}};vm.runInNewContext(read('advisor-core.js').toString(),sandbox);
const core=sandbox.module.exports,report={commit,scope:'Independent offline use of coordinator core. No runtime registration, browser or Preview claim.',paidModelCalls:0,companies:{}};
for(const slug of ['adoraniche','nicheandglow','scentisimo']){
 const facts=JSON.parse(fs.readFileSync(path.join(root,`n447/s5/sources/${slug}/verified-products.json`)));
 let products=facts.products;
 if(slug!=='scentisimo'){
  const ctx={};vm.runInNewContext(read(`catalogues/${slug}.js`).toString(),ctx);products=ctx.CX_CATALOGUES[slug].products;
  const source=new Map(facts.products.map(p=>[p.id,p]));
  for(const p of products){const f=source.get(p.id);assert(f);for(const key of ['url','priceAmount','currency','volume','photo'])assert.equal(p[key],f[key],slug+' '+p.id+' '+key);}
 }
 const engine=core.create(products),leaves=[],questions=[];
 function visit(answers={}){
  const step=engine.steps(answers).find(s=>answers[s.key]===undefined);
  if(step){assert(['fragranceDirection','fragranceProfile'].includes(step.key));assert(step.options.length>1);questions.push({answers,step});for(const value of step.options)visit({...answers,[step.key]:value});return;}
  const result=engine.recommend(answers);assert(result.winner);assert.equal(result.matches.length,1);const p=result.winner;
  for(const [key,value]of Object.entries(answers))assert.equal(p.features[key],value);
  assert.equal(core.complementFor(engine.products,answers,p),null);
  leaves.push({answers,id:p.id,url:p.url});
 }
 visit();assert.equal(new Set(leaves.map(l=>l.id)).size,products.length);assert.equal(leaves.length,products.length);
 report.companies[slug]={status:'ENGINE_TREE_PASS',source:slug==='scentisimo'?'Own reserved source facts on coordinator core; not integrated registry':'Coordinator integrated catalogue vs own source facts',formulaCount:products.length,questions,leaves};
}
fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(Object.fromEntries(Object.entries(report.companies).map(([k,v])=>[k,{formulas:v.formulaCount,leaves:v.leaves.length,questions:v.questions.length,status:v.status}]))));
