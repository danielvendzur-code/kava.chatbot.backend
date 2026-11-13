# Owner-requested logo/status alignment and fragrance profile icon

Owner: PERFUME_WORKER. Integration/live Preview owner: MAIN.

Three NEW standalone files only; no existing common runtime/backend/core file changed:

- n447/s5/perfume-ui-polish-20261113.css
- n447/s5/perfume-ui-polish-20261113.js
- assets/s5/shared/fragrance-bottle-outline.svg

MAIN: include CSS after existing fragrance-profile.css, and script before closing body (after existing runtime). Exact includes:

```html
<link rel="stylesheet" href="/n447/s5/perfume-ui-polish-20261113.css">
<script src="/n447/s5/perfume-ui-polish-20261113.js"></script>
```

CSS aligns online status dot/text vertically and horizontally under the fitted logo image content, accounting for existing company logo padding/object-fit contain. Script measures loaded image geometry, observes later mounts/image loads/resizes and updates one scoped CSS variable; it does not change logo, locale text, facts, prices, recommendation or chat. Existing factual text-only Le Parfum header is preserved and aligns to brand left. The CSS variable remains zero when no visible image rectangle exists.

For existing explicit data-fragrance-profile=visual-v1 only: replace generic three-bar profile symbol with original outlined bottle SVG, remove decorative before-dots in flat note chips. No numeric strength/percentages or scent weights invented. Existing online status dot stays.

## Actual validation

Local WPE WebKit with verified TLS defaults, isolated HTTP loopback fixture on immutable 68dbfbebc5e55c6655af0f8e6bdaf7129ea8f110. NOT live Preview QA. No CUA/Chrome claim. APIs mocked/blocked; paid0.

- 21 distinct existing/new company headers x320/390/1280 =63 geometry checks PASS: loaded logo, dot aligned to visible fitted rectangle within1.1px, dot vertically centered within1.1px, preserved online status text, no page overflow.
- Four newest packages:21 primary products x3widths =63 result/photo/pack/price/CTA/reset/profile checks PASS after add-on. Initial run timed out in an unrelated existing chat UI wait after44 result captures; resumed missing result checks with interactions skipped. Do not claim all chat interactions were repeated in this style check. Previous wave3/wave4 full interaction QA remains independently archived.
- Original/final screenshots, reports and ZIP entry hashes in tools/s5/perfume-wave5/proof/polish/. Initial timeouts retained in report priorFailure/history; no certificate/protection bypass.
- Visually reviewed actual 390px ATMAN/Hypno/Bookarazzi/Kintsugi header sheet and actual LUX320 structured-profile/Bookarazzi390 flat-profile result screens. This is representative visual review, not a claim that all63 style-result screenshots were manually re-reviewed.
- node --check PASS. Core c9 remains byte-identical.

Proof ZIPs are under /tools, excluded by existing Vercel rules; no deployment configuration changed. New SVG itself is public runtime artwork by design. MAIN should verify its final exact deployment after adding includes; worker has not deployed/promoted anything.
