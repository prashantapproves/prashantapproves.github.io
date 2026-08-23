# prashantapproves.com

Static site. No build step, no framework, no dependencies. Open `index.html` in a
browser and it works. Push it to GitHub and it's live.

---

## Editing content

**You only ever edit one file: `assets/js/data.js`.**

Everything else is plumbing. The file is heavily commented — open it and it will
tell you what each field does.

### The TODO safety net

Any string you write starting with `TODO:` renders on the page **highlighted in
yellow**, and the city gets a "Draft" banner at the top. This is deliberate: it
makes it very hard to accidentally publish a place you haven't been or a price
you haven't paid.

Delete every `TODO:` in a city before you set `status: 'live'`.

### Adding a city

Copy any block in `data.js`, change the `slug`, fill it in. That's the whole job.
The city picker on the homepage updates itself.

```js
{
  slug: 'lisbon',            // becomes prashantapproves.com/#/lisbon
  name: 'Lisbon',
  country: 'Portugal',
  status: 'live',            // 'live' = full guide | 'soon' = card only
  verdict: 'yes',            // 'yes' WORTH IT | 'mixed' MIXED | 'no' SKIP
  tier: 2,                   // 1,2,3 -> £ ££ £££
  ...
}
```

### Adding photos

Drop your images into `assets/photos/`, then point at them:

```js
photo: 'assets/photos/lisbon-cafe-elba.jpg'
```

Leave `photo: ''` and you get a patterned jaali placeholder instead — which looks
deliberate, not broken, so an unphotographed place is still shippable.

Keep images under ~400KB. Roughly 1600px on the long edge is plenty.

---

## Deploying to GitHub Pages

1. Create a repo. Public. Any name.
2. Put the contents of this folder at the **root** of the repo (not inside a
   subfolder) and push to `main`.
3. Repo → **Settings → Pages** → Source: *Deploy from a branch* → `main` / `root`.
4. Wait about a minute. It'll be live at `yourname.github.io/reponame`.

## Pointing your domain at it

`CNAME` in this folder already contains `prashantapproves.com`. **Check that's
actually the domain you bought** — if it's different, edit that file first.

At your domain registrar, add these DNS records:

| Type  | Name  | Value                    |
|-------|-------|--------------------------|
| A     | `@`   | `185.199.108.153`        |
| A     | `@`   | `185.199.109.153`        |
| A     | `@`   | `185.199.110.153`        |
| A     | `@`   | `185.199.111.153`        |
| CNAME | `www` | `yourname.github.io.`    |

Then in **Settings → Pages → Custom domain**, enter `prashantapproves.com` and
tick **Enforce HTTPS** once the certificate finishes provisioning (can take up to
24 hours — this is normal, don't panic).

---

## The PDF

There is no separate PDF file to maintain. Every city guide has a **Save as PDF**
button that uses the browser's print dialogue, and there's a dedicated print
stylesheet that strips the navigation, filters and photos, and reflows the place
cards into two clean columns.

The upshot: the PDF can never go out of date, because it *is* the page.

---

## Notes on the design

- **Colours and fonts** are all CSS variables at the top of `assets/css/style.css`.
  Change them there once and the whole site follows.
- **The motifs** (`assets/img/*.svg`) were all drawn from scratch for this site.
  They're original vector work, not stock, so there's no licence attached and you
  can use them anywhere, including in Canva:

  | file | what it is | where it sits |
  |---|---|---|
  | `arch-band.svg` | Mughal cusped-arch valance, blush field, marigold tulip butas | hangs under the masthead |
  | `finial-band.svg` | gold ogee finials on deep maroon | grounds the very bottom of the page |
  | `hawa-mahal.svg` | Hawa Mahal jharokha facade, chhatri domes over pointed windows | faint backdrop behind the footer elephant |
  | `jaali.svg` / `jaali-faint.svg` | jaali lattice; the faint copy has its opacity baked in | masthead wash |
  | `border-vine.svg` | beaded vine | rule above the footer |
  | `paisley.svg` | paisley | section dividers |
  | `elephant.svg` | caparisoned elephant | footer |

  Every band is a **seamless repeat-x tile** — its left and right edges line up, so
  changing the CSS height rescales it without ever showing a seam.
- **Jaipur is the reference.** Pink City blush (`--blush`) fills the arch valance,
  gold (`--gold`) is the hairline and finial colour, and the Hawa Mahal sits in the
  footer. The cream-and-maroon base is untouched underneath all of it.
- **`404.html`** is a copy of `index.html`, so any bad URL still loads the site
  and lands on a proper "not here yet" page.

---

## File map

```
index.html            page shell
404.html              copy of the above
CNAME                 your custom domain
.nojekyll             stops GitHub reprocessing the folder
assets/css/style.css  design system + print stylesheet
assets/js/data.js     ← THE ONLY FILE YOU EDIT
assets/js/app.js      router + renderer
assets/img/           the hand-drawn motifs
assets/photos/        your photos go here
```
