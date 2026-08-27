(() => {
  'use strict';

  // coffee-api-route.js is the canonical production wrapper: it calls the
  // serverless /api/chat endpoint and falls back only when the endpoint itself
  // fails or returns an unusable response. Preserve that exact function before
  // historic UI polish code installs its obsolete 1.6 s Promise.race wrapper.
  if (!window.__COFFEE_STABLE_FETCH__) {
    window.__COFFEE_STABLE_FETCH__ = window.fetch.bind(window);
  }
})();