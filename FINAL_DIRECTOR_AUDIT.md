# Coffee demos — independent final director audit

Date: 2026-08-07

This document is the acceptance gate for all six personalised coffee demos. Existing work is not treated as correct because of who created it or because a previous audit called it final.

## Shared acceptance standard

Every demo must satisfy all of these before merge/deploy:

- owner-facing one-screen landing; no fake storefront,
- desktop widget in the same product family: approximately 460–520 px wide and 700–790 px high depending on viewport,
- soft/oval shell and controls, not a rectangular admin panel,
- large pill Chat / Výber kávy switch,
- one concise welcome message,
- four useful quick chips directly above the composer,
- quick chips >= 44 px and text must remain readable through hover/click animation,
- clear send button >= 44 px,
- no E-shop / Phone / Contact utility strip at the bottom,
- only a restrained `mojchatbot.sk` credit/link,
- photography used where it improves recognition: preparation and product recommendation at minimum,
- no emoji as primary option imagery,
- maximum four decision steps unless a brand-specific audit proves otherwise,
- one primary recommendation and at most one alternative,
- no invented match percentage, stock state, review count, conversion number or testimonial,
- direct verified product CTA,
- valid HTML, no nested interactive controls, no post-render DOM repair,
- mobile full-height behaviour, safe areas, background scroll lock and no accidental keyboard focus,
- reduced-motion support,
- no Vercel preview while iterating; one final preview only after all six pass local/browser QA.

## Current ranking is not an approval

### 1. Concept Coffee Roasters — 8.9 / 10 — CONDITIONAL PASS

Strengths:
- strongest photography and product storytelling,
- convincing owner-facing landing,
- strong typography and brand fit,
- good bottom quick-chip/composer composition,
- product recommendation feels more real than the older shared template.

Problems still visible:
- hero typography is close to overpowering the rest of the page,
- 548 px panel is at the upper edge of the family and must not grow further,
- orange/vermilion should remain an accent rather than become the entire hierarchy,
- final result must remain compact; photography cannot hide information-density problems,
- all fake score/availability-style metrics remain prohibited.

Required final fixes:
- verify result above the fold,
- verify all image crops at 1280×720 and 390×844,
- keep panel <= 520–530 px unless a browser screenshot clearly proves the larger width is better.

### 2. Káva Víťazov — 8.7 / 10 — CONDITIONAL PASS

Strengths:
- best practical widget proportions among current variants,
- strong first-step logic around use case,
- good owner-facing landing,
- clean large segmented control,
- no unnecessary contact strip,
- real product direction and sensible four-step flow.

Problems:
- repeated bag/product treatment can still read as template imagery,
- result contains more supporting information than necessary,
- green accent is effective but can become generic app UI if overused,
- card system can still feel boxy compared with the desired softer family.

Required final fixes:
- make actual product photography more dominant,
- simplify result to image → name → reason → taste/use → CTA,
- soften secondary cards and remove any redundant framing.

### 3. Pražiareň Jolka — 8.5 / 10 — CONDITIONAL PASS

Strengths:
- calm brand palette,
- sensible panel proportions,
- clean owner-facing composition,
- strong mobile behaviour and clear selection states,
- chat/quick-chip structure is close to target.

Problems:
- current logo/assistant mark still feels like a functional symbol rather than a memorable brand companion,
- product imagery is too weak/placeholder-like in several states,
- landing preview and result are still text-heavy,
- visual hierarchy is safe rather than impressive.

Required final fixes:
- stronger real photography in preview, first question and result,
- improve assistant mark or use official brand identity more prominently,
- reduce result card framing and let the product become the visual focus.

### 4. Diamonds Roastery — 8.0 / 10 — REQUIRES FIXES BEFORE PASS

Strengths:
- strongest premium hierarchy,
- excellent owner-facing headline,
- disciplined black/white/accent system,
- clean panel shell and good overall perceived quality.

Problems:
- current dark fake coffee-bag visuals reduce credibility,
- chat has too much dead space,
- quick-chip row can feel cramped/clipped,
- result is visually polished but still reads as a concept card rather than a real product recommendation,
- assistant mark is acceptable but not yet exceptional.

Required final fixes:
- replace fake packaging with verified product photography or a clearly photographic product treatment,
- tighten chat vertical rhythm,
- ensure four chips fit/scroll cleanly without clipping,
- keep result to one primary photo and one alternative.

### 5. Kaffa Roastery — 6.6 / 10 — FAIL

The branch does not currently satisfy the common product family.

Critical problems:
- desktop panel is `min(1000px, 100%)`, which is effectively a large modal and contradicts the requested widget proportions,
- screenshot confirms the interface occupies most of the screen,
- chat has an excessive dead zone,
- first advisor step only offers two broad preparation routes, making it inconsistent with the richer four-step pattern,
- the second revision audit itself claims the panel is over 900 px; this is not an acceptable final state,
- product bag treatment is more visual than before but still depends heavily on generated SVG fallback packaging.

Required rebuild:
- convert to a bottom-right 480–510 px floating widget on desktop,
- 720–780 px max height,
- preserve mobile fullscreen,
- four preparation choices: automatic / lever / moka / filter,
- keep four quick chips above composer,
- reduce dead chat space through a clear advisor entry and better message composition,
- use verified product images when available,
- keep its editorial brand personality without turning the widget into a modal experience.

### 6. Pražiarnička v9 — 5.8 / 10 — FAIL / REBUILD

Critical problems:
- landing headline is customer-facing (`Káva, ktorú si zákazník vyberie s istotou`) instead of presenting the demo to the owner,
- visual system is clean but too quiet and generic,
- assistant logo is not strong enough,
- landing uses a fake packaging illustration instead of authentic photography,
- the old contact row was inappropriate for an e-shop demo,
- chat/switch/quick-chip composition does not yet reach the level of Concept, Jolka or Káva Víťazov.

Required v10 direction:
- headline: owner-facing personalised proposal,
- photography-led preview using real Pražiarnička products/brewing context,
- use verified product data from the current Pražiarnička site,
- desktop widget target: ~490×750 px, radius 34–38 px,
- large oval Chat / Výber kávy switch,
- chips directly above composer,
- no contact strip,
- subtle `Návrh od Môj Chatbot` link,
- four questions with photographs on preparation and calm selected states,
- product recommendation with real product image, direct verified product URL, one alternative and no fake scoring.

## Director decision

Do not merge any of the six branches yet.

Pass order for the next review:
1. rebuild Pražiarnička,
2. resize/restructure Kaffa,
3. replace Diamonds fake product imagery,
4. photo/result refinement for Jolka and Káva Víťazov,
5. final compactness check for Concept,
6. render the exact same screenshot matrix for all six and compare side-by-side.

Only after that matrix passes should there be one consolidated integration and one Vercel preview.