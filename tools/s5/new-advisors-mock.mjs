import assert from 'node:assert/strict';
import {answer} from '../../lib/cosmetics-chat.js';
const checks = {
  dvoukocek: [['Levandulové mýdlo', 'prirodni-mydlo-levandulove-le'], ['Moringové mýdlo', 'moringove-mydlo'], ['Šampon na suché vlasy', 'tuhy-sampon-suche-vlasy_maisoap']],
  mydlarnaerde: [['Šampuk s hennou', 'sampuk--henna'], ['Rakytníkové mýdlo', 'citrusovy-rakytnik-prirodni-mydlo'], ['Šampuk s meruňkou', 'merunka-a-hedvabi-sampuk-s-kondicionerem-90-g']],
  meetea: [['Květinový oolong', 'baozhong-2026'], ['Černý čaj s kakaem', 'ruby-18-redjade-taiwan-hong'], ['Čaj s tóny kávy', 'kolac-2024']],
};
let mockCalls = 0;
for (const [demoId, queries] of Object.entries(checks)) {
  const catalogue = globalThis.CX_CATALOGUES[demoId];
  for (const [content, id] of queries) {
    const product = catalogue.products.find((item) => item.id === id);
    const response = await answer({demoId, messages: [{role: 'user', content}]}, {
      ai: async ({brand}) => {
        mockCalls++;
        assert.equal(brand, catalogue.brand);
        return '';
      },
    });
    assert.equal(response.status, 200);
    assert.equal(response.json.fallback, true);
    for (const value of [product.url, product.price, product.volume]) assert.ok(response.json.reply.includes(value), content);
  }
}
assert.equal(mockCalls, 9);
console.log('Nine grounded mock replies, zero paid calls');
