"""Actual isolated browser QA of explicit result module proposal; API mocked, no Preview claim."""
import pathlib,asyncio,json,datetime,os,argparse,re
from playwright.async_api import async_playwright
p=argparse.ArgumentParser();p.add_argument('--output',required=True);a=p.parse_args();R=pathlib.Path(a.output);R.mkdir(parents=True,exist_ok=True);B=pathlib.Path(__file__).resolve().parents[1];P=B/'candidate-packages/myskino';facts=json.loads((P/'verified-products.json').read_text());cfg=json.loads((P/'config.json').read_text());engine=json.load(open('/workspace/work/perfume-audit/myskino-live-20261111/engine-final.json'));ps={p['id']:p for p in facts['products']};report={'checkedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'scope':'Offline review module on immutable c9 core with explicit one-line fixture loader, NOT registered/shared runtime/Preview QA','results':[],'errors':[],'paidModelCalls':0,'complete':False}
def save():(R/'result-extras-qa.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
norm=lambda s:re.sub(r'\s+',' ',s).strip()
async def main():
 async with async_playwright() as pw:
  b=await pw.webkit.launch(headless=True,executable_path=str(B/'webkit-user-libs.sh'))
  for width in [320,390,1280]:
   page=await b.new_page(ignore_https_errors=False,viewport={'width':width,'height':900},reduced_motion='reduce');page.on('pageerror',lambda e:report['errors'].append(str(e)))
   async def network(route):
    if '/api/' in route.request.url:await route.fulfill(status=503,content_type='application/json',body='{"error":"offline_only"}')
    elif route.request.url.startswith(('http://127.0.0.1:8915/','data:','blob:')):await route.continue_()
    else:await route.abort()
   await page.route('**/*',network)
   async def walk(leaf,reload=True):
    if reload:
     await page.goto('http://127.0.0.1:8915/__candidate/myskino.html?demo=myskino',wait_until='domcontentloaded');await page.wait_for_function('()=>document.querySelector("#cosmetics-root")?.getAttribute("aria-busy")!=="true"&&window.CX_S5?.fragranceExtrasInstalled===true');await page.locator('[data-open="advisor"]').click()
    for k,v in leaf['answers'].items():await page.locator('[data-choice="'+v+'"]').click()
    await page.locator('[data-fragrance-result="enhanced"]').wait_for();await page.locator('.s5-product img,.fr-related-card img').evaluate_all('(es)=>Promise.all(es.map(i=>i.decode()))');await page.evaluate('()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))');await page.wait_for_timeout(180)
   for leaf in engine['companies']['myskino']['leaves']:
    await walk(leaf);pid=leaf['id'];f=ps[pid];v=(f['source'].get('upsellVariants') or [None])[0];extra=page.locator('[data-fragrance-extra]');total=page.locator('[data-s5-total]');assert norm(await total.inner_text())==norm(f['price']);assert await extra.count()==int(v is not None);assert not await page.evaluate('document.documentElement.scrollWidth>innerWidth')
    file=f'myskino-extras-{pid}-{width}.png';await page.screenshot(path=str(R/file));record={'id':pid,'width':width,'basePrice':f['price'],'pack':f['volume'],'url':f['url'],'screenshot':file,'defaultUnchecked':True,'addon':v and {'id':v['id'],'volume':v['volume'],'price':v['price']},'imagesDecoded':True}
    if v:
     assert not await extra.is_checked();assert norm(v['price']) in norm(await page.locator('.fr-extra-pack').inner_text());assert await page.locator('.fr-extra-pack a').get_attribute('href')==v['url'];await extra.check();expected=f['priceAmount']+v['priceAmount'];visible=await total.inner_text();n=float(re.sub(r'[^\d,.]','',visible).replace(',','.'));assert n==expected,(pid,expected,visible);record['checkedTotal']=visible
     await page.locator('.fr-extra-pack').scroll_into_view_if_needed();sel=f'myskino-selected-{pid}-{width}.png';await page.screenshot(path=str(R/sel));record['selectedScreenshot']=sel;await extra.uncheck();assert norm(await total.inner_text())==norm(f['price']);record['uncheckRestoresBase']=True
    notes=page.locator('.fr-extra-notes');await notes.locator('summary').click();assert await notes.locator('dd').count()==3;assert all([(await notes.locator('dd').nth(i).inner_text()).strip() for i in range(3)]);await notes.scroll_into_view_if_needed();note=f'myskino-notes-{pid}-{width}.png';await page.screenshot(path=str(R/note));record['notesScreenshot']=note;await notes.locator('summary').click()
    comp=page.locator('.fr-extra-compare');await comp.locator('summary').click();ids=await page.locator('[data-fragrance-compare-id]').evaluate_all('(es)=>es.map(e=>e.dataset.fragranceCompareId)');assert len(ids)==2 and ids[0]==pid and ids[0]!=ids[1];assert ids[1]==cfg['registryObject']['fragranceResultExtras']['alternatives'][pid]
    for x in ids:
     c=page.locator('[data-fragrance-compare-id="'+x+'"]');assert ps[x]['price'] in await c.inner_text() and ps[x]['volume'] in await c.inner_text();assert await c.locator('a').get_attribute('href')==ps[x]['url']
    await comp.scroll_into_view_if_needed();cmp=f'myskino-pair-{pid}-{width}.png';await page.screenshot(path=str(R/cmp));record['compareScreenshot']=cmp;record['comparisonIds']=ids
    await page.locator('[data-restart]').click();await walk(leaf,False)
    if v:assert not await page.locator('[data-fragrance-extra]').is_checked()
    assert norm(await total.inner_text())==norm(f['price']);record['resetClearsExtra']=True;report['results'].append(record);save()
   await page.close();print(width,'all7results/extras/notes/comparisons/reset PASS',flush=True)
  assert not report['errors'];assert len(report['results'])==21;report['complete']=True;save();await b.close()
try:asyncio.run(main())
except Exception as e:report['failure']=str(e);save();raise
