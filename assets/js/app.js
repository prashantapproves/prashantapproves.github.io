/* ==========================================================================
   prashantapproves.com — app
   Tiny hash router + renderer. No build step, no dependencies.
   You should never need to edit this file. Content lives in data.js.
   ========================================================================== */

(function () {
  'use strict';

  const main = document.getElementById('main');
  const yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ------------------------------------------------------------ helpers */

  const esc = s => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  const isTodo = s => typeof s === 'string' && /^\s*TODO:/i.test(s);

  // Renders text, but flags anything still marked TODO so it can't sneak live.
  const t = s => isTodo(s)
    ? '<span class="todo">' + esc(String(s).replace(/^\s*TODO:\s*/i, '')) + '</span>'
    : esc(s);

  const VERDICT = {
    yes:   { label: 'Worth it', cls: 'yes' },
    mixed: { label: 'Mixed',    cls: 'mixed' },
    no:    { label: 'Skip',     cls: 'no' }
  };

  const stamp = (v, extra) => {
    const d = VERDICT[v] || VERDICT.mixed;
    return '<span class="stamp stamp--' + d.cls + ' ' + (extra || '') + '">' + d.label + '</span>';
  };

  const tier = n => {
    n = Math.max(0, Math.min(3, Number(n) || 0));
    return '<span class="tier" aria-label="' + n + ' out of 3 on price">'
      + '£'.repeat(n)
      + '<span class="tier__off">' + '£'.repeat(3 - n) + '</span></span>';
  };

  const TYPE_LABEL = { stay: 'Stay', eat: 'Eat', do: 'Do' };

  const cityHasDrafts = c =>
    JSON.stringify(c).match(/TODO:/i) !== null;

  const paisley = extra =>
    '<div class="paisley-div ' + (extra || '') + '" aria-hidden="true">'
    + '<img src="assets/img/paisley.svg" alt=""></div>';

  /* --------------------------------------------------------------- home */

  function renderHome() {
    const live = CITIES.filter(c => c.status === 'live');
    const soon = CITIES.filter(c => c.status !== 'live');

    const card = c => {
      const soonCard = c.status !== 'live';
      const href = soonCard ? '' : ' href="#/' + esc(c.slug) + '"';
      const tag = soonCard ? 'div' : 'a';
      return '<li><' + tag + ' class="city' + (soonCard ? ' city--soon' : '') + '"' + href + '>'
        + '<h3 class="city__name">' + esc(c.name) + '</h3>'
        + '<p class="city__country">' + esc(c.country) + '</p>'
        + '<p class="city__meta">'
        + (soonCard
          ? 'In the queue'
          : tier(c.tier) + '<span aria-hidden="true">·</span>' + esc(c.nights))
        + '</p>'
        + '</' + tag + '></li>';
    };

    main.innerHTML =
      '<div class="wrap">'

      + '<section class="hero">'
      + '<p class="hero__kicker">' + esc(SITE.tagline) + '</p>'
      + '<h1>Where to go.<br>What to <em>skip</em>.</h1>'
      + '<p class="hero__sub">Honest city guides from a budget-first traveller. '
      + '<strong>Real prices I actually paid.</strong> No place I have not been. '
      + 'And a verdict on everything, including the famous ones.</p>'

      + '<div class="legend">'
      + '<p class="legend__item">' + stamp('yes') + '<span>I would spend the money again.</span></p>'
      + '<p class="legend__item">' + stamp('mixed') + '<span>Good, with a condition attached. Read the condition.</span></p>'
      + '<p class="legend__item">' + stamp('no') + '<span>Coasting on its reputation. Keep your money.</span></p>'
      + '</div>'
      + '</section>'

      + paisley()

      + '<section>'
      + '<div class="section-head">'
      + '<h2>Pick a city</h2>'
      + '<p>' + live.length + ' live · ' + soon.length + ' in the queue</p>'
      + '</div>'
      + '<ul class="cities">' + live.map(card).join('') + soon.map(card).join('') + '</ul>'
      + '</section>'

      + '<section class="callout">'
      + '<h2>Why there are only a few</h2>'
      + '<p>Because I only write up places I have been, with prices I have actually paid. '
      + 'That is slower than scraping the internet for “10 hidden gems”, and it is the entire point. '
      + 'A new city lands every few weeks.</p>'
      + '<a class="btn" href="' + esc(SITE.instagram) + '" target="_blank" rel="noopener">Follow along ↗</a>'
      + '</section>'

      + '</div>';

    setTitle('prashant approves — honest city guides');
    setNav('#/');
  }

  /* --------------------------------------------------------------- city */

  function placeCard(p) {
    const shot = p.photo
      ? '<div class="place__shot"><img src="' + esc(p.photo) + '" alt="' + esc(p.name) + '" loading="lazy">'
        + '<span class="place__stamp">' + stamp(p.verdict, 'stamp--tilt') + '</span></div>'
      : '<div class="place__shot place__shot--empty"><span>your photo here</span>'
        + '<span class="place__stamp">' + stamp(p.verdict, 'stamp--tilt') + '</span></div>';

    const tags = (p.tags && p.tags.length)
      ? '<ul class="tags">' + p.tags.map(x =>
          '<li' + (/queer/i.test(x) ? ' class="is-queer"' : '') + '>' + esc(x) + '</li>').join('') + '</ul>'
      : '';

    return '<li class="place" data-type="' + esc(p.type) + '" data-verdict="' + esc(p.verdict) + '"'
      + ' data-tags="' + esc((p.tags || []).join('|').toLowerCase()) + '">'
      + shot
      + '<div class="place__body">'
      + '<div class="place__top"><div>'
      + '<h3 class="place__name">' + t(p.name) + '</h3>'
      + '<p class="place__area">' + (TYPE_LABEL[p.type] || '') + ' · ' + t(p.area) + '</p>'
      + '</div>' + tier(p.tier) + '</div>'
      + '<p class="place__line">' + t(p.line) + '</p>'
      + '<ul class="place__ds">'
      + '<li class="do"><b>Do</b><span>' + t(p.do) + '</span></li>'
      + '<li class="skip"><b>Skip</b><span>' + t(p.skip) + '</span></li>'
      + '</ul>'
      + tags
      + '<p class="place__cost"><span>What it cost</span><span>' + t(p.cost) + '</span></p>'
      + '</div></li>';
  }

  function budgetTable(b) {
    if (!b) return '';
    const head = '<tr><th>Line item</th><th>' + esc(b.cols[0]) + '</th><th>' + esc(b.cols[1]) + '</th></tr>';
    const rows = b.rows.map(r =>
      '<tr><td>' + t(r.label) + (r.est ? ' <span class="est">estimate</span>' : '') + '</td>'
      + '<td>' + t(r.a) + '</td><td>' + t(r.b) + '</td></tr>').join('');
    const tot = '<tr><td>Total</td><td>' + t(b.total.a) + '</td><td>' + t(b.total.b) + '</td></tr>';
    return '<table class="costs"><thead>' + head + '</thead><tbody>' + rows + tot + '</tbody></table>'
      + (b.note ? '<p class="costs__note">' + esc(b.note) + '</p>' : '');
  }

  function renderCity(slug) {
    const c = CITIES.find(x => x.slug === slug);
    if (!c || c.status !== 'live') return renderMissing(c);

    const types = ['stay', 'eat', 'do'].filter(ty => c.places.some(p => p.type === ty));
    const hasQueer = c.places.some(p => (p.tags || []).some(x => /queer/i.test(x)));

    const chips =
      '<button class="chip" data-f="all" aria-pressed="true">Everything</button>'
      + types.map(ty => '<button class="chip" data-f="type:' + ty + '" aria-pressed="false">'
          + TYPE_LABEL[ty] + '</button>').join('')
      + '<button class="chip" data-f="verdict:yes" aria-pressed="false">Worth it</button>'
      + '<button class="chip" data-f="verdict:no" aria-pressed="false">Skip list</button>'
      + (hasQueer ? '<button class="chip chip--accent" data-f="tag:queer" aria-pressed="false">Queer-friendly</button>' : '')
      + '<span class="filters__count" id="fcount"></span>';

    const itin = (c.itinerary && c.itinerary.length)
      ? paisley() + '<section><div class="section-head"><h2>How I\'d run the days</h2></div>'
        + '<ul class="days">' + c.itinerary.map(d =>
            '<li class="day"><div><p class="day__no">' + t(d.no) + '</p>'
            + '<h3 class="day__title">' + t(d.title) + '</h3></div>'
            + '<ul class="stops">' + (d.stops || []).map(s =>
                '<li><time>' + t(s.time) + '</time><p>' + t(s.text) + '</p></li>').join('')
            + '</ul></li>').join('')
        + '</ul></section>'
      : '';

    const money = c.budget
      ? paisley() + '<section><div class="section-head"><h2>What it actually cost</h2>'
        + '<p>Two real scenarios, not one invented total.</p></div>'
        + budgetTable(c.budget) + '</section>'
      : '';

    const tip = c.tip
      ? '<section class="callout"><h2>One tip</h2><p>' + t(c.tip) + '</p>'
        + (c.music ? '<p class="music"><b>Sounds like:</b> ' + esc(c.music) + '</p>' : '')
        + '</section>'
      : '';

    const refs = (c.refs && c.refs.length)
      ? '<section><div class="section-head"><h2>References</h2></div><ul class="refs">'
        + c.refs.map(r => '<li><a href="' + esc(r.url) + '" target="_blank" rel="noopener">'
            + esc(r.label) + '</a></li>').join('') + '</ul></section>'
      : '';

    const draftBanner = cityHasDrafts(c)
      ? '<p class="draftbar"><b>Draft</b> This guide still has placeholder lines in it '
        + '(shown highlighted). They are yours to fill from the carousel — nothing here is invented.</p>'
      : '';

    main.innerHTML =
      '<div class="wrap">'
      + '<a class="back" href="#/"><span>←</span> All cities</a>'
      + draftBanner

      + '<header class="cityhead">'
      + '<div class="cityhead__stamps">' + stamp(c.verdict, 'stamp--tilt') + tier(c.tier)
      + '<span class="cityhead__when">' + esc(c.nights) + '</span></div>'
      + '<h1>' + esc(c.name) + '</h1>'
      + '<p class="cityhead__tag">' + t(c.tagline) + '</p>'
      + '<dl class="facts">' + (c.facts || []).map(f =>
          '<div><dt>' + esc(f.label) + '</dt><dd>' + t(f.value) + '</dd></div>').join('') + '</dl>'
      + (c.intro ? '<div class="prose"><p>' + t(c.intro) + '</p></div>' : '')
      + '<p class="cityhead__actions"><button class="btn" id="pdf">Save as PDF ↓</button>'
      + '<a class="btn btn--ghost" href="' + esc(SITE.instagram) + '" target="_blank" rel="noopener">The post ↗</a></p>'
      + '</header>'

      + '<section>'
      + '<div class="filters">' + chips + '</div>'
      + '<ul class="places" id="places">' + c.places.map(placeCard).join('')
      + '<li class="empty" hidden id="noresults">Nothing in that filter yet.</li></ul>'
      + '</section>'

      + itin + money + tip + refs

      + '<p class="print-only print-url">prashantapproves.com · @' + esc(SITE.handle) + '</p>'
      + '</div>';

    wireFilters();
    const btn = document.getElementById('pdf');
    if (btn) btn.addEventListener('click', () => window.print());

    setTitle(c.name + ' — prashant approves');
    setNav('#/');
  }

  /* ------------------------------------------------------------ filters */

  function wireFilters() {
    const chips = Array.from(document.querySelectorAll('.chip'));
    const items = Array.from(document.querySelectorAll('.place'));
    const count = document.getElementById('fcount');
    const none = document.getElementById('noresults');
    let active = 'all';

    function apply() {
      let shown = 0;
      items.forEach(el => {
        let ok = true;
        if (active.startsWith('type:'))    ok = el.dataset.type === active.slice(5);
        if (active.startsWith('verdict:')) ok = el.dataset.verdict === active.slice(8);
        if (active.startsWith('tag:'))     ok = el.dataset.tags.includes(active.slice(4));
        el.hidden = !ok;
        if (ok) shown++;
      });
      if (none) none.hidden = shown !== 0;
      if (count) count.textContent = shown + (shown === 1 ? ' place' : ' places');
    }

    chips.forEach(ch => ch.addEventListener('click', () => {
      active = ch.dataset.f;
      chips.forEach(o => o.setAttribute('aria-pressed', String(o === ch)));
      apply();
    }));

    apply();
  }

  /* -------------------------------------------------------------- about */

  function renderAbout() {
    main.innerHTML =
      '<div class="wrap"><section class="hero">'
      + '<p class="hero__kicker">About</p>'
      + '<h1>I say when things <em>aren\'t</em> worth it.</h1>'
      + '</section>'

      + '<div class="prose">'
      + '<p>I\'m Prashant. I grew up in Delhi, I live in London, and I do this in the margins of a '
      + 'day job as a data scientist. Which is a long way of saying: I am spending my own money, '
      + 'and there isn\'t much of it, so I have thought hard about whether each thing was worth it.</p>'

      + '<h2>The rules I write by</h2>'
      + '<p><b>No place I haven\'t been.</b> Not one. If a guide lists somewhere the writer has only '
      + 'read about, the whole guide is worthless and you have no way of knowing which entry is the fake one.</p>'
      + '<p><b>No price I haven\'t paid.</b> Where something is a planning estimate rather than a '
      + 'receipt — accommodation and food, usually — it says so on the page. I would rather show you two '
      + 'honest scenarios than one confident invented total.</p>'
      + '<p><b>A verdict on everything.</b> Including the famous things. Especially the famous things. '
      + 'If I only ever told you what was good, you would have no way to calibrate me.</p>'
      + '<p><b>Anything free is marked #ad.</b> Comped meal, gifted stay, hosted trip — disclosed in the '
      + 'caption and tagged, every time, per UK ASA rules. If I take something free and don\'t tell you, '
      + 'I haven\'t lost one review. I\'ve lost the reason you\'re here.</p>'

      + '<h2>What this site is</h2>'
      + '<p>The long version of what goes on Instagram. The carousels have six slides; this has room '
      + 'for the actual detail — the costs, the day plans, and the reasoning behind a verdict. '
      + 'Every guide prints to a clean PDF if you want it in your pocket offline.</p>'

      + '<h2>What it isn\'t</h2>'
      + '<p>Not affiliate-stuffed. Not a wall of hidden gems. Not somewhere you need to scroll past '
      + 'four ads to find a price. If that changes, it will say so here first.</p>'
      + '</div>'

      + '<section class="callout"><h2>Say something</h2>'
      + '<p>Disagreements welcome, especially about the Eiffel Tower.</p>'
      + '<a class="btn" href="' + esc(SITE.instagram) + '" target="_blank" rel="noopener">DM me on Instagram ↗</a>'
      + '</section></div>';

    setTitle('About — prashant approves');
    setNav('#/about');
  }

  /* ------------------------------------------------------------ missing */

  function renderMissing(c) {
    main.innerHTML =
      '<div class="wrap"><section class="hero">'
      + '<p class="hero__kicker">Not here yet</p>'
      + '<h1>' + (c ? esc(c.name) + ' is <em>in the queue</em>.' : 'Nothing at this <em>address</em>.') + '</h1>'
      + '<p class="hero__sub">' + (c ? t(c.tagline) : 'That link has gone somewhere I haven\'t been.') + '</p>'
      + '<p><a class="btn" href="#/">See the cities that are live</a></p>'
      + '</section></div>';
    setTitle('prashant approves');
    setNav('#/');
  }

  /* -------------------------------------------------------------- router */

  function setTitle(s) { document.title = s; }

  function setNav(href) {
    document.querySelectorAll('.nav a').forEach(a => {
      if (a.getAttribute('href') === href) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
  }

  function route() {
    const raw = (location.hash || '#/').replace(/^#\/?/, '');
    const slug = raw.split('?')[0].replace(/\/+$/, '');

    if (!slug) renderHome();
    else if (slug === 'about') renderAbout();
    else renderCity(slug);

    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
    main.focus({ preventScroll: true });
  }

  window.addEventListener('hashchange', route);
  route();
})();
