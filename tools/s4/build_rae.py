"""Séria 4 – RaE přírodní kosmetika (raekosmetika.cz, WooCommerce; provozovatel KULISH RADOMÍR s.r.o., IČO 28569725, Návsí).
Zdroj: verejné WooCommerce Store API e-shopu (/wp-json/wc/store/v1/products, varianty /products/<id>) – názov, cena, sklad, kategórie,
fotka; stav 2026-11-08. Výber 18 produktov: tuhé deodoranty (so sódou a bez sódy), bambucké telové maslá, hydratačné mlieka.
Zameranie = vôňa alebo zložka z názvu produktu. Parfémy (vône s vlastnými názvami Amante, Fantazie, Corsaire), testery, darčekové balíčky,
náplne, sviečky a suroviny sa nepreberajú; vône bez pravdivej fotky (indický lotos, cashmere, papaya, divoká višeň) tiež nie.
python3 -I tools/s4/build_rae.py DIR_S_all.json"""
import sys, os, re, json, html, subprocess
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 's3a'))
from common import photo
DIR = sys.argv[1]; CHECKED = '2026-11-08'; SLUG = 'rae'; WEB = 'https://www.raekosmetika.cz'
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
norm = lambda s: re.sub(r'\s+', ' ', html.unescape(s)).strip().lower()
P = json.load(open(f'{DIR}/all.json'))
def find(prefix, cat=None):
    c = [p for p in P if norm(p['name']).startswith(norm(prefix)) and (not cat or any(cat in html.unescape(x['name']) for x in p['categories']))]
    return c[0] if c else None
# (začiatok názvu v e-shope, kategória e-shopu, oblasť, druh, zameranie, krátka veta)
PICK = [
 ('Přírodní deodorant BEZ SODY santalové dřevo', 'bez sody', 's4Deo', 'Tuhý deodorant bez sody', 's4DSantal', 'Tuhý deodorant bez sody s vůní santalového dřeva.'),
 ('Přírodní deodorant BEZ SODY vanilka orchidej', 'bez sody', 's4Deo', 'Tuhý deodorant bez sody', 's4DVanilla', 'Tuhý deodorant bez sody s vůní vanilky a orchideje.'),
 ('Přírodní deodorant BEZ SODY citrónová tráva', 'bez sody', 's4Deo', 'Tuhý deodorant bez sody', 's4DLemongrass', 'Tuhý deodorant bez sody s vůní citronové trávy.'),
 ('Přírodní deodorant BEZ SODY bylinky', 'bez sody', 's4Deo', 'Tuhý deodorant bez sody', 's4DHerbs', 'Tuhý deodorant bez sody s bylinkovou vůní.'),
 ('Přírodní deodorant BEZ SODY aloe vera', 'bez sody', 's4Deo', 'Tuhý deodorant bez sody', 's4DAloe', 'Tuhý deodorant bez sody s aloe vera.'),
 ('Přírodní tuhý deodorant LEVANDULE', 'Tuhé deodoranty', 's4Deo', 'Tuhý deodorant', 's4DLavender', 'Tuhý deodorant s vůní levandule.'),
 ('Přírodní tuhý deodorant JASMÍN', 'Tuhé deodoranty', 's4Deo', 'Tuhý deodorant', 's4DJasmine', 'Tuhý deodorant s vůní jasmínu.'),
 ('Přírodní tuhý deodorant GREP', 'Tuhé deodoranty', 's4Deo', 'Tuhý deodorant', 's4DGrapefruit', 'Tuhý deodorant s vůní grepu.'),
 ('Přírodní tuhý deodorant KOKOS- VANILKA', 'Tuhé deodoranty', 's4Deo', 'Tuhý deodorant', 's4DCoconut', 'Tuhý deodorant s vůní kokosu a vanilky.'),
 ('Přírodní tuhý deodorant ŠALVĚJ', 'Tuhé deodoranty', 's4Deo', 'Tuhý deodorant', 's4DSage', 'Tuhý deodorant s vůní šalvěje.'),
 ('Přírodní tuhý deodorant bez parfemace', 'Tuhé deodoranty', 's4Deo', 'Tuhý deodorant', 's4DFree', 'Tuhý deodorant, e-shop ho uvádí jako bez parfemace.'),
 ('Přírodní tuhý deodorant CITRÓNOVÁ TRÁVA', 'Tuhé deodoranty', 's4Deo', 'Tuhý deodorant', 's4DLemongrass2', 'Tuhý deodorant s vůní citronové trávy.'),
 ('Bambucké tělové máslo s vůní bylinek', 'Bambucká', 's4Body', 'Bambucké tělové máslo', 's4BHerbs', 'Bambucké tělové máslo s bylinkovou vůní.'),
 ('Bambucké tělové máslo s levandulí', 'Bambucká', 's4Body', 'Bambucké tělové máslo', 's4BLavender', 'Bambucké tělové máslo s levandulí.'),
 ('Bambucké tělové máslo s konopným olejem', 'Bambucká', 's4Body', 'Bambucké tělové máslo', 's4BHemp', 'Bambucké tělové máslo s konopným olejem.'),
 ('Bambucké tělové máslo s vůní vanilky a orchideje', 'Bambucká', 's4Body', 'Bambucké tělové máslo', 's4BVanilla', 'Bambucké tělové máslo s vůní vanilky a orchideje.'),
 ('HydratačnÍ pleťové a tělové mléko citrónová tráva', 'Hydratační', 's4Body', 'Hydratační mléko na pleť a tělo', 's4MLemongrass', 'Hydratační mléko na pleť i tělo s vůní citronové trávy.'),
 ('HydratačnÍ pleťové a tělové mléko bylinky', 'Hydratační', 's4Body', 'Hydratační mléko na pleť a tělo', 's4MHerbs', 'Hydratační mléko na pleť i tělo s bylinkovou vůní.'),
]
def variants(p):
    out = []
    for v in p.get('variations', []):
        r = subprocess.run(['curl', '-sL', '--max-time', '30', f"{WEB}/wp-json/wc/store/v1/products/{v['id']}"], capture_output=True, text=True)
        try: d = json.loads(r.stdout)
        except Exception: continue
        if d.get('is_in_stock'): out.append({'label': 'obsah ' + v['attributes'][0]['value'].strip(), 'price': float(d['prices']['price'])})
    return sorted({x['label']: x for x in out}.values(), key=lambda x: x['price'])
out = []
for prefix, cat, use, kind, focus, sent in PICK:
    p = find(prefix, cat)
    if not p: print('NENÁJDENÉ', prefix); continue
    if not p['is_in_stock']: print('VYRADENÉ (nie je skladom)', prefix); continue
    vs = variants(p) if p['type'] == 'variable' else []
    price = vs[0]['price'] if vs else float(p['prices']['price'])
    name = re.sub(r'\s+', ' ', html.unescape(p['name'])).strip()
    name = re.sub(r'\s*–?\s*\d+\s*-\s*\d+\s*ml$', '', name).replace('HydratačnÍ', 'Hydratační').replace('KOKOS- VANILKA', 'KOKOS-VANILKA')
    vol = (re.search(r'(\d+(?:,\d+)?\s?ml)\s*$', name, re.I) or [None, ''])[1]
    name = re.sub(r'\s*–?\s*\d+(?:,\d+)?\s?ml\s*$', '', name, flags=re.I).strip(' –')
    img = p['images'][0]['src'] if p['images'] else None
    pid = p['slug']
    out.append({'id': pid, 'name': name, 'url': p['permalink'], 'priceAmount': price, 'currency': 'CZK', 'price': f'{price:.0f} Kč', 'volume': vol.replace(' ', ' ').upper().replace('ML', 'ml') if vol else '', 'variantLabel': '',
        'category': 'body', 'kind': kind, 'tags': [], 'photo': photo(SLUG, img, pid), 'available': True, 'isSample': False, 'description': sent, 'reason': sent,
        'source': {'url': p['permalink'], 'verifiedAt': CHECKED, 'stock': 'InStock', 'categoryLocked': True, 'kindLocked': True, 'priceFrom': len(vs) > 1, 'priceMax': max([x['price'] for x in vs] or [price]),
                   'variants': vs, 'sku': p.get('sku'), 'selectionTraits': {'careUse': use, 'purpose': use, 'skinFocus': focus},
                   'selectionTraitsEvidence': 'název produktu a kategorie e-shopu raekosmetika.cz: ' + ', '.join(html.unescape(c['name']) for c in p['categories']),
                   'suitabilitySource': 'kategorie e-shopu a název produktu (vůně, příchuť, bez sody)', 'descriptionSource': 'neutrální věta z názvu produktu bez zdravotních tvrzení', 'allSkinTypes': False}})
out = [p for p in out if p['photo']][:25]
UF = json.load(open(f'{ROOT}/tools/s3a/registry.json'))['demos'].get(SLUG, {}).get('upsellFocus', {})
foc = lambda p: p['source']['selectionTraits']['skinFocus']
for x in out: x['source']['complementForProductUrls'] = [p['url'] for p in out if foc(x) in UF.get(foc(p), [])]
cat = {'verifiedAt': CHECKED + 'T08:00:00Z', 'source': WEB + '/', 'collectionMethod': 'WooCommerce Store API e-shopu raekosmetika.cz (název, cena, sklad, kategorie, varianty), ' + CHECKED,
       'excluded': ['parfémy s vlastními názvy vůní', 'testery, dárkové balíčky, náhradní náplně, svíčky, suroviny a doplňky', 'vůně bez pravdivé popisné fotky (indický lotos, cashmere, papaya, divoká višeň)', 'balzámy na rty – e-shop má každý balzám dvakrát s různou cenou (125 a 160 Kč), cena není jednoznačná'], 'products': out}
open(f'{ROOT}/catalogues/{SLUG}.js', 'w').write('/* Séria 4 – RaE: ' + str(len(out)) + ' dostupných produktů (' + CHECKED + '). Generováno: tools/s4/build_rae.py. */\nglobalThis.CX_CATALOGUES ||= {};\nglobalThis.CX_CATALOGUES["' + SLUG + '"] = ' + json.dumps(cat, ensure_ascii=False) + ';\n')
for p in out: print(p['name'], '|', foc(p), p['price'], p['volume'], p['source']['variants'], p['photo'])
