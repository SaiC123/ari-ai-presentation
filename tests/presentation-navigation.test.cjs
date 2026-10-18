const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const vm = require('node:vm');

// Exercise the actual inline presentation script with a small DOM fixture.
// Browser QA separately covers the real slide layouts, charts, and animations.
const htmlPath = process.env.PRESENTATION_HTML || join(__dirname, '../public/index.html');
const html = readFileSync(htmlPath, 'utf8');
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
assert.equal(scripts.length, 1, 'Expected one inline presentation script');

function element(tag = 'div', ancestors = []) {
  const classes = new Set();
  const attributes = new Map();
  return {
    dataset: {}, style: {}, textContent: '', listeners: {}, inert: false, disabled: false,
    focusCalls: 0, focus() { this.focusCalls++; },
    classList: {
      contains: name => classes.has(name),
      toggle(name, force = !classes.has(name)) {
        if (force) classes.add(name); else classes.delete(name);
        return force;
      },
    },
    setAttribute: (name, value) => attributes.set(name, String(value)),
    getAttribute: name => attributes.get(name) ?? null,
    addEventListener(name, callback) { this.listeners[name] = callback; },
    closest(selector) { return selector.split(',').some(part => [tag, ...ancestors].includes(part.trim())) ? this : null; },
    click() { if (!this.disabled) return this.listeners.click?.({ stopPropagation() {} }); },
    querySelector: () => null,
    querySelectorAll: () => [],
  };
}

function presentation(hash = '#1', options = {}) {
  const slides = (options.counts || [0, 2, 1]).map((count, i) => {
    const slide = element();
    slide.dataset.note = `Speaker note ${i + 1}`;
    const builds = Array.from({ length: count }, (_, j) => {
      const build = element();
      build.dataset.build = String(j + 1);
      return build;
    });
    slide.buildElements = builds;
    slide.panels = Array.from({ length: count }, () => element());
    slide.recap = i === 2 ? element() : null;
    slide.querySelector = selector => selector === '.recap-stage' ? slide.recap : null;
    slide.querySelectorAll = selector => selector === '[data-build]' ? builds
      : selector === '.node-copy, .finance-scene' ? slide.panels : [];
    return slide;
  });
  if (options.finance) slides[1].classList.toggle('finance-slide', true);
  const selectors = Object.fromEntries([
    '#presentation-slides-wrapper', '#counter', '#progress', '#notes',
    '#noteText', '#prev', '#next', '#fullscreen', '#notesToggle', '#fullscreenStatus',
    '#forecastIntake', '#forecastConversion', '#forecastChurn', '#forecastView',
    '#forecastThreshold', '#forecastFunding', '#forecastMonthly', '#forecastRecovery',
    '#forecastMonthDetail', '#forecastMonthTitle', '#forecastMonthCue', '#forecastMonthEvent', '#forecastMonthCash', '#forecastMonthDelta', '#forecastConverted', '#forecastAccessible', '#economicsChart', '#forecastChartFallback', '#formationChart',
  ].map(selector => [selector, element(['#prev', '#next', '#fullscreen', '#notesToggle'].includes(selector) ? 'button' : 'div')]));
  selectors['#presentation-slides-wrapper'].querySelectorAll = () => slides;
  for (const [id, value] of Object.entries({ '#forecastIntake':'2', '#forecastConversion':'0.182',
    '#forecastChurn':'0.02', '#forecastView':'monthly' })) selectors[id].value = value;
  const location = { hash };
  const documentListeners = {};
  const windowListeners = {};
  const document = {
    querySelector: selector => selector === '.finance-slide' ? slides.find(s => s.classList.contains('finance-slide')) : selectors[selector],
    addEventListener: (name, callback) => { documentListeners[name] = callback; },
    fullscreenElement: null,
    fonts: { ready: Promise.resolve() },
    exitFullscreen() { if (options.exitFullscreen) return options.exitFullscreen(this); this.fullscreenElement = null; return Promise.resolve(); },
  };
  document.documentElement = options.fullscreenUnsupported ? {} : { requestFullscreen: () => {
    if (options.requestFullscreen) return options.requestFullscreen(document);
    document.fullscreenElement = document.documentElement;
    return Promise.resolve();
  } };
  const timers = new Map();
  let nextTimer = 0;
  const window = {
    innerWidth: 1280, innerHeight: 720,
    addEventListener: (name, callback) => { windowListeners[name] = callback; },
    matchMedia: () => ({ matches: Boolean(options.reducedMotion) }),
    setTimeout(callback) { const id = ++nextTimer; timers.set(id, callback); return id; },
    clearTimeout(id) { timers.delete(id); },
  };
  function FixtureChart(_canvas, configuration) {
    this.data = configuration.data;
    this.options = configuration.options;
    this.reset = () => {};
    this.update = () => {};
  }
  FixtureChart.defaults = { font:{} };
  if (options.forecast) window.AriPilotForecast = require('../public/pilot-forecast.js');
  if (options.chart) window.Chart = FixtureChart;
  const context = vm.createContext({
    document, window, location, Chart:FixtureChart,
    history: { replaceState: (_state, _title, url) => { location.hash = url; } },
  });
  vm.runInContext(scripts[0][1], context, { filename: 'presentation-inline.js' });
  return {
    slides, selectors, location, document,
    chart: () => window.economicsChart,
    pendingTimers: () => timers.size,
    tick() { const next = timers.entries().next().value; if (next) { timers.delete(next[0]); next[1](); } },
    change(id, value) { selectors[id].value = value; selectors[id].listeners.change(); },
    resize(width, height) { window.innerWidth = width; window.innerHeight = height; windowListeners.resize(); },
    dispatch(name) { return documentListeners[name]?.(); },
    tap(clientX, options = {}) { documentListeners.click({ clientX, target: element(), ...options }); },
    active: () => slides.findIndex(slide => slide.classList.contains('active')),
    hashChange(hash) { location.hash = hash; windowListeners.hashchange(); },
    key(key, options = {}) {
      let prevented = false;
      const target = options.target || element();
      documentListeners.keydown({ key, target, ...options, preventDefault() { prevented = true; } });
      // Browser button activation follows keydown unless the page prevents it.
      if (!prevented && !options.defaultPrevented && !options.ctrlKey && !options.metaKey && !options.altKey
          && ['Enter', ' '].includes(key) && target.closest('button')) target.closest('button').click();
      return prevented;
    },
    click(id) { return selectors[id].click(); },
    show: index => vm.runInContext(`show(${index})`, context),
    build: (slide, step) => vm.runInContext(`setBuild(slides[${slide}], ${step})`, context),
    fullscreen: () => document.fullscreenElement !== null,
  };
}

test('valid deep links select the requested slide', () => {
  for (const [hash, index] of [['#1', 0], ['#2', 1], ['#3', 2]]) {
    const deck = presentation(hash);
    assert.equal(deck.active(), index);
    assert.equal(deck.selectors['#counter'].textContent, `0${index + 1} / 03`);
  }
});

test('malformed initial hashes recover to the first slide without throwing', () => {
  for (const hash of ['', '#1.5', '#2.0001', '#0', '#4', '#-1', '#Infinity', '#NaN']) {
    const deck = presentation(hash);
    assert.equal(deck.active(), 0, hash);
    assert.equal(deck.location.hash, '#1', hash);
  }
});

test('invalid hash changes preserve the current slide and repair the URL', () => {
  const deck = presentation('#2');
  deck.key('ArrowRight');
  for (const hash of ['#1.5', '#0', '#99', '#bad']) {
    deck.hashChange(hash);
    assert.equal(deck.active(), 1, hash);
    assert.equal(deck.slides[1].dataset.buildCurrent, '1', hash);
    assert.equal(deck.location.hash, '#2', hash);
  }
  deck.hashChange('#3');
  assert.equal(deck.active(), 2);
});

test('fractional show arguments cannot clear the active slide', () => {
  const deck = presentation('#2');
  deck.show('0.5');
  assert.equal(deck.active(), 1);
  assert.equal(deck.location.hash, '#2');
});

test('only the active slide is exposed to assistive technology and focus', () => {
  const deck = presentation();
  for (const hash of ['#1', '#2', '#3', '#1']) {
    deck.hashChange(hash);
    deck.slides.forEach((slide, i) => {
      const inactive = i !== deck.active();
      assert.equal(slide.getAttribute('aria-hidden'), String(inactive));
      assert.equal(slide.inert, inactive);
    });
  }
});

test('buttons and keyboard retain build, boundary, notes, and rewind behavior', () => {
  const deck = presentation('#2');
  deck.click('#next');
  assert.equal(deck.slides[1].dataset.buildCurrent, '1');
  deck.key(' ');
  assert.equal(deck.slides[1].dataset.buildCurrent, '2');
  deck.key('Enter');
  assert.equal(deck.active(), 2);
  deck.key('ArrowLeft');
  assert.equal(deck.active(), 1);
  assert.equal(deck.slides[1].dataset.buildCurrent, '2');
  deck.click('#prev');
  assert.equal(deck.slides[1].dataset.buildCurrent, '1');
  deck.key('n');
  assert.equal(deck.selectors['#notes'].classList.contains('show'), true);
  assert.equal(deck.selectors['#noteText'].textContent, 'Speaker note 2');
  deck.key('Home');
  deck.click('#prev');
  assert.equal(deck.active(), 0);
  deck.key('End');
  deck.key('PageDown');
  deck.click('#next');
  assert.equal(deck.active(), 2);
  deck.key('PageUp');
  assert.equal(deck.slides[2].dataset.buildCurrent, '0');
});

test('Enter and Space activate the focused button instead of advancing globally', () => {
  const deck = presentation('#2');
  deck.click('#next');
  deck.key('Enter', { target: deck.selectors['#prev'] });
  assert.equal(deck.slides[1].dataset.buildCurrent, '0');
  deck.key(' ', { target: deck.selectors['#next'] });
  assert.equal(deck.slides[1].dataset.buildCurrent, '1');
  deck.key(' ', { target: deck.selectors['#prev'] });
  assert.equal(deck.slides[1].dataset.buildCurrent, '0');
  deck.key('Enter', { target: deck.selectors['#fullscreen'] });
  assert.equal(deck.fullscreen(), true);
  assert.equal(deck.slides[1].dataset.buildCurrent, '0');
});

test('browser modifier shortcuts do not trigger presentation shortcuts', () => {
  const deck = presentation('#2');
  deck.key('ArrowRight', { altKey: true });
  deck.key('f', { ctrlKey: true });
  deck.key('n', { metaKey: true });
  assert.equal(deck.slides[1].dataset.buildCurrent, '0');
  assert.equal(deck.fullscreen(), false);
  assert.equal(deck.selectors['#notes'].classList.contains('show'), false);
});

test('unrevealed builds remain inert until shown and become inert on rewind', () => {
  const deck = presentation('#2');
  const builds = deck.slides[1].buildElements;
  assert.deepEqual(builds.map(build => build.inert), [true, true]);
  deck.click('#next');
  assert.deepEqual(builds.map(build => build.inert), [false, true]);
  deck.click('#prev');
  assert.deepEqual(builds.map(build => build.inert), [true, true]);
});

test('only the current explanation or finance scene is accessible', () => {
  const deck = presentation('#2');
  const panels = deck.slides[1].panels;
  assert.deepEqual(panels.map(panel => panel.inert), [true, true]);
  deck.click('#next');
  assert.deepEqual(panels.map(panel => panel.inert), [false, true]);
  deck.click('#next');
  assert.deepEqual(panels.map(panel => panel.inert), [true, false]);
  deck.click('#prev');
  assert.deepEqual(panels.map(panel => panel.inert), [false, true]);
});

test('the recap becomes inert when the final brand frame replaces it', () => {
  const deck = presentation('#3');
  assert.equal(deck.slides[2].recap.inert, false);
  deck.click('#next');
  assert.equal(deck.slides[2].recap.inert, true);
  deck.click('#prev');
  assert.equal(deck.slides[2].recap.inert, false);
});

test("typing in form fields does not advance the deck", () => {
  for (const tag of ['input', 'textarea', 'select']) {
    const deck = presentation('#2');
    assert.equal(deck.key(' ', { target: element(tag) }), false);
    assert.equal(deck.slides[1].dataset.buildCurrent, '0');
  }
});

test("IME composition does not navigate", () => {
  const deck = presentation('#2');
  deck.key('Enter', { isComposing: true });
  deck.key(' ', { keyCode: 229 });
  assert.equal(deck.slides[1].dataset.buildCurrent, '0');
});

test("holding toggle shortcuts does not repeatedly flip their state", () => {
  const deck = presentation('#2');
  deck.key('n', { repeat: true });
  deck.key('f', { repeat: true });
  assert.equal(deck.selectors['#notes'].classList.contains('show'), false);
  assert.equal(deck.fullscreen(), false);
});

test("interactive clicks retain their own action without advancing", () => {
  for (const tag of ['a', 'button', 'input', 'textarea', 'select']) {
    const deck = presentation('#2');
    deck.tap(1000, { target: element('span', [tag]) });
    assert.equal(deck.slides[1].dataset.buildCurrent, '0', tag);
  }
});

test("notes retain slide context when navigating while open", () => {
  const deck = presentation();
  deck.key('n');
  deck.key('ArrowRight');
  assert.equal(deck.selectors['#notes'].classList.contains('show'), true);
  assert.equal(deck.selectors['#noteText'].textContent, 'Speaker note 2');
});

test("notes button exposes and focuses notes with synchronized expanded state", () => {
  const deck = presentation();
  deck.click('#notesToggle');
  assert.equal(deck.selectors['#notesToggle'].getAttribute('aria-expanded'), 'true');
  assert.equal(deck.selectors['#notesToggle'].getAttribute('aria-label'), 'Hide speaker notes');
  assert.equal(deck.selectors['#notes'].focusCalls, 1);
  deck.click('#notesToggle');
  assert.equal(deck.selectors['#notesToggle'].getAttribute('aria-expanded'), 'false');
});

test("Escape closes notes and returns focus to their toggle", () => {
  const deck = presentation('#2');
  deck.click('#notesToggle');
  assert.equal(deck.key('Escape'), true);
  assert.equal(deck.selectors['#notes'].classList.contains('show'), false);
  assert.equal(deck.selectors['#notesToggle'].focusCalls, 1);
  assert.equal(deck.slides[1].dataset.buildCurrent, '0');
});

test("notes scrolling keys do not change the active build", () => {
  const deck = presentation('#2');
  deck.click('#notesToggle');
  for (const key of [' ', 'PageDown', 'PageUp', 'Home', 'End', 'ArrowRight', 'ArrowLeft']) {
    assert.equal(deck.key(key, { target: element('span', ['.notes']) }), false);
    assert.equal(deck.active(), 1);
    assert.equal(deck.slides[1].dataset.buildCurrent, '0');
  }
});

test("unsupported fullscreen disables its control without breaking navigation", () => {
  const deck = presentation('#2', { fullscreenUnsupported: true });
  assert.equal(deck.selectors['#fullscreen'].disabled, true);
  deck.key('f');
  deck.key('ArrowRight');
  assert.equal(deck.slides[1].dataset.buildCurrent, '1');
});

test("denied fullscreen resolves safely and reports an accessible status", async () => {
  const deck = presentation('#2', { requestFullscreen: () => Promise.reject(new Error('Denied')) });
  await deck.click('#fullscreen');
  assert.match(deck.selectors['#fullscreenStatus'].textContent, /Fullscreen is unavailable/);
  assert.equal(deck.active(), 1);
  assert.equal(deck.slides[1].dataset.buildCurrent, '0');
});

test("fullscreen state follows native entry and browser Escape exit", async () => {
  const deck = presentation();
  assert.equal(deck.selectors['#fullscreen'].getAttribute('aria-pressed'), 'false');
  await deck.click('#fullscreen');
  deck.dispatch('fullscreenchange');
  assert.equal(deck.selectors['#fullscreen'].getAttribute('aria-label'), 'Exit fullscreen');
  deck.document.fullscreenElement = null;
  deck.dispatch('fullscreenchange');
  assert.equal(deck.selectors['#fullscreen'].getAttribute('aria-pressed'), 'false');
  assert.equal(deck.selectors['#fullscreen'].getAttribute('aria-label'), 'Enter fullscreen');
});

test("rapid fullscreen activation waits for the pending browser request", async () => {
  let requests = 0;
  let resolve;
  const deck = presentation('#1', { requestFullscreen: () => { requests++; return new Promise(done => { resolve = done; }); } });
  const pending = deck.click('#fullscreen');
  await deck.click('#fullscreen');
  assert.equal(requests, 1);
  resolve();
  await pending;
  const retry = deck.click('#fullscreen');
  assert.equal(requests, 2);
  resolve();
  await retry;
});

test("Home and End prevent document scrolling while jumping slides", () => {
  const deck = presentation('#2');
  assert.equal(deck.key('End'), true);
  assert.equal(deck.active(), 2);
  assert.equal(deck.key('Home'), true);
  assert.equal(deck.active(), 0);
});

test("Enter on a link or disclosure retains native activation", () => {
  for (const tag of ['a', 'summary', '[role="button"]']) {
    const deck = presentation('#2');
    assert.equal(deck.key('Enter', { target: element('span', [tag]) }), false);
    assert.equal(deck.slides[1].dataset.buildCurrent, '0');
  }
});

test("the notes shortcut restores focus when closing the panel", () => {
  const deck = presentation();
  deck.key('n');
  deck.key('n', { target: element('aside', ['.notes']) });
  assert.equal(deck.selectors['#notesToggle'].focusCalls, 1);
  assert.equal(deck.selectors['#notesToggle'].getAttribute('aria-expanded'), 'false');
});

test("Clicking the forward area reveals a build before changing slides", () => { const d = presentation('#2'); d.tap(1000); assert.equal(d.active(), 1); assert.equal(d.slides[1].dataset.buildCurrent, '1'); });

test("Clicking the left area rewinds one build at a time", () => { const d = presentation('#2'); d.key('ArrowRight'); d.key('ArrowRight'); d.tap(100); assert.equal(d.active(), 1); assert.equal(d.slides[1].dataset.buildCurrent, '1'); });

test("The forward click region begins at 32 percent of the viewport", () => { const d = presentation('#2'); d.tap(1280 * .32); assert.equal(d.slides[1].dataset.buildCurrent, '1'); d.tap(1280 * .32 - 1); assert.equal(d.slides[1].dataset.buildCurrent, '0'); });

test("Clicks inside notes cannot advance or rewind the deck", () => { const d = presentation('#2'); d.key('ArrowRight'); for (const x of [100, 1000]) d.tap(x, { target: element('span', ['.notes']) }); assert.equal(d.slides[1].dataset.buildCurrent, '1'); });

test("Control container clicks do not perform a second navigation action", () => { const d = presentation('#2'); d.tap(1000, { target: element('span', ['.controls']) }); assert.equal(d.slides[1].dataset.buildCurrent, '0'); });

test("A prevented click does not change the current build", () => { const d = presentation('#2'); d.tap(1000, { defaultPrevented: true }); assert.equal(d.slides[1].dataset.buildCurrent, '0'); });

test("Clicks inside editable content remain available for caret placement", () => { const d = presentation('#2'); const target = element(); target.isContentEditable = true; d.tap(1000, { target }); assert.equal(d.slides[1].dataset.buildCurrent, '0'); });

test("Home returns to the first slide with its initial build", () => { const d = presentation('#2', { counts: [2, 2, 1] }); d.key('Home'); assert.equal(d.active(), 0); assert.equal(d.slides[0].dataset.buildCurrent, '0'); assert.equal(d.location.hash, '#1'); });

test("End enters the final slide before its staged content", () => { const d = presentation(); d.key('End'); assert.equal(d.active(), 2); assert.equal(d.slides[2].dataset.buildCurrent, '0'); assert.equal(d.slides[2].recap.inert, false); });

test("Rewinding from a slide start restores the preceding final build", () => { const d = presentation('#3'); d.click('#prev'); assert.equal(d.active(), 1); assert.equal(d.slides[1].dataset.buildCurrent, '2'); assert.deepEqual(d.slides[1].buildElements.map(e => e.inert), [false, false]); });

test("Forward re-entry resets a previously visited slide to its first build", () => { const d = presentation('#2'); d.key('ArrowRight'); d.key('ArrowRight'); d.key('Home'); d.key('ArrowRight'); assert.equal(d.active(), 1); assert.equal(d.slides[1].dataset.buildCurrent, '0'); assert.deepEqual(d.slides[1].buildElements.map(e => e.inert), [true, true]); });

test("A hash event for the active slide preserves its build", () => { const d = presentation('#2'); d.click('#next'); d.hashChange('#2'); assert.equal(d.slides[1].dataset.buildCurrent, '1'); assert.equal(d.slides[1].panels[0].inert, false); });

test("A backwards deep link restores the destination final build", () => { const d = presentation('#3'); d.hashChange('#2'); assert.equal(d.active(), 1); assert.equal(d.slides[1].dataset.buildCurrent, '2'); assert.equal(d.selectors['#noteText'].textContent, 'Speaker note 2'); });

test("Build changes keep slide numbering stable", () => { const d = presentation('#2'); const counter = d.selectors['#counter'].textContent; d.click('#next'); d.click('#next'); assert.equal(d.selectors['#counter'].textContent, counter); assert.equal(d.location.hash, '#2'); });

test("The progress bar starts at the first slide fraction", () => { const d = presentation(); assert.ok(Math.abs(parseFloat(d.selectors['#progress'].style.width) - 100 / 3) < 1e-10); });

test("Progress reaches 100 percent and rewinds with the slide index", () => { const d = presentation(); d.key('End'); assert.equal(d.selectors['#progress'].style.width, '100%'); d.hashChange('#2'); assert.ok(Math.abs(parseFloat(d.selectors['#progress'].style.width) - 200 / 3) < 1e-10); });

test("Wide viewports fit the presentation to their height", () => { const d = presentation(); d.resize(2560, 720); assert.equal(d.selectors['#presentation-slides-wrapper'].style.transform, 'translate(-50%, -50%) scale(1)'); assert.equal(d.active(), 0); });

test("Portrait viewports fit the full deck width without changing state", () => { const d = presentation('#2'); d.click('#next'); d.resize(390, 844); assert.equal(d.selectors['#presentation-slides-wrapper'].style.transform, 'translate(-50%, -50%) scale(0.3046875)'); assert.equal(d.slides[1].dataset.buildCurrent, '1'); });

test("Short landscape viewports fit the entire deck height", () => { const d = presentation('#2'); d.resize(844, 390); const scale = Number(d.selectors['#presentation-slides-wrapper'].style.transform.match(/scale\(([^)]+)/)[1]); assert.equal(scale, 390 / 720); assert.equal(d.location.hash, '#2'); });

test("Nonfinite slide requests cannot clear the active slide", () => { const d = presentation('#2'); for (const value of ['NaN', 'Infinity', '-Infinity', 'undefined']) { d.show(value); assert.equal(d.active(), 1); assert.equal(d.selectors['#counter'].textContent, '02 / 03'); } });

test("Out-of-range integer requests clamp to real slide boundaries", () => { const d = presentation('#2'); d.show('-99'); assert.equal(d.active(), 0); d.show('99'); assert.equal(d.active(), 2); assert.equal(d.slides.filter(s => s.classList.contains('active')).length, 1); });

test("Build requests clamp to the first and last reveal states", () => { const d = presentation('#2'); d.build(1, 99); assert.equal(d.slides[1].dataset.buildCurrent, '2'); assert.deepEqual(d.slides[1].panels.map(e => e.inert), [true, false]); d.build(1, -99); assert.equal(d.slides[1].dataset.buildCurrent, '0'); assert.deepEqual(d.slides[1].panels.map(e => e.inert), [true, true]); });

test("Every forward shortcut advances exactly one build", () => { for (const key of ['ArrowRight', 'PageDown', ' ', 'Enter']) { const d = presentation('#2'); assert.equal(d.key(key), true); assert.equal(d.slides[1].dataset.buildCurrent, '1', key); assert.equal(d.active(), 1); } });

test("Every rewind shortcut removes exactly one build", () => { for (const key of ['ArrowLeft', 'PageUp', 'Backspace']) { const d = presentation('#2'); d.build(1, 2); assert.equal(d.key(key), true); assert.equal(d.slides[1].dataset.buildCurrent, '1', key); assert.equal(d.active(), 1); } });

test("Unassigned keys leave navigation and browser defaults alone", () => { const d = presentation('#2'); for (const key of ['Tab', 'ArrowUp', 'ArrowDown', 'x', 'Escape']) assert.equal(d.key(key), false); assert.equal(d.slides[1].dataset.buildCurrent, '0'); assert.equal(d.selectors['#notes'].classList.contains('show'), false); });

test("Prevented keyboard events are not handled twice", () => { const d = presentation('#2'); d.key('ArrowRight', { defaultPrevented: true }); d.key('n', { defaultPrevented: true }); assert.equal(d.slides[1].dataset.buildCurrent, '0'); assert.equal(d.selectors['#notes'].classList.contains('show'), false); });

test("Contenteditable descendants retain all presentation shortcut keys", () => { const d = presentation('#2'); const target = element(); target.isContentEditable = true; for (const key of [' ', 'Enter', 'Backspace', 'Home', 'End', 'n', 'f']) assert.equal(d.key(key, { target }), false); assert.equal(d.slides[1].dataset.buildCurrent, '0'); assert.equal(d.fullscreen(), false); });

test("Custom textbox descendants retain text entry keys", () => { const d = presentation('#2'); const target = element('span', ['[role="textbox"]']); d.key('Enter', { target }); d.key('n', { target }); assert.equal(d.slides[1].dataset.buildCurrent, '0'); assert.equal(d.selectors['#notes'].classList.contains('show'), false); });

test("Fullscreen exit rejection keeps controls usable", async () => { const d = presentation('#2', { exitFullscreen: () => Promise.reject(new Error('Denied exit')) }); await d.click('#fullscreen'); await d.click('#fullscreen'); assert.match(d.selectors['#fullscreenStatus'].textContent, /unavailable/); assert.equal(d.selectors['#fullscreen'].getAttribute('aria-pressed'), 'true'); d.click('#next'); assert.equal(d.slides[1].dataset.buildCurrent, '1'); });

test("A successful retry clears an earlier fullscreen failure message", async () => { let attempts = 0; const d = presentation('#1', { requestFullscreen: doc => { if (++attempts === 1) throw new Error('Unavailable'); doc.fullscreenElement = doc.documentElement; return Promise.resolve(); } }); await d.click('#fullscreen'); assert.match(d.selectors['#fullscreenStatus'].textContent, /unavailable/); await d.click('#fullscreen'); assert.equal(d.selectors['#fullscreenStatus'].textContent, ''); assert.equal(d.selectors['#fullscreen'].getAttribute('aria-pressed'), 'true'); });

test("Uppercase N shares the notes button expanded state", () => { const d = presentation(); d.key('N'); assert.equal(d.selectors['#notesToggle'].getAttribute('aria-expanded'), 'true'); d.key('N'); assert.equal(d.selectors['#notesToggle'].getAttribute('aria-expanded'), 'false'); assert.equal(d.selectors['#notesToggle'].getAttribute('aria-label'), 'Show speaker notes'); });

test("Advancing beyond the final frame preserves its hidden recap and final build", () => { const d = presentation('#3'); d.click('#next'); d.click('#next'); d.key('PageDown'); assert.equal(d.active(), 2); assert.equal(d.slides[2].dataset.buildCurrent, '1'); assert.equal(d.slides[2].recap.inert, true); assert.equal(d.selectors['#counter'].textContent, '03 / 03'); assert.equal(d.location.hash, '#3'); });

test("every slide and build remains navigable forward and backward", () => {
  const counts = [5, 0, 6, 1, 0, 1, 0, 8, 5, 2, 1, 4, 3, 3, 5, 6, 8];
  const d = presentation('#1', { counts });
  for (let slide = 0; slide < counts.length; slide++) {
    for (let build = 0; build <= counts[slide]; build++) {
      assert.equal(d.active(), slide);
      assert.equal(d.slides[slide].dataset.buildCurrent, String(build));
      assert.equal(d.slides.filter(s => !s.inert).length, 1);
      d.click('#next');
    }
  }
  for (let slide = counts.length - 1; slide >= 0; slide--) {
    for (let build = counts[slide]; build >= 0; build--) {
      assert.equal(d.active(), slide);
      assert.equal(d.slides[slide].dataset.buildCurrent, String(build));
      assert.equal(d.slides[slide].getAttribute('aria-hidden'), 'false');
      d.click('#prev');
    }
  }
  assert.equal(d.location.hash, '#1');
});

test('the live chart configuration includes free-pilot cash costs and zero first-month revenue', () => {
  const deck = presentation('#2', { forecast:true, chart:true });
  const chart = deck.chart();
  assert.equal(chart.data.labels.length, 12);
  assert.equal(chart.data.datasets[0].data[0], 0);
  assert.equal(chart.data.datasets[1].data[0], 705);
  assert.equal(deck.selectors['#forecastFunding'].textContent, '$5,244.57');
  assert.match(deck.selectors['#forecastConverted'].textContent, /0.91 expected payers/);
  assert.match(deck.selectors['#forecastAccessible'].textContent, /Month 1: 5 free, 0.00 expected paid/);
});

test('forecast presentation is one fixed base case with no selectable assumptions', () => {
  assert.doesNotMatch(html, /<select[^>]*id="forecast(?:Intake|Conversion|Churn|View)"/);
  const d = presentation('#2', { forecast:true, chart:true });
  assert.equal(d.chart().data.datasets[0].label, 'Monthly revenue');
  assert.equal(d.chart().data.datasets[0].data.filter(v => v !== null).length, 12);
  assert.equal(d.chart().data.datasets[1].data[0], 705);
  assert.equal(d.selectors['#forecastMonthly'].textContent, 'Monthly coverage: not in Year 1');
  assert.match(d.selectors['#forecastAccessible'].textContent, /2 new paying.*18.2%.*2%/);
});

test('monthly tooltip includes every cash cost and no fee on free pilots', () => {
  const d = presentation('#2', { forecast:true, chart:true });
  const tooltip = d.chart().options.plugins.tooltip.callbacks;
  const lines = tooltip.afterBody([{ dataIndex:0 }]);
  assert.ok(lines.includes('Shared team tools: $500.00'));
  assert.ok(lines.includes('Product API: $95.00'));
  assert.ok(lines.includes('Payments (paid only): $0.00'));
  assert.ok(lines.includes('Monthly net: -$705.00'));
  assert.match(tooltip.title([{ dataIndex:0 }]), /5 free \/ 0.00 expected paid/);
});

test('full accessible forecast remains when Chart.js is unavailable', () => {
  const d = presentation('#2', { forecast:true });
  assert.equal(d.selectors['#economicsChart'].hidden, true);
  assert.equal(d.selectors['#forecastChartFallback'].hidden, false);
  assert.match(d.selectors['#forecastAccessible'].textContent, /Year 1 funding needed \$5,244.57/);
});

test('the full year is visible immediately and months progress without clicks', () => {
  const d = presentation('#2', { counts:[0,4,1], forecast:true, chart:true, finance:true });
  d.build(1,3);
  for (let month=1; month<=12; month++) {
    assert.equal(d.selectors['#forecastMonthTitle'].textContent, `Month ${month} / 12`);
    assert.equal(d.chart().data.datasets[0].data.filter(v => v !== null).length, 12);
    assert.equal(d.slides[1].dataset.buildCurrent, '3');
    if (month < 12) d.tick();
  }
  assert.equal(d.pendingTimers(), 0, 'holds at the final month');
});

test('next goes directly to budget and rewind restarts full-graph progression', () => {
  const d = presentation('#2', { counts:[0,4,1], forecast:true, chart:true, finance:true });
  d.build(1,3); d.tick();
  assert.equal(d.selectors['#forecastMonthTitle'].textContent,'Month 2 / 12');
  d.click('#next');
  assert.equal(d.slides[1].dataset.buildCurrent,'4');
  assert.equal(d.pendingTimers(),0);
  d.click('#prev');
  assert.equal(d.slides[1].dataset.buildCurrent,'3');
  assert.equal(d.selectors['#forecastMonthTitle'].textContent,'Month 1 / 12');
  assert.equal(d.chart().data.datasets[0].data.length,12);
  d.click('#prev');
  assert.equal(d.slides[1].dataset.buildCurrent,'2');
  assert.equal(d.pendingTimers(),0);
});

test('month callouts distinguish free service, conversion, acquisition and payments', () => {
  const d = presentation('#2', { counts:[0,4,1], forecast:true, chart:true, finance:true });
  d.build(1,3);
  assert.match(d.selectors['#forecastMonthEvent'].textContent,/5 free pilots/);
  assert.match(d.selectors['#forecastMonthCash'].textContent,/Cost \$705.00/);
  d.tick();
  assert.match(d.selectors['#forecastMonthEvent'].textContent,/18.2%.*0.91 payers.*2 new paid/);
  assert.match(d.selectors['#forecastMonthCash'].textContent,/Revenue \$145.47.*Cost \$624.40/);
  d.tick();
  assert.match(d.selectors['#forecastMonthEvent'].textContent,/\+2 new paid.*\+0.00 conversions.*−0.06 churn/);
});

test('leaving the finance slide cancels progression and re-entry has no duplicate timers', () => {
  const d = presentation('#2', { counts:[0,4,1], forecast:true, chart:true, finance:true });
  d.build(1,3); assert.equal(d.pendingTimers(),1);
  d.build(1,3); assert.equal(d.pendingTimers(),1);
  d.show(0); assert.equal(d.pendingTimers(),0);
  d.show(1); d.build(1,3); assert.equal(d.pendingTimers(),1);
  assert.equal(d.selectors['#forecastMonthTitle'].textContent,'Month 1 / 12');
});

test('reduced motion keeps the complete forecast static without timed announcements', () => {
  const d = presentation('#2', { counts:[0,4,1], forecast:true, chart:true, finance:true, reducedMotion:true });
  d.build(1,3);
  assert.equal(d.pendingTimers(),0);
  assert.equal(d.chart().data.datasets[0].data.filter(v=>v!==null).length,12);
  assert.match(html,/id="forecastMonthDetail" aria-live="off"/);
});

test('automatic narration works without Chart.js', () => {
  const d = presentation('#2', { counts:[0,4,1], forecast:true, finance:true });
  d.build(1,3); d.tick();
  assert.equal(d.selectors['#forecastMonthTitle'].textContent,'Month 2 / 12');
  assert.equal(d.selectors['#forecastChartFallback'].hidden,false);
  assert.match(d.selectors['#forecastMonthCash'].textContent,/Revenue \$145.47/);
});
