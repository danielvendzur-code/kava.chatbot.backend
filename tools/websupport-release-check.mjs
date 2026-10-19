import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),dist=path.join(root,'dist');
const release=JSON.parse(fs.readFileSync(path.join(dist,'websupport-release.json'),'utf8'));
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
assert.equal(release.appVersion,fs.readFileSync(path.join(root,'verzia.txt'),'utf8').match(/^verzia: (.+)$/m)?.[1]);
for(const file of release.files){assert(!/^(?:api|tools|tests|\.github|node_modules)\//.test(file.path),'Development/server file in static release: '+file.path);assert(!/(?:^|\/)\.env(?:\.|$)/.test(file.path),'Environment file in static release');assert.equal(sha(fs.readFileSync(path.join(dist,file.path))),file.sha256,file.path);}
const htaccess=fs.readFileSync(path.join(dist,'.htaccess'),'utf8');
assert(htaccess.includes('^api/(chat|cosmetics-chat)/?$ '+release.aiBackend+'/api/$1 [R=307,L,NE,QSD]'),'Chat forwarding must preserve POST and use only the verified backend');
assert(!/\[P(?:,|\])/.test(htaccess),'Shared hosting must not require proxy privileges');
const demos=['praziarnicka','diamonds','kaffa','vitazov','concept','jolka','goriffee','readyafter','coffeesheep','zlatezrnko','becafe','simplecoffee','ebenica','casadelcaffe','coffeeveronia','grandroastery','coffeein','kavoholik','donfranko','ajvencoffee','kavavra','grain'];
let references=0;
for(const slug of demos){const name=slug+'.html',html=fs.readFileSync(path.join(dist,name),'utf8');assert(/<title>[^<]+<\/title>/i.test(html),name+' needs a title');for(const match of html.matchAll(/(?:src|href)=["']([^"']+)["']/g)){const raw=match[1];if(/^(?:https?:|\/\/|#|mailto:|tel:|data:)/.test(raw))continue;const relative=raw.split(/[?#]/)[0];if(!relative)continue;const target=path.resolve(dist,relative.replace(/^\//,''));assert(target.startsWith(dist+path.sep),'Reference escapes release: '+raw);assert(fs.existsSync(target),name+' missing '+raw);references++;}}
console.log(JSON.stringify({pass:true,demos:demos.length,files:release.files.length+1,localReferences:references,appVersion:release.appVersion,paidApiCalls:0}));
