"""Actual WebKit official merchant review. No submissions, cart or chat interaction."""
import asyncio,json,pathlib,datetime,os,re
from urllib.parse import urlsplit
from playwright.async_api import async_playwright
ROOT=pathlib.Path('/workspace/work/perfume-audit/essentique-fragrancesamples-20261111/live-rejected');ROOT.mkdir(parents=True,exist_ok=True)
SPECS={'essentique':('https://www.essentique.sk/','https://www.essentique.sk/bois-imperial/'),'fragrancesamples':('https://www.fragrancesamples.cz/','https://www.fragrancesamples.cz/mancera-french-riviera/')}
async def run():
 report={'checkedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'observer':'PERFUME_WORKER actual automated WebKit26.5, screenshots pending visual review','tlsVerification':True,'scope':'Observed home/product session only; no absolute no-chatbot claim. No merchant submission/cart/chat.','paidModelCalls':0,'companies':{}}
 async with async_playwright() as pw:
  proxy=urlsplit(os.environ.get('HTTPS_PROXY',''));launch={'headless':True,'executable_path':'/workspace/work/perfume-worker/tools/s5/perfume-independent/webkit-user-libs.sh'}
  if proxy.hostname:launch['proxy']={'server':f'{proxy.scheme}://{proxy.hostname}:{proxy.port}'}
  browser=await pw.webkit.launch(**launch)
  for slug,urls in SPECS.items():
   context=await browser.new_context(ignore_https_errors=False,viewport={'width':1280,'height':960},reduced_motion='reduce');page=await context.new_page();rows=[];blocked=[]
   async def guard(route):
    if route.request.method not in ['GET','HEAD']:blocked.append({'method':route.request.method,'url':route.request.url.split('?')[0]});await route.abort()
    else:await route.continue_()
   # Passive normal page requests permitted; no explicit merchant submissions are performed.
   # Earlier default-consent capture separately records conservative blocked telemetry.
   
   for mode,url in zip(['home','product'],urls):
    at=datetime.datetime.now(datetime.timezone.utc).isoformat();response=await page.goto(url,wait_until='domcontentloaded',timeout=45000);await page.wait_for_timeout(3500);cookie='Fresh session; no consent click yet'
    if mode=='home':
     for label in ['Odmietnuť','Odmítnout','Odmietnuť všetko','Odmítnout vše','Len nevyhnutné','Pouze nezbytné','Odmietnuť cookies','Odmítnout cookies']:
      button=page.get_by_role('button',name=label,exact=True)
      if await button.count() and await button.first.is_visible():await button.first.click();cookie='Clicked '+label;await page.wait_for_timeout(1800);break
    else:cookie='Same context after home cookie action'
    await page.screenshot(path=str(ROOT/f'{slug}-{mode}.png'),type='png');text=await page.locator('body').inner_text();(ROOT/f'{slug}-{mode}.txt').write_text(text);(ROOT/f'{slug}-{mode}.html').write_text(await page.content())
    selectors='[id*="chat" i],[class*="chat" i],[id*="advisor" i],[class*="advisor" i],[id*="smartsupp" i],[class*="smartsupp" i],[id*="tawk" i],[class*="tawk" i],[id*="messenger" i],[class*="messenger" i]'
    widgets=await page.locator(selectors).evaluate_all('(es)=>es.slice(0,35).map(e=>({tag:e.tagName,id:e.id,cls:String(e.className),text:e.innerText?.slice(0,400),visible:!!(e.offsetWidth||e.offsetHeight||e.getClientRects().length)}))')
    row={'mode':mode,'requestedUrl':url,'finalUrl':page.url,'checkedAt':at,'httpStatus':response.status if response else None,'cookieMode':cookie,'title':await page.title(),'screenshot':f'{slug}-{mode}.png','widgetLikeElements':widgets,'iframes':await page.locator('iframe').evaluate_all('(es)=>es.map(e=>({src:e.src,title:e.title,id:e.id}))'),'selects':await page.locator('select').evaluate_all('(es)=>es.map(e=>({id:e.id,name:e.name,options:[...e.options].map(o=>({value:o.value,label:o.text,selected:o.selected}))}))'),'scriptSources':await page.locator('script[src]').evaluate_all('(es)=>es.map(e=>e.src)')}
    if mode=='product':
     row['productImages']=await page.locator('.p-image img,.p-image-wrapper img,.p-main-image img').evaluate_all('(es)=>es.map(e=>({src:e.currentSrc,width:e.naturalWidth,height:e.naturalHeight,loaded:e.complete}))')
     for select in await page.locator('select').all():
      options=await select.locator('option').evaluate_all('(es)=>es.map(o=>({value:o.value,text:o.text,disabled:o.disabled}))')
      match=next((o for o in options if re.search(r'\b2\s*ml\b',o['text'],re.I) and not o['disabled']),None)
      if match:
       await select.select_option(match['value']);await page.wait_for_timeout(1200);row['selectedVariant']={'option':match,'select':await select.get_attribute('id')};row['selectedVariantText']=await page.locator('body').inner_text();await page.screenshot(path=str(ROOT/f'{slug}-product-2ml.png'),type='png');row['selectedVariantScreenshot']=f'{slug}-product-2ml.png';(ROOT/f'{slug}-product-2ml.html').write_text(await page.content());break
    if mode=='product':
     contact=page.locator('a.link-icon.chat')
     if await contact.count():
      await contact.first.click();await page.wait_for_timeout(800);row['openedContactText']=await page.locator('body').inner_text();row['openedContactFields']=await page.locator('input,textarea').evaluate_all('(es)=>es.map(e=>({name:e.name,type:e.type,placeholder:e.placeholder})).filter(e=>e.type!=="hidden")');await page.screenshot(path=str(ROOT/f'{slug}-question.png'),type='png');row['contactScreenshot']=f'{slug}-question.png'
      await page.keyboard.press('Escape')
    await page.evaluate('window.scrollTo(0,document.body.scrollHeight)');await page.wait_for_timeout(1200);await page.screenshot(path=str(ROOT/f'{slug}-{mode}-bottom.png'),type='png');row['bottomScreenshot']=f'{slug}-{mode}-bottom.png';row['relatedAdviceLinks']=await page.locator('a').evaluate_all('(es)=>es.filter(e=>/porad|priruc|příruč|quiz|kviz|kvíz|vybrat|vybrať/i.test(e.innerText)).map(e=>({text:e.innerText,url:e.href})).slice(0,30)');rows.append(row)
   report['companies'][slug]={'pages':rows,'blockedNonReadRequests':blocked,'uncertainty':'Only this cookie/session and visited pages inspected; third-party behavior in other consent modes remains unverified.'};await context.close();(ROOT/'merchant-live.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(slug,'home+product observed',flush=True)
  await browser.close()
asyncio.run(run())
