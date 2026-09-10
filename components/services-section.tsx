import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CircuitBoard, Home, Lightbulb, Wrench, Building2, AlertTriangle } from "lucide-react"

const services = [
  {
    icon: Home,
    title: "Residential Wiring",
    description: "Complete home electrical installations, rewiring, and upgrades for modern living.",
    features: ["New construction wiring", "Panel upgrades", "Code compliance", "Safety inspections"],
  },
  {
    icon: Lightbulb,
    title: "Lighting Solutions",
    description: "Professional lighting design and installation for indoor and outdoor spaces.",
    features: ["LED conversions", "Smart lighting", "Landscape lighting", "Fixture installation"],
  },
  {
    icon: Wrench,
    title: "Electrical Repairs",
    description: "Fast, reliable repairs for all your electrical issues and emergencies.",
    features: ["Outlet repairs", "Switch replacement", "Circuit troubleshooting", "GFCI installation"],
  },
  {
    icon: CircuitBoard,
    title: "Panel Services",
    description: "Electrical panel upgrades, maintenance, and safety improvements.",
    features: ["Panel replacement", "Breaker installation", "Load calculations", "Safety upgrades"],
  },
  {
    icon: Building2,
    title: "Commercial Electric",
    description: "Professional electrical services for businesses and commercial properties.",
    features: ["Office wiring", "Equipment installation", "Maintenance contracts", "Code compliance"],
  },
  {
    icon: AlertTriangle,
    title: "Emergency Services",
    description: "24/7 emergency electrical services for urgent repairs and safety issues.",
    features: ["Power outages", "Electrical fires", "Safety hazards", "Urgent repairs"],
  },
]

export function ServicesSection() {
  return (
    <section id="services" className="py-16 md:py-20 px-4 bg-secondary scroll-mt-20">
      <div className="container mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Our Electrical Services
          </h2>
          <div className="mx-auto mb-4 h-1 w-16 rounded-full bg-accent" aria-hidden="true" />
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive electrical solutions for residential and commercial needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card key={service.title} className="bg-card border border-border shadow-none hover:border-brand-lime transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-accent/15 text-brand-lime-ink">
                    <service.icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                  </div>
                  <CardTitle className="text-xl text-foreground">{service.title}</CardTitle>
                </div>
                <CardDescription className="text-base text-muted-foreground">{service.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center text-sm text-foreground/80">
                      <span className="mr-3 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
