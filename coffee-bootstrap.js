(() => {
  const params = new URLSearchParams(location.search);
  const requested = params.get('demo') || location.hash.replace(/^#/, '');
  // Jolka runs on its own entry point (jolka.html) instead of the shared v8 shell.
  if (requested === 'jolka') {
    location.replace('/jolka.html');
    return;
  }
  if (requested && /^[a-z0-9-]+$/i.test(requested)) {
    // Canonicalize the demo URL without destroying unrelated query state.
    // QA/fallback flags are intentionally preserved because the routed runtime reads them after bootstrap.
    const canonicalParams = new URLSearchParams(location.search);
    canonicalParams.delete('demo');
    const query = canonicalParams.toString();
    history.replaceState(null, '', `/ukazka/${requested}${query ? `?${query}` : ''}`);
  }
})();
