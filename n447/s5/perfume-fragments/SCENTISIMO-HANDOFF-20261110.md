# Scentisimo — PERFUME_WORKER

Update: independent checks on coordinator core `8a1bb74685d6b3b67fcc817d7c7c5515816360aa` now pass all 12 leaves, and an isolated config fixture passes 36 UI results + 9 mock cards. This is not shared registration/backend or Preview QA. Exact owner input and evidence: `INDEPENDENT-REVIEW-20261110.md` and `scentisimo.integration-review.json`. Initial source-checkpoint status below is retained as history.

Own branch `codex/s5-perfume-20261110`. Reservation `coord/s5-claims` commit `7e3722bc2c204dc4f3daa04669291a21bbd1de11`, fresh lease `d63eaf94d392d3078f1ffe55922986553af8f578`, force false; no foreign row edits.

**RESERVED_SOURCE_REVIEWED_ENGINE_PENDING.** Twelve distinct formulas across six brands: Rancé 1795, La Maison de la Vanille, i Profumi di Firenze, Routine Paris, MAD Parfumeur and Step Aboard. Includes Eau de Toilette, Eau de Parfum, Extrait de Parfum, generically described perfumes, one body mist and one body/hair fragrance. Sizes and samples do not increase the formula count. Personal fragrance selection represents meaningful notes and formats, not the whole shop or a named-product menu.

Source facts: `../sources/scentisimo/verified-products.json`; proposed two-step preference model: `selection-model.json` in the same directory; catalogue `/catalogues/scentisimo.js`; official local photos/logo `/assets/s5/scentisimo/`; inactive config/registry objects `scentisimo.config.json` and `scentisimo.registry.js`. Import and brand/rule requests follow `HANDOFF-20261110.md`, contract `s5-fragrance-direction-profile-v1`; no further engine capabilities are requested. Three exact offline chip→product rules are in config, fourth chip compares Eau de la Couronne with Menta sui Navigli. Their formats, packs, notes and prices differ. No add-on or budget question; no intensity, occasion, gender or skin-type filter.

## Variant and source cautions

Official variant rows are the price/stock authority, matched to the same Product Offer price. Canonical product links are retained: a query `parameterValueId` did not make the captured HTML select one pack. Do not promise automatic variant selection. Show the exact pack and price and let the merchant page expose its pack rows. For example Joséphine **50 ml is sold out**; the catalogue includes only **100 ml / 3290 Kč / Skladem 3 ks**. Vanille Sauvage and Nuit Patchouli are **100 ml / 1990 Kč**, not the 40 ml “od 990 Kč” starting price. Rancé Eau de la Couronne is **50 ml / 1990 Kč**. Price includes VAT under official OP 3.2.

Joséphine's prose and final note list differ; selected notes come from the prose, with no fabricated merged pyramid. Bohéme's short copy and prose differ about gender, so no gender assertion/filter is used. Generic `Parfém` preserves the source where concentration is not explicit. Concentration is not intensity; no projection, guaranteed longevity, allergy-safety, medical, layering or purchase-satisfaction claim.

## Eligibility evidence and duplicate check

MAIN_WORKER_CUA reported actual live home + Eau de la Couronne + opened seller-question modal at `2026-11-10T13:24:36.055Z`, after **Odmítnout cookies**. No product-chat/advisor/launcher observed in this mode. “Dotaz na prodejce” was a normal email/phone/message form with CAPTCHA; nothing entered/sent, no CAPTCHA solved and no cart. Live visible 50 ml / 1990 Kč / Skladem 2 ks, loaded photo. Other session/cookie modes and unvisited pages remain unknown. Attribution and exact URLs: `../dokazy/perfume-worker/scentisimo-eligibility.json`. Coordinator JSON and all three WebP screenshot bytes were retrieved from main8a1bb74 and visually reviewed; this remains attributed coordinator live evidence, not own live merchant QA.

Fresh 92 remote branches, 2125 unique text blobs: scentisimo.cz only assignment; operator La Graciosa Fashion s.r.o. / 22067906 absent from existing demo code/records. Related manufacturer-representative contact domain la-graciosa.cz separately absent across 92 refs / 1910 text blobs. It is a related contact domain, not a proven second shop alias. Official OP/contact and ARES reread 2026-11-10T13:26Z. Revenue UNKNOWN; global Vercel/mail checks PENDING, no mail app access.

## Validation scope

`python tools/s5/perfume/build-catalogue.py scentisimo` and `python tools/s5/perfume/validate-sources.py scentisimo`: source prices/packs/stock/URLs, distinct decodable official images, all 12 proposed leaves reachable once, no empty or one-choice step, four chips and two distinct comparison IDs. Source photo sheet visually reviewed. Choice photos now supplied in both fragments: shared segment scenes plus official product images, static coverage and distinct image bytes per question checked; all 32 shared/official choice images visually reviewed in `choice-photo-review.webp`. Integrated crop/loaded-state UI QA remains pending. This validates source data and a declarative model only.

Shared engine/renderer, full UI at 320/390/1280, reset/progress/hover/reduced-motion/avatar/chips/compare and live Preview outcomes **NOT RUN**. No runtime registration or deployment; completed-demo count 0. Shared files unchanged. Price 447 EUR + 10 EUR/month. Paid model calls 0; email NOT_READY; production NOT_DEPLOYED.
