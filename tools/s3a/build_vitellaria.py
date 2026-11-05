"""Séria 3 (Andreine) – Vitellaria (vitellaria.cz, Shoptet), vlasová kozmetika v natívnom poradcovi Andreine.
Krok 1 = druh produktu podľa názvu v e-shope (šampon, kondicionér, maska, bezoplachová péče, styling, péče o pokožku hlavy);
krok 2 = potreba podľa názvu a krátkeho popisu e-shopu (hydratace, protein, hloubkové čištění, mastné / suché / normální vlasy, pokožka hlavy, vlny, děti, muži).
Cena a sklad podľa variantu (data-customerprice, „Skladem“); odporúča sa najmenšie balenie skladom.
python3 -I tools/s3a/build_vitellaria.py DIR"""
import sys, os, re, json, html as H
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import photo
DIR = sys.argv[1]; CHECKED = '2026-11-05'; SLUG = 'vitellaria'; WEB = 'https://www.vitellaria.cz'
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
txt = lambda h: re.sub(r'\s+', ' ', H.unescape(re.sub(r'<[^>]+>', ' ', h or ''))).strip()
USE = [('s3Cond', r'co-wash'), ('s3Leave', r'leave-in|sérum|serum|aktivátor'), ('s3Style', r'styling|gel|pěna'), ('s3Mask', r'maska'), ('s3Cond', r'kondicion'), ('s3Wash', r'šampon|šampuk')]
NEED = [('s3Kids', r'dětsk'), ('s3Men', r'pro muže'), ('s3Scalp', r'pokožk\w* hlavy'), ('s3Protein', r'protein'), ('s3Deep', r'hloubkov'), ('s3Oily', r'mastn'), ('s3Dry', r'such'),
        ('s3Normal', r'normáln|všechny typy'), ('s3Curl', r'vln|kudrn|CGM|co-wash'), ('s3Hydra', r'hydrat'), ('s3Solid', r'tuh')]
out = []
for u in [l.strip() for l in open(os.path.join(DIR, 'urls.txt')) if l.strip()]:
    s = u.rstrip('/').split('/')[-1]
    h = open(os.path.join(DIR, s + '.html'), encoding='utf-8', errors='replace').read()
    name = txt((re.search(r'<h1[^>]*>(.*?)</h1>', h, re.S) or [None, s])[1])
    short = txt((re.search(r'class="p-short-description"[^>]*>(.*?)</div>', h, re.S) or [None, ''])[1])
    desc = txt((re.search(r'Detailní popis produktu(.*?)(?:Použití:|Ingredients|Složení)', h, re.S) or [None, ''])[1])
    use = next((k for k, rx in USE if re.search(rx, name, re.I)), None)
    need = next((k for k, rx in NEED if re.search(rx, name, re.I)), None) or next((k for k, rx in NEED if re.search(rx, short, re.I)), None)
    if not use or not need: print('VYRADENÉ (druh alebo potreba z názvu nejasná)', name); continue
    vs = []
    for val, attrs, label in re.findall(r'<option value="(\d+)"([^>]*)>([^<]+)', h):
        lab = H.unescape(label).replace('\xa0', ' ')
        price = re.search(r'data-customerprice="([\d.]+)"', attrs)
        vol = re.search(r'(\d+)\s*(ml|g)', lab)
        if not price or 'Skladem' not in lab or not vol: continue
        vs.append((float(price.group(1)), vol.group(1) + ' ' + vol.group(2), f'{WEB}{u}?variantId={val}', lab.split(' - ')[0].strip()))
    if not vs:
        price = re.search(r'itemprop="price" content="([\d.]+)"', h)
        if price and 'schema.org/InStock' in h and 'Skladem' in h:
            vol = re.search(r'(\d+)\s*(ml|g)\b', name + ' ' + short + ' ' + desc)
            vs.append((float(price.group(1)), (vol.group(1) + ' ' + vol.group(2)) if vol else '', WEB + u, ''))
    if not vs: print('VYRADENÉ (nie skladom)', name); continue
    vs.sort()
    price, vol, url, lab = vs[0]
    img = (re.search(r'og:image" content="([^"]+)"', h) or [None, None])[1]
    out.append({'id': s, 'name': name, 'url': url, 'priceAmount': price, 'currency': 'CZK', 'price': f'{int(price)} Kč' if price == int(price) else f'{price:.2f} Kč'.replace('.', ','),
        'volume': vol, 'variantLabel': lab, 'category': 'hair', 'kind': {'s3Wash': 'Šampony', 's3Cond': 'Kondicionéry', 's3Mask': 'Masky', 's3Leave': 'Bezoplachová péče', 's3Style': 'Styling'}[use],
        'tags': [], 'photo': photo(SLUG, H.unescape(img) if img else None, s), 'available': True, 'isSample': False, 'description': ' '.join(re.split(r'(?<=[.!?])\s+', desc)[:2])[:300] or short, 'reason': short or desc[:200],
        'source': {'url': WEB + u, 'verifiedAt': CHECKED, 'stock': 'InStock', 'priceFrom': False, 'variants': [{'label': v[3], 'price': v[0], 'url': v[2]} for v in vs],
                   'selectionTraits': {'careUse': use, 'purpose': use, 'hairNeed': need}, 'selectionTraitsEvidence': 'názov a krátky popis produktu v e-shope vitellaria.cz: ' + (short or name),
                   'suitabilitySource': 'názov a popis produktu', 'descriptionSource': 'detailní popis produktu', 'allSkinTypes': True, 'routineRole': {'s3Wash': 'shampoo', 's3Cond': 'conditioner', 's3Mask': 'conditioner', 's3Leave': 'leaveInCare', 's3Style': 'styling'}[use]}})
pick, combo = [], set()
for p in out:
    c = (p['source']['selectionTraits']['careUse'], p['source']['selectionTraits']['hairNeed'])
    if c not in combo: combo.add(c); pick.append(p)
out = [p for p in pick if p['photo']][:25]
cat = {'verifiedAt': CHECKED + 'T10:00:00Z', 'source': WEB + '/vlasova-kosmetika/', 'collectionMethod': 'kategorie Vlasová kosmetika a stránky produktů vitellaria.cz (Shoptet), ' + CHECKED, 'excluded': ['varianty „Na objednávku“', 'dárkové balíčky'], 'products': out}
open(f'{ROOT}/catalogues/{SLUG}.js', 'w').write('/* Séria 3 (Andreine) – Vitellaria: ' + str(len(out)) + ' dostupných produktů vlasové péče (' + CHECKED + '). Generované: tools/s3a/build_vitellaria.py. */\nglobalThis.CX_CATALOGUES ||= {};\nglobalThis.CX_CATALOGUES["' + SLUG + '"] = ' + json.dumps(cat, ensure_ascii=False) + ';\n')
for p in out: print(p['name'], '|', p['kind'], p['source']['selectionTraits']['hairNeed'], p['price'], p['volume'])
