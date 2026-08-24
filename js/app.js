/* ==========================================================================
   prashantapproves.com — app
   Hash router + block renderer. No build step, no dependencies.

   YOU DO NOT NEED TO EDIT THIS FILE. It reads data.js and draws whatever it
   finds. Adding a post, renaming a section, adding a whole new section — all
   of that happens in data.js and this file picks it up.

   The shape of it:
     data.js  ->  NAV (sections) + POSTS (pages) + SITE + GALLERY
     app.js   ->  builds the menu, the section indexes, the post pages
     style.css->  makes it look like something

   Routes, all derived, none hard-coded:
     #/                 home
     #/travel #/food…   one per NAV entry
     #/paris  #/ritz…   one per POSTS entry, by slug
     #/about            the one genuinely bespoke page
   ========================================================================== */

(function () {
'use strict';

var main = document.getElementById('main');


/* ---------------------------------------------------------------- basics */

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* Rich text: we allow <em> and <strong> through, because the copy uses them
   for book titles and emphasis, and nothing here is user-submitted. */
function rich(s) {
  return esc(s)
    .replace(/&lt;(\/?)(em|strong|i|b)&gt;/g, '<$1$2>');
}

var isTodo = function (s) { return typeof s === 'string' && s.indexOf('TODO:') === 0; };

/* The honesty rule, made visible. A TODO string renders highlighted rather
   than silently. It is meant to be annoying. */
function t(s) {
  if (!s) return '';
  return isTodo(s) ? '<mark class="todo">' + rich(s.slice(5).trim()) + '</mark>' : rich(s);
}

/* Same, but for places where a highlight would wreck the layout — an alt
   attribute, a card title in a menu. Falls back to a neutral word. */
function tq(s, fallback) { return isTodo(s) ? esc(fallback || '') : esc(s || ''); }

function todoIn(v) {
  if (typeof v === 'string') return isTodo(v);
  if (Array.isArray(v)) return v.some(todoIn);
  if (v && typeof v === 'object') return Object.keys(v).some(function (k) { return todoIn(v[k]); });
  return false;
}


/* ------------------------------------------------------------ ornaments */

function paisley() {
  return '<div class="paisley-div" aria-hidden="true">'
    + '<img src="assets/img/paisley.svg" alt="" width="27" height="35"></div>';
}

var STAMP = { yes: 'Worth it', mixed: 'Mixed', no: 'Skip' };

function stamp(v, small) {
  if (!v || !STAMP[v]) return '';
  return '<span class="stamp stamp--' + v + (small ? ' stamp--sm' : '') + '">' + STAMP[v] + '</span>';
}

function tier(n) {
  if (!n) return '';
  var out = '';
  for (var i = 1; i <= 3; i++) out += '<span' + (i > n ? ' class="tier__off"' : '') + '>£</span>';
  return '<span class="tier" aria-label="' + n + ' out of 3 for price">' + out + '</span>';
}

/* Icons, stroked in currentColor so a pressed chip inverts them for free. */
var ICONS = {
  all:   '<circle cx="8" cy="8" r="5.6"/>',
  /* a bed, not an arch — at 13px an arch is indistinguishable from the door */
  stay:  '<path d="M2.4 13V4.6"/><path d="M2.4 9.4h11.2V13"/><path d="M4.8 9.4V7.3h3.4v2.1"/>',
  eat:   '<path d="M4 2.6v5a1.6 1.6 0 0 0 3.2 0v-5"/><path d="M5.6 7.6V13.4"/>'
       + '<path d="M11.6 2.6c-1 1.4-1.4 3-1.4 4.4h2.8V13.4"/>',
  do:    '<path d="M3 13.4V7.2L8 3l5 4.2v6.2"/><path d="M6.4 13.4V9.6h3.2v3.8"/>',
  yes:   '<path d="M3 8.6 6.4 12 13 4.6"/>',
  no:    '<path d="M4 4l8 8M12 4l-8 8"/>',
  splurge:'<path d="M8 2.4v11.2"/><path d="M10.8 4.6H6.6a2 2 0 0 0 0 4h2.8a2 2 0 0 1 0 4H5"/>',
  cheap: '<path d="M2.6 8h10.8"/><path d="M9.6 4.4 13.4 8l-3.8 3.6"/>'
};

function icon(k, cls) {
  if (!ICONS[k]) return '';
  return '<svg class="' + (cls || 'chip__i') + '" viewBox="0 0 16 16" width="13" height="13"'
    + ' fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"'
    + ' stroke-linejoin="round" aria-hidden="true">' + ICONS[k] + '</svg>';
}


/* ------------------------------------------------------------- pictures */

/* One helper for every image slot on the site, so a missing photo always
   fails the same graceful way: a drawn motif of the right kind rather than a
   broken-image icon. `kind` is eat | stay | do. */
function shot(src, alt, kind, cls, eager) {
  var k = esc(kind || 'do');
  var c = 'shot ' + (cls || '');
  if (!src) return '<span class="' + c + ' shot--empty" data-kind="' + k + '"></span>';
  return '<span class="' + c + '"><img src="' + esc(src) + '" alt="' + esc(alt || '') + '"'
    + ' loading="' + (eager ? 'eager' : 'lazy') + '" decoding="async"'
    + ' onerror="var s=this.closest(\'.shot\');s.classList.add(\'shot--empty\');'
    + 's.dataset.kind=\'' + k + '\';this.remove();"></span>';
}


/* ----------------------------------------------------------------- data */

function section(slug) {
  for (var i = 0; i < NAV.length; i++) if (NAV[i].slug === slug) return NAV[i];
  return null;
}

function postsIn(cat) {
  return POSTS.filter(function (p) { return p.cat === cat; });
}

function postBySlug(slug) {
  for (var i = 0; i < POSTS.length; i++) if (POSTS[i].slug === slug) return POSTS[i];
  return null;
}

var isLive = function (p) { return p.status === 'live'; };

/* Group a list of posts by their `group` field, live entries first inside
   each group, and the groups themselves in first-seen order — so the order
   in data.js is the order on the page. No sorting surprises. */
function grouped(list) {
  var order = [], bag = {};
  list.forEach(function (p) {
    var g = p.group || 'Everything else';
    if (!bag[g]) { bag[g] = []; order.push(g); }
    bag[g].push(p);
  });
  return order.map(function (g) {
    return {
      name: g,
      posts: bag[g].slice().sort(function (a, b) { return (isLive(b) ? 1 : 0) - (isLive(a) ? 1 : 0); })
    };
  });
}

/* The "kind" of drawn placeholder a post gets when it has no cover photo. */
function kindOf(p) { return p.cat === 'food' ? 'eat' : p.cat === 'life' ? 'stay' : 'do'; }


/* ------------------------------------------------------------ draft bar */

function draftBar(obj) {
  if (!todoIn(obj)) return '';
  return '<p class="draftbar"><b>Draft</b> There are placeholder lines on this page, '
    + 'shown highlighted. They are mine to leave blank and yours to fill — '
    + 'nothing here is invented.</p>';
}


/* ==========================================================================
   BLOCKS — the whole reason a post can be extended without touching code
   ========================================================================== */

function block(b, idx) {
  var head = b.title ? '<h2 class="block__title">' + t(b.title) + '</h2>' : '';
  var inner = '';

  if (b.h)     inner += '<h2 class="block__title">' + t(b.h) + '</h2>';
  if (b.p)     inner += '<p>' + t(b.p) + '</p>';
  if (b.note)  inner += '<aside class="note">' + t(b.note) + '</aside>';

  /* A pull quote. One sentence, set large — the place where the writing gets
     to be the loudest thing on the page instead of the pictures. */
  if (b.quote) {
    inner += '<blockquote class="pull">' + t(b.quote)
      + (b.who ? '<cite>' + t(b.who) + '</cite>' : '') + '</blockquote>';
  }

  if (b.list) {
    inner += '<ul class="refs">' + b.list.map(function (li) {
      return '<li>' + t(li) + '</li>';
    }).join('') + '</ul>';
  }

  if (b.photo) {
    inner += '<figure class="figure">' + shot(b.photo, tq(b.caption, ''), 'do', 'shot--wide')
      + (b.caption ? '<figcaption>' + t(b.caption) + '</figcaption>' : '') + '</figure>';
  }

  if (b.strip && b.strip.length) {
    inner += '<div class="strip">' + b.strip.map(function (src) {
      return '<div class="strip__i">' + shot(src, '', 'do') + '</div>';
    }).join('') + '</div>';
  }

  if (b.places && b.places.length) {
    inner += (b.filters ? filterBar(b.places, idx) : '')
      + '<div class="places" data-places="' + idx + '">'
      + b.places.map(placeCard).join('')
      + '<p class="empty" data-empty="' + idx + '" hidden>Nothing matches that. '
      + '<button class="linkish" type="button" data-reset="' + idx + '">Show everything</button></p>'
      + '</div>';
  }

  if (b.days && b.days.length) {
    inner += '<ol class="days">' + b.days.map(function (d) {
      return '<li class="day"><p class="day__no">' + t(d.no) + '</p>'
        + '<h3 class="day__title">' + t(d.title) + '</h3>'
        + '<ul class="stops">' + (d.stops || []).map(function (s) {
            return '<li><time>' + t(s.time) + '</time><p>' + t(s.text) + '</p></li>';
          }).join('') + '</ul></li>';
    }).join('') + '</ol>';
  }

  if (b.costs) inner += costTable(b.costs);

  if (b.links && b.links.length) {
    inner += '<ul class="refs">' + b.links.map(function (l) {
      return '<li><a href="' + esc(l.url) + '" target="_blank" rel="noopener">'
        + t(l.label) + ' ↗</a></li>';
    }).join('') + '</ul>';
  }

  /* A block that is nothing but pictures gets flagged, so the print
     stylesheet can drop it AND the divider that follows it. Without the
     flag the block collapses to nothing in print but leaves two paisley
     dividers stacked on top of each other. */
  var visual = !head && !b.p && !b.h && !b.note && !b.list && !b.quote
    && !b.places && !b.days && !b.costs && !b.links
    && (b.photo || b.strip);

  return '<section class="block' + (visual ? ' block--visual' : '') + '">'
    + head + inner + '</section>';
}

function costTable(c) {
  var cols = c.cols || ['Cost'];
  return '<table class="costs"><thead><tr><th scope="col">Item</th>'
    + cols.map(function (h) { return '<th scope="col">' + esc(h) + '</th>'; }).join('')
    + '</tr></thead><tbody>'
    + (c.rows || []).map(function (r) {
        var badge = r.est ? ' <span class="costs__flag">estimate</span>'
                  : r.real ? ' <span class="costs__flag costs__flag--real">paid</span>' : '';
        return '<tr><td>' + t(r.label) + badge + '</td>'
          + '<td>' + t(r.a) + '</td>'
          + (cols.length > 1 ? '<td>' + t(r.b) + '</td>' : '') + '</tr>';
      }).join('')
    + (c.total ? '<tr><td>Total</td><td>' + t(c.total.a) + '</td>'
        + (cols.length > 1 ? '<td>' + t(c.total.b) + '</td>' : '') + '</tr>' : '')
    + '</tbody></table>'
    + (c.note ? '<p class="costs__note">' + t(c.note) + '</p>' : '');
}


/* ---------------------------------------------------------- place cards */

function placeCard(p) {
  var tags = (p.tags || []).map(function (x) {
    return '<li' + (/queer|lgbt/i.test(x) ? ' class="is-queer"' : '') + '>' + t(x) + '</li>';
  }).join('');

  return '<article class="place" data-type="' + esc(p.type || 'do') + '"'
    + ' data-verdict="' + esc(p.verdict || '') + '"'
    + ' data-tags="' + esc((p.tags || []).join('|')) + '">'
    + '<div class="place__img">'
    +   shot(p.photo, tq(p.name, ''), p.type || 'do')
    +   (p.verdict ? '<span class="place__stamp">' + stamp(p.verdict, true) + '</span>' : '')
    + '</div>'
    + '<div class="place__body">'
    +   '<div class="place__top"><h3 class="place__name">' + t(p.name) + '</h3>' + tier(p.tier) + '</div>'
    +   (p.area ? '<p class="place__area">' + t(p.area) + '</p>' : '')
    +   (p.line ? '<p class="place__line">' + t(p.line) + '</p>' : '')
    +   '<ul class="place__ds">'
    +     (p.do   ? '<li class="do"><b>Do</b><span>' + t(p.do) + '</span></li>' : '')
    +     (p.skip ? '<li class="skip"><b>Skip</b><span>' + t(p.skip) + '</span></li>' : '')
    +   '</ul>'
    +   (p.cost ? '<p class="place__cost"><span>What it cost</span><span>' + t(p.cost) + '</span></p>' : '')
    +   (tags ? '<ul class="tags">' + tags + '</ul>' : '')
    + '</div></article>';
}

function filterBar(places, idx) {
  var have = function (k, v) { return places.some(function (p) { return p[k] === v; }); };
  var chips = [['all', 'Everything', 'all']];
  if (have('type', 'stay')) chips.push(['type:stay', 'Stay', 'stay']);
  if (have('type', 'eat'))  chips.push(['type:eat', 'Eat', 'eat']);
  if (have('type', 'do'))   chips.push(['type:do', 'Do', 'do']);
  if (have('verdict', 'yes')) chips.push(['verdict:yes', 'Worth it', 'yes']);
  if (have('verdict', 'no'))  chips.push(['verdict:no', 'Skip list', 'no']);
  if (chips.length < 3) return '';

  return '<div class="filters" role="group" aria-label="Filter" data-filters="' + idx + '">'
    + chips.map(function (c, i) {
        return '<button class="chip" type="button" data-f="' + c[0] + '"'
          + ' aria-pressed="' + (i === 0 ? 'true' : 'false') + '">'
          + icon(c[2]) + '<span>' + c[1] + '</span></button>';
      }).join('')
    + '<span class="filters__count" data-count="' + idx + '" aria-live="polite"></span></div>';
}


/* ==========================================================================
   PAGES
   ========================================================================== */

/* ---------------------------------------------------------------- home */
/* Deliberately NOT one enormous photograph. A visitor should be able to see,
   without scrolling twice: who you are, that there are pictures, that there
   are three kinds of thing to read, and where to click. */

function renderHome() {
  var m = SITE.mosaic || [];

  var mosaic = m.length
    ? '<div class="mosaic">' + m.slice(0, 4).map(function (x, i) {
        return '<figure class="mosaic__i mosaic__i--' + (i + 1) + '">'
          + shot(x.photo, x.alt, 'do', '', i < 2) + '</figure>';
      }).join('') + '</div>'
    : '';

  var live = POSTS.filter(isLive);
  var latest = live.slice(0, 3).map(cardFor).join('');

  var doors = NAV.map(function (s) {
    var all = postsIn(s.slug);
    var withCover = all.filter(function (p) { return p.cover; })[0] || all[0] || {};
    var n = all.filter(isLive).length;
    return '<a class="door" href="#/' + esc(s.slug) + '">'
      + '<span class="door__shot">' + shot(withCover.cover, '', kindOf({ cat: s.slug })) + '</span>'
      + '<span class="door__body">'
      +   '<span class="kicker">' + esc(s.kicker || '') + '</span>'
      +   '<span class="door__title">' + esc(s.label) + '</span>'
      +   '<span class="door__dek">' + t(s.dek) + '</span>'
      +   '<span class="door__n">' + (n ? n + (n === 1 ? ' guide up' : ' guides up') : 'Being written')
      +     ' · ' + all.length + ' planned</span>'
      + '</span></a>';
  }).join('');

  var wall = (GALLERY || []).map(function (g, i) {
    return '<figure class="wall__i' + (i === 0 ? ' wall__i--big' : '') + '">'
      + shot(g.photo, g.place || '', 'do')
      + (g.place ? '<figcaption>' + esc(g.place) + '</figcaption>' : '')
      + '</figure>';
  }).join('');

  main.innerHTML =
    '<div class="wrap">'

    /* 1 — headline + pictures, side by side */
    + '<section class="home-hero">'
    +   '<div class="home-hero__text">'
    +     '<p class="kicker kicker--rule">Honest guides · London &amp; the world</p>'
    +     '<h1>' + esc(SITE.headline) + '<br><em>' + esc(SITE.headlineEm) + '</em></h1>'
    +     '<p class="home-hero__sub">' + t(SITE.sub) + '</p>'
    +     '<p class="home-hero__cta">'
    +       '<a class="btn" href="#/travel">Start with somewhere</a>'
    +       '<a class="btn btn--ghost" href="#/food">Or with dinner</a>'
    +     '</p>'
    +     '<ul class="legend">'
    +       '<li class="legend__item">' + stamp('yes', true) + '<span>Go. I would spend the money again.</span></li>'
    +       '<li class="legend__item">' + stamp('mixed', true) + '<span>Good, with conditions. Read them.</span></li>'
    +       '<li class="legend__item">' + stamp('no', true) + '<span>Save your afternoon.</span></li>'
    +     '</ul>'
    +   '</div>'
    +   mosaic
    + '</section>'

    + paisley()

    /* 2 — the three doors */
    + '<section class="home-sec home-sec--doors">'
    +   '<div class="section-head"><h2>Three ways in</h2>'
    +     '<p>Pick the one you came for.</p></div>'
    +   '<div class="doors">' + doors + '</div>'
    + '</section>'

    + '</div>'

    /* 3 — the story, on a full-bleed plum field. This is the one place the
       page stops being cream, and it is deliberately the place where the
       writing is about me rather than about a restaurant. */
    + '<section class="band band--plum"><div class="wrap">'
    +   '<section class="story">'
    +     '<figure class="story__portrait">'
    +       shot(SITE.portrait, tq(SITE.portraitAlt, 'Prashant'), 'stay', 'shot--tall')
    +     '</figure>'
    +     '<div class="story__text">'
    +       '<p class="kicker">Who is writing this</p>'
    +       '<h2>' + esc(SITE.name) + '</h2>'
    +       (SITE.story || []).map(function (p) { return '<p>' + t(p) + '</p>'; }).join('')
    +       '<p class="story__hook">' + t(SITE.storyHook) + '</p>'
    +       '<p><a class="more" href="#/about">More about me and the rules I write by →</a></p>'
    +     '</div>'
    +   '</section>'
    + '</div></section>'

    + '<div class="wrap">'

    /* 4 — what is actually readable right now */
    + (latest
        ? '<section class="home-sec">'
          + '<div class="section-head"><h2>Ready to read</h2>'
          + '<p>Finished, checked, priced.</p></div>'
          + '<div class="cards cards--3">' + latest + '</div></section>'
        : '')

    + '</div>'

    /* 5 — the pictures, full width, no captions I had to invent */
    + '<section class="home-sec home-sec--wall">'
    +   '<div class="wrap"><div class="section-head"><h2>Everywhere so far</h2>'
    +     '<p>Nineteen photographs, no filter presets.</p></div></div>'
    +   '<div class="wall">' + wall + '</div>'
    + '</section>'

    /* 6 — the thesis, in butter yellow, the last thing before the footer */
    + '<section class="band band--butter"><div class="wrap"><section class="callout">'
    +   '<h2>The rule this whole site rests on</h2>'
    +   '<p>I say when something is not worth it. That is the entire point — if I liked '
    +     'everything, none of this would be worth reading. Anything gifted or comped is '
    +     'marked <strong>#ad</strong>, every time.</p>'
    +   '<a class="btn btn--ghost" href="' + esc(SITE.instagram) + '" target="_blank" rel="noopener">'
    +     '@' + esc(SITE.handle) + ' ↗</a>'
    + '</section></div></section>';

  setNav('#/');
}


/* -------------------------------------------------- a card, used everywhere */

function cardFor(p) {
  var live = isLive(p);
  var tag = live ? '' : '<span class="card__soon">Queued</span>';
  var el = live ? 'a' : 'div';
  var href = live ? ' href="#/' + esc(p.slug) + '"' : '';

  return '<' + el + ' class="card' + (live ? '' : ' card--soon') + '"' + href + '>'
    + '<span class="card__shot">' + shot(p.cover, tq(p.title, ''), kindOf(p))
    +   (p.verdict && live ? '<span class="card__stamp">' + stamp(p.verdict, true) + '</span>' : '')
    + '</span>'
    + '<span class="card__body">'
    +   '<span class="card__top"><span class="card__title">' + t(p.title) + '</span>' + tier(p.tier) + '</span>'
    +   (p.where ? '<span class="card__where">' + t(p.where) + '</span>' : '')
    +   '<span class="card__dek">' + t(p.dek) + '</span>'
    +   '<span class="card__meta">' + (tag || '<span class="card__go">Read it →</span>')
    +     (p.meta ? '<span class="card__when">' + t(p.meta) + '</span>' : '') + '</span>'
    + '</span></' + el + '>';
}


/* ------------------------------------------------------- a section index */

function renderSection(slug) {
  var s = section(slug);
  var list = postsIn(slug);
  var liveN = list.filter(isLive).length;

  var groups = grouped(list).map(function (g) {
    return '<section class="group"><h2 class="group__name">' + esc(g.name)
      + '<span class="group__n">' + g.posts.length + '</span></h2>'
      + '<div class="cards">' + g.posts.map(cardFor).join('') + '</div></section>';
  }).join(paisley());

  main.innerHTML = '<div class="wrap">'
    + '<header class="pagehead">'
    +   '<p class="kicker kicker--rule">' + esc(s.kicker || '') + '</p>'
    +   '<h1>' + esc(s.title) + '</h1>'
    +   '<p class="pagehead__dek">' + t(s.dek) + '</p>'
    +   '<p class="pagehead__count">' + liveN + ' written · ' + (list.length - liveN) + ' queued</p>'
    + '</header>'
    + groups
    + '</div>';

  setNav('#/' + slug);
}


/* ------------------------------------------------------------- a post page */

function renderPost(p) {
  var s = section(p.cat) || { label: 'Back', slug: '' };

  if (!isLive(p)) {
    main.innerHTML = '<div class="wrap">'
      + '<a class="back" href="#/' + esc(s.slug) + '"><span>←</span> ' + esc(s.label) + '</a>'
      + '<header class="pagehead">'
      +   '<p class="kicker kicker--rule">Not written yet</p>'
      +   '<h1>' + t(p.title) + '</h1>'
      +   '<p class="pagehead__dek">' + t(p.dek) + '</p>'
      + '</header>'
      + (p.cover ? '<figure class="cover">' + shot(p.cover, tq(p.title, ''), kindOf(p), 'shot--wide', true) + '</figure>' : '')
      + '<section class="callout"><h2>This one is queued</h2>'
      +   '<p>I have been, I just have not written it up honestly yet. It goes live the '
      +     'moment it has real prices in it and not a moment before.</p>'
      +   '<a class="btn" href="#/' + esc(s.slug) + '">Everything in ' + esc(s.label) + '</a>'
      + '</section></div>';
    setNav('#/' + p.cat);
    return;
  }

  var facts = (p.facts || []).length
    ? '<dl class="facts">' + p.facts.map(function (f) {
        return '<div><dt>' + t(f.label) + '</dt><dd>' + t(f.value) + '</dd></div>';
      }).join('') + '</dl>'
    : '';

  main.innerHTML = ''
    + (p.cover ? '<div class="bleed"><figure class="cover">'
        + shot(p.cover, tq(p.title, ''), kindOf(p), 'shot--wide', true)
        + '</figure></div>' : '')
    + '<div class="wrap">'
    + '<a class="back" href="#/' + esc(s.slug) + '"><span>←</span> ' + esc(s.label) + '</a>'
    + draftBar(p)
    + '<header class="pagehead pagehead--post">'
    +   '<p class="kicker kicker--rule">' + t(p.where) + (p.date ? ' · ' + t(p.date) : '') + '</p>'
    +   '<h1>' + t(p.title) + '</h1>'
    + '</header>'
    + '</div>'

    /* The verdict, at the size the verdict deserves. It used to be a small
       grey line under the title, which is the wrong scale for the one thing
       this whole site is for. It is the dek from data.js — nothing new to
       write, it just gets a colour field and a serif to stand in. */
    + '<section class="band band--plum band--verdict"><div class="wrap">'
    +   '<p class="verdict__stamps">' + stamp(p.verdict) + tier(p.tier) + '</p>'
    +   '<p class="verdict__line">' + t(p.dek) + '</p>'
    + '</div></section>'

    + '<div class="wrap">'
    + facts
    + '<div class="post">' + (p.body || []).map(block).join(paisley()) + '</div>'
    + '<section class="callout callout--foot">'
    +   '<h2>Take it with you</h2>'
    +   '<p>Prints to a clean two-column page with the photos and the navigation '
    +     'stripped out. It is the page itself, so it can never go out of date.</p>'
    +   '<button class="btn" type="button" id="pdf">Save as PDF</button>'
    + '</section>'
    + '</div>';

  wireFilters();
  var b = document.getElementById('pdf');
  if (b) b.addEventListener('click', function () { window.print(); });
  setNav('#/' + p.cat);
}


/* --------------------------------------------------------------- about */

function renderAbout() {
  main.innerHTML = '<div class="wrap">'
    + '<header class="pagehead">'
    +   '<p class="kicker kicker--rule">About</p>'
    +   '<h1>' + esc(SITE.name) + '</h1>'
    +   '<p class="pagehead__dek">' + t(SITE.tagline) + '</p>'
    + '</header>'
    + '<section class="story">'
    +   '<figure class="story__portrait">'
    +     shot(SITE.portrait, tq(SITE.portraitAlt, 'Prashant'), 'stay', 'shot--tall')
    +   '</figure>'
    +   '<div class="story__text prose">'
    +     (SITE.story || []).map(function (x) { return '<p>' + t(x) + '</p>'; }).join('')
    +   '</div>'
    + '</section>'
    + paisley()
    + '<section class="block prose">'
    +   '<h2 class="block__title">The rules I write by</h2>'
    +   '<p><strong>A verdict on everything.</strong> Every place gets one of three stamps. '
    +     'If I cannot decide, it says Mixed and I tell you what the condition is. Nothing '
    +     'here is a list of things that were all lovely.</p>'
    +   '<p><strong>Prices, or nothing.</strong> A guide without numbers is a mood board. '
    +     'Where a figure is an estimate rather than a receipt, it is labelled as one.</p>'
    +   '<p><strong>The costs other guides skip.</strong> A Schengen visa is £120 before I '
    +     'have eaten anything. Almost no budget guide written in London mentions that, '
    +     'because it was not written for someone on an Indian passport.</p>'
    +   '<p><strong>Disclosure, every time.</strong> Anything gifted, comped or hosted is '
    +     'marked <strong>#ad</strong> in the caption and tagged as a paid partnership, per '
    +     'UK ASA rules. If it does not say that, I paid for it.</p>'
    + '</section>'
    + '<section class="callout">'
    +   '<h2>The short version</h2>'
    +   '<p>Delhi, then London. Data by day, this in the margins. I go places on a normal '
    +     'salary and tell you which parts were worth the money.</p>'
    +   '<a class="btn" href="' + esc(SITE.instagram) + '" target="_blank" rel="noopener">'
    +     '@' + esc(SITE.handle) + ' ↗</a>'
    + '</section></div>';
  setNav('#/about');
}


/* --------------------------------------------------------------- 404 */

function renderMissing(slug) {
  main.innerHTML = '<div class="wrap"><header class="pagehead">'
    + '<p class="kicker kicker--rule">Not here</p>'
    + '<h1>Nothing at that address</h1>'
    + '<p class="pagehead__dek">Either I have not written it yet, or the link has a typo in '
    +   'it. <code>' + esc(slug) + '</code> is not a page.</p></header>'
    + '<div class="cards cards--3">' + NAV.map(function (s) {
        return '<a class="card card--plain" href="#/' + esc(s.slug) + '">'
          + '<span class="card__body"><span class="card__title">' + esc(s.label) + '</span>'
          + '<span class="card__dek">' + t(s.dek) + '</span></span></a>';
      }).join('') + '</div></div>';
  setNav('');
}


/* ==========================================================================
   FILTERS
   ========================================================================== */

function wireFilters() {
  [].forEach.call(document.querySelectorAll('[data-filters]'), function (bar) {
    var id    = bar.dataset.filters;
    var grid  = document.querySelector('[data-places="' + id + '"]');
    var empty = document.querySelector('[data-empty="' + id + '"]');
    var count = document.querySelector('[data-count="' + id + '"]');
    if (!grid) return;
    var cards = [].slice.call(grid.querySelectorAll('.place'));

    function apply(f) {
      var shown = 0;
      cards.forEach(function (el) {
        var ok = true;
        if (f.indexOf('type:') === 0)         ok = el.dataset.type === f.slice(5);
        else if (f.indexOf('verdict:') === 0) ok = el.dataset.verdict === f.slice(8);
        /* .place is display:flex, which beats the browser's own
           [hidden]{display:none} — style.css re-asserts it with !important. */
        el.hidden = !ok;
        if (ok) shown++;
      });
      if (empty) empty.hidden = shown !== 0;
      if (count) count.textContent = shown + ' of ' + cards.length;
    }

    bar.addEventListener('click', function (e) {
      var btn = e.target.closest('.chip');
      if (!btn) return;
      [].forEach.call(bar.querySelectorAll('.chip'), function (c) {
        c.setAttribute('aria-pressed', String(c === btn));
      });
      apply(btn.dataset.f);
    });

    if (empty) empty.addEventListener('click', function (e) {
      if (!e.target.closest('[data-reset]')) return;
      var first = bar.querySelector('.chip');
      [].forEach.call(bar.querySelectorAll('.chip'), function (c) {
        c.setAttribute('aria-pressed', String(c === first));
      });
      apply('all');
    });

    apply('all');
  });
}


/* ==========================================================================
   NAV — built from NAV + POSTS, never from markup
   ========================================================================== */

var navEl = document.getElementById('nav');

/* A section only gets a dropdown once it has enough posts to be worth one.
   Below the threshold a menu is just an extra click. It flips over on its own
   as the site fills up — nothing to remember. */
var DROP_FROM = 5;

function buildNav() {
  var html = NAV.map(function (s) {
    var list = postsIn(s.slug);
    if (list.length < DROP_FROM) {
      return '<a class="nav__link" href="#/' + esc(s.slug) + '" data-nav="#/' + esc(s.slug) + '">'
        + esc(s.label) + '</a>';
    }

    var items = grouped(list).map(function (g) {
      return '<p class="nav__group">' + esc(g.name) + '</p>'
        + g.posts.map(function (p) {
            return isLive(p)
              ? '<a class="nav__item" role="menuitem" href="#/' + esc(p.slug) + '">'
                + '<span class="nav__city">' + tq(p.title, 'Untitled') + '</span>'
                + '<span class="nav__note">' + tq(p.where, '') + '</span></a>'
              : '<span class="nav__item nav__item--soon" role="menuitem" aria-disabled="true">'
                + '<span class="nav__city">' + tq(p.title, 'Untitled') + '</span>'
                + '<span class="nav__note">soon</span></span>';
          }).join('');
    }).join('<span class="nav__sep" aria-hidden="true"></span>');

    var id = 'drop-' + s.slug;
    return '<span class="nav__drop">'
      + '<button class="nav__trigger" type="button" data-nav="#/' + esc(s.slug) + '"'
      +   ' aria-expanded="false" aria-controls="' + id + '" aria-haspopup="true">'
      +   esc(s.label) + ' <span class="nav__chev" aria-hidden="true"></span></button>'
      + '<div class="nav__menu" id="' + id + '" role="menu" hidden>' + items
      +   '<a class="nav__item nav__item--all" role="menuitem" href="#/' + esc(s.slug) + '">'
      +     'See all ' + esc(s.label.toLowerCase()) + ' →</a>'
      + '</div></span>';
  }).join('');

  navEl.innerHTML = html
    + '<a class="nav__link" href="#/about" data-nav="#/about">About</a>'
    + '<a class="nav__link nav__ig" href="' + esc(SITE.instagram) + '" target="_blank" rel="noopener">'
    +   'Instagram ↗</a>';

  wireDrops();
}

function wireDrops() {
  [].forEach.call(navEl.querySelectorAll('.nav__drop'), function (drop) {
    var btn  = drop.querySelector('.nav__trigger');
    var menu = drop.querySelector('.nav__menu');

    function open(v) {
      btn.setAttribute('aria-expanded', String(v));
      menu.hidden = !v;
    }

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var was = btn.getAttribute('aria-expanded') === 'true';
      closeAll();
      open(!was);
    });

    /* Arrow keys walk the menu; Escape closes it and returns focus. Standard
       menu-button behaviour, and cheap to add. */
    drop.addEventListener('keydown', function (e) {
      var items = [].slice.call(menu.querySelectorAll('a.nav__item'));
      if (e.key === 'Escape') { open(false); btn.focus(); return; }
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (menu.hidden) open(true);
        var i = items.indexOf(document.activeElement);
        var n = e.key === 'ArrowDown' ? i + 1 : i - 1;
        if (n < 0) n = items.length - 1;
        if (n >= items.length) n = 0;
        if (items[n]) items[n].focus();
      }
    });

    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) open(false);
    });
  });

  document.addEventListener('click', closeAll);
}

function closeAll() {
  [].forEach.call(navEl.querySelectorAll('.nav__menu'), function (m) { m.hidden = true; });
  [].forEach.call(navEl.querySelectorAll('.nav__trigger'), function (b) {
    b.setAttribute('aria-expanded', 'false');
  });
}

function setNav(href) {
  [].forEach.call(navEl.querySelectorAll('[data-nav]'), function (el) {
    var on = el.dataset.nav === href;
    if (el.tagName === 'A') {
      if (on) el.setAttribute('aria-current', 'page'); else el.removeAttribute('aria-current');
    } else {
      el.classList.toggle('is-current', on);
    }
  });
}


/* ==========================================================================
   ROUTER
   ========================================================================== */

function route() {
  var raw  = (location.hash || '#/').replace(/^#\/?/, '');
  var slug = raw.split('?')[0].replace(/\/+$/, '');

  closeAll();

  if (slug === '')            renderHome();
  else if (slug === 'about')  renderAbout();
  else if (section(slug))     renderSection(slug);
  else {
    var p = postBySlug(slug);
    if (p) renderPost(p); else renderMissing(slug);
  }

  window.scrollTo(0, 0);
  main.focus({ preventScroll: true });
  reveal();
}


/* ==========================================================================
   MOVEMENT — a short fade and rise as each section arrives
   --------------------------------------------------------------------------
   Deliberately built so that doing nothing is the safe state: the class that
   hides an element is only ever added by this function, and only when it has
   an observer ready to take it off again. No JavaScript, no IntersectionObserver,
   or reduced-motion turned on, and every section is simply visible.
   ========================================================================== */

/* .place is deliberately not in here. Those cards are shown and hidden by the
   filter chips, and an opacity animation fighting a display toggle is exactly
   the kind of bug that only appears on someone else's machine.
   .story is not in here either: on the homepage it lives inside a band, and
   tagging both would fade the same thing twice. */
var REVEAL_SEL = '.home-sec, .band, .card, .block, .home-hero__text, .wall__i';

function reveal() {
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var els = [].slice.call(main.querySelectorAll(REVEAL_SEL));

  /* A section that is already on screen at load should not animate in —
     that reads as a page that has not finished loading. */
  var fold = window.innerHeight * 0.9;

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-in');
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });

  els.forEach(function (el) {
    if (el.getBoundingClientRect().top < fold) return;
    /* Grid children go one after the other, but only just — four steps of
       60ms, then it stops, so a long list never turns into a queue. */
    var i = el.parentElement ? [].indexOf.call(el.parentElement.children, el) : 0;
    if (i > 0 && el.matches('.card, .wall__i')) {
      el.style.transitionDelay = Math.min(i, 4) * 0.06 + 's';
    }
    el.classList.add('will-reveal');
    io.observe(el);
  });
}

document.addEventListener('DOMContentLoaded', function () {
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();
});

buildNav();
window.addEventListener('hashchange', route);
route();

})();
