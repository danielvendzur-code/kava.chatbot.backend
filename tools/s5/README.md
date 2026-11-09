# S5-SOLO

New series entry: `/s5.html?demo=nutt`. HOLD Muši is intentionally not registered. Older demos still use `cosmetics.html` and their existing boot.

## Build and offline checks

Read `tools/s4/qa/README.md` and the invoked scripts first. All API calls below must remain mocked/offline.

```sh
python tools/s5/build_nutt.py
node tools/s5/offline-contract.cjs nutt
node tools/s5/backend-mock.mjs
S5_QA=1 node tools/s3a/serve.mjs "$PWD" 8997
# In the same network namespace as the server:
DOKAZY=n447/s5/dokazy bash tools/s3a/test-firm.sh http://127.0.0.1:8997 nutt
node tools/s5/qa.cjs
node tools/s4/qa/shots3.cjs nutt n447/s5/dokazy '0,0' '0,2' '1,1'
```

`S5_QA=1` makes the legacy QA URL `/cosmetics.html?demo=nutt` serve the new entry locally. It never changes deployed routing. On hosts where each command has a separate network namespace, launch server and tests in one shell command and kill the server on exit.

Playwright is supplied by the environment. If its Chromium executable is missing, `tools/s5/browser.cjs` optionally accepts `S5_CHROMIUM=<existing executable>` through `NODE_OPTIONS=--require=<absolute browser.cjs>`. The executable used here came from the reputable npm package `@sparticuz/chromium` installed outside the checkout; it is not bundled in this repository. No certificate validation, website protection, credentials or remote browser security were changed. External live pages were inspected in the connected browser; local Chromium was used for local QA.

## Source facts

`n447/s5/sources/nutt/verified-products.json` contains reviewed source URLs, timestamps, standard prices, sizes, explicit unavailable variants, photo URLs and documented properties. It is also the input for the reproducible offline builder. Full scraped marketing pages are not part of the deliverable. Product facts must be refreshed before a future release; `nutt-recheck-3.json` records the handoff check.

## Isolation and limitations

The native engine remains shared. New results/progress/reply rules are gated to S5; old entries do not load `support.js`. Model implementation and keys remain unchanged. Production model answers were not tested. NUTT has no suitable complementary product, so its demo omits the optional add-on. The reusable add-on UI exists but is not yet accepted as tested for future firms with add-ons. Coffee/wine/tea S5 results have not yet been qualified; do not batch-copy them on this evidence alone.

Screenshots are WebP copies of the local PNG captures, reviewed at 320/390/1280 widths. Read `n447/s5/odovzdanie-SOLO.md` for exact status, holds, mail and deployment boundaries.
