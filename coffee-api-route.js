(() => {
  'use strict';
  if (['127.0.0.1', 'localhost'].includes(location.hostname)) return;

  const nativeFetch = window.fetch.bind(window);
  const replies = {
    praziarnicka: {
      automatic: 'Do automatu by som začal Paganini blendom. Je plný, čokoládovo-orieškový a dobre funguje ako každodenná káva.',
      milk: 'Do cappuccina alebo latte sa hodí Paganini blend. Jeho plnšia chuť sa v mlieku nestratí.',
      filter: 'Na filter skúste Brazil Santos alebo Cuba Serrano Lavado podľa toho, či chcete jemnejší alebo plnší profil. Krátky výber kávy vám ich zúži podľa chuti.',
      decaf: 'Ak chcete kávu bez kofeínu, vyberte Bezkofeínovú Brazil. Je jemná a vhodná aj na večer.',
      default: 'Ak chcete pokojnejšiu čokoládovú chuť, dobrým začiatkom je Brazil Santos. Cez Výber kávy ju vieme zúžiť podľa prípravy a toho, či pijete kávu s mliekom.'
    },
    diamonds: {
      automatic: 'Do automatu je dobrý východiskový bod Peru Valley Coffee. Má vyváženejší profil a nižšiu aciditu.',
      milk: 'K mliečnym nápojom by som volil sladší a plnší profil, napríklad Brazília Fazenda Pereira. Čokoládovo-orieškový smer zostane čitateľný aj v mlieku.',
      filter: 'Na filter siahnite skôr po Keňa Mugaya AB. Je čistejšia, šťavnatejšia a ovocnejšia než espresso profily.',
      decaf: 'Bez kofeínu je v ponuke Kolumbia El Buho Decaf. Zachováva sladký karamelovo-orieškový charakter bez klasickej dávky kofeínu.',
      default: 'Ak chcete sladšiu a menej ovocnú kávu, začnite Brazília Fazenda Pereira. Výber kávy potom zohľadní prípravu aj chuť, ktorú preferujete.'
    },
    kaffa: {
      automatic: 'Do automatu alebo na klasické espresso je najjednoduchší štart Mokka Espresso Blend. Má sladší profil s kakaom, mandľami a lieskovcami.',
      milk: 'Do mlieka sa dobre hodí Mokka Espresso Blend. Jeho kakaovo-orieškový charakter zostáva výrazný aj v cappuccine.',
      filter: 'Na filter skúste Kenya Kamundu Estate AA, ak máte radi sviežejšiu ovocnosť. Má profil čiernych ríbezlí, maliny, slivky a vanilky.',
      decaf: 'Bez kofeínu je Colombia Finca El Diviso Decaf. Má sladký profil s vanilkou, mandarínkou a jazmínom.',
      default: 'Ak nechcete výraznú ovocnosť, začnite Mokka Espresso Blendom. Výber kávy potom rozlíši prípravu aj chuťový smer presnejšie.'
    },
    vitazov: {
      automatic: 'Do automatu alebo kancelárie by som začal Office Blendom. Je silnejší, menej kyslý a navrhnutý na každodenné pitie.',
      milk: 'Do mlieka sa hodí plnšia káva, ktorá sa v cappuccine nestratí. Office Blend je bezpečný východiskový bod, ak chcete menej kyslosti a výraznejšie telo.',
      filter: 'Na filter skúste Etiópiu. Je sviežejšia a vhodnejšia na ľahší výberový profil.',
      decaf: 'Ak chcete kávu bez kofeínu, vyberte Bezkofeínovú. Výber kávy potom ešte zohľadní spôsob prípravy.',
      default: 'Ak hľadáte univerzálnu kávu domov, začnite Victory Blendom. Pri kancelárii alebo automate dáva väčší zmysel Office Blend.'
    },
    concept: {
      automatic: 'Ak chcete menej ovocný profil do espressa, nechajte si výber zúžiť cez poradcu podľa aktuálnej ponuky. Concept pracuje so sezónnymi kávami, preto je príprava dôležitá.',
      milk: 'K mlieku vyberajte plnší a sladší profil namiesto najľahšieho filtra. Výber kávy ho zúži podľa aktuálnej sezónnej ponuky.',
      filter: 'Na filter je dobrým smerom Weithaga AA – Kenya, ak máte radi sviežejšiu kávu. Pri ovocnejšom profile sa oplatí porovnať aj ďalšie sezónne loty.',
      decaf: 'Pri bezkofeínovej voľbe odporúčam overiť aktuálnu sezónnu ponuku Conceptu. Poradca vás nasmeruje na vhodný profil bez vymýšľania nedostupného produktu.',
      default: 'Ak máte radi ovocnejšiu a sviežu kávu, začnite Weithaga AA – Kenya. Cez Výber kávy sa dá výsledok spresniť podľa prípravy.'
    },
    jolka: {
      automatic: 'Do automatu sa hodí 9-to-Fine, ak chcete plnšiu čokoládovo-orieškovú kávu s minimálnou aciditou. Pri jemnejšom profile je dobrý smer Zmes Jolka.',
      milk: 'Do mlieka sa dobre hodí Zmes Jolka. Čokoládovo-orieškový profil zostáva čitateľný aj v cappuccine alebo latte.',
      filter: 'Na filter je vhodná Ethiopia SIDAMO GR.2, ak chcete citrusovejšiu a kvetinovú kávu. Pri tropickejšom profile skúste Vietnam Lang Biang Anaerobic Natural.',
      decaf: 'Bez kofeínu je DECAF Etiópia. Má nízku aciditu a sladší profil s jahodami, čučoriedkami a mliečnou čokoládou.',
      default: 'Ak chcete minimum acidity a klasickú sladšiu chuť, začnite Zmesou Jolka. Výber kávy potom zohľadní prípravu aj to, či ju pijete s mliekom.'
    }
  };

  const latestText = (init) => {
    try {
      const payload = JSON.parse(init?.body || '{}');
      const content = payload.messages?.filter((m) => m?.role === 'user').at(-1)?.content || '';
      return { demoId: payload.demoId || document.body.dataset.demo || window.__COFFEE_DEMO_SLUG__, content: String(content) };
    } catch {
      return { demoId: document.body.dataset.demo || window.__COFFEE_DEMO_SLUG__, content: '' };
    }
  };

  const fallbackReply = (demoId, content) => {
    const set = replies[demoId] || replies.praziarnicka;
    const q = content.toLocaleLowerCase('sk');
    if (/bez\s*kofe|decaf|večer/.test(q)) return set.decaf;
    if (/filter|v60|chemex|french|aeropress|ovoc|sviež/.test(q)) return set.filter;
    if (/mliek|capp|latte|flat\s*white/.test(q)) return set.milk;
    if (/automat|kancel|office|firma/.test(q)) return set.automatic;
    return set.default;
  };

  const fallbackResponse = (init) => {
    const { demoId, content } = latestText(init);
    return new Response(JSON.stringify({ reply: fallbackReply(demoId, content), fallback: true }), {
      status: 200,
      headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }
    });
  };

  async function requestApi(init) {
    return nativeFetch('/api/chat', init);
  }

  window.fetch = async (input, init) => {
    const url = typeof input === 'string' ? input : input?.url || '';
    if (!(url === '/api/chat' || url.endsWith('/api/chat'))) return nativeFetch(input, init);

    try {
      const response = await requestApi(init);
      if (!response.ok) return fallbackResponse(init);
      const copy = response.clone();
      try {
        const data = await copy.json();
        if (!data || typeof data.reply !== 'string' || !data.reply.trim()) return fallbackResponse(init);
      } catch {
        return fallbackResponse(init);
      }
      return response;
    } catch (error) {
      console.warn('Coffee chat API unavailable, using deterministic product fallback.', error);
      return fallbackResponse(init);
    }
  };
})();
