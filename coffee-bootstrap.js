(() => {
  const params = new URLSearchParams(location.search);
  const requested = params.get('demo') || location.hash.replace(/^#/, '');
  if (requested && /^[a-z0-9-]+$/i.test(requested)) {
    history.replaceState(null, '', `/ukazka/${requested}`);
  }
})();
