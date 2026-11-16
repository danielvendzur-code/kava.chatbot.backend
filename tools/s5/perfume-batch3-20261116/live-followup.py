from pathlib import Path
import asyncio,json,datetime,os,re
from urllib.parse import urlsplit
from playwright.async_api import async_playwright
B=Path(__file__).resolve().parent;O=Path('/workspace/work/perfume-audit/batch3-20261116/merchants-followup');O.mkdir(exist_ok=True)
async def main():
 rows=[]
 async with async_playwright() as pw:
  proxy=urlsplit(os.environ['HTTPS_PROXY']);browser=await pw.webkit.launch(headless=True,executable_path='/workspace/work/perfume-worker/tools/s5/perfume-independent/webkit-user-libs.sh',proxy={'server':f'{proxy.scheme}://{proxy.hostname}:{proxy.port}'})
  tasks=[('maja','home','https://www.svickymaja.cz/'),('maja','product','https://www.svickymaja.cz/sojova-svicka-ruze-ylang-ylang-v-cirem-skle-345-ml/'),('tvojesvicka','home','https://www.tvojesvicka.cz/'),('tvojesvicka','advice','https://www.tvojesvicka.cz/poradime-s-vyberem/'),('lunarium','home','https://lunarium.cz/'),('lunarium','product','https://lunarium.cz/produkt/svicky/svickynazamer/svicka-zlata-hojnost/')]+[('lumela',str(i),json.load(open(B/f'research/lumela/{i}.json'))['url']) for i in range(1,7)]
  page=await browser.new_page(ignore_https_errors=False,viewport={'width':1280,'height':900});page.set_default_timeout(6000)
  async def safe(route):
   if route.request.method!='GET' or re.search(r'/(cart|kosik|checkout)(/|$)',urlsplit(route.request.url).path,re.I):await route.abort()
   else:await route.continue_()
  await page.route('**/*',safe)
  for slug,mode,url in tasks:
   r={'slug':slug,'mode':mode,'url':url,'at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'tlsVerification':True,'scope':'Actual WPEWebKit rendered pages, nonGET/cart blocked; no forms/messages/captcha/submits. Cookie mode only observed. Not demoPreviewQA.'}
   try:
    res=await page.goto(url,wait_until='domcontentloaded',timeout=40000);await page.wait_for_timeout(2000);r['status']=res.status
    for label in ['Odmítnout','Odmítnout vše','Pouze nezbytné','Nesouhlasím']:
     for c in await page.get_by_text(label,exact=True).all():
      if await c.is_visible():await c.click();r['cookieAction']=label;break
     if r.get('cookieAction'):break
    if slug=='lumela':
     s=page.locator('select[name="options[7]"]')
     if await s.count():await s.select_option('23');await page.wait_for_timeout(800);r['selectedEngraving']='Ne';r['selectedValue']=await s.input_value()
     r['visiblePriceElements']=await page.locator('[class*="price"]').evaluate_all('(es)=>es.filter(e=>e.getBoundingClientRect().width>0&&e.getBoundingClientRect().height>0).map(e=>({class:e.className,text:e.innerText})).slice(0,30)')
    r['text']=(await page.locator('body').inner_text())[:18000];r['iframes']=await page.locator('iframe').evaluate_all('(es)=>es.map(e=>({src:e.src,title:e.title}))');r['buttons']=await page.locator('button').all_text_contents();r['images']=await page.locator('img').evaluate_all('(es)=>es.filter(i=>i.getBoundingClientRect().top<900&&i.getBoundingClientRect().bottom>0).map(i=>({src:i.currentSrc,alt:i.alt,loaded:i.complete,width:i.naturalWidth}))');await page.screenshot(path=str(O/f'{slug}-{mode}.png'),animations='disabled');(O/f'{slug}-{mode}.html').write_text(await page.content())
   except Exception as e:r['error']=str(e)
   rows.append(r);(O/'report.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2)+'\n');print(slug,mode,r.get('status'),r.get('selectedEngraving'),r.get('error'),flush=True)
  await browser.close()
asyncio.run(main())
