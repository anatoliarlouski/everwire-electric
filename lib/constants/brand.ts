/**
 * Brand assets and color tokens
 * Hex values are taken from the supplied brand board.
 */

export const BRAND_COLORS = {
  navy: '#0A1A27', // primary — the dark color in the logo
  lime: '#8BC53F', // accent — the green in the logo
  limeInk: '#4F7A1C', // darkened lime for small text on light backgrounds (AA contrast)
  gray: '#6B6F72', // muted text
  line: '#E6E6E6', // borders and dividers
  offWhite: '#F5F6F4', // secondary surface
  white: '#FFFFFF',
} as const

export const BRAND_ASSETS = {
  logo: { src: '/brand/logo.png', width: 730, height: 483 },
  logoFull: { src: '/brand/logo-full.png', width: 730, height: 595 },
  mark: { src: '/brand/mark.png', width: 279, height: 304 },
  ogImage: { src: '/brand/og-image.png', width: 1200, height: 630 },
} as const
