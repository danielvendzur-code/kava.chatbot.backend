import assert from 'node:assert/strict';
import fs from 'node:fs';
import {answer} from '../../../lib/cosmetics-chat.js';
const rows=[];
for(const slug of ['adoraniche','nicheandglow']){
 const config=JSON.parse(fs.readFileSync(`n447/s5/perfume-fragments/${slug}.config.json`));
 for(const item of config.offlineReplyRequirements){let calls=0;
 const response=await answer({demoId:slug,messages:[{role:'user',content:item.chip}]},{ai:async args=>{calls++;assert.equal(args.brand,config.brand.name);assert.equal(args.catalogue.products.length,12);return '';}});
 assert.equal(response.status,200);assert.equal(calls,1);
 for(const id of item.productIds){const product=globalThis.CX_CATALOGUES[slug].products.find(p=>p.id===id);assert(response.json.reply.includes(product.url)&&response.json.reply.includes(product.price));}
 rows.push({slug,query:item.chip,ids:item.productIds,status:response.status,exactUrlAndPrice:true});
 }
}
fs.writeFileSync('n447/s5/dokazy/perfume-worker/backend-mock.json',JSON.stringify({paidCalls:0,mockCalls:rows.length,rows},null,2)+'\n');console.log('Perfume backend: 6 mocked calls, paid 0.');
