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
    const weights = { skin: 9, goal: 11, routine: 5, texture: 6 };
    const score = (product, answers) => questions.reduce((total, question) => {
      const answer = answers[question.key];
      if (!answer || answer === 'any') return total;
      return total + (product.tags.includes(answer) ? weights[question.key] : -1);
    }, 0);

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
        const answers = { skin, goal, routine, texture };
        const ranked = brand.products
          .map((product, index) => ({ product, index, score: score(product, answers) }))
          .sort((a, b) => b.score - a.score || a.index - b.index);
        const winner = ranked[0]?.product;
        if (!winner) { noPrimaryWinner += 1; continue; }

        const primaryCandidates = brand.products.filter((product) => product.tags.includes(skin) || product.tags.includes(goal));
        if (primaryCandidates.length && !winner.tags.includes(skin) && !winner.tags.includes(goal)) noPrimaryWinner += 1;

        if (texture !== 'any' && !winner.tags.includes(texture)) {
          const betterTexture = brand.products.some((product) =>
            product.tags.includes(texture) &&
            (product.tags.includes(skin) || product.tags.includes(goal)) &&
            score(product, answers) >= score(winner, answers));
          if (betterTexture) avoidableTextureMiss += 1;
        }

        if (!winner.tags.includes(routine)) {
          const betterRoutine = brand.products.some((product) =>
            product.tags.includes(routine) &&
            (product.tags.includes(skin) || product.tags.includes(goal)) &&
            score(product, answers) >= score(winner, answers));
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
