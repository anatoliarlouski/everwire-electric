/**
 * Contact information constants
 * Single source of truth for all contact details
 */

export const CONTACT = {
  phone: {
    display: '(847) 418-1171',
    tel: '+1-847-418-1171',
  },
  email: 'everwirepro@gmail.com',
  location: {
    region: 'Northwest Suburbs of Chicago',
    full: 'Northwest Suburbs of Chicago',
    // city: 'Mundelein',
    // state: 'IL',
    // zipCode: '60060',
    // country: 'US',
    streetAddress: 'Serving Northwest Chicago Suburbs',
  },
  hours: {
    weekday: 'Mon-Fri: 8:00 AM-8:00 PM',
    saturday: 'Sat: 8:00 AM - 4:00 PM',
    sunday: 'Sun: Emergency calls only',
    emergency: '24/7 Emergency Service',
  },
  coordinates: {
    lat: 42.0883,
    lng: -87.9806,
  },
  serviceRadius: 50000, // meters (50km)
} as const

/**
 * Social profiles. Leave a value empty to hide its icon/link everywhere.
 * The old profiles carried the previous brand name, so they are not linked.
 */
export const SOCIAL = {
  facebook: '',
  instagram: '',
} as const
