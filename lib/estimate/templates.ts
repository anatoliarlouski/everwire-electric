import type { EstimateSettings, ItemCategory, PricingTemplate } from "./types"

export const UNITS = ["Each", "Hour", "Items", "Linear Ft", "Sq Ft"] as const

export const PROJECT_TYPES: { value: string; label: string }[] = [
  { value: "residential", label: "Residential Electrical" },
  { value: "commercial", label: "Commercial Electrical" },
  { value: "ev-charger", label: "EV Charger Installation" },
  { value: "panel", label: "Panel Upgrade / Replacement" },
  { value: "lighting", label: "Lighting Installation" },
  { value: "repair", label: "Electrical Repair / Troubleshooting" },
  { value: "appliance", label: "Appliance Hookup" },
  { value: "other", label: "Other Electrical Work" },
]

export function projectTypeLabel(value: string): string {
  return PROJECT_TYPES.find((p) => p.value === value)?.label ?? value
}

export const CATEGORY_META: Record<ItemCategory, { title: string; description: string; addLabel: string; defaultUnit: string }> = {
  Labor: { title: "Work Items", description: "Labor and service line items", addLabel: "Add work item", defaultUnit: "Each" },
  Materials: { title: "Materials", description: "Wire, devices, fixtures, and supplies", addLabel: "Add material", defaultUnit: "Items" },
  Permits: { title: "Permits", description: "Permit fees and inspections", addLabel: "Add permit", defaultUnit: "Each" },
}

/** Built-in electrical templates. Cannot be deleted; users can add their own. */
export const BUILT_IN_TEMPLATES: PricingTemplate[] = [
  {
    id: "builtin-recessed-led",
    name: "Recessed Light Installation",
    category: "Labor",
    rate: 120,
    unit: "Each",
    description: "Recessed can light installation with ceiling cutting, wiring, and LED fixture placement.",
  },
  {
    id: "builtin-light-fixture",
    name: "Light Fixture Replacement / Installation",
    category: "Labor",
    rate: 120,
    unit: "Each",
    description: "Removal of old fixture and installation of chandeliers, pendants, vanity, exterior, or garage fixtures. Includes mounting, wiring, and testing.",
  },
  {
    id: "builtin-outlet-switch",
    name: "Outlet / Switch Replacement or Installation",
    category: "Labor",
    rate: 100,
    unit: "Each",
    description: "Standard receptacles, GFCI, dimmers, smart switches, and USB outlets. Proper wiring, grounding, and code compliance.",
  },
  {
    id: "builtin-ceiling-fan",
    name: "Ceiling Fan Installation / Replacement",
    category: "Labor",
    rate: 150,
    unit: "Each",
    description: "Fan installation with or without light kit. Includes bracket, wiring, balancing, and remote testing.",
  },
  {
    id: "builtin-electrical-panel",
    name: "Electrical Panel Replacement",
    category: "Labor",
    rate: 1800,
    unit: "Each",
    description: "Replacement of existing panel with a new 100A to 200A breaker panel, completed to current code.",
  },
  {
    id: "builtin-subpanel",
    name: "Subpanel Installation",
    category: "Labor",
    rate: 900,
    unit: "Each",
    description: "New subpanel with feeder from the main panel, breakers, and code-compliant wiring for added capacity.",
  },
  {
    id: "builtin-appliance-hookup",
    name: "Appliance Hookup",
    category: "Labor",
    rate: 250,
    unit: "Each",
    description: "120V/240V hookup for ranges, dryers, dishwashers, and similar appliances. Circuit verification and testing included.",
  },
  {
    id: "builtin-ev-charger",
    name: "EV Charger Installation (Level 2)",
    category: "Labor",
    rate: 600,
    unit: "Each",
    description: "Dedicated circuit from the panel, wiring and conduit, charger mounting, and all electrical connections.",
  },
  {
    id: "builtin-troubleshooting",
    name: "Electrical Troubleshooting",
    category: "Labor",
    rate: 125,
    unit: "Hour",
    description: "Diagnosis of tripping breakers, dead outlets, flickering lights, and other faults.",
  },
  {
    id: "builtin-electrical-materials",
    name: "Electrical Hardware & Supplies",
    category: "Materials",
    rate: 150,
    unit: "Items",
    description: "Wire, conduit, junction boxes, wire nuts, breakers, and other supplies needed for the job.",
  },
  {
    id: "builtin-permit",
    name: "Electrical Permit & Inspection",
    category: "Permits",
    rate: 150,
    unit: "Each",
    description: "Municipal electrical permit and final inspection fee.",
  },
]

export const DEFAULT_SETTINGS: EstimateSettings = {
  taxRate: 8.0,
  discount: 0,
  validityDays: 30,
  estimateTerms:
    "This estimate is valid for 30 days from the date of issue. A 50% deposit is required to schedule the work; the balance is due upon completion.",
  invoiceTerms:
    "Payment is due upon completion of the work. All work has been completed in accordance with the agreed specifications.",
  applyDiscountToLabor: true,
  applyDiscountToMaterials: false,
  applyDiscountToPermits: false,
}

/** Earlier default wordings, replaced automatically when found in saved settings. */
export const LEGACY_INVOICE_TERMS = [
  "Payment is due within 3 business days of receiving this invoice. All work has been completed in accordance with the agreed specifications.",
]

export function isBuiltInTemplate(id: string): boolean {
  return id.startsWith("builtin-")
}
