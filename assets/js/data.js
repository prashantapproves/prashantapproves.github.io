/* ==========================================================================
   prashantapproves.com — CONTENT FILE
   This is the only file you need to edit to add or change content.
   ==========================================================================

   THE HONESTY RULE (baked into this file on purpose)
   --------------------------------------------------
   Any text you write starting with "TODO:" renders on the site in a visible
   yellow draft style, and the whole city gets a "draft" banner. It is
   physically hard to publish a place you didn't visit or a price you didn't
   pay. Delete every TODO before you flip a city to status:'live'.

   HOW TO ADD A CITY
   -----------------
   Copy any block below, change the slug, done. Nothing else to touch.

   FIELD REFERENCE
   ---------------
   status   'live'  = full guide, shows on the site
            'soon'  = card shows in the picker, marked as in the queue
   verdict  'yes' (WORTH IT) | 'mixed' (MIXED) | 'no' (SKIP)
   tier     1, 2 or 3  ->  renders as £ / ££ / £££
   type     'eat' | 'stay' | 'do'
   tags     any words. 'queer-friendly' and 'veg' get special styling.
   photo    put your image in assets/photos/ then write 'assets/photos/x.jpg'
            leave as '' and it renders a nice patterned placeholder
   ========================================================================== */

const SITE = {
  handle: 'prashantapproves',
  instagram: 'https://instagram.com/prashantapproves',
  tagline: 'Honest travel and eating-out reviews. Budget-first. Delhi → London.'
};

const CITIES = [

/* ==========================================================================
   PARIS — the flagship. Built from your 5-day May 2026 carousel.
   Only the verdicts you actually made are filled in. The named
   restaurants/hotels are TODO because I wasn't going to invent them.
   ========================================================================== */
{
  slug: 'paris',
  name: 'Paris',
  country: 'France',
  status: 'live',
  verdict: 'yes',
  tier: 2,
  nights: '5 days · May 2026',
  tagline: 'Worth it — but not for the reasons the internet keeps telling you. The tower is the weakest day of the trip.',

  intro: 'Five days, done on a middle budget, from London. Below is what I actually did, what I actually paid, and the two things I would not do again. The Schengen visa is in the budget because it is a real cost of this trip for an Indian passport and almost no Paris guide includes it.',

  facts: [
    { label: 'Trip length',   value: '5 days, 4 nights' },
    { label: 'When I went',   value: 'May 2026' },
    { label: 'Cost, as I did it', value: '~£1,100' },
    { label: 'Cost, leaner',  value: '~£760' }
  ],

  places: [

    /* ---- the contrarian calls. These are real and they carry the page. ---- */
    {
      name: 'The Eiffel Tower',
      type: 'do',
      verdict: 'no',
      tier: 2,
      area: '7th arrondissement',
      line: 'The single most oversold thing in Paris. You queue, you pay, you go up, and the view is of a city with its best landmark missing from it — because you are standing in it.',
      do: 'See it from the ground, at distance, for free. It is genuinely beautiful from across the river and that is the version worth your evening.',
      skip: 'Going up. The time and money buy you less than almost anything else in this city.',
      cost: 'Free from the ground',
      tags: ['overrated', 'free from outside'],
      photo: ''
    },
    {
      name: 'Foie gras',
      type: 'eat',
      verdict: 'no',
      tier: 3,
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
      type: 'do',
      verdict: 'mixed',
      tier: 2,
      area: 'City-wide',
      line: 'The maths matters here and nobody does it for you. I did three sites and came in under the price of the pass — so it lost me money.',
      do: 'Count your sites honestly before you buy. It only starts paying off at four or more. Four is more museums than most people genuinely want in a short trip.',
      skip: 'Buying it for the queue-skipping. It does not skip queues — every site still needs a timed entry slot booked in advance, pass or no pass.',
      cost: 'Worth it from 4+ sites',
      tags: ['do the maths'],
      photo: ''
    },
    {
      name: 'The Schengen visa',
      type: 'do',
      verdict: 'mixed',
      tier: 1,
      area: 'Before you go',
      line: 'Not a place, but it is the line item every other Paris budget guide leaves out — and if you are travelling on an Indian passport it is the first £120 of your trip before you have eaten anything.',
      do: 'Build it into the trip cost from day one. It changes whether a short Paris break is actually cheaper than a week somewhere visa-free.',
      skip: 'Reading any budget guide that does not mention it. It was not written for you.',
      cost: '£120',
      tags: ['indian passport', 'the hidden cost'],
      photo: ''
    },

    /* ---- your slots. Fill from the carousel + your camera roll. ---- */
    {
      name: 'TODO: where you stayed',
      type: 'stay',
      verdict: 'mixed',
      tier: 2,
      area: 'TODO: neighbourhood',
      line: 'TODO: one honest line on the place — what it actually felt like to stay there.',
      do: 'TODO: the one thing that made it worth booking.',
      skip: 'TODO: the thing you would warn someone about.',
      cost: 'TODO: per night, what you paid',
      tags: [],
      photo: ''
    },
    {
      name: 'TODO: the meal that was worth it',
      type: 'eat',
      verdict: 'yes',
      tier: 2,
      area: 'TODO: neighbourhood',
      line: 'TODO: why this one earned its money.',
      do: 'TODO: order this.',
      skip: 'TODO: skip this.',
      cost: 'TODO: what you paid',
      tags: [],
      photo: ''
    },
    {
      name: 'TODO: the thing you would do again',
      type: 'do',
      verdict: 'yes',
      tier: 1,
      area: 'TODO: neighbourhood',
      line: 'TODO: the honest case for it.',
      do: 'TODO: the version of it worth doing.',
      skip: 'TODO: the version that wastes your morning.',
      cost: 'TODO: what you paid',
      tags: [],
      photo: ''
    }
  ],

  itinerary: [
    { no: 'Day 1', title: 'TODO: name the day',
      stops: [
        { time: 'TODO: 09:00', text: 'TODO: pull this straight off your Getting Around slide.' },
        { time: 'TODO: 13:00', text: 'TODO: where you ate and what it cost.' },
        { time: 'TODO: 19:00', text: 'TODO: the evening.' }
      ] },
    { no: 'Day 2', title: 'TODO: name the day',
      stops: [
        { time: 'TODO: 09:00', text: 'TODO: morning.' },
        { time: 'TODO: 15:00', text: 'TODO: afternoon.' }
      ] }
  ],

  /* Two columns, on purpose. "As I did it" and "leaner" are both real
     scenarios. Never one invented total. */
  budget: {
    note: 'Accommodation and food are planning estimates, clearly marked — not receipts. Everything else is what I actually paid.',
    cols: ['As I did it', 'Leaner'],
    rows: [
      { label: 'Schengen visa',          a: '£120',  b: '£120',  real: true },
      { label: 'TODO: Eurostar / travel', a: 'TODO', b: 'TODO' },
      { label: 'TODO: Accommodation, 4 nights', a: 'TODO', b: 'TODO', est: true },
      { label: 'TODO: Food',             a: 'TODO',  b: 'TODO', est: true },
      { label: 'TODO: Getting around',   a: 'TODO',  b: 'TODO' },
      { label: 'TODO: Sights',           a: 'TODO',  b: 'TODO' }
    ],
    total: { a: '~£1,100', b: '~£760' }
  },

  tip: 'Book every timed entry slot before you leave London. The Museum Pass does not do it for you, and the good slots are gone by the time you are standing outside deciding.',

  music: 'Françoise Hardy — Le Temps de l\'Amour. Yann Tiersen if you want it instrumental.',

  refs: [
    { label: 'The full 8-slide carousel', url: 'https://instagram.com/prashantapproves' }
  ]
},

/* ========================================================================== */
{
  slug: 'burgundy',
  name: 'Burgundy',
  country: 'France',
  status: 'soon',
  tier: 2,
  nights: 'Same trip, held back',
  tagline: 'Deliberately kept out of the Paris post so it can be its own thing. Next in the queue.',
  places: [], itinerary: [], refs: []
},

/* ========================================================================== */
{
  slug: 'london',
  name: 'London',
  country: 'United Kingdom',
  status: 'soon',
  tier: 3,
  nights: 'Home base',
  tagline: 'The one I can update forever. Eating out, mostly — and the places that are coasting on a reputation.',
  places: [], itinerary: [], refs: []
},

/* ========================================================================== */
{
  slug: 'delhi',
  name: 'Delhi',
  country: 'India',
  status: 'soon',
  tier: 1,
  nights: 'Where the lens comes from',
  tagline: 'Written for someone arriving from London with London expectations and a London wallet.',
  places: [], itinerary: [], refs: []
}

];
