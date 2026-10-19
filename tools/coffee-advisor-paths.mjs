// Exercise the scoring functions directly from the shipped runtime, over
// every combination of the questions produced by the shipped adapter.
// Deliberately does not claim to test DOM rendering or layout.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const root=path.resolve(process.argv.find(a=>a.startsWith('--root='))?.slice(7)||path.join(path.dirname(fileURLToPath(import.meta.url)),'..'));
const out=process.argv.find(a=>a.startsWith('--out='))?.slice(6);
const runtime=fs.readFileSync(path.join(root,'coffee-jolka-app.js'),'utf8');
const start=runtime.indexOf('  const WEIGHTS ='),end=runtime.indexOf('  const state =');
if(start<0||end<start)throw Error('Runtime boundaries changed; review test harness');
const scoring=runtime.slice(start,end);
const report={checkedAt:new Date().toISOString(),kind:'logical-coffee-advisor-paths',brands:[],paths:0,failures:[]};
const handler=fs.readFileSync(path.join(root,'api/chat.js'),'utf8');
const slugs=[...handler.matchAll(/^  ([a-z0-9]+):/gm)].map(m=>m[1]);
for(const slug of slugs){
 const ctx={document:{head:{append(){}},createElement(){return {};}}};ctx.window=ctx;vm.createContext(ctx);
 const html=fs.readFileSync(path.join(root,slug+'.html'),'utf8');
 const scripts=[...html.matchAll(/<script\b[^>]*src="([^"?]+)[^"]*"[^>]*>/g)].map(m=>m[1]);
 const data=scripts.filter(f=>/data\.js$/.test(f));
 if(!data.length)throw Error('No advisor data scripts for '+slug);
 for(const f of data)vm.runInContext(fs.readFileSync(path.join(root,f.replace(/^\//,'')),'utf8'),ctx);
 vm.runInContext(fs.readFileSync(path.join(root,'coffee-catalogues',slug+'.js'),'utf8'),ctx);
 vm.runInContext(fs.readFileSync(path.join(root,'coffee-catalogue-adapter.js'),'utf8'),ctx);
 vm.runInContext('const products=window.JOLKA.products;\n'+scoring+'\nglobalThis.testRank=rank;',ctx);
 const row={slug,paths:0,closestMatches:0,emptyPaths:0,maxDepth:ctx.JOLKA.steps.length,failures:0},known=new Set(ctx.CX_COFFEE_CATALOGUES[slug].products.map(p=>p.url));
 function fail(type,answers,detail){row.failures++;report.failures.push({slug,type,answers,detail});}
 function walk(answers,depth){
  const step=ctx.JOLKA.steps[depth];
  if(step){if(!step.options.length)fail('no-options',answers,step.key);for(const o of step.options)walk({...answers,[step.key]:o.value},depth+1);return;}
  row.paths++;const best=ctx.testRank(answers)[0];
  if(!best){row.emptyPaths++;if(!runtime.includes('Takúto kombináciu v ponuke nemáme'))fail('no-empty-state',answers);return;}
  const p=best.product;if(best.unmet.length)row.closestMatches++;
  if(!p.name||!p.price||!known.has(p.url)||p.available===false||p.kind&&p.kind!=='Káva')fail('invalid-winner',answers,p.id);
  if(answers.caffeine==='no'&&!p.decaf&&!p.lowCaffeine||answers.caffeine==='yes'&&(p.decaf||p.lowCaffeine))fail('caffeine',answers,p.id);
  if(best.unmet.length&&!runtime.includes('current.unmet.map'))fail('missing-closest-disclosure',answers,p.id);
 }
 walk({},0);report.paths+=row.paths;report.brands.push(row);
}
if(out)fs.writeFileSync(out,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({brands:report.brands.length,paths:report.paths,failures:report.failures.length,examples:report.failures.slice(0,6)}));
if(report.failures.length)process.exitCode=1;
