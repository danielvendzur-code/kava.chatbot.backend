# Kintsugi header logo fix — 2026-11-12

User screenshot shows a blank top-left header in Chrome while WPE WebKit renders the SVG. Exact browser-specific cause remains unconfirmed.

Fix: rasterize the existing official SVG faithfully to a transparent 1392×508 PNG, use the new cache-distinct asset path for the three Kintsugi landing/header/brand logo references only. Avatar, catalogue and all other registry entries remain unchanged. Original SVG is preserved.

Validation: actual public Kintsugi page with only registry/PNG responses locally substituted; WPE WebKit at 390 and 1920 px, TLS verification enabled, correct logo loaded/visible, no page errors. This is a patched browser fixture, not verification that the fix is deployed. API requests blocked; paid calls 0. Local evidence: /workspace/work/perfume-audit/kintsugi-logo-patched-20261112/. Public domain not changed by this checkpoint.

Base: 85ed8bcdc631e42206afe643f694800dcb75f696. Isolated branch: codex/s5-kintsugi-logo-20261112. Main worker should integrate only assets/s5/kintsugi/logo-header-20261112.png and the three registry URL replacements; no engine or unrelated integration changes.
