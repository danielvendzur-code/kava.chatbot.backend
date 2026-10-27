"""Prehliadačová kontrola novej dávky v schválenom UI (izolovaná kópia coffee-jolka-app-current.js).
Prejde pokrývajúcu sadu ciest (každá odpoveď a každý výsledok; --full=1 = všetky cesty) na 4 rozmeroch; /api/** je blokované (žiadne platené volania).
python3 tools/n447_browser_check.py --slug=black --base=http://127.0.0.1:8947 --out=DIR [--compare=grain]
"""
import json, os, re, sys
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright

A = dict(x[2:].split('=', 1) for x in sys.argv[1:] if x.startswith('--') and '=' in x)
SLUG, BASE, OUT, COMPARE = A.get('slug', 'black'), A.get('base', 'http://127.0.0.1:8947'), A.get('out', '.'), A.get('compare')
SIZES = [(320, 568), (390, 650), (560, 600), (1280, 800)]
os.makedirs(OUT, exist_ok=True)

PROBE = r"""() => {
  const w = document.getElementById('widget'), adv = document.getElementById('advisor');
  const q = adv.classList.contains('is-questions');
  const opts = [...adv.querySelectorAll('.option')];
  const srcs = opts.map(o => o.querySelector('img')?.getAttribute('src')).filter(Boolean);
  const wr = w.getBoundingClientRect();
  const clipped = [...w.querySelectorAll('.option,#back,#addToCart,#restart,.mode__button')].filter(e => e.offsetParent !== null)
    .filter(e => { const r = e.getBoundingClientRect(); return r.bottom > wr.bottom + 1 || r.right > wr.right + 1 || r.left < wr.left - 1; }).map(e => e.textContent.trim().slice(0, 24));
  const txt = w.innerText;
  return {q, title: adv.querySelector('h2')?.textContent || '', values: opts.map(o => o.dataset.value),
    overflow: q ? adv.scrollHeight - adv.clientHeight : 0, hscroll: document.documentElement.scrollWidth - innerWidth,
    clipped, dup: srcs.length - new Set(srcs).size,
    tallest: Math.max(0, ...opts.map(o => o.getBoundingClientRect().height)), widgetH: wr.height,
    bad: /undefined|NaN|\bnull\b|fallback|katalógové skóre|informácie z e-shopu/.test(txt),
    foreign: /Pražírna Brno|Don Franko|donfranko|247 €|[Pp]rvý mesiac zdarma|[Pp]rvní měsíc zdarma|30 dní zdarma/.test(document.body.innerText),
    links: [...document.querySelectorAll('a[href]')].map(a => a.href),
    broken: [...w.querySelectorAll('img')].filter(i => i.offsetParent !== null && i.complete && i.naturalWidth === 0 && i.getAttribute('loading') !== 'lazy').map(i => i.getAttribute('src'))};
}"""

def settle(pg):
    # Iba obrázky vo viditeľnej ploche widgetu; lenivo načítané mimo pohľadu sa nečakajú.
    try: pg.wait_for_function("[...document.querySelectorAll('#widget img')].filter(i=>{const r=i.getBoundingClientRect();return i.offsetParent!==null&&r.bottom>0&&r.top<innerHeight}).every(i=>i.complete)", timeout=6000)
    except Exception: pass
    pg.wait_for_timeout(80)

def open_widget(pg):
    pg.click('[data-release-open="advisor"]'); pg.wait_for_timeout(450)

def choose(pg, value):
    pg.click(f'#advisor .option[data-value="{value}"]'); pg.wait_for_timeout(620)

def main():
    report = {'slug': SLUG, 'sizes': {}, 'apiBlocked': 0, 'console': [], 'storage': None}
    with sync_playwright() as p:
        br = p.chromium.launch()
        paths = None
        for W, H in SIZES:
            key = f'{W}x{H}'
            ctx = br.new_context(viewport={'width': W, 'height': H}); pg = ctx.new_page()
            def block(r):
                report['apiBlocked'] += 1; r.fulfill(status=503, body='{}')
            pg.route('**/api/**', block)
            pg.on('console', lambda m: m.type == 'error' and '503' not in m.text and report['console'].append(f'{key}: {m.text[:160]}'))
            pg.on('pageerror', lambda e: report['console'].append(f'{key}: PAGEERROR {str(e)[:200]}'))
            pg.goto(f'{BASE}/{SLUG}.html', wait_until='networkidle'); pg.wait_for_timeout(700)
            if paths is None:
                paths = pg.evaluate("() => N447Engine.allPaths(N447_DATA['%s']).map(p => p.trail.map(s => [s.key, s.value]))" % SLUG)
                shop_host = pg.evaluate("new URL(N447_DATA['%s'].brand.web).hostname" % SLUG)
                probe_name = pg.evaluate("(N447_DATA['%s'].products.find(p => p.variants && p.variants.length) || N447_DATA['%s'].products[0]).name.split('•').pop().trim()" % (SLUG, SLUG))
                report['allPaths'] = len(paths)
                if A.get('full') != '1': paths = cover(paths)
                report['testedPaths'] = len(paths)
            st = {'paths': 0, 'screens': 0, 'issues': [], 'maxOptionHeight': 0}
            open_widget(pg)
            for trail in paths:
                pg.click('#reset'); pg.wait_for_timeout(250)
                for i, (k, v) in enumerate(trail):
                    settle(pg); pr = pg.evaluate(PROBE); st['screens'] += 1
                    check(pr, st, f'{key} {trail[:i]}')
                    st['maxOptionHeight'] = max(st['maxOptionHeight'], pr['tallest'])
                    choose(pg, v)
                settle(pg); pr = pg.evaluate(PROBE); st['screens'] += 1
                check(pr, st, f'{key} {trail}', result=True)
                for l in pr['links']:
                    h = urlparse(l).hostname
                    if h not in (shop_host, 'mojchatbot.sk', '127.0.0.1') and not h.endswith('.mojchatbot.sk'):
                        st['issues'].append('foreign link ' + l)
                st['paths'] += 1
            # späť a zmena odpovede
            pg.click('#reset'); pg.wait_for_timeout(250); choose(pg, trail_first(paths)); pg.click('#back'); pg.wait_for_timeout(300)
            if pg.evaluate("document.querySelector('#stepTitle').textContent").find('Krok 1') < 0: st['issues'].append('back')
            # chat
            pg.click('.mode__button[data-mode="chat"]'); pg.wait_for_timeout(200)
            for t in ['Čo do automatu?', 'Povedz mi o ' + probe_name, 'a koľko stojí?']:
                pg.fill('#input', t); pg.press('#input', 'Enter'); pg.wait_for_timeout(5200)
            msgs = pg.evaluate("[...document.querySelectorAll('#chat .msg:not(.msg--user) .bubble')].map(b=>b.innerText)")
            if probe_name.lower() not in msgs[-1].lower(): st['issues'].append('chat context: ' + msgs[-1][:80])
            if any(re.search(r'undefined|NaN|\bnull\b', m) for m in msgs): st['issues'].append('chat bad text')
            pg.keyboard.press('Escape'); pg.wait_for_timeout(200)
            if pg.evaluate("document.getElementById('widget').classList.contains('is-open')"): st['issues'].append('escape')
            report['sizes'][key] = st
            ctx.close()
        ctx = br.new_context(viewport={'width': 390, 'height': 650}); pg = ctx.new_page(); pg.route('**/api/**', lambda r: r.fulfill(status=503, body='{}'))
        for url in [f'{BASE}/{SLUG}.html?demo=grain', f'{BASE}/{SLUG}.html#donfranko', f'{BASE}/{SLUG}.html?slug=black']:
            pg.goto(url, wait_until='networkidle'); pg.reload(wait_until='networkidle')
            assert pg.evaluate("window.COFFEE_DEMO_SLUG") == SLUG and pg.evaluate("document.body.dataset.coffeeDemo") == SLUG, url
        report['storage'] = pg.evaluate("Object.keys(localStorage).concat(Object.keys(sessionStorage))")
        ctx.close(); br.close()
    json.dump(report, open(f'{OUT}/browser-report.json', 'w'), indent=2, ensure_ascii=False)
    print(json.dumps({k: {'paths': v['paths'], 'screens': v['screens'], 'maxOptionHeight': v['maxOptionHeight'], 'issues': v['issues'][:6]} for k, v in report['sizes'].items()}, ensure_ascii=False))
    print('paths', report.get('testedPaths'), 'of', report.get('allPaths'), 'apiBlocked', report['apiBlocked'], 'console', report['console'][:5], 'storage', report['storage'])
    sys.exit(1 if any(v['issues'] for v in report['sizes'].values()) or report['console'] else 0)

def trail_first(paths): return paths[0][0][1]

def cover(paths):
    """Najmenšia (greedy) sada ciest, ktorá zvolí každú odpoveď každého kroku v každom kontexte predchádzajúcej
    odpovede a skončí na každom výslednom produkte – každá obrazovka otázky aj každý výsledok sa vykreslí aspoň raz."""
    def items(t):
        out = {('end', t[-1][1] if t else '')}
        for i, (k, v) in enumerate(t): out.add((k, v, t[i - 1][1] if i else ''))
        return out
    need = set().union(*[items(t) for t in paths]); chosen = []
    while need:
        best = max(paths, key=lambda t: len(items(t) & need)); chosen.append(best); need -= items(best)
    return chosen

def check(pr, st, where, result=False):
    if pr['q'] and pr['overflow'] > 0: st['issues'].append(f'question scroll {pr["overflow"]}px {where}')
    if pr['hscroll'] > 0: st['issues'].append('h-scroll ' + where)
    if pr['q'] and pr['clipped']: st['issues'].append(f'clipped {pr["clipped"]} {where}')
    if pr['dup']: st['issues'].append('dup photo ' + where)
    if pr['bad']: st['issues'].append('bad text ' + where)
    if pr['foreign']: st['issues'].append('foreign brand/price ' + where)
    if pr['broken']: st['issues'].append(f'broken img {pr["broken"]}')
    if pr['q'] and pr['widgetH'] and pr['tallest'] > pr['widgetH'] * 0.5: st['issues'].append(f'option taller than half widget {where}')
    if result and pr['q']: st['issues'].append('expected result ' + where)

if __name__ == '__main__':
    main()
