"""Focused question presentation delta on unchanged coordinator engine; no model calls."""
import argparse,asyncio,json,pathlib,datetime
from playwright.async_api import async_playwright
p=argparse.ArgumentParser();p.add_argument('--engine-report',required=True);p.add_argument('--output',required=True);p.add_argument('--base',required=True);p.add_argument('--slugs',nargs='+',required=True);p.add_argument('--browser-executable',required=True);a=p.parse_args();engine=json.load(open(a.engine_report));out=pathlib.Path(a.output);out.mkdir(parents=True,exist_ok=True);report={'commit':engine['commit'],'scope':'Local question/photo/label presentation delta only, unchanged shared core, no Preview claim.','paidModelCalls':0,'questionPages':[],'errors':[],'complete':False}
def save():(out/'question-delta.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
async def main():
 async with async_playwright() as p:
  b=await p.webkit.launch(headless=True,executable_path=a.browser_executable)
  for slug in a.slugs:
   for width in [320,390,1280]:
    page=await b.new_page(ignore_https_errors=False,viewport={'width':width,'height':900},reduced_motion='reduce');page.on('pageerror',lambda e:report['errors'].append(str(e)))
    async def route(r):
     if '/api/' in r.request.url:await r.fulfill(status=503,body='{"error":"offline_mock"}',content_type='application/json')
     elif r.request.url.startswith(a.base+'/'):await r.continue_()
     else:await r.abort()
    await page.route('**/*',route)
    for i,q in enumerate(engine['companies'][slug]['questions']):
     await page.goto(a.base+'/__candidate/'+slug+'.html?demo='+slug,wait_until='domcontentloaded');await page.locator('[data-open="advisor"]').click()
     for key,value in q['answers'].items():await page.locator('[data-choice="'+value+'"]').click()
     await page.wait_for_function('()=>[...document.querySelectorAll(".cx-quality-option img")].length>0&&[...document.querySelectorAll(".cx-quality-option img")].every(i=>i.complete&&i.naturalWidth>=500)')
     await page.locator('.cx-quality-option img').evaluate_all('(es)=>Promise.all(es.map(i=>i.decode()))');await page.evaluate('()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))');await page.wait_for_timeout(180)
     options=await page.locator('.cx-quality-option').evaluate_all('(es)=>es.map(e=>({id:e.dataset.choice,text:e.innerText,photo:e.querySelector("img").getAttribute("src")}))');assert len(options)==len(q['step']['options']);assert len(set(o['photo'] for o in options))==len(options);assert not await page.evaluate('document.documentElement.scrollWidth>innerWidth');file=f'{slug}-question-delta-{i}-{width}.png';await page.screenshot(path=str(out/file));report['questionPages'].append({'slug':slug,'width':width,'key':q['step']['key'],'answers':q['answers'],'options':options,'screenshot':file,'at':datetime.datetime.now(datetime.timezone.utc).isoformat()});save()
    await page.close()
  assert not report['errors'];report['complete']=True;save();await b.close();print(len(report['questionPages']),'question views passed')
asyncio.run(main())
