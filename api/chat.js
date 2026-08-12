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
  // Verified against the roastery's own WooCommerce store on 2026-08-08.
  jolka: {
    brand: 'Pražiareň Jolka',
    web: 'https://www.praziarenjolka.sk/eshop-kava/',
    products: [
      'Zmes Jolka – house blend s 20 % robusty, čokoláda a orechy, minimálna acidita, skvelá do mlieka aj ako espresso, 250 g za 13,50 €',
      'Zmes Čokoláda – house blend s 30 % robusty, čokoláda, orechy a hustá kréma, takmer žiadna acidita, 250 g za 13,50 €',
      '9-to-Fine – signature office blend s vyšším podielom robusty, krémová čokoládovo-oriešková chuť, minimálna acidita, ideálny do automatu, 500 g za 17 €',
      'Horké zlato – zmes pre milovníkov horkej chuti, plná horkosladká chuť a bohatá pena bez ovocnej kyslosti, 250 g za 14 €',
      'Sviatočná zmes – Brazil a Guatemala s 30 % vietnamskej robusty, vyšší kofeín, plná chuť a jemná acidita, 250 g za 14 €',
      'Brazil Cerrado Doce Diamantina – 100 % arabica, veľmi nízka acidita, plné zamatové telo, čokoláda, karamel a lieskové oriešky, 250 g za 13,50 €',
      'Honduras SHG EP San Andres – 100 % arabica, vyšší kofeín, minimálna jemná acidita, sladká až čokoládová chuť, 250 g za 13,50 €',
      'Colombia Supremo Scr.19 Sofía – 100 % arabica, nízka acidita, kakao, karamelová sladkosť a korenisté podtóny, 250 g za 13,50 €',
      'India Plantation AA – 100 % arabica, sladká a jemná, slaný karamel, škorica a orechy, plné telo a príjemná acidita, 250 g za 14 €',
      'Guatemala SHB EP – 100 % arabica, vysoká acidita, chuť ovocia a čokolády, skvelá na espresso, 250 g za 14 €',
      'Ethiopia SIDAMO GR.2 – 100 % arabica, vysoká citrusová acidita, jazmín a bergamot, na filter, svetlé alebo stredné praženie, 250 g za 14 €',
      'Vietnam Lang Biang Anaerobic Natural – výberová káva priamo od farmára, tropické ovocie a vínna dochuť, odporúčaná na V60 a Chemex, 250 g za 17 €',
      'DECAF Etiópia – bezkofeínová 100 % arabica z regiónu Guji, nízka acidita, jahody, čučoriedky a mliečna čokoláda, 250 g za 14 €',
      'Jamaica Blue Mountain – exkluzívny mikrolot, sladká a hladká chuť bez horkosti s jemnou aciditou, 250 g za 80 €',
      'Cascara Costa Rica – sušená dužina kávovej čerešne na prípravu čaju, sladký ovocný profil, 30 g za 3,50 €',
      'Cesta okolo sveta za kávou – darčekové degustačné balenia MINI, MIDI a MAXI s kávami z viacerých krajín a cascarou'
    ],
    notes: [
      'Káva sa predáva v baleniach 75 g, 150 g, 250 g, 500 g a 1 kg, okrem výnimiek uvedených vyššie.',
      'Pri každej káve si zákazník volí mletie: zrnká, espresso, moka konvička, filter, French press, Aeropress alebo džezva.',
      'El Salvador SHG EP je momentálne vypredaný, neodporúčajte ho.'
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
      `Overené produkty:\n- ${demo.products.join('\n- ')}`,
      ...(demo.notes?.length ? [`Ďalšie overené informácie:\n- ${demo.notes.join('\n- ')}`] : [])
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
