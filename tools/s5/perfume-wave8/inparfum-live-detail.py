from pathlib import Path
import asyncio,os,json,re,datetime
from urllib.parse import urlsplit
from playwright.async_api import async_playwright
O=Path('/workspace/work/perfume-audit/wave7-20261114/inparfum-merchant-final');O.mkdir(exist_ok=True)
async def main():
 out={'at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'tlsVerification':True,'scope':'OwnactualWPE, GETonly/no cart; no textinput/message/formsubmission/captcha. Nativevariantclicks are localproductselection, not purchase.','pages':[],'variantClicks':[]}
 async with async_playwright() as pw:
  x=urlsplit(os.environ['HTTPS_PROXY']);b=await pw.webkit.launch(headless=True,executable_path='/workspace/work/perfume-worker/tools/s5/perfume-independent/webkit-user-libs.sh',proxy={'server':f'{x.scheme}://{x.hostname}:{x.port}'});p=await b.new_page(ignore_https_errors=False,viewport={'width':1280,'height':900});p.set_default_timeout(6000)
  async def guard(r):
   if r.request.method!='GET' or re.search(r'/(cart|kosik|checkout)(/|$)',urlsplit(r.request.url).path,re.I):await r.abort()
   else:await r.continue_()
  await p.route('**/*',guard)
  for mode,url in [('home','https://www.inparfum.cz/'),('shop','https://www.inparfum.cz/obchod/'),('converter','https://www.inparfum.cz/prevodnik-vuni/'),('product','https://www.inparfum.cz/obchod/prilezitost/bezny-den/in-parfum-m233/')]:
   r={'mode':mode,'url':url,'at':datetime.datetime.now(datetime.timezone.utc).isoformat()}
   try:
    res=await p.goto(url,wait_until='domcontentloaded',timeout=40000);await p.wait_for_timeout(2200);q=p.get_by_text('Odmítnout',exact=True)
    if await q.count() and await q.first.is_visible():await q.first.click();r['cookieAction']='Odmítnout'
    r.update(status=res.status,title=await p.title(),text=(await p.locator('body').inner_text())[:18000],iframes=await p.locator('iframe').evaluate_all('(es)=>es.map(e=>({title:e.title,src:e.src}))'));await p.screenshot(path=str(O/(mode+'.png')),animations='disabled',timeout=30000);(O/(mode+'.html')).write_text(await p.content())
    if mode=='product':
     for label in ['50 ml','10 ml']:
      q=p.locator('.cfvsw-swatch-inner').get_by_text(label,exact=True)
      if not await q.count():q=p.locator('.cfvsw-swatch-inner').filter(has_text=re.compile('^'+label+'$'))
      await q.first.click();await p.wait_for_timeout(600);v={'label':label,'selected':await p.locator('select[name="attribute_pa_variant-vone"]').input_value(),'variationId':await p.locator('input.variation_id').input_value(),'variationText':await p.locator('.single_variation').inner_text(),'photo':await p.locator('.woocommerce-product-gallery__image img').first.get_attribute('src')};out['variantClicks'].append(v);await p.screenshot(path=str(O/('selected-'+label.replace(' ','')+'.png')),animations='disabled',timeout=30000)
   except Exception as e:r['error']=str(e)
   out['pages'].append(r);(O/'report.json').write_text(json.dumps(out,ensure_ascii=False,indent=2));print(mode,r.get('status'),r.get('error'),flush=True)
  await b.close()
asyncio.run(main())
