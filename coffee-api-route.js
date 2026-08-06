(() => {
  if (['127.0.0.1', 'localhost'].includes(location.hostname)) return;

  const nativeFetch = window.fetch.bind(window);
  window.fetch = (input, init) => {
    const url = typeof input === 'string' ? input : input?.url || '';
    if (url === '/api/chat' || url.endsWith('/api/chat')) {
      return nativeFetch('/ukazka-api/chat', init);
    }
    return nativeFetch(input, init);
  };
})();
