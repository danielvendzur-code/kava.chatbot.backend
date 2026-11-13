from pathlib import Path
import asyncio,os,json,re,datetime
from urllib.parse import urlsplit
from playwright.async_api import async_playwright
O=Path('/workspace/work/perfume-audit/wave6-20261113/yodeyma-selected-packs');O.mkdir(exist_ok=True)
async def main():
 out={'at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'url':'https://www.yodeymaparfemy.cz/','tlsVerification':True,'scope':'Own actual WPE WebKit fresh session; nonGET/cart blocked; read-only cookie settings/widget inspection, no messages/forms submitted','actions':[]}
 async with async_playwright() as p:
  u=urlsplit(os.environ['HTTPS_PROXY']);b=await p.webkit.launch(headless=True,executable_path='/workspace/work/perfume-worker/tools/s5/perfume-independent/webkit-user-libs.sh',proxy={'server':f'{u.scheme}://{u.hostname}:{u.port}'})
  page=await b.new_page(ignore_https_errors=False,viewport={'width':1280,'height':900});page.set_default_timeout(7000)
  async def safe(r):
   if r.request.method!='GET' or re.search(r'/(cart|kosik|checkout)(/|$)',urlsplit(r.request.url).path,re.I):await r.abort()
   else:await r.continue_()
  await page.route('**/*',safe);await page.goto(out['url'],wait_until='domcontentloaded',timeout=40000);await page.wait_for_timeout(1800)
  setting=page.get_by_text('Nastavení',exact=True)
  if await setting.count() and await setting.first.is_visible():await setting.first.click();out['actions'].append('Open cookie Nastavení')
  await page.wait_for_timeout(600);out['settingsButtons']=await page.locator('button').all_text_contents();await page.screenshot(path=str(O/'settings.png'),timeout=30000,animations='disabled');out['settingsText']=(await page.locator('body').inner_text())[:5500]
  for label in ['Vše vypnout','Potvrdit moje volby']:
   c=page.get_by_text(label,exact=True)
   if await c.count() and await c.first.is_visible():await c.first.click();out['actions'].append(label);await page.wait_for_timeout(200)
  await page.wait_for_timeout(1800)
  for frame in page.frames:
   if frame.name=='widgetButtonFrame':
    launcher=frame.get_by_text('Chat',exact=True)
    if await launcher.count() and await launcher.first.is_visible():await launcher.first.click();out['actions'].append('Open ordinary Chat launcher, no message typed/sent');await page.wait_for_timeout(1000)
  out['frames']=[]
  for f in page.frames:
   if f==page.main_frame:continue
   try:out['frames'].append({'url':f.url,'name':f.name,'text':(await f.locator('body').inner_text(timeout=2500))[:4500],'buttons':await f.locator('button').all_text_contents()})
   except Exception as e:out['frames'].append({'url':f.url,'error':type(e).__name__})
  await page.screenshot(path=str(O/'after.png'),timeout=30000,animations='disabled');(O/'page.html').write_text(await page.content());out['afterText']=(await page.locator('body').inner_text())[-5000:];await page.goto('https://www.yodeymaparfemy.cz/yodeyma-iris-edp/',wait_until='domcontentloaded',timeout=40000);await page.wait_for_timeout(1800);await page.screenshot(path=str(O/'product-rejected.png'),timeout=30000,animations='disabled');out['selectedPacks']=[]
  for priceid,price,pack in [('82','399','50ml'),('85','179','15ml')]:
   await page.locator('label.advanced-parameter').filter(has=page.locator('input[name=priceId][value="'+priceid+'"]')).click();await page.wait_for_timeout(400);shot=O/(pack+'.png');await page.screenshot(path=str(shot),timeout=30000,animations='disabled');out['selectedPacks'].append({'priceId':priceid,'pack':pack,'visibleText':(await page.locator('body').inner_text())[:4500]})
  out['productUrl']=page.url;out['productTitle']=await page.title();out['productText']=(await page.locator('body').inner_text())[:6500];await b.close()
 (O/'report.json').write_text(json.dumps(out,ensure_ascii=False,indent=2));print(json.dumps({'actions':out['actions'],'buttons':out['settingsButtons'],'frames':out['frames']},ensure_ascii=False)[:3500])
asyncio.run(main())
