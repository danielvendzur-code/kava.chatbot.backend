// Unpack the official npm @sparticuz/chromium archives without changing ownership.
// Usage: node tools/s5/restore-browser.cjs /absolute/package/bin /absolute/output
const fs=require('node:fs'),path=require('node:path'),zlib=require('node:zlib'),cp=require('node:child_process');
const [,,input,out]=process.argv;if(!input||!out||!path.isAbsolute(input)||!path.isAbsolute(out))throw Error('Two absolute paths required');fs.mkdirSync(out,{recursive:true});
fs.writeFileSync(path.join(out,'chromium'),zlib.brotliDecompressSync(fs.readFileSync(path.join(input,'chromium.br')))),fs.chmodSync(path.join(out,'chromium'),0o700);
for(const [name,target]of [['fonts.tar.br',path.join(out,'fonts')],['swiftshader.tar.br',out]]){fs.mkdirSync(target,{recursive:true});const r=cp.spawnSync('tar',['--no-same-owner','-xf','-','-C',target],{input:zlib.brotliDecompressSync(fs.readFileSync(path.join(input,name)))});if(r.status!==0)throw Error(String(r.stderr));}console.log(path.join(out,'chromium'));
