import asyncio,json,os,re,datetime
from pathlib import Path
from urllib.parse import urlsplit
from playwright.async_api import async_playwright
B=Path(__file__).resolve().parent;O=Path('/workspace/work/perfume-audit/batch2-20261115/deep-link-audit');O.mkdir(exist_ok=True);rows=[]
async def run():
 async with async_playwright() as pw:
  proxy=urlsplit(os.environ['HTTPS_PROXY']);browser=await pw.webkit.launch(executable_path='/workspace/work/perfume-worker/tools/s5/perfume-independent/webkit-user-libs.sh',headless=True,proxy={'server':f'{proxy.scheme}://{proxy.hostname}:{proxy.port}'})
  for slug in ['totap','kvapkavoni','alma','ravina']:
   facts=json.load(open(B/f'candidate-packages/{slug}/verified-products.json'))
   for product in facts['products']:
    if not product['source'].get('variantSelectionRequired'):continue
    page=await browser.new_page(ignore_https_errors=False,viewport={'width':1280,'height':900});page.set_default_timeout(5000)
    async def safe(route):
     if route.request.method!='GET' or re.search('/(cart|kosik|checkout)(/|$)',urlsplit(route.request.url).path,re.I):await route.abort()
     else:await route.continue_()
    await page.route('**/*',safe);r={'slug':slug,'id':product['id'],'url':product['url'],'at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'tlsVerified':True,'actions':'Navigation/readDOMonly, no selectorsclicked/inputs/messages/forms/cart; initialcookiebanner mayremain','expectedPack':product['volume'],'expectedPrice':product['priceAmount']}
    try:
     response=await page.goto(product['url'],wait_until='domcontentloaded',timeout=40000);await page.wait_for_timeout(1700)
     r.update(status=response.status,finalUrl=page.url,title=await page.title(),activeVariantLabels=await page.locator('a.SelectAttributeVariant.active').all_text_contents(),selectedAvailability=await page.locator('.Availability').all_text_contents(),priceInputs=await page.locator('input[name="priceId"]').evaluate_all('(es)=>es.map(e=>({type:e.type,value:e.value,checked:e.checked}))'),visiblePrices=await page.locator('[itemprop=price]').evaluate_all('(es)=>es.map(e=>({content:e.getAttribute("content"),text:e.innerText}))'),text=(await page.locator('body').inner_text())[:6500]);el=page.locator('#product-details[data-product]')
     if await el.count():
      d=json.loads(await el.get_attribute('data-product'));r['selectedPrestaShop']={k:d.get(k) for k in ['id_product','id_product_attribute','price_amount','quantity','availability_message','attributes']}
     if slug in ['totap','kvapkavoni']:r['deepLinkSelectsExpectedPack']=any(('50 ml' if slug=='totap' else '250 ml') in x for x in r['activeVariantLabels'])
     if product==facts['products'][0]:await page.screenshot(path=str(O/(slug+'-first.png')),timeout=30000,animations='disabled')
    except Exception as e:r['error']=str(e)
    rows.append(r);(O/'report.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2)+'\n');print(slug,product['id'],r.get('status'),r.get('activeVariantLabels'),r.get('deepLinkSelectsExpectedPack'),r.get('error'),flush=True);await page.close()
  await browser.close()
asyncio.run(run())
