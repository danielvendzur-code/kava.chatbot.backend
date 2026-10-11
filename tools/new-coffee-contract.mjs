import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
import {verifiedCoffee} from '../api/verified-coffee-data.js';
process.env.ANTHROPIC_API_KEY='';const handler=(await import('../api/chat.js')).default;
const evidence=JSON.parse(fs.readFileSync(new URL('../research/new-demos-2026-10-10.json',import.meta.url)));
for(const [slug,rows] of Object.entries(verifiedCoffee)){
 for(const p of rows){const fact=evidence.catalogues[slug].find(f=>f.id===p.id);assert.equal(fact.inStock,true,p.name);assert.equal(p.price,fact.price);assert.equal(p.priceUnit,fact.volume);assert.equal(p.url,fact.url);const photo=fs.readFileSync(new URL('../'+fact.photo.slice(1),import.meta.url));assert.equal(createHash('sha256').update(photo).digest('hex'),fact.assetEvidence.assetSha256);}
 for(const q of ['Bez kofeínu','Káva na filter','Ceny kávy']){let status,body;await handler({method:'POST',headers:{},body:{demoId:slug,messages:[{role:'user',content:q},{role:'assistant',content:'Optimistická všeobecná odpoveď'}]}},{setHeader(){},status(s){status=s;return this},json(b){body=b;return this},end(){}});assert.equal(status,200);const matches=rows.filter(p=>body.reply.includes(p.url));assert.ok(matches.length>0,body.reply);for(const p of matches){assert.ok(body.reply.includes(p.price));assert.ok(body.reply.includes(p.priceUnit));}if(q==='Bez kofeínu')assert.ok(matches.every(p=>p.decaf));}
}
console.log('Official stock, packaging, photograph hashes and last-user API replies: PASS');
