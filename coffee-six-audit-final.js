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
    tabletFloat(document.querySelector('#pz13-widget'), 642);
    const entry = document.querySelector('#pz13-advisor-entry');
    if (entry) {
      setI(entry, 'margin-top', '7px');
      setI(entry, 'margin-bottom', '4px');
      setI(entry, 'transform', 'none');
    }
  }

  function kaffa() {
    if (slug() !== 'kaffa') return;
    tabletFloat(document.querySelector('.kf-panel'), 642);
    const entry = document.querySelector('.kf-advisor-entry');
    if (entry) {
      setI(entry, 'width', 'calc(100% - 16px)');
      setI(entry, 'margin', '6px 8px 4px');
      setI(entry, 'align-self', 'center');
    }
    const footer = document.querySelector('.kf-chat-footer');
    if (footer) {
      setI(footer, 'padding-left', '14px');
      setI(footer, 'padding-right', '14px');
      setI(footer, 'box-sizing', 'border-box');
    }
    const composer = document.querySelector('.kf-composer');
    if (composer) {
      setI(composer, 'box-sizing', 'border-box');
      setI(composer, 'width', '100%');
      setI(composer, 'max-width', '100%');
      setI(composer, 'margin', '0');
    }
    document.querySelectorAll('.kf-option__visual').forEach((visual) => {
      const imgs = [...visual.querySelectorAll(':scope > img')];
      if (imgs.length > 1) {
        const keep = imgs.find((img) => img.classList.contains('cfp-option-photo')) || imgs.at(-1);
        imgs.forEach((img) => { if (img !== keep) img.remove(); });
      }
      const img = visual.querySelector(':scope > img');
      if (img) {
        setI(img, 'display', 'block');
        setI(img, 'width', '100%');
        setI(img, 'height', '100%');
        setI(img, 'object-fit', 'cover');
      }
    });
  }

  function concept() {
    if (slug() !== 'concept') return;
    tabletFloat(document.querySelector('#widget.widget'), 654);

    const launcher = document.querySelector('#openWidget.launcher__button');
    if (launcher && launcher.dataset.sixConceptLogo !== 'true') {
      const mark = document.createElement('span');
      mark.className = 'six-concept-logo';
      mark.setAttribute('aria-hidden', 'true');
      const img = document.createElement('img');
      img.src = '/brand/concept-official-logo.png';
      img.alt = '';
      mark.appendChild(img);
      launcher.replaceChildren(mark);
      launcher.dataset.sixConceptLogo = 'true';
    }

    const teaser = document.querySelector('#launcherTeaser');
    if (teaser) {
      const title = teaser.querySelector('.launcher-teaser__open b');
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
    tabletFloat(document.querySelector('#widget.widget'), 672);

    const header = document.querySelector('.widget__header');
    if (header) {
      setI(header, 'background', '#0d493d');
      setI(header, 'color', '#fff');
      setI(header, 'border-bottom-color', '#0a3b32');
    }
    const logo = document.querySelector('.widget-brand img[src*="vitazov-logo"]');
    if (logo) {
      logo.classList.add('six-vitazov-header-logo');
      setI(logo, 'display', 'block');
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
    const screen = document.querySelector('#chatScreen');
    if (screen) {
      setI(screen, 'width', '100%');
      setI(screen, 'max-width', 'none');
      setI(screen, 'align-self', 'stretch');
      setI(screen, 'box-sizing', 'border-box');
    }
    const entry = document.querySelector('#openAdvisor');
    if (entry) {
      setI(entry, 'height', '70px');
      setI(entry, 'min-height', '70px');
    }
    const form = document.querySelector('#chatForm');
    if (form) {
      setI(form, 'height', '54px');
      setI(form, 'min-height', '54px');
      setI(form, 'box-sizing', 'border-box');
    }
    document.querySelectorAll('#chatMessages .message__avatar img[src*="vitazov-logo"]').forEach((img) => img.classList.add('six-vitazov-avatar'));
  }

  function jolka() {
    if (slug() !== 'jolka') return;
    const back = document.querySelector('#back');
    if (back) {
      setI(back, 'opacity', '1');
      setI(back, 'color', '#2b221c');
      setI(back, '-webkit-text-fill-color', '#2b221c');
      setI(back, 'background', '#fffdfa');
      setI(back, 'border-color', '#c7b397');
    }
  }

  function settle() {
    praziarnicka();
    kaffa();
    concept();
    vitazov();
    jolka();
    // Diamonds already passed its independent audit; leave it untouched.
  }

  // No MutationObserver. The previous global observer was replacing Concept
  // and Victory nodes while users/tests were clicking them.
  document.addEventListener('click', () => {
    requestAnimationFrame(settle);
    setTimeout(settle, 90);
    setTimeout(settle, 420);
  }, true);
  window.addEventListener('resize', settle, { passive: true });

  settle();
  setTimeout(settle, 140);
  setTimeout(settle, 520);
  setTimeout(() => {
    settle();
    document.documentElement.dataset.coffeeSixAuditReady = 'true';
  }, 900);
})();