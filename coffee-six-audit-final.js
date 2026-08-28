(() => {
  'use strict';

  const slug = () => document.body.dataset.coffeeFinal || String(window.COFFEE_DEMO_SLUG || '').replace('-v13', '');
  const setI = (node, prop, value) => node?.style?.setProperty(prop, value, 'important');

  function tabletFloat(node, height) {
    if (!node || window.innerWidth < 481 || window.innerWidth > 640) return;
    setI(node, 'top', 'auto');
    setI(node, 'left', 'auto');
    setI(node, 'right', '8px');
    setI(node, 'bottom', '8px');
    setI(node, 'width', 'calc(100vw - 16px)');
    setI(node, 'max-width', 'none');
    setI(node, 'height', `min(${height}px, calc(100dvh - 16px))`);
    setI(node, 'max-height', `${height}px`);
    setI(node, 'border-radius', '28px');
  }

  function praziarnicka() {
    if (slug() !== 'praziarnicka') return;
    tabletFloat(document.querySelector('#pz13-widget'), 646);
    const messages = document.querySelector('.pz13-chat__messages');
    if (messages) setI(messages, 'padding-top', '14px');
    const entry = document.querySelector('#pz13-advisor-entry');
    if (entry) {
      setI(entry, 'margin', '0 0 4px');
      setI(entry, 'transform', 'none');
    }
  }

  function kaffa() {
    if (slug() !== 'kaffa') return;
    tabletFloat(document.querySelector('.kf-panel'), 646);
    const entry = document.querySelector('.kf-advisor-entry');
    if (entry) {
      setI(entry, 'width', 'calc(100% - 8px)');
      setI(entry, 'margin', '4px');
      setI(entry, 'align-self', 'center');
    }
    const composer = document.querySelector('.kf-composer');
    if (composer) {
      setI(composer, 'box-sizing', 'border-box');
      setI(composer, 'width', '100%');
      setI(composer, 'max-width', '100%');
    }
  }

  function ensureConceptLauncher() {
    let launcher = document.querySelector('#openWidget.launcher__button');
    if (!launcher) {
      let shell = document.querySelector('#launcher');
      if (!shell) {
        shell = document.createElement('div');
        shell.id = 'launcher';
        shell.className = 'launcher six-concept-launcher-shell';
        document.body.appendChild(shell);
      }
      launcher = document.createElement('button');
      launcher.id = 'openWidget';
      launcher.className = 'launcher__button six-concept-launcher-fallback';
      launcher.type = 'button';
      launcher.setAttribute('aria-label', 'Otvoriť kávového poradcu');
      launcher.setAttribute('aria-expanded', 'false');
      shell.appendChild(launcher);
    }

    launcher.querySelectorAll('.cfr-concept-monogram,.cfr-concept-launcher-crop,.launcher__chat-mark').forEach((node) => node.remove());
    let mark = launcher.querySelector('.six-concept-logo');
    if (!mark) {
      mark = document.createElement('span');
      mark.className = 'six-concept-logo';
      mark.setAttribute('aria-hidden', 'true');
      const img = document.createElement('img');
      img.src = '/brand/concept-official-logo.png';
      img.alt = '';
      mark.appendChild(img);
      launcher.prepend(mark);
    }
    if (launcher.dataset.sixConceptOpen !== 'true') {
      launcher.dataset.sixConceptOpen = 'true';
      launcher.addEventListener('click', () => {
        if (typeof window.ConceptSeasonalApp?.openWidget === 'function') {
          window.ConceptSeasonalApp.openWidget({ focus: true });
        } else {
          const widget = document.querySelector('#widget.widget');
          if (widget) {
            widget.classList.add('is-open');
            widget.setAttribute('aria-hidden', 'false');
          }
        }
        launcher.setAttribute('aria-expanded', 'true');
      });
    }
    return launcher;
  }

  function concept() {
    if (slug() !== 'concept') return;
    tabletFloat(document.querySelector('#widget.widget'), 660);
    ensureConceptLauncher();

    let teaser = document.querySelector('#launcherTeaser');
    const shell = document.querySelector('#launcher');
    if (!teaser && shell) {
      teaser = document.createElement('aside');
      teaser.id = 'launcherTeaser';
      teaser.className = 'launcher-teaser six-concept-teaser';
      teaser.innerHTML = '<button class="launcher-teaser__open" id="openFromTeaser" type="button"><b>Nájdite svoju kávu</b><span>4 otázky · jedno odporúčanie</span></button>';
      shell.prepend(teaser);
      teaser.querySelector('#openFromTeaser')?.addEventListener('click', () => ensureConceptLauncher().click());
    }
    if (teaser) {
      const title = teaser.querySelector('b');
      const copy = teaser.querySelector('.launcher-teaser__open span');
      if (title) title.textContent = 'Nájdite svoju kávu';
      if (copy) copy.textContent = '4 otázky · jedno odporúčanie';
    }

    const headerLogo = document.querySelector('.concept-widget-logo');
    if (headerLogo) {
      headerLogo.src = '/brand/concept-official-logo.png';
      headerLogo.alt = 'Concept Coffee Roasters';
      setI(headerLogo, 'object-fit', 'contain');
    }
  }

  function vitazov() {
    if (slug() !== 'vitazov') return;
    tabletFloat(document.querySelector('#widget.widget'), 680);

    const header = document.querySelector('.widget__header');
    if (header) {
      setI(header, 'background', '#0d493d');
      setI(header, 'color', '#fff');
      setI(header, 'border-bottom-color', '#0a3b32');
    }
    const logo = document.querySelector('.widget-brand img.cfr-vitazov-header-logo,.widget-brand img.kv-widget-logo');
    if (logo) {
      logo.src = '/assets/vitazov-logo.svg';
      setI(logo, 'width', '128px');
      setI(logo, 'height', '50px');
      setI(logo, 'max-width', '128px');
      setI(logo, 'max-height', '50px');
      setI(logo, 'object-fit', 'contain');
      setI(logo, 'filter', 'brightness(0) invert(1)');
    }
    document.querySelectorAll('.widget-actions .icon-button').forEach((button) => {
      setI(button, 'color', '#fff');
      setI(button, 'background', 'rgba(255,255,255,.08)');
      setI(button, 'border-color', 'rgba(255,255,255,.28)');
    });
    const mode = document.querySelector('.mode');
    if (mode) {
      setI(mode, 'height', '60px');
      setI(mode, 'min-height', '60px');
    }
    const entry = document.querySelector('#openAdvisor');
    if (entry) {
      setI(entry, 'height', '70px');
      setI(entry, 'min-height', '70px');
      const media = entry.firstElementChild;
      if (media) {
        setI(media, 'width', '68px');
        setI(media, 'height', '60px');
      }
    }
    const bottom = document.querySelector('#chatScreen .chat-bottom');
    if (bottom) {
      setI(bottom, 'width', '100%');
      setI(bottom, 'box-sizing', 'border-box');
    }
  }

  function diamonds() {
    if (slug() !== 'diamonds') return;
    document.querySelectorAll('#advisorContent .answer-card').forEach((card) => {
      setI(card, 'grid-template-columns', '1fr');
      setI(card, 'opacity', '1');
    });
    document.querySelectorAll('#advisorContent .answer-photo').forEach((photo) => {
      setI(photo, 'width', '100%');
      setI(photo, 'min-width', '0');
      setI(photo, 'min-height', '104px');
    });
    document.querySelectorAll('#advisorContent .answer-copy,#advisorContent .answer-copy b,#advisorContent .answer-copy small').forEach((node) => setI(node, 'opacity', '1'));
  }

  function jolka() {
    if (slug() !== 'jolka') return;
    const screen = document.querySelector('#chatScreen');
    const entry = document.querySelector('#entry');
    const chat = document.querySelector('#chat');
    const composerArea = screen?.querySelector('.composer-area');
    if (screen && entry && chat && composerArea) {
      if (screen.firstElementChild !== entry) screen.insertBefore(entry, screen.firstElementChild);
      if (entry.nextElementSibling !== chat) screen.insertBefore(chat, entry.nextElementSibling);
      if (screen.lastElementChild !== composerArea) screen.appendChild(composerArea);
    }
    const firstBot = chat?.querySelector('.msg:not(.msg--user) .bubble');
    if (firstBot) {
      setI(firstBot, 'display', 'block');
      setI(firstBot, 'visibility', 'visible');
      setI(firstBot, 'opacity', '1');
      setI(firstBot, 'color', '#211a16');
      setI(firstBot, 'background', '#faf2e7');
      setI(firstBot, 'border-color', '#decfb9');
    }
    const back = document.querySelector('#back');
    if (back) {
      setI(back, 'opacity', '1');
      setI(back, 'color', '#2b221c');
      setI(back, 'background', '#fffdfa');
      setI(back, 'border-color', '#c7b397');
    }
  }

  function settle() {
    praziarnicka();
    kaffa();
    concept();
    vitazov();
    diamonds();
    jolka();
  }

  document.addEventListener('click', () => {
    requestAnimationFrame(() => requestAnimationFrame(settle));
    setTimeout(settle, 80);
    setTimeout(settle, 260);
  }, true);
  window.addEventListener('resize', settle, { passive: true });
  new MutationObserver(() => requestAnimationFrame(settle)).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class','aria-hidden'] });

  settle();
  setTimeout(() => {
    settle();
    document.documentElement.dataset.coffeeSixAuditReady = 'true';
  }, 460);
})();