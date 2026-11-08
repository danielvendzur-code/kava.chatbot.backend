"""Séria 4 – VAANOK (vaanok.sk, WooCommerce; VAAN, s. r. o., IČO 35 920 581, Bratislava; výroba Senec) v natívnom poradcovi Andreine.
Zdroj: verejné WooCommerce Store API e-shopu (/wp-json/wc/store/v1/products a varianty) – názov, cena a sklad každej veľkosti,
kategórie e-shopu vrátane typov pleti (citlivá, mastná, mdlá a unavená, suchá, zmiešaná, zrelá, všetky typy pleti) a fotka; stav 2026-11-08.
Krok 1 = skupina podľa kategórií e-shopu (séra a pleťové balzamy / čistenie a hydroláty / ílové masky / telo).
Krok 2 = konkrétny produkt; podnadpis uvádza presne tie typy pleti, do ktorých ho e-shop zaraďuje – „všetky typy pleti“ iba ak je produkt
v kategórii „Všetky typy pleti“ a zároveň vo všetkých šiestich typoch. Vety o produkte sú neutrálne, zo zložiek uvedených e-shopom.
Sety, darčeky, sviečky, soli do kúpeľa, detský olej, telový olej Večernica (zdravotné tvrdenia) a 10 ml cestovné veľkosti ako hlavná ponuka sa nepreberajú.
python3 -I tools/s4/build_vaanok.py DIR   (DIR/d/<id>.json = produkty, DIR/v/<id>.json = varianty)"""
import sys, os, re, json, html, glob
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 's3a'))
from common import photo
DIR = sys.argv[1]; CHECKED = '2026-11-08'; SLUG = 'vaanok'; WEB = 'https://vaanok.sk'
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
P = {p['id']: p for p in (json.load(open(f)) for f in glob.glob(f'{DIR}/d/*.json'))}
V = {v['id']: v for v in (json.load(open(f)) for f in glob.glob(f'{DIR}/v/*.json'))}
SK = {'citliva-plet': 'citlivá', 'mastna-plet': 'mastná', 'mdla-a-unavena-plet': 'mdlá a unavená', 'sucha-plet': 'suchá', 'zmiesana-plet': 'zmiešaná', 'zrela-plet': 'zrelá'}
# (id produktu, skupina, druh, zameranie, hlavná veľkosť, neutrálna veta zo zložiek uvedených e-shopom)
PICK = [
 (482, 's4FaceCare', 'Pleťové sérum', 's4Carokvet', '30 ml', 'Olejové sérum s piatimi kvetmi: ruža stolistá, nechtík, japonská čerešňa, lipa a kvet pomarančovníka horkého.'),
 (4158, 's4FaceCare', 'Pleťové sérum', 's4Rozjas', '30 ml', 'Ľahká zmes rastlinných olejov a botanických extraktov, e-shop ho nazýva rozjasňujúce.'),
 (481, 's4FaceCare', 'Pleťové sérum', 's4Harmon', '30 ml', 'Sérum zo za studena lisovaných olejov a rastlinných zložiek.'),
 (479, 's4FaceCare', 'Pleťové sérum', 's4Bobule', '30 ml', 'Sérum s výťažkami z čiernej ríbezle, čučoriedky, opuncie a malín.'),
 (799, 's4FaceCare', 'Pleťové sérum', 's4Men', '30 ml', 'Zmes rastlinných olejov pre mužov; podľa e-shopu sa hodí aj po holení.'),
 (1574, 's4FaceCare', 'Pleťový balzam', 's4BalmManuka', '30 g', 'Bohatý balzam s maslami cupuacu a murumuru, nechtíkom a manukou; podľa e-shopu na tvár aj telo.'),
 (1587, 's4FaceCare', 'Pleťový balzam', 's4BalmPropolis', '30 g', 'Balzam s propolisom, gurjunom, kadidlom, olejom z čiernej rasce a nechtíkom.'),
 (805, 's4Cleanse', 'Čistiaci olej', 's4CleanPremena', '50 ml', 'Čistiaci a odličovací olej, ktorý sa s vodou zmení na jemné mlieko.'),
 (806, 's4Cleanse', 'Čistiaci olej', 's4CleanSumrak', '50 ml', 'Čistiaci a odličovací olej z kombinácie výživných olejov.'),
 (803, 's4Cleanse', 'Hydrolát', 's4HydRuza', '50 ml', 'Hydrolát z ruže damašskej bez konzervantov, s kvetinovou vôňou.'),
 (801, 's4Cleanse', 'Hydrolát', 's4HydLipa', '50 ml', 'Kvetová voda z lipových kvetov so sladkou medovou vôňou.'),
 (802, 's4Cleanse', 'Hydrolát', 's4HydNeroli', '50 ml', 'Hydrolát z pomarančového kvetu v bio kvalite.'),
 (800, 's4Cleanse', 'Hydrolát', 's4HydHarman', '50 ml', 'Hydrolát z harmančeka pravého v organickej kvalite; podľa e-shopu na pleť, telo aj vlasy.'),
 (846, 's4Mask', 'Ílová maska', 's4MaskPink', '45 g', 'Maska z marockého a ružového ílu s acai, brusnicami a ibištekom.'),
 (847, 's4Mask', 'Ílová maska', 's4MaskGreen', '45 g', 'Maska zo zeleného a bieleho ílu so zeleným čajom.'),
 (848, 's4Mask', 'Ílová maska', 's4MaskWhite', '45 g', 'Jemná ílová maska s vôňou kokosu a banánov.'),
 (804, 's4Body', 'Telový olej', 's4BodyLipa', '50 ml', 'Telový olej s nechtíkom, brusnicou a vôňou lipy.'),
 (808, 's4Body', 'Telový olej', 's4BodyIris', '50 ml', 'Telový olej z botanických extraktov, Tajomný iris.'),
 (4364, 's4Body', 'Telový balzam', 's4BodyMimoza', '100 g', 'Ručne miešaný telový balzam bez vody a konzervantov.'),
 (3718, 's4Body', 'Telový balzam', 's4BodyArnika', '50 g', 'Telový balzam s macerátmi arniky, kostihoja, ľubovníka, nechtíka a slamienky, s drevito-bylinnou vôňou.'),
]
CAT = {'s4FaceCare': 'face', 's4Cleanse': 'face', 's4Mask': 'face', 's4Body': 'body'}
eur = lambda x: f'{x:.2f}'.replace('.', ',') + ' €'
out = []
for pid, use, kind, focus, size, sent in PICK:
    p = P[pid]
    cats = [c['slug'] for c in p['categories']]
    vs = []
    for ref in p.get('variations', []):
        v = V.get(ref['id'])
        if not v or not v['is_in_stock']: continue
        lab = re.sub(r'^.*?:\s*', '', html.unescape(str(v.get('variation') or '')))
        vs.append({'label': lab, 'price': int(v['prices']['price']) / 10 ** v['prices']['currency_minor_unit']})
    main = next((v for v in vs if v['label'].replace(' ', '') == size.replace(' ', '')), None)
    if not main: print('VYRADENÉ (veľkosť nie je skladom)', p['name'], size, vs); continue
    skins = [SK[c] for c in SK if c in cats]
    allsk = 'vsetky-typy-pleti' in cats and len(skins) == len(SK)
    tags = sorted({t for c, t in (('citliva-plet', 'sensitive'), ('sucha-plet', 'dry'), ('mastna-plet', 'oily')) if c in cats})
    others = [v for v in vs if v is not main]
    desc = sent + (' Ďalšie veľkosti: ' + ', '.join(f"{v['label']} za {eur(v['price'])}" for v in others) + '.' if others else '')
    name = re.sub(r'\s*[–-]\s*prírodné pleťové sérum$', ' – pleťové sérum', html.unescape(p['name']).strip())
    img = p['images'][0]['src'] if p['images'] else None
    out.append({'id': p['slug'], 'name': name, 'url': p['permalink'], 'priceAmount': main['price'], 'currency': 'EUR', 'price': eur(main['price']), 'volume': size, 'variantLabel': size,
        'category': CAT[use], 'kind': kind, 'tags': tags, 'photo': photo(SLUG, img, p['slug']), 'available': True, 'isSample': False, 'description': desc, 'reason': desc,
        'source': {'url': p['permalink'], 'verifiedAt': CHECKED, 'stock': 'InStock', 'categoryLocked': True, 'kindLocked': True, 'priceFrom': False, 'variants': vs,
                   'selectionTraits': {'careUse': use, 'purpose': use, 'skinFocus': focus},
                   'selectionTraitsEvidence': 'kategórie e-shopu vaanok.sk: ' + ', '.join(cats),
                   'suitabilityEvidence': {t: 'kategória e-shopu „' + {'sensitive': 'Citlivá pleť', 'dry': 'Suchá pleť', 'oily': 'Mastná pleť'}[t] + '“' for t in tags},
                   'suitabilitySource': 'kategórie e-shopu podľa typu pleti', 'descriptionSource': 'neutrálna veta zo zložiek uvedených e-shopom, bez zdravotných tvrdení',
                   'allSkinTypes': allsk, 'skinTypesListed': skins}})
out = [p for p in out if p['photo']][:25]
UF = json.load(open(f'{ROOT}/tools/s3a/registry.json'))['demos'].get(SLUG, {}).get('upsellFocus', {})
foc = lambda p: p['source']['selectionTraits']['skinFocus']
for x in out: x['source']['complementForProductUrls'] = [p['url'] for p in out if foc(x) in UF.get(foc(p), [])]
cat = {'verifiedAt': CHECKED + 'T10:00:00Z', 'source': WEB + '/', 'collectionMethod': 'WooCommerce Store API e-shopu vaanok.sk (názov, cena a sklad veľkostí, kategórie vrátane typu pleti), ' + CHECKED,
       'excluded': ['darčekové a testovacie sady', 'sviečky a soli do kúpeľa', 'detský telový olej', 'telový olej Večernica (zdravotné tvrdenia v popise)', '10 ml cestovné veľkosti (uvedené pri produkte)'], 'products': out}
open(f'{ROOT}/catalogues/{SLUG}.js', 'w').write('/* Séria 4 – VAANOK: ' + str(len(out)) + ' dostupných produktov (' + CHECKED + '). Generované: tools/s4/build_vaanok.py. */\nglobalThis.CX_CATALOGUES ||= {};\nglobalThis.CX_CATALOGUES["' + SLUG + '"] = ' + json.dumps(cat, ensure_ascii=False) + ';\n')
for p in out: print(p['name'], '|', foc(p), p['price'], p['volume'], p['tags'], p['source']['allSkinTypes'], p['source']['skinTypesListed'], p['photo'])
