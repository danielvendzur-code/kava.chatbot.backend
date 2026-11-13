from pathlib import Path
import asyncio,json,datetime,os,re
from urllib.parse import urlsplit
from playwright.async_api import async_playwright
OUT=Path('/workspace/work/perfume-audit/wave4-20261113-hypno-question');OUT.mkdir(exist_ok=True)
async def main():
 rows=[]
 async with async_playwright() as pw:
  proxy=urlsplit(os.environ['HTTPS_PROXY']);browser=await pw.webkit.launch(headless=True,executable_path='/workspace/work/perfume-worker/tools/s5/perfume-independent/webkit-user-libs.sh',proxy={'server':f'{proxy.scheme}://{proxy.hostname}:{proxy.port}'})
  for slug,pages in [('hypno',[('question','https://www.mojehypno.sk/hypno-fatria-damsky-parfum-50ml/')])]:
   page=await browser.new_page(ignore_https_errors=False,viewport={'width':1280,'height':900});page.set_default_timeout(5000)
   async def safe(route):
    if route.request.method!='GET' or re.search(r'/(cart|kosik|checkout)(/|$)',urlsplit(route.request.url).path,re.I):await route.abort()
    else:await route.continue_()
   await page.route('**/*',safe)
   for mode,url in pages:
    r={'slug':slug,'mode':mode,'url':url,'at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'cookieAction':None,'tlsVerification':True,'scope':'OwnactualautomatedWPEWebKit; nonGET/cartrequestsblocked; noforms/messages/cart/captchaactions; notreservation/demoliveQA'}
    try:
     res=await page.goto(url,wait_until='domcontentloaded',timeout=40000);await page.wait_for_timeout(2000)
     for label in ['Odmietnuť voliteľné','Odmietnuť','Odmietnuť všetko','Prijať nevyhnutné súbory cookie']:
      c=page.get_by_text(label,exact=True)
      if await c.count() and await c.first.is_visible():await c.first.click();r['cookieAction']=label;await page.wait_for_timeout(600);break
     await page.get_by_text('Opýtať sa',exact=True).first.click();await page.wait_for_timeout(700);r['formLabels']=await page.locator('label').all_text_contents();r['inputs']=await page.locator('input,textarea').evaluate_all('(es)=>es.map(e=>({type:e.type,name:e.name,placeholder:e.placeholder}))');r.update(status=res.status,title=await page.title(),text=(await page.locator('body').inner_text())[:22000],buttons=await page.locator('button').all_text_contents(),iframes=await page.locator('iframe').evaluate_all('(es)=>es.map(e=>({src:e.src,title:e.title}))'),images=await page.locator('img').evaluate_all('(es)=>es.filter(i=>i.getBoundingClientRect().top<900&&i.getBoundingClientRect().bottom>0).map(i=>({src:i.currentSrc,alt:i.alt,loaded:i.complete,width:i.naturalWidth,height:i.naturalHeight}))'));await page.screenshot(path=str(OUT/(slug+'-'+mode+'.png')));(OUT/(slug+'-'+mode+'.html')).write_text(await page.content())
    except Exception as e:r['error']=str(e)
    rows.append(r);(OUT/'live-preflight.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2)+'\n');print(slug,mode,r.get('status'),r.get('cookieAction'),r.get('error'),flush=True)
   await page.close()
  await browser.close()
asyncio.run(main())
