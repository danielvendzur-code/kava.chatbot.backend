import assert from 'node:assert/strict';
import {answer} from '../../lib/cosmetics-chat.js';

const plant = 'zahradananiti';
const checks = [
  ['Rostlina do polostínu do 100 Kč', /Haworthia.*95 Kč/i],
  ['Jak zalévat pileu?', /proschnutí vrchní části substrátu/],
  ['Porovnej Pileu a Havortii', /Haworthia[\s\S]+Pilea|Pilea[\s\S]+Haworthia/i],
  ['Máte rostlinu bezpečnou pro kočky?', /nemám ověřené/],
];
for (const [content, expected] of checks) {
  const response = await answer({demoId: plant, messages: [{role: 'user', content}]}, {
    ai: () => assert.fail('The plant responder uses catalogue facts directly.'),
  });
  assert.equal(response.status, 200);
  assert.match(response.json.reply, expected);
}
console.log('Four grounded plant API replies; zero model calls');
