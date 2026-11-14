from pathlib import Path
import asyncio,json,datetime,os,re
from urllib.parse import urlsplit
from playwright.async_api import async_playwright
O=Path('/workspace/work/perfume-audit/wave7-20261114/scents-reject-final');O.mkdir(exist_ok=True)
async def main():
 out={'at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'scope':'ActualWPEWebKitTLSon, Onlysame-originprivacyPOST/module/californiaconsent/save allowed; othernonGET/cartblocked, noinputs/messages/form/cart/captcha','pages':[]}
 async with async_playwright() as pw:
  x=urlsplit(os.environ['HTTPS_PROXY']);b=await pw.webkit.launch(headless=True,executable_path='/workspace/work/perfume-worker/tools/s5/perfume-independent/webkit-user-libs.sh',proxy={'server':f'{x.scheme}://{x.hostname}:{x.port}'});p=await b.new_page(ignore_https_errors=False,viewport={'width':1280,'height':900})
  async def guard(r):
   if (r.request.method!='GET' and not (r.request.method=='POST' and urlsplit(r.request.url).hostname=='scents.cz' and urlsplit(r.request.url).path=='/module/californiaconsent/save')) or re.search(r'/(cart|kosik|checkout)(/|$)',urlsplit(r.request.url).path,re.I):await r.abort()
   else:await r.continue_()
  await p.route('**/*',guard)
  for mode,url in [('home','https://www.scents.cz/'),('product','https://scents.cz/domu/28-vune-more-laguna-breeze.html'),('home-after-settings','https://scents.cz/')]:
   res=await p.goto(url,wait_until='domcontentloaded',timeout=40000);await p.wait_for_timeout(2200);r={'mode':mode,'url':p.url,'at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'status':res.status,'actions':[]}
   for label in ['Odmítnout nepovinné','Odmietnuť nepovinné']:
    q=p.get_by_text(label,exact=True)
    if await q.count() and await q.first.is_visible():await q.first.click();r['actions'].append(label);await p.wait_for_timeout(800);break
   r['consentPanelVisible']=await p.locator('#cs-consent').is_visible()
   r.update(text=(await p.locator('body').inner_text())[:10000],iframes=await p.locator('iframe').evaluate_all('(es)=>es.map(e=>({src:e.src,title:e.title}))'));await p.screenshot(path=str(O/(mode+'.png')),animations='disabled',timeout=30000);(O/(mode+'.html')).write_text(await p.content());out['pages'].append(r);(O/'report.json').write_text(json.dumps(out,ensure_ascii=False,indent=2));print(mode,r['status'],r['actions'],r['iframes'],flush=True)
  await b.close()
asyncio.run(main())
