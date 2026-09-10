/**
 * Project data - Single source of truth
 * All project information for gallery and preview sections
 */

export interface Project {
  id: string
  title: string
  description: string
  category: string
  images: string[]
  altText?: string
  location?: string
  completedDate?: string
}

export const projects: Project[] = [
  {
    id: "2",
    title: "Residential Subpanel Installation",
    description: "Professional subpanel installation with proper electrical connections and code-compliant wiring for expanded electrical capacity.",
    category: "Residential",
    images: [
      "/projects/sub-panel-install.jpg"
    ],
    altText: "Professional residential subpanel installation with code-compliant wiring in Northwest Chicago Suburbs home"
  },
  {
    id: "5",
    title: "Chandelier Installation",
    description: "Professional chandelier installation with proper electrical support and dimmer controls for elegant home lighting.",
    category: "Residential",
    images: [
      "/projects/chandelier-installation.jpg",
      "/projects/chandelier-installation-2.jpg"
    ],
    altText: "Elegant chandelier installation with dimmer controls by licensed electrician in Chicago area home"
  },
  {
    id: "6",
    title: "Appliance Installation with New Electrical Lines",
    description: "Running new electrical lines for appliance installation and professional appliance setup with proper electrical connections.",
    category: "Residential",
    images: [
      "/projects/appliance-installation.jpg"
    ],
    altText: "New electrical line installation for residential appliance by professional electrician in Northwest Suburbs of Chicago"
  },
  {
    id: "7",
    title: "Tesla Charger Installation with New Line",
    description: "Professional Tesla EV charger installation with dedicated 240V electrical line and proper grounding for safe, fast charging at home.",
    category: "Residential",
    images: [
      "/projects/tesla-charger-installation.jpg",
      "/projects/tesla-charger-installation-2.jpg"
    ],
    altText: "Tesla EV charger installation with dedicated 240V line by licensed electrician in Northwest Chicago Suburbs"
  },
  {
    id: "8",
    title: "Residential Lighting Fixture Installation",
    description: "Professional lighting fixture installation with proper wiring and switch controls.",
    category: "Residential",
    images: [
      "/projects/lighting-fixture-installation.jpg",
      "/projects/lighting-fixture-installation-2.jpg",
      "/projects/lighting-fixture-installation-3.jpg",
      "/projects/lighting-fixture-installation-4.jpg",
      "/projects/lighting-fixture-installation-5.jpg"
    ],
    altText: "Modern residential lighting fixture installation with professional wiring in Chicago area home"
  },
  {
    id: "9",
    title: "Smart Switches Installation",
    description: "Modern smart switch installation with WiFi connectivity, voice control compatibility, and app-based lighting control for enhanced home automation.",
    category: "Residential",
    images: [
      "/projects/smart-switches-installation.jpg",
      "/projects/smart-switches-installation-2.jpg",
      "/projects/smart-switches-installation-3.jpg"
    ],
    altText: "Smart home switch installation with WiFi connectivity by professional electrician in Northwest Suburbs"
  },
  {
    id: "10",
    title: "Sauna Lights and Heater Installation",
    description: "Complete electrical hookup for sauna installation including specialized lighting fixtures and high-temperature heater wiring with proper safety controls.",
    category: "Residential",
    images: [
      "/projects/sauna-lights-and-heater-installation.jpg",
      "/projects/sauna-lights-and-heater-installation-2.jpg"
    ],
    altText: "Sauna electrical installation with specialized lighting and heater wiring by licensed electrician in Chicago"
  },
  {
    id: "11",
    title: "Recessed Can Lights Installation",
    description: "Professional recessed can light installation with proper ceiling cutting, wiring, and LED fixture placement for modern ambient lighting.",
    category: "Residential",
    images: [
      "/projects/can-lights-installation.jpg",
      "/projects/can-lights-installation-2.jpg"
    ],
    altText: "Recessed LED can lights installation with professional wiring in Northwest Chicago Suburbs home"
  },
  {
    id: "12",
    title: "Commercial Ceiling Fan Installation",
    description: "Professional commercial ceiling fan installation with proper electrical wiring, mounting, and switch controls for enhanced comfort and air circulation in business spaces.",
    category: "Commercial",
    images: [
      "/projects/commercial-fan-installation.jpg"
    ],
    altText: "Commercial ceiling fan installation with professional wiring by licensed electrician in Chicago business"
  },
  {
    id: "13",
    title: "Modern Chandelier Installation",
    description: "Contemporary modern chandelier installation with sophisticated electrical wiring, proper ceiling support, and dimmer controls for elegant home lighting.",
    category: "Residential",
    images: [
      "/projects/modern-chandelier-installation.jpg",
      "/projects/modern-chandelier-installation-2.jpg"
    ],
    altText: "Contemporary modern chandelier installation with dimmer controls in Northwest Suburbs of Chicago home"
  },
  {
    id: "14",
    title: "LED Mirror and Lights Installation",
    description: "Professional LED mirror installation with integrated lighting, proper electrical wiring, and modern bathroom lighting solutions for enhanced functionality and aesthetics.",
    category: "Residential",
    images: [
      "/projects/mirrior-and-lights-installation.jpg",
      "/projects/mirrior-and-lights-installation-2.jpg",
      "/projects/mirrior-and-lights-installation-3.jpg",
      "/projects/mirrior-and-lights-installation-4.jpg",
      "/projects/mirrior-and-lights-installation-5.jpg"
    ],
    altText: "Modern LED bathroom mirror and lighting installation by professional electrician in Northwest Chicago Suburbs"
  },
  {
    id: "15",
    title: "Air Conditioner Line Connection",
    description: "Professional AC electrical line installation with proper wiring, disconnect switches, and code-compliant connections for efficient air conditioning systems.",
    category: "Residential",
    images: [
      "/projects/ac-line-installation.jpg"
    ],
    altText: "Air conditioner electrical line installation with code-compliant wiring in Chicago area home"
  },
  {
    id: "16",
    title: "Commercial AC Installation",
    description: "Professional commercial air conditioning electrical installation with high-capacity wiring, disconnect switches, and code-compliant connections for business HVAC systems.",
    category: "Commercial",
    images: [
      "/projects/commercial-ac-installation.jpg"
    ],
    altText: "Commercial AC electrical installation with high-capacity wiring by licensed contractor in Chicago business"
  }
]

export const categories = ["All", "Residential", "Commercial"] as const

export type ProjectCategory = typeof categories[number]
