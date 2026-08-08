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
      <div class="question"><span class="question__kicker">${escapeHTML(question.name)}</span><h2>${escapeHTML(question.title)}</h2><p>${escapeHTML(question.note)}</p></div>
      <div class="options options--${question.options.length}">
        ${question.options.map((option, index) => {
          const visual = option.photo
            ? `<span class="option__photo"><img src="${escapeHTML(option.photo)}" width="1200" height="760" alt=""></span>`
            : `<span class="option__icon">${icons[option.icon] || icons.compass}</span>`;
          const classNames = [selected === option.value ? 'is-selected' : '', selected && selected !== option.value ? 'is-muted' : ''].filter(Boolean).join(' ');
          return `<button class="option ${classNames}" type="button" data-value="${escapeHTML(option.value)}" style="animation-delay:${index * 70}ms" aria-pressed="${selected === option.value}">${visual}<span class="option__copy"><b>${escapeHTML(option.label)}</b><small>${escapeHTML(option.description)}</small></span><span class="option__state">${selected === option.value ? icons.check : ''}</span></button>`;
        }).join('')}
      </div>
      <button class="question-continue ${selected ? 'is-ready' : ''}" id="continueQuestion" type="button" ${selected ? '' : 'disabled'}><span>${app.state.step === questions.length - 1 ? 'Zobraziť odporúčanie' : 'Pokračovať'}</span>${icons.arrow}</button>`;
    $$('.option', advisor).forEach((button) => button.addEventListener('click', () => selectAnswer(button.dataset.value)));
    $('#continueQuestion').addEventListener('click', advanceQuestion);
  }

  function selectAnswer(value) {
    if (app.state.stage !== 'questions') return;
    const question = questions[app.state.step];
    app.state.answers[question.key] = value;
    app.state.selectedProduct = null;
    app.persist();
    app.emit('advisor_answer', { step: question.key, value });
    renderQuestion();
    requestAnimationFrame(() => $('#continueQuestion')?.focus({ preventScroll: true }));
  }

  function advanceQuestion() {
    const question = questions[app.state.step];
    if (!app.state.answers[question.key]) return;
    if (app.state.step < questions.length - 1) app.state.step += 1;
    else app.state.stage = 'result';
    app.state.selectedProduct = null;
    app.persist();
    app.renderAdvisor();
    if (app.state.stage === 'result') app.animateMarks('is-mark-result');
  }

  Object.assign(app, { updateProgress, renderQuestion, selectAnswer, advanceQuestion });
})();
