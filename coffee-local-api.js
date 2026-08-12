(() => {
  if (!['127.0.0.1', 'localhost'].includes(location.hostname)) return;
  const nativeFetch = window.fetch.bind(window);
  window.fetch = async (input, init) => {
    const url = typeof input === 'string' ? input : input?.url || '';
    if (url === '/api/chat' || url.endsWith('/api/chat')) {
      if (new URLSearchParams(location.search).get('apiError') === '1') {
        return new Response(JSON.stringify({ error: 'Simulated local API failure' }), { status: 503, headers: { 'content-type': 'application/json' } });
      }
      const payload = JSON.parse(init?.body || '{}');
      const latest = payload.messages?.at(-1)?.content || '';
      return new Response(JSON.stringify({ reply: `Lokálna odpoveď: ${latest}` }), { status: 200, headers: { 'content-type': 'application/json' } });
    }
    return nativeFetch(input, init);
  };
})();
