import type { Metadata } from "next"
import { PageContainer, ContentSection, PageHeader } from "@/components/layouts"
import { Card } from "@/components/ui/card"
import { Phone, Mail, MapPin, Clock } from "lucide-react"
import { BUSINESS, CONTACT } from "@/lib/constants"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: `Contact Us - Get Free Estimate | ${BUSINESS.name}`,
  description: `Contact ${BUSINESS.name} for electrical services in Northwest Chicago Suburbs. Call ${CONTACT.phone.display} for 24/7 emergency service or request a free estimate online.`,
  alternates: {
    canonical: '/contact',
  },
}

const reasons = [
  "Licensed & Insured Electricians",
  "24/7 Emergency Service Available",
  "Free Estimates & Consultations",
  "100% Satisfaction Guarantee",
]

function IconBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-accent/15 text-brand-lime-ink">
      {children}
    </div>
  )
}

export default function ContactPage() {
  return (
    <PageContainer theme="light">
      <ContentSection maxWidth="6xl" withCard={false}>
        <PageHeader 
          title="Contact Us" 
          description="Ready to get started on your electrical project? Get in touch with our expert team today."
          theme="light"
        />

        <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <Card className="bg-card border border-border shadow-none py-0">
                <div className="p-6 md:p-8">
                  <h2 className="text-2xl font-semibold text-foreground mb-6">Get In Touch</h2>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <IconBox><Phone className="h-6 w-6" aria-hidden="true" /></IconBox>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">Phone</h3>
                        <a href={`tel:${CONTACT.phone.tel}`} className="text-foreground/90 hover:text-brand-lime-ink transition-colors">
                          {CONTACT.phone.display}
                        </a>
                        <p className="text-sm text-muted-foreground mt-1">Available 24/7 for emergencies</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <IconBox><Mail className="h-6 w-6" aria-hidden="true" /></IconBox>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">Email</h3>
                        <a href={`mailto:${CONTACT.email}`} className="text-foreground/90 hover:text-brand-lime-ink transition-colors break-all">
                          {CONTACT.email}
                        </a>
                        <p className="text-sm text-muted-foreground mt-1">We respond within 2 hours</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <IconBox><MapPin className="h-6 w-6" aria-hidden="true" /></IconBox>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">Service Area</h3>
                        <p className="text-foreground/90">{CONTACT.location.full}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <IconBox><Clock className="h-6 w-6" aria-hidden="true" /></IconBox>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">Business Hours</h3>
                        <p className="text-foreground/90">{CONTACT.hours.weekday}</p>
                        <p className="text-foreground/90">{CONTACT.hours.saturday}</p>
                        <p className="text-foreground/90">{CONTACT.hours.sunday}</p>
                        <p className="text-sm text-brand-lime-ink font-medium mt-2">{CONTACT.hours.emergency}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 flex flex-col sm:flex-row gap-3 border-t border-border pt-6">
                    <Button variant="accent" size="lg" asChild>
                      <a href={`tel:${CONTACT.phone.tel}`}>
                        <Phone className="h-5 w-5" aria-hidden="true" />
                        Call {CONTACT.phone.display}
                      </a>
                    </Button>
                    <Button variant="outline" size="lg" asChild>
                      <a href={`mailto:${CONTACT.email}?subject=Estimate%20request`}>
                        <Mail className="h-5 w-5" aria-hidden="true" />
                        Email us
                      </a>
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            <div>
              <Card className="bg-secondary border border-border p-6 shadow-none">
                <h3 className="text-lg font-semibold text-foreground mb-4">Why Choose Us?</h3>
                <ul className="space-y-3 text-foreground/90">
                  {reasons.map((r) => (
                    <li key={r} className="flex items-center gap-3">
                      <span className="h-2 w-2 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                      {r}
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
        </div>
      </ContentSection>
    </PageContainer>
  )
}
