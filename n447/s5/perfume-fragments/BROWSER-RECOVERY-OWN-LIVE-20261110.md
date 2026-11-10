# PERFUME_WORKER — working browser and own live Scentisimo QA

Own source branch: `codex/s5-perfume-20261110`, parent `9d7563705e0fe087e3c69b30cc435056d2aaac34`. No shared registry/core/backend/deployment configuration was edited.

## Actual outcome

The environment transport recovered and all preserved local WIP was found. Own branch was fast-forwarded to the existing remote source checkpoint without reset or deletion. Chromium still failed HTTPS certificate validation. Firefox also failed a blank-page launch because its renderer/namespace setup could not initialize; no sandbox setting was disabled.

Official Playwright **WPE WebKit26.5 now actually works** with the inherited managed CA/proxy and HTTPS validation enabled. Missing `libharfbuzz-icu0`, `libhyphen0` and `libgles2` were downloaded from official Debian HTTPS package paths and extracted into a task-owned directory using `dpkg-deb`. No sudo, system installation, maintainer scripts, new account/right, TLS bypass or new root import. Exact package URLs, versions and SHA256 are in the browser recovery report.

The reproducible launcher is `tools/s5/perfume-independent/webkit-user-libs.sh`; set `PERFUME_WEBKIT_DIR` to the official `minibrowser-wpe` directory and `PERFUME_WEBKIT_DEPS` to the task-local package extraction root. A blank-page smoke test of this checked-in helper also passed. The own UI tools now accept `--browser webkit --browser-executable <launcher> --commit <exact SHA> --deployment-id <id>`. They inherit the managed proxy for HTTPS, retain certificate verification and block/mock every API call. They use explicit app readiness instead of fragile network-idle waiting; `--widths` and focused `--indexes` resume only missing checks.

## Own live Preview Scentisimo completed

Immutable runtime: `b3efd6189cc4d1e757cc4c4516971796e2476b02`.
Deployment: `dpl_sWu3FzappC5KthTJsqLhuppp4yHP`.
Preview: https://kava-chatbot-backend-nmrab6xsh-danielvendzur-codes-projects.vercel.app/s5.html?demo=scentisimo

Actual **36/36 live results**: all12 distinct source formulas at320/390/1280. Source name/price/pack/URL, decoded photographs, CTA bounds, reset/progress and no unsupported add-on/shipping pass. All15 rendered question pages have loaded, distinct photographs; all three viewports passed hover geometry, four equal40px chips and comparison of two genuinely different products. Nine focused chat cards passed price/pack/decoded image/CTA bounds. Reduced-motion waiting was actually checked before the first successful card at every width. Offer remains447EUR+10EUR/month without trial wording.

All36 result screenshots, all15 question screenshots, nine cards and three comparisons were visually inspected in15 local contact sheets. All three offer and waiting states and initial chips were inspected separately. One apparent greeting-language issue from thumbnails was disproved by exact live DOM: the greeting is Czech before and after the first mocked response. **No greeting fix is requested.**

The initial runs retained12 passed results at320 and seven passed cards before navigation network-idle timeouts. These failed partial reports are preserved. Only remaining390/1280 results and remaining two1280 cards were resumed with app readiness; successful checks were not erased or counted twice. Final aggregation checks unique `(width, product ID)` sets. API calls were503 offline mocks, exercising installed client fallback; this is not a paid/server-model answer claim. Paid calls0, application page errors0. This worker has now independently completed one live perfume demo; do not increment the coordinator's series count a second time for the same company.

Text evidence is under `tools/s5/perfume-independent/reports/20261110-browser-recovery/`, especially `scentisimo-live-b3/summary.json` and the four original partial/continuation reports. Existing own `.vercelignore` excludes `/tools/` and Markdown; these text reports therefore stay outside Vercel without changing shared configuration. The main branch has additional S5 exclusions which this older own branch does not yet inherit. No claim that own-branch S5 JSON paths automatically inherit main's newer exclusions.

## QA archive export: blocked by automatic review

70 lossless WebP evidence derivatives are prepared in12 valid ZIPs, total4,867,952bytes. Each derivative was decoded and compared pixel-for-pixel with its original PNG. All original PNGs remain local. The manifest records every source/derivative/archive SHA256.

`MAIN-TO-PERFUME-20261110.md` at mainb3efd618 records owner authorization for GitHub QA archives. Nevertheless this worker's first attempted `github_create_blob` upload (`live-b3-proof-10.zip`,129437bytes) was rejected by automatic review: it did not recognize specific external-upload permission in this chat and did not establish the repository destination as trusted for internal preview data. **No retry, CLI push, alternate destination or embedded image encoding is used. Zero new screenshot/archive bytes were uploaded by this worker.** This checkpoint contains only text/code/manifests. Exact image files await the specific owner authorization recognized by review; the actual live-QA observations above remain completed, but remote screenshot handoff is incomplete.

## Merchant source follow-up and ownership

Own live WebKit home+LUNA and home+MIO DIO were rendered and visually inspected. Both default fresh contexts had ordinary newsletter popups, closed without input; no cookie-consent control was observed or clicked. No product chat/advisor launcher observed in those paths/modes; other sessions/cookies/pages remain unverified. Kintsugi's remaining black teaser is a discount-newsletter control. Exact observations/timestamps/URLs are in `kintsugi-oraculum-own-live-20261110.json`.

Fresh public Shopify checks confirmed18 selected available products with matching recorded prices; ARES names/IČO were reread. Fresh86-term duplicate scan covered92 available remote refs/2200 unique eligible text blobs, including the additional `oraculum-store.myshopify.com` alias. That scan predates the coordinator's subsequent claims. Latest claims `97bab0bcdca7ca1bf3944a109d69ab259f75c92b` now assign **Kintsugi and Oraculum to MAIN_WORKER**. Do not overwrite them. Per the fresh main handoff, main handles new claims/integrations; this worker continues isolated source/config preparation and independent review. Safran remains main's.

Oraculum terms state seller is not a VAT payer. ARES's `stavZdrojeDph=AKTIVNI` source flag alone does not independently establish current payer status, so it must not be presented as a verified tax contradiction. The earlier commentary was too strong. Keep actual final displayed retail prices and explicit tax-source caveat; no invented VAT rate or included VAT amount. The precise caveat is in `oraculum-tax-source-caveat-20261110.json`.

Direct verified HTTPS also resolved all13 exact size/price/stock variants across three sample compositions: Essentique Bois Imperial2/3/5/10/20/30ml=7/9/14/25/43/57EUR; Fragrance Samples French Riviera1/2/5ml=65/139/329CZK; Flakon Encens Suave1/2/3/5ml=5/9.5/13.5/22EUR. Exact official parameter-key/variant-code/microdata joins are recorded, rather than guessing from the order of flattened prices. These are three formulas, not13; live widget clearance/new reservations for them are not asserted.

No email application action, production/DNS/alias change, paid test, purchase, deletion, account/right request or certificate bypass occurred.
