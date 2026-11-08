"""Séria 4 – Padmé Roastery (padmeroastery.sk, Webnode e-shop; Padmé Roastery, s.r.o., IČO 55 346 740, Rožňava).
Zdroj: kategórie Káva na espresso / Káva na filter / Bezkofeínová káva (príprava = kategória e-shopu), karta produktu: Praženie, Chuťový profil,
Oblasť/Krajina, spracovanie, Odporúčaná príprava, SCA; ceny a sklad variant z dát varianty na karte (identifier, price, out_of_stock).
Chuťová voľba = štýl praženia, ako ho uvádza pražiareň (Old School Espresso / moderné espresso / svetlé filter) – nič iné sa neodvodzuje.
Sety (duo, trio, four pack, box, tasting pack), matcha, mochi a príslušenstvo sa nepreberajú.
python3 -I tools/s4/build_padme.py DIR_S_html"""
import sys, os, re, json, html, subprocess
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 's3a'))
from common import photo, write_coffee, sentences
DIR = sys.argv[1]; CHECKED = '2026-11-08'; SLUG = 'padme'; WEB = 'https://www.padmeroastery.sk'
def get(u, f):
    p = f'{DIR}/{f}'
    if not os.path.exists(p): subprocess.run(['curl', '-sL', '--max-time', '30', '-o', p, u])
    return open(p, encoding='utf-8', errors='replace').read()
links = lambda t: sorted(set(re.findall(r'href="(/p/[a-z0-9-]+/)"', t)))
ESP, FIL = set(links(get(WEB + '/kava-na-espresso/', 'kava-na-espresso.html'))), set(links(get(WEB + '/kava-na-filter/', 'kava-na-filter.html')))
SKIP = r'pack|box|trio|duo|tasting|matcha|mochi'
txt = lambda t: re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', re.sub(r'(?s)<(script|style).*?</\1>', '', t))))
def field(t, k, stop=r'(?: [A-ZÁČĎÉÍĽĹŇÓÔŔŠŤÚÝŽ][a-záčďéíľĺňóôŕšťúýž ]{2,25}:|$)'):
    m = re.search(re.escape(k) + r'\s*(.+?)' + stop, t)
    return m.group(1).strip(' .') if m else ''
ROAST = [(r'old school', 'choco'), (r'new wave|espresso roast|moderné espresso', 'fruitFull'), (r'filter|light|svetl|omni', 'fresh')]
CO = {'Etiópia': ('Etiópia', 'africa'), 'Vietnam': ('Vietnam', 'asia'), 'Brazília': ('Brazília', 'americas'), 'India': ('India', 'asia'), 'Peru': ('Peru', 'americas'),
      'Colombia': ('Kolumbia', 'americas'), 'Kolumbia': ('Kolumbia', 'americas'), 'Honduras': ('Honduras', 'americas')}
products = []
for path in sorted(ESP | FIL):
    if re.search(SKIP, path): print('MIMO (set/iné)', path); continue
    url = WEB + path; slug = path.strip('/').split('/')[-1]
    raw = get(url, slug + '.html'); t = txt(raw)
    name = re.split(r'\s+[-–|]\s+|\s+::', html.unescape(re.search(r'<h1[^>]*>(.*?)</h1>', raw, re.S).group(1)).strip())[0]
    name = re.sub(r'<[^>]+>', '', name).strip()
    name = ' '.join(w.capitalize() if w.isupper() and len(w) > 2 and w not in ('R2DECAF',) else ('R2Decaf' if w == 'R2DECAF' else w) for w in name.split())
    vs = []
    for m in re.finditer(r'\{&quot;id&quot;:\d+,&quot;identifier&quot;:&quot;([^&]+)&quot;.*?&quot;price&quot;:([\d.]+).*?&quot;out_of_stock&quot;:(true|false)', raw):
        g = re.search(r'(\d+)\s*g$', m.group(1))
        if g and m.group(3) == 'false':
            vs.append({'grams': int(g.group(1)), 'grind': 'zrnková', 'price': float(m.group(2)), 'url': url, 'available': True, 'verifiedAt': CHECKED,
                       'source': f'variant {m.group(1)} na karte produktu (padmeroastery.sk, {CHECKED}): {m.group(2)} €, skladom'})
    if not vs:  # produkt bez variant: „Váha: 250 g … 18,00 €“
        w = re.search(r'Váha: (\d+) g', t); pr = re.search(r'Váha: \d+ g .*?(\d+,\d{2}) €', t)
        if w and pr and 'Skladom' in t:
            vs.append({'grams': int(w.group(1)), 'grind': 'zrnková', 'price': float(pr.group(1).replace(',', '.')), 'url': url, 'available': True, 'verifiedAt': CHECKED,
                       'source': f'cena a hmotnosť na karte produktu (padmeroastery.sk, {CHECKED}), skladom'})
    vs = sorted({v['grams']: v for v in vs}.values(), key=lambda v: v['grams'])
    if not vs: print('VYRADENÉ (bez overenej ceny/skladu)', name); continue
    roast = field(t, 'Praženie:'); tones = field(t, 'Chuťový profil:')
    taste = next((k for rx, k in ROAST if re.search(rx, roast, re.I)), None)
    if not taste or not tones: print('VYRADENÉ (chýba praženie/tóny)', name, roast, tones); continue
    area = field(t, 'Krajina:') or field(t, 'Oblasť:')
    cname = next((c for c in CO if c.lower() in area.lower()), None)
    proc = field(t, 'Spracovanie:') or (re.search(r'ARABICA - ([a-z ,]+?) (?:výberová|Limitovaná)', t) or [None, ''])[1]
    preps = sorted({'espresso'} if path in ESP else set()) + (['filter'] if path in FIL else [])
    prof = [{'name': 'Praženie', 'text': roast}]
    for k in ('Acidita', 'Telo', 'Chuť'):
        m = re.search(k + r': (\d)/5', t)
        if m: prof.append({'name': k, 'text': m.group(1) + '/5'})
    img = (re.search(r'<meta property="og:image" content="([^"]+)"', raw) or [None, None])[1]
    desc = field(t, '"', stop=r'"')
    products.append({'id': slug, 'kind': 'coffee', 'name': name, 'url': url, 'photo': photo(SLUG, html.unescape(img) if img else None, slug), 'photoRemote': False,
        'currency': 'EUR', 'available': True, 'decaf': 'decaf' in slug, 'preps': preps, 'roastLabel': re.split(r' - | \(', roast)[0].strip(), 'prepText': field(t, 'Odporúčaná príprava:'),
        'taste': taste, 'tastes': [taste], 'tasteSource': 'karta produktu: praženie ' + roast + '; chuťový profil ' + tones,
        'tasteProfile': prof, 'notes': [n.strip() for n in tones.split(',') if n.strip()][:4], 'origin': CO[cname][0] if cname else '', 'region': CO[cname][1] if cname else None,
        'process': re.split(r' - ', proc)[0].strip() or None, 'variety': None, 'summary': '',
        'priceFrom': vs[0]['price'], 'priceTo': max(v['price'] for v in vs), 'weights': [v['grams'] for v in vs], 'variants': vs, 'checkedAt': CHECKED,
        'source': {'url': url, 'verifiedAt': CHECKED, 'facts': 'kategória e-shopu (espresso/filter), praženie, chuťový profil, oblasť, spracovanie; ceny a sklad variant'}})
products = [p for p in products if p['photo']][:25]
DATA = {'slug': SLUG, 'price100': 'cents', 'lang': 'sk', 'checkedAt': CHECKED, 'beansOnly': True, 'altFallback': True, 'demo': {'heroProductId': products[0]['id']},
  'brand': {'name': 'Padmé Roastery', 'legal': 'Padmé Roastery, s.r.o.', 'place': 'Padmé · pražiareň výberovej kávy z Gemera', 'shopUrl': WEB + '/e-shop/', 'web': WEB + '/',
            'logo': '/assets/s3/padme/logo.png', 'hero': products[0]['photo'], 'contact': 'padme.roastery@gmail.com', 'contactSource': WEB + '/kontakt/',
            'theme': {'ink': '#22201d', 'brand': '#22201d', 'accent': '#b08d57', 'soft': '#f5f1ea', 'paper': '#ffffff'}},
  'tasteLabels': {'choco': ['Klasické espresso', 'Praženie Old School Espresso podľa pražiarne'], 'fruitFull': ['Moderné espresso', 'Praženie New Wave / Espresso roast podľa pražiarne'],
                  'fresh': ['Svetlé praženie', 'Praženie na filter (svetlé) podľa pražiarne'], 'decaf': ['Bez kofeínu', 'Káva aj na večer']},
  'scope': f'{len(products)} zrnkových káv z e-shopu padmeroastery.sk ({CHECKED}), ceny a sklad presných balení.',
  'excluded': ['sety (duo, trio, four pack, box, tasting pack)', 'matcha, mochi a príslušenstvo'],
  'addons': {}, 'shop': {'freeShipping': 'Doprava zdarma nad 60 €.', 'shippingNote': '', 'freeShippingSource': WEB + '/doprava-a-platba/'},
  'chips': ['Káva na espresso', 'Káva na filter', 'Porovnať 2 kávy', 'Máte kávu bez kofeínu?'], 'commercialNote': '', 'products': products, 'sets': [], 'held': []}
write_coffee(SLUG, DATA, 'Padmé Roastery – séria 4 (447 € + 10 €/mes.): katalóg z e-shopu padmeroastery.sk (' + CHECKED + '). Vygenerované: tools/s4/build_padme.py.')
for p in products: print(p['name'], p['preps'], p['taste'], p['roastLabel'], p['notes'], p['origin'], p['process'], [(v['grams'], v['price']) for v in p['variants']], p['decaf'], p['photo'])
