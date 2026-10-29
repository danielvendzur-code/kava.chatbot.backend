"""k2 – zapíše ukážku dávky 2 z overeného katalógu a nastavení značky.
python3 -I tools/k2/write_demo.py tools/k2/brands/SLUG.json CATALOGUE.json
Výstup: n447/kozmetika2/catalogues/SLUG.js, n447/kozmetika2/brands/SLUG.js, SLUG.html, záznam v api/cosmetics-chat-447b.js."""
import sys, json, re, os

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
cfg = json.load(open(sys.argv[1]))
products = json.load(open(sys.argv[2]))
slug, cs = cfg['slug'], cfg.get('lang') == 'cs'
ids = {p['id'] for p in products}
for d in cfg.get('addons', []):
    missing = [i for i in d['ids'] if i not in ids]
    assert not missing, ('addon chýba v katalógu', missing)
hero = next((p for p in products if p['id'] == cfg.get('heroProductId')), None)
assert hero, 'heroProductId'
for p in products:
    for c in (p.get('set') or {}).get('contains', []):
        assert c in ids, ('sada obsahuje neznámy produkt', p['id'], c)

def for_chat(p):
    """Katalóg pre chat: sady pod 'sets', typ pleti/vlasov z overeného zaradenia (cfg.chatTags), dôkaz ako objekt."""
    q = json.loads(json.dumps(p))
    if q.get('set'):
        q['category'] = 'sets'
    tags, ev = set(q.get('tags') or []), {}
    for key, mapping in (cfg.get('chatTags') or {}).items():
        vals = (q.get('facets') or {}).get(key)
        for v in (vals if isinstance(vals, list) else [vals] if vals else []):
            for t in mapping.get(v, []):
                tags.add(t); ev[t] = (q['source'].get('suitabilityEvidence') or key + '=' + v)
    if tags:
        q['tags'] = sorted(tags); q['source']['suitabilityEvidence'] = ev or {t: True for t in tags}
    return q


chat_products = [for_chat(p) for p in products if p.get('role') != 'addon']
catalogue = {'verifiedAt': cfg.get('verifiedAt', '2026-10-29T10:00:00Z'), 'source': cfg['shopUrl'], 'collectionMethod': cfg.get('collectionMethod', 'výpis e-shopu a produktové stránky'),
             'excluded': cfg.get('excluded', []), 'products': chat_products}
open(f'{ROOT}/n447/kozmetika2/catalogues/{slug}.js', 'w').write(
    f"/* n447 dávka 2 – {cfg['name']}: overený katalóg (447 € + 10 €/mes., bez trialu). Zdroj: {cfg['shopUrl']}; zostavené nástrojom tools/k2. */\n"
    f"globalThis.CX_CATALOGUES ||= {{}};\nglobalThis.CX_CATALOGUES[{json.dumps(slug)}] = {json.dumps(catalogue, ensure_ascii=False)};\n")

logo = cfg['logo']
brand = {'name': cfg['name'], 'domain': cfg['domain'], 'website': cfg['website'], 'shopUrl': cfg['shopUrl'], 'theme': cfg['theme'],
         'wordmark': f'<img class="cx-wordmark cx-logo" src="{logo}" alt="{cfg["name"]}">', 'hero': hero['photo'], 'mark': logo,
         'contact': cfg['contact'], 'contactSource': cfg['contactSource'], 'ownerNote': cfg['ownerNote'], 'benefit': cfg['benefit'],
         'catalogueMinGroupSize': 3, 'n447': True, 'k2': True, 'noProfileGoal': bool(cfg.get('noProfileGoal')), 'chips': cfg['chips'],
         'labels': cfg.get('labels', {}), 'facetDefs': cfg.get('facetDefs', []), 'scenes': cfg.get('scenes', {}), 'addons': cfg.get('addons', []),
         'products': products, 'k2Products': products, 'k2Css': cfg.get('k2Css', '')}
open(f'{ROOT}/n447/kozmetika2/brands/{slug}.js', 'w').write(
    f"/* n447 dávka 2 – značka {cfg['name']} v tvare cosmetics-config.js; načíta ju iba stránka {slug}.html. */\n(() => {{\n  'use strict';\n"
    f"  const data = window.COSMETICS_DEMOS;\n  if (!data) return;\n  data.brands[{json.dumps(slug)}] = {json.dumps(brand, ensure_ascii=False)};\n}})();\n")

tpl = open(f'{ROOT}/saloos.html').read()
tpl = tpl.replace('<html lang="cs">', f'<html lang="{cfg.get("lang", "sk")}">')
tpl = re.sub(r'<meta name="theme-color" content="[^"]*">', f'<meta name="theme-color" content="{cfg["theme"]["brand"]}">', tpl)
tpl = re.sub(r'<title>[^<]*</title>', f'<title>{cfg["name"]} – {"výběr péče" if cs else "výber starostlivosti"}</title>', tpl)
tpl = tpl.replace("window.N447_COSMETICS_SLUG='saloos';", f"window.N447_COSMETICS_SLUG='{slug}';")
tpl = tpl.replace('/n447/kozmetika/brands/saloos.js', f'/n447/kozmetika2/brands/{slug}.js')
tpl = tpl.replace('/n447/kozmetika/catalogues/saloos.js', f'/n447/kozmetika2/catalogues/{slug}.js')
tpl = tpl.replace('/n447/kozmetika/advisor-boot-n447.js', '/n447/kozmetika2/advisor-boot-k2.js')
assert 'saloos' not in tpl.lower(), 'v šablóne ostal Saloos'
open(f'{ROOT}/{slug}.html', 'w').write(tpl)

api = open(f'{ROOT}/api/cosmetics-chat-447b.js').read()
imp = f"import '../n447/kozmetika2/catalogues/{slug}.js';\n"
if imp not in api:
    api = api.replace("import {aiAnswer} from './ai-chat.js';", imp + "import {aiAnswer} from './ai-chat.js';")
entry = f"  {slug}: {{brand: {json.dumps(cfg['name'], ensure_ascii=False)}, web: {json.dumps(cfg['website'])}}},\n"
if f'  {slug}: {{' not in api:
    api = api.replace('  /* K2_BRANDS */\n', '  /* K2_BRANDS */\n' + entry)
open(f'{ROOT}/api/cosmetics-chat-447b.js', 'w').write(api)
print('ok', slug, len(products), 'produktov,', len(chat_products), 'v chate')
