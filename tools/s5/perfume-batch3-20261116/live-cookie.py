from pathlib import Path
import asyncio,json,datetime,os,re
from urllib.parse import urlsplit
from playwright.async_api import async_playwright
OUT=Path('/workspace/work/perfume-audit/batch3-20261116/merchants-cookie');OUT.mkdir(parents=True,exist_ok=True)
async def main():
 rows=[]
 async with async_playwright() as pw:
  proxy=urlsplit(os.environ['HTTPS_PROXY']);browser=await pw.webkit.launch(headless=True,executable_path='/workspace/work/perfume-worker/tools/s5/perfume-independent/webkit-user-libs.sh',proxy={'server':f'{proxy.scheme}://{proxy.hostname}:{proxy.port}'})
  for slug,pages in [('essencebliss', [('home', 'https://www.essencebliss.cz/'), ('product', 'https://www.essencebliss.cz/vonna-sojova-svicka-ambra-a-vanilka-200-g/')]), ('nabetondesign', [('home', 'https://www.nabetondesign.cz/'), ('product', 'https://www.nabetondesign.cz/pink-elegance-100--sojova-svicka-220ml/')]), ('sojka', [('home', 'https://www.nasesojka.cz/'), ('product', 'https://www.nasesojka.cz/sojova-vonna-svicka-ve-vinne-lahvi-sauvignon-200-g-/')])]:
   page=await browser.new_page(ignore_https_errors=False,viewport={'width':1280,'height':900});page.set_default_timeout(5000)
   async def safe(route):
    if route.request.method!='GET' or re.search(r'/(cart|kosik|checkout)(/|$)',urlsplit(route.request.url).path,re.I):await route.abort()
    else:await route.continue_()
   await page.route('**/*',safe)
   for mode,url in pages:
    r={'slug':slug,'mode':mode,'url':url,'at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'cookieAction':None,'tlsVerification':True,'scope':'OwnactualautomatedWPEWebKit; nonGET/cartrequestsblocked; noforms/messages/cart/captchaactions; notreservation/demoliveQA'}
    try:
     res=await page.goto(url,wait_until='domcontentloaded',timeout=40000);await page.wait_for_timeout(2000)
     for label in ['Nesouhlasím','Nesúhlasím','Povolit jen nezbytné nutné cookies','Odmítnout','Odmítnout vše','Pouze nezbytné','Odmietnuť voliteľné','Odmietnuť','Odmietnuť všetko','Prijať nevyhnutné súbory cookie']:
      c=page.get_by_text(label,exact=True)
      if await c.count() and await c.first.is_visible():await c.first.click();r['cookieAction']=label;await page.wait_for_timeout(600);break
     if mode=='home':
      label='Nastavenie' if slug=='vonavepranie' else 'Nastavení'
      c=page.get_by_text(label,exact=True)
      if await c.count() and await c.first.is_visible():
       await c.first.click();await page.wait_for_timeout(300)
       r['cookieSettingsBefore']=await page.locator('input[type=checkbox]').evaluate_all('(es)=>es.filter(e=>e.getBoundingClientRect().width>0).map(e=>({id:e.id,name:e.name,checked:e.checked,disabled:e.disabled}))')
       off=page.get_by_text('Vše vypnout',exact=True)
       if await off.count() and await off.first.is_visible():await off.first.click();r['cookieAction']='Nastavení > Vše vypnout'
       else:
        checks=page.locator('.cookiesSetting input[type=checkbox]:enabled')
        for j in range(await checks.count()):
         if await checks.nth(j).is_checked():await checks.nth(j).uncheck()
        confirm=page.get_by_text('Potvrdiť moje voľby' if slug=='vonavepranie' else 'Potvrdit moje volby',exact=True)
        if await confirm.count() and await confirm.first.is_visible():await confirm.first.click();r['cookieAction']=label+' > optionalcheckboxoff > confirm'
       await page.wait_for_timeout(500)
     if slug=='essencebliss' and mode=='product':
      select=page.locator('#simple-variants-select');await select.select_option('4099');await page.wait_for_timeout(400);r['selectedVariant']={'nativeValue':await select.input_value(),'label':await select.locator('option:checked').inner_text(),'sku':'1134/DRE','priceExpected':449,'scope':'Ordinary native select only, no cart/form/chat submit'}
     await page.wait_for_timeout(1500)
     r.update(status=res.status,title=await page.title(),text=(await page.locator('body').inner_text())[:22000],buttons=await page.locator('button').all_text_contents(),iframes=await page.locator('iframe').evaluate_all('(es)=>es.map(e=>({src:e.src,title:e.title}))'),images=await page.locator('img').evaluate_all('(es)=>es.filter(i=>i.getBoundingClientRect().top<900&&i.getBoundingClientRect().bottom>0).map(i=>({src:i.currentSrc,alt:i.alt,loaded:i.complete,width:i.naturalWidth,height:i.naturalHeight}))'));await page.screenshot(path=str(OUT/(slug+'-'+mode+'.png')),timeout=30000,animations='disabled');(OUT/(slug+'-'+mode+'.html')).write_text(await page.content())
    except Exception as e:r['error']=str(e)
    rows.append(r);(OUT/'next-live-preflight.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2)+'\n');print(slug,mode,r.get('status'),r.get('cookieAction'),r.get('error'),flush=True)
   await page.close()
  await browser.close()
asyncio.run(main())
