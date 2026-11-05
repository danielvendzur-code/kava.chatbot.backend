"""Séria 3 (Andreine) – LaPrazirna (laprazirna.cz, specSHOP s.r.o.). Zdroj: kategórie Káva (výběrová, single origin, office směs, bezkofeinová);
každé balenie (250 g / 1 kg) má vlastnú stránku produktu s cenou a skladom (schema.org). „Kávový profil“: Kyselost (bodová škála 0–5),
Stupeň pražení, Chuť; vhodná příprava z popisu. Kapsle, degustační a vánoční balíčky sa nepreberajú; „Limitka GOLD“ = rovnaký profil ako GOLD → raz.
python3 -I tools/s3a/build_laprazirna.py DIR_S_HTML"""
import sys, os, re, glob, html as H
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import sentences, photo, write_coffee
DIR = sys.argv[1]; CHECKED = '2026-11-05'; SLUG = 'laprazirna'; WEB = 'https://www.laprazirna.cz'
REG = {'Brazílie': 'americas', 'Guatemala': 'americas', 'Nikaragua': 'americas', 'Peru': 'americas', 'Etiopie': 'africa', 'Uganda': 'africa', 'Indie': 'asia'}
def pipes(h):
    t = re.sub(r'<(script|style)[^>]*>.*?</\1>', '', h, flags=re.S); t = H.unescape(re.sub(r'<[^>]+>', ' | ', t))
    return re.sub(r'(\s*\|\s*)+', ' | ', re.sub(r'[ \t\r\n\xa0]+', ' ', t))
def dots(h, lab):
    i = h.find('>' + lab + '</span>')
    return h[i:i + 700].split('</div>')[0].count('dot-active') if i > 0 else None
def page(slug):
    f = f'{DIR}/{slug}.html'
    if not os.path.exists(f): return None
    h = open(f, encoding='utf-8', errors='replace').read()
    pr = re.search(r'"price":\s*([\d.]+)', h)
    return (h, float(pr.group(1))) if pr and 'InStock' in h else None
products = []
for f in sorted(glob.glob(DIR + '/laprazirna-*-250-g.html')):
    base = os.path.basename(f)[:-11]
    if re.search(r'kapsle|balicek|limitka-gold', base): print('MIMO', base); continue
    h = open(f, encoding='utf-8', errors='replace').read(); t = pipes(h)
    name = re.sub(r'\s*250 g$', '', H.unescape(re.sub(r'<[^>]+>', '', re.search(r'<h1[^>]*>(.*?)</h1>', h, re.S).group(1))).strip())
    k = dots(h, 'Kyselost')
    chm = re.search(r'>Chuť</span>\s*<span class="coffee-profile-value[^"]*">(.*?)</span>', h, re.S)
    chut = re.sub(r'\s+', ' ', H.unescape(re.sub('<[^>]+>', '', chm.group(1)))).strip() if chm else ''
    raw = re.split(r'\s*(?:,|&|–|;| a )\s*', re.sub(r'^sladká káva\s*', '', chut))
    notes = [re.sub(r'^(?:náznak|minimální)\s+', '', n.strip(' .').lower()) for n in raw if n.strip(' .') and not re.search(r'výrazn|jemn|hladk|vyvážen|profil|plné tělo|svíravost|^d', n)][:4]
    desc = (re.search(r'Kávový profil \| --> \| (.*?) \| Původ \|', t) or [None, ''])[1]
    desc = re.sub(r'\s+([.,!?])', r'\1', re.sub(r'\s*\|\s*', ' ', desc)).strip()
    lead = ' '.join(re.findall(r'\| ([^|]{10,120}) \|', (re.search(re.escape(name) + r' 250 g \| (.*?) \| Vyberte balení', t) or [None, ''])[1]))
    prep_txt = (lead + ' ' + desc).lower()
    preps = ['espresso'] + (['filter'] if re.search(r'\bfiltr(?!ac)|v60|alternativn|french|aeropress|překapáv', prep_txt) else [])
    FIX = {'ovocité': 'ovocné podtóny', 'červeného vína': 'červené víno', 'exotické ovoc': 'exotické ovoce', 'sladké ovocné': 'sladké ovoce', 'nasládlá': 'nasládlá chuť'}
    notes = [FIX.get(n, n) for n in notes] or ([chut.lower()] if chut else [])
    taste = None if k is None else 'fresh' if k >= 4 else 'choco' if k <= 1 else 'fruitFull'
    if taste is None or not notes: print('VYRADENÉ (profil chýba)', name, k, chut); continue
    vs = []
    for size, grams in (('250-g', 250), ('1-kg', 1000)):
        pg = page(f'{base}-{size}')
        if pg: vs.append({'grams': grams, 'grind': 'zrnková', 'price': pg[1], 'url': f'{WEB}/e-shop/{base}-{size}', 'available': True, 'verifiedAt': CHECKED,
                          'source': 'stránka balení na laprazirna.cz (' + CHECKED + '), schema.org InStock'})
    if not vs: print('VYRADENÉ (nie skladom)', name); continue
    origin = (re.search(r'Původ \| ([^|]+)', t) or [None, ''])[1].strip()
    comp = (re.search(r'Složení \| ([^|]+)', t) or [None, ''])[1].strip()
    blend = '/' in origin or ',' in origin and 'oblast' not in origin or 'Robusta' in comp or 'Robusta' in lead
    decaf = 'dekaf' in base
    img = (re.search(r'og:image" content="([^"]+)"', h) or [None, None])[1]
    products.append({'id': base, 'kind': 'coffee', 'name': name, 'url': vs[0]['url'], 'photo': photo(SLUG, H.unescape(img) if img else None, base), 'photoRemote': False,
        'currency': 'CZK', 'available': True, 'decaf': decaf, 'preps': preps, 'roastLabel': '', 'prepText': None,
        'taste': taste, 'tastes': [taste], 'tasteSource': f'kávový profil e-shopu: kyselost {k}/5',
        'notes': notes, 'origin': origin[:90], 'region': 'blend' if blend else REG.get(origin.split(',')[0].strip()), 'process': None, 'variety': comp or None,
        'summary': sentences(desc, 2), 'priceFrom': min(v['price'] for v in vs), 'priceTo': max(v['price'] for v in vs), 'weights': sorted({v['grams'] for v in vs}), 'variants': vs, 'checkedAt': CHECKED,
        'source': {'url': vs[0]['url'], 'verifiedAt': CHECKED, 'facts': 'kávový profil (kyselost, chuť), původ, složení a popis produktu; cena a sklad každého balení zvlášť'}})
products = [p for p in products if p['photo']][:25]
DATA = {'slug': SLUG, 'lang': 'cs', 'checkedAt': CHECKED, 'beansOnly': True, 'altFallback': True, 'demo': {'heroProductId': products[0]['id']},
  'brand': {'name': 'LaPrazirna', 'legal': 'specSHOP s.r.o.', 'place': 'LaPrazirna · lokální pražírna, Pardubice', 'shopUrl': WEB + '/e-shop/kava', 'web': WEB + '/',
            'logo': '/assets/s3/laprazirna/logo.png', 'hero': products[0]['photo'], 'contact': '', 'contactSource': WEB + '/',
            'theme': {'ink': '#1c1c1c', 'brand': '#1c1c1c', 'accent': '#b3122a', 'soft': '#f6f0ea', 'paper': '#ffffff'}},
  'tasteLabels': {'choco': ['Bez kyselosti', 'Čokoláda, karamel, plné tělo'], 'fruitFull': ['Jemně kyselá', 'Sladká, oříšky, kakao'], 'fresh': ['Ovocnější', 'Vyšší kyselost, ovoce'], 'decaf': ['Bez kofeinu', 'Káva i na večer']},
  'scope': f'{len(products)} zrnkových káv z e-shopu laprazirna.cz ({CHECKED}), ceny a sklad každého balení (250 g, 1 kg).',
  'excluded': ['kávové kapsle', 'degustační a vánoční balíčky', 'šálky'],
  'shop': {'freeShipping': '', 'shippingNote': '', 'freeShippingSource': WEB + '/'},
  'chips': ['Káva do automatu', 'Na cappuccino', 'Co je méně kyselé?', 'Máte kávu bez kofeinu?'], 'commercialNote': '', 'products': products, 'sets': [], 'held': []}
write_coffee(SLUG, DATA, 'LaPrazirna – séria 3 (447 € + 10 €/měs.): katalog z e-shopu laprazirna.cz (' + CHECKED + '). Vygenerováno: tools/s3a/build_laprazirna.py.')
for p in products: print(p['name'], p['preps'], p['taste'], p['notes'], [(v['grams'], v['price']) for v in p['variants']], p['origin'], p['region'], p['decaf'])
