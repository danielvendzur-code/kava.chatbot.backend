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
      default: 'Ak chcete pokojnejšiu čokoládovú chuť, dobrým začiatkom je Brazil Santos. Cez Výber kávy ju vieme zúžiť podľa prípravy a toho, či pijete kávu s mliekom.',
      origin: 'Paganini a Puccini sú zmesi arabiky a robusty, Brazil Santos a Cuba Serrano Lavado sú stopercentné arabiky z Brazílie a Kuby. Bezkofeínová je brazílska arabica zbavená kofeínu.',
      compare: 'Brazil Santos je jemnejšia a sladšia, Paganini plnší a hodí sa aj do mlieka. Ak nechcete kyslosť, sú bezpečné oba; Cuba Serrano je z nich najplnšia a najlepšie vynikne bez mlieka.'
    },
    diamonds: {
      automatic: 'Do automatu je dobrý východiskový bod Peru Valley Coffee. Má vyváženejší profil a nižšiu aciditu.',
      milk: 'K mliečnym nápojom by som volil sladší a plnší profil, napríklad Brazília Fazenda Pereira. Čokoládovo-orieškový smer zostane čitateľný aj v mlieku.',
      filter: 'Na filter siahnite skôr po Keňa Mugaya AB. Je čistejšia, šťavnatejšia a ovocnejšia než espresso profily.',
      decaf: 'Bez kofeínu je v ponuke Kolumbia El Buho Decaf. Zachováva sladký karamelovo-orieškový charakter bez klasickej dávky kofeínu.',
      default: 'Ak chcete sladšiu a menej ovocnú kávu, začnite Brazília Fazenda Pereira. Výber kávy potom zohľadní prípravu aj chuť, ktorú preferujete.',
      origin: 'V ponuke je Brazília Fazenda Pereira, Keňa Mugaya AB, Kolumbia Kumanday Reserve a bezkofeínová Kolumbia El Buho. Pri každej káve je uvedený pôvod aj spracovanie.',
      compare: 'Brazília je sladká a čokoládová, Keňa šťavnatá a ovocná. Do automatu a do mlieka sa hodí Brazília, na filter Keňa. Kumanday je niekde medzi nimi.'
    },
    kaffa: {
      automatic: 'Do automatu alebo na klasické espresso je najjednoduchší štart Mokka Espresso Blend. Má sladší profil s kakaom, mandľami a lieskovcami.',
      milk: 'Do mlieka sa dobre hodí Mokka Espresso Blend. Jeho kakaovo-orieškový charakter zostáva výrazný aj v cappuccine.',
      filter: 'Na filter skúste Kenya Kamundu Estate AA, ak máte radi sviežejšiu ovocnosť. Má profil čiernych ríbezlí, maliny, slivky a vanilky.',
      decaf: 'Bez kofeínu je Colombia Finca El Diviso Decaf. Má sladký profil s vanilkou, mandarínkou a jazmínom.',
      default: 'Ak nechcete výraznú ovocnosť, začnite Mokka Espresso Blendom. Výber kávy potom rozlíši prípravu aj chuťový smer presnejšie.',
      origin: 'Mokka je espresso zmes, Kenya Kamundu Estate AA je z Kene, Finca El Diviso a Wilder Lazo sú kolumbijské mikrolóty. Pôvod aj farmu nájdete pri každej káve.',
      compare: 'Mokka je kakaová a plná, Kamundu svieža a ovocná. Do mlieka a do automatu sa hodí Mokka, na filter Kamundu. Diviso je bezkofeínová voľba s podobne komplexnou chuťou.'
    },
    vitazov: {
      automatic: 'Do automatu alebo kancelárie by som začal Office Blendom. Je silnejší, menej kyslý a navrhnutý na každodenné pitie.',
      milk: 'Do mlieka sa hodí plnšia káva, ktorá sa v cappuccine nestratí. Office Blend je bezpečný východiskový bod, ak chcete menej kyslosti a výraznejšie telo.',
      filter: 'Na filter skúste Etiópiu. Je sviežejšia a vhodnejšia na ľahší výberový profil.',
      decaf: 'Ak chcete kávu bez kofeínu, vyberte Bezkofeínovú. Výber kávy potom ešte zohľadní spôsob prípravy.',
      default: 'Ak hľadáte univerzálnu kávu domov, začnite Victory Blendom. Pri kancelárii alebo automate dáva väčší zmysel Office Blend.',
      origin: 'Office Blend je zmes arabiky a robusty, Victory Blend spája tri arabiky, Brazília a Etiópia sú jednodruhové arabiky. Bezkofeínová je brazílska arabica zbavená kofeínu vodou.',
      compare: 'Office Blend je výraznejší a menej kyslý, Victory Blend jemnejší a univerzálnejší. Do kancelárie a do automatu sa hodí Office, domov na každý deň Victory.'
    },
    concept: {
      automatic: 'Ak chcete menej ovocný profil do espressa, nechajte si výber zúžiť cez poradcu podľa aktuálnej ponuky. Concept pracuje so sezónnymi kávami, preto je príprava dôležitá.',
      milk: 'K mlieku vyberajte plnší a sladší profil namiesto najľahšieho filtra. Výber kávy ho zúži podľa aktuálnej sezónnej ponuky.',
      filter: 'Na filter je dobrým smerom Weithaga AA – Kenya, ak máte radi sviežejšiu kávu. Pri ovocnejšom profile sa oplatí porovnať aj ďalšie sezónne loty.',
      decaf: 'Pri bezkofeínovej voľbe odporúčam overiť aktuálnu sezónnu ponuku Conceptu. Poradca vás nasmeruje na vhodný profil bez vymýšľania nedostupného produktu.',
      default: 'Ak máte radi ovocnejšiu a sviežu kávu, začnite Weithaga AA – Kenya. Cez Výber kávy sa dá výsledok spresniť podľa prípravy.',
      origin: 'Ponuka je sezónna — teraz sú v nej kávy z Kene, Burundi, Etiópie a Kolumbie. Pri každej je uvedená krajina, región aj spracovanie.',
      compare: 'Weithaga z Kene je čistá a svieža, Berry Blast z Kolumbie výrazne bobuľový. Na filter sa hodia obe, Holysh*t! je espresso zmes pre plnšiu a sladšiu šálku.'
    },
    jolka: {
      automatic: 'Do automatu sa hodí 9-to-Fine, ak chcete plnšiu čokoládovo-orieškovú kávu s minimálnou aciditou. Pri jemnejšom profile je dobrý smer Zmes Jolka.',
      milk: 'Do mlieka sa dobre hodí Zmes Jolka. Čokoládovo-orieškový profil zostáva čitateľný aj v cappuccine alebo latte.',
      filter: 'Na filter je vhodná Ethiopia SIDAMO GR.2, ak chcete citrusovejšiu a kvetinovú kávu. Pri tropickejšom profile skúste Vietnam Lang Biang Anaerobic Natural.',
      decaf: 'Bez kofeínu je DECAF Etiópia. Má nízku aciditu a sladší profil s jahodami, čučoriedkami a mliečnou čokoládou.',
      default: 'Ak chcete minimum acidity a klasickú sladšiu chuť, začnite Zmesou Jolka. Výber kávy potom zohľadní prípravu aj to, či ju pijete s mliekom.',
      origin: 'Zmes Jolka a Zmes Čokoláda sú vlastné zmesi pražiarne. Jednodruhové kávy sú z Etiópie, Vietnamu, Brazílie, Kolumbie a Hondurasu — pôvod je pri každej uvedený.',
      compare: 'Zmes Jolka má minimálnu aciditu a čokoládovo-orechovú chuť, Ethiopia Sidamo je naopak citrusová a kvetinová. Ak nechcete kyslosť, voľte zmesi; ak chcete objavovať, jednodruhovú kávu.'
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
    // Asked before the brewing matchers: "odkiaľ je káva" names no preparation,
    // and a comparison question usually names two coffees at once.
    if (/odkia[ľl]|p[ôo]vod|krajin|pochádz|farma/.test(q)) return set.origin || set.default;
    if (/porovna|rozdiel|lep[šs]ia|ktor[áa] z|namiesto/.test(q)) return set.compare || set.default;
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
