"""Séria 3 – PURITY VISION (purityvision.cz, Shopify): products.json + kolekcie e-shopu (zaradenie podľa problému pleti a typu produktu).
python3 -I tools/s3/build_purity.py RAWDIR OUT.json   (RAWDIR/p1..p3.json, RAWDIR/col/<kolekcia>.json)"""
import sys, json, re, os, glob
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import txt, sentences, photo
RAW, OUT = sys.argv[1], sys.argv[2]; CHECKED = '2026-11-05'; SLUG = 'purityvision'; WEB = 'https://www.purityvision.cz'
ps = []
for f in sorted(glob.glob(f'{RAW}/p*.json')): ps += json.load(open(f))['products']
col = {os.path.basename(f)[:-5]: {p['handle'] for p in json.load(open(f))['products']} for f in glob.glob(f'{RAW}/col/*.json')}
inc = lambda h, *cs: any(h in col.get(c, set()) for c in cs)
SKIN = {'blemish': ('kosmetika-na-akne', 'prirodni-kosmetika-na-seboreu'), 'sensitive': ('kosmetika-na-zacervenanou-plet', 'kosmetika-na-ruzovku', 'kosmetika-na-ekzem'),
        'dry': ('kosmetika-na-dehydratovanou-plet',), 'mature': ('kosmetika-proti-starnuti-pleti', 'kosmetika-na-pigmentove-skvrny')}
SKIN_SRC = {k: ', '.join(v) for k, v in SKIN.items()}
def kind_of(p):
    t, ty = p['title'].lower(), (p['product_type'] or '').lower()
    if re.search(r'\b(set|sada|rituál|ritual|kolekce|duo|trio)\b|séra 2v1$', t) and not re.search(r'\d+\s*ml', t) or inc(p['handle'], 'zvyhodnene-sety-purity-vision', 'darkove-sady') and not re.search(r'\d+\s*ml', t): return 'Sady a rituály'
    if re.search(r'rt[yů]|lip', t): return 'Péče o rty'
    if re.search(r'oční|oko|eye', t): return 'Oční okolí'
    if re.search(r'oil & serum|olejové sérum', t) or ty == 'olejové sérum': return 'Olejová séra'
    if re.search(r'sérum|serum', t) or ty.startswith('sérum'): return 'Séra'
    if re.search(r'booster|tonikum', t) or ty.startswith('tonikum') or ty.startswith('booster'): return 'Tonika a boostery'
    if re.search(r'\bvoda\b|hydrolát', t) or ty.startswith('květinová voda'): return 'Květinové vody'
    if re.search(r'pěn|gel|odlič|čistic', t) or ty in ('pěna', 'gel'): return 'Čištění a odlíčení'
    if re.search(r'mask|peeling|scrub', t) or ty in ('maska', 'peeling'): return 'Masky a peelingy'
    if re.search(r'máslo', t) or ty == 'máslo': return 'Másla'
    if re.search(r'krém|balzám|mast', t) or ty in ('krém', 'balzám'): return 'Krémy a balzámy'
    if re.search(r'olej', t) or ty == 'olej': return 'Oleje'
    if re.search(r'sůl|koupel', t): return 'Koupel'
    if re.search(r'deodorant', t): return 'Deodoranty'
    return None
EXCL = r'poukaz|svíčk|svick|jantar|kámen|pipet|ručník|krabic|káva|kava|čaj|sirup|med\b|bio potrav|drobn'
rows, report = [], []
for p in ps:
    h = p['handle']
    if re.search(EXCL, p['title'], re.I) or inc(h, 'bio-potraviny-a-napoje'): continue
    cat = 'face' if inc(h, 'prirodni-pletova-kosmetika') else 'hair' if inc(h, 'prirodni-vlasova-kosmetika') else 'body' if inc(h, 'prirodni-telova-kosmetika') else 'baby' if inc(h, 'kosmetika-pro-miminka-a-deti') else None
    if not cat: continue
    v = next((x for x in p['variants'] if x['available']), None)
    if not v: report.append(('NEDOSTUPNÉ', p['title'])); continue
    kind = kind_of(p)
    if not kind: report.append(('BEZ DRUHU', p['title'], p['product_type'])); continue
    price = float(v['price']); reg = float(v['compare_at_price'] or 0)
    body = txt(p['body_html']); img = (p['images'] or [{}])[0].get('src')
    r = {'id': 'pv-' + h, 'name': p['title'], 'url': f'{WEB}/products/{h}', 'priceAmount': price, 'currency': 'CZK', 'price': f'{price:,.0f} Kč'.replace(',', ' '),
         'volume': (re.search(r'(\d+\s*(?:ml|g))\b', p['title'], re.I) or [None, ''])[1], 'variantLabel': '', 'category': cat, 'kind': kind, 'tags': [],
         'photo': photo(SLUG, img, h) or img, 'available': True, 'isSample': False, 'description': sentences(body, 2, 300), 'reason': sentences(body, 1, 220),
         'source': {'url': f'{WEB}/products/{h}', 'verifiedAt': CHECKED, 'category': p['product_type'] or kind, 'stock': 'InStock', 'priceFrom': False, 'imageUrl': img,
                    'suitabilityEvidence': 'bez tvrdenia o type pleti', 'suitabilitySource': 'kolekcie e-shopu purityvision.cz'}}
    if reg > price: r['regularPrice'] = reg; r['promoNote'] = f'Akce v e-shopu, běžně {reg:,.0f} Kč'.replace(',', ' ')
    f = {'scope': 'set' if kind == 'Sady a rituály' else 'single'}
    if cat == 'face':
        sk = [k for k, cs in SKIN.items() if inc(h, *cs)]
        f['skin'] = sk or ['all']
        r['source']['suitabilityEvidence'] = ('kolekce e-shopu: ' + '; '.join(SKIN_SRC[k] for k in sk)) if sk else 'v žádné kolekci podle problému pleti – „bez konkrétního problému“'
    r['facets'] = f
    rows.append(r)
json.dump(rows, open(OUT, 'w'), ensure_ascii=False, indent=1)
from collections import Counter
for x in report: print(*x)
print(len(rows), Counter(r['category'] for r in rows), Counter((r['category'], r['kind']) for r in rows))
