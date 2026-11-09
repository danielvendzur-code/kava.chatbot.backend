const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const slug=process.argv[2]||'nutt';require('../../catalogues/'+slug+'.js');const core=require('../../advisor-core.js');
const cat=globalThis.CX_CATALOGUES[slug],engine=core.create(cat.products);let leaves=[],questions=0;
function walk(a={}){const ss=engine.steps(a),s=ss.find(s=>a[s.key]===undefined);if(s){questions++;assert(!['product'].includes(s.key));for(const v of s.options)walk({...a,[s.key]:v});return;}
const r=engine.recommend(a);assert(r.winner,'empty path '+JSON.stringify(a));leaves.push({answers:a,id:r.winner.id});const add=core.complementFor(engine.products,a,r.winner);assert(!add||add.id!==r.winner.id);if(a.budget)assert(r.winner.priceAmount+(add?.priceAmount||0)<=Number(a.budget));}
walk();assert.equal(new Set(leaves.map(l=>l.id)).size,cat.products.length);assert(cat.products.every(p=>p.available&&p.photo&&p.source.verifiedAt&&p.source.selectionTraitsEvidence&&fs.existsSync('.'+p.photo)));
console.log(JSON.stringify({products:cat.products.length,questions,leaves:leaves.length,reachable:new Set(leaves.map(l=>l.id)).size,paidCalls:0,paths:leaves},null,2));
