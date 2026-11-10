'use strict';
// Pure offline check. Caller supplies the unchanged CXAdvisorCore and official-source JSON.
// No imports, network, browser, registration, file writes or paid model calls.
function runCandidateCore(core, documents) {
  const {preflight, models, furiosa, scentium} = documents;
  const inputs = preflight.candidates.map(c => ({...c, model: models.reports.find(r => r.domain === c.domain).model})).concat([furiosa, scentium]);
  const normalizeUrl = url => url.replace('://www.', '://');
  return inputs.map(c => {
    const products = c.model.options.flatMap(group => group.options.map(leaf => {
      const p = c.products.find(p => normalizeUrl(p.url) === normalizeUrl(leaf.sourceUrl || leaf.productUrl));
      if (!p) throw Error('Missing source product: ' + leaf.value);
      const available = p.available ?? p.stockEvidence?.officialVariantAvailable;
      if (available !== true || !p.notesExcerpt || !p.pack || !Number.isFinite(p.priceAmount)) throw Error('Incomplete source: ' + leaf.value);
      return {
        id: leaf.value, name: p.name, url: p.url, volume: p.pack,
        priceAmount: p.priceAmount, currency: p.currency, available,
        photo: p.photoUrl || p.photoUrls?.[0], category: 'fragrance',
        kind: 'Parfém', tags: [],
        source: {
          series: 's5', categoryLocked: true, kindLocked: true,
          selectionTraits: {fragranceDirection: group.value, fragranceProfile: leaf.value},
          selectionTraitsEvidence: {url: p.url, notes: p.notesExcerpt}
        }
      };
    }));
    const engine = core.create(products), questions = [], leaves = [];
    function visit(answers = {}) {
      const step = engine.steps(answers).find(s => answers[s.key] === undefined);
      if (step) {
        if (!['fragranceDirection', 'fragranceProfile'].includes(step.key) || step.options.length < 2) throw Error('Invalid question');
        questions.push({answers, key: step.key, options: step.options});
        step.options.forEach(value => visit({...answers, [step.key]: value}));
        return;
      }
      const result = engine.recommend(answers), p = result.winner;
      if (!p || result.matches.length !== 1 || core.complementFor(engine.products, answers, p) !== null) throw Error('Invalid result');
      for (const [key, value] of Object.entries(answers)) if (p.features[key] !== value) throw Error('Wrong selected trait');
      const original = products.find(item => item.id === p.id);
      for (const key of ['url', 'volume', 'priceAmount', 'currency', 'photo']) if (p[key] !== original[key]) throw Error('Source value changed: ' + key);
      leaves.push({answers, id:p.id, url:p.url, pack:p.volume, priceAmount:p.priceAmount, currency:p.currency});
    }
    visit();
    if (leaves.length !== products.length || new Set(leaves.map(l => l.id)).size !== products.length) throw Error('Unreachable or duplicate formula');
    return {
      domain:c.domain, status:'PASS_EXISTING_CORE_DATA_ONLY', formulas:products.length,
      questionCount:questions.length, questions, leaves,
      allProductsReachableExactlyOnce:true, noEmptyOrSingleChoiceQuestion:true,
      onlyFragranceQuestions:true, optionalAddon:null, registryChanged:false, liveQa:false
    };
  });
}
if (typeof module !== 'undefined') module.exports = runCandidateCore;
