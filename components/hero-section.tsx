import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  Phone,
  ShieldCheck,
  BadgeCheck,
  Clock,
  MapPin,
  Home,
  Building2,
  PlugZap,
  CircuitBoard,
} from "lucide-react"
import { CONTACT, CREDENTIALS, STATS } from "@/lib/constants"

const trustItems = [
  { icon: ShieldCheck, title: "Licensed", detail: CREDENTIALS.license },
  { icon: BadgeCheck, title: "Insured", detail: CREDENTIALS.insurance.type },
  { icon: Clock, title: `${STATS.yearsExperience} Years`, detail: "Experience in the trade" },
  { icon: MapPin, title: "Service Area", detail: CONTACT.location.region },
]

// Mirrors the four icons on the brand board
const heroServices = [
  { icon: Home, title: "Residential Electrical", detail: "Wiring, lighting, repairs, and upgrades" },
  { icon: Building2, title: "Commercial Electrical", detail: "Offices, shops, and light industrial" },
  { icon: PlugZap, title: "EV Charger Installation", detail: "Dedicated 240V lines, done to code" },
  { icon: CircuitBoard, title: "Panel Services", detail: "Panel replacement and safety upgrades" },
]

/** Subtle circuit-trace pattern drawn in brand colors. Decorative only. */
function CircuitPattern({ className = "" }: { className?: string }) {
  return (
    <svg className={className} aria-hidden="true" focusable="false">
      <defs>
        <pattern id="hero-circuit" width="220" height="220" patternUnits="userSpaceOnUse">
          <g fill="none" stroke="#ffffff" strokeOpacity="0.09" strokeWidth="1.25" strokeLinecap="round">
            <path d="M10 40 H70 L90 60 V120" />
            <path d="M150 20 V70 L120 100 H60" />
            <path d="M200 130 H160 L140 150 V200" />
            <path d="M30 170 H80 V210" />
            <path d="M110 160 L130 140 H190" />
            <path d="M180 40 L205 65" />
          </g>
          <g fill="#8bc53f" fillOpacity="0.45">
            <circle cx="10" cy="40" r="2.5" />
            <circle cx="90" cy="120" r="2.5" />
            <circle cx="150" cy="20" r="2.5" />
            <circle cx="60" cy="100" r="2.5" />
            <circle cx="200" cy="130" r="2.5" />
            <circle cx="30" cy="170" r="2.5" />
            <circle cx="190" cy="140" r="2.5" />
            <circle cx="205" cy="65" r="2.5" />
          </g>
          <g fill="#ffffff" fillOpacity="0.2">
            <circle cx="140" cy="200" r="2" />
            <circle cx="80" cy="210" r="2" />
            <circle cx="110" cy="160" r="2" />
            <circle cx="180" cy="40" r="2" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hero-circuit)" />
    </svg>
  )
}

export function HeroSection() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-brand-navy text-white">
        {/* Background: brand colors only, no photos */}
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_#15334d_0%,_#0a1a27_60%)]"
          aria-hidden="true"
        />
        <CircuitPattern className="absolute inset-0 h-full w-full opacity-60 md:opacity-100 [mask-image:linear-gradient(to_right,transparent_0%,rgba(0,0,0,0.5)_45%,black_100%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,rgba(0,0,0,0.5)_45%,black_100%)]" />
        {/* Soft lime glow behind the panel */}
        <div
          className="absolute -right-32 top-1/2 h-[560px] w-[560px] -translate-y-1/2 rounded-full bg-brand-lime/15 blur-3xl"
          aria-hidden="true"
        />
        {/* Angled lime edge echoing the bolt in the mark */}
        <div
          className="absolute right-0 top-0 hidden h-full w-40 bg-brand-lime/10 lg:block [clip-path:polygon(60%_0,100%_0,100%_100%,0_100%)]"
          aria-hidden="true"
        />
        <div className="absolute inset-x-0 bottom-0 h-1 bg-accent" aria-hidden="true" />

        <div className="relative container mx-auto px-4 py-20 md:py-24 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
            <div className="max-w-3xl">
              <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-brand-lime">
                Licensed &amp; Insured · {CONTACT.location.region}
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                Professional <span className="text-brand-lime">Electrical</span> Services You Can Trust
              </h1>
              <p className="text-lg md:text-xl text-white/85 mb-8 max-w-2xl">
                Expert electrical solutions for your home and business. Licensed, insured, and committed to safety and
                excellence.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button variant="accent" size="lg" asChild>
                  <a href={`tel:${CONTACT.phone.tel}`}>
                    <Phone className="h-5 w-5" aria-hidden="true" />
                    Call {CONTACT.phone.display}
                  </a>
                </Button>
                <Button variant="outline-light" size="lg" asChild>
                  <a href="#estimate">
                    Get Free Estimate
                    <ArrowRight className="h-5 w-5" aria-hidden="true" />
                  </a>
                </Button>
              </div>
            </div>

            {/* What we do panel */}
            <div className="hidden lg:block">
              <div className="rounded-xl border border-white/15 bg-white/[0.06] p-6 backdrop-blur-sm">
                <p className="mb-5 text-xs font-semibold uppercase tracking-wider text-brand-lime">What we do</p>
                <ul className="space-y-4">
                  {heroServices.map((item) => (
                    <li key={item.title} className="flex items-start gap-4">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-brand-lime/40 bg-brand-lime/10 text-brand-lime">
                        <item.icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                      </span>
                      <div>
                        <p className="font-semibold leading-tight text-white">{item.title}</p>
                        <p className="text-sm text-white/70">{item.detail}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-sm text-white/80">
                  <span>Free estimates</span>
                  <span className="text-brand-lime font-medium">{CONTACT.hours.emergency}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust row */}
      <section className="bg-background border-b border-border" aria-label="Credentials">
        <div className="container mx-auto px-4">
          <ul className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-6 py-6 md:py-7">
            {trustItems.map((item) => (
              <li key={item.title} className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-accent/15 text-brand-lime-ink">
                  <item.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-semibold text-foreground leading-tight">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
