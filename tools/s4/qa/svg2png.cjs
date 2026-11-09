const {chromium}=require('playwright');const fs=require('fs');const [,,svg,out,w,h,bg]=process.argv;(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:+w,height:+h}});
await p.setContent(`<html><body style="margin:0;background:${bg||'transparent'}"><img src="data:image/svg+xml;base64,${fs.readFileSync(svg).toString('base64')}" style="width:${w}px;height:${h}px;object-fit:contain"></body></html>`);
await p.screenshot({path:out,omitBackground:!bg});await b.close()})();
