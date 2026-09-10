import type React from "react"
import type { Metadata, Viewport } from "next"
import { Montserrat } from "next/font/google"
import { Suspense } from "react"
import { StructuredData } from "@/components/structured-data"
import { GoogleAnalytics } from "@/components/google-analytics"
import { ErrorBoundary } from "@/components/error-boundary"
import { BUSINESS, BRAND_ASSETS } from "@/lib/constants"
import "./globals.css"

// Brand typeface from the brand board (Montserrat Bold / SemiBold / Regular)
const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-montserrat",
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0A1A27',
}

export const metadata: Metadata = {
  title: BUSINESS.seoTitle,
  description: BUSINESS.description,
  keywords: "electrician northwest chicago suburbs, electrical services northwest suburbs of chicago, residential electrical chicago, commercial electrical, emergency electrician 24/7, licensed electrician chicago, electrical repairs, panel upgrades, lighting installation, wiring services, electrical contractor",
  authors: [{ name: BUSINESS.name }],
  creator: BUSINESS.name,
  publisher: BUSINESS.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(BUSINESS.url),
  openGraph: {
    title: BUSINESS.seoTitle,
    description: BUSINESS.description,
    url: BUSINESS.url,
    siteName: BUSINESS.name,
    images: [
      {
        url: BRAND_ASSETS.ogImage.src,
        width: BRAND_ASSETS.ogImage.width,
        height: BRAND_ASSETS.ogImage.height,
        alt: `${BUSINESS.name} - Licensed & Insured`,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/favicon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <StructuredData />
      </head>
      <body className={`font-sans ${montserrat.variable} antialiased`}>
        <GoogleAnalytics />
        <ErrorBoundary>
          <Suspense fallback={null}>{children}</Suspense>
        </ErrorBoundary>
      </body>
    </html>
  )
}
