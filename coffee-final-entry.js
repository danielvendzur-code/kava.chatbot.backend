(() => {
  'use strict';

  const VALID = new Set(['praziarnicka', 'diamonds', 'kaffa', 'vitazov', 'concept', 'jolka']);
  // The skincare demos live on the same domain, so a cosmetics subdomain that
  // lands on the root would otherwise be routed to a roastery.
  const SKINCARE = new Set(['mylo', 'ponio', 'two', 'bellcoria', 'biofy', 'anemone']);
  const params = new URLSearchParams(location.search);
  const parts = location.pathname.split('/').filter(Boolean);
  const pathSlug = (parts.at(-1) || '').replace(/\.html$/i, '');
  const hostnameSlug = location.hostname.toLowerCase().endsWith('.mojchatbot.sk')
    ? location.hostname.toLowerCase().split('.')[0]
    : '';
  const requested = params.get('demo') || (VALID.has(hostnameSlug) || SKINCARE.has(hostnameSlug) ? hostnameSlug : '') || location.hash.replace(/^#/, '') || pathSlug;

  if (SKINCARE.has(requested)) {
    const target = `/kozmetika/${requested}`;
    if (location.pathname !== target) location.replace(target);
    return;
  }

  const normalized = !requested || requested === 'index' || requested === 'ukazka' ? 'praziarnicka' : requested;
  const slug = VALID.has(normalized) ? normalized : 'praziarnicka';
  const target = `/${slug}.html`;

  if (location.pathname !== target) location.replace(target);
})();
