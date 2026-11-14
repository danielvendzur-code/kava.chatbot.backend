from pathlib import Path
import asyncio,json,datetime,os,re
from urllib.parse import urlsplit
from playwright.async_api import async_playwright
B=Path('/workspace/work/perfume-audit/wave7-20261114/widget-next');B.mkdir(parents=True,exist_ok=True)
async def main():
 async with async_playwright() as pw:
  x=urlsplit(os.environ['HTTPS_PROXY']);browser=await pw.webkit.launch(headless=True,executable_path='/workspace/work/perfume-worker/tools/s5/perfume-independent/webkit-user-libs.sh',proxy={'server':f'{x.scheme}://{x.hostname}:{x.port}'})
  for slug,url in [('elobe','https://elobe.cz/')]:
   p=await browser.new_page(ignore_https_errors=False,viewport={'width':1280,'height':900});p.set_default_timeout(5000)
   async def guard(route):
    if route.request.method!='GET' or re.search(r'/(cart|kosik|checkout)(/|$)',urlsplit(route.request.url).path,re.I):await route.abort()
    else:await route.continue_()
   await p.route('**/*',guard);await p.goto(url,wait_until='domcontentloaded',timeout=40000);await p.wait_for_timeout(6500);r={'slug':slug,'url':url,'at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'tls':True,'scope':'Own WPEWebKit, nonGET/cartblocked, no input/submission/captcha','actions':[]}
   try:
    if slug=='escent':
     q=p.get_by_role('button',name='Nastavení',exact=True)
     if await q.count() and await q.is_visible():await q.click();r['actions'].append('Open cookie settings');await p.wait_for_timeout(400)
    else:
     await p.locator('.dm-cookie-popup-learn-more').click();r['actions'].append('Open cookie settings');await p.wait_for_timeout(400)
     for sel in ['#dm_cookie_group_1','#dm_cookie_group_2']:
      q=p.locator(sel)
      if await q.is_checked():await q.locator('..').locator('span').click();assert not await q.is_checked();r['actions'].append('Disable '+sel)
     await p.locator('.dm-cookie-popup-accept-cookies-save-group').click();r['actions'].append('Save necessary-only cookies')
    r['cookieText']=(await p.locator('body').inner_text())[-3500:];await p.screenshot(path=str(B/(slug+'-cookies.png')),animations='disabled',timeout=30000)
    if slug=='escent':
     for name in ['Vše vypnout','Odmítnout vše','Pouze nezbytné']:
      q=p.get_by_text(name,exact=True)
      if await q.count() and await q.first.is_visible():await q.first.click();r['actions'].append(name);break
     buttons=await p.locator('button').evaluate_all('(es)=>es.map(e=>({text:e.innerText,aria:e.getAttribute("aria-label"),title:e.title,cls:e.className,rect:{x:e.getBoundingClientRect().x,y:e.getBoundingClientRect().y,w:e.getBoundingClientRect().width,h:e.getBoundingClientRect().height}})).filter(e=>e.rect.w&&e.rect.h)');r['visibleButtons']=buttons
     await p.locator('#voiceflow-chat').locator('button').first.click();r['actions'].append('Open Voiceflow launcher without message')
    else:
     f=p.frame_locator('iframe#widgetButtonFrame');r['frameBefore']=await f.locator('body').inner_text();btn=f.get_by_text('Chat',exact=True);r['frameButtons']=await btn.all_text_contents();
     if await btn.count():await btn.first.click();r['actions'].append('Open Smartsupp without message')
    await p.wait_for_timeout(1000);r['textAfter']=(await p.locator('body').inner_text())[-7000:];r['frames']=[{'name':f.name,'url':f.url,'text':(await f.locator('body').inner_text())[-3000:]} for f in p.frames];await p.screenshot(path=str(B/(slug+'-widget.png')),animations='disabled',timeout=30000)
   except Exception as e:r['error']=str(e);await p.screenshot(path=str(B/(slug+'-error.png')),animations='disabled',timeout=30000)
   await p.goto('https://elobe.cz/domu/9649-11967-ellis-brooklyn-eau-de-parfum-plum-tonic.html#/1-_-50_ml',wait_until='domcontentloaded',timeout=40000);await p.wait_for_timeout(2500);r['productAfterCookie']={'url':p.url,'text':(await p.locator('body').inner_text())[:7000],'at':datetime.datetime.now(datetime.timezone.utc).isoformat()};await p.screenshot(path=str(B/(slug+'-product-necessary.png')),animations='disabled',timeout=30000)
   (B/(slug+'-opened.json')).write_text(json.dumps(r,ensure_ascii=False,indent=2));print(slug,r['actions'],r.get('error'),flush=True);await p.close()
  await browser.close()
asyncio.run(main())
