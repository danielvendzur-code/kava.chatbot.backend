"""Geometry and browser rendering checks for the standalone owner-requested visual delta."""
import asyncio,json,pathlib,datetime
from playwright.async_api import async_playwright
ROOT=pathlib.Path('/workspace/work/perfume-audit/wave5-20261113/polish-geometry');ROOT.mkdir(exist_ok=True)
async def main():
 out={'at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'scope':'Own actual local WPE WebKit; no Preview or live AI; API blocked','rows':[],'complete':False}
 if (ROOT/'geometry.json').exists():out=json.loads((ROOT/'geometry.json').read_text())
 async with async_playwright() as pw:
  browser=await pw.webkit.launch(headless=True,executable_path='/workspace/work/perfume-worker/tools/s5/perfume-independent/webkit-user-libs.sh')
  for slug in ['luxparfum','atmanperfumes','hypno','bookarazzi','kintsugi','scentisimo','perfumeries1907','veelyn','parfumeur','beviro','spacefluid','vonya','essentique','fragrancesamples','alexmonhart','flakon','orion','inspirovane','leparfumlechic','vavavoom','rafinad']:
   for width in [320,390,1280]:
    if any(r['slug']==slug and r['width']==width for r in out['rows']):continue
    page=await browser.new_page(viewport={'width':width,'height':900},ignore_https_errors=False)
    page.set_default_timeout(60000)
    async def safe(route):
     if '/api/' in route.request.url:await route.fulfill(status=503,body='{"error":"offline"}',content_type='application/json')
     elif route.request.url.startswith('http://127.0.0.1:8971/'):await route.continue_()
     else:await route.abort()
    await page.route('**/*',safe)
    url='/__candidate/'+slug+'.html' if slug in ['luxparfum','atmanperfumes','hypno','bookarazzi'] else '/s5.html'
    await page.goto('http://127.0.0.1:8971'+url+'?demo='+slug,wait_until='domcontentloaded')
    await page.locator('[data-open=advisor]').first.click();await page.wait_for_function('()=>document.querySelector("#cx-widget img.cx-logo")?.complete&&document.querySelector("#cx-widget .cx-status")')
    await page.wait_for_timeout(160)
    r=await page.evaluate('''()=>{const b=document.querySelector('#cx-widget .cx-widget-brand'),l=b.querySelector('img.cx-logo'),t=b.querySelector('.cx-status'),d=t.querySelector('i'),s=getComputedStyle(l),lr=l.getBoundingClientRect(),tr=t.getBoundingClientRect(),dr=d.getBoundingClientRect(),p=x=>parseFloat(x)||0,w=lr.width-p(s.paddingLeft)-p(s.paddingRight),h=lr.height-p(s.paddingTop)-p(s.paddingBottom),scale=Math.min(w/l.naturalWidth,h/l.naturalHeight),extra=s.objectFit==='contain'?Math.max(0,(w-l.naturalWidth*scale)/2):0;return {logoLoaded:l.complete&&l.naturalWidth>0,expectedLogoContentLeft:lr.width?lr.left+p(s.paddingLeft)+extra:b.getBoundingClientRect().left,statusLeft:tr.left,dotLeft:dr.left,dotCenter:dr.top+dr.height/2,statusCenter:tr.top+tr.height/2,statusText:t.textContent.trim(),pageOverflow:document.documentElement.scrollWidth>innerWidth,maskLoaded:[...document.styleSheets].some(s=>s.href?.includes('perfume-ui-polish')),inset:b.style.getPropertyValue('--s5-status-inset')}}''')
    assert r['logoLoaded'] and r['maskLoaded'] and not r['pageOverflow'],(slug,width,r)
    assert abs(r['dotLeft']-r['expectedLogoContentLeft'])<1.1,(slug,width,r)
    assert abs(r['dotCenter']-r['statusCenter'])<1.1,(slug,width,r)
    assert r['statusText'] and 'online' in r['statusText'].lower(),(slug,width,r)
    out['rows'].append({'slug':slug,'width':width,**r})
    if slug in ['atmanperfumes','hypno','bookarazzi','kintsugi'] and width==390:await page.screenshot(path=str(ROOT/(slug+'-header-390.png')))
    (ROOT/'geometry.json').write_text(json.dumps(out,ensure_ascii=False,indent=2))
    print(slug,width,round(r['dotLeft'],2),round(r['expectedLogoContentLeft'],2),flush=True);await page.close()
  await browser.close()
 out['complete']=True;(ROOT/'geometry.json').write_text(json.dumps(out,ensure_ascii=False,indent=2))
asyncio.run(main())
