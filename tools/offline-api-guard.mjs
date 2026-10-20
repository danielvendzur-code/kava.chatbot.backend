// Local handler tests must never use a provider key or a production upstream.
delete process.env.ANTHROPIC_API_KEY;
globalThis.fetch = async () => {
  process.exitCode = 1;
  throw new Error('Offline API test blocked an unexpected network request');
};
