import asyncio,os,json
from urllib.parse import urlsplit
from playwright.async_api import async_playwright
async def main():
 async with async_playwright() as pw:
  b=await pw.webkit.launch(headless=True,executable_path='/workspace/work/perfume-worker/tools/s5/perfume-independent/webkit-user-libs.sh');p=await b.new_page(viewport={'width':390,'height':900});await p.goto('http://127.0.0.1:8961/__candidate/bookarazzi.html?demo=bookarazzi');await p.locator('[data-open=advisor]').click();await p.locator('[data-choice=fresh]').click();await p.locator('[data-choice=wind-of-change]').click();await p.locator('.s5-product').wait_for();print(await p.locator('.s5-product').evaluate('(e)=>e.outerHTML'));print(await p.evaluate('()=>[...document.querySelectorAll("#cx-widget,.cx-quality-body,.s5-product,.s5-product *")].map(e=>({tag:e.tagName,cls:e.className,sw:e.scrollWidth,cw:e.clientWidth,x:e.getBoundingClientRect().x,w:e.getBoundingClientRect().width,ws:getComputedStyle(e).whiteSpace,overflow:getComputedStyle(e).overflowX})).filter(e=>e.sw>e.cw+1||e.x<0||e.x+e.w>391)'));await b.close()
asyncio.run(main())
