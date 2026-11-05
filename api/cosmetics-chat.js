/* séria 3: chat ukážok na základe Andreine. cosmetics.js posiela {demoId, messages}; káva → lib/coffee-chat.js, kozmetika → lib/cosmetics-chat.js.
   Produkčný model ostáva v api/ai-chat.js (kľúč iba z prostredia Vercelu); testy ho volajú cez mock, nikdy platene. */
import * as coffee from '../lib/coffee-chat.js';
import * as cosmetics from '../lib/cosmetics-chat.js';

export default async function handler(req, res) {
  const origin = req.headers.origin || '';
  const ok = origin === '' || /(^https:\/\/([a-z0-9-]+\.)?mojchatbot\.sk$)|(^https:\/\/.*\.vercel\.app$)|(^http:\/\/(localhost|127\.0\.0\.1):\d+$)/i.test(origin);
  res.setHeader('Access-Control-Allow-Origin', ok && origin ? origin : 'https://mojchatbot.sk');
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({error: 'Method not allowed'});
  let body = {};
  try { body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {}); } catch { return res.status(400).json({error: 'Invalid body'}); }
  const slug = String(body.demoId || '');
  /* Každá adresa iba svoju firmu: na <firma>.mojchatbot.sk nič iné. */
  const host = String(req.headers.host || '').split(':')[0].toLowerCase();
  if (host.endsWith('.mojchatbot.sk') && host !== slug + '.mojchatbot.sk') return res.status(400).json({error: 'Host company mismatch'});
  const mod = Object.prototype.hasOwnProperty.call(coffee.DEMOS, slug) ? coffee : Object.prototype.hasOwnProperty.call(cosmetics.BRANDS, slug) ? cosmetics : null;
  if (!mod) return res.status(400).json({error: 'Unknown demo'});
  const out = await mod.answer(body);
  return res.status(out.status).json(out.json);
}
