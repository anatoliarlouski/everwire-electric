/**
 * Estimate builder types (ported from QuoteCrafts, electrical only)
 */

export type ItemCategory = "Labor" | "Materials" | "Permits"
export type DocumentType = "estimate" | "invoice"

export interface EstimateItem {
  id: string
  description: string
  quantity: number
  unit: string
  rate: number
  total: number
  category: ItemCategory
}

export interface CustomerInfo {
  name: string
  email: string
  phone: string
  address: string
  projectDescription: string
}

export interface CompanyInfo {
  name: string
  description: string
  phone: string
  email: string
  address: string
}

export interface EstimateSettings {
  taxRate: number
  discount: number
  validityDays: number
  estimateTerms: string
  invoiceTerms: string
  applyDiscountToLabor: boolean
  applyDiscountToMaterials: boolean
  applyDiscountToPermits: boolean
}

export interface PricingTemplate {
  id: string
  name: string
  category: ItemCategory
  description: string
  rate: number
  unit: string
}

export interface Totals {
  laborTotal: number
  materialsTotal: number
  permitsTotal: number
  subtotal: number
  laborAfterDiscount: number
  materialsAfterDiscount: number
  permitsAfterDiscount: number
  discountAmount: number
  tax: number
  total: number
}

export interface DocumentMetadata {
  number: string
  createdDate: string
  expiryDate: string
}

export interface EstimateData {
  documentType: DocumentType
  companyInfo: CompanyInfo
  customerInfo: CustomerInfo
  projectType: string
  items: EstimateItem[]
  notes: string
  settings: EstimateSettings
  totals: Totals
  metadata: DocumentMetadata
}
