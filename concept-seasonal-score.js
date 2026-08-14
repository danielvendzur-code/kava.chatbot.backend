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

  Object.assign(app, { rankings });
})();
