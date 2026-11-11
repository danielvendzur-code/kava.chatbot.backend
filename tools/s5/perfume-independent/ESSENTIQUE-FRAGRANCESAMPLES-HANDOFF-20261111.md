# Essentique + Fragrance Samples — source and local QA handoff

PERFUME_WORKER owns both claims. Source/catalogue/config/30assets and final local QA are delivered on codex/s5-perfume-20261110. MAIN alone integrates shared files. Live Preview QA and the finished-demo count remain pending.

## Exact package paths

- tools/s5/perfume-independent/candidate-packages/essentique/
- tools/s5/perfume-independent/candidate-packages/fragrancesamples/

Each directory contains verified-products.json, catalogue.js, selection-model.json, config.json, integration-review.json, ui-review.css, brand-source.json, README.md and assets/. Twelve distinct formulas per firm, one exact available2ml sample/decant each. No size/sample-set inflation. Twelve product-linked official images +2 original wordmark/favicon files +1 explicitly local initial-avatar SVG per firm. Official header wordmarks preserved; local E/F avatar typography is identified as demo artwork, not an official supplied logo. Essentique is SK/Slovak/EUR; Fragrance Samples CZ/Czech/CZK.

MAIN copy targets:

- verified-products.json → n447/s5/sources/SLUG/verified-products.json
- catalogue.js → catalogues/SLUG.js
- assets/ → assets/s5/SLUG/
- config.registryObject → shared registry registration once, catalogue import and company CSS scope
- integration-review.offlineRules →3 exact source-backed offline rules/brand, integrated by MAIN only

Keep isSample=true and source.sampleSegment='fragrance'. The original bottle pictures are expressly illustrative; customer receives2ml, not the pictured full retail bottle. Canonical merchant CTA requires choosing2ml there; no automatic preselection/cart integration claimed. All note labels derive from captured official merchant parameters/prose or a visibly reviewed merchant note diagram. Editorial groups are not asserted official fragrance families. No intensity/occasion/health/longevity guarantee, budget question or forced perfume layering add-on. Revenue/size UNKNOWN; business interest not established.

## Current shared-core and comparison state

MAIN implemented explicit fragrance-sample routing in c9e4da04e19339492a4ffe91428e8ac960b866b6. This exact unchanged core passes both12-leaf trees. No second advisor-core fix requested. Historical failing-core/in-memory-proposal evidence is retained in sample-core-contract.json, not used as an installed engine.

One remaining shared issue: n447/s4/compare-native.js excludes every isSample entry before constructing its byId map. Both actual local comparison pickers have0 choices despite2 configured distinct formula IDs. Exact narrow S5 fragrance-sample allowlist proposal: SAMPLE-COMPARE-OPT-IN-20261111.md, first checkpoint4cf65768a539eefa2c97df4d7c596a2c636bd1dc. MAIN alone applies it. Do not clear sample flags to bypass it. Do not claim comparison works before delta QA.

## Actual local QA and visual review

Base: unchanged MAIN c9e4da04e19339492a4ffe91428e8ac960b866b6, isolated company registration fixtures, all API responses source-ID mock/offline, paid0. No actual shared backend/registry registration or Preview claim.

- 72/72 final result views:24formulas×320/390/1280; exact price/2ml/canonicalCTA/photo, reset/progress/CTA inside card/no horizontal overflow pass.
- 30 final question views:5pages×3widths×2firms; every image decoded, naturalWidth>=500, unique photos per question, complete reachable tree. Actual final photographs visually inspected.
- 18 source-mock chat cards:3needs×3widths×2firms; decoded photo, exact price/pack/CTA inside one card pass.
- 6 viewports:4equal40px chips, hover without layout shift,447+10 offer/no trial copy and reduced-motion waiting pass. No unsupported add-on/shipping/budget promise.
- 18 final contact sheets actually visually inspected (72results/30questions/18cards). Page errors0.

Source/presentation refinements: excluded tiny Cherry Ink bottle image and independently verified Arabians Tonka2ml7EUR/notes/photo as the replacement; keeps12formulas. Ganymede uses an explicit-source mandarin scene and short choice title. Mobile choice labels shortened. Customer-facing notes are compact factual tones; source audit prose and merchant marketing remain only in evidence metadata. Earlier premature white screenshot frames are retained locally; final captures wait image.decode()+two paint frames+180ms and show photographs. No website image outage inferred from those premature frames.

Reports: tools/s5/perfume-independent/reports/essentique-fragrancesamples-20261111/{engine-c9e4da0.json,local-ui-final-c9.json,local-chat-final-c9.json,question-photos-decoded-final.json,local-qa-final-summary.json,visual-review-final.json,comparison-gap-actual-browser.json}.

## Merchant eligibility and duplication gates

Claims reservation d0be27da162949b45960ae76085e8f2f527fe356, own status/lease refresh5e8d57f6ed37fec1a83058c1f09069258d9d9a2d. Fresh92 available remote heads/2243text blobs/missing0 before reservation, official domain/operator/ICO and conservative related-domain checks. Only current assignment/source preparation matches;49 Mokka coffee substring false positives excluded by whole-word identity review. No historical registered duplicate found in those available heads. Global Vercel/mail audit remains controller scope.

- Essentique: MOKK s.r.o./57198756, current official ORSR extract dated11Nov, data09Nov. Official contact info@essentique.sk. Actual automated WebKit home https://www.essentique.sk/ and https://www.essentique.sk/bois-imperial/ around07:36–07:38CET11Nov; reject cookies. Selected2ml7EUR Skladom, key17-14/code47/2ML, photograph rendered. Opened Opýtať sa: empty email/phone/message/captcha seller form, nothing entered/submitted. Opened volume helper: static2/3/5/10/20/30ml explanatory table, no branching advisor.
- Fragrance Samples: MiroLi Parfums s.r.o./29615984, official ARES current record inc2026-05-28/no dissolution. Contact info@fragrancesamples.cz. Actual WebKit home https://www.fragrancesamples.cz/ and https://www.fragrancesamples.cz/mancera-french-riviera/ around07:36–07:38CET11Nov; reject cookies. Selected2ml139CZK Skladem, key16-19/code204/2ML, photograph rendered. Opened Zeptat se: loaded ordinary empty seller form with captcha; nothing entered/submitted. Příručka parfémů actually opened: static article. Seller officially not a VAT payer; preserve final retail price, no VAT rate invented.

No product-chat/advisor launcher observed in those sessions. Other cookie modes/subpages remain uncertain. Related terms links to czechfragranceclub.cz/krasyorientu.cz conservatively scanned, common operator/alias not established. Third-party honzabartos theme CDN is not established as an Essentique operator alias. RPO API429 stopped; official ORSR current extract subsequently succeeded through normal HTTPS, no bypass. Exact URL/time/source rows in operators.json, merchant-live-eligibility.json, selected-variant-source-captures.json and duplicates.json.

## Remote proof and preserved originals

4d413301882e458cc1da55b0a94d0b9283c7fed2 stores7ZIP/17,184,931B under reports/essentique-fragrancesamples-20261111/archives/:132local demo frames +12actual merchant frames +18derived review sheets. Lossless WebP pixel buffers verified identical to original PNG; all original local PNGs retained. Git blob bytes hashed against returned SHA; upload-manifest.json read back.

Original Scentisimo12ZIP/70images/4,867,952B fully stored at4798d5b79ce89fde9c81e88c494979907cfdc3c5 under reports/20261110-browser-recovery/scentisimo-live-b3/archives/; local originals preserved. Explicit current owner authorization resolved the earlier export rejection; no current export blocker and no workaround used. All proof/source preparation remains under /tools/, already Vercel-excluded. Shared .vercelignore unchanged.

Kintsugi/Oraculum/Furiosa/Scentium work was reassigned to MAIN; local WIP preserved, no continued development or claim takeover. Safran untouched. No email app/production/DNS/paid calls/new rights or accounts.447+10; no trial copy. Finished-demo count added by this pair:0 until own actual integrated Preview QA.
