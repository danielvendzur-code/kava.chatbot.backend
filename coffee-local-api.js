(() => {
  if (!['127.0.0.1', 'localhost'].includes(location.hostname)) return;
  const nativeFetch = window.fetch.bind(window);
  window.fetch = (input, init) => {
    const url = typeof input === 'string' ? input : input?.url || '';
    if (url === '/api/chat' || url.endsWith('/api/chat')) {
      return Promise.resolve(new Response(JSON.stringify({ reply: 'Podľa vašej otázky by som začal krátkym výberom kávy. Zohľadní prípravu, chuť aj kofeín.' }), {
        status: 200,
        headers: { 'content-type': 'application/json' }
      }));
    }
    return nativeFetch(input, init);
  };
})();
