"""Check the proposed official Niche & Glow mark in an isolated config-only fixture."""
import asyncio,json,pathlib,datetime,argparse,collections
from urllib.parse import urlsplit
from PIL import Image
from playwright.async_api import async_playwright
p=argparse.ArgumentParser();p.add_argument('--output',required=True);a=p.parse_args();out=pathlib.Path(a.output);out.mkdir(parents=True,exist_ok=True);root=pathlib.Path(__file__).resolve().parents[3]
mark=root/'assets/s5/nicheandglow/mark.png';colors=collections.Counter(Image.open(mark).convert('RGB').get_flattened_data()).most_common(2)
def luminance(rgb):
 linear=[v/255/12.92 if v/255<=0.04045 else ((v/255+0.055)/1.055)**2.4 for v in rgb];return sum(w*x for w,x in zip([.2126,.7152,.0722],linear))
levels=sorted(luminance(c[0]) for c in colors);ratio=(levels[1]+.05)/(levels[0]+.05);assert ratio>=3
report={'at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'coordinatorCommit':'8a1bb74685d6b3b67fcc817d7c7c5515816360aa','scope':'Local config-only fixture changes brand.mark and logos.avatar. NOT applied to shared main or live Preview.','sourceMarkContrastRatio':ratio,'sourceMarkDominantColors':[c[0] for c in colors],'rows':[],'paidModelCalls':0,'complete':False}
async def run():
 async with async_playwright() as pw:
  browser=await pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True)
  for width in [320,390,1280]:
   page=await browser.new_page(viewport={'width':width,'height':900},reduced_motion='reduce');responses={};page.on('response',lambda r:responses.setdefault(urlsplit(r.url).path,r.status));await page.route('**/api/**',lambda r:r.fulfill(status=503,body='{}'))
   await page.goto('http://127.0.0.1:8913/__perfume_fixture/niche-avatar.html?demo=nicheandglow',wait_until='networkidle');await page.locator('[data-open="chat"]').click();await page.locator('.cx-chip').first.click();await page.locator('a.lg-wine-card').first.wait_for();await page.wait_for_timeout(650)
   assert responses.get('/assets/s5/nicheandglow/mark.png')==200;assert await page.locator('.cx-widget-brand img').get_attribute('src')=='/assets/s5/nicheandglow/logo.webp';assert await page.locator('a.lg-wine-card').first.get_attribute('href')=='https://www.nicheandglow.cz/zbozi/oraculum-helenist/'
   avatar=await page.locator('.cx-message-avatar').last.bounding_box();assert avatar and avatar['width']>=30 and avatar['height']>=30;assert not await page.evaluate('document.documentElement.scrollWidth>innerWidth')
   file=f'niche-avatar-fixed-{width}.webp';await page.screenshot(path=str(out/file),type='webp',quality=85);report['rows'].append({'width':width,'officialMark200':True,'headerWordmarkUnchanged':True,'sameProductReply':True,'avatarBox':avatar,'screenshot':file});await page.close()
  report['complete']=True;(out/'avatar-review.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');await browser.close();print(json.dumps({'viewports':len(report['rows']),'contrastRatio':ratio,'complete':True}))
asyncio.run(run())
