from pathlib import Path
import asyncio,json,datetime,os,re
from urllib.parse import urlsplit
from playwright.async_api import async_playwright
B=Path(__file__).resolve().parent;O=Path('/workspace/work/perfume-audit/batch3-20261116/hygge-native-variants');O.mkdir(exist_ok=True)
async def run():
 rows=[]
 async with async_playwright() as pw:
  proxy=urlsplit(os.environ['HTTPS_PROXY']);browser=await pw.webkit.launch(executable_path='/workspace/work/perfume-worker/tools/s5/perfume-independent/webkit-user-libs.sh',headless=True,proxy={'server':f'{proxy.scheme}://{proxy.hostname}:{proxy.port}'})
  page=await browser.new_page(ignore_https_errors=False,viewport={'width':1280,'height':900});page.set_default_timeout(10000)
  async def safe(route):
   if route.request.method!='GET' or re.search('/(cart|kosik|checkout)(/|$)',urlsplit(route.request.url).path,re.I):await route.abort()
   else:await route.continue_()
  await page.route('**/*',safe)
  for index in ['1','2','3','4']:
   source=json.load(open(B/f'research/mojehygge/{index}.json'));r={'slug':'mojehygge','index':index,'url':source['url'],'at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'scope':'ActualTLS-on WPEWebKit ordinarynativevariantselection read-only. No cart/form/chat/captcha submits.','cookieAction':None}
   try:
    res=await page.goto(source['url'],wait_until='domcontentloaded',timeout=40000);await page.wait_for_timeout(1500)
    for c in await page.get_by_text('Odmítnout',exact=True).all():
     if await c.is_visible():await c.click();r['cookieAction']='Odmítnout';break
    select=page.locator('#simple-variants-select');opt=select.locator('option').filter(has_text='180ml');value=await opt.get_attribute('value');await select.select_option(value);await page.wait_for_timeout(400);r.update(status=res.status,selectedNativeValue=await select.input_value(),selectedLabel=await select.locator('option:checked').inner_text(),visiblePrice=await page.locator('.p-final-price-wrapper .price-final').inner_text(),availability=' '.join(await page.locator('.availability-value').all_text_contents()),mainPhoto=await page.locator('.p-main-image img').first.evaluate('(i)=>({src:i.currentSrc,loaded:i.complete,width:i.naturalWidth,height:i.naturalHeight})'));assert r['selectedNativeValue']==value and re.sub(r'\s+',' ',r['visiblePrice']).strip()=='299 Kč';await page.screenshot(path=str(O/f'mojehygge-{index}-180ml.png'),animations='disabled')
   except Exception as e:r['error']=str(e)
   rows.append(r);(O/'report.json').write_text(json.dumps({'results':rows,'allPassed':len(rows)==4 and all('error' not in x for x in rows),'paidCalls':0},ensure_ascii=False,indent=2)+'\n');print(index,r.get('selectedNativeValue'),r.get('visiblePrice'),r.get('error'),flush=True)
  await browser.close()
asyncio.run(run())
