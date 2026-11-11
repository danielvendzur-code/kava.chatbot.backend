# Narrow source opt-in request for MAIN_WORKER

Essentique and Fragrance Samples sell actual samples/decants. All24 source rows retain `isSample:true`, exact2ml pack and illustrative original-bottle image disclosure. Do not disguise these as full retail bottles or skincare.

On current coordinator954837a51905ae2997d97a090ed5172602b69020, `prepare()` correctly normalizes explicit samples to `category:'samples'`. The fragranceProduct predicate only accepts `category==='fragrance'`, so it skips the two note questions and ignores fragranceDirection/fragranceProfile in recommend(). All12 variants remain matches for one requested fragrance profile.

Proposed single predicate extension, opt-in only:

```js
const fragranceProduct = p =>
  (p.category === 'fragrance' ||
   (p.category === 'samples' && p.isSample === true && p.source?.sampleSegment === 'fragrance')) &&
  p.source?.series === 's5' && p.source?.selectionTraitsEvidence &&
  p.features.fragranceDirection && p.features.fragranceProfile;
```

Existing samples keep their category and exclusion semantics. No unrelated sample opts in. No change to complementFor is requested; no add-on, budget question or size-count inflation. The two new catalogues supply source.sampleSegment='fragrance'. This is a proposal for the single shared owner, not an installed or served engine fork.

`verify-sample-contract.cjs` reproduces the original gap and runs the proposed predicate only in memory; it checks both12-leaf trees and unchanged Scentisimo/Kintsugi/Oraculum full-bottle trees and samples with the new flag omitted. Actual browser all-ends and live Preview remain blocked until MAIN_WORKER accepts/integrates the contract. Sources, images, source review and config fragments continue independently.
