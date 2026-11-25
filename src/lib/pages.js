// ---------------------------------------------------------------------------
// SEO landing pages. One template renders all of them (src/pages/Landing.jsx);
// head tags and schema come from src/lib/seo.js.
//
// Home targets "Mobile Car Detailing Costa Mesa". Costa Mesa is crowded with same-owner
// sites (Hyper Coat and Imperial Shine are based there; Torque, Power Glow and others have
// Costa Mesa pages, and Hyper Coat uses interior-car-detailing-, car-seat-carpet-shampoo-,
// full-car-detailing- and suv-truck-detailing-costa-mesa). Clevra uses its own service
// wording and /car-detailing-in-<place> for cities and two Costa Mesa neighborhoods, with
// unique copy. The owner is fine with overlap.
//
// Facts: prices, package contents and the confirmed list are in src/config.js.
// Same prices and hours everywhere. The Exterior Wash is never sold on its own.
// ---------------------------------------------------------------------------

const BRANDS = ['Clevra Car Detailing', 'Clevra Detailing', 'Clevra'];

// Longest title that fits in 60 chars (counting '&' as the escaped '&amp;').
export function fitTitle(keyword, place, region = 'CA') {
  const options = [
    ...BRANDS.map((b) => `${keyword} ${place}, ${region} | ${b}`),
    ...BRANDS.map((b) => `${keyword} ${place} | ${b}`),
  ];
  const len = (t) => t.replace(/&/g, '&amp;').length;
  return options.find((t) => len(t) <= 60) || options[options.length - 1];
}

export const HOME_CITY = 'Costa Mesa';

// Schema offers: only what a customer can book. The wash never appears alone.
const DETAIL_OFFERS = [
  ['Basic Detail', 150],
  ['Premium Detail', 200],
  ['Basic Detail + Exterior Wash', 200],
  ['Premium Detail + Exterior Wash', 250],
];
const PREMIUM_OFFERS = [
  ['Premium Detail', 200],
  ['Premium Detail + Exterior Wash', 250],
];
const WASH_OFFERS = [
  ['Basic Detail + Exterior Wash', 200],
  ['Premium Detail + Exterior Wash', 250],
];

const PHOTO = {
  sedan: { src: '/images/black-sedan.webp', alt: 'Black sedan with a deep gloss finish after a detail' },
  brush: { src: '/images/interior-brush.webp', alt: 'Detailer brushing foam into a center console' },
  seat: { src: '/images/seat-extraction.webp', alt: 'Extraction tool lifting dirt from a cloth seat' },
  foam: { src: '/images/foam-wash.webp', alt: 'Car covered in snow foam during a hand wash' },
  gloss: { src: '/images/blue-gloss.webp', alt: 'Blue car with a reflective, freshly washed finish' },
};

const FAQ_SIZE = { q: 'Does an SUV or truck cost more?', a: 'No. Cars, SUVs, trucks and minivans all pay the same price.' };
const FAQ_WATER = { q: 'Do you need my water or an outlet?', a: 'No. We bring our own water and power.' };
const FAQ_WASH = { q: 'Can I book only the exterior wash?', a: 'No. The Exterior Wash is a $50 add-on to the Basic or Premium Detail.' };
const FAQ_GUARANTEE = { q: 'What if something is not right?', a: 'Tell us. Every detail is backed by our satisfaction guarantee, and we will make it right.' };
const FAQ_PAY = { q: 'Do I pay when I book?', a: 'No. Pay when the job is done, or prepay online with code PREPAY for $15 off.' };
const FAQ_TIME = { q: 'How long does a detail take?', a: 'A Basic Detail usually takes 2 to 3 hours and a Premium Detail 4 to 6 hours, depending on the car.' };
const FAQ_ECO = { q: 'What products do you use?', a: 'Eco-friendly detailing products.' };

export const SERVICE_PAGES = [
  {
    path: '/interior-car-cleaning-costa-mesa',
    nav: 'Interior cleaning',
    city: HOME_CITY,
    title: fitTitle('Interior Car Cleaning', HOME_CITY),
    description: 'Interior car cleaning in Costa Mesa, CA: Basic Detail $150 or Premium Detail $200 with extraction and shampoo. Mobile, own water and power, every day.',
    eyebrow: 'Interior cleaning · Costa Mesa, CA',
    h1: ['Interior car cleaning', 'in Costa Mesa.'],
    lede: 'Sand from the beach, crumbs in the console and dust in every vent. We clean the cabin piece by piece in your driveway or office lot.',
    facts: ['From $150', 'Own water & power', 'Every day 8–5'],
    card: 'premium',
    pkg: 'basic',
    photo: PHOTO.brush,
    intro: {
      h2: 'Two levels of interior clean.',
      paras: [
        'Both packages open with triple-stage vacuuming: three passes for the sand and grit that settle under the seats, in the seat rails and deep in the carpet.',
        'The $150 Basic Detail adds a complete wipe-down of every interior surface and floor mats cleaned and restored. Plan on about 2 to 3 hours.',
        'The $200 Premium Detail takes about 4 to 6 hours and adds dust elimination, interior windows, deep carpet cleaning, cloth and carpet extraction, full interior shampooing and a UV-protectant coating.',
      ],
    },
    pointsTitle: 'Why Costa Mesa drivers book a Clevra interior',
    points: [
      { title: 'Done where you park', text: 'Home, office or apartment lot, with nothing for you to set up.' },
      { title: 'Eco-friendly products', text: 'We clean with eco-friendly detailing products.' },
      { title: 'Satisfaction guarantee', text: 'If something is not right, tell us and we will make it right.' },
    ],
    faqs: [
      { q: 'Basic or Premium?', a: 'The Basic Detail for a lived-in car without stains. The Premium Detail when seats or carpets need extraction and shampoo.' },
      FAQ_TIME,
      FAQ_SIZE,
      FAQ_ECO,
      FAQ_PAY,
    ],
    service: { type: 'Interior car cleaning', offers: DETAIL_OFFERS },
  },
  {
    path: '/upholstery-shampoo-costa-mesa',
    nav: 'Upholstery shampoo',
    city: HOME_CITY,
    title: fitTitle('Car Upholstery Shampoo', HOME_CITY),
    description: 'Car upholstery and carpet shampoo with extraction in Costa Mesa, CA, part of the $200 Premium Detail. We come to you. Same price for any vehicle.',
    eyebrow: 'Shampoo & extraction · Costa Mesa, CA',
    h1: ['Car upholstery shampoo', 'in Costa Mesa.'],
    lede: 'Spilled coffee, sunscreen and wet beach towels soak into cloth seats. Shampoo with extraction draws the dirt out of the fabric instead of spreading it around.',
    facts: ['$200 Premium Detail', 'Any vehicle size', 'Every day 8–5'],
    card: 'premium',
    pkg: 'premium',
    photo: PHOTO.seat,
    intro: {
      h2: 'Vacuum first, then extract.',
      paras: [
        'Upholstery and carpet shampoo is part of the Premium Detail. Three vacuum passes come first so loose grit is out before any water touches the fabric.',
        'Cloth seats and carpets are then shampooed and extracted, which rinses the fibers and pulls the dirty water back out. Deep carpet cleaning, interior windows, dust elimination and a UV-protectant coating finish the cabin.',
        'Most everyday spills and dirt come out. Old set-in stains, ink or dye transfer may lighten rather than disappear.',
      ],
    },
    pointsTitle: 'Good to know before you book',
    points: [
      { title: 'One price', text: '$200 for a hatchback or a three-row SUV.' },
      { title: '4 to 6 hours', text: 'The usual time for a Premium Detail.' },
      { title: 'Add the outside', text: 'The $50 Exterior Wash makes it $250 inside and out.' },
    ],
    faqs: [
      { q: 'Is upholstery shampoo in the Basic Detail?', a: 'No. Shampoo and extraction come with the Premium Detail ($200). The Basic Detail is vacuuming, a full wipe-down and floor mats.' },
      { q: 'Will every stain come out?', a: 'Most everyday stains do. Old set-in stains, ink or dye transfer may only lighten.' },
      FAQ_SIZE,
      FAQ_WATER,
      FAQ_GUARANTEE,
    ],
    service: { type: 'Car upholstery and carpet shampoo', offers: PREMIUM_OFFERS },
  },
  {
    path: '/wash-and-interior-detail-costa-mesa',
    nav: 'Wash & interior detail',
    city: HOME_CITY,
    title: fitTitle('Car Wash & Interior Detail', HOME_CITY),
    description: 'Car wash and interior detail in Costa Mesa, CA: a $150 or $200 detail plus the $50 exterior hand wash. Mobile, with our own water and power.',
    eyebrow: 'Inside & out · Costa Mesa, CA',
    h1: ['Car wash & interior detail', 'in Costa Mesa.'],
    lede: 'The whole car in one visit: we detail the interior first, then foam, hand wash and hand dry the outside right where it is parked.',
    facts: ['From $200', 'Hand wash & dry', 'Own water & power'],
    card: 'combo',
    pkg: 'premium',
    photo: PHOTO.foam,
    intro: {
      h2: 'Interior first, then the wash.',
      paras: [
        'The Exterior Wash is an add-on, so every visit starts with the Basic Detail ($150) or the Premium Detail ($200) inside the car.',
        'For $50 more we hand wash the outside, clean the rims in detail, scrub and degrease the tires, wipe the door jambs and panels, add tire shine and hand dry the paint so it dries without spots.',
        'That is $200 with the Basic Detail or $250 with the Premium Detail. We bring our own water and power.',
      ],
    },
    pointsTitle: 'The whole car, one visit',
    points: [
      { title: 'Snow foam & hand wash', text: 'Plus detailed rims and a spot-free hand dry.' },
      { title: 'Self-contained', text: 'Our own water and power, at your Costa Mesa address.' },
      { title: '$15 off online', text: 'Use code PREPAY at checkout, or pay when the job is done.' },
    ],
    faqs: [
      { q: 'How much is inside and out?', a: '$200 for the Basic Detail with the Exterior Wash, or $250 for the Premium Detail with the Exterior Wash.' },
      FAQ_WASH,
      FAQ_WATER,
      FAQ_ECO,
      FAQ_PAY,
    ],
    service: { type: 'Interior detail and exterior hand wash', offers: WASH_OFFERS },
  },
  {
    path: '/car-detailing-prices-costa-mesa',
    nav: 'Prices',
    city: HOME_CITY,
    title: fitTitle('Car Detailing Prices', HOME_CITY),
    description: 'Car detailing prices in Costa Mesa, CA: Basic Detail $150, Premium Detail $200, Exterior Wash add-on $50. Same price for any car, SUV or truck.',
    eyebrow: 'Prices · Costa Mesa, CA',
    h1: ['Car detailing prices', 'in Costa Mesa.'],
    lede: 'Posted prices that stay the same whatever you drive. Here is what each package costs, covers and how long it usually takes.',
    facts: ['Basic $150', 'Premium $200', 'Wash add-on $50'],
    card: 'premium',
    pkg: 'premium',
    photo: PHOTO.sedan,
    intro: {
      h2: 'The price list, in full.',
      paras: [
        'Basic Detail, $150, about 2 to 3 hours: triple-stage vacuuming for deep debris, a complete interior surface wipe-down, and floor mats cleaned and restored.',
        'Premium Detail, $200, about 4 to 6 hours: triple-stage vacuuming plus cabin application, dust elimination, interior windows, deep carpet cleaning, cloth and carpet extraction, full interior shampooing and a UV-protectant coating.',
        'Exterior Wash, +$50 on either detail: hand wash, detailed rims, tire scrub and degrease, door jambs and panels, tire shine and a spot-free hand dry. Code PREPAY takes $15 off online.',
      ],
    },
    pointsTitle: 'No surprise upcharges',
    points: [
      { title: 'Any vehicle, one price', text: 'A coupe and a pickup pay the same.' },
      { title: 'Visit included', text: 'The price includes coming to your address.' },
      { title: 'Pay now or later', text: 'Prepay online for $15 off, or pay when the job is done.' },
    ],
    faqs: [
      { q: 'What does the most complete visit cost?', a: '$250 for the Premium Detail with the Exterior Wash, or $235 if you prepay online with code PREPAY.' },
      FAQ_SIZE,
      FAQ_TIME,
      FAQ_WASH,
      FAQ_GUARANTEE,
    ],
    service: { type: 'Auto detailing', offers: DETAIL_OFFERS },
  },
];

// City and neighborhood pages: same packages, prices and hours; local wording.
// `schemaCity` is the city used in the schema (a neighborhood's own city).
function placePage({ slug, place, schemaCity, regionLabel = 'CA', areas, lede, paras, photo, faq }) {
  const where = schemaCity && schemaCity !== place ? `${place}, ${schemaCity}` : `${place}, CA`;
  return {
    path: `/car-detailing-in-${slug}`,
    nav: place,
    city: place,
    schemaCity: schemaCity || place,
    isCity: true,
    title: fitTitle('Car Detailing in', place, regionLabel),
    description: `Mobile car detailing in ${where} by Clevra. Details $150 and $200, $50 hand wash add-on, same price any car. Every day 8 AM to 5 PM.`,
    eyebrow: `Mobile detailing · ${where}`,
    h1: ['Car detailing', `in ${place}.`],
    lede,
    facts: ['From $150', 'Own water & power', 'Every day 8–5'],
    card: 'combo',
    pkg: 'premium',
    photo,
    areas,
    mapQuery: where,
    intro: { h2: `We come to you in ${place}.`, paras },
    pointsTitle: `Why ${place} drivers book Clevra`,
    points: [
      { title: 'Costa Mesa prices', text: 'The same $150 and $200 details and $50 wash add-on, for any vehicle.' },
      { title: 'Self-contained', text: 'We bring our own water and power, so there is nothing to hook up.' },
      { title: 'Satisfaction guarantee', text: 'If something is not right, tell us and we will make it right.' },
    ],
    faqs: [
      { q: `Do you come to ${place}?`, a: `Yes. We detail cars at homes and workplaces across ${place}, including ${areas.slice(0, 3).join(', ')}.` },
      faq,
      FAQ_SIZE,
      FAQ_WATER,
      FAQ_WASH,
    ],
    service: { type: 'Mobile car detailing', offers: DETAIL_OFFERS },
  };
}

export const CITY_PAGES = [
  placePage({
    slug: 'newport-beach',
    place: 'Newport Beach',
    areas: ['Newport Heights', 'Eastbluff', 'Balboa Peninsula', 'Corona del Mar', 'Newport Coast'],
    lede: 'Newport Beach borders Costa Mesa to the south. Salt air and beach sand get into every car there, and we bring the full detail to your driveway.',
    paras: [
      'We work across Newport Beach, from Newport Heights and Eastbluff to the Balboa Peninsula, Corona del Mar and Newport Coast.',
      'Pick the $150 Basic Detail for three vacuum passes, a full wipe-down and clean floor mats, or the $200 Premium Detail when seats and carpets need extraction and shampoo.',
      'Add the $50 Exterior Wash to rinse off the salt air with a hand wash and spot-free dry. Start times run every day from 8 AM to 5 PM.',
    ],
    photo: PHOTO.gloss,
    faq: { q: 'Is Newport Beach the same price as Costa Mesa?', a: 'Yes. Same packages, same prices and the same hours.' },
  }),
  placePage({
    slug: 'huntington-beach',
    place: 'Huntington Beach',
    areas: ['Huntington Harbour', 'Downtown Huntington Beach', 'Seacliff', 'Bolsa Chica', 'Huntington Beach Central Park'],
    lede: 'Huntington Beach borders Costa Mesa across the Santa Ana River. Book a detail and we set up wherever the car is parked.',
    paras: [
      'We detail cars throughout Huntington Beach, from Huntington Harbour and downtown to Seacliff, Bolsa Chica and the neighborhoods around Central Park.',
      'The Basic Detail ($150, usually 2 to 3 hours) covers vacuuming, a full wipe-down and floor mats. The Premium Detail ($200, usually 4 to 6 hours) adds deep carpet cleaning, extraction, shampoo and UV protection.',
      'There is no extra charge for an SUV, truck or minivan, and code PREPAY takes $15 off online.',
    ],
    photo: PHOTO.foam,
    faq: { q: 'Can you detail my car at work in Huntington Beach?', a: 'Yes. Enter the work address when you book; we only need room around the car to open the doors.' },
  }),
  placePage({
    slug: 'irvine',
    place: 'Irvine',
    areas: ['University Park', 'Turtle Rock', 'Woodbridge', 'the Irvine Business Complex', 'Westpark'],
    lede: 'Irvine is just east of Costa Mesa. We detail cars at homes, apartment communities and office parks all over the city.',
    paras: [
      'We come to Irvine homes and workplaces, from Westpark, Woodbridge and University Park to Turtle Rock and the offices of the Irvine Business Complex.',
      'Book the $150 Basic Detail or the $200 Premium Detail, which adds full shampoo and cloth and carpet extraction to the interior.',
      'Want the outside done too? The $50 Exterior Wash adds a hand wash, detailed rims, tire shine and a spot-free hand dry.',
    ],
    photo: PHOTO.sedan,
    faq: { q: 'Can you work in my apartment or office parking lot?', a: 'We bring our own water and power, so we only need access to the car. Check any building or HOA rules on car washing first.' },
  }),
  placePage({
    slug: 'santa-ana',
    place: 'Santa Ana',
    areas: ['South Coast Metro', 'Floral Park', 'Downtown Santa Ana', 'Park Santiago', 'Riverview West'],
    lede: 'Santa Ana sits right on Costa Mesa’s northern edge. We bring the same interior details, and the hand wash if you want it, to your address there.',
    paras: [
      'We detail cars across Santa Ana, from South Coast Metro and Riverview West to Floral Park, Park Santiago and downtown.',
      'Choose the $150 Basic Detail or the $200 Premium Detail with deep carpet cleaning, extraction, full shampoo and a UV-protectant coating.',
      'Add the $50 Exterior Wash for the outside. Pay online with code PREPAY for $15 off, or pay when the job is done.',
    ],
    photo: PHOTO.brush,
    faq: { q: 'How much is inside and out in Santa Ana?', a: '$250 for the Premium Detail with the Exterior Wash, or $200 for the Basic Detail with the Exterior Wash.' },
  }),
  placePage({
    slug: 'fountain-valley',
    place: 'Fountain Valley',
    areas: ['Mile Square Park', 'Brookhurst Street', 'Talbert Avenue', 'Warner Avenue', 'Euclid Street'],
    lede: 'Fountain Valley is just west of Costa Mesa. Book online and we detail the car at your home or office there.',
    paras: [
      'We work across Fountain Valley, from the homes around Mile Square Park to the neighborhoods off Brookhurst Street, Talbert Avenue, Warner Avenue and Euclid Street.',
      'The $150 Basic Detail gives the cabin three vacuum passes, a full wipe-down and clean floor mats. The $200 Premium Detail adds shampoo, extraction and a UV-protectant coating.',
      'Same price for any vehicle size, and start times every day from 8 AM to 5 PM.',
    ],
    photo: PHOTO.seat,
    faq: { q: 'Do you charge more to come to Fountain Valley?', a: 'No. Fountain Valley pays the same prices as Costa Mesa.' },
  }),
  placePage({
    slug: 'tustin',
    place: 'Tustin',
    areas: ['Old Town Tustin', 'Tustin Legacy', 'Tustin Ranch', 'the Tustin Market Place area', 'Red Hill Avenue'],
    lede: 'Tustin is a short drive northeast of Costa Mesa. We bring the full detail to your driveway or work lot there.',
    paras: [
      'We detail cars throughout Tustin, from Old Town and the homes along Red Hill Avenue to Tustin Legacy, Tustin Ranch and the Market Place area.',
      'Pick the $150 Basic Detail or the $200 Premium Detail when seats and carpets need extraction and shampoo.',
      'The $50 Exterior Wash adds a hand wash, rims, tire shine and a spot-free dry. We bring our own water and power.',
    ],
    photo: PHOTO.gloss,
    faq: { q: 'Can I book a weekend in Tustin?', a: 'Yes. We work every day of the week, with start times from 8 AM to 5 PM.' },
  }),
  placePage({
    slug: 'mesa-verde',
    place: 'Mesa Verde',
    schemaCity: 'Costa Mesa',
    regionLabel: 'Costa Mesa',
    areas: ['the Mesa Verde Country Club area', 'Adams Avenue', 'Harbor Boulevard', 'Placentia Avenue', 'Gisler Avenue'],
    lede: 'Mesa Verde is Costa Mesa’s northwest neighborhood. We detail cars right at home there, with our own water and power.',
    paras: [
      'We work all through Mesa Verde, from the streets around the country club to the homes off Adams Avenue, Harbor Boulevard, Placentia Avenue and Gisler Avenue.',
      'Choose the $150 Basic Detail or the $200 Premium Detail with deep carpet cleaning, extraction, full shampoo and a UV-protectant coating.',
      'Add the $50 Exterior Wash for a hand wash and spot-free dry. Start times run every day from 8 AM to 5 PM.',
    ],
    photo: PHOTO.sedan,
    faq: { q: 'Is Mesa Verde part of your Costa Mesa service area?', a: 'Yes. Mesa Verde is in Costa Mesa, so it gets the same prices and hours.' },
  }),
  placePage({
    slug: 'eastside-costa-mesa',
    place: 'Eastside Costa Mesa',
    schemaCity: 'Costa Mesa',
    regionLabel: 'CA',
    areas: ['the 19th Street area', 'Irvine Avenue', 'Santa Ana Avenue', 'Mesa Del Mar', 'the Back Bay edge'],
    lede: 'Costa Mesa’s Eastside sits between Newport Boulevard and the Back Bay. We detail cars at homes and apartments all over the neighborhood.',
    paras: [
      'We come to the Eastside, from the 19th Street area and Mesa Del Mar to the streets off Irvine Avenue and Santa Ana Avenue near the Back Bay.',
      'The Basic Detail ($150) covers vacuuming, a full wipe-down and floor mats. The Premium Detail ($200) adds deep carpet cleaning, extraction, shampoo and UV protection.',
      'There is no extra charge for an SUV, truck or minivan, and code PREPAY takes $15 off online.',
    ],
    photo: PHOTO.foam,
    faq: { q: 'Do you need a driveway on the Eastside?', a: 'No. Street parking works too, as long as we can reach all sides of the car.' },
  }),
];

export const LANDING_PAGES = [...SERVICE_PAGES, ...CITY_PAGES];

export function findLanding(path) {
  return LANDING_PAGES.find((p) => p.path === path);
}
