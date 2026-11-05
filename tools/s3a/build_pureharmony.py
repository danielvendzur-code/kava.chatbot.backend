"""Séria 3 (Andreine) – Pure Harmony (pureharmony.cz, Shoptet): přírodní tělová a vlasová péče v natívnom poradcovi Andreine.
Krok 1 = druh produktu podľa názvu (sprchové sérum, peeling, tělové máslo, mýdlo, deodorant, tuhý šampon/kondicionér, do koupele, květová voda);
krok 2 = vonná řada podľa kategórie e-shopu (růže, levandule, meruňka, rozmarýn, perníček). Svíčky, sirupy a sady sa nepreberajú.
Cena a sklad zo schema.org na stránke produktu. python3 -I tools/s3a/build_pureharmony.py DIR"""
import sys, os, re, json, html as H
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import photo
DIR = sys.argv[1]; CHECKED = '2026-11-05'; SLUG = 'pureharmony'; WEB = 'https://www.pureharmony.cz'
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
LINE = {'prirodni-kosmetika-z-ruze': 's3Rose', 'prirodni-levandulova-kosmetika': 's3Lavender', 'kosmetika-s-merunkovym-olejem': 's3Apricot', 'prirodni-rozmarynova-kosmetika': 's3Rosemary', 'kosmetika-s-vuni-pernicku': 's3Ginger'}
USE = [('s3Shower', r'sprchové sérum'), ('s3Peel', r'peeling'), ('s3Butter', r'tělové máslo|telove maslo'), ('s3Hair', r'šampon|kondicion'), ('s3Deo', r'deodorant'), ('s3Bath', r'šumiv|koupel|bomba|kostky'),
       ('s3Soap', r'mýdlo'), ('s3Water', r'voda'), ('s3Oil', r'olej')]
KIND = {'s3Shower': 'Sprchová séra', 's3Peel': 'Tělové peelingy', 's3Butter': 'Tělová másla', 's3Hair': 'Tuhá vlasová péče', 's3Deo': 'Deodoranty', 's3Bath': 'Do koupele', 's3Soap': 'Mýdla', 's3Water': 'Květové vody', 's3Oil': 'Tělové oleje'}
txt = lambda h: re.sub(r'\s+', ' ', H.unescape(re.sub(r'<[^>]+>', ' ', h or ''))).strip()
out, seen = [], set()
for line in open(os.path.join(DIR, 'urls2.txt')):
    c, u = line.split(); s = u.strip('/')
    if s in seen: continue
    seen.add(s)
    f = os.path.join(DIR, s + '.html')
    if not os.path.exists(f): continue
    h = open(f, encoding='utf-8', errors='replace').read()
    name = txt((re.search(r'<h1[^>]*>(.*?)</h1>', h, re.S) or [None, s])[1])
    use = next((k for k, rx in USE if re.search(rx, name, re.I)), None)
    if not use: print('MIMO', name); continue
    if 'schema.org/InStock' not in h: print('VYRADENÉ (nie skladom)', name); continue
    pm = re.search(r'itemprop="price" content="([\d.]+)"', h)
    if not pm: print('VYRADENÉ (bez ceny)', name); continue
    price = float(pm.group(1))
    short = txt((re.search(r'class="p-short-description"[^>]*>(.*?)</div>', h, re.S) or [None, ''])[1])
    vol = re.search(r'(\d+)\s*(ml|g)\b', name) or re.search(r'(\d+)\s*(ml|g)\b', short)
    img = (re.search(r'og:image" content="([^"]+)"', h) or [None, None])[1]
    out.append({'id': s, 'name': name, 'url': f'{WEB}/{s}/', 'priceAmount': price, 'currency': 'CZK', 'price': f'{int(price)} Kč', 'volume': (vol.group(1) + ' ' + vol.group(2)) if vol else '', 'variantLabel': '',
        'category': 'hair' if use == 's3Hair' else 'body', 'kind': KIND[use], 'tags': [], 'photo': photo(SLUG, H.unescape(img) if img else None, s), 'available': True, 'isSample': False,
        'description': ' '.join(re.split(r'(?<=[.!?])\s+', short)[:2])[:300], 'reason': short[:200],
        'source': {'url': f'{WEB}/{s}/', 'verifiedAt': CHECKED, 'stock': 'InStock', 'priceFrom': False,
                   'selectionTraits': {'careUse': use, 'purpose': use, 'skinFocus': LINE[c]}, 'selectionTraitsEvidence': 'název produktu a vonná řada (kategorie e-shopu) pureharmony.cz',
                   'suitabilitySource': 'název a kategorie e-shopu', 'allSkinTypes': True}})
pick, combo = [], set()
for p in out:
    t = p['source']['selectionTraits']; k = (t['careUse'], t['skinFocus'])
    if k not in combo: combo.add(k); pick.append(p)
out = [p for p in pick if p['photo']][:25]
for p in out: p['category'] = 'body'  # jedna oblasť (tělo a vlasy z rovnakých vonných řad) – druh produktu rozlíši prvý krok
cat = {'verifiedAt': CHECKED + 'T10:00:00Z', 'source': WEB + '/', 'collectionMethod': 'vonné řady (kategorie) a stránky produktů pureharmony.cz (Shoptet), ' + CHECKED, 'excluded': ['svíčky a sirupy', 'dárkové sady, rituály a výhodné balíčky', 'vyprodané produkty'], 'products': out}
open(f'{ROOT}/catalogues/{SLUG}.js', 'w').write('/* Séria 3 (Andreine) – Pure Harmony: ' + str(len(out)) + ' dostupných produktů tělové a vlasové péče (' + CHECKED + '). Generované: tools/s3a/build_pureharmony.py. */\nglobalThis.CX_CATALOGUES ||= {};\nglobalThis.CX_CATALOGUES["' + SLUG + '"] = ' + json.dumps(cat, ensure_ascii=False) + ';\n')
for p in out: print(p['name'], '|', p['kind'], p['source']['selectionTraits']['skinFocus'], p['price'], p['volume'])
