(() => {
  'use strict';

  const slug = () => document.body.dataset.coffeeFinal || String(window.COFFEE_DEMO_SLUG || '').replace('-v13', '');
  const setI = (node, prop, value) => node?.style?.setProperty(prop, value, 'important');

  function tabletFloat(node, height) {
    if (!node || window.innerWidth < 481 || window.innerWidth > 640) return;
    setI(node, 'top', 'auto'); setI(node, 'left', 'auto'); setI(node, 'right', '8px'); setI(node, 'bottom', '8px');
    setI(node, 'width', 'calc(100vw - 16px)'); setI(node, 'max-width', 'none');
    setI(node, 'height', `min(${height}px, calc(100dvh - 16px))`); setI(node, 'max-height', `${height}px`); setI(node, 'border-radius', '28px');
  }

  function praziarnicka() {
    if (slug() !== 'praziarnicka') return;
    tabletFloat(document.querySelector('#pz13-widget'), 642);
    const entry = document.querySelector('#pz13-advisor-entry');
    if (entry) {
      setI(entry, 'position', 'relative'); setI(entry, 'top', '5px'); setI(entry, 'margin-top', '7px'); setI(entry, 'margin-bottom', '9px'); setI(entry, 'transform', 'none');
    }
  }

  function kaffa() {
    if (slug() !== 'kaffa') return;
    tabletFloat(document.querySelector('.kf-panel'), 642);
    const entry = document.querySelector('.kf-advisor-entry');
    if (entry) { setI(entry, 'width', 'calc(100% - 16px)'); setI(entry, 'margin', '6px 8px 4px'); setI(entry, 'align-self', 'center'); }
    const footer = document.querySelector('.kf-chat-footer');
    if (footer) { setI(footer, 'padding-left', '14px'); setI(footer, 'padding-right', '14px'); setI(footer, 'box-sizing', 'border-box'); }
    const composer = document.querySelector('.kf-composer');
    if (composer) { setI(composer, 'box-sizing', 'border-box'); setI(composer, 'width', '100%'); setI(composer, 'max-width', '100%'); setI(composer, 'margin', '0'); }
    document.querySelectorAll('.kf-option__visual').forEach((visual) => {
      const imgs = [...visual.querySelectorAll(':scope > img')];
      if (imgs.length > 1) {
        const keep = imgs.find((img) => img.classList.contains('cfr-option-photo')) || imgs.find((img) => img.classList.contains('cfp-option-photo')) || imgs.at(-1);
        imgs.forEach((img) => { if (img !== keep) img.remove(); });
      }
      const img = visual.querySelector(':scope > img');
      if (img) { setI(img, 'display', 'block'); setI(img, 'width', '100%'); setI(img, 'height', '100%'); setI(img, 'object-fit', 'cover'); }
    });
  }

  function concept() {
    if (slug() !== 'concept') return;
    tabletFloat(document.querySelector('#widget.widget'), 654);
    const mode = document.querySelector('#modeSwitch.mode,.mode');
    if (mode) { setI(mode, 'height', '60px'); setI(mode, 'min-height', '60px'); setI(mode, 'flex-basis', '60px'); }
    document.querySelectorAll('.mode__button').forEach((button) => setI(button, 'min-height', '50px'));
    const launcher = document.querySelector('#openWidget.launcher__button');
    if (launcher && !launcher.querySelector('.cfr-concept-launcher-crop,.six-concept-logo')) {
      const mark = document.createElement('span'); mark.className = 'six-concept-logo'; mark.setAttribute('aria-hidden', 'true');
      const img = document.createElement('img'); img.src = '/brand/concept-official-logo.png'; img.alt = ''; mark.appendChild(img); launcher.replaceChildren(mark);
    }
    const teaser = document.querySelector('#launcherTeaser');
    if (teaser) {
      const title = teaser.querySelector('.launcher-teaser__open b'); const copy = teaser.querySelector('.launcher-teaser__open span');
      if (title) title.textContent = 'Nájdite svoju kávu'; if (copy) copy.textContent = '4 otázky · jedno odporúčanie';
    }
    const headerLogo = document.querySelector('.concept-widget-logo');
    if (headerLogo) { headerLogo.src = '/brand/concept-official-logo.png'; headerLogo.alt = 'Concept Coffee Roasters'; setI(headerLogo, 'object-fit', 'contain'); }
  }

  function lockRenderedWidth(node, pixels) {
    if (!node || !Number.isFinite(pixels) || pixels < 1) return;
    setI(node, 'box-sizing', 'border-box');
    setI(node, 'transform', 'none'); setI(node, 'scale', '1'); setI(node, 'zoom', '1'); setI(node, 'transition', 'none'); setI(node, 'animation', 'none');
    setI(node, 'justify-self', 'stretch'); setI(node, 'align-self', 'stretch');

    let declared = Math.round(pixels);
    for (let i = 0; i < 3; i += 1) {
      const width = `${Math.max(1, declared)}px`;
      setI(node, 'width', width); setI(node, 'min-width', width); setI(node, 'max-width', width);
      const actual = node.getBoundingClientRect().width;
      if (!Number.isFinite(actual) || Math.abs(actual - pixels) <= .5) break;
      declared += pixels - actual;
    }
  }

  function vitazov() {
    if (slug() !== 'vitazov') return;
    const panel = document.querySelector('#widget.widget');
    tabletFloat(panel, 672);
    const header = document.querySelector('.widget__header');
    if (header) { setI(header, 'background', '#0d493d'); setI(header, 'color', '#fff'); setI(header, 'border-bottom-color', '#0a3b32'); }
    const logo = document.querySelector('.widget-brand img[src*="vitazov-logo"]');
    if (logo) {
      logo.classList.add('six-vitazov-header-logo'); setI(logo, 'display', 'block'); setI(logo, 'width', '128px'); setI(logo, 'height', '50px');
      setI(logo, 'max-width', '128px'); setI(logo, 'max-height', '50px'); setI(logo, 'object-fit', 'contain'); setI(logo, 'filter', 'brightness(0) invert(1)');
    }
    document.querySelectorAll('.widget-actions .icon-button').forEach((button) => { setI(button, 'color', '#fff'); setI(button, 'background', 'rgba(255,255,255,.08)'); setI(button, 'border-color', 'rgba(255,255,255,.28)'); });
    const mode = document.querySelector('.mode'); if (mode) { setI(mode, 'height', '60px'); setI(mode, 'min-height', '60px'); }
    const screen = document.querySelector('#chatScreen');
    if (screen) {
      setI(screen, 'width', '100%'); setI(screen, 'min-width', '100%'); setI(screen, 'max-width', 'none'); setI(screen, 'align-self', 'stretch'); setI(screen, 'box-sizing', 'border-box');
      setI(screen, 'transform', 'none'); setI(screen, 'scale', '1'); setI(screen, 'transition', 'none'); setI(screen, 'animation', 'none');
    }

    const panelWidth = panel?.getBoundingClientRect().width || 0;
    const targetWidth = Math.max(0, panelWidth - 26);
    const entry = document.querySelector('#openAdvisor');
    if (entry) {
      lockRenderedWidth(entry, targetWidth);
      setI(entry, 'height', '70px'); setI(entry, 'min-height', '70px'); setI(entry, 'margin-left', '13px'); setI(entry, 'margin-right', '13px');
      setI(entry, 'flex', '0 0 auto'); setI(entry, 'position', 'relative'); setI(entry, 'left', '0'); setI(entry, 'right', 'auto');
    }
    const form = document.querySelector('#chatForm');
    if (form) {
      lockRenderedWidth(form, targetWidth);
      setI(form, 'height', '54px'); setI(form, 'min-height', '54px'); setI(form, 'margin-left', '13px'); setI(form, 'margin-right', '13px');
      const panelBox = panel?.getBoundingClientRect();
      const formBox = form.getBoundingClientRect();
      if (panelBox && formBox) {
        const rightInset = panelBox.right - formBox.right;
        if (rightInset < 10) lockRenderedWidth(form, Math.max(1, targetWidth - (10 - rightInset)));
      }
    }
    document.querySelectorAll('#chatMessages .message__avatar img[src*="vitazov-logo"]').forEach((img) => img.classList.add('six-vitazov-avatar'));
  }

  function jolka() {
    if (slug() !== 'jolka') return;
    const back = document.querySelector('#back');
    if (back) { setI(back, 'opacity', '1'); setI(back, 'color', '#2b221c'); setI(back, '-webkit-text-fill-color', '#2b221c'); setI(back, 'background', '#fffdfa'); setI(back, 'border-color', '#c7b397'); }
  }

  function settle() { praziarnicka(); kaffa(); concept(); vitazov(); jolka(); }
  document.addEventListener('click', () => { requestAnimationFrame(settle); setTimeout(settle, 60); setTimeout(settle, 180); setTimeout(settle, 420); }, true);
  window.addEventListener('resize', settle, { passive: true });
  settle(); setTimeout(settle, 120); setTimeout(settle, 360); setTimeout(settle, 720);
  setTimeout(() => { settle(); document.documentElement.dataset.coffeeSixAuditReady = 'true'; }, 960);
})();