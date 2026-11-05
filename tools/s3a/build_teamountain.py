"""Séria 3 (Andreine) – Tea Mountain (teamountain.cz, WooCommerce Store API) v natívnom poradcovi Andreine (blízky segment: čaj).
Druh čaju = kategória e-shopu (Černé, Zelené, Polozelené, Pu-erh a Hei-cha, Bílé); charakter = atribút e-shopu „Vlastnost“.
Najviac 25 dostupných čajov, každá kombinácia (druh × charakter) najprv raz. Cena = najmenšie dostupné balenie (varianta zo Store API).
python3 -I tools/s3a/build_teamountain.py LIST.json [LIST2.json] VARDIR"""
import sys, json, os, re, subprocess, html as H
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import sentences, photo
CHECKED = '2026-11-05'; SLUG = 'teamountain'; WEB = 'https://www.teamountain.cz'; ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
*lists, VAR = sys.argv[1:]; os.makedirs(VAR, exist_ok=True)
ps = [p for f in lists for p in json.load(open(f))]
TYPES = {'Černé': 's3Black', 'Zelené': 's3Green', 'Polozelené': 's3Oolong', 'Pu-erh a Hei-cha': 's3Puerh', 'Bílé': 's3White'}
FOCUS = [('Méně povzbudivé', 's3LowCaf'), ('Pečený', 's3Roasted'), ('Tmavý', 's3Dark'), ('First Flush', 's3Spring'), ('Second Flush', 's3Summer'), ('Autumnal Flush', 's3Autumn'),
         ('Světlý', 's3Light'), ('Divoké čajovníky', 's3Wild'), ('Staré čajovníky', 's3Old'), ('Vysokohorský', 's3High')]
cand = []
for p in ps:
    if not p['is_in_stock']: continue
    cats = [c['name'] for c in p['categories']]
    t = next((TYPES[c] for c in cats if c in TYPES), None)
    attrs = {a['name']: [x['name'] for x in a['terms']] for a in p['attributes']}
    props = attrs.get('Vlastnost', [])
    f = next((k for v, k in FOCUS if v in props), None)
    if not t or not f: continue
    cand.append((p, t, f, props, attrs))
chosen, seen = [], set()
for c in cand:
    if (c[1], c[2]) not in seen: seen.add((c[1], c[2])); chosen.append(c)
chosen = chosen[:25]
def get(u):
    r = subprocess.run(['curl', '-s', '-A', 'Mozilla/5.0', '--max-time', '40', u], capture_output=True).stdout
    try: return json.loads(r)
    except Exception: return None
out = []
for p, t, f, props, attrs in chosen:
    vs = []
    for v in p.get('variations', []):
        fn = f"{VAR}/{v['id']}.json"
        x = json.load(open(fn)) if os.path.exists(fn) else get(f"{WEB}/wp-json/wc/store/v1/products/{v['id']}")
        if x: json.dump(x, open(fn, 'w'))
        if not x or not x.get('is_in_stock'): continue
        lab = v['attributes'][0]['value'] if v['attributes'] else ''
        g = re.search(r'(\d+)\s*g', lab)
        if int(x['prices']['price']) > 0: vs.append((int(g.group(1)) if g else 0, int(x['prices']['price']), x['permalink'], lab))
    vs = [v for v in vs if v[0]]
    if not vs: print('VYRADENÉ (bez dostupného balenia)', p['name']); continue
    vs.sort()
    g, price, url, lab = vs[0]
    name = H.unescape(p['name'])
    desc = sentences(re.sub(r'\s+', ' ', H.unescape(re.sub(r'<[^>]+>', ' ', p['short_description'] or p['description'] or ''))).strip(), 2)
    pid = p['permalink'].rstrip('/').split('/')[-1]
    out.append({'id': pid, 'name': name, 'url': url, 'priceAmount': price, 'currency': 'CZK', 'price': f'{price} Kč', 'volume': f'{g} g', 'variantLabel': lab,
        'category': 'tea', 'kind': next(c for c in [c['name'] for c in p['categories']] if c in TYPES).replace('Černé', 'Černé čaje').replace('Zelené', 'Zelené čaje').replace('Polozelené', 'Polozelené čaje (oolongy)').replace('Bílé', 'Bílé čaje'),
        'tags': [], 'photo': photo(SLUG, (p['images'] or [{}])[0].get('src'), pid), 'available': True, 'isSample': False, 'description': desc, 'reason': desc,
        'source': {'url': p['permalink'], 'verifiedAt': CHECKED, 'stock': 'InStock', 'priceFrom': False, 'variants': [{'label': v[3], 'price': v[1], 'url': v[2]} for v in vs],
                   'origin': ', '.join(attrs.get('Země původu', [])), 'properties': props,
                   'selectionTraits': {'careUse': t, 'purpose': t, 'skinFocus': f}, 'selectionTraitsEvidence': 'kategorie a atribut „Vlastnost“ v e-shopu teamountain.cz (' + ', '.join(props) + ')',
                   'suitabilitySource': 'kategorie a vlastnosti e-shopu', 'descriptionSource': 'krátký popis produktu', 'allSkinTypes': True}})
out = [p for p in out if p['photo']]
cat = {'verifiedAt': CHECKED + 'T10:00:00Z', 'source': WEB + '/', 'collectionMethod': 'WooCommerce Store API e-shopu teamountain.cz (produkty + varianty), ' + CHECKED, 'excluded': ['vyprodané čaje', 'čajové nádobí a příslušenství'], 'products': out}
open(f'{ROOT}/catalogues/{SLUG}.js', 'w').write('/* Séria 3 (Andreine) – Tea Mountain: ' + str(len(out)) + ' dostupných čajů (' + CHECKED + '). Generované: tools/s3a/build_teamountain.py. */\nglobalThis.CX_CATALOGUES ||= {};\nglobalThis.CX_CATALOGUES["' + SLUG + '"] = ' + json.dumps(cat, ensure_ascii=False) + ';\n')
for p in out: print(p['name'], p['kind'], p['source']['selectionTraits'], p['price'], p['volume'])
