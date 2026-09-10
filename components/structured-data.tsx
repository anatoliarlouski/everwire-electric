import { CONTACT, SOCIAL, BUSINESS, BRAND_ASSETS } from "@/lib/constants"

export function StructuredData() {
  const sameAs = [SOCIAL.facebook, SOCIAL.instagram].filter(Boolean)

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Electrician",
    "@id": BUSINESS.url,
    "name": BUSINESS.name,
    "alternateName": BUSINESS.alternateName,
    "description": BUSINESS.description,
    "url": BUSINESS.url,
    "telephone": CONTACT.phone.tel,
    "email": CONTACT.email,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": CONTACT.location.streetAddress,
      "addressRegion": "IL",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": CONTACT.coordinates.lat.toString(),
      "longitude": CONTACT.coordinates.lng.toString()
    },
    "areaServed": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": CONTACT.coordinates.lat.toString(),
        "longitude": CONTACT.coordinates.lng.toString()
      },
      "geoRadius": CONTACT.serviceRadius.toString()
    },
    "serviceType": [
      "Electrical Services",
      "Residential Electrical",
      "Commercial Electrical",
      "Emergency Electrical Services",
      "Electrical Repairs",
      "Panel Upgrades",
      "Lighting Installation"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Electrical Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Residential Wiring",
            "description": "Complete home electrical installations, rewiring, and upgrades for modern living."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Lighting Solutions",
            "description": "Professional lighting design and installation for indoor and outdoor spaces."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Electrical Repairs",
            "description": "Fast, reliable repairs for all your electrical issues and emergencies."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Panel Services",
            "description": "Electrical panel upgrades, maintenance, and safety improvements."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Commercial Electric",
            "description": "Professional electrical services for businesses and commercial properties."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Emergency Services",
            "description": "24/7 emergency electrical services for urgent repairs and safety issues."
          }
        }
      ]
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "08:00",
        "closes": "20:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Saturday"],
        "opens": "08:00",
        "closes": "16:00"
      }
    ],
    "priceRange": "$$",
    "paymentAccepted": ["Cash", "Credit Card", "Check", "Invoice"],
    "currenciesAccepted": "USD",
    "logo": `${BUSINESS.url}${BRAND_ASSETS.logoFull.src}`,
    "image": `${BUSINESS.url}${BRAND_ASSETS.ogImage.src}`,
    ...(sameAs.length ? { sameAs } : {}),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
