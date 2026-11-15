from pathlib import Path
from urllib.parse import urlsplit,parse_qs
from playwright.async_api import async_playwright
import asyncio,json,os,re,datetime
B=Path(__file__).resolve().parent/'research';O=Path('/workspace/work/perfume-audit/batch2-20261115/native-variants');O.mkdir(exist_ok=True)
async def main():
 async with async_playwright() as pw:
  u=urlsplit(os.environ['HTTPS_PROXY']);b=await pw.webkit.launch(headless=True,executable_path='/workspace/work/perfume-worker/tools/s5/perfume-independent/webkit-user-libs.sh',proxy={'server':f'{u.scheme}://{u.hostname}:{u.port}'})
  for slug,selector in [('totap','a[data-option-id="5"][data-attr-value-id="24"]'),('kvapkavoni','a[data-option-id="14"][data-attr-value-id="45"]')]:
   page=await b.new_page(ignore_https_errors=False,viewport={'width':1280,'height':1000});page.set_default_timeout(6000)
   for i in range(1,7):
    source=json.load(open(B/f'{slug}/{i}.json'));r={'slug':slug,'id':str(i),'url':source['url'],'checkedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'tlsVerified':True,'scope':'Normal read-only variant selection only; no cart/customer forms/messages submitted','readOnlyVariantPostAllowed':False}
    async def safe(route):
     req=route.request;parsed=urlsplit(req.url);allowed=req.method=='GET'
     # This endpoint only redraws product variant price/stock; cart mutation endpoints stay blocked.
     if req.method=='POST' and parsed.hostname==urlsplit(source['url']).hostname and parse_qs(parsed.query).get('do')==['changeVariants']:allowed=True;r['readOnlyVariantPostAllowed']=True
     if re.search(r'/(cart|kosik|checkout)(/|$)',parsed.path,re.I):allowed=False
     if allowed:await route.continue_()
     else:await route.abort()
    await page.route('**/*',safe)
    try:
     res=await page.goto(source['url'],wait_until='domcontentloaded',timeout=40000);await page.wait_for_timeout(1600)
     reject=page.get_by_text('Nesúhlasím' if slug=='kvapkavoni' else 'Nesouhlasím',exact=True)
     if await reject.count() and await reject.first.is_visible():
      try:await reject.first.click(timeout=3000,no_wait_after=True)
      except Exception:r['cookieClickTimeout']='Click timeout; do not assert persistence'
     c=page.locator(selector);r['selectedLabel']=await c.first.inner_text();await c.first.click(no_wait_after=True);await page.wait_for_timeout(1600)
     r['status']=res.status;r['finalUrl']=page.url;r['text']=(await page.locator('body').inner_text())[:13000];r['productPublic']=await page.evaluate('()=>window.upgates?.product');r['images']=await page.locator('img').evaluate_all('(es)=>es.filter(e=>e.getBoundingClientRect().top<1000&&e.getBoundingClientRect().bottom>0).map(e=>({src:e.currentSrc,alt:e.alt,width:e.naturalWidth,height:e.naturalHeight}))');await page.screenshot(path=str(O/f'{slug}-{i}.png'),timeout=30000);(O/f'{slug}-{i}.html').write_text(await page.content())
    except Exception as e:r['error']=str(e)
    (B/f'{slug}/{i}-native.json').write_text(json.dumps(r,ensure_ascii=False,indent=2));print(slug,i,r.get('selectedLabel'),r.get('error'),flush=True);await page.unroute('**/*',safe)
   await page.close()
  await b.close()
asyncio.run(main())
