import {readFileSync,writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
const root=fileURLToPath(new URL('../',import.meta.url));
const brands=['coffeesheep','readyafter','coffeeveronia','grandroastery','kavoholik'];
const path=resolve(root,'api/chat.js');
let source=readFileSync(path,'utf8');
for(const slug of brands){
 const text=readFileSync(resolve(root,slug+'-jolka-data.js'),'utf8');
 const data=JSON.parse(text.slice(text.indexOf('=')+1).trim().replace(/;$/,''));
 const start=source.indexOf('  '+slug+': {');
 if(start<0)throw new Error('Missing backend catalogue '+slug);
 const next=source.indexOf('\n  },',start);
 const end=next>=0?next+5:source.indexOf('\n  }\n};',start)+4;
 if(end<=start)throw new Error('Invalid catalogue boundary '+slug);
 const lines=data.products.map(product=>product.name+'; chuť: '+(product.notes.length?product.notes.join(', '):'neoverená')+'; príprava: '+product.bestFor+'; dostupnosť: '+(product.available?'potvrdená pri kontrole '+product.sourceCheckedOn:'nepotvrdená, neodporúčať')+(product.decaf?'; bez kofeínu':''));
 const block=source.slice(start,end);
 const updated=block.replace(/products: \[.*?\n    \],/s,'products: '+JSON.stringify(lines,null,2).replaceAll('\n','\n    ')+',');
 if(updated===block&&!block.includes(JSON.stringify(lines[0])))throw new Error('Could not update '+slug);
 source=source.slice(0,start)+updated+source.slice(end);
}
writeFileSync(path,source);
