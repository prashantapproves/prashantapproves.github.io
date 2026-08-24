# prashantapproves.com

Static site. No build step, no framework, no dependencies, nothing to install.
Open `index.html` in a browser and it works. Push it to GitHub and it's live.

---

## The one thing to understand

**There is one list of things: `POSTS`, in `assets/js/data.js`.**

Every page on this site — a city guide, a restaurant review, a piece about
cycling — is one entry in that list. They differ only by `cat`:

| `cat`      | Where it shows up |
|------------|-------------------|
| `'travel'` | Travel section, Travel dropdown, homepage |
| `'food'`   | Food section |
| `'life'`   | Life section |

The section pages, the homepage, the nav menu and the URLs all build themselves
from that list. **You never register a page anywhere.** You add an entry, it
exists, and it is linked from every place it belongs.

You only ever edit `assets/js/data.js`. Everything else is plumbing, and
`app.js` says so in its first line.

---

## Adding a page

1. Open `assets/js/data.js`, find `POSTS`.
2. Copy any existing entry.
3. Change `slug` and fill it in.

That's it. Its URL is now `prashantapproves.com/#/your-slug` — permanent,
shareable, safe to put in your Instagram bio.

```js
{
  slug:   'lisbon',              // the URL. Never change it once published.
  cat:    'travel',              // travel | food | life
  status: 'live',                // 'live' shows it; 'soon' shows a greyed card
  title:  'Lisbon',
  where:  'Portugal',
  group:  'Europe',              // optional heading it sits under
  date:   'May 2026',
  meta:   '4 days · 3 nights',
  verdict:'yes',                 // yes | mixed | no
  tier:   2,                     // 1 = £, 2 = ££, 3 = £££
  cover:  'assets/photos/x.jpg', // optional
  dek:    'One sentence with the verdict in it.',
  body:   [ /* blocks — see below */ ]
}
```

### `status`

- `'live'` — a real, clickable page.
- `'soon'` — shows as a greyed-out card reading "planned". Useful for parking
  the twelve places you've been but haven't written up yet, so the site reads
  like a life rather than like one page.

### `group`

Optional. Posts sharing a `group` string cluster under one heading, and **the
order you write them in `data.js` is the order on the page.** No sorting
surprises. Within a group, live posts float above planned ones.

---

## Augmenting a page

A post's `body` is a list of **blocks**, rendered top to bottom in the order you
write them. Add a block and it appears. Move it and it moves. Delete it and it's
gone. You never touch a template.

```js
{ h:     'A heading' }                        // a heading on its own
{ p:     'A paragraph.' }                     // words
{ note:  'Something worth pulling out.' }     // boxed, maroon, hard to miss
{ quote: 'One sentence.', who:'Paris' }       // BIG. your voice, set large
{ list:  ['one','two'] }                      // a plain list
{ photo: 'assets/photos/x.jpg', caption:'' }  // one photo with a caption
{ strip: ['a.jpg','b.jpg','c.jpg'] }          // a row of photos
{ places:[ ... ], filters:true }              // verdict cards + filter chips
{ days:  [ ... ] }                            // an hour-by-hour itinerary
{ costs: { ... } }                            // the money table
{ links: [{label:'', url:''}] }               // read-more links
```

Every block also takes an optional `title:'...'`, printed above it as a section
heading. Paris uses all of them — read it as the worked example.

`quote` is the one to use sparingly. It sets a single sentence at headline size
in the serif, and it is the only place on a post page where your writing is
bigger than the pictures. Once or twice per guide. Any more and it stops
reading as emphasis and starts reading as decoration.

The verdict at the top of every post page — the plum band under the title — is
not a block and you do not write it. It is the post's own `dek`, which used to
sit small and grey. Change `dek`, the big verdict changes.

### The `places` block

The heart of the site. Each place is a card with its own verdict stamp, and the
chips above filter them live.

```js
{
  title:'Every place, judged',
  filters:true,
  places:[
    { name:'The Eiffel Tower', area:'Champ de Mars', type:'do',
      verdict:'no', tier:2, photo:'assets/photos/x.jpg',
      why:'Why I feel that way.',
      do:'The one thing worth doing.',
      skip:'The bit to skip.',
      cost:'£29', tags:['booked ahead'] }
  ]
}
```

`type` is `stay`, `eat` or `do`. It picks the fallback illustration when there's
no photo, and it drives the filter chips.

---

## The TODO safety net

**Any string starting with `TODO:` renders in a butter wash with a gold
underline, and the page gets a "Draft" banner at the top.**

This is deliberate, and it's the most important thing in the codebase. The whole
account rests on you saying when something isn't worth it, which only works if
every verdict on the site is one you actually hold. It should be hard to
accidentally publish a place you didn't go to or a price you didn't pay.

Clear every `TODO:` before you set a post to `status:'live'`.

Currently left as TODO on purpose, because they're your opinions and nobody else
can write them:

- Gymkhana and The Ritz — every verdict field
- Both Life posts
- Paris — the itinerary and most of the cost table

---

## Renaming or adding a section

At the top of `data.js`:

```js
const NAV = [
  { slug:'travel', label:'Travel', title:'Travel', kicker:'…', dek:'…' },
  { slug:'food',   label:'Food',   title:'Food',   kicker:'…', dek:'…' },
  { slug:'life',   label:'Life',   title:'Life',   kicker:'…', dek:'…' }
];
```

- **Rename a section:** change `label`. One word. Nothing else moves.
- **Add a fourth:** add a line, then tag posts with that `cat`.
- **Never change `slug`** once you've published — it's both the URL and the tag.

On the naming question, since you asked: **"Blog"** describes a format, tells a
visitor nothing about what's inside, and quietly promises you'll post every week
forever. **"Guide"** describes a promise, but reads odd as a menu item and boxes
you out of writing anything that isn't a guide. **"Travel"** describes what
someone *wants* — it's how people search, it sits beside Food and Life without
strain, and it obliges you to nothing. That's why it's the default.

A section only grows a dropdown menu once it has five or more posts. That
threshold lives in `app.js` as `DROP_FROM` and flips over on its own as the site
fills up. Nothing to remember.

---

## Photos

All in `assets/photos/`. They're named by **what is in them**, not where they
were taken, because only five were identifiable with certainty. Those five are
already placed (two Paris, three Scotland).

The other fifteen sit in `GALLERY` with blank `place` labels, so they appear as
pictures with no caption rather than as a guess. There's a manifest at the top
of `data.js` describing each one.

To place a photo, paste its filename into a post's `cover`, or into a
`{ strip:[...] }` block, or into a place card's `photo`. Filling in the `place`
labels in `GALLERY` is about five minutes of work and makes the photo wall on
the homepage read properly.

**Missing photos never break the layout.** Every image on the site goes through
one primitive, so an absent or broken file degrades to a drawn line-art motif
over a jaali wash — a thali for `eat`, a bed for `stay`, an arch for `do`.

---

## Printing / PDF

Every page prints clean: navigation, buttons, filters and photos are stripped,
the text reflows to a readable measure, and links keep their URLs. Readers hit
Cmd/Ctrl-P and choose "Save as PDF" — or use the button at the foot of each
guide.

The PDF is the page itself, so it can never go out of date. There's nothing to
regenerate and no second copy to keep in sync.

---

## Deploying

The whole site is this folder.

1. Push it to a GitHub repo.
2. Settings → Pages → deploy from branch `main`, folder `/ (root)`.
3. Settings → Pages → custom domain → `prashantapproves.com`.
4. At your registrar, point the apex `A` records at GitHub's four IPs and add a
   `CNAME` for `www` → `<username>.github.io`.

Already in place for you:

- `CNAME` — holds the domain. **Check the spelling matches the domain you
  actually bought before the first push.**
- `.nojekyll` — stops GitHub trying to build the folder as a Jekyll blog.
- `404.html` — a byte-identical copy of `index.html`. If you ever edit
  `index.html`, run `cp index.html 404.html`. That's the only housekeeping this
  site has.

URLs use a `#` (`/#/paris`) on purpose. Deep links survive GitHub Pages without
any redirect rules, so a link you put in your bio today still resolves in two
years.

---

## File map

```
index.html            page shell. Rarely touched.
404.html              copy of index.html. Keep in sync.
CNAME                 your domain.
.nojekyll             tells GitHub not to build this.
assets/
  css/style.css       the whole design system. One file.
  js/data.js          ← THE ONLY FILE YOU EDIT
  js/app.js           the renderer. Says "you do not need to edit this."
  img/                SVG ornament: the block-print page border, the Ganesha
                      coin at the top, jaali, paisley, elephant, motifs.
  photos/             your twenty photographs.
```
