/**
 * Image utility functions
 */

/**
 * Creates a placeholder SVG image as a data URL
 * @param width - Width of the placeholder
 * @param height - Height of the placeholder
 * @param text - Text to display in the placeholder
 * @returns Base64 encoded SVG data URL
 */
export const createPlaceholder = (width: number, height: number, text: string): string => {
  const svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="${width}" height="${height}" fill="#f3f4f6"/>
    <text x="50%" y="50%" text-anchor="middle" dy="0.3em" fill="#6b7280" font-family="Arial, sans-serif" font-size="16">${text}</text>
  </svg>`
  
  return `data:image/svg+xml;base64,${btoa(svg)}`
}

/**
 * Creates a blur placeholder for progressive image loading
 * @param width - Width of the placeholder
 * @param height - Height of the placeholder
 * @returns Base64 encoded blurred SVG data URL
 */
export const createBlurPlaceholder = (width: number, height: number): string => {
  const svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#e5e7eb;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#d1d5db;stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="${width}" height="${height}" fill="url(#grad)"/>
  </svg>`
  
  return `data:image/svg+xml;base64,${btoa(svg)}`
}

/**
 * Generates optimized image sizes for responsive loading
 * @param baseWidth - Base width of the image
 * @returns Array of responsive sizes
 */
export const getResponsiveSizes = (baseWidth: number): string => {
  return `(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, ${baseWidth}px`
}
