# Súťažný audit kávového poradcu

## Stav pred opravou

| Oblasť | Skóre | Kritická chyba |
|---|---:|---|
| Identita značky | 5.5/10 | Generický znak zrna, slabá zapamätateľnosť a nepresvedčivé použitie v malom rozmere. |
| Farebná harmónia | 7.0/10 | Zelená a koralová fungovali, ale fill animácie menili prvky na ťažké tmavé bloky. |
| Hierarchia | 7.2/10 | CTA, prepínač a chat súťažili o pozornosť. Prvý krok nebol dostatočne jednoznačný. |
| Konverzný potenciál | 6.7/10 | Odporúčanie neukazovalo dostatok dôkazov, parametrov ani dôvodu na nákup. |
| Poradca | 7.1/10 | Voľby boli použiteľné, no vizuály a selected stavy pôsobili šablónovo. |
| Chat | 7.4/10 | Funkčný, ale bez dostatočne silných rýchlych volieb a produktového kontextu. |
| Mobil a senior UX | 7.0/10 | Viaceré texty mali 9–10 px a stavový text bol príliš nenápadný. |
| Výkon a stabilita | 5.8/10 | Závislosť od množstva externých fotografií zvyšovala riziko pomalého alebo nekonzistentného načítania. |

**Celkový stav pred opravou: 6.8/10.**

## Zásahy vo verzii v6

- Nový lokálny SVG znak Pražiarničky, použiteľný od launcheru po desktopový lockup.
- Zjednotená paleta: borovicová zelená, teplá smotanová, tlmená meď a sage.
- Odstránené externé fotografie z aktívneho widgetu; všetky vizuály sú konzistentné a okamžite načítané.
- Väčšie texty, čipy a dotykové plochy; menej mikrotextov pod 11 px.
- Nový radial selected fill podľa miesta kliknutia a jemný hover shine bez agresívnej zmeny rozloženia.
- Jasnejší dvojrežimový prepínač so zachovaným progresom výberu.
- Odporúčanie obsahuje percento zhody, dôvod, reálne chuťové metriky, alternatívy a produktový ďalší krok.
- Doplnený výber hmotnosti aj mletia a kompletná rekapitulácia pred košíkom.
- Predajné dôkazy: čerstvé týždenné praženie, 98 % spokojnosť a doprava zdarma nad 60 €.
- Mobilný fullscreen, bezpečné okraje a zjednodušená hierarchia.

## Kontrolný štandard

- Zrozumiteľnosť prvého kroku bez vysvetľovania.
- Kontrast a čitateľnosť na mobile.
- Jasný active, hover, focus, disabled a selected stav.
- Zachovanie stavu pri prepnutí Chat / Výber kávy.
- Kompletný tok: otázky → odporúčanie → alternatíva → balenie → mletie → rekapitulácia → košík.
- `prefers-reduced-motion` pre používateľov citlivých na animácie.
- Žiadny horizontálny overflow pri 360 px.
