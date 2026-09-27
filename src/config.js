export const BUSINESS = {
  name: 'Clevra Car Detailing',
  shortName: 'Clevra',
  city: 'Costa Mesa',
  region: 'CA',
  phoneDisplay: '(949) 787-6062',
  phoneHref: 'tel:+19497876062',
  hours: 'Mon–Sun · By appointment',
  email: '',
  source: 'clevra',
  idPrefix: 'CLV-',
  mapQuery: 'Costa+Mesa,+CA',
  serviceArea: ['Costa Mesa', 'Newport Beach', 'Huntington Beach', 'Irvine', 'Fountain Valley', 'Santa Ana', 'Tustin', 'Mesa Verde'],
}

export const PACKAGES = [
  {
    id: 'basic',
    name: 'Basic Detail',
    price: 150,
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

// 7:00 AM – 7:00 PM, 30-minute slots, 7 days a week
export const SLOT_START_MIN = 7 * 60
export const SLOT_END_MIN = 19 * 60
export const SLOT_STEP = 30
export const LEAD_MINUTES = 240 // earliest bookable slot = now (California time) + 4h
export const BOOKING_WINDOW_DAYS = 60

export const WORKER_URL = (import.meta.env.VITE_WORKER_URL || '').replace(/\/$/, '')
export const STRIPE_PK = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || ''
