"""Séria 3 (Andreine) – La Bohème Café (labohemecafe.cz, Shopify products.json): čerstvo pražená výberová káva.
Chuťové tóny z popisu produktu („tóny …“, „v chuti …“), príprava zo štítkov Espresso / Filtrovaná káva a z popisu.
python3 -I tools/s3a/build_laboheme.py PRODUCTS.json"""
import sys, json, re, os, html as H
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import sentences, photo, write_coffee, process_label
CHECKED = '2026-11-05'; SLUG = 'laboheme'; WEB = 'https://labohemecafe.cz'
ps = json.load(open(sys.argv[1]))['products']
CH = r'čokol|kakao|ořech|oříš|pekan|karamel|\bmed|lesní med|krémov|sladk|nugát|marcip'
FR = r'citr|citron|květin|broskv|marakuj|čern(ý|ého) čaj|malin|hrušk|třešn|ostružin|šťavnat'
COUNTRY = {'kolumbie': ('Kolumbie', 'americas'), 'keňa': ('Keňa', 'africa'), 'bio': ('Mexiko', 'americas'), 'peru': ('Peru', 'americas'), 'indonésie': ('Indonésie', 'asia'), 'brazílie': ('Brazílie', 'americas'), 'uganda': ('Uganda', 'africa')}
products = []
for p in ps:
    if p['product_type'] != 'Čerstvě pražená výběrová káva': continue
    tags = p['tags'] if isinstance(p['tags'], list) else [t.strip() for t in p['tags'].split(',')]
    name = p['title']
    if re.search(r'cascara', name, re.I): print('MIMO', name); continue
    text = re.sub(r'\s+', ' ', H.unescape(re.sub(r'<[^>]+>', ' ', p['body_html'] or ''))).strip()
    m = re.search(r'(?:tóny|V chuti dominuje|příchutí|Tóny)\s+([^.]+)', text)
    notes = [n.strip(' .').lower() for n in re.split(r',| a ', m.group(1)) if n.strip(' .') and len(n.strip()) < 40][:4] if m else []
    if not notes: print('VYRADENÉ (popis bez chuťových tónov)', name); continue
    low = ' '.join(notes) + ' ' + text.lower()
    c, f = len(re.findall(CH, ' '.join(notes))), len(re.findall(FR, ' '.join(notes) + (' citrus' if 'citrusov' in text.lower() else '')))
    taste = 'fresh' if f > c else 'choco' if c > f else 'fruitFull'
    preps = []
    if 'Espresso' in tags or 'b2b-espresso' in tags or re.search(r'espresso', text, re.I): preps.append('espresso')
    if 'Filtrovaná káva' in tags or re.search(r'filtr', text, re.I): preps.append('filter')
    if not preps: print('VYRADENÉ (bez prípravy)', name); continue
    vs = []
    for v in p['variants']:
        if not v['available']: continue
        g = re.search(r'(\d+(?:[.,]\d+)?)\s*(g|kg)', v['title'])
        if not g: continue
        grams = int(float(g.group(1).replace(',', '.')) * (1000 if g.group(2) == 'kg' else 1))
        vs.append({'grams': grams, 'grind': 'zrnková', 'price': float(v['price']), 'url': f"{WEB}/products/{p['handle']}?variant={v['id']}", 'available': True, 'verifiedAt': CHECKED,
                   'source': 'Shopify products.json e-shopu labohemecafe.cz (' + CHECKED + ')'})
    if not vs: print('VYRADENÉ (nie skladom)', name); continue
    blend = bool(re.search(r'směs|harvest|half', name + text[:120], re.I))
    cc = COUNTRY.get(name.split()[0].lower())
    products.append({'id': p['handle'], 'kind': 'coffee', 'name': name, 'url': f"{WEB}/products/{p['handle']}", 'photo': photo(SLUG, (p['images'] or [{}])[0].get('src'), p['handle']), 'photoRemote': False,
        'currency': 'CZK', 'available': True, 'decaf': False, 'preps': preps, 'roastLabel': '', 'prepText': None,
        'taste': taste, 'tastes': [taste], 'tasteSource': 'odvozeno z chuťových tónů v popisu e-shopu', 'notes': notes,
        'origin': 'směs' if blend else (cc[0] if cc else ''), 'region': 'blend' if blend else (cc[1] if cc else None),
        'process': process_label('natural' if re.search(r'natural|suché zpracování', text, re.I) else 'promyté' if re.search(r'washed|promyt', text, re.I) else '') ,
        'variety': None, 'summary': sentences(text, 2), 'priceFrom': min(v['price'] for v in vs), 'priceTo': max(v['price'] for v in vs), 'weights': sorted({v['grams'] for v in vs}), 'variants': vs,
        'halfCaf': bool(re.search(r'half', name, re.I)), 'checkedAt': CHECKED,
        'source': {'url': f"{WEB}/products/{p['handle']}", 'verifiedAt': CHECKED, 'facts': 'chuťové tóny a příprava z popisu a štítků produktu'}})
DATA = {'slug': SLUG, 'lang': 'cs', 'checkedAt': CHECKED, 'beansOnly': True, 'altFallback': True, 'demo': {'heroProductId': products[0]['id']},
  'brand': {'name': 'La Bohème Café', 'legal': 'La Bohème Café', 'place': 'La Bohème Café · pražírna a čajovna, Praha', 'shopUrl': WEB + '/collections/all', 'web': WEB + '/',
            'logo': '/assets/s3/laboheme/logo.png', 'hero': products[0]['photo'], 'contact': '', 'contactSource': WEB + '/',
            'theme': {'ink': '#1f2a2b', 'brand': '#1f2a2b', 'accent': '#b48a4a', 'soft': '#f4efe7', 'paper': '#ffffff'}},
  'tasteLabels': {'choco': ['Čokoládová a sladká', 'Kakao, ořechy, karamel'], 'fruitFull': ['Vyvážená a ovocná', 'Sušené ovoce, švestky'], 'fresh': ['Svěží a ovocná', 'Citrus, bobule, květiny'], 'decaf': ['Bez kofeinu', '']},
  'scope': f'{len(products)} čerstvě pražených káv z e-shopu labohemecafe.cz ({CHECKED}).', 'excluded': ['čaje, šálky, konvice a příslušenství', 'cascara'],
  'shop': {'freeShipping': '', 'shippingNote': '', 'freeShippingSource': WEB + '/'},
  'chips': ['Káva do automatu', 'Káva na filtr', 'Co je méně kyselé?', 'Něco ovocného'], 'commercialNote': '', 'products': products, 'sets': [], 'held': []}
write_coffee(SLUG, DATA, 'La Bohème Café – séria 3 (447 € + 10 €/měs.): katalog z Shopify products.json e-shopu labohemecafe.cz (' + CHECKED + '). Vygenerováno: tools/s3a/build_laboheme.py.')
for p in products: print(p['name'], p['preps'], p['taste'], p['notes'], [(v['grams'], v['price']) for v in p['variants']], p['region'])
