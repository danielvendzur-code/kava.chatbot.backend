# PERFUME_WORKER independent review — 10 November 2026

Own branch: `codex/s5-perfume-20261110`. The shared runtime was read from immutable coordinator commit `8a1bb74685d6b3b67fcc817d7c7c5515816360aa`; this worker did not edit or move the shared branch. Existing untracked WIP remains preserved. JSON timestamps use UTC; the client timezone is Europe/Bratislava.

| Scope | Actually verified | Remaining boundary |
|---|---|---|
| Adora Niche, registered coordinator snapshot | 12 source formulas; existing core reaches each once; 36 browser results at 320/390/1280; 9 focused mock-chat cards | Own live Preview QA blocked by certificate trust; no completed-demo increase |
| Niche & Glow, registered coordinator snapshot | Same 12/36/9 checks; both comparison products, reset/progress/hover, four 40px chips and reduced-motion waiting | A visual avatar contrast finding has a separately verified official-mark proposal; owner has not applied it to main |
| Scentisimo, **isolated config fixture** | Unchanged coordinator core reaches 12/12 source formulas; 36 fixture browser results and 9 source-ID mock cards at the same widths | **Not registered** in shared registry/backend. Mock responses do not prove backend integration. No live Preview QA |

Evidence is under `../dokazy/perfume-independent/8a1bb74/`. `engine.json`, `registered-local-ui.json`, `registered-local-chat.json`, `scentisimo-fixture-ui.json` and `scentisimo-fixture-chat.json` retain the exact scopes. Result checks include source name/price/pack/URL, decoded local product photos, CTA bounds, reset/progress and no unsupported add-on/shipping. All 108 result screenshots were visually inspected in nine contact sheets. Question pages at 390px, mobile mock-card sheets and all three comparisons were also visually reviewed. All screenshot bytes and raw originals remain local. The text manifest identifies prepared compact derivatives and the explicit desktop widget crop; it does not mean those images were uploaded.

`source-refresh.json` rereads the 36 official product pages and confirms matching prices, exact packs and available stock. Pack evidence is restricted to the real variant row or product title/description, not related products. These are HTTPS HTML/microdata checks, **not merchant widget QA**. Coordinator merchant eligibility remains separately attributed MAIN_WORKER_CUA. Scentisimo's actual three coordinator screenshots and JSON were retrieved and visually reviewed from `8a1bb74`; source paths are in `../dokazy/perfume-worker/scentisimo-eligibility.json`.

The connector identified Preview deployment `dpl_paMQ9MR5Mb6JK1uwvLhnaDG9yUfg` for the exact coordinator SHA as READY. The actual Chromium navigation failed with `ERR_CERT_AUTHORITY_INVALID`, recorded in `preview-attempt.json`. No certificate setting or permission was changed. READY is not live QA; no new demo is counted as complete by this worker.

## Niche & Glow avatar: apply only two data fields

`nicheandglow.avatar-review.json` supplies the exact review. The old small pink wordmark appears faint on white. The official `https://www.nicheandglow.cz/favicon.png` is a square dark-green mark with a pink N; original PNG bytes are `/assets/s5/nicheandglow/mark.png`. Its two dominant source colors have contrast ratio 4.26:1. A local fixture changed **only** `brand.mark` and `logos.avatar` on the coordinator's current registered object. Requests loaded the official mark, header wordmark and recommended product stayed unchanged, and all three widths passed. Screenshots are `niche-avatar-fixed-{320,390,1280}.webp`.

Owner integration: set those two fields on the **current main object**, preserving its `segmentText`, `stepCopy`, comparison IDs and choice photos. Do not replace the complete main object with an older source fragment. No shared CSS or engine change is needed for this avatar proposal.

## Scentisimo: exact owner input, no engine change requested

`scentisimo.integration-review.json` contains a complete proposed registry object, Czech segment copy, four chips, comparison IDs, catalogue import, backend brand and three exact offline rules. It includes the official square favicon `/assets/s5/scentisimo/mark.png` in addition to the official wordmark. Both original files have source URLs/hashes in `../sources/scentisimo/brand-source.json`.

`scentisimo.ui-review.css` extends only the coordinator's existing four perfume-card layout declarations to this one new slug. The owner can incorporate that scope into shared CSS. The test fixture loads this separate file and registers the review object in a separate local HTML response; all common runtime files are served unchanged from `8a1bb74`. It supplies mock API replies using the declared source IDs. No duplicate recommendation engine, skincare category remapping, provider/key change or real model call is involved.

Owner actions still required: catalogue import and shared registry entry; backend brand/import and three offline reply rules; scoped card CSS and local serve registry/allowlist where needed; actual integrated UI/backend mock QA and own live Preview QA. Price stays 447 EUR + 10 EUR/month. No budget, perfume-layering add-on, occasion, gender, intensity or longevity promise is introduced.

## Other independent source preparation

Kintsugi has 12 reviewed available formulas, including TEMPO as **one** Eau de Parfum composition in 2 × 8 ml. Its refill does not add a formula. Oraculum has six reviewed personal fragrances. Their source-backed declarative models remain unregistered and unreserved.

New `candidate-furiosa-cz-source-preparation.json` and `candidate-scentium-cz-source-preparation.json` preserve 10 and 12 reviewed formulas respectively, source variant IDs/packs/prices/photo URLs/pyramids, fresh official terms and active ARES registrations. All 22 reviewed products have available selected variants; samples/travel sizes/sets do not inflate the counts. Turnover/overall company size remain UNKNOWN; interest is not established. No live widget absence or reservation is asserted. Important source distinctions: Scentium Coco Santal really uses merchant handle `blanc-sesame`; MALKHUT 109's 30 ml / 990 CZK is unavailable, selected 50 ml is 1390 CZK; SALT's narrative differs from its final pyramid, so only the final recorded pyramid is used.

Reproduction tools are isolated under `tools/s5/perfume-independent/`. The normal snapshot server is immutable; fixture flags explicitly add only the separate Scentisimo review object/assets/style or the two-field Niche avatar override. None is imported by registered production pages. No new candidate claim, email operation, production/DNS/alias action, purchase, deletion, paid model call, account, right or certificate bypass occurred.

## Coordinator update and image-upload boundary

Coordinator checkpoint `7926f09c7ec8cca3e3792456916b911626190753` reports its own live 12+12 results and series count 13, plus the final launcher-copy delta. That is MAIN_WORKER attribution, not this worker own live QA. The coordinator also records two automatic-review rejections of QA archive upload, interpreting the Vercel exclusions as a Git-upload restriction and requiring explicit owner permission. After learning of that block, this worker does not upload new screenshot/archive bytes or send them through another destination. They remain local; only text reports/manifests, configuration/source data and original official runtime mark assets are proposed for the checkpoint. The original favicon PNGs are merchant runtime assets, not QA screenshots.
