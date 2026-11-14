(function () {
  'use strict';
  const panel = document.getElementById('cs-consent');
  if (!panel) return;
  const details = document.getElementById('cs-consent-details');
  const check = document.getElementById('cs-consent-stats');
  const settings = document.getElementById('cs-consent-settings');
  window.CaliforniaConsent = {hasStatistics: function () {return panel.dataset.choice === 'yes';}};
  // Basic consent mode: no Google library or request before explicit statistics consent.
  check.checked = panel.dataset.choice === 'yes';
  function open() {panel.hidden = false; details.hidden = false; settings.setAttribute('aria-expanded','true'); settings.focus();}
  document.addEventListener('click', function (event) {
    if (event.target.closest('[data-cs-consent-open]')) {event.preventDefault();open();}
  });
  settings.addEventListener('click', function () {details.hidden = !details.hidden;settings.setAttribute('aria-expanded',String(!details.hidden));});
  panel.querySelectorAll('[data-cs-save]').forEach(function (button) {
    button.addEventListener('click', async function () {
      const choice = button.dataset.csSave === 'custom' ? (check.checked ? '1':'0') : button.dataset.csSave;
      const buttons = panel.querySelectorAll('button');
      buttons.forEach(function (b) {b.disabled = true;});
      try {
        const response = await fetch(panel.dataset.url, {method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({token:panel.dataset.token,statistics:choice})});
        const result = await response.json();
        if (!response.ok || !result.ok) throw new Error('Consent not saved');
        // Full reload stops any already-running analytics after withdrawal.
        if (choice === '0') {
          document.cookie.split(';').forEach(function (part) {
            const name = part.split('=')[0].trim();
            if (/^(_ga|_gid|_gat)(_|$)/.test(name)) {
              [location.hostname,'.'+location.hostname].forEach(function (domain) {document.cookie=name+'=; Max-Age=0; path=/; domain='+domain+'; Secure; SameSite=Lax';});
              document.cookie=name+'=; Max-Age=0; path=/; Secure; SameSite=Lax';
            }
          });
        }
        location.reload();
      } catch (error) {document.getElementById('cs-consent-error').hidden=false;buttons.forEach(function (b) {b.disabled=false;});}
    });
  });
})();
