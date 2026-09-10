import type { EstimateItem, EstimateSettings, Totals } from "./types"

export function computeTotals(items: EstimateItem[], settings: EstimateSettings): Totals {
  const sum = (category: EstimateItem["category"]) =>
    items.filter((i) => i.category === category).reduce((acc, i) => acc + i.total, 0)

  const laborTotal = sum("Labor")
  const materialsTotal = sum("Materials")
  const permitsTotal = sum("Permits")
  const subtotal = laborTotal + materialsTotal + permitsTotal

  const factor = 1 - (settings.discount || 0) / 100
  const laborAfterDiscount = settings.applyDiscountToLabor ? laborTotal * factor : laborTotal
  const materialsAfterDiscount = settings.applyDiscountToMaterials ? materialsTotal * factor : materialsTotal
  const permitsAfterDiscount = settings.applyDiscountToPermits ? permitsTotal * factor : permitsTotal
  const discountAmount = subtotal - (laborAfterDiscount + materialsAfterDiscount + permitsAfterDiscount)

  // Sales tax applies to materials only
  const tax = materialsAfterDiscount * ((settings.taxRate || 0) / 100)
  const total = laborAfterDiscount + materialsAfterDiscount + permitsAfterDiscount + tax

  return {
    laborTotal,
    materialsTotal,
    permitsTotal,
    subtotal,
    laborAfterDiscount,
    materialsAfterDiscount,
    permitsAfterDiscount,
    discountAmount,
    tax,
    total,
  }
}

export function money(value: number): string {
  return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function formatDate(value: string | Date): string {
  const d = typeof value === "string" ? new Date(value) : value
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const dd = String(d.getDate()).padStart(2, "0")
  return `${mm}/${dd}/${d.getFullYear()}`
}

/** yyyy-mm-dd for <input type="date"> in local time */
export function toDateInput(d: Date): string {
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const dd = String(d.getDate()).padStart(2, "0")
  return `${d.getFullYear()}-${mm}-${dd}`
}

export function addDays(dateInput: string, days: number): string {
  const d = new Date(dateInput + "T00:00:00")
  d.setDate(d.getDate() + days)
  return toDateInput(d)
}
