"""Focused local checks of price/pack/photo/CTA, waiting motion and offer copy. All API mocked."""
import argparse,asyncio,json,pathlib,datetime,re,unicodedata
from playwright.async_api import async_playwright
import os
from urllib.parse import urlsplit
p=argparse.ArgumentParser();p.add_argument('--output',required=True);p.add_argument('--base',default='http://127.0.0.1:8911');p.add_argument('--slugs',nargs='+',default=['adoraniche','nicheandglow']);p.add_argument('--fixture-scentisimo',action='store_true');p.add_argument('--browser',choices=['chromium','webkit'],default='chromium');p.add_argument('--browser-executable');p.add_argument('--commit',default='8a1bb74685d6b3b67fcc817d7c7c5515816360aa');p.add_argument('--deployment-id');p.add_argument('--widths',type=int,nargs='+',default=[320,390,1280]);p.add_argument('--indexes',type=int,nargs='+',default=[0,1,2]);a=p.parse_args();image_format='png' if a.browser=='webkit' else 'webp';shot_options={'type':'png'} if a.browser=='webkit' else {'type':'webp','quality':82};root=pathlib.Path(__file__).resolve().parents[3];out=pathlib.Path(a.output);out.mkdir(parents=True,exist_ok=True)
report={'at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'commit':'8a1bb74685d6b3b67fcc817d7c7c5515816360aa','scope':'Independent local snapshot focused mock-chat verification; not live Preview QA.','cards':[],'viewports':[],'errors':[],'paidModelCalls':0,'complete':False}
if a.fixture_scentisimo:report['scope']='Isolated Scentisimo data/config fixture; source-ID mock responses, NOT registered/shared backend/live Preview QA.'
if a.base.startswith('https://'):
 report.update({'commit':a.commit,'deploymentId':a.deployment_id,'baseUrl':a.base,'browser':a.browser,'tlsVerification':True,'scope':'Live unique Vercel Preview on exact supplied commit; API replies mocked/offline only. No live merchant messages or paid model calls.','qaType':'Live unique Vercel Preview on exact supplied commit; API replies mocked/offline only. No live merchant messages or paid model calls.'})
def save():(out/'independent-chat.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
async def run():
 async with async_playwright() as pw:
  launch={'headless':True}
  if a.browser_executable:launch['executable_path']=a.browser_executable
  elif a.browser=='chromium':launch['executable_path']='/usr/bin/chromium'
  if a.base.startswith('https://') and a.browser=='webkit':
   proxy=urlsplit(os.environ.get('HTTPS_PROXY',''))
   if proxy.hostname:launch['proxy']={'server':f'{proxy.scheme}://{proxy.hostname}:{proxy.port}'}
  browser=await getattr(pw,a.browser).launch(**launch)
  for slug in a.slugs:
   products=json.loads((root/f'n447/s5/sources/{slug}/verified-products.json').read_text())['products'];facts={p['id']:p for p in products};config=json.loads((root/f'n447/s5/perfume-fragments/{slug}.config.json').read_text())
   for width in a.widths:
    page=await browser.new_page(ignore_https_errors=False,viewport={'width':width,'height':900},reduced_motion='reduce');page.on('pageerror',lambda e:report['errors'].append(str(e)));release=asyncio.Event();hold=False
    async def network(route):
     if '/api/' in route.request.url:
      if hold:await release.wait()
      if a.fixture_scentisimo and slug=='scentisimo':
       body=json.loads(route.request.post_data or '{}');query=body.get('messages',[{}])[-1].get('content','');rule=next((r for r in config['offlineReplyRequirements'] if r['chip']==query),None)
       if rule:
        text='\n\n'.join(f"{facts[pid]['name']} — {facts[pid]['volume']} za {facts[pid]['price']}.\n{facts[pid]['url']}" for pid in rule['productIds']);await route.fulfill(status=200,content_type='application/json',body=json.dumps({'reply':text},ensure_ascii=False));return
      await route.fulfill(status=503,content_type='application/json',body='{"error":"offline_mock"}')
     elif route.request.url.startswith(a.base+'/'):await route.continue_()
     else:await route.abort()
    await page.route('**/*',network)
    path='/__perfume_fixture/scentisimo.html' if a.fixture_scentisimo and slug=='scentisimo' else '/s5.html';url=a.base+path+'?demo='+slug
    await page.goto(url,wait_until='domcontentloaded');await page.wait_for_function('()=>document.querySelector("#cosmetics-root")?.getAttribute("aria-busy")!=="true"&&document.querySelector("[data-open=chat]")');landing=await page.locator('body').inner_text();plain=''.join(c for c in unicodedata.normalize('NFD',landing) if unicodedata.category(c)!='Mn')
    assert re.search(r'447\s*€',landing) and re.search(r'10\s*€',landing);assert not re.search('skusobn|zkusebn|mesiac zdarma|mesic zdarma',plain,re.I)
    await page.screenshot(path=str(out/f'{slug}-offer-{width}.{image_format}'),**shot_options)
    waiting_checked=False
    for index in a.indexes:
     await page.goto(url,wait_until='domcontentloaded');await page.wait_for_function('()=>document.querySelector("#cosmetics-root")?.getAttribute("aria-busy")!=="true"&&document.querySelector("[data-open=chat]")');await page.locator('[data-open="chat"]').click();assert await page.locator('.cx-chip').evaluate_all('(es)=>es.map(e=>Math.round(e.getBoundingClientRect().height))')==[40]*4
     hold=index==0
     await page.locator('.cx-chip').nth(index).click()
     if hold:
      await page.locator('.lg-typing').wait_for();assert await page.locator('.lg-typing i').first.evaluate('(e)=>getComputedStyle(e).animationName')=='none';await page.screenshot(path=str(out/f'{slug}-waiting-{width}.{image_format}'),**shot_options);release.set();hold=False;waiting_checked=True
     cards=page.locator('.cx-message--assistant').last.locator('a.lg-wine-card');await cards.first.wait_for();await page.wait_for_function('()=>!document.querySelector(".lg-typing")')
     expected=config['offlineReplyRequirements'][index]['productIds'];assert await cards.count()==len(expected)
     for number,pid in enumerate(expected):
      card=cards.nth(number);fact=facts[pid];assert await card.get_attribute('href')==fact['url'];text=await card.inner_text();assert fact['price'] in text and fact['volume'] in text
      await card.locator('img').evaluate('(i)=>i.decode()');assert await card.locator('img').evaluate('(i)=>i.complete&&i.naturalWidth>=500')
      priceLabel=' '.join((await card.locator('.lg-wine-foot strong').inner_text()).split());assert priceLabel==' '.join((fact['volume']+' za '+fact['price']+'.').split()),priceLabel
      b=await card.bounding_box();assert b;assert not await card.evaluate('(e)=>e.scrollWidth>e.clientWidth+1')
      for selector in ['.lg-wine-foot strong','.lg-wine-go']:
       q=await card.locator(selector).bounding_box();assert q;assert q['x']>=b['x']-1 and q['x']+q['width']<=b['x']+b['width']+1;assert q['y']>=b['y']-1 and q['y']+q['height']<=b['y']+b['height']+1
      file=f'{slug}-card-{index}-{width}.{image_format}';await page.screenshot(path=str(out/file),**shot_options);report['cards'].append({'slug':slug,'width':width,'id':pid,'price':fact['price'],'pack':fact['volume'],'url':fact['url'],'photoDecoded':True,'priceAndCtaInsideCard':True,'screenshot':file});save()
    report['viewports'].append({'slug':slug,'width':width,'offer447plus10':True,'noTrialCopy':True,'four40pxChips':True,'reducedMotionWaiting':waiting_checked});save();await page.close();print(slug,width,'focused chat complete',flush=True)
  assert len(report['cards'])==len(a.indexes)*len(a.widths)*len(a.slugs) and not report['errors'];report['complete']=True;save();await browser.close()
try:asyncio.run(run())
except Exception as e:report['failure']=str(e);save();raise
