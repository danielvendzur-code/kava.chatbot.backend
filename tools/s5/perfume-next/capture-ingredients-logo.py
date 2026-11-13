"""Capture the official rendered header wordmark; no invented brand artwork."""
import asyncio,os,pathlib,json,datetime
from urllib.parse import urlsplit
from playwright.async_api import async_playwright
OUT=pathlib.Path(__file__).resolve().parent/'candidate-packages/ingredients/assets'
async def main():
 async with async_playwright() as pw:
  px=urlsplit(os.environ['HTTPS_PROXY']);b=await pw.webkit.launch(headless=True,executable_path='/workspace/work/perfume-worker/tools/s5/perfume-independent/webkit-user-libs.sh',proxy={'server':f'{px.scheme}://{px.hostname}:{px.port}'})
  page=await b.new_page(ignore_https_errors=False,viewport={'width':1280,'height':900},device_scale_factor=4)
  await page.route('**/*',lambda route:route.abort() if route.request.method!='GET' else route.continue_())
  await page.goto('https://www.ingredients-store.com/',wait_until='domcontentloaded');await page.evaluate('document.fonts.ready');prefs=page.get_by_text('Nastavení preferencí',exact=True)
  if await prefs.count() and await prefs.first.is_visible():
   await prefs.first.click()
   for box in await page.locator('input.gc-Switch-input').all():
    if await box.is_checked():await box.uncheck()
   await page.get_by_text('Povolit vybrané',exact=True).click();await page.wait_for_timeout(1200)
  logo=page.locator('a.Logo--desktop');await logo.wait_for(state='visible');await logo.screenshot(path=str(OUT/'logo.png'),omit_background=True)
  (OUT.parent/'logo-capture.json').write_text(json.dumps({'url':page.url,'selector':'a.Logo--desktop','at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'method':'Official visible header wordmark DOM screenshot at4x resolution. Not synthesized artwork. No interactions or forms.','tlsVerification':True},indent=2)+'\n');await b.close()
asyncio.run(main())
