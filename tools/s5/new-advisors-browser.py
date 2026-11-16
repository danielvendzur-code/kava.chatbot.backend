import json
import os
from pathlib import Path
from urllib.parse import urlencode
from playwright.sync_api import sync_playwright

root = Path(__file__).resolve().parents[2]
base = os.getenv('ADVISOR_QA_BASE', 'http://127.0.0.1:8998/s5.html')
output = Path(os.getenv('ADVISOR_QA_OUTPUT', '/tmp/s5-advisor-qa'))
output.mkdir(parents=True, exist_ok=True)
browser_path = os.getenv('ADVISOR_QA_CHROMIUM', '/tmp/chromium')
demos = os.getenv('ADVISOR_QA_DEMOS', 'dvoukocek,mydlarnaerde,meetea').split(',')
proxy = {'server': os.environ['HTTPS_PROXY']} if os.getenv('ADVISOR_QA_PROXY') == '1' else None
photos_ready = """() => {
  const images = [...document.querySelectorAll('.cx-quality-option img')];
  return images.length > 0 && images.every(img => img.complete && img.naturalWidth > 0);
}"""

with sync_playwright() as runtime:
    browser = runtime.chromium.launch(executable_path=browser_path, proxy=proxy,
        args=['--no-sandbox','--single-process','--no-zygote','--disable-gpu','--ignore-certificate-errors'])
    page = browser.new_page(reduced_motion='reduce')
    page.set_default_timeout(25000)
    page.route('**/api/**', lambda route: route.fulfill(status=503, body='{}'))
    for slug in demos:
        content = (root / 'catalogues' / (slug + '.js')).read_text().split(' = ', 1)[1]
        products = json.JSONDecoder().raw_decode(content.lstrip())[0]['products']
        report = []
        for width in (320, 390, 1280):
            page.set_viewport_size({'width': width, 'height': 850})
            page.goto(base + '?' + urlencode({'demo': slug}), wait_until='domcontentloaded')
            page.wait_for_function("() => document.querySelector('#cosmetics-root')?.getAttribute('aria-busy') === null")
            page.screenshot(path=str(output / f'{slug}-{width}-landing.png'))
            page.locator('[data-open=advisor]').click()
            for product in products:
                traits = product['source']['selectionTraits']
                path = [traits.get('careUse', product['category']), traits['careVariant']]
                if slug == 'dvoukocek' and product['category'] == 'hair':
                    path.insert(1, 'dryHair' if 'suche' in product['id'] else 'oilyHair')
                if slug == 'mydlarnaerde' and product['category'] == 'body':
                    path.insert(1, 'specificArea' if 'intimni' in product['id'] else 'cleansingCare')
                for key in path:
                    if page.locator('.s5-product').count():
                        break
                    option = page.locator(f'[data-choice="{key}"]')
                    page.wait_for_function(photos_ready)
                    while not option.count():
                        next_page = page.locator('[data-page-next]')
                        assert next_page.count(), (slug,product['id'],key,page.locator('[data-choice]').evaluate_all('nodes=>nodes.map(el=>el.dataset.choice)'))
                        next_page.click()
                        page.wait_for_function(photos_ready)
                    if product == products[0] and key == path[-1]:
                        page.screenshot(path=str(output / f'{slug}-{width}-question.png'))
                    option.click()
                card = page.locator('.s5-product')
                assert card.get_attribute('data-product-id') == product['id']
                assert product['price'] in card.inner_text()
                assert product['volume'] in card.inner_text()
                assert card.locator('.s5-cta').get_attribute('href') == product['url']
                page.wait_for_function("() => {const image = document.querySelector('.s5-product img'); return image?.complete && image.naturalWidth > 0;}")
                assert not page.evaluate('document.documentElement.scrollWidth > innerWidth')
                if product == products[0]:
                    card.locator('img').evaluate('img => img.decode()')
                    page.wait_for_timeout(360)
                    page.screenshot(path=str(output / f'{slug}-{width}-result.png'))
                report.append({'width':width, 'id':product['id'], 'price':product['price'],
                    'pack':product['volume'], 'url':product['url'], 'photoLoaded':True})
                page.locator('[data-restart]').click()
            page.get_by_role('button', name='Chat', exact=True).click()
            assert page.locator('.cx-chip').evaluate_all('nodes => nodes.map(el => Math.round(el.getBoundingClientRect().height))') == [40]*4
            page.locator('.cx-chip[data-s3-action="compare"]').click()
            options = page.locator('[data-s4-prod]')
            assert options.count() == 2
            options.nth(0).click()
            options.nth(1).click()
            page.wait_for_function("""() => {const images = [...document.querySelectorAll('.s3-cmp-cols img')];
                return images.length === 2 && images.every(img => img.complete && img.naturalWidth > 0);}""")
            page.screenshot(path=str(output / f'{slug}-{width}-comparison.png'))
            print(slug, width, len(products), 'results and comparison', flush=True)
        (output / f'{slug}.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    browser.close()
