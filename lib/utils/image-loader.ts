/**
 * Custom image loader for Next.js static export with optimization
 * This loader handles image optimization for static sites
 */

export interface ImageLoaderProps {
  src: string
  width: number
  quality?: number
}

/**
 * Custom image loader that works with static export
 * Generates optimized image URLs with proper sizing
 */
export default function imageLoader({ src, width, quality }: ImageLoaderProps): string {
  // For external URLs, return as-is
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src
  }

  // For local images, use next-image-export-optimizer format
  // The optimizer will generate these during build
  const params = new URLSearchParams()
  params.set('url', src)
  params.set('w', width.toString())
  if (quality) {
    params.set('q', quality.toString())
  }

  return `/_next/image?${params.toString()}`
}
