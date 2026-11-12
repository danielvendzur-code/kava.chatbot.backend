"""Independent local browser QA for the immutable coordinator snapshot. All API mocked."""
import argparse,asyncio,json,pathlib,datetime,re
from playwright.async_api import async_playwright
import os
from urllib.parse import urlsplit
p=argparse.ArgumentParser();p.add_argument('--engine-report',required=True);p.add_argument('--output',required=True);p.add_argument('--base',default='http://127.0.0.1:8911');p.add_argument('--slugs',nargs='+',default=['adoraniche','nicheandglow']);p.add_argument('--fixture-scentisimo',action='store_true');p.add_argument('--package-root');p.add_argument('--config-root');p.add_argument('--integrated-runtime',action='store_true');p.add_argument('--offline-api-base');p.add_argument('--skip-compare',action='store_true');p.add_argument('--resume-report');p.add_argument('--leaf-ids',nargs='+');p.add_argument('--skip-interactions',action='store_true');p.add_argument('--result-extras-review',action='store_true');p.add_argument('--browser',choices=['chromium','webkit'],default='chromium');p.add_argument('--browser-executable');p.add_argument('--commit',default='8a1bb74685d6b3b67fcc817d7c7c5515816360aa');p.add_argument('--deployment-id');p.add_argument('--widths',type=int,nargs='+',default=[320,390,1280]);a=p.parse_args();image_format='png' if a.browser=='webkit' else 'webp';shot_options={'type':'png'} if a.browser=='webkit' else {'type':'webp','quality':82};
root=pathlib.Path(__file__).resolve().parents[3];out=pathlib.Path(a.output);out.mkdir(parents=True,exist_ok=True);engine=json.loads(pathlib.Path(a.engine_report).read_text())
report={'commit':engine['commit'],'at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'qaType':'PERFUME_WORKER independent local snapshot browser QA; not live merchant or Preview QA','paidModelCalls':0,'results':[],'questionPages':[],'interactions':[],'errors':[],'blockedExternalHosts':[],'complete':False}
if a.integrated_runtime:report.update({'qaType':'Actual integrated S5 runtime+real local backend; AI injected offline stub, not deployed Preview','apiMode':'real_local_backend_injected_ai_stub','paidModelCalls':0})
if a.fixture_scentisimo:report['qaType']='Isolated local Scentisimo data/config fixture on unchanged coordinator core; API responses mocked from source IDs. NOT registered/shared backend/live/Preview QA.'
if a.package_root:report.update({'commit':a.commit,'qaType':'Isolated candidate package on unchanged coordinator core; source-ID mock responses. NOT registered/shared backend/Preview QA.','scope':'Local isolated candidate fixture only.','browser':a.browser})
if a.base.startswith('https://'):
 report.update({'commit':a.commit,'deploymentId':a.deployment_id,'baseUrl':a.base,'browser':a.browser,'tlsVerification':True,'scope':'Live unique Vercel Preview on exact supplied commit; API replies mocked/offline only. No live merchant messages or paid model calls.','qaType':'Live unique Vercel Preview on exact supplied commit; API replies mocked/offline only. No live merchant messages or paid model calls.'})
if a.resume_report:
 previous=json.loads(pathlib.Path(a.resume_report).read_text());report.update(previous);report['priorFailure']=report.pop('failure',None);report['resumeScope']='Only missing result viewports; comparison explicitly pending if skip-compare.';report['complete']=False
if a.integrated_runtime and a.base.startswith('https://'):raise ValueError('Live API calls forbidden: use --offline-api-base for Preview.')
if a.offline_api_base:
 parsed=urlsplit(a.offline_api_base)
 if parsed.scheme!='http' or parsed.hostname!='127.0.0.1':raise ValueError('Offline API must use loopback HTTP only.')
 report.update({'apiMode':'real_local_backend_injected_ai_stub','offlineApiBase':a.offline_api_base,'paidModelCalls':0})
async def fulfill_offline_api(route):
 import urllib.request,urllib.error
 def fetch():
  request=urllib.request.Request(a.offline_api_base+urlsplit(route.request.url).path,data=(route.request.post_data or '{}').encode(),headers={'Content-Type':'application/json'},method='POST')
  opener=urllib.request.build_opener(urllib.request.ProxyHandler({}))
  try:
   with opener.open(request,timeout=20) as r:return r.status,r.read()
  except urllib.error.HTTPError as e:return e.code,e.read()
 status,body=await asyncio.to_thread(fetch)
 await route.fulfill(status=status,content_type='application/json',body=body)
def save():(out/'independent-ui.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
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
   source=json.loads((pathlib.Path(a.package_root)/slug/'verified-products.json' if a.package_root else root/f'n447/s5/sources/{slug}/verified-products.json').read_text());facts={p['id']:p for p in source['products']};config=json.loads((pathlib.Path(a.package_root)/slug/'config.json' if a.package_root else (pathlib.Path(a.config_root)/f'{slug}.config.json' if a.config_root else root/f'n447/s5/perfume-fragments/{slug}.config.json')).read_text())
   for width in a.widths:
    page=await browser.new_page(ignore_https_errors=False,viewport={'width':width,'height':900},reduced_motion='reduce')
    page.on('pageerror',lambda error:report['errors'].append(str(error)))
    async def network(route):
     u=route.request.url
     if '/api/' in u:
      if a.offline_api_base:await fulfill_offline_api(route);return
      if a.integrated_runtime:await route.continue_();return
      if a.package_root or (a.fixture_scentisimo and slug=='scentisimo'):
       body=json.loads(route.request.post_data or '{}');query=body.get('messages',[{}])[-1].get('content','');rule=next((r for r in config['offlineReplyRequirements'] if r['chip']==query),None)
       if rule:
        text='\n\n'.join(f"{facts[pid]['name']} — {facts[pid]['volume']} za {facts[pid]['price']}.\n{facts[pid]['url']}" for pid in rule['productIds']);await route.fulfill(status=200,content_type='application/json',body=json.dumps({'reply':text},ensure_ascii=False));return
      await route.fulfill(status=503,content_type='application/json',body='{"error":"offline_mock"}')
     elif u.startswith(a.base+'/') or u.startswith(('data:','blob:')):await route.continue_()
     else:
      from urllib.parse import urlsplit
      host=urlsplit(u).netloc
      if host and host not in report['blockedExternalHosts']:report['blockedExternalHosts'].append(host)
      await route.abort()
    await page.route('**/*',network)
    async def open_mode(mode='advisor'):
     path=f'/__candidate/{slug}.html' if a.package_root else ('/__perfume_fixture/scentisimo.html' if a.fixture_scentisimo and slug=='scentisimo' else '/s5.html')
     await page.goto(a.base+path+'?demo='+slug,wait_until='domcontentloaded');await page.wait_for_function('()=>document.querySelector("#cosmetics-root")?.getAttribute("aria-busy")!=="true"&&document.querySelector("[data-open=chat]")');await page.locator('[data-open="'+mode+'"]').click()
    seen=set()
    for leaf in engine['companies'][slug]['leaves']:
     if a.leaf_ids and leaf['id'] not in a.leaf_ids:continue
     if any(r['slug']==slug and r['width']==width and r['id']==leaf['id'] for r in report['results']):continue
     await open_mode()
     for key,value in leaf['answers'].items():
      for turn in range(10):
       await page.wait_for_function('()=>document.querySelectorAll(".cx-quality-option img").length>0 && [...document.querySelectorAll(".cx-quality-option img")].every(i=>i.complete&&i.naturalWidth>=500)')
       await page.locator('.cx-quality-option img').evaluate_all('(es)=>Promise.all(es.map(i=>i.decode()))');await page.evaluate('()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))');await page.wait_for_timeout(180)
       options=await page.locator('.cx-quality-option').evaluate_all('(es)=>es.map(e=>({id:e.dataset.choice,photo:e.querySelector("img")?.getAttribute("src")}))')
       assert len({x['photo'] for x in options})==len(options),(slug,width,'repeated question image',options)
       body=await page.locator('.cx-quality-body').inner_text();assert not re.search('Preferenčná skupina|klasifikácia rodiny|typ pokožky|typ pleti',body,re.I)
       assert not await page.evaluate('document.documentElement.scrollWidth>innerWidth')
       signature=key+'-'+'-'.join(str(x['id']) for x in options)
       if signature not in seen:
        seen.add(signature);file=f'{slug}-question-{len(seen)}-{width}.{image_format}';await page.screenshot(path=str(out/file),**shot_options);report['questionPages'].append({'slug':slug,'width':width,'key':key,'options':options,'screenshot':file,'loaded':True,'noPageOverflow':True})
       choice=page.locator('[data-choice="'+value+'"]')
       if await choice.count():await choice.click();break
       assert await page.locator('[data-page-next]').count(),(slug,width,'missing option',value);await page.locator('[data-page-next]').click()
      else:raise AssertionError('Pagination did not reach '+value)
     await page.locator('.s5-product').wait_for();f=facts[leaf['id']];card=page.locator('.s5-product');assert await card.get_attribute('data-product-id')==f['id']
     text=await card.inner_text()
     if f.get('isSample'):assert re.search(r'ilustr',text,re.I),(slug,f['id'],'sample photo disclosure missing')
     if re.search(r'tester',f.get('kind',''),re.I):assert re.search(r'tester',text,re.I),(slug,f['id'],'tester disclosure missing')
     if f['source'].get('identityDisclosure'):assert 'nejde o originál' in text,(slug,f['id'],'inspiration disclosure missing')
     assert f['name'] in text and f['price'] in text and f['volume'] in text,(slug,width,f['id'],text)
     assert await card.locator('.s5-cta').get_attribute('href')==f['url'];assert not await page.locator('[data-s5-addon],.s5-shipping').count()
     await page.wait_for_function('()=>{const i=document.querySelector(".s5-product img");return i?.complete&&i.naturalWidth>=500}')
     assert not await page.evaluate('document.documentElement.scrollWidth>innerWidth')
     bounds=await card.bounding_box();cta=await card.locator('.s5-cta').bounding_box();assert bounds and cta
     assert cta['x']>=bounds['x']-1 and cta['x']+cta['width']<=bounds['x']+bounds['width']+1
     assert cta['y']>=bounds['y']-1 and cta['y']+cta['height']<=bounds['y']+bounds['height']+1
     progress=await page.locator('.cx-quality-progress').inner_text();assert re.search('Výsledok|Výsledek',progress)
     file=f'{slug}-result-{f["id"]}-{width}.{image_format}';await page.screenshot(path=str(out/file),**shot_options)
     if a.result_extras_review:
      assert await page.locator('[data-fragrance-result="enhanced"]').count()==1
      row={'slug':slug,'width':width,'id':f['id'],'defaultScreenshot':file,'defaultUnchecked':True}
      extra=page.locator('[data-fragrance-extra]');variants=f['source'].get('upsellVariants',[]);supplement_id=config['registryObject'].get('fragranceResultExtras',{}).get('addonProductIdsByParent',{}).get(f['id']);variants=([facts[supplement_id]] if supplement_id else variants);assert await extra.count()==int(bool(variants))
      def amount(s):return float(re.sub(r'[^0-9,.]','',s).replace(',','.'))
      if variants:
       v=variants[0];assert not await extra.is_checked();assert await page.locator('.fr-extra-pack a').get_attribute('href')==v['url']
       if await page.locator('.fr-extra-pack-photo').count():await page.locator('.fr-extra-pack-photo').evaluate('(i)=>i.decode()')
       await extra.check();assert amount(await page.locator('[data-s5-total]').inner_text())==f['priceAmount']+v['priceAmount'];row['checkedTotal']=await page.locator('[data-s5-total]').inner_text();await page.locator('.fr-extra-pack').scroll_into_view_if_needed();selected=f'{slug}-selected-{f["id"]}-{width}.{image_format}';await page.screenshot(path=str(out/selected),**shot_options);row['selectedScreenshot']=selected;await extra.uncheck();assert amount(await page.locator('[data-s5-total]').inner_text())==f['priceAmount'];row['uncheckRestoresBase']=True
      notes=page.locator('.fr-extra-notes')
      if await notes.count():
       await notes.locator('summary').click();assert await notes.locator('dd').count()==3;await notes.scroll_into_view_if_needed();note=f'{slug}-notes-{f["id"]}-{width}.{image_format}';await page.screenshot(path=str(out/note),**shot_options);row['notesScreenshot']=note;await notes.locator('summary').click()
      cmp=page.locator('.fr-extra-compare');await cmp.locator('summary').click();ids=await page.locator('[data-fragrance-compare-id]').evaluate_all('(es)=>es.map(e=>e.dataset.fragranceCompareId)');assert len(ids)==2 and ids[0]==f['id'] and ids[0]!=ids[1] and ids[1]==config['registryObject']['fragranceResultExtras']['alternatives'][f['id']]
      for x in ids:
       col=page.locator('[data-fragrance-compare-id="'+x+'"]');assert facts[x]['price'] in await col.inner_text() and facts[x]['volume'] in await col.inner_text();assert await col.locator('a').get_attribute('href')==facts[x]['url']
      await cmp.scroll_into_view_if_needed();pair=f'{slug}-pair-{f["id"]}-{width}.{image_format}';await page.screenshot(path=str(out/pair),**shot_options);row['compareScreenshot']=pair;row['comparisonIds']=ids;report.setdefault('enrichedStates',[]).append(row)
     await page.locator('[data-restart]').click();assert await page.locator('[data-choice]').count()==min(4,len(engine['companies'][slug]['questions'][0]['step']['options']))
     report['results'].append({'slug':slug,'width':width,'id':f['id'],'pack':f['volume'],'price':f['price'],'url':f['url'],'photoLoaded':True,'ctaInsideCard':True,'reset':True,'progress':progress,'screenshot':file});save()
    if a.skip_interactions:await page.close();continue
    # Hover geometry and every offline chip; no merchant CTA is clicked.
    await open_mode();first=page.locator('.cx-quality-option').first;await page.mouse.move(0,0);before=await first.bounding_box();color=await first.evaluate('(e)=>getComputedStyle(e).borderColor');await first.hover();await page.wait_for_timeout(150);after=await first.bounding_box();assert abs(before['y']-after['y'])<1;assert color!=await first.evaluate('(e)=>getComputedStyle(e).borderColor')
    for i in range(3):
     await open_mode('chat');assert await page.locator('.cx-chip').evaluate_all('(es)=>es.map(e=>Math.round(e.getBoundingClientRect().height))')==[40]*4
     await page.locator('.cx-chip').nth(i).click();cards=page.locator('.cx-message--assistant').last.locator('a.lg-wine-card');await cards.first.wait_for();await page.wait_for_function('()=>!document.querySelector(".lg-typing")')
     expected=[facts[pid]['url'] for pid in config['offlineReplyRequirements'][i]['productIds']];assert await cards.evaluate_all('(es)=>es.map(e=>e.getAttribute("href"))')==expected
     # Dedicated verify-chat-cards.py checks decoded images, price/pack and CTA bounds.
     for c in await cards.all():
      b=await c.bounding_box();assert b;assert not await c.evaluate('(e)=>e.scrollWidth>e.clientWidth+1')
     file=f'{slug}-chat-{i}-{width}.{image_format}';await page.screenshot(path=str(out/file),**shot_options)
    if not a.skip_compare:
     await open_mode('chat');await page.locator('.cx-chip[data-s3-action="compare"]').click();assert await page.locator('[data-s4-prod]').count()==2
     await page.locator('[data-s4-prod]').nth(0).click();await page.locator('[data-s4-prod]').nth(1).click();await page.locator('.s3-cmp-cols').wait_for();await page.wait_for_function('()=>[...document.querySelectorAll(".s3-cmp-cols img")].every(i=>i.complete&&i.naturalWidth>0)')
     text=await page.locator('.s3-cmp-cols').inner_text()
     for pid in config['compareProductIds']:
      f=facts[pid];assert f['price'] in text and f['volume'] in text;assert await page.locator('.s3-cmp-cols a[href="'+f['url']+'"]').count()
     file=f'{slug}-compare-{width}.{image_format}';await page.screenshot(path=str(out/file),**shot_options)
    else:file=None
    report['interactions'].append({'slug':slug,'width':width,'four40pxChips':True,'offlineChipReplies':3,'compareDistinct':None if a.skip_compare else config['compareProductIds'],'comparisonStatus':'PENDING_MAIN_SAMPLE_COMPARE_OPT_IN' if a.skip_compare else 'PASS','hoverNoLayoutShift':True,'reducedMotionMedia':await page.evaluate('matchMedia("(prefers-reduced-motion: reduce)").matches'),'screenshot':file});save();await page.close();print(slug,width,'complete',flush=True)
  assert not report['errors'];assert len(report['results'])==sum(sum(1 for leaf in engine['companies'][s]['leaves'] if not a.leaf_ids or leaf['id'] in a.leaf_ids)*len(a.widths) for s in a.slugs);report['allRequestedResultsPassed']=True;report['complete']=not a.skip_compare;save();await browser.close()
try:asyncio.run(run())
except Exception as e:report['failure']=str(e);save();raise
