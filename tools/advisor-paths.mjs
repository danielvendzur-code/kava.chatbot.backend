// Walk the actual adaptive recommendation cores; no browser or network is used.
// This covers logical paths, not visual layout or rendering.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath,pathToFileURL} from 'node:url';
const root=path.resolve(process.argv.find(a=>a.startsWith('--root='))?.slice(7)||path.join(path.dirname(fileURLToPath(import.meta.url)),'..'));
const out=process.argv.find(a=>a.startsWith('--out='))?.slice(6);
const specs=fs.existsSync(path.join(root,'kozmetika-nove'))?
 [['skin','kozmetika-nove','advisor-core.js','CXAdvisorCore'],['hair','vlasy-nove','advisor-core.js','CXAdvisorCore']]:
 fs.existsSync(path.join(root,'wine-catalogues'))?[['wine','.','wine-advisor-core.js','CXWineAdvisorCore']]:
 fs.existsSync(path.join(root,'tea-advisor-core.js'))?[['tea','.','tea-advisor-core.js','CXTeaCore']]:[['skin','.','advisor-core.js','CXAdvisorCore']];
const report={checkedAt:new Date().toISOString(),kind:'logical-advisor-paths',brands:[],paths:0,nodes:0,failures:[]};
for(const [family,sub,coreFile,coreName] of specs){
 const dir=path.join(root,sub),load=p=>import(pathToFileURL(path.join(dir,p)).href);
 const folder=family==='wine'?'wine-catalogues':'catalogues';
 if(fs.existsSync(path.join(dir,'catalogue-data.js')))await load('catalogue-data.js');
 for(const f of fs.readdirSync(path.join(dir,folder)).filter(f=>['skin','hair'].includes(family)?f.endsWith('-refresh.js'):f.endsWith('.js')))await load(folder+'/'+f);
 const catalogues=family==='wine'?globalThis.CX_WINE_CATALOGUES:globalThis.CX_CATALOGUES;
 const handler=fs.readFileSync(path.join(dir,'api/cosmetics-chat.js'),'utf8');
 const slugs=family==='tea'?['pauwex','afrabio']:[...handler.matchAll(/^  ([a-z0-9]+):/gm)].map(m=>m[1]);
 const context={};vm.createContext(context);vm.runInContext(fs.readFileSync(path.join(dir,coreFile),'utf8'),context);
 for(const slug of slugs){
  const brand=catalogues[slug];if(!brand)throw Error('Missing catalogue '+slug);
  const source=brand.products,engine=context[coreName].create(source),known=new Set(source.flatMap(p=>[p.url,...(p.variants||[]).map(v=>v.url)])),row={family,slug,paths:0,nodes:0,maxDepth:0,emptyPaths:0,failures:0};
  const fail=(type,answers,detail)=>{row.failures++;report.failures.push({family,slug,type,answers,detail});};
  function recommendation(a){const r=engine.recommend(a);return Array.isArray(r)?{winner:r[0],alternative:r[1],matches:r}:r;}
  const walk=(answers,depth)=>{
   row.nodes++;row.maxDepth=Math.max(row.maxDepth,depth);
   if(depth>9){fail('depth',answers);return;}
   const steps=engine.steps(answers),step=steps[depth];
   if(!step){
    row.paths++;const r=recommendation(answers),p=r.winner;
    if(!p){row.emptyPaths++;fail('empty-result',answers);return;}
    if(!p.name||!p.price||!known.has(p.url)||p.available===false)fail('invalid-winner',answers,p.id);
    if(answers.budget&&Number(p.priceAmount)>Number(answers.budget))fail('over-budget',answers,p.id);
    if(r.alternative&&(r.alternative.id===p.id||r.alternative.url===p.url))fail('duplicate-alternative',answers,p.id);
    if(family==='wine'&&p.kind!=='Víno')fail('not-wine',answers,p.id);
    if(family==='tea'&&answers.caffeine==='no'&&p.type!=='set'&&p.caffeine!==false)fail('caffeine',answers,p.id);
    if(['skin','hair'].includes(family)&&answers.category&&p.category!==answers.category)fail('wrong-category',answers,p.id);
    return;
   }
   let values=[...step.options];
   // The renderer adds the explicit unlimited budget choice.
   if(step.key==='budget'&&!values.includes(''))values.push('');
   // Care advisors hide choices with no matching product. Tea/wine have their
   // own narrowing cores; all their published choices are walked as-is.
   if(['skin','hair'].includes(family)){
    const viable=values.filter(v=>v==='any'||recommendation({...answers,[step.key]:v}).winner);
    if(viable.length)values=viable;
    if(values.filter(v=>v!=='any').length>3)values=values.filter(v=>v!=='any');
   }
   if(!values.length){fail('no-options',answers,step.key);return;}
   for(const v of values)walk({...answers,[step.key]:v},depth+1);
  };
  walk({},0);report.paths+=row.paths;report.nodes+=row.nodes;report.brands.push(row);
 }
}
if(out)fs.writeFileSync(out,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({brands:report.brands.length,paths:report.paths,nodes:report.nodes,failures:report.failures.length,examples:report.failures.slice(0,6)}));
if(report.failures.length)process.exitCode=1;
