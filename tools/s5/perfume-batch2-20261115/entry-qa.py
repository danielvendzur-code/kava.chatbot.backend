import asyncio,json,datetime
from pathlib import Path
from playwright.async_api import async_playwright
B=Path(__file__).resolve().parent;O=Path('/workspace/work/perfume-audit/batch2-20261115/entry-local-qa');O.mkdir(exist_ok=True);rows=[]
async def run():
 async with async_playwright() as pw:
  browser=await pw.webkit.launch(executable_path='/workspace/work/perfume-worker/tools/s5/perfume-independent/webkit-user-libs.sh',headless=True)
  for folder in sorted((B/'candidate-packages').iterdir()):
   if not (folder/'config.json').exists():continue
   slug=folder.name;config=json.load(open(folder/'config.json'));copy=config['registryObject']['segmentText']
   for width in [320,390,1280]:
    page=await browser.new_page(viewport={'width':width,'height':900},reduced_motion='reduce');page.set_default_timeout(15000)
    async def safe(route):
     if '/api/' in route.request.url:await route.fulfill(status=503,content_type='application/json',body='{"error":"offline_mock"}')
     elif route.request.url.startswith('http://127.0.0.1:8971/'):await route.continue_()
     else:await route.abort()
    await page.route('**/*',safe);r={'slug':slug,'width':width,'at':datetime.datetime.now(datetime.timezone.utc).isoformat()}
    try:
     await page.goto('http://127.0.0.1:8971/__candidate/'+slug+'.html?demo='+slug,wait_until='domcontentloaded');await page.wait_for_function('()=>document.querySelector("#cosmetics-root")?.getAttribute("aria-busy")!=="true"&&document.querySelector("[data-open=advisor]")')
     await page.wait_for_timeout(600);teaser=page.locator('#cx-teaser');title=(await teaser.locator('b').inner_text()).strip();note=(await teaser.locator('span').first.inner_text()).strip();assert title==copy['teaserTitle'],(slug,title,copy['teaserTitle']);assert note==copy['teaserNote'];assert not await page.evaluate('document.documentElement.scrollWidth>innerWidth');await page.locator(".s5-landing img").evaluate_all("es=>Promise.all(es.map(i=>i.decode().catch(()=>{})))");await page.screenshot(path=str(O/f'{slug}-entry-{width}.png'),animations='disabled')
     await page.locator('[data-open=advisor]').click();await page.locator('.cx-quality-option').first.wait_for();await page.wait_for_function('()=>document.querySelectorAll(".cx-quality-option img").length>0&&[...document.querySelectorAll(".cx-quality-option img")].every(i=>i.complete&&i.naturalWidth>0)');await page.locator('.cx-quality-option img').evaluate_all('(es)=>Promise.all(es.map(i=>i.decode()))');await page.evaluate('()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))');await page.wait_for_timeout(180);assert not await page.evaluate('document.documentElement.scrollWidth>innerWidth');logo=page.locator('.cx-logo').first;assert await logo.is_visible();assert await logo.evaluate('(e)=>e.complete&&e.naturalWidth>0');await page.screenshot(path=str(O/f'{slug}-first-question-{width}.png'),animations='disabled');r.update(passed=True,teaserTitle=title,teaserNote=note,logoLoaded=True,noHorizontalOverflow=True,entryScreenshot=f'{slug}-entry-{width}.png',questionScreenshot=f'{slug}-first-question-{width}.png')
    except Exception as e:r.update(passed=False,error=str(e))
    rows.append(r);(O/'report.json').write_text(json.dumps({'at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'scope':'Additional localizedentry/teaser/firstquestion regression after companyconfigcopy changes, localimmutablefixture only; does not replace231finalresult QA','paidCalls':0,'results':rows,'allPassed':len(rows)==45 and all(x['passed'] for x in rows)},ensure_ascii=False,indent=2)+'\n');print(slug,width,r.get('passed'),r.get('error'),flush=True);await page.close()
  await browser.close()
asyncio.run(run())
