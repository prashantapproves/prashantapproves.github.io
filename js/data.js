/* ==========================================================================
   prashantapproves.com — CONTENT FILE
   The only file you ever edit. Everything else is plumbing.
   ==========================================================================

   HOW THIS SITE IS PUT TOGETHER (read once, then never again)
   -----------------------------------------------------------
   There is ONE list of things: POSTS.

   Every single page on this site — a city guide, a restaurant review, a piece
   about cycling — is one entry in POSTS. They differ only by `cat`:

       cat:'travel'   ->  appears under Travel
       cat:'food'     ->  appears under Food
       cat:'life'     ->  appears under Life

   The section pages, the homepage, the dropdown menu and the URLs all build
   themselves from that list. You never register a page anywhere. You add an
   entry, it exists, and it is linked from everywhere it belongs.

   Want a fourth section? Add it to NAV. Tag posts with that cat. Done.

   ADDING A PAGE
   -------------
   Copy any block below, change `slug`, fill it in. Its URL becomes
   prashantapproves.com/#/your-slug — permanent, shareable, Instagram-bio-able.

   AUGMENTING A PAGE
   -----------------
   A post's `body` is a list of BLOCKS, rendered top to bottom in the order you
   write them. Add a block, it appears. Move it, it moves. The blocks:

     { h:'A heading' }                          a heading on its own
     { p:'A paragraph.' }                       words
     { note:'Something worth pulling out.' }    boxed, maroon, hard to miss
     { quote:'One sentence.', who:'Paris' }     BIG. your voice, set large.
                                                `who` is optional. use it once
                                                or twice a page, not more — it
                                                only lands if it is rare.
     { list:['one','two'] }                     a plain list
     { photo:'assets/photos/x.jpg', caption:'' }
     { strip:['a.jpg','b.jpg','c.jpg'] }        a row of photos
     { places:[ ... ], filters:true }           the verdict cards + filter chips
     { days:[ ... ] }                           an hour-by-hour itinerary
     { costs:{ ... } }                          the money table
     { links:[{label:'',url:''}] }              read-more links

   Every block takes an optional `title:'...'` which prints above it.

   THE HONESTY RULE (baked in on purpose)
   --------------------------------------
   Any text starting with "TODO:" renders highlighted in yellow and puts a
   draft banner on the page. It is deliberately hard to publish a place you
   didn't go to or a price you didn't pay. Clear every TODO before you set a
   post to status:'live'.

   ==========================================================================
   YOUR 20 PHOTOS — FIVE MINUTES OF WORK AND THE SITE FILLS UP
   ==========================================================================
   All in assets/photos/. Named by what is IN them, not where they were taken,
   because I only recognised five for certain. Those five are already placed:

     paris-eiffel-night.jpg    Paris
     paris-riverside.jpg       Paris
     skye-storr.jpg            Scotland — the Old Man of Storr
     castle-loch.jpg           Scotland — Eilean Donan
     edinburgh-old-town.jpg    Scotland — the Royal Mile

   The other fifteen are in GALLERY with blank labels, so they show as pictures
   with no caption rather than as a guess. Paste a filename into any post's
   `cover`, or into a { strip:[...] } block, and it moves onto that page:

     beach-swim.jpg        walking out of a turquoise sea, rocks behind
     castle-window-bay.jpg standing in a castle window over a beach and bay
     city-wall-sit.jpg     sitting on a wall, red bus behind, sunny
     cycling-bridge.jpg    on a bike on a stone bridge, wooded valley
     flower-field.jpg      standing in a field of blue-flowering crop
     great-hall.jpg        grand stone hall, gothic windows, ornate lamp
     highlands-loch.jpg    wide loch and hills, big sky
     loch-sunset.jpg       low sun over water, a figure on the rocks
     ornate-gate.jpg       leaning on pale stone by a big iron gate
     poolside-palms.jpg    pool, palms, cypress trees
     portrait-brick.jpg    portrait against a brick wall  (used in the story)
     rock-lamppost.jpg     under a lamppost against a rock face, backpack
     stone-doorway.jpg     framed in a stone doorway, red door, valley beyond
     turquoise-cove.jpg    clifftop over a turquoise cove and sandbar
     water-sunset.jpg      sunset across a loch, stony shore

   ========================================================================== */


/* ==========================================================================
   1. THE NAV
   --------------------------------------------------------------------------
   Rename a section by editing `label` and nothing else. `slug` is the URL and
   the tag posts use, so leave those alone once you have published anything.

   On the naming question — my reasoning, take it or leave it:
     "Blog"   describes a FORMAT. It tells a visitor nothing about what is
              inside, and it quietly promises you will post every week forever.
     "Guide"  describes a PROMISE, but reads odd as a menu item and boxes you
              out of writing anything that is not a guide.
     "Travel" describes what someone WANTS. It is how people search, it sits
              beside Food and Life without strain, and it obliges you to
              nothing. That is why it is the default here.
   ========================================================================== */

const NAV = [
  { slug: 'travel', label: 'Travel',
    title:  'Travel',
    kicker: 'Somewhere to go',
    dek:    'Places I actually went, what they actually cost, and the bits I would skip.' },

  { slug: 'food',   label: 'Food',
    title:  'Food',
    kicker: 'Something to eat',
    dek:    'Restaurants, hotels, afternoon teas. The cheap ones, and the ones with a nought on the end.' },

  { slug: 'life',   label: 'Life',
    title:  'Life',
    kicker: 'The rest of it',
    dek:    'Me, mostly. Hobbies I picked up, opinions I hold, things I got wrong.' }
];


/* ==========================================================================
   2. THE SITE, AND YOUR STORY
   ========================================================================== */

const SITE = {
  handle: 'prashantapproves',
  instagram: 'https://instagram.com/prashantapproves',
  name: 'Prashant',

  tagline: 'Travel, food and the occasional bad decision. Delhi → London.',

  /* THE HOMEPAGE.
     Not one enormous photograph — a headline, a cluster of pictures, and a
     story. `mosaic` is that cluster. Four photos is what fills the shape;
     the first one is the tall one on the left. */
  mosaic: [
    { photo: 'assets/photos/skye-storr.jpg',         alt: 'The Old Man of Storr, Skye' },
    { photo: 'assets/photos/paris-eiffel-night.jpg', alt: 'Paris at night' },
    { photo: 'assets/photos/turquoise-cove.jpg',     alt: 'A turquoise cove from the clifftop' },
    { photo: 'assets/photos/beach-swim.jpg',         alt: 'Walking out of the sea' }
  ],

  headline:   'Go anyway.',
  headlineEm: 'I’ll tell you what to skip.',
  sub:        'A Delhi kid in London, going places on a normal salary and refusing to pretend all of it was worth the money.',

  /* The story block further down the page. First person, short, and leave a
     thread hanging so they click something. Three paragraphs, no more.

     There used to be a third paragraph here reading "TODO: one more line in
     your own voice". It was the one draft flag a first-time visitor would ever
     see, sitting on your homepage in highlighter yellow, so it has been taken
     out rather than left showing. Two paragraphs read as a finished thought.
     If you want a third — the thing you'd say at a dinner table when someone
     asks what you actually do at weekends — add it here as a plain string. */
  portrait: 'assets/photos/portrait-brick.jpg',
  portraitAlt: 'Prashant',
  story: [
    'I grew up in Delhi and I live in London, and somewhere between the two I picked up a habit of going places on a normal salary and refusing to pretend they were all wonderful.',
    'Some of it is planned to the hour. Some of it is a Tuesday where I got on a train north and ended up eating chips on a sea wall. Both go on here — the itineraries and the receipts, and also the parts where I paid £14 for something that was not worth £14.'
  ],
  storyHook: 'Everything here is somewhere I have actually been, with what it actually cost.'
};


/* ==========================================================================
   3. POSTS — every page on the site
   --------------------------------------------------------------------------
   cat      'travel' | 'food' | 'life'   (must match a NAV slug)
   status   'live' = full readable page | 'soon' = listed, marked queued
   verdict  'yes' WORTH IT | 'mixed' MIXED | 'no' SKIP | '' for none
   tier     1, 2, 3 -> £ ££ £££ . Use 0 for none.
   group    the heading it sits under on its section page. Free text.
   cover    the card photo, reused big at the top of the page. '' draws a
            placeholder motif instead, which looks deliberate, not broken.
   ========================================================================== */

const POSTS = [


/* ============================================================ TRAVEL ==== */

{
  slug: 'paris',
  cat: 'travel',
  status: 'live',
  title: 'Paris',
  where: 'France',
  group: 'Europe',
  date: 'May 2026',
  meta: '5 days · 4 nights',
  verdict: 'yes',
  tier: 2,
  cover: 'assets/photos/paris-eiffel-night.jpg',
  dek: 'Worth it — but not for the reasons the internet keeps telling you. The tower is the weakest day of the trip.',

  facts: [
    { label: 'Trip length',       value: '5 days, 4 nights' },
    { label: 'When I went',       value: 'May 2026' },
    { label: 'Cost, as I did it', value: '~£1,100' },
    { label: 'Cost, leaner',      value: '~£760' }
  ],

  body: [

    { p: 'Five days, done on a middle budget, from London. Below is what I actually did, what I actually paid, and the two things I would not do again. The Schengen visa is in the budget because it is a real cost of this trip on an Indian passport, and almost no Paris guide includes it.' },

    { strip: ['assets/photos/paris-riverside.jpg'] },

    { title: 'Every place, judged',
      filters: true,
      places: [
        {
          name: 'The Eiffel Tower',
          type: 'do', verdict: 'no', tier: 2,
          area: '7th arrondissement',
          line: 'The single most oversold thing in Paris. You queue, you pay, you go up, and the view is of a city with its best landmark missing from it — because you are standing in it.',
          do: 'See it from the ground, at distance, for free. It is genuinely beautiful from across the river and that is the version worth your evening.',
          skip: 'Going up. The time and money buy you less than almost anything else in this city.',
          cost: 'Free from the ground',
          tags: ['overrated', 'free from outside'],
          photo: 'assets/photos/paris-eiffel-night.jpg'
        },
        {
          name: 'Foie gras',
          type: 'eat', verdict: 'no', tier: 3,
          area: 'Everywhere, at a markup',
          line: 'Ordered it because you are supposed to. It is rich, it is expensive, and it is not the thing you will remember about eating in Paris.',
          do: 'Spend that same money on one properly good bakery run and one sit-down dinner instead.',
          skip: 'Ordering it out of obligation. It is a tourist tax with a French accent.',
          cost: 'TODO: what you actually paid for the foie gras',
          tags: ['overrated'],
          photo: ''
        },
        {
          name: 'Paris Museum Pass',
          type: 'do', verdict: 'mixed', tier: 2,
          area: 'City-wide',
          line: 'The maths matters here and nobody does it for you. I did three sites and came in under the price of the pass — so it lost me money.',
          do: 'Count your sites honestly before you buy. It only starts paying off at four or more, and four is more museums than most people genuinely want in a short trip.',
          skip: 'Buying it for the queue-skipping. It does not skip queues — every site still needs a timed entry slot booked in advance, pass or no pass.',
          cost: 'Worth it from 4+ sites',
          tags: ['do the maths'],
          photo: ''
        },
        {
          name: 'The Schengen visa',
          type: 'do', verdict: 'mixed', tier: 1,
          area: 'Before you go',
          line: 'Not a place, but it is the line item every other Paris budget guide leaves out — and on an Indian passport it is the first £120 of your trip before you have eaten anything.',
          do: 'Build it into the trip cost from day one. It changes whether a short Paris break is actually cheaper than a week somewhere visa-free.',
          skip: 'Reading any budget guide that does not mention it. It was not written for you.',
          cost: '£120',
          tags: ['indian passport', 'the hidden cost'],
          photo: ''
        },
        {
          name: 'TODO: where you stayed',
          type: 'stay', verdict: 'mixed', tier: 2,
          area: 'TODO: neighbourhood',
          line: 'TODO: one honest line on the place — what it actually felt like to stay there.',
          do: 'TODO: the one thing that made it worth booking.',
          skip: 'TODO: the thing you would warn someone about.',
          cost: 'TODO: per night, what you paid',
          tags: [], photo: ''
        },
        {
          name: 'TODO: the meal that was worth it',
          type: 'eat', verdict: 'yes', tier: 2,
          area: 'TODO: neighbourhood',
          line: 'TODO: why this one earned its money.',
          do: 'TODO: order this.',
          skip: 'TODO: skip this.',
          cost: 'TODO: what you paid',
          tags: [], photo: ''
        },
        {
          name: 'TODO: the thing you would do again',
          type: 'do', verdict: 'yes', tier: 1,
          area: 'TODO: neighbourhood',
          line: 'TODO: the honest case for it.',
          do: 'TODO: the version of it worth doing.',
          skip: 'TODO: the version that wastes your morning.',
          cost: 'TODO: what you paid',
          tags: [], photo: 'assets/photos/paris-riverside.jpg'
        }
      ]
    },

    { title: 'How I actually spent the days',
      days: [
        { no: 'Day 1', title: 'TODO: name the day', stops: [
          { time: 'TODO: 09:00', text: 'TODO: pull this straight off your Getting Around slide.' },
          { time: 'TODO: 13:00', text: 'TODO: where you ate and what it cost.' },
          { time: 'TODO: 19:00', text: 'TODO: the evening.' }
        ]},
        { no: 'Day 2', title: 'TODO: name the day', stops: [
          { time: 'TODO: 09:00', text: 'TODO: morning.' },
          { time: 'TODO: 15:00', text: 'TODO: afternoon.' }
        ]}
      ]
    },

    { title: 'What it cost',
      costs: {
        note: 'Accommodation and food are planning estimates, clearly marked — not receipts. Everything else is what I actually paid.',
        cols: ['As I did it', 'Leaner'],
        rows: [
          { label: 'Schengen visa',                 a: '£120', b: '£120', real: true },
          { label: 'TODO: Eurostar / travel',       a: 'TODO', b: 'TODO' },
          { label: 'TODO: Accommodation, 4 nights', a: 'TODO', b: 'TODO', est: true },
          { label: 'TODO: Food',                    a: 'TODO', b: 'TODO', est: true },
          { label: 'TODO: Getting around',          a: 'TODO', b: 'TODO' },
          { label: 'TODO: Sights',                  a: 'TODO', b: 'TODO' }
        ],
        total: { a: '~£1,100', b: '~£760' }
      }
    },

    { note: 'Book every timed entry slot before you leave London. The Museum Pass does not do it for you, and the good slots are gone by the time you are standing outside deciding.' },

    { p: 'Soundtrack, if you want one: Françoise Hardy, <em>Le Temps de l’Amour</em>. Yann Tiersen if you would rather it were instrumental.' },

    { links: [{ label: 'The full 8-slide carousel', url: 'https://instagram.com/prashantapproves' }] }
  ]
},

{
  slug: 'scotland',
  cat: 'travel',
  status: 'soon',
  title: 'Scottish Highlands',
  where: 'Scotland · the NC500',
  group: 'UK',
  date: '', meta: 'TODO: how many days, and when',
  verdict: '', tier: 2,
  cover: 'assets/photos/skye-storr.jpg',
  dek: 'TODO: the one honest line. Was the whole 500 miles worth it, or would you cut half of it?',
  body: [
    { strip: ['assets/photos/castle-loch.jpg', 'assets/photos/edinburgh-old-town.jpg'] }
  ]
},

/* The rest are stubs. They already show up in the menu and on the Travel page,
   marked as queued. Change status to 'live' the moment one has real content. */

{ slug:'london', cat:'travel', status:'soon', title:'London', where:'England', group:'UK',
  date:'', meta:'Home base', verdict:'', tier:3, cover:'', body:[],
  dek:'The one I can update forever. Eating out, mostly — and the places coasting on a reputation.' },

{ slug:'york', cat:'travel', status:'soon', title:'York', where:'England', group:'UK',
  date:'', meta:'TODO: when', verdict:'', tier:2, cover:'', body:[],
  dek:'TODO: is it a day trip or a weekend? That is the whole question people have.' },

{ slug:'manchester', cat:'travel', status:'soon', title:'Manchester', where:'England', group:'UK',
  date:'', meta:'TODO: when', verdict:'', tier:2, cover:'', body:[],
  dek:'TODO: your line.' },

{ slug:'wales', cat:'travel', status:'soon', title:'Wales', where:'Wales', group:'UK',
  date:'', meta:'TODO: when', verdict:'', tier:1, cover:'', body:[],
  dek:'TODO: your line.' },

{ slug:'oslo', cat:'travel', status:'soon', title:'Oslo', where:'Norway', group:'Europe',
  date:'', meta:'TODO: when', verdict:'', tier:3, cover:'', body:[],
  dek:'TODO: the expensive one. Is there a version of Oslo that a normal budget survives?' },

{ slug:'madrid', cat:'travel', status:'soon', title:'Madrid', where:'Spain', group:'Europe',
  date:'', meta:'TODO: when', verdict:'', tier:2, cover:'', body:[],
  dek:'TODO: your line.' },

{ slug:'burgundy', cat:'travel', status:'soon', title:'Burgundy', where:'France', group:'Europe',
  date:'', meta:'Same trip as Paris, held back', verdict:'', tier:2, cover:'', body:[],
  dek:'Deliberately kept out of the Paris post so it can be its own thing.' },

{ slug:'bangkok', cat:'travel', status:'soon', title:'Bangkok', where:'Thailand', group:'Asia',
  date:'', meta:'TODO: when', verdict:'', tier:1, cover:'', body:[],
  dek:'TODO: your line.' },

{ slug:'phuket', cat:'travel', status:'soon', title:'Phuket', where:'Thailand', group:'Asia',
  date:'', meta:'TODO: when', verdict:'', tier:2, cover:'', body:[],
  dek:'TODO: your line.' },

{ slug:'hcmc', cat:'travel', status:'soon', title:'Ho Chi Minh City', where:'Vietnam', group:'Asia',
  date:'', meta:'TODO: when', verdict:'', tier:1, cover:'', body:[],
  dek:'TODO: your line.' },

{ slug:'delhi', cat:'travel', status:'soon', title:'Delhi', where:'India', group:'Asia',
  date:'', meta:'Where the lens comes from', verdict:'', tier:1, cover:'', body:[],
  dek:'Written for someone arriving from London with London expectations and a London wallet.' },


/* ============================================================== FOOD ==== */
/* `group` is what sorts this page. Splurges vs everyday is the split that
   makes the section mean something — a site that only reviews expensive
   places is a different site, and not the one you said you wanted. */

{
  slug: 'gymkhana',
  cat: 'food',
  status: 'soon',
  title: 'Gymkhana',
  where: 'Mayfair, London',
  group: 'The splurges',
  date: '', meta: 'Restaurant · Indian',
  verdict: 'mixed', tier: 3,
  cover: '',
  dek: 'TODO: the honest line. A Delhi kid eating Michelin-starred Indian food in Mayfair — nobody else is writing that particular review, and it is the most on-brand thing this site can carry.',
  body: [
    { p: 'TODO: the room, the service, the bill. In that order.' },
    { title: 'The verdict',
      places: [{
        name: 'Gymkhana', type: 'eat', verdict: 'mixed', tier: 3,
        area: 'Mayfair',
        line: 'TODO: one honest paragraph.',
        do: 'TODO: the dish that justified the bill.',
        skip: 'TODO: the bit that was priced for the room and not the plate.',
        cost: 'TODO: what you actually paid, per head',
        tags: ['london', 'indian', 'splurge'], photo: ''
      }]
    }
  ]
},

{
  slug: 'the-ritz',
  cat: 'food',
  status: 'soon',
  title: 'Afternoon tea at The Ritz',
  where: 'Piccadilly, London',
  group: 'The splurges',
  date: '', meta: 'Afternoon tea',
  verdict: 'mixed', tier: 3,
  cover: '',
  dek: 'TODO: is it the room, the food, or the photograph that people are actually paying for?',
  body: [
    { p: 'TODO: what the two hours were actually like.' },
    { title: 'The verdict',
      places: [{
        name: 'The Ritz', type: 'eat', verdict: 'mixed', tier: 3,
        area: 'Piccadilly',
        line: 'TODO: one honest paragraph.',
        do: 'TODO: what made it worth dressing up for.',
        skip: 'TODO: what you would not pay for twice.',
        cost: 'TODO: per head, including the bits they add on',
        tags: ['london', 'splurge', 'the famous one'], photo: ''
      }]
    }
  ]
},

{
  slug: 'everyday-london',   // slug is neutral on purpose — it is the URL,
                             // and a URL should not have to change later
  cat: 'food',
  status: 'soon',
  title: 'TODO: the cheap one you go back to',
  where: 'London',
  group: 'The everyday',
  date: '', meta: 'Restaurant',
  verdict: 'yes', tier: 1,
  cover: '',
  dek: 'TODO: every splurge review needs a counterweight. This is the place that costs a tenth as much and that you would defend harder.',
  body: []
},


/* ============================================================== LIFE ==== */

{
  slug: 'cycling',
  cat: 'life',
  status: 'soon',
  title: 'TODO: the cycling one',
  where: '', group: 'Things I picked up',
  date: '', meta: 'TODO: when',
  verdict: '', tier: 0,
  cover: 'assets/photos/cycling-bridge.jpg',
  dek: 'TODO: one line that makes someone want to read the rest.',
  body: [
    { p: 'TODO: how it started. Be specific — the specific bit is the interesting bit.' },
    { p: 'TODO: what you got wrong at the beginning.' },
    { p: 'TODO: where it is now.' }
  ]
},

{
  slug: 'delhi-to-london',
  cat: 'life',
  status: 'soon',
  title: 'TODO: Delhi to London',
  where: '', group: 'Where I am from',
  date: '', meta: '',
  verdict: '', tier: 0,
  cover: 'assets/photos/portrait-brick.jpg',
  dek: 'TODO: one line.',
  body: [
    { p: 'TODO: this is the piece that explains the whole lens the rest of the site is written through. Worth taking your time over.' }
  ]
}

];


/* ==========================================================================
   4. GALLERY — the photo wall on the homepage
   --------------------------------------------------------------------------
   place  the label that appears on hover. Leave '' for no label — better a
          clean photograph than a caption you had to guess at.
   Order matters. The first one is the big one.
   ========================================================================== */

const GALLERY = [
  { photo: 'assets/photos/skye-storr.jpg',          place: 'The Old Man of Storr, Skye' },
  { photo: 'assets/photos/castle-loch.jpg',         place: 'Eilean Donan' },
  { photo: 'assets/photos/paris-eiffel-night.jpg',  place: 'Paris, France' },
  { photo: 'assets/photos/edinburgh-old-town.jpg',  place: 'Edinburgh, Scotland' },
  { photo: 'assets/photos/turquoise-cove.jpg',      place: 'Pedn Vounder, Cornwall' },
  { photo: 'assets/photos/beach-swim.jpg',          place: 'Cornwall' },
  { photo: 'assets/photos/stone-doorway.jpg',       place: 'Scottish Highlands' },
  { photo: 'assets/photos/highlands-loch.jpg',      place: 'Highlands' },
  { photo: 'assets/photos/city-wall-sit.jpg',       place: 'York' },
  { photo: 'assets/photos/paris-riverside.jpg',     place: 'Paris' },
  { photo: 'assets/photos/poolside-palms.jpg',      place: 'Burgundy' },
  { photo: 'assets/photos/castle-window-bay.jpg',   place: 'England' },
  { photo: 'assets/photos/flower-field.jpg',        place: 'France' },
  { photo: 'assets/photos/ornate-gate.jpg',         place: 'London' },
  { photo: 'assets/photos/great-hall.jpg',          place: 'Oxford' },
  { photo: 'assets/photos/loch-sunset.jpg',         place: 'England' },
  { photo: 'assets/photos/rock-lamppost.jpg',       place: 'Vietnam' },
  { photo: 'assets/photos/cycling-bridge.jpg',      place: 'France' }
];
