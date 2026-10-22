"""Prehliadačová kontrola novej dávky (447 € + 10 €/mes.).
Prejde všetky cesty v každom rozmere, /api/** je blokované (žiadne platené volania).
python3 tools/n447_browser_check.py --slug=black --base=http://127.0.0.1:8947 --out=DIR
"""
import json, sys, os, re
from playwright.sync_api import sync_playwright

args = dict(a[2:].split('=', 1) for a in sys.argv[1:] if a.startswith('--') and '=' in a)
SLUG, BASE, OUT = args.get('slug', 'black'), args.get('base', 'http://127.0.0.1:8947'), args.get('out', '.')
FULL = args.get('full', '1') == '1'
os.makedirs(OUT, exist_ok=True)
SIZES = [(320, 568), (390, 650), (560, 600), (1280, 800)]

PROBE = r"""() => {
  const w=document.getElementById('w'), body=document.getElementById('body');
  const q=!body.classList.contains('is-result');
  const imgs=[...w.querySelectorAll('img')].filter(i=>i.offsetParent!==null);
  const optImgs=[...body.querySelectorAll('.n447-opt img')].map(i=>i.getAttribute('src'));
  const vis=[...w.querySelectorAll('.n447-opt,.n447-pager button,#cta,#again,#back')].filter(e=>e.offsetParent!==null);
  const wr=w.getBoundingClientRect();
  const clipped=vis.filter(e=>{const r=e.getBoundingClientRect();return r.bottom>wr.bottom+1||r.right>wr.right+1||r.left<wr.left-1;}).map(e=>e.textContent.trim().slice(0,30));
  const text=w.innerText;
  return {question:q, title:(body.querySelector('h2')||{}).textContent||'', step:document.getElementById('step').textContent,
    bodyOverflow: q ? body.scrollHeight-body.clientHeight : 0,
    hScroll: document.documentElement.scrollWidth-innerWidth, clipped,
    dupPhotos: optImgs.length-new Set(optImgs).size, optCount: body.querySelectorAll('.n447-opt').length,
    badText: /undefined|NaN|\bnull\b|fallback|katalógové skóre/.test(text),
    links:[...w.querySelectorAll('a[href]')].map(a=>a.href),
    imgs: imgs.map(i=>({src:i.getAttribute('src'),ok:i.complete&&i.naturalWidth>0,local:i.getAttribute('src').startsWith('/')}))};
}"""

def main():
    from urllib.parse import urlparse
    sys.path.insert(0, os.getcwd())
    report = {'slug': SLUG, 'sizes': {}, 'apiCallsBlocked': 0, 'console': [], 'failedRequests': []}
    with sync_playwright() as p:
        br = p.chromium.launch()
        for (W, H) in SIZES:
            key = f'{W}x{H}'
            ctx = br.new_context(viewport={'width': W, 'height': H}, device_scale_factor=1)
            page = ctx.new_page()
            def block(route):
                report['apiCallsBlocked'] += 1
                route.fulfill(status=503, body='{}')
            page.route('**/api/**', block)
            page.on('console', lambda m: m.type in ('error', 'warning') and report['console'].append(f'{key}: {m.text}'[:200]))
            page.on('requestfailed', lambda r: report['failedRequests'].append(f'{key}: {r.url[:120]}'))
            page.goto(f'{BASE}/{SLUG}.html', wait_until='networkidle')
            page.wait_for_function("document.documentElement.dataset.ready==='true'")
            assert page.evaluate("document.documentElement.scrollWidth<=innerWidth"), 'landing h-scroll'
            page.screenshot(path=f'{OUT}/{key}-00-landing.png')
            page.click('#launch')
            page.wait_for_timeout(250)
            paths = page.evaluate("""async()=>{const E=await import('/n447/coffee-engine.mjs');const D=(await import('/n447/data/%s.mjs')).default;return E.allPaths(D).map(p=>p.trail.map(s=>[s.key,s.value]));}""" % SLUG)
            stats = {'paths': 0, 'screens': 0, 'issues': []}
            shots = set()
            todo = paths if FULL or W == 390 else paths[:: max(1, len(paths) // 8)]
            for trail in todo:
                page.click('#reset'); page.wait_for_timeout(60)
                for i, (k, v) in enumerate(trail):
                    settle(page)
                    pr = page.evaluate(PROBE); stats['screens'] += 1
                    check(pr, key, trail[:i], stats)
                    kind = 'budget' if k == 'budget' else 'pick' if k == 'pick' else 'first' if i == 0 else None
                    if kind and kind not in shots:
                        shots.add(kind); page.wait_for_timeout(300); page.screenshot(path=f'{OUT}/{key}-{["first","budget","pick"].index(kind)+1:02d}-{kind}.png')
                    for _ in range(6):
                        if page.locator(f'.n447-opt[data-v="{v}"]').count(): break
                        page.click('#next'); page.wait_for_timeout(30)
                    page.click(f'.n447-opt[data-v="{v}"]'); page.wait_for_timeout(200)
                settle(page)
                pr = page.evaluate(PROBE); stats['screens'] += 1
                check(pr, key, trail, stats, result=True)
                for l in pr['links']:
                    h = urlparse(l).hostname
                    if h not in ('www.black.sk', 'mojchatbot.sk'): stats['issues'].append(f'foreign link {l}')
                if 'result' not in shots:
                    shots.add('result'); page.wait_for_timeout(300); page.screenshot(path=f'{OUT}/{key}-04-result.png', full_page=False)
                    page.evaluate("document.getElementById('body').scrollTop=9999"); page.wait_for_timeout(100)
                    page.screenshot(path=f'{OUT}/{key}-05-result-bottom.png')
                stats['paths'] += 1
            # späť a zmena odpovede
            page.click('#reset'); page.wait_for_timeout(60)
            page.click('.n447-opt[data-v="filter"]'); page.wait_for_timeout(200)
            page.click('#back'); page.wait_for_timeout(100)
            assert page.evaluate("JSON.stringify(window.__N447__.state.answers)") == '{}', 'back neruší odpoveď'
            # chat
            page.click('#tabC'); page.wait_for_timeout(100)
            for qtext in ['Čo do automatu?', 'Povedz mi o gotiti', 'a koľko stojí?']:
                page.fill('#input', qtext); page.press('#input', 'Enter')
                page.wait_for_function("!window.__N447__.state.chatBusy", timeout=8000); page.wait_for_timeout(100)
            chat = page.evaluate("[...document.querySelectorAll('#log .n447-msg')].map(m=>m.innerText)")
            if 'gotiti' not in chat[-1].lower(): stats['issues'].append('chat context lost')
            if any(re.search(r'undefined|NaN|null', c) for c in chat): stats['issues'].append('chat bad text')
            if page.evaluate("document.getElementById('log').querySelectorAll('a').length") < 1: stats['issues'].append('chat no links')
            page.screenshot(path=f'{OUT}/{key}-06-chat.png')
            # zavretie a znovuotvorenie, klávesnica
            page.keyboard.press('Escape'); page.wait_for_timeout(100)
            assert not page.evaluate("document.getElementById('w').classList.contains('is-open')")
            page.focus('#launch'); page.keyboard.press('Enter'); page.wait_for_timeout(200)
            assert page.evaluate("document.getElementById('w').classList.contains('is-open')")
            report['sizes'][key] = stats
            ctx.close()
        # reload / čisté úložisko / nesprávny parameter: stále tá istá firma
        ctx = br.new_context(viewport={'width': 390, 'height': 650}); page = ctx.new_page(); page.route('**/api/**', lambda r: r.fulfill(status=503, body='{}'))
        for url in [f'{BASE}/{SLUG}.html?demo=mylo', f'{BASE}/{SLUG}.html#grain']:
            page.goto(url, wait_until='networkidle'); page.reload(wait_until='networkidle')
            assert page.evaluate("document.documentElement.dataset.demo") == SLUG, 'iná firma pri ' + url
        report['storageKeys'] = page.evaluate("Object.keys(localStorage).concat(Object.keys(sessionStorage))")
        ctx.close(); br.close()
    report['remoteImages'] = 'loaded' if not any('black.sk' in f for f in report['failedRequests']) else 'blocked-in-sandbox'
    json.dump(report, open(f'{OUT}/browser-report.json', 'w'), indent=2, ensure_ascii=False)
    issues = sum(len(s['issues']) for s in report['sizes'].values())
    print(json.dumps({k: {'paths': v['paths'], 'screens': v['screens'], 'issues': v['issues'][:5]} for k, v in report['sizes'].items()}, ensure_ascii=False))
    print('apiBlocked', report['apiCallsBlocked'], 'console', report['console'][:5], 'storage', report['storageKeys'], 'remoteImages', report['remoteImages'])
    sys.exit(1 if issues else 0)

def settle(page):
    try: page.wait_for_function("[...document.querySelectorAll('#w img')].filter(i=>i.offsetParent!==null).every(i=>i.complete)", timeout=6000)
    except Exception: pass

def check(pr, key, trail, stats, result=False):
    where = f'{key} {trail}'
    if pr['question'] and pr['bodyOverflow'] > 0: stats['issues'].append(f'scroll {pr["bodyOverflow"]}px in question {where}')
    if pr['hScroll'] > 0: stats['issues'].append(f'h-scroll {where}')
    if pr['clipped'] and pr['question']: stats['issues'].append(f'clipped {pr["clipped"]} {where}')
    if pr['dupPhotos']: stats['issues'].append(f'dup photo {where}')
    if pr['badText']: stats['issues'].append(f'bad text {where}')
    for im in pr['imgs']:
        if im['local'] and not im['ok']: stats['issues'].append(f'local image not loaded {im["src"]}')
    if result and pr['question']: stats['issues'].append(f'expected result {where}')

if __name__ == '__main__':
    main()
