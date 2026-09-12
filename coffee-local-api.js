(() => {
  const loadOwnerFinalPolish = () => {
    if (document.querySelector('link[data-mcb-owner-final-polish]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/coffee-owner-final-polish.css?v=20260912a';
    link.dataset.mcbOwnerFinalPolish = 'true';
    const mount = () => (document.body || document.head || document.documentElement).appendChild(link);
    if (document.readyState === 'complete') setTimeout(mount, 0);
    else addEventListener('load', () => setTimeout(mount, 40), { once: true });
  };
  loadOwnerFinalPolish();

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
