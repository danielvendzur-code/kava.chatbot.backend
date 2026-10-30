"""k2 – voľby poslednej otázky (focus) ukazujú skutočnú vlastnosť produktu z jeho popisu, nie marketingový názov (audit Codex 30. 10.).
python3 -I tools/k2/gen/focus_titles.py   – prepíše titulky/podtitulky a znenie otázky v tools/k2/brands/*.json
Každý text vychádza z popisu alebo zloženia produktu na e-shope (popisy sú v katalógu, stĺpec description / inci)."""
import json, os
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

FOCUS = {
 'akh': {
  'mint': ('Máta a eukalyptus', 'Výrazně osvěžující sprchový olej'),
  'cellu': ('Jalovec, rozmarýn a skořice', 'Sprchový nebo koupelový olej'),
  'gentle': ('Šetrný solno-olejový peeling', 'Na celé tělo'),
  'feet': ('Na chodidla', 'Sůl a bambucké máslo na ztvrdlou kůži'),
  'celluPeel': ('Prohřívací solný peeling', 'Na prokrvení pokožky'),
 },
 'bohemikus': {
  'yogurt': ('Jogurtové bez parfemace', 'I pro extra citlivou pokožku'),
  'honey': ('S medem', 'Mandlový a jojobový olej'),
  'unscented': ('Solné bez parfemace', '40 % mořské soli, kakaové máslo'),
  'almond': ('Jogurt a ylang-ylang', 'Mandlový olej a bambucké máslo'),
  'charcoal': ('S aktivním uhlím', 'Tea tree, pro problematickou pleť'),
  'sandal': ('Se santalovým práškem', 'Jogurt a vavřínový olej'),
  'dragon': ('Pačuli a cedr', 'Jogurt a pryskyřice dračí krev'),
  'provence': ('Levandule s olivovým olejem', 'Barveno kořenem kamejníku'),
  'south': ('Solné s levandulí a bergamotem', '40 % mořské soli'),
  'rose': ('Solné s růžovým dřevem', 'Růžový jíl, 40 % mořské soli'),
  'coffee': ('S mletou kávou', 'Kakaové máslo, káva z Ústecké pražírny'),
  'coffeeSet': ('Kávové mýdlo a balíček kávy', 'Káva z Ústecké pražírny'),
  'lavSyrup': ('Dvě levandulová mýdla a sirup', 'V dárkové krabičce'),
  'lavXXL': ('Mýdla, sirup, máslo a sušená levandule', 'Nejobsáhlejší levandulová sada'),
  'saltTrio': ('Tři menší solná mýdla', 'Levandule, růžové dřevo, bez parfemace'),
  'yogurtFour': ('Čtyři malá jogurtová mýdla', 'Od neparfémovaného po pačuli'),
  'yogurtGift': ('Čtyři jogurtová mýdla v krabičce', 'Dárkové balení 4 × 27 g'),
  'queens': ('Tři velká solná mýdla', 'Dárkové balení 3 × 80 g'),
 },
 'goodie': {
  'natural': ('Čisté BIO oleje', 'Odličovací olej lisovaný za studena'),
  'booster': ('Borůvkový, dvoufázový', 'Hydratace a výživa'),
  'purple': ('Růžový jíl s vitamínem B3', 'S výtažky z ovoce'),
  'pink': ('Růžový jíl', 'Prášková maska bez vody'),
  'green': ('Zelený jíl', 'Prášková maska bez vody'),
  'black': ('Černá', 'Černý jíl nebo černě zbarvená koupel'),
  'dragon': ('Dračí krev', 'Pryskyřice z Amazonie'),
  'shimmer': ('Se zlatavým odleskem', 'Suchý olej na pokožku i vlasy'),
  'stretch': ('Proti striím', 'Olej při těhotenství a přibírání'),
  'hairfood': ('Bergamot a brokolice', 'Výživa vlasů'),
  'ocean': ('Svěží', 'Bambucké máslo, ricinový a kokosový olej'),
  'herbs': ('Bylinky a jíl', 'Bílý a růžový jíl, jemná exfoliace'),
  'berry': ('Lesní plody', 'Tělový peeling'),
  'cocoVanilla': ('Kokos a vanilka', 'Tělový peeling'),
  'galaxy': ('Barvy vesmíru', 'S epsomskou solí'),
  'unicorn': ('Pastelové barvy', 'Šumivka do koupele'),
  'mermaid': ('Perleťová', 'Šumivka do koupele'),
  'starburst': ('Jiskřivá', 'Šumivka do koupele'),
  'winter': ('Zimní', 'Šumivka do koupele'),
  'flowers': ('Květinová', 'Koupelová sůl 450 g'),
  'pumpkin': ('Dýňové koření', 'Podzimní vůně'),
  'spirulina': ('Máta a spirulina', 'pH 5, péče 2v1'),
  'grape': ('Grapefruit', 'Svěží citrusová vůně'),
  'lemonLavender': ('Citron a levandule', 'Šumivka do koupele'),
  'goodNight': ('Na večer', 'Relax před spaním'),
  'pinkClay': ('Růžový jíl', 'Tuhý šampon'),
  'lemongrass': ('Citronová tráva', 'Koupelová sůl 500 g'),
 },
 'libebit': {
  'mistSila': ('Růže, lípa, vanilka, geranium', 'Harmonizuje a čistí'),
  'mistPohyb': ('Máta, chrpa a růže', 'Chladí přetíženou pleť'),
  'mistKlid': ('Růže, neroli a měsíček', 'Osvěžení a komfort'),
  'gentle': ('Jemnější varianta', 'Lykopen a arganový olej'),
  'fresh': ('Svěží varianta', 'Lykopen a arganový olej'),
  'simmon': ('Citronová tráva a eukalyptus', 'Osvěžující pěsticí olej'),
  'linum': ('Levandule a pačuli', 'Relaxační pěsticí olej'),
  'mint': ('Máta a citron', 'Chladivý balzám na rty'),
  'festive': ('Hřejivá vůně', 'Balzám na rty'),
  'davao': ('Eukalyptus, citron, tea tree', 'Chladí a osvěží'),
  'yunnan': ('Litsea cubeba', 'Citrusová vůně'),
  'harare': ('Geranium s citronem', 'Květinová vůně'),
  'unisex': ('Citronová tráva', 'Krémový, pro ženy i muže'),
  'patchouli': ('Pačuli', 'Na dlouhé, vlnité či namáhané vlasy'),
  'amla': ('Amla', 'Normální až suché vlasy'),
  'neem': ('Neem', 'Normální až mastné vlasy, sklon k lupům'),
  'reetha': ('Reetha', 'Všechny typy vlasů i vousy'),
  'shikakai': ('Shikakai', 'Citlivá pokožka, všechny vlasy'),
  'aloe': ('Aloe vera', 'Hydratace pokožky'),
  'tulsi': ('Bazalka posvátná (tulsi)', 'I na intimní hygienu'),
  'moringa': ('Moringa', 'Pokožka vystavená vlivům prostředí'),
  'hibiscus': ('Ibišek', 'Výživa kořínků'),
 },
 'malinna': {
  'gentle': ('Jemná pena', 'Na pleť aj telo'),
  'deep': ('Koncentrovaný čistiaci gél', 'Antioxidanty a výživa'),
  'rose': ('Ruža damašská', 'Regeneračný krém'),
  'immortelle': ('Slamienka (immortelle)', 'S nimbovým olejom a hlohom'),
  'lavender': ('Levanduľa', 'Výživný krém pre citlivú pleť'),
  'bodyScalp': ('Telo aj pokožka hlavy', 'Sérum s neroli a šampón so šalviou'),
 },
 'mark': {
  'coconut': ('Kokos', 'Kávový peeling'),
  'golden': ('So zlatými trblietkami', 'Peeling, olej alebo set'),
  'cocoa': ('Kakao', 'Telový peeling'),
  'glow': ('Magnéziová soľ a Mŕtve more', 'Kúpeľ pred spánkom'),
  'relax': ('Epsomská soľ a kvety', 'Kúpeľ po náročnom dni'),
  'love': ('Levanduľa, šalvia a ruža', 'Himalájska soľ a soľ z Mŕtveho mora'),
  'beardHair': ('Telo, vlasy aj brada', 'Pánsky set'),
  'beardBody': ('Telo a brada', 'Pánska starostlivosť'),
 },
 'moravite': {
  'vanilla': ('S vanilkou', 'Směs olejů, i pro citlivou pokožku'),
  'punch': ('Skořice, hřebíček, pomeranč', 'Hřejivá koupel'),
  'oilSet': ('Oba oleje v sadě', 'Opuncie a olej s vanilkou'),
 },
 'naturinka': {
  'bambi': ('Heřmánek a levandule', 'Pro nejjemnější pokožku'),
  'nimbatic': ('Zemitá s levandulí', 'Pro svědivou a šupinatou pokožku'),
  'winter': ('Bariérový zimní balzám', 'Lanolin, do chladného počasí'),
  'natur': ('Kakaové máslo a včelí vosk', 'Arganový a jojobový olej'),
 },
 'andreine447': {
  'silk': ('Hodvábny olej', 'Vyživí a uhladí bez mastného pocitu'),
 },
}
# znenie otázky: „Ktorý vyberiete?“ nad názvami nahrádza otázka na vlastnosť
QUESTION = {
 'bohemikus': (['Co vám na mýdle vyhovuje?', 'Podle složení a popisu mýdla na e-shopu Bohemikus.'], 'Složení a vůně'),
 'goodie': (['Co vás láká nejvíc?', 'Podle hlavní složky nebo vůně v popisu produktu.'], 'Složení a vůně'),
 'moravite': (['Co vás láká nejvíc?', 'Podle hlavní složky nebo vůně v popisu produktu.'], 'Složení a vůně'),
 'naturinka': (['Co vás láká nejvíc?', 'Podle hlavní složky nebo vůně v popisu produktu.'], 'Vůně a složení'),
 'akh': (['Kterou vůni vyberete?', 'Podle esenciálních olejů v popisu produktu.'], 'Vůně a složení'),
}

for f in sorted(os.listdir(f'{ROOT}/tools/k2/brands')):
    path = f'{ROOT}/tools/k2/brands/{f}'
    b = json.load(open(path)); slug = b['slug']
    if slug not in FOCUS and slug not in QUESTION: continue
    lang = 'cs' if b.get('lang') == 'cs' else 'sk'
    d = next(x for x in b['facetDefs'] if x['key'] == 'focus')
    for k, (t, sub) in FOCUS.get(slug, {}).items():
        assert k in d['values'], (slug, k)
        v = d['values'][k]
        for L in [x for x in ('sk', 'cs') if x in v] or [lang]: v[L] = [t, sub]
    if slug in QUESTION:
        q, label = QUESTION[slug]
        for L in [x for x in ('sk', 'cs') if x in d] or [lang]: d[L] = q
        b.setdefault('labels', {})['focus'] = label
    json.dump(b, open(path, 'w'), ensure_ascii=False, indent=1)
    print('ok', slug, len(FOCUS.get(slug, {})))
