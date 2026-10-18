/* Offline handler regression: node tools/chat-regression.mjs [--mock] [--out=path]
   No real key or network is used. Keep result IDs stable to compare before/after. */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {spawnSync} from 'node:child_process';
const self=fileURLToPath(import.meta.url),root=path.resolve(path.dirname(self),'..');
const arg=name=>process.argv.find(a=>a.startsWith('--'+name+'='))?.split('=').slice(1).join('=');
const mock=process.argv.includes('--mock');
const specs=fs.existsSync(path.join(root,'kozmetika-nove'))?
 [['skin','kozmetika-nove','cosmetics-chat'],['hair','vlasy-nove','cosmetics-chat'],['plants','rastliny-demo','cosmetics-chat']]:
 fs.existsSync(path.join(root,'coffee-catalogues'))?[['coffee','.','chat'],['skin','.','cosmetics-chat']]:
 fs.existsSync(path.join(root,'wine-catalogues'))?[['wine','.','cosmetics-chat']]:[['tea','.','cosmetics-chat']];
if(!arg('family')){
 const reports=[];
 for(const [family] of specs){const run=spawnSync(process.execPath,[self,'--family='+family,...(mock?['--mock']:[])],{encoding:'utf8'});if(run.status!==0)throw Error(run.stderr||run.stdout);reports.push(JSON.parse(run.stdout));}
 const result={mode:mock?'mock':'offline',total:reports.reduce((n,r)=>n+r.total,0),passed:reports.reduce((n,r)=>n+r.passed,0),reports};
 if(arg('out'))fs.writeFileSync(arg('out'),JSON.stringify(result,null,2)+'\n');
 const baseline=arg('baseline')?JSON.parse(fs.readFileSync(arg('baseline'),'utf8')):null;
 if(baseline){const before=new Set(baseline.reports.flatMap(r=>r.cases.filter(c=>c.ok).map(c=>r.family+':'+c.id)));const now=new Map(reports.flatMap(r=>r.cases.map(c=>[r.family+':'+c.id,c.ok])));const lost=[...before].filter(id=>!now.get(id));if(lost.length)throw Error('Previously passing cases failed: '+lost.join(', '));}
 console.log(JSON.stringify({mode:result.mode,total:result.total,passed:result.passed,families:reports.map(r=>({family:r.family,demos:r.demos,passed:r.passed,total:r.total,failures:r.cases.filter(c=>!c.ok).slice(0,8)}))}));
 process.exit(0);
}
const [family,sub,endpoint]=specs.find(s=>s[0]===arg('family'));
const dir=path.join(root,sub),load=p=>import(pathToFileURL(path.join(dir,p)).href);
process.env.ANTHROPIC_API_KEY=mock?'offline-test-key':'';
let reply='Dobrý deň, rád pomôžem s výberom.',providerError=false,calls=0;
globalThis.fetch=async()=>{calls++;if(!mock)throw Error('Offline test attempted network');if(providerError)throw Error('provider unavailable');return {ok:true,json:async()=>({content:[{type:'text',text:reply}]})};};
console.warn=()=>{};console.error=()=>{};
let catalogues={};
if(family==='plants'){
 const {BRANDS}=await load('catalog-index.mjs'),{getBrand}=await load('catalogue-loader.mjs');
 for(const slug of Object.keys(BRANDS))catalogues[slug]=await getBrand(slug);
}else{
 const folder=family==='coffee'?'coffee-catalogues':family==='wine'?'wine-catalogues':'catalogues';
 if(['skin','tea'].includes(family)&&fs.existsSync(path.join(dir,'catalogue-data.js')))await load('catalogue-data.js');
 for(const f of fs.readdirSync(path.join(dir,folder)).filter(f=>family==='skin'||family==='hair'?f.endsWith('-refresh.js'):f.endsWith('.js')))await load(folder+'/'+f);
 const all=family==='coffee'?globalThis.CX_COFFEE_CATALOGUES:family==='wine'?globalThis.CX_WINE_CATALOGUES:globalThis.CX_CATALOGUES;
 const handlerSource=fs.readFileSync(path.join(dir,'api',endpoint+'.js'),'utf8');
 const slugs=family==='tea'?['pauwex','afrabio']:[...handlerSource.matchAll(/^  ([a-z0-9]+):/gm)].map(m=>m[1]);
 for(const slug of slugs)if(all?.[slug])catalogues[slug]=all[slug];
}
const handler=(await load('api/'+endpoint+'.js')).default;
if(arg('inventory')){fs.writeFileSync(arg('inventory'),JSON.stringify(catalogues));process.exit(0);}
async function call(slug,messages){const res={setHeader(){},status(n){this.code=n;return this;},json(p){this.payload=p;return this;},end(){return this;}};await handler({method:'POST',headers:{},body:{demoId:slug,messages,_upstreamHop:true}},res);return res;}
const cases=[],record=(slug,name,ok,detail='')=>cases.push({id:slug+':'+name,ok:!!ok,...(!ok?{detail}: {})});
const common=['Dobrý deň','ďakujem','Aké bude počasie?','kde sídlite','aká je adresa firmy','osobný odber','koľko stojí doprava','kedy to príde','dá sa platiť kartou','dobierka','doprava zadarmo od koľko','odporuč mi niečo do LIMIT UNIT','lacnejšie','drahšie','iné','nie tento','Máte produkt Galaktický XYZ999?','Máte značku Galaktická XYZ999?'];
const topics={coffee:['aké mletie do moka kanvičky','ako pripraviť filter','bez kofeínu','darček','kapsule'],skin:['mám suchú pleť','mám mastnú pleť','SPF','som tehotná','vegánske','pre mužov','vzorky','poradie krokov','bez parfumácie'],hair:['mastné vlasy','suché vlasy','lupiny','bez sulfátov','farbené vlasy'],plants:['do polotieňa','mám mačku','mám psa','som začiatočník','žltnúce listy','kaktusy','sukulenty','kvetináč','substrát'],wine:['víno k rybe','darček','suché víno','sladké víno','nealkoholické','ročník'],tea:['sypaný čaj','vrecúška','bez kofeínu','ako pripraviť čaj']};
const norm=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const urls=s=>[...new Set((s.match(/https?:\/\/[^\s<>"\\]+/g)||[]).map(u=>u.replace(/[.,;)]*$/,'')))];
for(const [slug,c] of Object.entries(catalogues)){
 const products=c.products||[],source=c.source||c.website||'',unit=c.currency==='CZK'||products.some(p=>p.currency==='CZK')?'Kč':'€',limit=unit==='Kč'?500:20;
 const known=new Set([...products,...(c.offer||[])].flatMap(p=>[p.url,...urls(JSON.stringify(p.variants||[]))]));
 const facts=JSON.stringify(c.shipping||{}),allowed=new Set([...known,...urls(facts),source,source.replace(/\/$/,'')]);
 const basic=(r)=>r.code===200&&typeof r.payload?.reply==='string'&&r.payload.reply.trim()&&!/\b(?:undefined|NaN|null)\b/.test(r.payload.reply)&&!r.payload.reply.includes('*');
 if(mock){
  const question=[{role:'user',content:'Odporučte mi niečo'}];
  for(const [name,text,error] of [['natural','Dobrý deň, rád pomôžem s výberom.',false],['invented-price','Odporúčam za 9 999 €.',false],['foreign-url','Pozrite https://example.invalid/product',false],['provider-error','',true]]){
   reply=text;providerError=error;const before=calls,r=await call(slug,question);record(slug,name,r.code===200&&typeof r.payload?.reply==='string'&&calls>before&&(name==='natural'?r.payload.reply===text:r.payload.reply!==text&&(family==='plants'?r.payload.mode==='catalogue':r.payload.fallback===true)),r.payload?.reply);
  }
  providerError=false;continue;
 }
 const questions=[...common,...topics[family]].map(s=>s.replace('LIMIT',limit).replace('UNIT',unit));
 const named=products.find(p=>p.available!==false&&p.url),other=products.find(p=>p.available!==false&&p.url&&p.name!==named?.name);
 if(named)questions.push(named.name,'Ako sa používa '+named.name);
 if(other)questions.push('Porovnaj '+named.name+' a '+other.name);
 const sold=products.find(p=>p.available===false);if(sold)questions.push(sold.name);
 for(const [i,q] of questions.entries()){
  const r=await call(slug,[{role:'user',content:q}]),text=r.payload?.reply||'';
  const productLinks=urls(text).filter(u=>known.has(u));
  record(slug,'question-'+i,basic(r)&&productLinks.length<=3&&urls(text).every(u=>allowed.has(u)||u===source+'/'),text);
  if(i>=3&&i<=10)record(slug,'shipping-'+i,!/—\s*(?:od\s+)?\d/.test(text),text);
  if(q===named?.name)record(slug,'exact-name',text.includes(named.url)||(family==='plants'&&r.payload.products.includes(named.id)),text);
  if(q.startsWith('Porovnaj '))record(slug,'compare',text.includes(named.url)&&text.includes(other.url),text);
  if(q==='žltnúce listy')record(slug,'plant-health',productLinks.length===0,text);
  if(/\.cz(?:\/|$)/.test(source))record(slug,'currency-'+i,!productLinks.length||!/\d\s*€/.test(text),text);
 }
 const history=[{role:'user',content:'Odporučte niečo do '+limit+' '+unit}];
 for(const [i,q] of ['lacnejšie','iné','nie tento','zvýšim rozpočet do '+(limit*2)+' '+unit,'aký je rozdiel'].entries()){
  const first=await call(slug,history);history.push({role:'assistant',content:first.payload.reply},{role:'user',content:q});
  const r=await call(slug,history),text=r.payload?.reply||'';record(slug,'followup-'+i,basic(r)&&urls(text).filter(u=>known.has(u)).length<=3,text);
 }
}
if(mock){
 const {aiAnswer}=await load('api/ai-chat.js');
 const catalogue={source:'https://shop.invalid/',products:[{name:'Overený produkt',price:'12.9 €',url:'https://shop.invalid/product'},{name:'Drahší produkt',price:'1 234,50 €',url:'https://shop.invalid/large'}],shipping:{lines:['Packeta 3,80 €; zadarmo od 60 €'],checkedAt:'2026-10-18'}};
 for(const [name,text,accept] of [
  ['decimal-comma','Cena je 12,90 eur.',true],['decimal-dot','Cena je 12.90 EUR.',true],['decimal-short','Cena je 12,9 €.',true],
  ['thousands-space','Cena je 1 234,50 €.',true],['thousands-dot','Cena je 1.234,50 eur.',true],['thousands-comma','Cena je 1,234.50 EUR.',true],
  ['shipping-price','Doprava je 3.80 €.',true],['price-substring','Cena je 2,9 €.',false],['date-as-price','Cena je 2026 €.',false],
  ['foreign-currency','Cena je 12,9 Kč.',false],['invented-number','Cena je 9 999 €.',false],['invented-cents','Cena je 12,99 €.',false],
  ['exact-link','Pozrite https://shop.invalid/product.',true],['link-prefix','Pozrite https://shop.invalid/prod',false],
  ['foreign-link','Pozrite https://other.invalid/product',false],['link-query','Pozrite https://shop.invalid/product?redirect=evil',false]
 ]){
  const answer=await aiAnswer({family,brand:'Test',web:catalogue.source,catalogue,messages:[{role:'user',content:'Cena?'}],draft:'Overený návrh',apiKey:'offline-test-key',fetchImpl:async()=>({ok:true,json:async()=>({content:[{type:'text',text}]})})});
  record('_guard',name,accept?answer===text:answer===null,answer??'fallback');
 }
}
if(!mock&&calls)throw Error('Offline handlers attempted network: '+calls);
console.log(JSON.stringify({family,demos:Object.keys(catalogues).length,total:cases.length,passed:cases.filter(c=>c.ok).length,cases}));
