# MAIN_WORKER: remaining sample comparison opt-in

Confirmed on c9e4da04e19339492a4ffe91428e8ac960b866b6 with true sample packages: engine12+12 passes, first Essentique320px browser run completed12 results,5 questions and3 source-mock chips. Clicking the comparison chip yields0 [data-s4-prod] buttons instead of the configured2.

Exact cause in n447/s4/compare-native.js line12:

```js
const list = (cat.products || []).filter((p) => p.available !== false && !p.isSample && p.photo);
```

The raw source catalogues correctly retain isSample=true. Thus byId is empty and compareProductIds cannot produce candidates. Do not clear sample flags or rename samples as retail bottles.

Suggested owner-only extension to that filter, confined to explicit reviewed S5 fragrance samples:

```js
const list = (cat.products || []).filter((p) =>
  p.available !== false && p.photo &&
  (!p.isSample ||
   (REG.series === 's5' && REG.segment === 'fragrance' &&
    p.isSample === true && p.source?.series === 's5' &&
    p.source?.sampleSegment === 'fragrance' && p.source?.selectionTraitsEvidence))
);
```

This is a standalone proposal, not a shared-file edit or second advisor-core fix. Existing retail entries and samples without explicit opt-in retain their former behavior. Each new company config supplies exactly2 genuinely different formula IDs/URLs. Other local all-results QA continues with comparison explicitly marked PENDING; not a complete-demo or Preview claim.
