from pathlib import Path
import asyncio,os,json,re,datetime
from urllib.parse import urlsplit
from playwright.async_api import async_playwright
O=Path('/workspace/work/perfume-audit/wave7-20261114/odeur-question');O.mkdir(exist_ok=True)
async def main():
 out={'at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'url':'https://www.odeur.sk/nativa-fragrances-olej-parfum-do-prania-muskatove-drevo-250-ml/','tlsVerification':True,'scope':'Own actual WPE WebKit fresh session; nonGET/cart blocked; read-only cookie settings/widget inspection, no messages/forms submitted','actions':[]}
 async with async_playwright() as p:
  u=urlsplit(os.environ['HTTPS_PROXY']);b=await p.webkit.launch(headless=True,executable_path='/workspace/work/perfume-worker/tools/s5/perfume-independent/webkit-user-libs.sh',proxy={'server':f'{u.scheme}://{u.hostname}:{u.port}'})
  page=await b.new_page(ignore_https_errors=False,viewport={'width':1280,'height':900});page.set_default_timeout(7000)
  async def safe(r):
   if r.request.method!='GET' or re.search(r'/(cart|kosik|checkout)(/|$)',urlsplit(r.request.url).path,re.I):await r.abort()
   else:await r.continue_()
  await page.route('**/*',safe);await page.goto(out['url'],wait_until='domcontentloaded',timeout=40000);await page.wait_for_timeout(1800)
  reject=page.get_by_text('Odmietnuť',exact=True)
  if await reject.count() and await reject.first.is_visible():await reject.first.click();out['actions'].append('Odmietnuťcookies')
  question=page.get_by_text('Opýtať sa',exact=True)
  if await question.count():await question.first.click();out['actions'].append('Open Opýtať sa, nothing filled/submitted')
  out['settingsButtons']=await page.locator('button').all_text_contents()
  await page.wait_for_timeout(1800)
  out['frames']=[]
  for f in page.frames:
   if f==page.main_frame:continue
   try:out['frames'].append({'url':f.url,'name':f.name,'text':(await f.locator('body').inner_text(timeout=2500))[:4500],'buttons':await f.locator('button').all_text_contents()})
   except Exception as e:out['frames'].append({'url':f.url,'error':type(e).__name__})
  await page.screenshot(path=str(O/'after.png'),timeout=30000,animations='disabled');(O/'page.html').write_text(await page.content());out['afterText']=(await page.locator('body').inner_text())[-9000:];await b.close()
 (O/'report.json').write_text(json.dumps(out,ensure_ascii=False,indent=2));print(json.dumps({'actions':out['actions'],'buttons':out['settingsButtons'],'frames':out['frames']},ensure_ascii=False)[:3500])
asyncio.run(main())
