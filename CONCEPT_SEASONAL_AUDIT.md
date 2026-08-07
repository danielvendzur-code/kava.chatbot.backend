# Concept Coffee Roasters — critical independent audit

Audit date: 2026-08-07  
Scope: `/ukazka/concept`  
Branch: `agent/concept-seasonal-editorial`

Concept was re-reviewed as if it were the weakest project in the set. The previous positive reaction to photography was not treated as evidence that the UX or brand work was already best-in-class.

## Scorecard — state before this audit

| Area | Score / 10 | Critical finding |
| --- | ---: | --- |
| Landing | 7.4 | Visually memorable, but the headline was too dominant and the editorial image could hide hierarchy problems. |
| Owner messaging | 8.3 | Owner-facing direction was present, but not yet the exact concise sales proposition requested. |
| Brand fidelity | 5.8 | The custom `20 / 15` seal was not verified as Concept's real logo and should not have been presented as company branding. |
| Typography | 8.2 | Strong editorial weight, but the oversized hero pushed the page toward poster design rather than a sales demo. |
| Color | 7.1 | Warm paper + black worked; the orange-red accent was used as a primary attention device too often. |
| Photos | 6.0 | Photography gave the project much of its perceived quality, but the repository assets are visibly soft at larger display sizes. |
| Image cropping | 6.4 | Crops were dramatic, but the result/hero image did not hold enough detail for a large editorial frame. |
| Widget shell | 6.8 | 548 px desktop width and 30 px radius made Concept an outlier against the shared compact family. |
| Chat | 8.2 | Minimal and understandable; too much visual space was allocated to the oversized shell. |
| Quick chips | 8.0 | Correctly positioned and 44 px high, but they read smaller than the rest of the oversized panel. |
| Send input | 8.5 | Clear, prominent and usable. |
| Mode switch | 8.1 | Good interaction, but larger than the family norm and visually heavy. |
| Advisor | 7.5 | Preparation photography was useful; taste choices reused unrelated brew photos mainly for visual richness. |
| Result | 6.1 | Strong screenshot composition, but the `96 % zhoda` value was a fabricated precision signal and the card carried too much detail. |
| Information density | 6.8 | Result required unnecessary scanning before the user reached the decision/CTA. |
| Mobile | 8.5 | Technically solid, but inherited the overly generous desktop visual language. |
| Technical quality | 8.8 | Dedicated runtime, preserved state, safe-area handling and no patch stack were strong. |
| Conversion | 7.2 | Direct product flow existed, but fake scoring and result density reduced trust. |

## What was genuinely excellent

- The editorial idea fits a seasonal specialty-coffee brand better than a generic SaaS skin.
- Photography is used in the right *type* of moments: preparation, entry into the advisor and recommendation.
- The owner-facing demo clearly separates itself from a fake full e-shop.
- The direct recommendation → package → real product URL flow is stronger than a generic homepage CTA.
- Mobile full-frame behavior, safe areas, state persistence and background-scroll restoration are structurally good.

## What only looked effective in a screenshot

- The 548 px panel looked luxurious in a desktop composition but was not consistent with the shared product family and created unnecessary empty space in Chat.
- The orange percentage badge created a strong focal point, but the number had no defensible statistical meaning.
- Reusing coffee photos on abstract taste choices made the advisor look richer while making those photos semantically weaker.
- A very large hero headline created immediate visual impact but competed with the actual product demonstration on the right.
- The invented seal made the page look more branded while lowering actual brand fidelity because it was not verified company identity.

## UX and consistency problems corrected

- Removed all visible recommendation percentages and the `percentFor()` pseudo-metric.
- Removed the unverified company seal. Company identity now uses a restrained `CONCEPT / COFFEE ROASTERS` wordmark treatment; the C/bean mark is kept only as a secondary assistant marker.
- Harmonized desktop widget to 448 × 720 px with a 24 px panel radius, 44 px controls and 200–240 ms primary transitions.
- Reduced headline scale and removed accent color from the company name.
- Reduced orange-red to a supporting seasonal accent instead of a primary CTA color.
- Kept four preparation photos, but removed recycled photos from taste and caffeine decisions; those steps now use simple semantic icons.
- Shortened the result to image, product/origin, taste, preparation, reason, CTA and one alternative.
- Kept four quick prompts at the bottom, a prominent input/send action, no contact strip, and raised the `mojchatbot.sk` credit to a readable 10.5 px with a 44 px link target.
- Rewrote question titles into more normal customer language.

## Owner landing after refinement

Primary headline:

> Vitajte vo vašom návrhu AI poradcu pre Concept Coffee Roasters.

Supporting statement:

> Ukážka, ako môže zákazníkovi zjednodušiť orientáciu v sezónnej ponuke a premeniť chuťové preferencie na konkrétny produkt.

Secondary statement:

> Konkrétne odporúčanie, nie zoznam.

At the 1536 × 960 reference viewport the landing fits without page scrolling or horizontal overflow.

## Product-data check

The active recommendation set keeps direct product URLs. Current official Concept pages still show Weithaga AA, Gedicho, Berry Blast, Summerjam and Holysh*t! in the shop. Yellow Sunset (decaf) is also listed in the current espresso catalog and has an official product page with 250 g / 500 g / 1 kg variants at €12.50 / €24.50 / €48. The interface deliberately says availability must be checked on the product page rather than freezing stock counts into the demo.

## Photography audit — unresolved source-quality limit

The photography *placement* is now more disciplined, but the existing committed Concept WebP source files are still the weakest visual asset in the project. They are heavily compressed and visibly soft when enlarged. This audit does **not** claim that resizing or sharpening would create missing detail, and it does not commit fake AI-upscaled screenshots as source photography.

Because no source-quality official Concept product files are present in the repository, the final photo score remains below benchmark level. The next legitimate improvement is to replace the committed files with source-resolution Concept product images or properly licensed high-resolution brew photography, then recompress locally at practical dimensions. Until that happens, Concept is a benchmark for layout/flow, not yet for photographic fidelity.

## Final scorecard after corrections

| Area | Score / 10 | Final assessment |
| --- | ---: | --- |
| Landing | 8.7 | Better balance between message and demonstration; no screenshot-first headline scale. |
| Owner messaging | 9.5 | Exact owner-facing proposition, concise value and clear unofficial-demo framing. |
| Brand fidelity | 8.0 | No invented logo; restrained wordmark treatment. Not 10/10 without an official source logo asset. |
| Typography | 8.8 | Editorial but controlled; hierarchy now serves the sales demo. |
| Color | 8.6 | Accent is secondary and CTAs remain neutral/black. |
| Photos | 6.2 | Correctly used, but source resolution remains visibly limiting. |
| Image cropping | 7.6 | Smaller, more deliberate crops reduce the weakness; source detail still caps quality. |
| Widget shell | 9.2 | Back inside shared family proportions without becoming a recolored clone. |
| Chat | 9.0 | Minimal, one intro, four prompts, strong bottom interaction group. |
| Quick chips | 8.9 | Four × 44 px, stable labels, correct bottom placement. |
| Send input | 9.1 | Prominent, readable and focus-visible. |
| Mode switch | 9.1 | Family-consistent geometry and clearer proportions. |
| Advisor | 8.8 | Preparation photos add recognition; abstract choices no longer use decorative photo reuse. |
| Result | 9.1 | No fake metric, strong hierarchy, one alternative and immediate CTA. |
| Information density | 9.0 | Result scroll is only a small overflow rather than a long text document. |
| Mobile | 9.1 | Full 390 × 844 frame, safe-area aware, no horizontal overflow. |
| Technical quality | 9.2 | Clean runtime contracts, state/focus/reset behavior and reduced motion preserved. |
| Conversion | 8.9 | Trustworthy recommendation path with no fabricated certainty signal. |

## Browser QA reviewed before commit

Reference measurements from the local Chromium review:

- widget: 448 × 720 px at 1536 × 960,
- page horizontal overflow: 0 px,
- mobile horizontal overflow at 390 × 844: 0 px,
- quick chips: 4, each 44 px high,
- opening assistant messages: 1,
- preparation photo options: 4,
- taste photo options: 0; semantic icon options: 4,
- visible match/percentage metric: none,
- alternatives: exactly 1,
- result content: 489 px scroll height inside a 447 px viewport (42 px overflow, not an 800+ px text wall),
- `mojchatbot.sk` credit: 10.5 px with 44 px link target,
- returning to Chat focuses `#chatInput`,
- reduced-motion override is active,
- browser console/page errors: none.

No Vercel deploy, preview deploy, PR or merge is part of this audit pass.
