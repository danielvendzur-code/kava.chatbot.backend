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
      'Peru Valley Coffee – vyvážená káva s nižšou aciditou, vhodná do automatu a na espresso',
      'Brazília Fazenda Pereira – sladká káva s čokoládovým a orieškovým smerom',
      'Keňa Mugaya AB – čistá a šťavnatá filtrovaná káva s egrešmi, černicami a jablkom',
      'Kolumbia Kumanday Reserve – menej ovocná káva s karamelom, kakaom a sladkým citrusom; espresso a automat',
      'Kolumbia El Buho Decaf – bezkofeínová omni káva s javorovým sirupom, karamelom a orieškami'
    ]
  },
  kaffa: {
    brand: 'Kaffa Roastery',
    web: 'https://kaffaroastery.sk/',
    products: [
      'Mokka Espresso Blend – 80 % arabica a 20 % robusta, espresso a mliečne nápoje',
      'Colombia Quebraditas Peach – moderný ovocný profil',
      'Kenya Kabingara Estate – svieža káva na filter',
      'Costa Rica Hacienda Sonora – sladká a vyvážená',
      'Colombia Finca El Diviso Decaf – výberová bezkofeínová káva'
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
      'Odpovedajte jednoduchou a gramaticky správnou slovenčinou. Napíšte presne dve krátke vety.',
      'Používajte vykanie bez rodových tvarov. Odpoveď neukončujte otázkou ani výzvou na ďalšiu konverzáciu.',
      'Odporučiť môžete iba presný názov produktu zo zoznamu Overené produkty. Nikdy nevymýšľajte názvy, fakty, ceny ani kontakty.',
      'Vhodnosť na automat, espresso, filter, mlieko alebo bezkofeínovú voľbu spomeňte iba vtedy, keď je priamo uvedená pri produkte.',
      'Ak otázku nemožno zodpovedať z údajov nižšie, povedzte to a odporučte chuťový kvíz alebo oficiálny e-shop.',
      'Pri odporúčaní stručne vysvetlite dôvod podľa prípravy, acidity, mlieka alebo charakteru kávy.',
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
        max_tokens: 170,
        temperature: 0,
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
    const cleanReply = reply.replace(/[\u002a_\u0060#]/g, '').replace(/\s+/g, ' ').trim();

    return res.status(200).json({ reply: cleanReply || 'Najpresnejšie odporúčanie získate cez krátky výber kávy.' });
  } catch (error) {
    console.error('coffee chat error', error);
    return res.status(500).json({ error: 'Chat failed' });
  }
}
