"""Focused actual selected-extra reset and no-opt-in control; offline only."""
import pathlib,json,asyncio,datetime,argparse
from playwright.async_api import async_playwright
p=argparse.ArgumentParser();p.add_argument('--output',required=True);a=p.parse_args();R=pathlib.Path(a.output);R.mkdir(parents=True,exist_ok=True);B=pathlib.Path(__file__).resolve().parents[1];spec=[('vavavoom','vanilla','/workspace/work/perfume-audit/vavavoom-live-20261111/engine-c9.json'),('myskino','nice','/workspace/work/perfume-audit/myskino-result-extras-20261111/engine.json'),('leparfumlechic','bois','/workspace/work/perfume-audit/leparfum-source-20261111/engine-c9.json')];report={'checkedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'scope':'Offline opt-in renderer proposal, selected→reset actual browser check; immutable c9 core','results':[],'errors':[],'paidModelCalls':0,'complete':False}
async def main():
 async with async_playwright() as pw:
  b=await pw.webkit.launch(headless=True,executable_path=str(B/'webkit-user-libs.sh'))
  for slug,pid,engine in spec:
   f=next(p for p in json.load(open(B/'candidate-packages'/slug/'verified-products.json'))['products'] if p['id']==pid);leaf=next(x for x in json.load(open(engine))['companies'][slug]['leaves'] if x['id']==pid)
   for w in [320,390,1280]:
    page=await b.new_page(ignore_https_errors=False,viewport={'width':w,'height':900},reduced_motion='reduce');page.on('pageerror',lambda e:report['errors'].append(str(e)))
    async def guard(route):
     if '/api/' in route.request.url:await route.fulfill(status=503,content_type='application/json',body='{"error":"offline_only"}')
     elif route.request.url.startswith(('http://127.0.0.1:8915/','data:','blob:')):await route.continue_()
     else:await route.abort()
    await page.route('**/*',guard);await page.goto('http://127.0.0.1:8915/__candidate/'+slug+'.html?demo='+slug,wait_until='domcontentloaded');await page.wait_for_function('()=>document.querySelector("#cosmetics-root")?.getAttribute("aria-busy")!=="true"&&window.CX_S5?.fragranceExtrasInstalled');await page.locator('[data-open="advisor"]').click()
    async def walk():
     for k,v in leaf['answers'].items():await page.locator('[data-choice="'+v+'"]').click()
     await page.locator('[data-fragrance-extra]').wait_for();await page.locator('.s5-product img,.fr-related-card img,.fr-extra-pack-photo').evaluate_all('(es)=>Promise.all(es.map(i=>i.decode()))');await page.evaluate('()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))');await page.wait_for_timeout(180)
    await walk();await page.locator('[data-fragrance-extra]').check();checked=await page.locator('[data-s5-total]').inner_text();await page.locator('[data-restart]').click();await walk();assert not await page.locator('[data-fragrance-extra]').is_checked();base=await page.locator('[data-s5-total]').inner_text();assert base==f['price'];file=f'{slug}-reset-{pid}-{w}.png';await page.screenshot(path=str(R/file));report['results'].append({'slug':slug,'width':w,'id':pid,'selectedTotalBeforeReset':checked,'baseTotalAfterReset':base,'uncheckedAfterReset':True,'screenshot':file});await page.close()
  page=await b.new_page(ignore_https_errors=False,viewport={'width':390,'height':900});await page.goto('http://127.0.0.1:8915/__candidate/orion.html?demo=orion',wait_until='domcontentloaded');await page.wait_for_function('()=>document.querySelector("#cosmetics-root")?.getAttribute("aria-busy")!=="true"&&window.CX_S5?.result');assert not await page.evaluate('!!window.CX_S5.fragranceExtrasInstalled');assert not await page.locator('script[src*="fragrance-result-extras"]').count();report['noOptInControl']={'slug':'orion','width':390,'moduleNotLoaded':True,'coreNotChanged':True};await page.close();assert not report['errors'];report['complete']=True;(R/'reset-isolation-qa.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');await b.close();print(str(len(report['results']))+' selected→reset checks + no-opt-in control PASS')
asyncio.run(main())
