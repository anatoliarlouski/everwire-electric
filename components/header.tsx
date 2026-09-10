"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { Phone, Menu } from "lucide-react"
import { BUSINESS, CONTACT, BRAND_ASSETS } from "@/lib/constants"

const NAV_LINKS = [
  { href: "/#services", label: "Services", anchor: "#services" },
  { href: "/#estimate", label: "Get Estimate", anchor: "#estimate" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault()
    const element = document.getElementById(targetId.replace("#", ""))
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    } else {
      // Not on the home page: navigate there with the hash
      router.push(`/${targetId}`)
    }
    setIsOpen(false)
  }

  const phoneNumber = CONTACT.phone.tel
  const phoneDisplay = CONTACT.phone.display

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur border-b border-border">
      {/* Thin brand accent line */}
      <div className="h-1 w-full bg-accent" aria-hidden="true" />

      <div className="container mx-auto flex h-16 md:h-20 lg:h-[5.5rem] items-center justify-between px-4">
        {/* Logo: full lockup on desktop, mark + name on mobile */}
        <Link href="/" className="flex items-center gap-3 py-2" aria-label={`${BUSINESS.name} home`}>
          <Image
            src={BRAND_ASSETS.logo.src}
            alt={`${BUSINESS.name} logo`}
            width={BRAND_ASSETS.logo.width}
            height={BRAND_ASSETS.logo.height}
            priority
            className="hidden md:block h-14 lg:h-[4.5rem] w-auto"
          />
          <Image
            src={BRAND_ASSETS.mark.src}
            alt=""
            width={BRAND_ASSETS.mark.width}
            height={BRAND_ASSETS.mark.height}
            priority
            className="md:hidden h-9 w-auto"
          />
          <span className="md:hidden text-base font-bold tracking-tight text-foreground">
            {BUSINESS.name}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7" aria-label="Main">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={link.anchor ? (e) => handleSmoothScroll(e, link.anchor!) : undefined}
              className="text-sm font-medium text-foreground/90 hover:text-foreground py-2 border-b-2 border-transparent hover:border-accent transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop contact actions */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href={`tel:${phoneNumber}`}
            className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-brand-lime-ink transition-colors"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            <span>{phoneDisplay}</span>
          </a>
          <Button variant="accent" asChild>
            <Link href="/#estimate" onClick={(e) => handleSmoothScroll(e, "#estimate")}>
              Request estimate
            </Link>
          </Button>
        </div>

        {/* Mobile actions */}
        <div className="flex items-center gap-2 md:hidden">
          <Button variant="accent" size="icon" asChild>
            <a href={`tel:${phoneNumber}`} aria-label={`Call ${phoneDisplay}`}>
              <Phone className="h-5 w-5" aria-hidden="true" />
            </a>
          </Button>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-6 w-6" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[320px] sm:w-[380px] p-0 bg-background">
              <div className="flex flex-col h-full">
                <div className="border-b border-border p-6 pr-14">
                  <SheetTitle asChild>
                    <div className="flex items-center gap-3">
                      <Image
                        src={BRAND_ASSETS.mark.src}
                        alt=""
                        width={BRAND_ASSETS.mark.width}
                        height={BRAND_ASSETS.mark.height}
                        className="h-10 w-auto"
                      />
                      <div>
                        <span className="block text-lg font-bold text-foreground">{BUSINESS.name}</span>
                        <span className="block text-xs text-muted-foreground">Licensed &amp; Insured</span>
                      </div>
                    </div>
                  </SheetTitle>
                </div>

                <nav className="flex-1 p-4" aria-label="Mobile">
                  <ul className="space-y-1">
                    {NAV_LINKS.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          onClick={link.anchor ? (e) => handleSmoothScroll(e, link.anchor!) : () => setIsOpen(false)}
                          className="flex items-center gap-3 text-lg font-medium text-foreground rounded-md py-3 px-3 hover:bg-secondary transition-colors"
                        >
                          <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
                          <span>{link.label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>

                <div className="border-t border-border p-6 space-y-3">
                  <Button variant="accent" size="lg" className="w-full" asChild>
                    <a href={`tel:${phoneNumber}`}>
                      <Phone className="h-5 w-5" aria-hidden="true" />
                      <span>Call {phoneDisplay}</span>
                    </a>
                  </Button>
                  <p className="text-center text-sm text-muted-foreground">{CONTACT.hours.emergency}</p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
