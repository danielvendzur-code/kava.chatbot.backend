"""Séria 3 (Andreine) – Veselý čaj (veselycaj.sk, Shoptet) v natívnom poradcovi Andreine (blízky segment: čaj).
Druh čaju = kategória e-shopu (čierny, zelený, ovocný, bylinkový, rooibos); chuť = zloženie uvedené pri čaji (citrus, ovocie, korenie, kvety, mäta, sladké).
Ceny a sklad variant zo shoptet necessaryVariantData; odporúča sa najmenšie dostupné balenie. Liečivé čaje (Medica) a zdravotné tvrdenia sa nepreberajú.
python3 -I tools/s3a/build_veselycaj.py DIR"""
import sys, os, re, json, html as H
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import photo
DIR = sys.argv[1]; CHECKED = '2026-11-05'; SLUG = 'veselycaj'; WEB = 'https://www.veselycaj.sk'
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
TYPE = {'cierny-sypany-caj': ('s3Black', 'Čierny čaj'), 'zeleny-sypany-caj': ('s3Green', 'Zelený čaj'), 'ovocny-sypany-caj': ('s3Fruit', 'Ovocný čaj'), 'bylinkovy-sypany-caj': ('s3Herbal', 'Bylinkový čaj'), 'rooibos-sypany-caj': ('s3Rooibos', 'Rooibos')}
TASTE = [('s3Mint', r'mät|mint'), ('s3Spice', r'škoric|zázvor|kardam|chilli|klinč|koren|čierne korenie|aníz|badián'), ('s3Citrus', r'citr|pomaranč|bergamot|limet|grep'),
         ('s3Flower', r'ruž|levand|jazmín|harmanč|nechtík|ibišt|kvet'), ('s3Sweet', r'vanil|karamel|čokol|kakao|med\b|kokos|mandľ'), ('s3Berry', r'jahod|malin|čučori|ríbezl|brusnic|višn|čerešn|baza|jablk|hrušk|brosk|mango|ananás|marhu')]
txt = lambda h: re.sub(r'\s+', ' ', H.unescape(re.sub(r'<[^>]+>', ' ', h or ''))).strip()
lines = [l.split() for l in open(os.path.join(DIR, 'urls.txt')) if l.strip()]
out, seen = [], set()
for cat, u in lines:
    slug = u.strip('/')
    if slug in seen: continue
    seen.add(slug)
    f = os.path.join(DIR, slug + '.html')
    if not os.path.exists(f): continue
    h = open(f, encoding='utf-8', errors='replace').read()
    name = txt((re.search(r'<h1[^>]*>(.*?)</h1>', h, re.S) or [None, ''])[1])
    dm = re.search(r'id="description"(.*?)(?:Dodatočné parametre|id="productDiscussion")', h, re.S)
    desc = txt(dm.group(1)) if dm else ''
    comp = (re.search(r'Zloženie:\s*([^.]+(?:\.[^A-ZÁ-Ž][^.]*)?)\.', desc) or [None, ''])[1].strip()
    if not comp: print('VYRADENÉ (bez zloženia)', name); continue
    tkey = next((k for k, rx in TASTE if re.search(rx, comp.lower())), None)
    if not tkey: print('VYRADENÉ (chuť zo zloženia nejasná)', name, comp[:60]); continue
    try: vd = json.loads(re.search(r'necessaryVariantData = (\{.*?\});', h).group(1))
    except Exception: print('VYRADENÉ (bez variant)', name); continue
    labels = dict(re.findall(r'<option value="(\d+)" data-index="\d+">\s*([^<]+?)\s*<', h))
    vs = []
    for k, v in vd.items():
        lab = labels.get(k.split('-')[-1], '')
        g = re.search(r'(\d+)\s*g', lab)
        if not g or v.get('availabilityName') != 'Skladom' or not v.get('isNotSoldOut') or not v.get('priceUnformatted'): continue
        vs.append((int(g.group(1)), float(v['priceUnformatted']), f"{WEB}/{slug}/?variantId={v['id']}", lab))
    if not vs: print('VYRADENÉ (nie skladom)', name); continue
    vs.sort(key=lambda x: (x[1], x[0]))
    grams, price, url, lab = vs[0]
    img = (re.search(r'og:image" content="([^"]+)"', h) or [None, None])[1]
    intro = re.split(r'Zloženie:', desc)[0]
    intro = re.sub(r'^\s*Podrobný popis\s*', '', intro).strip()
    intro = ' '.join(re.split(r'(?<=[.!?])\s+', intro)[:2])[:300]
    t, kind = TYPE[cat]
    out.append({'id': slug, 'name': name, 'url': url, 'priceAmount': price, 'currency': 'EUR', 'price': f'{price:.2f} €'.replace('.', ','), 'volume': f'{grams} g', 'variantLabel': lab,
        'category': 'tea', 'kind': kind, 'tags': [], 'photo': photo(SLUG, H.unescape(img) if img else None, slug), 'available': True, 'isSample': False,
        'description': intro + ' Zloženie: ' + comp + '.', 'reason': 'Zloženie: ' + comp + '.',
        'source': {'url': f'{WEB}/{slug}/', 'verifiedAt': CHECKED, 'stock': 'InStock', 'priceFrom': False, 'variants': [{'label': v[3], 'price': v[1], 'url': v[2]} for v in vs],
                   'selectionTraits': {'careUse': t, 'purpose': t, 'skinFocus': tkey}, 'selectionTraitsEvidence': 'kategória e-shopu a zloženie čaju: ' + comp,
                   'suitabilitySource': 'kategória a zloženie z e-shopu', 'descriptionSource': 'popis produktu (bez zdravotných tvrdení)', 'allSkinTypes': True}})
# najviac 25, každá kombinácia (druh × chuť) najprv raz
pick, combo = [], set()
for p in out:
    c = (p['source']['selectionTraits']['careUse'], p['source']['selectionTraits']['skinFocus'])
    if c not in combo: combo.add(c); pick.append(p)
out = [p for p in pick if p['photo']][:25]
cat = {'verifiedAt': CHECKED + 'T10:00:00Z', 'source': WEB + '/sypany-caj/', 'collectionMethod': 'kategórie sypaných čajov a stránky produktov veselycaj.sk (Shoptet), ' + CHECKED,
       'excluded': ['liečivé čaje Medica (zdravotné tvrdenia)', 'darčekové sety a doplnky', 'vypredané balenia'], 'products': out}
open(f'{ROOT}/catalogues/{SLUG}.js', 'w').write('/* Séria 3 (Andreine) – Veselý čaj: ' + str(len(out)) + ' dostupných sypaných čajov (' + CHECKED + '). Generované: tools/s3a/build_veselycaj.py. */\nglobalThis.CX_CATALOGUES ||= {};\nglobalThis.CX_CATALOGUES["' + SLUG + '"] = ' + json.dumps(cat, ensure_ascii=False) + ';\n')
for p in out: print(p['name'], p['kind'], p['source']['selectionTraits']['skinFocus'], p['price'], p['volume'], p['reason'][:60])
