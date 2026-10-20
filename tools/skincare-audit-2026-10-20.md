# Skincare audit — 20. 10. 2026

- TWO: official detail confirms soap + lip balm is a gift set, not a standalone lip product. Corrected category, kind and pack size in both copies. Price and stock unchanged.
- Anela: old sensitive-skin set URL returns 404. Current official detail identifies SKU SA010, visible and microdata price 1 016 CZK, InStock (>10 ks), pack 30 ml + three 4.9 ml products. Corrected URL, name, price, pack and availability in both copies. Evidence URLs are in the JSON receipts beside this file.
- Offline catalogue checks now clear provider credentials, block fetch and set _upstreamHop to prevent production forwarding. One old contract run before this protection may have sent two upstream requests; owner informed. No further paid requests authorized for these checks.
- Coffee historical contract fixtures cover only part of the published snapshots. Preserve receipt assertions where receipts exist and validate dated provenance, prices, HTTPS links and image shape for the remainder; this is not current live stock verification.
- Fresh source sample: 608 product/shipping rows across 52 skincare stores; 188 structured matches, 412 require manual review, 7 HTTP errors and 1 timeout. Anela issue above corrected after direct verification. Iuvenio ACTIVE and past Syncare training were already excluded. Fytopharma active children's loose-tea URL returns 404 and has no confirmed replacement; remains open. Delibutus automated requests fail/protection; do not infer stock from these errors.
- Current browser QA: local Chromium/Edge could not launch in the managed environment. Browser plugin unavailable; explicit owner instruction selected Playwright Chromium. Fresh visual verification must be performed on the new Preview with /api/** blocked before interacting. Prior UI matrices remain historical evidence only.
- Production promotion is not part of this change. Preserve production model selection and credentials.

## Follow-up verification

All 14 Kvetu product prices and two Mylo set prices were confirmed against official visible product detail prices and matching structured offers; price receipts are in price-verification-2026-10-20.json. Stock and pack sizes are unchanged. Fytopharma loose children’s tea is now excluded from recommendations because its official product URL is HTTP 404. Physical stock remains NotConfirmed; do not describe it as sold out. Other-family sample checked 901 product/shipping rows: 253 structured matches, 634 manual review, two already excluded plant URLs 404, two shipping sources absent and ten transport failures at Valka. No speculative edits to those rows.

Liqoil: the exact five-piece Melissa lip balm variant 53215450628360 is sold out according to the official selected-variant JSON and visible Vypredané. Excluded this variant and confirmed pack 5 ks; price unchanged. See liqoil-stock-verification-2026-10-20.json.
