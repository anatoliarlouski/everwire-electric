import { Shield, Award, Users, Clock, CheckCircle } from "lucide-react"
import { BUSINESS, STATS, CREDENTIALS } from "@/lib/constants"

const values = [
  { title: "Safety First:", text: "Every project prioritizes the safety of our team and your family" },
  { title: "Quality Workmanship:", text: "We take pride in delivering work that stands the test of time" },
  { title: "Honest Communication:", text: "Transparent pricing and clear explanations every step of the way" },
]

const stats = [
  { value: STATS.yearsExperience, label: "Years Experience" },
  { value: STATS.projectsCompleted, label: "Projects Completed" },
  { value: STATS.emergencyAvailability, label: "Emergency Service" },
  { value: STATS.satisfactionRate, label: "Satisfaction Rate" },
]

const reasons = [
  { icon: Clock, title: "Prompt & Reliable Service", text: "We arrive on time and complete projects when promised" },
  { icon: Shield, title: "Safety-First Approach", text: "All work meets or exceeds current electrical codes" },
  { icon: Award, title: "Competitive Pricing", text: "Fair, transparent pricing with no hidden fees" },
  { icon: Users, title: "Local Family Business", text: "Committed to serving our community for years to come" },
]

export function AboutSection() {
  return (
    <section id="about" className="py-16 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              About {BUSINESS.name}
            </h2>
            <div className="mx-auto mb-4 h-1 w-16 rounded-full bg-accent" aria-hidden="true" />
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your trusted electrical service partner with over {BUSINESS.yearsExperience} years of experience serving the Northwest Suburbs of Chicago and Surrounding Areas
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Company Story */}
            <div className="space-y-5">
              <h3 className="text-2xl font-semibold text-foreground">Our Story</h3>
              <p className="text-muted-foreground leading-relaxed">
                Founded in {BUSINESS.founded}, {BUSINESS.name} began as a small family-owned electrical contracting business with a
                simple mission: to provide reliable, safe, and professional electrical services to our community.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Over the years, we&apos;ve grown from a two-person operation to a full-service electrical contractor, but
                we&apos;ve never lost sight of our core values: integrity, quality workmanship, and exceptional customer
                service.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Today, we&apos;re proud to be one of the most trusted electrical service providers in the region, with
                hundreds of satisfied customers and a reputation built on excellence.
              </p>
            </div>

            {/* Mission & Values */}
            <div className="space-y-5">
              <h3 className="text-2xl font-semibold text-foreground">Our Mission</h3>
              <p className="text-muted-foreground leading-relaxed">
                To deliver exceptional electrical services that exceed our customers&apos; expectations while maintaining the
                highest standards of safety, professionalism, and craftsmanship.
              </p>

              <h4 className="text-lg font-semibold text-foreground pt-2">Our Core Values</h4>
              <div className="space-y-3">
                {values.map((v) => (
                  <div key={v.title} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-brand-lime-ink mt-0.5 shrink-0" aria-hidden="true" />
                    <div>
                      <span className="font-medium text-foreground">{v.title}</span>
                      <span className="text-muted-foreground ml-1">{v.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stats & Credentials */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16">
            {stats.map((s) => (
              <div key={s.label} className="bg-secondary border border-border rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-foreground mb-1">{s.value}</div>
                <div className="text-sm text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Certifications & Why Choose Us */}
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Certifications */}
            <div>
              <h3 className="text-2xl font-semibold mb-6 text-foreground">Certifications &amp; Licenses</h3>
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <Shield className="h-6 w-6 text-brand-lime-ink shrink-0" aria-hidden="true" />
                  <div className="font-medium text-foreground">{CREDENTIALS.license}</div>
                </div>
                <div className="flex items-center gap-3">
                  <Award className="h-6 w-6 text-brand-lime-ink shrink-0" aria-hidden="true" />
                  <div>
                    <div className="font-medium text-foreground">{CREDENTIALS.insurance.type}</div>
                    <div className="text-sm text-muted-foreground">{CREDENTIALS.insurance.coverage}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-brand-lime-ink shrink-0" aria-hidden="true" />
                  <div>
                    <div className="font-medium text-foreground">NECA Member</div>
                    <div className="text-sm text-muted-foreground">National Electrical Contractors Association</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Why Choose Us */}
            <div>
              <h3 className="text-2xl font-semibold mb-6 text-foreground">Why Choose {BUSINESS.name}?</h3>
              <div className="space-y-4">
                {reasons.map((r) => (
                  <div key={r.title} className="bg-card border border-border rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <r.icon className="h-5 w-5 text-brand-lime-ink mt-1 shrink-0" aria-hidden="true" />
                      <div>
                        <div className="font-medium mb-1 text-foreground">{r.title}</div>
                        <div className="text-sm text-muted-foreground">{r.text}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
