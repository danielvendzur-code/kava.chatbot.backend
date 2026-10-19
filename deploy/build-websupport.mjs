import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const dist=path.join(root,'dist');
if(path.dirname(dist)!==root||path.basename(dist)!=='dist')throw Error('Invalid build directory');
execFileSync(process.execPath,['scripts/stamp-assets.mjs','--check'],{cwd:root,stdio:'inherit'});
const tracked=execFileSync('git',['ls-files','-z'],{cwd:root,encoding:'utf8'}).split('\0').filter(Boolean);
const excluded=/^(?:\.github|tests|scripts|deploy|api|artifacts|tools|node_modules|dist|test-results|playwright-report|\.vercel)\//;
const files=tracked.filter(p=>!excluded.test(p)&&!/(?:^|\/)\.env(?:\.|$)/.test(p)&&!p.endsWith('.md')&&!/^(?:package(?:-lock)?\.json|vercel\.json|\.gitignore|\.nojekyll)$/.test(p));
for(const p of files){const resolved=path.resolve(root,p);if(!resolved.startsWith(root+path.sep)||fs.lstatSync(resolved).isSymbolicLink())throw Error('Unsafe source: '+p);}
fs.rmSync(dist,{recursive:true,force:true});
fs.mkdirSync(dist);
const manifest=[];
function copy(source,relative){const target=path.join(dist,relative);fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(source,target);const bytes=fs.readFileSync(target);manifest.push({path:relative,bytes:bytes.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex')});}
for(const p of files)copy(path.join(root,p),p);
copy(path.join(root,'deploy/websupport.htaccess'),'.htaccess');
for(const p of ['index.html','ukazky.html','cosmetics.html','verzia.txt','chat-brain.js','chat-adapters.js'])if(!fs.existsSync(path.join(dist,p)))throw Error('Missing build file: '+p);
const sourceCommit=execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim();
const release={sourceCommit,appVersion:fs.readFileSync(path.join(dist,'verzia.txt'),'utf8').match(/^verzia: (.+)$/m)?.[1],builtAt:new Date().toISOString(),aiBackend:'https://kava-chatbot-backend-cq4duhomz-danielvendzur-codes-projects.vercel.app',files:manifest};
fs.writeFileSync(path.join(dist,'websupport-release.json'),JSON.stringify(release,null,2)+'\n');
console.log(JSON.stringify({files:manifest.length+1,bytes:manifest.reduce((n,p)=>n+p.bytes,0),sourceCommit,appVersion:release.appVersion}));
