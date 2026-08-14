(() => {
  'use strict';
  const app = window.ConceptSeasonalApp;
  const { $, $$, escapeHTML, icons, questions } = app;
  const { advisor } = app.refs;

  function updateProgress() {
    const inResult = app.state.stage !== 'questions';
    $('#stepLabel').textContent = inResult ? 'Výsledok' : `${app.state.step + 1} z ${questions.length}`;
    $('#stepName').textContent = inResult ? 'Odporúčanie' : questions[app.state.step].name;
    $('#prevBtn').disabled = app.state.stage === 'questions' && app.state.step === 0;
    $('#progress').innerHTML = questions.map((_, index) => `<i class="${index < app.state.step || inResult ? 'is-done ' : ''}${index === app.state.step && !inResult ? 'is-active' : ''}"></i>`).join('');
  }

  function renderQuestion() {
    const question = questions[app.state.step];
    const selected = app.state.answers[question.key];
    advisor.innerHTML = `
      <div class="question"><span class="question__kicker">${escapeHTML(question.name)}</span><h2>${escapeHTML(question.title)}</h2></div>
      <div class="options options--${question.options.length}">
        ${question.options.map((option, index) => {
          const visual = option.photo
            ? `<span class="option__photo"><img src="${escapeHTML(option.photo)}" width="1200" height="760" alt=""></span>`
            : `<span class="option__icon">${icons[option.icon] || icons.compass}</span>`;
          const classNames = [selected === option.value ? 'is-selected' : '', selected && selected !== option.value ? 'is-muted' : ''].filter(Boolean).join(' ');
          return `<button class="option ${classNames}" type="button" data-value="${escapeHTML(option.value)}" style="animation-delay:${index * 55}ms" aria-pressed="${selected === option.value}">${visual}<span class="option__copy"><b>${escapeHTML(option.label)}</b><small>${escapeHTML(option.description)}</small></span><span class="option__state">${selected === option.value ? icons.check : ''}</span></button>`;
        }).join('')}
      </div>`;
    $$('.option', advisor).forEach((button) => button.addEventListener('click', () => selectAnswer(button.dataset.value)));
  }

  function selectAnswer(value) {
    if (app.state.stage !== 'questions' || app.state.transitioning) return;
    const question = questions[app.state.step];
    app.state.transitioning = true;
    app.state.answers[question.key] = value;
    app.state.selectedProduct = null;
    app.persist();
    app.emit('advisor_answer', { step: question.key, value });
    $$('.option', advisor).forEach((button) => {
      const selected = button.dataset.value === value;
      button.classList.toggle('is-selected', selected);
      button.classList.toggle('is-muted', !selected);
      button.setAttribute('aria-pressed', String(selected));
      button.disabled = true;
      button.querySelector('.option__state').innerHTML = selected ? icons.check : '';
    });
    const delay = matchMedia('(prefers-reduced-motion: reduce)').matches ? 10 : 300;
    setTimeout(advanceQuestion, delay);
  }

  function advanceQuestion() {
    const question = questions[app.state.step];
    if (!app.state.answers[question.key]) {
      app.state.transitioning = false;
      return;
    }
    if (app.state.step < questions.length - 1) app.state.step += 1;
    else app.state.stage = 'result';
    app.state.selectedProduct = null;
    app.state.transitioning = false;
    app.persist();
    app.renderAdvisor();
    if (app.state.stage === 'result') app.animateMarks('is-mark-result');
  }

  Object.assign(app, { updateProgress, renderQuestion, selectAnswer, advanceQuestion });
})();
