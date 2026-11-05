/* c2 – vypíše všetky cesty výberu (otázka=odpoveď → výsledok) pre black/nordbeans. node tools/c2/paths.mjs slug */
import {createRequire} from 'module';
const require = createRequire(import.meta.url);
const E = require('../../n447/c2/engine-c2.js'), D = require('../../n447/c2/data/' + process.argv[2] + '.js');
for (const p of E.allPaths(D)) console.log(p.trail.map((s) => s.key + '=' + s.value).join(' > ').padEnd(88), '→', p.result ? p.result.product.name + ' · ' + (p.result.pack ? E.grams(p.result.pack.grams || 0) + ' ' + p.result.priceLabel : p.result.priceLabel) + (p.result.set ? ' [SET]' : '') : 'NULL');
