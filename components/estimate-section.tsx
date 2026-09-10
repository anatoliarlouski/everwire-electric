import { Phone, Mail, MapPin, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CONTACT } from "@/lib/constants"

export function EstimateSection() {
  return (
    <section id="estimate" className="py-16 md:py-20 px-4 bg-background scroll-mt-20">
      <div className="container mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Get Your Free Estimate
          </h2>
          <div className="mx-auto mb-4 h-1 w-16 rounded-full bg-accent" aria-hidden="true" />
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Contact us today for a free, no-obligation estimate on your electrical project
          </p>
        </div>

        <div className="max-w-5xl mx-auto rounded-xl bg-brand-navy text-white overflow-hidden">
          <div className="grid md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
            {/* Ask */}
            <div className="p-6 md:p-10">
              <h3 className="text-2xl font-bold text-white mb-3">Call or email with a short description of the job</h3>
              <p className="text-white/80 mb-6">
                We&apos;ll get back to you with a free, no-obligation estimate. Electrical emergencies don&apos;t wait for
                business hours, so call anytime for urgent issues.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="accent" size="lg" asChild>
                  <a href={`tel:${CONTACT.phone.tel}`}>
                    <Phone className="h-5 w-5" aria-hidden="true" />
                    Call {CONTACT.phone.display}
                  </a>
                </Button>
                <Button variant="outline-light" size="lg" asChild>
                  <a href={`mailto:${CONTACT.email}?subject=Estimate%20request`}>
                    <Mail className="h-5 w-5" aria-hidden="true" />
                    Email us
                  </a>
                </Button>
              </div>
            </div>

            {/* Details */}
            <div className="border-t md:border-t-0 md:border-l border-white/10 bg-white/[0.04] p-6 md:p-10">
              <dl className="space-y-5 text-sm">
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-5 w-5 shrink-0 text-brand-lime" aria-hidden="true" />
                  <div>
                    <dt className="font-semibold text-white">Email</dt>
                    <dd className="text-white/75 break-all">{CONTACT.email}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand-lime" aria-hidden="true" />
                  <div>
                    <dt className="font-semibold text-white">Service Area</dt>
                    <dd className="text-white/75">{CONTACT.location.full}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-5 w-5 shrink-0 text-brand-lime" aria-hidden="true" />
                  <div>
                    <dt className="font-semibold text-white">Hours</dt>
                    <dd className="text-white/75">{CONTACT.hours.weekday}</dd>
                    <dd className="text-white/75">{CONTACT.hours.saturday}</dd>
                    <dd className="text-brand-lime font-medium">{CONTACT.hours.emergency}</dd>
                  </div>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
