import Image from "next/image"
import Link from "next/link"
import { Phone, Mail, MapPin, Facebook, Instagram } from "lucide-react"
import { BUSINESS, CONTACT, CREDENTIALS, SOCIAL, BRAND_ASSETS } from "@/lib/constants"

export function Footer() {
  const year = new Date().getFullYear()
  const hasSocial = Boolean(SOCIAL.facebook || SOCIAL.instagram)

  return (
    <footer id="contact" className="bg-secondary border-t border-border">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company Info */}
          <div className="space-y-5">
            <Link href="/" aria-label={`${BUSINESS.name} home`} className="inline-block">
              <Image
                src={BRAND_ASSETS.logoFull.src}
                alt={`${BUSINESS.name} - Licensed & Insured`}
                width={BRAND_ASSETS.logoFull.width}
                height={BRAND_ASSETS.logoFull.height}
                className="h-auto w-44"
              />
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Professional electrical services you can trust. Licensed, insured, and committed to excellence.
            </p>
            {hasSocial && (
              <div className="flex gap-4">
                {SOCIAL.facebook && (
                  <a href={SOCIAL.facebook} aria-label="Facebook" className="text-muted-foreground hover:text-foreground transition-colors">
                    <Facebook className="h-5 w-5" />
                  </a>
                )}
                {SOCIAL.instagram && (
                  <a href={SOCIAL.instagram} aria-label="Instagram" className="text-muted-foreground hover:text-foreground transition-colors">
                    <Instagram className="h-5 w-5" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-foreground">Services</h3>
            <ul className="space-y-0.5 text-sm text-muted-foreground">
              <li><Link href="/#services" className="inline-block py-1.5 hover:text-foreground transition-colors">Residential Wiring</Link></li>
              <li><Link href="/#services" className="inline-block py-1.5 hover:text-foreground transition-colors">Lighting Solutions</Link></li>
              <li><Link href="/#services" className="inline-block py-1.5 hover:text-foreground transition-colors">Electrical Repairs</Link></li>
              <li><Link href="/#services" className="inline-block py-1.5 hover:text-foreground transition-colors">Panel Services</Link></li>
              <li><a href={`tel:${CONTACT.phone.tel}`} className="inline-block py-1.5 hover:text-foreground transition-colors">Emergency Services</a></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-foreground">Quick Links</h3>
            <ul className="space-y-0.5 text-sm text-muted-foreground">
              <li><Link href="/about" className="inline-block py-1.5 hover:text-foreground transition-colors">About Us</Link></li>
              <li><Link href="/#estimate" className="inline-block py-1.5 hover:text-foreground transition-colors">Get Estimate</Link></li>
              <li><Link href="/gallery" className="inline-block py-1.5 hover:text-foreground transition-colors">Project Gallery</Link></li>
              <li><Link href="/contact" className="inline-block py-1.5 hover:text-foreground transition-colors">Contact Us</Link></li>
              <li><Link href="/#services" className="inline-block py-1.5 hover:text-foreground transition-colors">Our Services</Link></li>
              <li><Link href="/estimate-builder" className="inline-block py-1.5 hover:text-foreground transition-colors">Estimate Builder</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-foreground">Contact Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4 shrink-0 text-brand-lime-ink" aria-hidden="true" />
                <a href={`tel:${CONTACT.phone.tel}`} className="inline-block py-1.5 font-medium text-foreground hover:text-brand-lime-ink transition-colors">
                  {CONTACT.phone.display}
                </a>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4 shrink-0 text-brand-lime-ink" aria-hidden="true" />
                <a href={`mailto:${CONTACT.email}`} className="inline-block py-1.5 hover:text-foreground transition-colors break-all">
                  {CONTACT.email}
                </a>
              </div>
              <div className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-brand-lime-ink" aria-hidden="true" />
                <span>Serving the {CONTACT.location.region}</span>
              </div>
            </div>
            <div className="text-sm text-muted-foreground space-y-1 pt-1">
              <p>
                {CREDENTIALS.license}
                {CREDENTIALS.licenseNumber ? ` · Lic. #${CREDENTIALS.licenseNumber}` : ""}
              </p>
              <p>{CREDENTIALS.insurance.type}</p>
              <p>{CONTACT.hours.emergency}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-brand-navy text-white/80">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm">
          <p>&copy; {year} {BUSINESS.name}. All rights reserved.</p>
          <p>Licensed &amp; Insured</p>
        </div>
      </div>
    </footer>
  )
}
