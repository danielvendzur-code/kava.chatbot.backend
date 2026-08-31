(() => {
  'use strict';

  const body = document.body;
  if (!body) return;

  function repairVictoryHeader() {
    if (body.dataset.coffeeFinal !== 'vitazov') return false;
    const brand = document.querySelector('.widget-brand');
    const logo = brand?.querySelector('img[src*="vitazov-logo"]');
    if (!brand || !logo) return false;

    let mark = logo.closest('.widget-brand__mark');
    if (!mark) {
      mark = document.createElement('span');
      mark.className = 'widget-brand__mark';
      logo.replaceWith(mark);
      mark.appendChild(logo);
    }
    logo.classList.add('kv-widget-logo');
    brand.dataset.lastMileVictoryBrand = 'true';
    return true;
  }

  // The header is produced by the preceding final-tune runtime. A bounded retry
  // covers slower devices without introducing another permanent DOM observer.
  let attempts = 0;
  const run = () => {
    attempts += 1;
    if (!repairVictoryHeader() && attempts < 45) requestAnimationFrame(run);
  };
  run();
})();
