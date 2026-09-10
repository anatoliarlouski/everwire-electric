import { MetadataRoute } from 'next'
import { BUSINESS } from '@/lib/constants'

// Required for static export (output: 'export')
export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/',
    },
    sitemap: `${BUSINESS.url}/sitemap.xml`,
  }
}
