const fs = require('node:fs');
const vm = require('node:vm');
if (!process.argv[2]) throw new Error('Usage: node scripts/apply-verified-coffee-packs.cjs <reviewed-evidence.json>');
const evidence = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
for (const [slug, shop] of Object.entries(evidence.shops)) {
  const file = `coffee-catalogues/${slug}.js`;
  const context = {};
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(file, 'utf8'), context);
  const catalogue = context.CX_COFFEE_CATALOGUES[slug];
  const byUrl = new Map(shop.products.map(p => [shop.baseUrl + p.path, p]));
  const money = n => shop.currency === 'CZK' ? `${n} Kč` : `${n.toFixed(2).replace('.', ',')} €`;
  let count = 0;
  for (const product of [...catalogue.products, ...catalogue.offer]) {
    const record = byUrl.get(product.url);
    if (!record) continue;
    product.source = {...product.source, packVerifiedAt: evidence.checkedAt, packEvidenceUrl: product.url};
    count++;
    if (record.packLabel) {
      product.variants = [];
      product.priceAmount = record.price;
      product.price = product.priceFrom = money(record.price);
      product.priceUnit = product.weights = record.packLabel;
      continue;
    }
    const grinds = (shop.grindGroups?.[record.grindGroup || 'default'] || shop.grinds || [{grind:null,label:null,surcharge:0}])
      .map(g => typeof g === 'string' ? {label:g, grind:/^NEMLÍT/.test(g)?'beans':'ground',surcharge:0} : g);
    product.variants = record.variants.flatMap(([grams, basePrice, extra, available]) =>
      grinds.map(grind => ({
        grams, price:basePrice + grind.surcharge, extra, available, grind:grind.grind,
        label: `${grams === 1000 ? '1 kg' : grams + ' g'}${extra ? ' · ' + extra : ''}${grind.label ? ' · ' + grind.label : ''}`,
        priceLabel: money(basePrice + grind.surcharge)
      })));
    const live = product.variants.filter(v => v.available);
    const regular = live.filter(v => v.grams >= 150);
    const priced = regular.length ? regular : live;
    const minimum = Math.min(...priced.map(v => v.price));
    product.priceAmount = minimum;
    product.price = (new Set(priced.map(v => v.price)).size > 1 ? 'od ' : '') + money(minimum);
    product.priceFrom = product.price;
    product.priceUnit = 'Viac balení';
    product.weights = [...new Set(live.map(v => v.grams + ' g'))].join(', ');
  }
  if (count !== shop.products.length * 2) throw new Error(`Expected catalogue/offer pairs: ${slug} ${count}`);
  catalogue.packVariantsVerifiedAt = evidence.checkedAt;
  fs.writeFileSync(file, `globalThis.CX_COFFEE_CATALOGUES ||= {};\nglobalThis.CX_COFFEE_CATALOGUES[${JSON.stringify(slug)}] = ${JSON.stringify(catalogue)};\n`);
  console.log(`${slug}: ${shop.products.length} products, ${shop.products.reduce((n,p)=>n+p.variants.length,0)} verified variants.`);
}
