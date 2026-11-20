# Skincare Preview

## CALTHA · rozšíření existující značky

Průvodce doporučuje konkrétní odličovač, tonikum, hydratační krém nebo sérum podle kroku a účelu péče. Pokrývá 10 receptur v běžném prodejním balení. U vícero balení je cílová varianta uvedena v kartě a v katalogu. Rozpočet platí i pro součet volitelné rutiny. Katalogový chat odpovídá česky na podporované dotazy o produktech a odkazuje na oficiální stránky.

- [Obchodní podmínky a provozovatel](https://www.caltha.cz/obchodni-podminky/) · CALTHA přírodní kosmetika s.r.o., IČO 07376413
- [Čištění pleti](https://www.caltha.cz/cisteni-pleti/) a [pleťové krémy a anti-age](https://www.caltha.cz/pletove-kremy-a-anti-age/)
- [Pásmo obratu za rok 2024](https://www.chytryrejstrik.cz/ico-07376413/caltha-prirodni-kosmetika-s-r-o) · 5–10 mil. Kč z ČSÚ podle sekundárního zdroje
- [Katalog s přesnými produktovými a obrazovými zdroji](caltha/products.js) · 20. 11. 2026. Ceny při kontrole bez kupónů. Varianty se kontrolují podle identifikátoru parametru, SKU, ceny a stavu konkrétní varianty.
- Úvodní fotografie pochází z [oficiální galerie meduňkového krému](https://cdn.myshoptet.com/usr/www.caltha.cz/user/shop/big/213-1_hydratacni-pletovy-krem-medunkovy.jpg?ff=1&x=1024&y=768&q=95&ts=6891ff16&sg=2a03b0b7). Základ vizuálu tvoří oficiální logo, písma Source Sans 3 a Exo 2 a mátová barva obchodu.
- Anela je v historických kandidátech evidována jako existující a má připravený katalog. CALTHA má v historické větvi `claude/n447-kozmetika2-20261029` připravený katalog `catalogues/caltha-refresh.js`. Toto je přepracování rozsahu a výběru pro existující značku.

Lokální vstup po spuštění statického serveru z kořene repozitáře je `/skincare/caltha/index.html`.

## FOR LIFE & MADAGA · nová značka

Průvodce pomáhá porovnat pleťová séra podle hydratace, rozjasnění, olejové výživy a večerního použití. Součástí je kompatibilní krém z řady Hyaluronic Acid. Rozsah 7 produktů včetně čtyř běžných 30ml Skin Boosterů, dvou 30ml sér a jednoho 50ml krému. Vzorky jsou mimo výběr.

- [Český e-shop a oficiální šíře řady Booster](https://www.forlifemadaga.com/cz/booster-3)
- [Provozovatel](https://www.forlifemadaga.com/cz/obchodni-podminky) · FOR LIFE & MADAGA a.s., IČO 49977580. [Velikost provozovatele](https://www.mesec.cz/rejstrik-firem/firma-for-life-madaga-a-s-49977580) · 20–24 zaměstnanců.
- [Ověřené produkty, oficiální fotografie, obsah a odkazy](madaga/products.js) · 20. 11. 2026. Při kontrole bylo v nastavení e-shopu zvoleno Česko a Kč. Pokud je na stránce více balení, běžné balení a vzorek mají samostatné prodejní řádky. Ceny se počítají z řádku vybraného objemu, s DPH.
- Existující sekce „Průvodce výběrem kosmetiky“ ve zkoumané podobě zobrazuje katalog s filtry. Tato ukázka má interaktivní volby a kontextový katalogový chat.
- [Logo](https://www.forlifemadaga.com/images/thumbs/0003266_logo_new.png) a Noto Sans z e-shopu. Titulní kompozice používá tři nezměněné fotografie balení Skin Booster.

Vstup je `/skincare/madaga/index.html`. Všechny ukázky lze při šířkách 320, 390 a 1440 px otevřít na `/tests/skincare-responsive.html` na stejné doméně Preview.

## Maat · nová značka

Průvodce vybírá mezi oplachovou emulzí a odličovacím olejem a doporučuje sérum podle textury, hydratace, rozjasnění nebo olejové výživy. Pokrývá 8 receptur, čtyři čisticí přípravky v 30 ml a čtyři séra v 20 ml. Nabízí navazující rutinu s rozpadem ceny.

- [Oficiální obličejový sortiment](https://www.aromaaterapie.cz/collections/oblicej) a [zdroj k pořadí rutiny](https://www.aromaaterapie.cz/pages/jak-zacit)
- [Provozovatel](https://www.aromaaterapie.cz/pages/obchodni-podminky) · Aromaaterapie s.r.o., IČO 04982851. [Velikost provozovatele](https://firmy.euro.cz/subjekt-aromaaterapie-s-r-o-04982851) · 6–9 zaměstnanců.
- [Ověřené produkty a zdroje fotografií](maat/products.js) · 20. 11. 2026. Cena a sklad platí pro identifikátor varianty v každém odkazu. E-shop používá společnou fotografii obalu pro různé objemy téže receptury. Karta uvádí prodávaný objem samostatně.
- [Logo](https://www.aromaaterapie.cz/cdn/shop/files/maat-logo-black.png?v=1755844679&width=386), písmo Figtree a paleta z obalů. Úvodní fotografie je z [galerie séra Hyaluron](https://www.aromaaterapie.cz/products/hydratacni-serum-hyaluron).

Vstup je `/skincare/maat/index.html`.

## LIQOIL · nová značka

Poradca odlišuje všetkých 8 pleťových sér z [oficiálnej kategórie](https://liqoil.sk/collections/sera) podľa účelu, textúry a zloženia. Zostáva pri výbere jedného kroku rutiny. Rozpočet používa ceny v eurách vrátane centov a rozhranie aj chat sú po slovensky.

- [Prevádzkovateľ](https://liqoil.sk/pages/vseobecne-obchodne-podmienky) · liqoil-pharm s.r.o., IČO 48078191, historicky Lakrom. [Finančný profil](https://finstat.sk/48078191) · tržby približne 453 tis. € za celý podnik v roku 2025.
- [Produktové zdroje, ceny, dostupnosť a fotografie](liqoil/products.js) · 20. 11. 2026, všetkých 8 sér v 30 ml sklenenej fľaši. Titulná fotografia je z oficiálnej galérie Algae-Hyaluronic.
- Cesta `/skincare/liqoil/index.html`.

## Kontrola Preview

CALTHA má 10 ciest výberu. FOR LIFE & MADAGA, Maat a LIQOIL majú po 8. Všetky cesty boli prejdené na živých nasadeniach tejto vetvy pri šírkach 320, 390 a 1440 px. Kontrolovali sa výsledky podľa odpovede, balenia, ceny, načítanie obrázkov, porovnania a vodorovné presahy. Samostatne boli odskúšané rozpočet, prázdny stav, návrat a nový výber, otázka o použití, porovnanie a reakcia pri chýbajúcom údaji. Pri LIQOIL je pokrytá hranica 10,89 € a 10,90 €. Použiteľné varianty a zdroje sú uložené pri jednotlivých produktoch.

Katalogový chat používa pripravené odpovede z produktových podkladov a výsledok aktuálneho výberu. Zdravotné otázky odkazuje na zloženie a výrobcu. Samostatné subdomény sa riešia až po schválení ukážky a obnovení cien a skladu.

## NEOBOTANICS · nová značka

Výběr pokrývá čtyři séra Beauty v 30ml balení. Vodná séra #1 porovnává podle hydratace a vzhledu pórů. U olejových sér #2 rozlišuje výživu a rozjasnění. Volitelná rutina dodržuje pořadí #1 a #2 podle výrobce a zobrazuje součet.

- [Řada Beauty](https://neobotanics.cz/collections/pletova-sera), [provozovatel](https://neobotanics.cz/pages/vop) · BIOCEN Laboratories s.r.o., IČO 48592633. Dlouhodobou působnost a maloobchodní distribuci dokládá [profil firmy](https://www.detail.cz/firma/48592633-biocen-laboratories-sro-ocelarska-392-9-praha/) a [nabídka řady u Dr. Max](https://www.drmax.cz/neobotanics).
- [Katalog, ceny, sklad, fotografie a použití](neobotanics/products.js) · 20. 11. 2026. U Youth Booster je na oficiální stránce rozpor mezi popisem a INCI. Vyloučení parfemace se řídí seznamem INCI, který obsahuje Parfum.
- Oficiální logo, Plus Jakarta Sans a modrá z balení vodného séra. Vstup je `/skincare/neobotanics/index.html`.

## Kolekcia desiatich poradcov

Vstup je [/skincare/gallery.html](gallery.html). Každá ukážka používa spoločné rozhranie skincare a vlastnú paletu, logo a produktové fotky z oficiálneho e-shopu. Výber pokrýva štyri produkty na značku vrátane porovnania. Ceny a dostupnosť sú z kontroly 20. 11. 2026. Zdroj stránky a fotografie je uložený pri každom produkte. Pri YEMNA sa ceny vzťahujú na vybrané plné balenia, nie na vzorky.

- [LOBEY](lobey/index.html) · hydratácia, olej, rozjasnenie a vzhľad pórov
- [Havlíkova apotéka](havlik/index.html) · séra a výrobcom odporúčaná dvojica Alabaster a Opium
- [YAGE Organics](yage/index.html) · séra a pleťové oleje
- [SAVON](savon/index.html) · hydratačné a peptidové sérum, olej a krém
- [Renovality](renovality/index.html) · štyri rozdielne séra v 30 ml
- [YEMNA](yemna/index.html) · rozjasnenie a výživnejšia textúra
- [LucyLab](lucylab/index.html) · rozjasnenie, hydratácia a kombinácia s krémom
- [Manufaktura](manufaktura/index.html) · sérum, krém a olej
- [Biorythme](biorythme/index.html) · bezvodé krémy v 30 ml
- [RYOR](ryor/index.html) · ceramidové a hyalurónové séra

## Druhá séria skincare poradcov

Spoločná [galéria](gallery.html) obsahuje obe série. Nové ukážky používajú fotografie z e-shopov v otázkach, porovnaní aj odporúčaniach. Ceny a sklad boli skontrolované 20. 11. 2026. Pri viacerých baleniach sa zobrazuje cena uvedeného variantu.

- [Yeskinye](yeskinye/index.html) · séra Uoga Uoga, Nobilis Tilia a Inlight
- [PURITY VISION](purityvision/index.html) · hyaluron, vitamín C, niacinamid a nočné sérum
- [NATAVA](natava/index.html) · vodné sérum a tri olejové receptúry
- [Emerosa](emerosa/index.html) · výber zo štyroch receptúr Lumene
- [ANNA BRANDEJS](anna/index.html) · dve séra, nočný a očný krém
- [Dermacol](dermacol/index.html) · štyri séra podľa hlavnej zložky
- [OMORFIA](omorfia/index.html) · odličovací balzam, krém a dva oleje
- [Cannor](cannor/index.html) · dve séra a dva pleťové oleje
- [Mýdlárna ERDÉ](erde/index.html) · odličovanie, tonizácia a krém
- [Geek & Gorgeous](geek/index.html) · hydratačné tonikum a tri séra
