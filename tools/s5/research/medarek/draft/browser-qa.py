import json
from pathlib import Path
from playwright.sync_api import sync_playwright
import os
base=os.environ.get('MEDAREK_DEMO_URL','http://127.0.0.1:8998/s5.html?demo=medarek')
photos="""()=>{const a=[...document.querySelectorAll('.cx-quality-option img')];return a.length > 0 && a.every(i=>i.complete&&i.naturalWidth>0)}"""
rows=json.loads(Path('medarek-preflight/selected-products.json').read_text())
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/tmp/chromium',args=['--no-sandbox','--single-process','--no-zygote','--disable-gpu'])
 page=b.new_page(reduced_motion='reduce')
 page.route('**/api/**',lambda route:route.fulfill(status=503,body='{}'))
 page.set_default_timeout(6000)
 for width in [320,390,1280]:
  page.set_viewport_size({'width':width,'height':850})
  for r in rows:
   page.goto(base)
   page.locator('[data-open=advisor]').click()
   cat={'sampuky':'hair','mydla':'body','balzamy':'lips'}[r['group']]
   page.wait_for_function(photos)
   page.locator(f'[data-choice="{cat}"]').click()
   page.wait_for_function(photos)
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
  page.locator('[data-restart]').click()
  page.get_by_role('button',name='Chat',exact=True).click()
  chips=page.locator('.cx-chip')
  assert chips.evaluate_all('es=>es.map(e=>Math.round(e.getBoundingClientRect().height))')==[40]*4
  page.locator('.cx-chip[data-s3-action="compare"]').click()
  options=page.locator('[data-s4-prod]')
  assert options.count()==2
  options.nth(0).click()
  options.nth(1).click()
  page.wait_for_function("()=>{const a=[...document.querySelectorAll('.s3-cmp-cols img')];return a.length===2&&a.every(i=>i.complete&&i.naturalWidth>0)}")
  print(width,len(rows),'QA results, comparison, chips',flush=True)
 b.close()
