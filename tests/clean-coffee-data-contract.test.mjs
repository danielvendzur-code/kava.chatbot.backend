import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const demos = ['praziarnicka', 'diamonds', 'kaffa', 'vitazov', 'concept'];

function loadData(slug) {
  const file = resolve(root, `${slug}-jolka-data.js`);
  const source = readFileSync(file, 'utf8');
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(source, context, { filename: file });
  return context.window.JOLKA;
}

function localAssetExists(pathname) {
  if (!pathname || !pathname.startsWith('/')) return false;
  const clean = pathname.split(/[?#]/, 1)[0];
  return existsSync(resolve(root, `.${clean}`));
}

for (const slug of demos) {
  test(`${slug}: active Jolka data contract is complete and local assets exist`, () => {
    const data = loadData(slug);
    assert.ok(data && typeof data === 'object');
    assert.equal(data.demo.id, slug);
    assert.ok(data.brand?.name);
    assert.ok(Array.isArray(data.products) && data.products.length >= 4);
    assert.equal(data.steps?.length, 4);
    assert.equal(data.chat?.chips?.length, 4);

    for (const logoKey of ['logoInk', 'logoBadge', 'logoHeader']) {
      const logo = data.demo[logoKey];
      assert.ok(localAssetExists(logo), `${slug} missing ${logoKey}: ${logo}`);
    }
    assert.ok(localAssetExists(data.demo.heroImage), `${slug} missing hero image`);
    assert.ok(localAssetExists(data.demo.entryImage), `${slug} missing entry image`);

    for (const product of data.products) {
      assert.ok(product.id && product.name);
      assert.match(product.url, /^https:\/\//);
      assert.ok(localAssetExists(product.photo), `${slug}/${product.id} missing photo: ${product.photo}`);
      assert.ok(Array.isArray(product.notes) && product.notes.length >= 2);
      assert.ok(product.taste && product.prep && product.drink);
    }

    for (const step of data.steps) {
      assert.ok(step.key && step.title);
      assert.ok(step.options.length >= 3 && step.options.length <= 4, `${slug}/${step.key} option count`);
      for (const option of step.options) {
        assert.ok(option.value && option.title);
        if (option.photo) assert.ok(localAssetExists(option.photo), `${slug}/${step.key} missing option image: ${option.photo}`);
        if (option.product) assert.ok(data.products.some((product) => product.id === option.product), `${slug}/${step.key} bad product ref`);
      }
    }
  });
}
