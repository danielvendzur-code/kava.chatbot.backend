let dataPromise;

async function loadData() {
  if (!dataPromise) {
    dataPromise = (async () => {
      const previousWindow = globalThis.window;
      const holder = {};
      globalThis.window = holder;
      try {
        await import('../cosmetics-config.js');
        if (!holder.COSMETICS_DEMOS) throw new Error('COSMETICS_DEMOS not loaded');
        return holder.COSMETICS_DEMOS;
      } finally {
        if (previousWindow === undefined) delete globalThis.window;
        else globalThis.window = previousWindow;
      }
    })();
  }
  return dataPromise;
}

const EXPECTED = [
  'mylo','ponio','two','bellcoria','biofy','anemone','modrapupava','facederma','cyprianus',
  'panakeia','barboralori','bellmedi','lavelin','kvitok','soaphoria','syncare','fytopharma','natureal'
];

export default async function handler(req, res) {
  try {
    const data = await loadData();
    const { brands, questions } = data;

    const recommendationScore = (product, selected) => {
      let total = 0;
      if (product.tags.includes(selected.goal)) total += 18;
      if (product.tags.includes(selected.skin)) total += 15;
      if (selected.texture !== 'any' && product.tags.includes(selected.texture)) total += 7;
      if (product.tags.includes(selected.routine)) total += 4;
      return total;
    };
    const rankedProducts = (brand, selected) => {
      const primary = brand.products.filter((product) => product.tags.includes(selected.skin) || product.tags.includes(selected.goal));
      const pool = primary.length ? primary : brand.products;
      return pool.map((product, index) => ({ product, index, score: recommendationScore(product, selected) }))
        .sort((a, b) => b.score - a.score || a.index - b.index);
    };

    const optionImagesMissing = questions.flatMap((question) => question.options
      .filter((option) => !option.image)
      .map((option) => `${question.key}:${option.value}`));

    const report = {};
    for (const slug of EXPECTED) {
      const brand = brands[slug];
      if (!brand) {
        report[slug] = { ok: false, error: 'missing-brand' };
        continue;
      }

      const malformedProducts = brand.products
        .filter((product) => !product.id || !product.name || !product.price || !product.url || !product.reason || !Array.isArray(product.tags) || !product.tags.length)
        .map((product) => product.id || product.name || 'unknown');

      const coverageMissing = {};
      for (const question of questions) {
        coverageMissing[question.key] = question.options
          .map((option) => option.value)
          .filter((value) => value !== 'any' && !brand.products.some((product) => product.tags.includes(value)));
      }

      let combinations = 0;
      let noPrimaryWinner = 0;
      let avoidableTextureMiss = 0;
      let avoidableRoutineMiss = 0;

      const values = Object.fromEntries(questions.map((question) => [question.key, question.options.map((option) => option.value)]));
      for (const skin of values.skin) for (const goal of values.goal) for (const routine of values.routine) for (const texture of values.texture) {
        combinations += 1;
        const selected = { skin, goal, routine, texture };
        const ranked = rankedProducts(brand, selected);
        const winner = ranked[0]?.product;
        if (!winner) { noPrimaryWinner += 1; continue; }

        const primaryCandidates = brand.products.filter((product) => product.tags.includes(skin) || product.tags.includes(goal));
        if (primaryCandidates.length && !winner.tags.includes(skin) && !winner.tags.includes(goal)) noPrimaryWinner += 1;

        if (texture !== 'any' && !winner.tags.includes(texture)) {
          const betterTexture = ranked.some((item) =>
            item.product.tags.includes(texture) &&
            item.score > recommendationScore(winner, selected));
          if (betterTexture) avoidableTextureMiss += 1;
        }

        if (!winner.tags.includes(routine)) {
          const betterRoutine = ranked.some((item) =>
            item.product.tags.includes(routine) &&
            item.score > recommendationScore(winner, selected));
          if (betterRoutine) avoidableRoutineMiss += 1;
        }
      }

      const critical = malformedProducts.length + noPrimaryWinner + avoidableTextureMiss + avoidableRoutineMiss;
      report[slug] = {
        ok: critical === 0 && optionImagesMissing.length === 0,
        products: brand.products.length,
        combinations,
        malformedProducts,
        coverageMissing,
        noPrimaryWinner,
        avoidableTextureMiss,
        avoidableRoutineMiss
      };
    }

    const missingBrands = EXPECTED.filter((slug) => !brands[slug]);
    const extraBrands = Object.keys(brands).filter((slug) => !EXPECTED.includes(slug));
    const failed = Object.entries(report).filter(([, value]) => !value.ok).map(([slug]) => slug);

    res.status(200).json({
      ok: missingBrands.length === 0 && optionImagesMissing.length === 0 && failed.length === 0,
      expectedBrands: EXPECTED.length,
      actualBrands: Object.keys(brands).length,
      combinationsChecked: EXPECTED.length * 256,
      missingBrands,
      extraBrands,
      optionImagesMissing,
      failed,
      report
    });
  } catch (error) {
    res.status(500).json({ ok: false, error: String(error?.stack || error) });
  }
}
