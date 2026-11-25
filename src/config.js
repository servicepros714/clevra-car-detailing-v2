// Clevra Car Detailing Costa Mesa — business facts, prices, FAQ and reviews.
//
// Confirmed facts (owner, Nov 2026): mobile only, we bring our own water and power,
// every day with start times 8 AM - 5 PM, Basic Detail usually 2-3 hours and Premium
// Detail 4-6 hours, satisfaction guarantee, same price for every vehicle size,
// eco-friendly products, prepay online with code PREPAY for $15 off. Same prices and
// hours in the nearby cities.
// NOT confirmed, so never claimed: ratings, "professional-grade equipment", walk-around
// checks, years in business, insurance, headlight restoration or paint work (not offered).

// Canonical domain (no www; www redirects to it).
export const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://clevracardetailingcostamesa.site').replace(/\/$/, '')

// Google Business Profile, used in the schema (sameAs). Leave '' until known.
export const GOOGLE_PROFILE_URL = 'https://www.google.com/search?kgmid=/g/11msg57ftz&q=Clevra+Car+Detailing'

// Shown above the reviews (not in the schema). Update together with the profile.
export const GOOGLE_RATING = { value: '5.0', count: 34, asOf: 'Nov 2026' }

export const BUSINESS = {
  name: 'Clevra Car Detailing',
  shortName: 'Clevra',
  city: 'Costa Mesa',
  region: 'CA',
  phoneDisplay: '(949) 787-6062',
  phoneHref: 'tel:+19497876062',
  phoneSchema: '+1-949-787-6062',
  hours: 'Every day, 8 AM – 5 PM',
  email: '',
  source: 'clevra-costa-mesa', // must match worker/worker.js
  idPrefix: 'CLV-',
  mapQuery: 'Costa+Mesa,+CA',
  // Costa Mesa landmarks named on the home page; nearby cities with pages are in src/lib/pages.js.
  homeAreas: ['South Coast Plaza', 'the Triangle', 'Westside Costa Mesa', 'College Park', 'Fairview Park', 'the OC Fair & Event Center area'],
}

export const PACKAGES = [
  {
    id: 'basic',
    name: 'Basic Detail',
    price: 150,
    duration: '2–3 hours',
    tag: 'Interior refresh',
    blurb: 'A thorough interior reset for daily drivers that need a clean slate.',
    features: [
      'Triple-Stage Vacuuming for Deep Debris Removal',
      'Complete Interior Surface Wipe-Down',
      'Floor Mat Cleaning & Restoration',
    ],
  },
  {
    id: 'premium',
    name: 'Premium Detail',
    price: 200,
    duration: '4–6 hours',
    tag: 'Most requested',
    featured: true,
    blurb: 'Full extraction and shampoo — the deep clean that brings a cabin back.',
    features: [
      'Triple-Stage Vacuuming',
      'Cabin Application',
      'Dust Elimination',
      'Interior Window Cleaning',
      'Deep Carpet Cleaning',
      'Cloth & Carpet Extraction',
      'Full Interior Shampooing',
      'UV-Protectant Coating',
    ],
  },
]

export const ADDON = {
  id: 'exterior',
  name: 'Exterior Wash',
  price: 50,
  features: [
    'Hand-Washed Exterior',
    'Detailed Rim Cleaning',
    'Tire Scrub and Degrease',
    'Door Jamb & Panel Wipe-Down',
    'Premium Tire Shine Application',
    'Spot-Free Hand Drying',
  ],
}

export const PREPAY = { code: 'PREPAY', amount: 15 }

// Start times 8:00 AM – 5:00 PM, every 30 minutes, 7 days a week (must match worker/worker.js)
export const SLOT_START_MIN = 8 * 60
export const SLOT_END_MIN = 17 * 60
export const SLOT_STEP = 30
export const LEAD_MINUTES = 240 // earliest bookable slot = now (California time) + 4h
export const BOOKING_WINDOW_DAYS = 60

export const WORKER_URL = (import.meta.env.VITE_WORKER_URL || '').replace(/\/$/, '')
export const STRIPE_PK = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || ''

// Real Google reviews only, as { name: 'First L.', text: '...' } (first name + last initial,
// typos fixed; leave out reviews that read like a shop visit). The section and its menu
// link stay hidden while this is empty.
// From the Google profile, Nov 2026 (all 5 stars). Left out: "Danny boy" (no real name).
export const REVIEWS = [
  { name: 'Chase C.', text: 'Details all my cars. Does a great job.' },
  { name: 'Teodoro F.', text: 'Great experience. Good job.' },
  { name: 'John D.', text: 'Nice job!!!' },
  { name: 'Ethan M.', text: 'Great job!' },
  { name: 'Shayne B.', text: 'Nice job.' },
  { name: 'Bryand H.', text: 'Great job.' },
  { name: 'Trung V.', text: 'Great job.' },
  { name: 'Albert T.', text: 'Nice job.' },
  { name: 'Marcus A.', text: 'Great job.' },
]

// Home page FAQ. Shown on the page and used for the FAQPage schema, so keep both in sync.
export const FAQS = [
  { q: 'Do you come to me?', a: 'Yes. Clevra is mobile only. We detail your car at your home, office or apartment lot in Costa Mesa and the nearby cities.' },
  { q: 'Do you need my water or power?', a: 'No. We bring our own water and power, so all we need is room to work around the car.' },
  { q: 'What is the difference between Basic and Premium?', a: 'The Basic Detail ($150, usually 2 to 3 hours) is a triple-stage vacuum, a full surface wipe-down and floor mat restoration. The Premium Detail ($200, usually 4 to 6 hours) adds dust elimination, interior glass, deep carpet cleaning, cloth and carpet extraction, full shampoo and a UV-protectant coating.' },
  { q: 'Does an SUV or truck cost more?', a: 'No. Cars, SUVs, trucks and minivans all pay the same price.' },
  { q: 'Can I book only the exterior wash?', a: 'No. The Exterior Wash is a $50 add-on to the Basic or Premium Detail: hand wash, rims, tires, door jambs and a spot-free hand dry.' },
  { q: 'What products do you use?', a: 'Eco-friendly detailing products.' },
  { q: 'When can I book?', a: 'Every day, with start times every 30 minutes from 8 AM to 5 PM. Same-day bookings need at least 4 hours notice.' },
  { q: 'Do I have to pay online?', a: 'No. Prepay online and save $15 with code PREPAY, or choose to pay later when the job is done.' },
  { q: 'What if I am not happy with the result?', a: 'Tell us. Every detail is backed by our satisfaction guarantee, and we will make it right.' },
  { q: 'How do I reschedule?', a: 'Call (949) 787-6062 and we will move your appointment to a new time.' },
]
