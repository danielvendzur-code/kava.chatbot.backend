(() => {
  const slug = document.body.dataset.cosmeticsDemo;
  const config = window.S3_REG?.demos?.[slug]?.catalogueShowcase;
  const catalogue = window.CX_CATALOGUES?.[slug];
  const root = document.getElementById('cosmetics-root');
  const actions = root?.querySelector('.cx-owner-actions');
  const chat = actions?.querySelector('[data-open="chat"]');
  const hero = root?.querySelector('.cx-owner-hero');
  if (!config || !catalogue || !chat || !hero) return;

  function element(tag, text, className) {
    const node = document.createElement(tag);
    if (text) node.textContent = text;
    if (className) node.className = className;
    return node;
  }

  const teaser = element('section', '', 's5-ask');
  teaser.append(element('h2', 'Zeptejte se poradce'));
  const choices = element('div', '', 's5-ask-choices');
  for (const question of config.questions) {
    const button = element('button', question);
    button.type = 'button';
    button.addEventListener('click', () => {
      chat.click();
      const input = root.querySelector('#cx-input');
      if (!input?.form) return;
      input.value = question;
      input.form.requestSubmit();
    });
    choices.append(button);
  }
  teaser.append(choices);
  actions.after(teaser);

  const products = [...catalogue.products, ...(catalogue.showcaseExtras || [])];
  const shelf = element('details', '', 's5-catalogue');
  shelf.append(element('summary', 'Prohlédnout produkty (' + products.length + ')'));
  const list = element('ul', '', 's5-catalogue-list');
  for (const product of products) {
    const item = element('li');
    const link = element('a');
    link.href = product.url;
    link.target = '_blank';
    link.rel = 'noreferrer';
    const image = element('img');
    image.src = product.photo;
    image.alt = '';
    image.loading = 'lazy';
    image.decoding = 'async';
    const copy = element('div', '', 's5-catalogue-copy');
    copy.append(element('strong', product.name));
    copy.append(element('span', [product.volume, product.price].filter(Boolean).join(' · ')));
    if (product.available === false) copy.append(element('small', 'Momentálně vyprodáno'));
    link.append(image, copy);
    item.append(link);
    list.append(item);
  }
  shelf.append(list);
  hero.after(shelf);
})();
