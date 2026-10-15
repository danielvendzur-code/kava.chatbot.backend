const fs = require('node:fs');
const vm = require('node:vm');
const cp = require('node:child_process');
const source = fs.readFileSync('coffee-jolka-app.js', 'utf8');
const production = cp.execFileSync('git', ['show', 'd2a7fc0:coffee-jolka-app.js'], {encoding: 'utf8'});
const functionPart = s => s.slice(s.indexOf('  function pickVariant('), s.indexOf('  function reasonsFor('));
const ranking = source.slice(source.indexOf('  const WEIGHTS ='), source.indexOf('  const state ='));
const report = {checkedAt:'2026-10-15', coverage:'All configured answer combinations against current local catalogue and ranking code; not proof of official product accuracy or rendered UI.', shops:[]};
for (const file of fs.readdirSync('coffee-catalogues').filter(f=>f.endsWith('.js'))) {
  const slug = file.slice(0,-3);
  const c = {window:null,document:{head:{append(){}},createElement(){return {}}},T:(a)=>a,PREP_GRIND:{automat:/^$/,lever:/espresso|páka|pák/i,moka:/moka|koťog|kotog/i,filter:/filter|filtr|french|v60|chemex|drip|prekvap/i}};
  c.window=c; vm.createContext(c);
  const html=fs.readFileSync(slug+'.html','utf8');
  for(const m of html.matchAll(/<script src="([^"?]+)(?:\?[^\"]*)?"/g))if(m[1].endsWith('-data.js'))vm.runInContext(fs.readFileSync(m[1].replace(/^\//,''),'utf8'),c);
  vm.runInContext(fs.readFileSync('coffee-catalogues/'+file,'utf8'),c);
  vm.runInContext(fs.readFileSync('coffee-catalogue-adapter.js','utf8'),c);
  c.products=c.JOLKA.products;
  vm.runInContext(ranking+functionPart(source),c);
  const old={...c};vm.createContext(old);vm.runInContext(functionPart(production),old);
  let answers=[{}];for(const step of c.JOLKA.steps)answers=answers.flatMap(a=>step.options.map(o=>({...a,[step.key]:o.value})));
  const row={slug,products:c.products.length,steps:c.JOLKA.steps.map(s=>s.key),combinations:answers.length,noMatch:0,nearestMatch:0,uncertainPackPrice:0,missingDisplayedPack:0,missingPackProducts:[],variantChangedByFix:0,examples:[]};
  const examples=new Set();
  for(const a of answers){
    const top=c.rank(a)[0];if(!top){row.noMatch++;continue;}
    if(top.unmet.length)row.nearestMatch++;
    const p=top.product,v=c.pickVariant(p,a),before=old.pickVariant(p,a);
    if(!/(\d+(?:[.,]\d+)?)\s*(kg|g)\b/i.test([p.name,p.priceUnit,v?.label].filter(Boolean).join(' '))){
      row.missingDisplayedPack++;
      if(!row.missingPackProducts.some(item=>item.url===p.url))row.missingPackProducts.push({name:p.name,price:v?.priceLabel||p.price,url:p.url});
    }
    if(!v && (/^od\s/i.test(p.price||'') || !Number.isFinite(p.priceAmount)))row.uncertainPackPrice++;
    if(v?.label!==before?.label){row.variantChangedByFix++;const key=p.id+'|'+a.prep;if(row.examples.length<4&&!examples.has(key)){examples.add(key);row.examples.push({product:p.name,prep:a.prep,before:before?.label,after:v?.label});}}
  }
  report.shops.push(row);
}
const out=process.argv[2];if(out)fs.writeFileSync(out,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({shops:report.shops.length,combinations:report.shops.reduce((n,s)=>n+s.combinations,0),results:report.shops.map(s=>({shop:s.slug,paths:s.combinations,nearest:s.nearestMatch,unknownPack:s.uncertainPackPrice,variantFix:s.variantChangedByFix,examples:s.examples}))},null,2));
