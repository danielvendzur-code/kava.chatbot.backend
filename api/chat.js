const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = process.env.CHAT_MODEL || 'claude-haiku-4-5';

const DEMOS = {
  praziarnicka: {
    brand: 'Pražiarnička by Caffè Vita',
    web: 'https://praziarnicka.sk/eshop',
    products: [
      'Paganini blend – vyvážený espresso blend, vhodný aj do mlieka',
      'Brazil Santos – jemná 100 % arabica, čokoládová, nízka acidita',
      'Puccini blend – výraznejší blend s hustou krémou',
      'Cuba Serrano Lavado – sladká arabica s kakaom a orechmi',
      'Bezkofeínová Brazil – jemná káva bez kofeínu'
    ]
  },
  diamonds: {
    brand: 'Diamonds Roastery',
    web: 'https://diroastery.sk/kategoria-produktu/kava/',
    products: [
      'Brazília Fazenda Pereira – sladký čokoládový profil',
      'Kongo Kisunga – ovocnejšia výberová káva na filter',
      'Keňa Mugaya AB – svieža a výrazná filtrovaná káva',
      'Kolumbia Kumanday Reserve – jemná sladká káva s citrusovou dochuťou',
      'Kolumbia El Buho Decaf – plná bezkofeínová káva'
    ]
  },
  kaffa: {
    brand: 'Kaffa Roastery',
    web: 'https://kaffaroastery.sk/',
    products: [
      'Mokka Espresso Blend – 11,90 € až 32,13 €, 80 % Arabica / 20 % Robusta, kakao, mandle a lieskovce',
      'Kenya Kamundu Estate AA – 13,98 €, 250 g, filter, čierne ríbezle, malina, slivka a vanilka',
      'Colombia Finca El Diviso Decaf – 16,42 €, 200 g, Sugar Cane Decaf, vanilka, mandarínka a jazmín',
      'Mexico Finca La Esperanza – 12,79 €, 250 g, moderné espresso, marakuja, mandarínka, čokoláda a toffee',
      'Geisha Ninety Plus Stellar Origin – 21,42 €, 150 g, V60/Origami/Kalita, mango, marakuja, med a pomarančový kvet'
    ]
  },
  vitazov: {
    brand: 'Káva Víťazov',
    web: 'https://kavavitazov.sk/obchod/',
    products: [
      'Office Blend – silná, menej kyslá káva s vyšším kofeínom',
      'Victory Blend – 100 % arabica signature blend',
      'Brazília – sladká čokoládová arabica',
      'Etiópia – svieža výberová arabica na filter',
      'Bezkofeínová – 100 % arabica bez kofeínu'
    ]
  },
  concept: {
    brand: 'Concept Coffee Roasters',
    web: 'https://www.conceptcoffee.sk/',
    products: [
      'Weithaga AA – Kenya – svieža káva na filter',
      'Nemba – Burundi – sladká a ovocná',
      'Gedicho – Ethiopia – kvetinová a ľahká',
      'Berry Blast – Colombia – výrazný bobuľový profil',
      'Summerjam – Colombia – sladká sezónna káva'
    ]
  },
  jolka: {
    brand: 'Pražiareň Jolka',
    web: 'https://www.praziarenjolka.sk/shop/',
    products: [
      'Zmes Jolka – čokoládová, orechová, nízka acidita, vhodná do mlieka',
      'Zmes Čokoláda – sladký klasický profil',
      'Ethiopia SIDAMO GR.2 – citrus, jazmín a bergamot, light roast',
      'Vietnam Lang Biang Anaerobic Natural – intenzívna ovocná káva',
      'El Salvador SHG EP – vyvážená stredoamerická káva'
    ]
  }
};

function setCors(req, res) {
  const origin = req.headers.origin || '';
  const allowed = origin === '' || /(^https:\/\/([a-z0-9-]+\.)?mojchatbot\.sk$)|(^https:\/\/.*\.vercel\.app$)|(^http:\/\/localhost:\d+$)|(^http:\/\/127\.0\.0\.1:\d+$)/i.test(origin);
  res.setHeader('Access-Control-Allow-Origin', allowed && origin ? origin : 'https://mojchatbot.sk');
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default async function handler(req, res) {
  setCors(req, res);
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    if (!ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY is not configured');

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const demo = DEMOS[String(body.demoId || '')];
    if (!demo) return res.status(400).json({ error: 'Unknown demo' });

    const messages = Array.isArray(body.messages)
      ? body.messages
          .filter((message) => message && (message.role === 'user' || message.role === 'assistant'))
          .slice(-10)
          .map((message) => ({
            role: message.role,
            content: String(message.content || '').slice(0, 700)
          }))
          .filter((message) => message.content.trim())
      : [];

    if (!messages.length || messages.at(-1).role !== 'user') {
      return res.status(400).json({ error: 'Missing user message' });
    }

    const system = [
      `Ste stručný online kávový poradca pre ${demo.brand}.`,
      'Odpovedajte po slovensky, prirodzene a maximálne v 2 až 3 krátkych vetách.',
      'Vždy vykajte. Nepoužívajte markdownové odrážky ani vymyslené fakty, ceny, kontakty alebo produkty.',
      'Ak otázku nemožno zodpovedať z údajov nižšie, povedzte to a odporučte chuťový kvíz alebo oficiálny e-shop.',
      'Pri odporúčaní stručne vysvetlite dôvod podľa prípravy, acidity, mlieka alebo kofeínu.',
      'Pri Kaffa vysvetlite, že príjemná ovocnosť je šťavnatá a vyvážená, kým nepríjemná kyslosť je ostrá a rušivá.',
      `Oficiálny e-shop: ${demo.web}`,
      `Overené produkty:\n- ${demo.products.join('\n- ')}`
    ].join('\n\n');

    const apiResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 280,
        temperature: 0.25,
        system,
        messages
      })
    });

    if (!apiResponse.ok) {
      const detail = await apiResponse.text();
      console.error('Anthropic API error', apiResponse.status, detail);
      return res.status(502).json({ error: 'AI unavailable' });
    }

    const data = await apiResponse.json();
    const reply = Array.isArray(data.content)
      ? data.content.filter((block) => block.type === 'text').map((block) => block.text).join('').trim()
      : '';

    return res.status(200).json({ reply: reply || 'Najpresnejšie odporúčanie získate cez krátky výber kávy.' });
  } catch (error) {
    console.error('coffee chat error', error);
    return res.status(500).json({ error: 'Chat failed' });
  }
}
