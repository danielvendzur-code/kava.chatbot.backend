# Concept Coffee Roasters — seasonal editorial audit

Audit date: 2026-08-06  
Scope: `/ukazka/concept` only  
Branch: `agent/concept-seasonal-editorial`

## Before

### Brand and editorial hierarchy

- The Concept variant reused the same advisor symbol, benefit-card layout and green family used by unrelated roaster variants.
- The landing page presented three small framed benefits instead of one memorable seasonal recommendation.
- The visual system did not express rotation, discovery or a changing seasonal offer.
- Typography and spacing were serviceable but generic; too many similarly weighted boxes diluted the main recommendation.

### Product and content integrity

- `coffee-configs.js` contained seasonal products without product URLs, stock state, package variants or a verification date.
- Concept's phone number was empty.
- All purchase CTAs used the homepage rather than the recommended product.
- Prices and products were hardcoded without a visible verification boundary.
- A currently promoted product, Strawberry Icecream, had conflicting homepage and indexed product-page availability, so it was excluded from deterministic recommendations.

### Interaction and implementation

- The teaser rendered a `<button>` inside another `<button>` and relied on `coffee-v8-patch.js` to repair the DOM after render.
- Concept loaded legacy refine, brand-override and patch layers rather than one ordered brand core.
- Chat seeded two assistant messages instead of one concise opening.
- Results displayed two alternatives and delayed packaging controls were not tied to real product package variants.
- Body locking used a class only and did not preserve the exact background scroll position on every viewport.
- The shared assistant logo was used for all brands.
- The API fallback silently changed behaviour without explaining that the local deterministic response was being used.

### Repository debt checked

- Legacy `coffee-v4` to `coffee-v7`, `app-v2`, `app-v3` and other dormant files remain in the multi-demo repository. They are not loaded by the new Concept entry path.
- The Concept branch does not delete those files because they can still support other unpublished demos; it removes them from Concept's active dependency graph instead of creating another override.

## Direction

A restrained editorial system built from three visual roles:

1. warm paper surface `#F3F0E8`,
2. near-black neutral `#191A18`,
3. fixed seasonal vermilion `#E65B3A`.

The interface keeps the product-family geometry: compact panel, 20–24 px radii, clear segmented mode switch, 44 px controls, mobile full-frame mode, preserved state and progressive questions. Concept receives a distinct content rhythm, mark, photography and product-card treatment rather than a recolour.

## After

- Concept is routed to one dedicated ordered runtime (core, shell, shared state, scoring, advisor, chat and initialization modules) and four semantic stylesheets; the legacy patch and override stack is bypassed for this brand.
- The new monochrome C/bean/open-conversation mark uses two SVG paths and stops moving under `prefers-reduced-motion`.
- The landing is a single laptop-height editorial composition with three short benefits, one concrete recommendation and a clear unofficial-demo label.
- The widget has a larger Chat/Výber control, one opening message and four quick prompts.
- Preparation choices use optimized local photography; the recommendation uses one large photographic product story.
- Recommendation content explicitly covers origin, process, understandable flavour, suitable preparation and the reason for the match.
- Exactly one alternative is shown.
- Package choices come from the verified product variants and appear only after the recommendation.
- Each product CTA uses its official product URL.
- Scroll lock stores and restores the exact page position. Mobile layout uses dynamic viewport units and safe-area insets.
- State persists in `sessionStorage`; reset clears a completed result; returning to Chat focuses the composer after a user-triggered mode change.
- API failures display a clear local-mode explanation and a useful deterministic answer.

## Verified product dataset

The deterministic recommendation set was checked against official Concept Coffee Roasters pages on 2026-08-06:

| Product | Verified price / pack | Availability observed | Official page |
| --- | --- | --- | --- |
| Weithaga AA — Kenya | 15 € / 250 g; 54 € / 1 kg | in stock, more than 5 | https://www.conceptcoffee.sk/weithaga-aa---kenya/ |
| Gedicho — Ethiopia | 14 € / 250 g; 53 € / 1 kg | in stock, more than 5 | https://www.conceptcoffee.sk/gedicho-ethiopia/ |
| Berry Blast — Colombia | 18.50 € / 250 g; 66 € / 1 kg | in stock, more than 5 | https://www.conceptcoffee.sk/berry-blast-colombia/ |
| Summerjam — Colombia | 18.50 € / 250 g; 66 € / 1 kg | in stock, more than 5 | https://www.conceptcoffee.sk/summerjam-colombia/ |
| Holysh\*t! espresso | 17.50 € / 500 g; 34 € / 1 kg | in stock, more than 5 | https://www.conceptcoffee.sk/holysht-espresso/ |
| Yellow Sunset decaf | 12.50 € / 250 g; 24.50 € / 500 g; 48 € / 1 kg | in stock, more than 5 | https://www.conceptcoffee.sk/yellow-sunset/ |

Contact source: https://www.conceptcoffee.sk/kontakty/  
Shop email: `shop@conceptcoffee.sk`  
Shop phone: `+421 949 205 711`

## Local image sources

- Espresso / automatic and lever preparation: Ryan Spaulding, Unsplash, https://unsplash.com/photos/a-espresso-machine-making-a-cup-of-coffee-3b1mi9obsgA
- Pour-over preparation and result: Matthew Henry, Burst by Shopify, https://www.shopify.com/stock-photos/photos/top-down-view-pour-over-coffee
- Moka preparation: KATRIN BOLOVTSOVA, Pexels, https://www.pexels.com/photo/moka-pot-with-mug-6312268/
- Decaf / press result: Rodrigo Pereira, Pexels, https://www.pexels.com/photo/photo-of-a-french-press-coffee-maker-12247242/

All files are locally resized to practical WebP dimensions; the interface does not hotlink external images.

## QA acceptance

- No nested interactive controls.
- No Concept DOM post-render patch.
- No Concept override stylesheet.
- One final recommendation plus one alternative.
- Product URLs are not home-page fallbacks.
- Minimum touch target: 44 px.
- Keyboard focus visible.
- Reduced-motion path verified.
- 390 × 844 mobile viewport has no horizontal overflow.
- Background scroll is restored after close.
- Nine local contract tests, JavaScript syntax checks and browser interaction checks pass, including the full progressive flow, packaging stage, reset, focus restoration, scroll restoration and a clean console.
