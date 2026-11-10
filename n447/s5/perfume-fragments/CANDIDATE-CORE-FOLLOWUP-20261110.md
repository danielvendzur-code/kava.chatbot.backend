# PERFUME_WORKER — candidate core follow-up, 10 November 2026

This continues `INDEPENDENT-REVIEW-20261110.md`. No new company is reserved or registered.

The unchanged `advisor-core.js` at coordinator commit `7926f09c7ec8cca3e3792456916b911626190753` (blob `f1a4fc262bded8e9b5af347a9ba7921b262c934f`) was actually executed in isolated JavaScript against the published source data at `e88fe06e63225b09f960e9b8570d8bcf02bc6ab6`. Kintsugi 12, Oraculum 6, Furiosa 10 and Scentium 12 distinct formulas each reach exactly one result: 40/40 total. The test rejects missing source packs/prices/notes/availability, changed result URL/pack/price/photo, unreachable or duplicate products, empty/single-choice questions, non-fragrance questions and an automatic add-on. These are editorial preferences based on recorded official notes; they do not assert official fragrance families, intensity, occasion or buying guarantees.

Exact report: `../dokazy/perfume-independent/candidate-core-20261110.json`.
Reproducer: `../../../tools/s5/perfume-independent/verify-candidate-core.js`, exporting `runCandidateCore(core, documents)`. Supply the unchanged core exports and parsed JSON documents keyed `preflight`, `models`, `furiosa`, `scentium` from the four source files identified in the report. It has no network or file-write behavior. The report was regenerated using this exact reproducer, rather than merely validating the declared model.

These checks do not establish UI layout, image loading, live merchant widget behavior, backend integration or Preview QA. No shared runtime/config file was edited and no model call was made. The first three existing claims remain unchanged. For all four new candidates, live home + product + widget observations and fresh domain/operator/ICO/alias/all-remote/claims clearance are still required before a new reservation.

`../dokazy/perfume-worker/candidate-registry-followup-20261110.json` preserves a legal-name history and two additional platform aliases found before the environment transport failed. Fineluxart is a historical registered name of the Le Parfum & Le Chic operator; it is not proof of a guessed second shop domain. The additional aliases are `furiosa-store.myshopify.com` and `ir0ufv-18.myshopify.com`. The later scan's detailed hit locations could not be reread, so it is not reported as fresh duplicate clearance.

Execution environment: the last shell attempt failed with `exec-server transport disconnected; failed to resume exec-server session: recovery timed out after 45s`. The subsequent environment context marked it unavailable. Local WIP and screenshot files have not been deleted or overwritten; their current filesystem state cannot be reread while the environment is unavailable. Supported GitHub and web connectors continue to work independently. No callable control-browser/CUA interface was found in the available tool inventory. Certificates and permissions were not changed.

This checkpoint contains text only. It does not upload or re-encode the locally retained QA screenshots/archives. Own live Preview completion count remains unchanged at zero; the coordinator's reported series13 is separately attributed.
