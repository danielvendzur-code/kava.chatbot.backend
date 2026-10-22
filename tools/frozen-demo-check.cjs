const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),scope=JSON.parse(fs.readFileSync(path.join(__dirname,'release-scope-2026-10-22.json'),'utf8'));
for(const item of scope.checks){const bytes=fs.readFileSync(path.join(root,item.file));assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),item.sha256,'Frozen older demo asset changed: '+item.file);}
for(const slug of scope.allowed){const html=fs.readFileSync(path.join(root,slug+'.html'),'utf8');assert.ok(html.includes('/coffee-jolka-app-current.js?'));assert.ok(html.includes('/coffee-quality-current.css?'));assert.ok(html.includes('/coffee-difference-core.js?'));}
console.log('PASS: '+scope.frozen.length+' older coffee demos and original shared JS/CSS unchanged; new questions limited to '+scope.allowed.join(', ')+'.');
