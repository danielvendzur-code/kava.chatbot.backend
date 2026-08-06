(() => {
  'use strict';
  const app = window.ConceptSeasonalApp;
  const { config } = app;
  function rankings() {
    return config.products
      .map((product) => {
        let matchScore = 0;
        Object.entries(app.state.answers).forEach(([key, value]) => {
          if (product[key]?.includes(value)) matchScore += key === 'caffeine' ? 5 : 3;
          else if (key === 'caffeine' && value === 'decaf') matchScore -= 8;
        });
        if (app.state.answers.prep === 'filter' && product.prep.includes('filter')) matchScore += 1;
        return { ...product, matchScore };
      })
      .sort((a, b) => b.matchScore - a.matchScore || a.name.localeCompare(b.name, 'sk'));
  }

  function percentFor(product) {
    const best = rankings()[0];
    const delta = product.matchScore - best.matchScore;
    return Math.max(76, Math.min(97, product.id === best.id ? 96 : 88 + delta * 3));
  }

  Object.assign(app, { rankings, percentFor });
})();
