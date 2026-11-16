import json
from pathlib import Path
from playwright.sync_api import sync_playwright
rows=json.loads(Path('medarek-preflight/selected-products.json').read_text())
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/tmp/chromium',args=['--no-sandbox','--single-process','--no-zygote','--disable-gpu'])
 page=b.new_page(reduced_motion='reduce')
 page.set_default_timeout(6000)
 for width in [320,390,1280]:
  page.set_viewport_size({'width':width,'height':850})
  for r in rows:
   page.goto('http://127.0.0.1:8998/s5.html?demo=medarek')
   page.locator('[data-open=advisor]').click()
   cat={'sampuky':'hair','mydla':'body','balzamy':'lips'}[r['group']]
   page.locator(f'[data-choice="{cat}"]').click()
   choice=page.locator(f'[data-choice="{r["id"]}"]')
   if not choice.count():
    print('unexpected intermediate',page.locator('[data-choice]').evaluate_all('es=>es.map(e=>e.dataset.choice)'),flush=True)
   choice.click()
   card=page.locator('.s5-product')
   assert card.get_attribute('data-product-id')==r['id']
   assert r['pack'] in card.inner_text()
   assert str(int(r['priceCZK']))+' Kč' in card.inner_text()
   assert card.locator('.s5-cta').get_attribute('href')==r['url']
   page.wait_for_function("()=>document.querySelector('.s5-product img')?.naturalWidth > 0")
   assert not page.evaluate('document.documentElement.scrollWidth>innerWidth')
  print(width,len(rows),flush=True)
 b.close()
