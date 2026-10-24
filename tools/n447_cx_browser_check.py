"""n447 – prehliadačová kontrola kozmetickej ukážky v schválenom stacku (cosmetics.html kópia).
Pri každom rozmere prejde --walks ciest; pri každej otázke volí postupne rôzne odpovede (najmenej použitú), takže sa vyskúša
každá odpoveď. Kontroluje: vodorovné posúvanie, orezané ovládanie, rozbité obrázky, cudziu cenu/trial, chyby JS, cudzie odkazy,
a pri rozpočte, že „Celkem za doporučenou sestavu“ ≤ zvolený limit. /api/** je blokované (0 platených volaní).
python3 tools/n447_cx_browser_check.py --slug=saloos --out=DIR [--walks=14]"""
import json, os, re, sys
from collections import Counter
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright
A = dict(x[2:].split('=', 1) for x in sys.argv[1:] if x.startswith('--') and '=' in x)
SLUG, BASE, OUT, WALKS = A['slug'], A.get('base', 'http://127.0.0.1:8947'), A.get('out', '.'), int(A.get('walks', '14'))
SIZES = [(320, 568), (390, 650), (560, 600), (1280, 800)]
os.makedirs(OUT, exist_ok=True)
PROBE = r"""() => { const w = document.querySelector('#cx-widget'); const r = w.getBoundingClientRect();
  const st = document.querySelector('.cx-catalogue-stage');
  const clipped = [...w.querySelectorAll('.cx-catalogue-option, button')].filter(e => e.offsetParent !== null && e.closest('#cx-widget'))
    .filter(e => { const b = e.getBoundingClientRect(); return b.right > r.right + 1 || b.left < r.left - 1; }).map(e => e.textContent.trim().slice(0, 30));
  return {hscroll: document.documentElement.scrollWidth - innerWidth, clipped,
    broken: [...w.querySelectorAll('img')].filter(i => i.offsetParent !== null && i.complete && i.naturalWidth === 0).map(i => i.getAttribute('src')),
    text: st ? st.innerText : '', title: (st && st.querySelector('h2,h3')) ? st.querySelector('h2,h3').textContent.trim() : '',
    options: [...document.querySelectorAll('.cx-catalogue-option')].map(o => o.innerText.replace(/\s+/g, ' ').trim()),
    links: [...w.querySelectorAll('a[href]')].map(a => a.href), body: document.body.innerText}; }"""
def money(s):
    m = re.search(r'(\d[\d\s ]*)\s*(Kč|€)', s); return int(re.sub(r'\D', '', m.group(1))) if m else None
def main():
    report = {'slug': SLUG, 'sizes': {}, 'console': []}
    with sync_playwright() as p:
        br = p.chromium.launch()
        for W, H in SIZES:
            key = f'{W}x{H}'; st = {'walks': 0, 'screens': 0, 'results': 0, 'budgetChecks': 0, 'issues': []}; used = Counter()
            ctx = br.new_context(viewport={'width': W, 'height': H}); pg = ctx.new_page()
            pg.route('**/api/**', lambda r: r.fulfill(status=503, body='{}'))
            pg.on('pageerror', lambda e: report['console'].append(f'{key}: PAGEERROR {str(e)[:200]}'))
            pg.goto(f'{BASE}/{SLUG}.html', wait_until='networkidle'); pg.wait_for_timeout(900)
            body = pg.inner_text('body')
            if re.search(r'247\s*€|měsíc zdarma|mesiac zdarma|História konverzácií|Historie konverzací', body): st['issues'].append('owner: stará ponuka')
            if '447' not in body: st['issues'].append('owner: chýba 447 €')
            shop = urlparse(pg.evaluate(f"window.COSMETICS_DEMOS.brands['{SLUG}'].website")).hostname.replace('www.', '')
            pg.click('#cx-open'); pg.wait_for_timeout(800)
            for wk in range(WALKS):
                start = pg.query_selector('text=Najít vhodný produkt') or pg.query_selector('text=Nájsť vhodný produkt')
                if start: start.click()
                else:
                    again = pg.query_selector('text=Vybrat znovu') or pg.query_selector('text=Vybrať znovu')
                    if again: again.click()
                pg.wait_for_timeout(700); budget = None; trail = []
                for step in range(9):
                    pg.wait_for_timeout(500); pr = pg.evaluate(PROBE); st['screens'] += 1
                    where = f'{key} {trail}'
                    if pr['hscroll'] > 1: st['issues'].append(f'hscroll {pr["hscroll"]} {where}')
                    if pr['clipped']: st['issues'].append(f'clipped {pr["clipped"][:2]} {where}')
                    if pr['broken']: st['issues'].append(f'broken img {pr["broken"][:1]} {where}')
                    if re.search(r'undefined|NaN|\bnull\b', pr['text']): st['issues'].append(f'bad text {where}')
                    for l in pr['links']:
                        h = urlparse(l).hostname or ''
                        if h and h.replace('www.', '') not in (shop, 'mojchatbot.sk', '127.0.0.1') and not h.endswith('.mojchatbot.sk'): st['issues'].append('foreign link ' + l)
                    opts = pg.query_selector_all('.cx-catalogue-option')
                    if not opts:
                        st['results'] += 1
                        tot = re.search(r'Celkem za doporučenou sestavu:\s*([\d\s ]+)\s*Kč|Spolu za odporúčanú zostavu:\s*([\d\s ,]+)\s*(?:€|Kč)', pr['text'])
                        if budget and tot:
                            st['budgetChecks'] += 1
                            total = int(re.sub(r'\D', '', tot.group(1) or tot.group(2)))
                            if total > budget: st['issues'].append(f'rozpočet {total} > {budget} {where}')
                        break
                    k = min(range(len(opts)), key=lambda i: used[(pr['title'], i)]); used[(pr['title'], k)] += 1
                    label = pr['options'][k] if k < len(pr['options']) else ''
                    if re.search(r'rozpočet|Rozpočet', pr['title']) and re.match(r'Do ', label): budget = money(label)
                    trail.append(label[:22]); opts[k].click()
                st['walks'] += 1
                back = pg.query_selector('text=Vybrat znovu') or pg.query_selector('text=Vybrať znovu')
                if back: back.click(); pg.wait_for_timeout(500)
            report['sizes'][key] = st; ctx.close()
        br.close()
    json.dump(report, open(f'{OUT}/cx-browser-report.json', 'w'), indent=2, ensure_ascii=False)
    print(json.dumps({k: {x: v[x] for x in ('walks', 'screens', 'results', 'budgetChecks')} | {'issues': v['issues'][:5]} for k, v in report['sizes'].items()}, ensure_ascii=False))
    print('console', report['console'][:5])
    sys.exit(1 if any(v['issues'] for v in report['sizes'].values()) or report['console'] else 0)
main()
