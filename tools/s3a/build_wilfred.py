"""Séria 3 (Andreine) – Wilfred (wilfred.sk, Upgates) v natívnom poradcovi Andreine (blízky segment: čaj).
Druh = kategória e-shopu (zelený, biely, čierny, rooibos, ovocný, bylinkový, maté); nálada = kategórie e-shopu „Byť plný energie / uvoľnený / fit / gurmán“.
Cena a sklad zo schema.org na stránke produktu. Čaje pomenované podľa zdravotných ťažkostí sa nepreberajú (bez zdravotných tvrdení).
python3 -I tools/s3a/build_wilfred.py DIR"""
import sys, os, re, json, glob, html as H
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import photo
DIR = sys.argv[1]; CHECKED = '2026-11-05'; SLUG = 'wilfred'; WEB = 'https://www.wilfred.sk'
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
TYPES = [('zelene-caje', 's3Green', 'Zelený čaj'), ('biely-caj', 's3White', 'Biely čaj'), ('cierne-caje', 's3Black', 'Čierny čaj'), ('mate', 's3Mate', 'Maté'), ('rooibos', 's3Rooibos', 'Rooibos'), ('ovocne-caje', 's3Fruit', 'Ovocný čaj'), ('bylinkove-caje', 's3Herbal', 'Bylinkový čaj')]
MOODS = [('byt-plny-energie', 's3Energy'), ('byt-uvolneny', 's3Calm'), ('byt-gurman', 's3Gourmet'), ('byt-fit', 's3Fresh')]
HEALTH = r'sos|hrdlo|imunit|detox|travenie|digest|prvej-pomoci|fit-beauty|woman-power|vitalita|venusa'
links = lambda c: re.findall(r'href="/p/([^"]+)"', open(f'{DIR}/l-{c}.html', encoding='utf-8').read())
typ = {}
for c, k, lab in TYPES:
    for s in links(c): typ.setdefault(s, (k, lab))
mood = {}
for c, k in MOODS:
    for s in links(c): mood.setdefault(s, k)
txt = lambda h: re.sub(r'\s+', ' ', H.unescape(re.sub(r'<[^>]+>', ' ', h or ''))).strip()
out, combo = [], set()
for s, (t, kind) in typ.items():
    if re.search(HEALTH, s): print('MIMO (zdravotný názov)', s); continue
    if s not in mood: print('VYRADENÉ (bez kategórie nálady)', s); continue
    f = f'{DIR}/p-{s}.html'
    if not os.path.exists(f): continue
    h = open(f, encoding='utf-8', errors='replace').read()
    if 'schema.org/InStock' not in h: print('VYRADENÉ (nie je na sklade)', s); continue
    price = float(re.search(r'itemprop="price" content="([\d.]+)"', h).group(1))
    name = txt((re.search(r'<h1[^>]*>(.*?)</h1>', h, re.S) or [None, s])[1])
    body = re.sub(r'(\s*\|\s*)+', ' | ', txt(re.sub(r'<(p|br|li|strong|h\d)[^>]*>', ' | ', (re.search(r'Popis a špecifikácia(.*?)Naposledy navštívené', h, re.S) or [None, ''])[1])))
    comp = (re.search(r'Zloženie:\s*\|?\s*([^|]+)', body) or [None, ''])[1].strip(' .')
    grams = (re.search(r'Hmotnosť:\s*(\d+)\s*gram', body) or [None, ''])[1]
    intro = next((x.strip() for x in body.split('|') if len(x.strip()) > 60), '')
    intro = ' '.join(re.split(r'(?<=[.!?])\s+', intro)[:2])[:280]
    img = (re.search(r'og:image" content="([^"]+)"', h) or [None, None])[1]
    if (t, mood[s]) in combo and len(out) >= 14: continue
    combo.add((t, mood[s]))
    out.append({'id': s, 'name': name, 'url': f'{WEB}/p/{s}', 'priceAmount': price, 'currency': 'EUR', 'price': f'{price:.2f} €'.replace('.', ','), 'volume': f'{grams} g' if grams else '', 'variantLabel': '',
        'category': 'tea', 'kind': kind, 'tags': [], 'photo': photo(SLUG, img, s), 'available': True, 'isSample': False,
        'description': intro + (' Zloženie: ' + comp + '.' if comp else ''), 'reason': ('Zloženie: ' + comp + '.') if comp else intro,
        'source': {'url': f'{WEB}/p/{s}', 'verifiedAt': CHECKED, 'stock': 'InStock', 'priceFrom': False,
                   'selectionTraits': {'careUse': t, 'purpose': t, 'skinFocus': mood[s]}, 'selectionTraitsEvidence': 'kategórie e-shopu wilfred.sk (druh čaju a „Byť …“)',
                   'suitabilitySource': 'kategórie e-shopu', 'descriptionSource': 'popis produktu (bez zdravotných tvrdení)', 'allSkinTypes': True}})
out = [p for p in out if p['photo']][:25]
cat = {'verifiedAt': CHECKED + 'T10:00:00Z', 'source': WEB + '/obchod', 'collectionMethod': 'kategórie a stránky produktov wilfred.sk (Upgates, schema.org cena a sklad), ' + CHECKED,
       'excluded': ['čaje pomenované podľa zdravotných ťažkostí', 'darčekové balíky', 'nedostupné čaje'], 'products': out}
open(f'{ROOT}/catalogues/{SLUG}.js', 'w').write('/* Séria 3 (Andreine) – Wilfred: ' + str(len(out)) + ' dostupných čajov (' + CHECKED + '). Generované: tools/s3a/build_wilfred.py. */\nglobalThis.CX_CATALOGUES ||= {};\nglobalThis.CX_CATALOGUES["' + SLUG + '"] = ' + json.dumps(cat, ensure_ascii=False) + ';\n')
for p in out: print(p['name'], p['kind'], p['source']['selectionTraits']['skinFocus'], p['price'], p['volume'], p['reason'][:50])
