# GOM Perfumes — source/local QA complete, integration by MAIN

Reserved PERFUME_WORKER on coord/s5-claims c2a958d4c6770b27b8fe6b099cad947e9cc93b28. Own branch codex/s5-perfume-wave5-20261113 from68dbfbebc5e55c6655af0f8e6bdaf7129ea8f110. MAIN takes only new company files, never replaces its newer common runtime.

## Exact paths

- catalogues/gom.js
- n447/s5/sources/gom/{verified-products.json,selection-model.json}
- n447/s5/perfume-fragments/gom.{config,selection-model}.json
- assets/s5/gom/ (10 original exact-pack product photographs, inline official logo SVG, original favicon)
- tools/s5/perfume-wave5/candidate-packages/gom/config.json — exact registryObject
- tools/s5/perfume-wave5/candidate-packages/gom/integration-review.json — exact catalogue import, backendBrand=gom, source-bound chip rule productIds, company CSS source/destination/registryField
- tools/s5/perfume-wave5/candidate-packages/gom/ui-review.css → MAIN copies to n447/s5/brands/gom.css and sets companyCss accordingly
- tools/s5/perfume-wave5/proof/gom/ — actual local QA and merchant screenshots/HTML ZIPs, JSON reports/entry hashes; existing /tools Vercel exclusion

Require existing a918 fragrance profile presentation and explicit new slug body.dataset.fragranceProfile=visual-v1. Separate owner polish includes described in POLISH-HANDOFF.md. c9 core remains byte-identical; existing runtime/backend/registry/provider untouched. MAIN integrates registry/import/brand/rules itself.

## Source boundaries

GOM s.r.o. ICO17645468 CZ, official ARES active2022-10-17/no end; official terms matching name/ICO/domain. Latest exact2025sales UNKNOWN. Secondary2024 whole-operator turnover band10–30millionCZK from Chytryrejstrik: fallback<=50millionCZK, PRICING_REVIEW. Never treat2025assets6724000CZK as turnover, never claim band brand-only. Price447+10 unchanged. Contact from official footer: info@gom-perfumes.cz. No outreach performed; drafts NOT_READY.

Own actual TLS-on automated WPE WebKit home https://gom-perfumes.cz/ + https://gom-perfumes.cz/product/chu/ rendered and screenshots visually reviewed. Fresh default session/no cookie banner/action observed. No product chat/advisor launcher observed in these views; other modes unknown. Ordinary contact/email only, no submissions/messages/cart/captcha action. Browser route blocked nonGET/cart requests. These observations are merchant eligibility, NOT demo live Preview QA.

Fresh duplicate audit: all98fetched remote heads2894textblobs/missing0/positivecontrols39, official domains/operator/ICO; no matches. Fresh claims no conflict, available50projectdomains+79teamaliases/no match, paginationnextnull, inaccessible scopes notgloballycleared.

Five different compositions CHU/NYI MA/RLUNG/RGYAL MO/RGYAL PO; all selected50ml. CHU/NYI MA/RLUNG5500CZK, RGYAL MO/PO5900CZK VATincluded via officialterms. Exact public WooCommerce variation attributes/IDs/is_in_stock/availability_html, not aggregate fromprice/cart inference. Official literal head/heart/base notes; no quantitative scent weights, intensity/occasion/health/longevity claims. Official product spelling “Eau de perfume” preserved.

Each has exact optional10mlsameformula variant:1600CZK for first3,1700forMO/PO. Actual10mlphotos retained. Checkbox defaultunchecked, exact sum7100/7600CZK and uncheckrestoresprimary verified. Both primary/addon CTA same merchantparentURL, volume must be chosen on shop; UI explicitly discloses selectionrequired and no cart integration. isNotSoldOut evidence maps actual public Woo is_in_stock=true; scope remains WooCommercePublicVariation, NOT fabricated Shopify.5variants are not5more formulas. No new engine needed.

## QA actually performed

Unchanged c9 full tree5/5 reachable,3nonempty states. Real local WPEWebKit15/15primary results at320/390/1280 PASS; original loaded photos/prices/50mlpack/exactURL/CTA/reset/progress/profile, distinct2productcompare/alternatives, optionaladdonunchecked/checksum/uncheck,4equal40pxchips/hover/reducedmotion. Nine targeted chip replies source-ID mocks only, paid0; deployed provider nottested. All15primary screenshots visually reviewed across3contact sheets; original5primary photographs and390pxselected10mlresult visually inspected. Header has actual official inline seal plus literal factual brandname transcribed from official header, contrasting official avatar. No invented logo photography.

STATUS: LOCAL_FIXTURE_QA_COMPLETE_NOT_INTEGRATED_NOT_PREVIEW. MAIN owns exact deployment liveQA of all5results before counting ready. Adds1local package to prior4=5of next15target; not5newlive-ready. No fabricated public subdomain. No production/DNS/mail/paidcalls/deletion. Source originals and prior Scentisimo/other archives preserved.
