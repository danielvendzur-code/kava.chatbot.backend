/* "Viac info" under the hero buttons of a demo page that does not carry it yet: the same approved
   wording as on the wine and hair demos, in Slovak or Czech with the rest of the page. */
(() => {
  'use strict';
  const TEXT = {
    sk: {
      more: 'Viac info', title: 'Čo ešte dostanete', cta: 'Chcem to na svoj web', close: 'Zavrieť',
      items: [
        ['Prvý mesiac zdarma', 'Vyskúšate ho naostro na vlastnom webe.'],
        ['Preklik priamo na produkt', 'Po odporúčaní zákazník pokračuje rovno na konkrétny produkt vo vašom e-shope.'],
        ['Vloženie jedným riadkom kódu', 'Pridá sa do existujúceho webu, nič netreba prerábať.'],
        ['Funguje aj mimo pracovného času', 'Zákazník dostane odpoveď a pomoc s výberom aj večer či cez víkend.'],
        ['História správ', 'Vidíte, na čo sa zákazníci pýtajú, a zistíte, čo im na stránke chýba alebo čomu nerozumejú.'],
        ['Priebežné úpravy', 'Sortiment, ceny aj odpovede sa dajú kedykoľvek aktualizovať.'],
        ['Ďalšie funkcie podľa vašej firmy', 'Neskôr sa dá doplniť napríklad košík, formulár, rezervácia, zber kontaktov alebo iný typ výberu.']
      ]
    },
    cs: {
      more: 'Více info', title: 'Co ještě dostanete', cta: 'Chci to na svůj web', close: 'Zavřít',
      items: [
        ['První měsíc zdarma', 'Vyzkoušíte ho naostro na vlastním webu.'],
        ['Proklik přímo na produkt', 'Po doporučení zákazník pokračuje rovnou na konkrétní produkt ve vašem e-shopu.'],
        ['Vložení jedním řádkem kódu', 'Přidá se do stávajícího webu, nic není třeba předělávat.'],
        ['Funguje i mimo pracovní dobu', 'Zákazník dostane odpověď a pomoc s výběrem i večer nebo o víkendu.'],
        ['Historie zpráv', 'Vidíte, na co se zákazníci ptají, a zjistíte, co jim na stránce chybí nebo čemu nerozumějí.'],
        ['Průběžné úpravy', 'Sortiment, ceny i odpovědi lze kdykoli aktualizovat.'],
        ['Další funkce podle vaší firmy', 'Později lze doplnit například košík, formulář, rezervaci, sběr kontaktů nebo jiný typ výběru.']
      ]
    }
  };
  const lang = () => (document.documentElement.lang === 'cs' || window.CX_LANG === 'cs' ? 'cs' : 'sk');
  const esc = (v) => String(v).replace(/[&<>"']/g, (c) => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));

  const style = document.createElement('style');
  style.textContent = [
    '.cx-info-link{display:inline-flex;align-items:center;gap:6px;margin-top:14px;padding:0;border:0;background:none;font:inherit;font-size:13px;font-weight:700;color:inherit;text-decoration:underline;text-underline-offset:3px;cursor:pointer;}',
    '.cx-info-link:focus{outline:none;}',
    '.cx-info-sheet{position:fixed;inset:0;z-index:2147483000;display:grid;place-items:center;padding:16px;background:rgba(20,20,20,.72);}',
    '.cx-info-sheet[hidden]{display:none;}',
    '.cx-info-card{position:relative;width:min(640px,100%);max-height:calc(100dvh - 32px);overflow:auto;box-sizing:border-box;padding:28px 30px 26px;border-radius:24px;background:#fff;color:#1c1a19;font-family:inherit;}',
    '.cx-info-card small{display:block;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#77706a;font-weight:700;}',
    '.cx-info-card h2{margin:6px 0 16px;font-size:22px;line-height:1.2;color:#1c1a19;}',
    '.cx-info-card ul{list-style:none;margin:0 0 20px;padding:0;display:grid;gap:12px;}',
    '.cx-info-card li{display:grid;grid-template-columns:18px 1fr;gap:12px;align-items:start;}',
    '.cx-info-card li i{width:14px;height:14px;margin-top:3px;border-radius:50%;border:4px solid #1c1a19;box-sizing:border-box;}',
    '.cx-info-card li b{display:block;font-size:15px;color:#1c1a19;}',
    '.cx-info-card li span{display:block;margin-top:2px;font-size:13.5px;line-height:1.4;color:#55504a;}',
    '.cx-info-cta{display:flex;align-items:center;justify-content:center;min-height:48px;border-radius:999px;background:#1c1a19;color:#fff;font-weight:700;text-decoration:none;}',
    '.cx-info-close{position:absolute;top:14px;right:14px;width:36px;height:36px;border:0;border-radius:50%;background:#efefef;color:#1c1a19;font-size:20px;line-height:1;cursor:pointer;}',
    '.cx-info-close:focus{outline:none;}'
  ].join('');
  document.head.append(style);

  const sheet = document.createElement('div');
  sheet.className = 'cx-info-sheet';
  sheet.hidden = true;
  sheet.setAttribute('role', 'dialog');
  sheet.setAttribute('aria-modal', 'true');
  let opener = null;
  const close = () => { sheet.hidden = true; opener?.focus(); };
  function open(from) {
    const t = TEXT[lang()];
    const contact = document.querySelector('.cx-owner-contact')?.getAttribute('href') || 'https://mojchatbot.sk/kontakt';
    sheet.innerHTML = '<div class="cx-info-card"><button type="button" class="cx-info-close" aria-label="' + esc(t.close) + '">×</button>'
      + '<small>' + esc(t.more) + '</small><h2>' + esc(t.title) + '</h2><ul>'
      + t.items.map(([title, note]) => '<li><i></i><div><b>' + esc(title) + '</b><span>' + esc(note) + '</span></div></li>').join('')
      + '</ul><a class="cx-info-cta" href="' + esc(contact) + '" target="_blank" rel="noreferrer">' + esc(t.cta) + ' →</a></div>';
    opener = from;
    sheet.hidden = false;
    sheet.querySelector('.cx-info-close').focus();
  }
  sheet.addEventListener('click', (event) => { if (event.target === sheet || event.target.closest('.cx-info-close')) close(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !sheet.hidden) close(); });

  function mount() {
    const actions = document.querySelector('.cx-owner-actions');
    if (!actions) return false;
    if (document.querySelector('.cx-owner-more,.cx-info-link')) return true;
    const link = document.createElement('button');
    link.type = 'button';
    link.className = 'cx-info-link';
    link.setAttribute('aria-haspopup', 'dialog');
    const label = () => { link.textContent = TEXT[lang()].more + ' →'; };
    label();
    link.addEventListener('click', () => open(link));
    actions.after(link);
    document.body.append(sheet);
    new MutationObserver(label).observe(document.documentElement, {attributes: true, attributeFilter: ['lang']});
    return true;
  }
  if (!mount()) {
    const watch = new MutationObserver(() => { if (mount()) watch.disconnect(); });
    watch.observe(document.documentElement, {childList: true, subtree: true});
  }
})();
