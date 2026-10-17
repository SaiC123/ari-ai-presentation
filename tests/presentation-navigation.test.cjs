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
  const selectors = Object.fromEntries([
    '#presentation-slides-wrapper', '#counter', '#progress', '#notes',
    '#noteText', '#prev', '#next', '#fullscreen', '#notesToggle', '#fullscreenStatus',
  ].map(selector => [selector, element(['#prev', '#next', '#fullscreen', '#notesToggle'].includes(selector) ? 'button' : 'div')]));
  selectors['#presentation-slides-wrapper'].querySelectorAll = () => slides;
  const location = { hash };
  const documentListeners = {};
  const windowListeners = {};
  const document = {
    querySelector: selector => selectors[selector],
    addEventListener: (name, callback) => { documentListeners[name] = callback; },
    fullscreenElement: null,
    exitFullscreen() { if (options.exitFullscreen) return options.exitFullscreen(this); this.fullscreenElement = null; return Promise.resolve(); },
  };
  document.documentElement = options.fullscreenUnsupported ? {} : { requestFullscreen: () => {
    if (options.requestFullscreen) return options.requestFullscreen(document);
    document.fullscreenElement = document.documentElement;
    return Promise.resolve();
  } };
  const window = {
    innerWidth: 1280, innerHeight: 720,
    addEventListener: (name, callback) => { windowListeners[name] = callback; },
  };
  const context = vm.createContext({
    document, window, location,
    history: { replaceState: (_state, _title, url) => { location.hash = url; } },
  });
  vm.runInContext(scripts[0][1], context, { filename: 'presentation-inline.js' });
  return {
    slides, selectors, location, document,
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
