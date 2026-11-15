import asyncio,json
from playwright.async_api import async_playwright
RULES=r'''()=>{let e=document.querySelector('[data-choice=patchouli] img'),out=[];function walk(rs){for(let r of rs){if(r.selectorText&&e.matches(r.selectorText)&&['width','min-width','max-width'].some(k=>r.style.getPropertyValue(k)))out.push({selector:r.selectorText,css:r.style.cssText});if(r.cssRules)walk(r.cssRules)}};for(let s of document.styleSheets){try{walk(s.cssRules)}catch{}}return out.slice(-12)}'''
IMAGES=r'''(es)=>es.map(e=>({src:e.getAttribute('src'),inline:e.getAttribute('style'),natural:[e.naturalWidth,e.naturalHeight],render:[e.getBoundingClientRect().width,e.getBoundingClientRect().height],style:{width:getComputedStyle(e).width,height:getComputedStyle(e).height,maxWidth:getComputedStyle(e).maxWidth,maxHeight:getComputedStyle(e).maxHeight}}))'''
async def run():
 async with async_playwright() as pw:
  b=await pw.webkit.launch(executable_path='/workspace/work/perfume-worker/tools/s5/perfume-independent/webkit-user-libs.sh',headless=True)
  p=await b.new_page(viewport={'width':390,'height':900})
  async def safe(r):
   if r.request.url.startswith('http://127.0.0.1:8971/'):await r.continue_()
   else:await r.abort()
  await p.route('**/*',safe)
  await p.goto('http://127.0.0.1:8971/__candidate/esodrogeria.html?demo=esodrogeria')
  await p.locator('[data-open="advisor"]').click()
  await p.locator('[data-choice="oil"]').click()
  await p.wait_for_timeout(700)
  print(json.dumps(await p.locator('.cx-quality-option img').evaluate_all(IMAGES)))
  print(json.dumps(await p.evaluate(RULES)))
  await p.screenshot(path='/workspace/work/perfume-audit/batch2-20261115/eso-question-inspection.png')
  await b.close()
asyncio.run(run())
