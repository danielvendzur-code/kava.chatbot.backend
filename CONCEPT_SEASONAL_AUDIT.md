# Concept Coffee Roasters — client-ready reference audit

Audit date: 2026-08-06  
Scope: `/ukazka/concept` only  
Branch: `agent/concept-seasonal-editorial`

## Before

### Communication and hierarchy

- The landing primarily spoke to an end customer, even though the page is opened by the business owner as a sales presentation.
- The value for Concept Coffee Roasters was implicit instead of stated directly.
- The existing seasonal direction was visually strong, but the 440 px panel still read as a standard support widget rather than a premium product demonstration.
- The company identity was represented mostly by the custom assistant mark; Concept's own visual language was not sufficiently present in the header and widget.

### Chat and conversion flow

- The lower part of Chat contained direct shop, email and phone actions that competed with the actual demonstration.
- Quick prompts were usable but did not form a deliberate bottom composition with the composer.
- The recommendation contained the required product information, but the primary packaging action initially sat below part of the detail content.
- Preparation photography was effective; later preference questions relied more heavily on abstract symbols.

### Existing quality retained

- Concept already had its own ordered runtime instead of the legacy DOM patch and override path.
- The teaser had valid, non-nested interactive controls.
- The assistant mark used two SVG paths, supported reduced motion and differed from the symbols used by other brands.
- Product URLs, progressive selection, one alternative, state persistence, mobile safe-area handling and scroll restoration were already in place.

## Reference direction

The refined version keeps the restrained three-role visual system:

1. warm paper surface `#F4F1E9`,
2. near-black neutral `#191A18`,
3. one seasonal vermilion accent `#EE5B3F`.

The system deliberately separates two identities:

- a compact Concept-inspired brand seal and wordmark identify the company,
- the two-path C/bean mark identifies the interactive assistant.

This prevents the assistant icon from pretending to be the official company logo while giving the demo a recognisable Concept-specific frame.

## After

### Owner-facing landing

- The first message is now “Vitajte vo vašom návrhu chatbotu”.
- The headline presents an AI advisor for Concept Coffee Roasters rather than asking the owner to shop for coffee.
- The introduction explicitly explains the commercial value: helping customers understand the seasonal offer, answering questions and directing them to concrete products.
- Three concise value statements replace generic customer benefits: selection help, immediate answers and product direction.
- The right-hand editorial card demonstrates what the customer will see and why a concrete recommendation is more valuable than another product list.
- The page remains a single laptop-height composition at a 1536 × 960 reference viewport.

### Larger reference widget

- The desktop panel is 548 px wide and up to 780 px high, with a 30 px outer radius and the same disciplined product-family behaviour as Derat, Môj Plot, Koverta and Môj Chatbot.
- The header uses the Concept-inspired seal and a clear availability state.
- The Chat / Výber kávy segmented control is larger, fully rounded and visually dominant without looking ornamental.
- All visible interactive targets in the tested flow are at least 44 px.
- Mobile remains a full dynamic-viewport panel with safe-area padding and no horizontal overflow.

### Photography and recommendation

- A photographic advisor entry introduces the guided flow.
- Preparation and flavour choices both use local photography where it materially helps recognition.
- The result keeps one large editorial image and one alternative only.
- The first result view now prioritises image, recommendation reason and the packaging CTA; origin, flavour, preparation and availability details follow below.
- Longer option labels wrap safely and no longer collide with their directional icon.

### Cleaner Chat composition

- Chat starts with one concise assistant message.
- Four short quick prompts sit directly above the composer as one bottom interaction group.
- The e-shop, email and telephone support row was removed from this owner-facing demonstration.
- A restrained 44 px-accessible credit links to `mojchatbot.sk` without competing with the Concept experience.
- API failure still returns a transparent local-mode explanation and a useful deterministic answer.

### Interaction and resilience

- State remains in `sessionStorage`; reset clears a completed recommendation and returns to Chat.
- Returning to Chat after a user-triggered mode change focuses the composer without scrolling the background.
- Page scroll position is preserved when the panel closes.
- Reduced-motion users receive static mark and transition behaviour.
- The Concept path remains independent of `coffee-v8-patch.js`, brand override injection and post-render DOM repair.

## Product-data boundary

The deterministic dataset keeps the direct official product URLs and package values verified during the preceding Concept audit on 2026-08-06. Because Concept's offer is seasonal, the interface no longer presents a hard stock quantity as permanent truth. It directs the customer to re-check current availability on the linked product page.

Contact reference: https://www.conceptcoffee.sk/kontakty/  
Shop email: `shop@conceptcoffee.sk`  
Shop phone: `+421 949 205 711`

## Local image sources

- Espresso / automatic and lever preparation: Ryan Spaulding, Unsplash.
- Pour-over preparation and result: Matthew Henry, Burst by Shopify.
- Moka preparation: KATRIN BOLOVTSOVA, Pexels.
- Decaf / press result: Rodrigo Pereira, Pexels.

The existing repository assets remain local, resized WebP files. No external image is hotlinked by the interface.

## QA acceptance

- JavaScript syntax checks pass for every Concept module.
- CSS brace and source-contract checks pass.
- 35 browser assertions pass in Chromium, covering the owner-facing landing, large panel dimensions, one message, four prompts, prompt/composer position, brand seal, photography, progressive questions, recommendation, one alternative, package selection, completed product link, reset, focus, 44 px targets, reduced motion and mobile overflow.
- Browser console and page-error collections are empty.
- No nested buttons and no bottom contact row exist.
- Desktop reference viewport has no page scroll or horizontal overflow.
- 390 × 844 mobile viewport fills correctly and has no horizontal overflow.
- No PR, merge, Vercel deploy or preview deploy is part of this refinement.
