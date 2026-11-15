from pathlib import Path
from urllib.parse import urlsplit
import asyncio,os,json,re,datetime
from playwright.async_api import async_playwright
O=Path('/workspace/work/perfume-audit/batch2-20261115/widget-followup');O.mkdir(exist_ok=True)
async def main():
 rows=[]
 async with async_playwright() as pw:
  u=urlsplit(os.environ['HTTPS_PROXY']);b=await pw.webkit.launch(headless=True,executable_path='/workspace/work/perfume-worker/tools/s5/perfume-independent/webkit-user-libs.sh',proxy={'server':f'{u.scheme}://{u.hostname}:{u.port}'})
  for slug,url,selector in [('svitsol','https://svitsol.cz/cs/','button[aria-label="Otevřít chat"]'),('luxoa','https://www.luxoa.cz/cs/','[data-chat-open]'),('esodrogeria','https://www.esodrogeria.eu/',''),('vonavepranie','https://www.vonavepranie.sk/parfem-na-pranie-white-musk/','')]:
   r={'slug':slug,'url':url,'at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'tlsVerified':True,'scope':'Actual WPEWebKit; nonGET/cart blocked, no input/message/form/cart/captcha; ordinary launcher opening only','actions':[]};p=await b.new_page(ignore_https_errors=False,viewport={'width':1280,'height':900});p.set_default_timeout(6000)
   async def safe(route):
    if route.request.method!='GET' or re.search(r'/(cart|kosik|checkout)(/|$)',urlsplit(route.request.url).path,re.I):await route.abort()
    else:await route.continue_()
   await p.route('**/*',safe)
   try:
    res=await p.goto(url,wait_until='domcontentloaded',timeout=40000);r['status']=res.status;await p.wait_for_timeout(4000)
    for label in ['Odmítnout','Odmietnuť všetko']:
     c=p.get_by_text(label,exact=True)
     if await c.count() and await c.first.is_visible():await c.first.click();r['actions'].append(label);break
    if selector:
     c=p.locator(selector)
     if await c.count() and await c.first.is_visible():await c.first.click();r['actions'].append('Opened launcher without typing/sending')
    if slug=='esodrogeria':
     for fr in p.frames:
      if fr.name=='widgetButtonFrame':
       buttons=fr.locator('button')
       if await buttons.count():await buttons.first.click();r['actions'].append('Opened Smartsupp button without message')
    if slug=='vonavepranie':
     await p.wait_for_timeout(8000);await p.mouse.wheel(0,300);await p.wait_for_timeout(1500)
    await p.wait_for_timeout(1500);r['text']=(await p.locator('body').inner_text())[-15000:];r['frames']=[]
    for fr in p.frames:
     if fr==p.main_frame:continue
     # Keep only classification evidence, never full payment/recaptcha URL parameters.
     try:r['frames'].append({'host':urlsplit(fr.url).hostname,'name':fr.name,'text':(await fr.locator('body').inner_text(timeout=1500))[:3000]})
     except Exception:r['frames'].append({'host':urlsplit(fr.url).hostname,'name':fr.name,'text':'UNREADABLE'})
    await p.screenshot(path=str(O/(slug+'.png')),timeout=30000);(O/(slug+'.html')).write_text(await p.content())
   except Exception as e:r['error']=str(e)
   rows.append(r);(O/'report.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2));print(slug,r['actions'],r.get('error'),flush=True);await p.close()
  await b.close()
asyncio.run(main())
