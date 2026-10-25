"""n447 – kontrola samostatného odovzdávacieho balíka jednej firmy (lokálne, bez platených volaní).
1) staticky: manifest hashov, žiadne .env/poverenia/register/e-mailové koncepty/nástroje, žiadne URL cudzích obchodov,
   žiadne obrázky cudzích značiek; zvyšky identifikátorov starých značiek v zdieľanom kóde sa vypíšu (nie sú to dáta);
2) HTTP: vlastná stránka 200; stránky, dáta a logá iných ukážok, privátne cesty a staré API → 404; API s inou firmou → 400;
3) prehliadač 390×844 a 1280×800: jeden celý priechod výberom (vždy prvá možnosť) a lokálne simulovaný chat
   (server bez kľúča, odchádzajúce volania blokované) – bez chýb JS, bez rozbitých požiadaviek, iba vlastné hosty, bez cudzej značky v texte.
python3 tools/n447_bundle_check.py --slug=verticcio --bundles=DIR --out=QA_DIR [--port=8990]"""
import hashlib, json, os, re, subprocess, sys, time, urllib.request, urllib.error
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright

A = dict(x[2:].split('=', 1) for x in sys.argv[1:] if x.startswith('--') and '=' in x)
SLUG, BUNDLES, OUT, PORT = A['slug'], A['bundles'], A['out'], int(A.get('port', '8990'))
ROOT = os.getcwd()
B = os.path.join(BUNDLES, SLUG)
MAN = json.load(open(os.path.join(BUNDLES, SLUG + '.manifest.json')))
FAM = MAN['family']
os.makedirs(OUT, exist_ok=True)
BASE = f'http://127.0.0.1:{PORT}'
rep = {'slug': SLUG, 'family': FAM, 'builtFrom': MAN.get('builtFrom'), 'static': {}, 'http': {}, 'browser': {}, 'fail': []}
fail = rep['fail'].append
COFFEE = ['black', 'verticcio', 'rebelbean', 'nordbeans', 'doubleshot', 'fathers', 'candycane', '9gramscoffee']
COSM = ['saloos', 'renovality', 'nobilistilia', 'manufaktura']
OTHERS = [x for x in COFFEE + COSM if x != SLUG]
FOREIGN = MAN['foreignTokens']
OWN_ALIASES = {'nobilistilia': ['nobilis', 'nobilis tilia'], 'fathers': ["father's", 'fathers'], '9gramscoffee': ['9 grams', 'coffeeart', 'costadoro']}.get(SLUG, [])

# ---------- 1) staticky
listed = {f['path']: f for f in MAN['files']}
actual = set()
for d, _, fs_ in os.walk(B):
    for f in fs_: actual.add(os.path.relpath(os.path.join(d, f), B).replace(os.sep, '/'))
if actual != set(listed): fail(f'manifest nesedí so súbormi: navyše {sorted(actual - set(listed))[:5]}, chýba {sorted(set(listed) - actual)[:5]}')
for p, f in listed.items():
    if p in actual and hashlib.sha256(open(os.path.join(B, p), 'rb').read()).hexdigest() != f['sha256']: fail('hash nesedí ' + p)
bad_names = [p for p in actual if re.search(r'(^|/)\.env|(^|/)\.git|\.md$|(^|/)tools/|stav\.(json|md)$|email-|secret|credential|\.pem$|\.key$|id_rsa', p, re.I)]
if bad_names: fail(f'zakázané súbory: {bad_names}')
texts = {p: open(os.path.join(B, p), encoding='utf-8', errors='ignore').read() for p in actual if re.search(r'\.(js|mjs|css|html|json|txt|svg)$', p)}
secret = [p for p, t in texts.items() if re.search(r'sk-ant-[A-Za-z0-9_-]{10,}|-----BEGIN [A-Z ]*PRIVATE KEY|ANTHROPIC_API_KEY\s*=\s*["\']?[A-Za-z0-9]', t)]
if secret: fail(f'možné poverenie v súboroch {secret}')
# vlastné hosty: e-shop firmy a jeho obrázkové servery (z dát firmy), mojchatbot.sk; technické menné priestory/API
def host(u):
    try: return (urlparse(u).hostname or '').lower()
    except Exception: return ''
data_file = f'n447/data/{SLUG}.js' if FAM == 'coffee' else f'n447/kozmetika/catalogues/{SLUG}.js'
brand_file = None if FAM == 'coffee' else f'n447/kozmetika/brands/{SLUG}.js'
own_hosts = set()
for p in [data_file, brand_file, f'{SLUG}.html']:
    if p: own_hosts |= {host(u) for u in re.findall(r'https?://[^\s"\'<>)\\]+', texts.get(p, ''))}
own_root = {'.'.join(h.split('.')[-2:]) for h in own_hosts if h}
TECH = {'www.w3.org', 'w3.org', 'openapi.vercel.sh', 'api.anthropic.com', 'mojchatbot.sk', 'www.mojchatbot.sk', 'schema.org', 'cdn.myshoptet.com'}
foreign_urls = {}
for p, t in texts.items():
    for u in re.findall(r'https?://[A-Za-z0-9.-]+[^\s"\'<>)\\]*', t):
        h = host(u)
        if not h or h in TECH or h.endswith('.mojchatbot.sk') or '.'.join(h.split('.')[-2:]) in own_root or '$' in u or '{' in u: continue
        if h == 'cdn.myshoptet.com': continue
        foreign_urls.setdefault(p, set()).add(h)
rep['static']['otherHosts'] = {p: sorted(v) for p, v in foreign_urls.items()}
known_shop_hosts = [h for v in foreign_urls.values() for h in v if any(t in h.replace('-', '').replace('.', ' ').split() or t in h for t in FOREIGN)]
if known_shop_hosts: fail(f'URL cudzieho obchodu v balíku: {sorted(set(known_shop_hosts))[:8]}')
# myshoptet CDN zdieľa viac obchodov – povolené iba cesty vlastného obchodu
for p, t in texts.items():
    for u in re.findall(r'https?://cdn\.myshoptet\.com/usr/([^/"\']+)/', t):
        if '.'.join(u.split('.')[-2:]) not in own_root: fail(f'CDN cudzieho Shoptet obchodu {u} v {p}')
foreign_img = [p for p in actual if re.search(r'\.(png|jpe?g|webp|svg|gif|avif)$', p) and not p.startswith(f'assets/{SLUG}/') and not p.startswith(f'assets/n447-kozmetika/{SLUG}/') and (any(p.startswith(f'assets/{o}/') or p.startswith(f'assets/n447-kozmetika/{o}/') for o in OTHERS)
               or any(re.search(rf'(^|[/_.-]){re.escape(t)}([/_.-]|$)', p, re.I) for t in FOREIGN))]
if foreign_img: fail(f'obrázky cudzích značiek: {foreign_img[:6]}')
own_files = [f'{SLUG}.html']  # dáta firmy: názvy jej produktov sa môžu zhodovať so slovom (napr. „Yellow Diamonds“); cudzie obchody v nich stráži kontrola URL
own_files += ([brand_file] if brand_file else []) + ([f'n447/{SLUG}-jolka-theme.css'] if FAM == 'coffee' else [])
residue = {}
for p, t in texts.items():
    low = t.lower()
    if p in own_files and p.endswith('.html'): low = re.sub(r'(src|href)="[^"]*"', '', low)  # názvy súborov schváleného stacku nie sú text stránky
    hits = sorted({tok for tok in FOREIGN if re.search(rf'(?<![a-z0-9]){re.escape(tok)}(?![a-z0-9])', low)} - set(OWN_ALIASES))
    if hits:
        residue[p] = hits
        if p in own_files: fail(f'cudzia značka vo vlastnom súbore {p}: {hits}')
rep['static']['sharedCodeIdentifiers'] = residue
rep['static']['files'] = len(actual); rep['static']['bytes'] = MAN['totalBytes']; rep['static']['excludedForeignAssets'] = MAN.get('excludedForeignAssets', [])

# ---------- server
stats_file = os.path.join(OUT, f'{SLUG}-server-stats.json')
env = {k: v for k, v in os.environ.items() if k != 'ANTHROPIC_API_KEY'}
srv = subprocess.Popen(['node', os.path.join(ROOT, 'tools/n447-bundle-serve.mjs'), f'--dir={B}', f'--port={PORT}', f'--stats={stats_file}'], cwd=OUT, env=env, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
for _ in range(50):
    try: urllib.request.urlopen(BASE + '/', timeout=2); break
    except Exception: time.sleep(0.2)

def req(path, body=None):
    r = urllib.request.Request(BASE + path, data=None if body is None else json.dumps(body).encode(), headers={'Content-Type': 'application/json'}, method='GET' if body is None else 'POST')
    try:
        with urllib.request.urlopen(r, timeout=30) as x: return x.status, x.read().decode('utf-8', 'ignore')
    except urllib.error.HTTPError as e: return e.code, e.read().decode('utf-8', 'ignore')

try:
    # ---------- 2) HTTP
    h = rep['http']
    for p in ['/', f'/{SLUG}.html']:
        c, _ = req(p); h[p] = c
        if c != 200: fail(f'{p} → {c}')
    probes = sorted({f'/{f}' for f in os.listdir(ROOT) if f.endswith('.html') and f not in (f'{SLUG}.html', 'index.html')})
    c, idx = req('/index.html'); c2, own = req(f'/{SLUG}.html')
    if c != 200 or idx != own: fail('/index.html nie je kópia vlastnej stránky')
    for o in OTHERS:
        probes += [f'/{o}.html', f'/n447/data/{o}.js', f'/n447/kozmetika/catalogues/{o}.js', f'/n447/kozmetika/brands/{o}.js', f'/assets/{o}/logo.png', f'/assets/n447-kozmetika/{o}/logo.png', f'/n447/{o}-jolka-theme.css', f'/n447/email-{o}.md']
    probes += ['/.env', '/.env.local', '/.env.production', '/n447/stav.json', '/n447/stav.md', f'/n447/email-{SLUG}.md', '/tools/n447-stav.mjs', '/tools/n447-bundle.mjs', '/.git/config', '/vercel.json.bak',
               '/api/ai-chat.js', '/api/cosmetics-chat-447.js' if FAM == 'coffee' else '/api/chat-447.js', '/catalogue-data.js', '/coffee-owner-brand.js', '/cosmetics.html', '/ukazky.html', '/kozmetika/mylo', '/ukazka/grain',
               '/assets/cosmetics/kvitok-logo.png', '/assets/cosmetics/modrapupava-logo.png', '/assets/grain/logo.png', f'/{SLUG}.manifest.json', '/n447-manifest.json']
    open_ = {p: c for p in sorted(set(probes)) for c, _ in [req(p)] if c != 404}
    h['probes'] = len(set(probes)); h['notBlocked'] = open_
    if open_: fail(f'dostupné cudzie/privátne cesty: {open_}')
    for old in ['/api/chat', '/api/cosmetics-chat', '/api/ai-chat', '/api/chat-447' if FAM == 'cosmetics' else '/api/cosmetics-chat-447']:
        c, _ = req(old, {'demoId': SLUG, 'messages': [{'role': 'user', 'content': 'ahoj'}]})
        h['POST ' + old] = c
        if c != 404: fail(f'POST {old} → {c} (má byť 404)')
    api = '/api/chat-447' if FAM == 'coffee' else '/api/cosmetics-chat-447'
    other_api = {}
    for o in OTHERS + ['grain', 'mylo', 'donfranko', '']:
        c, b = req(api, {'demoId': o, 'messages': [{'role': 'user', 'content': 'Co mi doporučíte?'}]})
        if c != 400: other_api[o] = c
    h['otherDemoIdsRejected'] = len(OTHERS) + 4 - len(other_api)
    if other_api: fail(f'API prijalo cudziu firmu: {other_api}')
    c, b = req(api, {'demoId': SLUG, 'messages': [{'role': 'user', 'content': 'Co mi doporučíte?'}]})
    h['ownApi'] = c
    if c != 200 or not json.loads(b).get('reply'): fail(f'vlastné API → {c} {b[:120]}')

    # ---------- 3) prehliadač
    with sync_playwright() as pw:
        br = pw.chromium.launch()
        for W, H in [(390, 844), (1280, 800)]:
            key = f'{W}x{H}'; r = {'requests': 0, 'hosts': set(), 'failed': [], 'errors': [], 'trail': []}
            ctx = br.new_context(viewport={'width': W, 'height': H}); pg = ctx.new_page()
            def on_resp(x, r=r):
                r['requests'] += 1; hs = host(x.url); r['hosts'].add(hs)
                if hs == '127.0.0.1' and x.status >= 400: r['failed'].append(f'{x.status} {urlparse(x.url).path}')
            pg.on('response', on_resp)
            pg.on('requestfailed', lambda x, r=r: r['failed'].append('FAILED ' + x.url[:120]) if host(x.url) == '127.0.0.1' else None)
            pg.on('pageerror', lambda e, r=r: r['errors'].append(str(e)[:200]))
            pg.on('console', lambda m, r=r: m.type == 'error' and r['errors'].append('console: ' + m.text[:160]))
            pg.goto(BASE + '/', wait_until='networkidle'); pg.wait_for_timeout(900)
            if FAM == 'coffee':
                pg.click('[data-release-open="advisor"]'); pg.wait_for_timeout(500)
                for _ in range(14):
                    if not pg.evaluate("document.getElementById('advisor').classList.contains('is-questions')"): break
                    o = pg.query_selector('#advisor .option'); r['trail'].append((o.inner_text() or '').split('\n')[0][:30]); o.click(); pg.wait_for_timeout(650)
                r['resultShown'] = not pg.evaluate("document.getElementById('advisor').classList.contains('is-questions')")
                r['result'] = pg.inner_text('#advisor')[:400]
                cta = pg.evaluate("(() => { const a = document.getElementById('addToCart'); return a ? {tag: a.tagName, target: a.getAttribute('target'), href: a.href, text: a.innerText.trim()} : null; })()")
                r['cta'] = cta
                if not cta or cta['tag'] != 'A' or cta['target'] or not re.match(r'Zobraziť túto kávu|Zobrazit tuto kávu|Zobraziť tento produkt|Zobrazit tento produkt', cta['text']) or '.'.join(host(cta['href']).split('.')[-2:]) not in own_root:
                    fail(f'{key}: hlavné CTA {cta}')
                pg.screenshot(path=os.path.join(OUT, f'{SLUG}-{key}-vysledok.png'))
                pg.click('.mode__button[data-mode="chat"]'); pg.wait_for_timeout(500)
                r['chips'] = [c.inner_text() for c in pg.query_selector_all('#chips .chip') if c.is_visible()]
                n0 = pg.evaluate("document.querySelectorAll('#chat .bubble:not(.typing)').length")
                pg.fill('#input', 'Jakou kávu na espresso doporučíte?' if 'Kč' in r['result'] else 'Akú kávu na espresso odporúčate?'); pg.click('#composer .send')
                pg.wait_for_function(f"document.querySelectorAll('#chat .bubble:not(.typing)').length >= {n0 + 2}", timeout=15000)
                r['chatReply'] = pg.evaluate("[...document.querySelectorAll('#chat .bubble:not(.typing)')].at(-1).innerText")[:300]
            else:
                pg.click('#cx-open'); pg.wait_for_timeout(800)
                s = pg.query_selector('text=Najít vhodný produkt') or pg.query_selector('text=Nájsť vhodný produkt'); s.click(); pg.wait_for_timeout(700)
                for _ in range(10):
                    o = pg.query_selector_all('.cx-catalogue-option')
                    if not o: break
                    r['trail'].append(o[0].inner_text().split('\n')[0][:30]); o[0].click(); pg.wait_for_timeout(650)
                r['result'] = pg.inner_text('.cx-catalogue-stage')[:400]; r['resultShown'] = bool(re.search(r'Zobrazit produkt|Zobraziť produkt', r['result']))
                pg.screenshot(path=os.path.join(OUT, f'{SLUG}-{key}-vysledok.png'))
                ask = pg.query_selector('text=Zeptat se poradce') or pg.query_selector('text=Opýtať sa poradcu')
                if ask: ask.click()
                else: pg.click('.cx-mode button[data-mode="chat"]')
                pg.wait_for_timeout(500)
                r['chips'] = [c.inner_text() for c in pg.query_selector_all('.cx-chip') if c.is_visible()]
                n0 = pg.evaluate("document.querySelectorAll('.cx-message').length")
                pg.fill('#cx-input', 'Co doporučíte na suchou pleť?' if 'Kč' in r['result'] else 'Čo odporúčate na suchú pleť?'); pg.press('#cx-input', 'Enter')
                pg.wait_for_function(f"document.querySelectorAll('.cx-message').length >= {n0 + 2} && !document.querySelector('.cx-typing,.is-typing')", timeout=15000)
                pg.wait_for_timeout(400)
                r['chatReply'] = pg.evaluate("[...document.querySelectorAll('.cx-message')].at(-1).innerText")[:300]
            pg.screenshot(path=os.path.join(OUT, f'{SLUG}-{key}-chat.png'))
            body = pg.inner_text('body')
            low = body.lower()
            for nm in sorted(set(re.findall(r'"name": ?"([^"]+)"', texts.get(data_file, ''))), key=len, reverse=True): low = low.replace(nm.lower(), ' ')
            r['foreignInText'] = sorted({t for t in FOREIGN + ['don franko', 'pražírna brno', 'modrá púpava', 'barbora lori'] if t not in OWN_ALIASES and re.search(rf'(?<![a-z0-9]){re.escape(t)}(?![a-z0-9])', low)})
            r['oldOffer'] = bool(re.search(r'247\s*€|mesiac zdarma|měsíc zdarma|30 dní zdarma|riadkom kódu|řádkem kódu|overenie vašich|ověření vašich', body))
            if len(r.get('chips', [])) != 4: fail(f'{key}: rýchle voľby chatu {r.get("chips")}')
            r['has447'] = '447' in body
            ext = sorted(hh for hh in r['hosts'] if hh and hh != '127.0.0.1')
            r['externalHosts'] = ext
            bad_ext = [hh for hh in ext if '.'.join(hh.split('.')[-2:]) not in own_root and hh != 'cdn.myshoptet.com']
            for k, ok in [('resultShown', r['resultShown']), ('chatReply', bool(r.get('chatReply'))), ('no JS errors', not r['errors']), ('no failed local requests', not r['failed']),
                          ('no foreign brand text', not r['foreignInText']), ('no old offer', not r['oldOffer']), ('447 shown', r['has447']), ('only own external hosts', not bad_ext)]:
                if not ok: fail(f'{key}: {k} – {r.get("errors") if k == "no JS errors" else r.get("failed") if "failed" in k else r.get("foreignInText") if "foreign" in k else bad_ext if "hosts" in k else ""}')
            r['hosts'] = sorted(r['hosts']); rep['browser'][key] = r; ctx.close()
        br.close()
finally:
    srv.terminate()
    try: srv.wait(5)
    except Exception: srv.kill()
st = json.load(open(stats_file)) if os.path.exists(stats_file) else {}
rep['server'] = st
if st.get('outboundBlocked'): fail(f'odchádzajúce volania z API: {st["outboundHosts"]}')
rep['paidCalls'] = 0
json.dump(rep, open(os.path.join(OUT, f'{SLUG}-bundle-qa.json'), 'w'), ensure_ascii=False, indent=1, default=list)
print(json.dumps({'slug': SLUG, 'files': rep['static']['files'], 'probes404': rep['http'].get('probes'), 'otherIdsRejected': rep['http'].get('otherDemoIdsRejected'),
                  'browser': {k: {'trail': len(v['trail']), 'result': v['resultShown'], 'chat': bool(v.get('chatReply')), 'ext': v['externalHosts']} for k, v in rep['browser'].items()},
                  'outbound': st.get('outboundBlocked'), 'fail': rep['fail'][:8]}, ensure_ascii=False))
sys.exit(1 if rep['fail'] else 0)
