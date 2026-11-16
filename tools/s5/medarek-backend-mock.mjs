import assert from 'node:assert/strict';
import {answer} from '../../lib/cosmetics-chat.js';

const scenarios = [
  ['Mátový šampuk', 'bublinovy-sampuk'],
  ['Bambucké mýdlo', 'bambucke-mydlo'],
  ['Mangový balzám na rty', 'balzam-na-rty-mango'],
];
for (const [content, id] of scenarios) {
  const product = globalThis.CX_CATALOGUES.medarek.products.find((item) => item.id === id);
  let mockCalls = 0;
  const response = await answer({demoId: 'medarek', messages: [{role: 'user', content}]}, {
    ai: async ({brand}) => {
      mockCalls++;
      assert.equal(brand, 'Medarek');
      return '';
    },
  });
  assert.equal(response.status, 200);
  assert.equal(mockCalls, 1);
  for (const field of [product.url, product.price, product.volume]) assert.ok(response.json.reply.includes(field));
}
console.log('Medarek: three mocked replies, zero paid calls');
