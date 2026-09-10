/**
 * Business information constants
 * Single source of truth for business metadata
 */

export const BUSINESS = {
  name: 'Everwire Electric',
  alternateName: 'Everwire',
  // TODO: confirm the production domain. everwireelectric.com is taken from the brand board mockup.
  url: 'https://everwireelectric.com',
  founded: 2009,
  description: 'Expert licensed electrical services for homes & businesses in Northwest Chicago Suburbs. 24/7 emergency repairs, wiring upgrades, panel services & more. Free estimates!',
  tagline: 'Professional Electrical Solutions You Can Trust',
  seoTitle: 'Professional Electrical Services in Northwest Chicago Suburbs | Everwire Electric',
  yearsExperience: new Date().getFullYear() - 2009,
} as const

export const CREDENTIALS = {
  license: 'Licensed Electrical Contractor',
  // Add the state license number here when available; the footer shows it automatically.
  licenseNumber: '',
  insurance: {
    type: 'Fully Insured & Bonded',
    coverage: '$2M General Liability Coverage',
  },
  certifications: [
    'Licensed Electrical Contractor',
    'NECA Member (National Electrical Contractors Association)',
  ],
} as const

export const STATS = {
  yearsExperience: '15+',
  projectsCompleted: '500+',
  emergencyAvailability: '24/7',
  satisfactionRate: '100%',
} as const
