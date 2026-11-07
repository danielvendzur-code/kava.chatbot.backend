"""Séria 4 – MYDLOVE (mydlove.com, WooCommerce; Thermae s.r.o., IČO 50 828 908, Trenčianske Teplice) v natívnom poradcovi Andreine.
Zdroj: verejné WooCommerce Store API e-shopu (/wp-json/wc/store/v1/products) – názov, cena, sklad, kategórie, atribúty „Typ vlasov“,
„Typ pleti“, „Vôňa“ a fotka produktu; stav 2026-11-07. Výber 25 produktov: tuhé šampóny a kondicionéry, čistenie pleti, toniká,
sérum a olej, zlupovacie masky, telové maslá a náplne dezodorantov. Mini a vzorky, sety, darčeky, sviečky, doplnky a produkty so
zdravotnými tvrdeniami v názve (hydroláty „anti-aging“, „protizápalový“) sa nepreberajú.
Krok „Typ a zameranie“ = vlastnosť z názvu alebo atribútu e-shopu (typ vlasov, druh čistenia, zložka uvedená v názve, vôňa).
python3 -I tools/s4/build_mydlove.py DIR_S_all.json"""
import sys, os, re, json, html
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 's3a'))
from common import photo
DIR = sys.argv[1]; CHECKED = '2026-11-07'; SLUG = 'mydlove'; WEB = 'https://www.mydlove.com'
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
P = {html.unescape(p['name']).strip(): p for p in json.load(open(f'{DIR}/all.json'))}
# (presný názov v e-shope, oblasť, druh, zameranie, krátka neutrálna veta)
PICK = [
 ('Tuhý šampón citrus & borovica – jemné vlasy 60g', 's4Hair', 'Tuhý šampón', 's4HFine', 'Tuhý šampón, ktorý e-shop uvádza pre jemné vlasy.'),
 ('Tuhý šampón s aktívnym uhlím – extra mastné vlasy 60g', 's4Hair', 'Tuhý šampón', 's4HOily', 'Tuhý šampón s aktívnym uhlím, e-shop ho uvádza pre mastné vlasy.'),
 ('Tuhý šampón s jemnou mätou a aloe vera – suché vlasy 60g', 's4Hair', 'Tuhý šampón', 's4HDry', 'Tuhý šampón s mätou a aloe vera, e-shop ho uvádza pre suché vlasy.'),
 ('Tuhý šampón so sírou a levanduľovým olejom – lupiny & seborea', 's4Hair', 'Tuhý šampón', 's4HScalp', 'Tuhý šampón so sírou a levanduľovým olejom; e-shop ho zaraďuje k typu vlasov „lupiny / seborea“.'),
 ('Tuhý šampón s kofeínom a marockým ílom – rast vlasov 60g', 's4Hair', 'Tuhý šampón', 's4HCaffeine', 'Tuhý šampón s kofeínom a marockým ílom, e-shop ho uvádza pre jemné, mastné aj normálne vlasy.'),
 ('Tuhý kondicionér levanduľa – jemné vlasy 50g', 's4Hair', 'Tuhý kondicionér', 's4CFine', 'Tuhý kondicionér s levanduľou, e-shop ho uvádza pre jemné vlasy.'),
 ('Tuhý kondicionér gerániová ruža – suché, farbené vlasy 50g', 's4Hair', 'Tuhý kondicionér', 's4CDry', 'Tuhý kondicionér s gerániovou ružou, e-shop ho uvádza pre suché a farbené vlasy.'),
 ('Jemný čistiaci oil-to-milk pleťový gél 50ml', 's4Face', 'Čistenie pleti', 's4CleanGentle', 'Čistiaci gél, ktorý sa pri kontakte s vodou mení na mlieko – jemná verzia.'),
 ('Sírny oil-to-milk pleťový čistiaci gél 50ml', 's4Face', 'Čistenie pleti', 's4CleanSulfur', 'Čistiaci oil-to-milk gél so sírou.'),
 ('Exfoliačný oil-to-milk pleťový čistiaci gél 50ml', 's4Face', 'Čistenie pleti', 's4CleanExfo', 'Čistiaci oil-to-milk gél s exfoliačnou zložkou.'),
 ('Jemné hydratačné pleťové tonikum ORYZA 100ml', 's4Face', 'Pleťové tonikum', 's4TonOryza', 'Tonikum ORYZA; e-shop ho opisuje ako šetrné aj k veľmi citlivej pleti.'),
 ('Rozjasňujúce pleťové tonikum KOMBUCHA GLOW 100ml', 's4Face', 'Pleťové tonikum', 's4TonKombucha', 'Tonikum s kombuchou.'),
 ('PEAT rašelinové hydratačné sérum s niacínamidom', 's4Face', 'Sérum a olej', 's4Serum', 'Hydratačné sérum s rašelinou a niacínamidom.'),
 ('ESPLANADE pleťový olej', 's4Face', 'Sérum a olej', 's4FaceOil', 'Pleťový olej so šípkovým olejom.'),
 ('PEAT – zlupovacia upokojujúca alginátová maska s rašelinou 12g', 's4Face', 'Zlupovacia maska', 's4MaskPeat', 'Zlupovacia alginátová maska s rašelinou, jedno použitie.'),
 ('SINA – zlupovacia čistiaca alginátová maska so sírou 12g', 's4Face', 'Zlupovacia maska', 's4MaskSulfur', 'Zlupovacia alginátová maska so sírou, jedno použitie.'),
 ('BIO nerafinované bambucké maslo 50g', 's4Body', 'Bambucké maslo', 's4BShea', 'Nerafinované bambucké maslo; e-shop ho uvádza pre citlivú, detskú aj suchú pokožku.'),
 ('Šľahané telové maslo „Fresh lemon“ 150ml', 's4Body', 'Šľahané telové maslo', 's4BLemon', 'Šľahané telové maslo s citrusovou vôňou, e-shop ho uvádza pre suchú pokožku.'),
 ('Šľahané telové maslo „Vanilla bean“ 150ml', 's4Body', 'Šľahané telové maslo', 's4BVanilla', 'Šľahané telové maslo so sladkou vanilkovou vôňou, e-shop ho uvádza pre suchú pokožku.'),
 ('Šľahané telové maslo „Sakura bloom“ 150ml', 's4Body', 'Šľahané telové maslo', 's4BFloral', 'Šľahané telové maslo s kvetinovou vôňou, e-shop ho uvádza pre suchú pokožku.'),
 ('Šľahané telové maslo „Pomaranč & škorica“ 150ml', 's4Body', 'Šľahané telové maslo', 's4BSpice', 'Šľahané telové maslo s vôňou pomaranča a škorice, e-shop ho uvádza pre suchú pokožku.'),
 ('Dezodorant citrus & borovica – náplň 15g', 's4Deo', 'Dezodorant – náplň', 's4DCitrus', 'Náplň tuhého dezodorantu s vôňou citrusov a borovice.'),
 ('Dezodorant gerániova ruža – náplň 15g', 's4Deo', 'Dezodorant – náplň', 's4DGeranium', 'Náplň tuhého dezodorantu s vôňou gerániovej ruže.'),
 ('Dezodorant jemná mäta – náplň 15g', 's4Deo', 'Dezodorant – náplň', 's4DMint', 'Náplň tuhého dezodorantu s vôňou mäty.'),
 ('Dezodorant neutral – náplň 15g', 's4Deo', 'Dezodorant – náplň', 's4DNeutral', 'Náplň tuhého dezodorantu vo verzii neutral.'),
]
APP = P['Aplikátor na dezodorant']
CAT = {'s4Face': 'face', 's4Hair': 'hair'}
TAG = {'s4HDry': ['dry'], 's4CDry': ['dry'], 's4HOily': ['oily'], 's4TonOryza': ['sensitive'], 's4BShea': ['sensitive', 'dry']}
out = []
for name, use, kind, focus, sent in PICK:
    p = P.get(name) or next((v for k, v in P.items() if k.replace('“', '"').replace('„', '"') == name.replace('“', '"').replace('„', '"')), None)
    if not p: print('NENÁJDENÉ', name); continue
    if not p['is_in_stock']: print('VYRADENÉ (nie je skladom)', name); continue
    price = int(p['prices']['price']) / 10 ** p['prices']['currency_minor_unit']
    vol = (re.search(r'(\d+\s?(?:ml|g))\s*$', name) or [None, ''])[1]
    pid = p['slug']
    img = p['images'][0]['src'] if p['images'] else None
    desc = sent + (' Aplikátor sa kupuje raz zvlášť (' + f"{int(APP['prices']['price']) / 100:.2f}".replace('.', ',') + ' €).' if use == 's4Deo' else '')
    attrs = {a['name']: [t['name'] for t in a['terms']] for a in p['attributes']}
    out.append({'id': pid, 'name': re.sub(r'\s+\d+\s?(?:ml|g)$', '', name), 'url': p['permalink'], 'priceAmount': price, 'currency': 'EUR', 'price': f'{price:.2f}'.replace('.', ',') + ' €', 'volume': vol, 'variantLabel': '',
        'category': CAT.get(use, 'body'), 'kind': kind, 'tags': TAG.get(focus, []), 'photo': photo(SLUG, img, pid), 'available': True, 'isSample': False, 'description': desc, 'reason': desc,
        'source': {'url': p['permalink'], 'verifiedAt': CHECKED, 'stock': 'InStock', 'categoryLocked': True, 'kindLocked': True, 'priceFrom': False, 'sku': p.get('sku'),
                   'selectionTraits': {'careUse': use, 'purpose': use, 'skinFocus': focus},
                   'selectionTraitsEvidence': 'názov produktu a atribúty e-shopu mydlove.com: ' + '; '.join(f'{k}: {", ".join(v)}' for k, v in attrs.items() if k in ('Typ vlasov', 'Typ pleti', 'Vôňa')) ,
                   'suitabilityEvidence': {t: 'atribút e-shopu / názov produktu' for t in TAG.get(focus, [])},
                   'suitabilitySource': 'atribúty e-shopu „Typ vlasov“, „Typ pleti“, „Vôňa“ a názov produktu', 'descriptionSource': 'neutrálna veta z názvu a atribútov e-shopu bez zdravotných tvrdení', 'allSkinTypes': False}})
out = [p for p in out if p['photo']][:25]
# Doplnok „Doplňte svoju rutinu“ iba k produktom, ku ktorým ho firma páruje (rovnaké mapovanie ako upsellFocus v registri).
UF = json.load(open(f'{ROOT}/tools/s3a/registry.json'))['demos'].get(SLUG, {}).get('upsellFocus', {})
foc = lambda p: p['source']['selectionTraits']['skinFocus']
for x in out: x['source']['complementForProductUrls'] = [p['url'] for p in out if foc(x) in UF.get(foc(p), [])]
cat = {'verifiedAt': CHECKED + 'T10:00:00Z', 'source': WEB + '/', 'collectionMethod': 'WooCommerce Store API e-shopu mydlove.com (názov, cena, sklad, kategórie, atribúty), ' + CHECKED,
       'excluded': ['mini balenia a vzorky', 'sety, darčeky a vianočné balíčky', 'sviečky, uteráky, doplnky a saunovanie', 'hydroláty so zdravotným tvrdením v názve', 'aplikátor dezodorantu (uvedený pri náplni)'], 'products': out}
open(f'{ROOT}/catalogues/{SLUG}.js', 'w').write('/* Séria 4 – MYDLOVE: ' + str(len(out)) + ' dostupných produktov (' + CHECKED + '). Generované: tools/s4/build_mydlove.py. */\nglobalThis.CX_CATALOGUES ||= {};\nglobalThis.CX_CATALOGUES["' + SLUG + '"] = ' + json.dumps(cat, ensure_ascii=False) + ';\n')
for p in out: print(p['name'], '|', p['source']['selectionTraits']['careUse'], p['source']['selectionTraits']['skinFocus'], p['price'], p['volume'], p['photo'])
