(() => {
  'use strict';

  const VALID = new Set(['praziarnicka', 'diamonds', 'kaffa', 'vitazov', 'concept', 'jolka', 'goriffee', 'readyafter', 'coffeesheep', 'zlatezrnko', 'becafe', 'simplecoffee']);
  // The skincare demos live on the same domain, so a cosmetics subdomain that
  // lands on the root would otherwise be routed to a roastery.
  const SKINCARE = new Set(['mylo', 'ponio', 'two', 'bellcoria', 'biofy', 'anemone', 'modrapupava', 'facederma', 'cyprianus', 'panakeia', 'barboralori', 'bellmedi']);
  const params = new URLSearchParams(location.search);
  const parts = location.pathname.split('/').filter(Boolean);
  const pathSlug = (parts.at(-1) || '').replace(/\.html$/i, '').toLowerCase();
  const hostnameSlug = location.hostname.toLowerCase().endsWith('.mojchatbot.sk')
    ? location.hostname.toLowerCase().split('.')[0]
    : '';
  const known = (slug) => VALID.has(slug) || SKINCARE.has(slug);
  const hashSlug = location.hash.replace(/^#/, '').toLowerCase();

  // A path that names a demo wins over the subdomain it was opened on, so every
  // demo stays reachable by URL from whichever host already points here —
  // praziarnicka.mojchatbot.sk/ukazka/concept opens Concept, not the roastery
  // the host is named after.
  const requested = params.get('demo')
    || (known(pathSlug) ? pathSlug : '')
    || (known(hashSlug) ? hashSlug : '')
    || (known(hostnameSlug) ? hostnameSlug : '')
    || pathSlug;

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
