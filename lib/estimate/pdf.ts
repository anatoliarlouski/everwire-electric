/**
 * PDF generation for estimates and invoices (jsPDF, loaded on demand).
 * Layout ported from QuoteCrafts and restyled with the EverWire brand.
 */
import type { jsPDF } from "jspdf"
import type { EstimateData, EstimateItem } from "./types"
import { projectTypeLabel } from "./templates"
import { formatDate, money } from "./calc"
import { BRAND_ASSETS, BRAND_COLORS } from "@/lib/constants"

const NAVY = hexToRgb(BRAND_COLORS.navy)
const LIME = hexToRgb(BRAND_COLORS.lime)
const GRAY = { r: 107, g: 111, b: 114 }
const ROW_TINT = { r: 245, g: 246, b: 244 }
const FONT = "helvetica"

function hexToRgb(hex: string) {
  const h = hex.replace("#", "")
  return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) }
}

let logoCache: string | null = null
async function loadLogo(): Promise<string | null> {
  if (logoCache) return logoCache
  try {
    const res = await fetch(BRAND_ASSETS.logo.src)
    const blob = await res.blob()
    logoCache = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
    return logoCache
  } catch {
    return null
  }
}

export async function buildPdf(data: EstimateData): Promise<jsPDF> {
  const { jsPDF: JsPDF } = await import("jspdf")
  const logo = await loadLogo()

  const doc = new JsPDF({ orientation: "portrait", unit: "mm", format: "letter" })
  const pageW = doc.internal.pageSize.getWidth() // 215.9
  const pageH = doc.internal.pageSize.getHeight() // 279.4
  const left = 15
  const right = pageW - 15
  const contentW = right - left
  const isInvoice = data.documentType === "invoice"
  const title = isInvoice ? "INVOICE" : "ESTIMATE"
  const terms = isInvoice ? data.settings.invoiceTerms : data.settings.estimateTerms

  const setColor = (c: { r: number; g: number; b: number }) => doc.setTextColor(c.r, c.g, c.b)

  const headerFooter = (page: number, pages: number) => {
    doc.setPage(page)
    // Top band
    doc.setFillColor(NAVY.r, NAVY.g, NAVY.b)
    doc.rect(0, 0, pageW, 14, "F")
    doc.setFillColor(LIME.r, LIME.g, LIME.b)
    doc.rect(0, 14, pageW, 1.2, "F")
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(10)
    doc.setFont(FONT, "bold")
    doc.text(data.companyInfo.name.toUpperCase(), left, 9)
    doc.setFont(FONT, "normal")
    doc.text(`${title} ${data.metadata.number}  ·  Page ${page} of ${pages}`, right, 9, { align: "right" })

    // Footer terms
    if (terms.trim()) {
      const y = pageH - 16
      doc.setDrawColor(230, 230, 230)
      doc.line(left, y - 4, right, y - 4)
      doc.setFontSize(7.5)
      doc.setFont(FONT, "bold")
      setColor(NAVY)
      doc.text("TERMS & CONDITIONS", left, y)
      doc.setFont(FONT, "normal")
      setColor(GRAY)
      const lines = doc.splitTextToSize(terms, contentW).slice(0, 2)
      doc.text(lines, left, y + 3.5)
    }
  }

  const ensureSpace = (needed: number) => {
    if (y + needed > pageH - 26) {
      doc.addPage()
      y = 24
    }
  }

  let y = 24

  // Logo + document title row
  if (logo) {
    const w = 34
    const h = (w * BRAND_ASSETS.logo.height) / BRAND_ASSETS.logo.width
    doc.addImage(logo, "PNG", left, y, w, h, "everwire-logo", "FAST")
  }
  doc.setFont(FONT, "bold")
  doc.setFontSize(26)
  setColor(NAVY)
  doc.text(title, right, y + 9, { align: "right" })
  doc.setFontSize(9)
  doc.setFont(FONT, "normal")
  setColor(GRAY)
  const metaLines = [
    `${isInvoice ? "Invoice" : "Estimate"} #: ${data.metadata.number}`,
    `Date: ${formatDate(data.metadata.createdDate)}`,
    ...(isInvoice ? [] : [`Valid until: ${formatDate(data.metadata.expiryDate)}`]),
  ]
  metaLines.forEach((line, i) => doc.text(line, right, y + 16 + i * 4.5, { align: "right" }))
  y += 34

  // Company + client boxes with labelled rows
  type Row = { label?: string; value: string; bold?: boolean }
  const colW = (contentW - 6) / 2
  const labelW = 22
  const rowH = 4.6
  const measure = (rows: Row[]) =>
    rows.filter((r) => r.value.trim()).reduce((h, r) => {
      const w = r.label ? colW - 8 - labelW : colW - 8
      return h + doc.splitTextToSize(r.value, w).length * rowH
    }, 0)
  const companyRows: Row[] = [
    { value: data.companyInfo.name, bold: true },
    { value: data.companyInfo.description },
    { label: "Phone", value: data.companyInfo.phone },
    { label: "Email", value: data.companyInfo.email },
    { label: "Service area", value: data.companyInfo.address },
  ]
  const clientRows: Row[] = [
    { label: "Name", value: data.customerInfo.name, bold: true },
    { label: "Phone", value: data.customerInfo.phone },
    { label: "Email", value: data.customerInfo.email },
    { label: "Address", value: data.customerInfo.address },
  ]
  doc.setFontSize(9)
  const boxH = Math.max(measure(companyRows), measure(clientRows)) + 15
  const drawBox = (x: number, heading: string, rows: Row[]) => {
    doc.setDrawColor(230, 230, 230)
    doc.setFillColor(ROW_TINT.r, ROW_TINT.g, ROW_TINT.b)
    doc.roundedRect(x, y, colW, boxH, 2, 2, "FD")
    doc.setFont(FONT, "bold")
    doc.setFontSize(8)
    setColor(NAVY)
    doc.text(heading.toUpperCase(), x + 4, y + 6)
    doc.setFontSize(9)
    let ly = y + 12
    rows.filter((r) => r.value.trim()).forEach((r) => {
      let vx = x + 4
      if (r.label) {
        doc.setFont(FONT, "normal")
        setColor(GRAY)
        doc.text(`${r.label}:`, x + 4, ly)
        vx = x + 4 + labelW
      }
      doc.setFont(FONT, r.bold ? "bold" : "normal")
      doc.setTextColor(30, 30, 30)
      const wrapped = doc.splitTextToSize(r.value, colW - 8 - (r.label ? labelW : 0))
      doc.text(wrapped, vx, ly)
      ly += wrapped.length * rowH
    })
  }
  drawBox(left, "From", companyRows)
  drawBox(left + colW + 6, "Client information", clientRows)
  y += boxH + 8

  // Project line
  if (data.projectType || data.customerInfo.projectDescription.trim()) {
    doc.setFont(FONT, "bold")
    doc.setFontSize(9)
    setColor(NAVY)
    doc.text("PROJECT", left, y)
    doc.setFont(FONT, "normal")
    doc.setTextColor(30, 30, 30)
    const text = [projectTypeLabel(data.projectType), data.customerInfo.projectDescription.trim()].filter(Boolean).join(" — ")
    const lines = doc.splitTextToSize(text, contentW - 22)
    doc.text(lines, left + 22, y)
    y += lines.length * 4.5 + 6
  }

  // Item tables
  const section = (items: EstimateItem[], heading: string, priceOnly: boolean, discountable = false) => {
    if (items.length === 0) return
    ensureSpace(30)
    doc.setFont(FONT, "bold")
    doc.setFontSize(11)
    setColor(NAVY)
    doc.text(heading.toUpperCase(), left, y)
    doc.setDrawColor(LIME.r, LIME.g, LIME.b)
    doc.setLineWidth(0.6)
    doc.line(left, y + 1.5, right, y + 1.5)
    y += 6

    // Header row
    doc.setFillColor(NAVY.r, NAVY.g, NAVY.b)
    doc.rect(left, y, contentW, 8, "F")
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(8.5)
    doc.setFont(FONT, "bold")
    const cols = priceOnly
      ? { desc: left + 3, price: right - 40, total: right - 3 }
      : { desc: left + 3, qty: right - 78, unit: right - 62, rate: right - 40, total: right - 3 }
    doc.text("DESCRIPTION", cols.desc, y + 5.4)
    if (!priceOnly) {
      doc.text("QTY", cols.qty!, y + 5.4, { align: "right" })
      doc.text("UNIT", cols.unit!, y + 5.4, { align: "right" })
      doc.text("RATE", cols.rate!, y + 5.4, { align: "right" })
    } else {
      doc.text("PRICE", cols.price!, y + 5.4, { align: "right" })
    }
    doc.text("TOTAL", cols.total, y + 5.4, { align: "right" })
    y += 10

    doc.setFont(FONT, "normal")
    doc.setFontSize(9)
    const descW = priceOnly ? contentW - 60 : contentW - 100
    items.forEach((item, idx) => {
      const lines = doc.splitTextToSize(item.description, descW)
      const rowH = lines.length * 4.4 + 3
      ensureSpace(rowH + 4)
      if (idx % 2 === 0) {
        doc.setFillColor(ROW_TINT.r, ROW_TINT.g, ROW_TINT.b)
        doc.rect(left, y - 3, contentW, rowH, "F")
      }
      doc.setTextColor(30, 30, 30)
      doc.text(lines, cols.desc, y + 1)
      if (!priceOnly) {
        doc.text(String(item.quantity), cols.qty!, y + 1, { align: "right" })
        doc.text(item.unit, cols.unit!, y + 1, { align: "right" })
        doc.text(money(item.rate), cols.rate!, y + 1, { align: "right" })
      } else {
        doc.text(money(item.rate), cols.price!, y + 1, { align: "right" })
      }
      doc.text(money(item.total), cols.total, y + 1, { align: "right" })
      y += rowH
    })

    const sectionTotal = items.reduce((a, i) => a + i.total, 0)
    doc.setFont(FONT, "bold")
    setColor(NAVY)
    doc.text("Subtotal:", right - 40, y + 2, { align: "right" })
    doc.text(money(sectionTotal), right - 3, y + 2, { align: "right" })
    y += 6
    if (discountable && data.settings.discount > 0 && sectionTotal > 0) {
      const off = sectionTotal * (data.settings.discount / 100)
      doc.setFont(FONT, "normal")
      setColor(GRAY)
      doc.text(`Discount (${data.settings.discount}%):`, right - 40, y + 2, { align: "right" })
      doc.text(`-${money(off)}`, right - 3, y + 2, { align: "right" })
      y += 6
      doc.setFont(FONT, "bold")
      setColor(NAVY)
      doc.text("Total with Discount:", right - 40, y + 2, { align: "right" })
      doc.text(money(sectionTotal - off), right - 3, y + 2, { align: "right" })
      y += 6
    }
    y += 4
  }

  section(data.items.filter((i) => i.category === "Labor"), isInvoice ? "Work performed" : "Work items", false, true)
  section(data.items.filter((i) => i.category === "Materials"), "Materials", true)
  section(data.items.filter((i) => i.category === "Permits"), "Permits", true)

  // Summary
  const sumW = 80
  const sumX = right - sumW
  const rows: [string, string][] = [["Subtotal", money(data.totals.subtotal)]]
  if (data.totals.tax > 0) rows.push([`Sales tax on materials (${data.settings.taxRate}%)`, money(data.totals.tax)])
  ensureSpace(rows.length * 8 + 14)
  doc.setFont(FONT, "normal")
  doc.setFontSize(9.5)
  rows.forEach(([label, value]) => {
    doc.setDrawColor(230, 230, 230)
    doc.line(sumX, y + 6, right, y + 6)
    setColor(GRAY)
    doc.text(label, sumX, y + 3.5)
    doc.setTextColor(30, 30, 30)
    doc.text(value, right, y + 3.5, { align: "right" })
    y += 8
  })
  doc.setFillColor(NAVY.r, NAVY.g, NAVY.b)
  doc.rect(sumX, y, sumW, 11, "F")
  doc.setFillColor(LIME.r, LIME.g, LIME.b)
  doc.rect(sumX, y, 1.5, 11, "F")
  doc.setTextColor(255, 255, 255)
  doc.setFont(FONT, "bold")
  doc.setFontSize(11)
  doc.text(isInvoice ? "AMOUNT DUE" : "TOTAL", sumX + 5, y + 7.5)
  doc.text(money(data.totals.total), right - 3, y + 7.5, { align: "right" })
  y += 20

  // Notes
  if (data.notes.trim()) {
    const lines = doc.splitTextToSize(data.notes.trim(), contentW - 8)
    ensureSpace(lines.length * 4.2 + 16)
    doc.setFont(FONT, "bold")
    doc.setFontSize(11)
    setColor(NAVY)
    doc.text("NOTES", left, y)
    doc.setDrawColor(LIME.r, LIME.g, LIME.b)
    doc.line(left, y + 1.5, right, y + 1.5)
    y += 6
    doc.setFillColor(ROW_TINT.r, ROW_TINT.g, ROW_TINT.b)
    doc.rect(left, y - 2, contentW, lines.length * 4.2 + 5, "F")
    doc.setFont(FONT, "normal")
    doc.setFontSize(9)
    doc.setTextColor(30, 30, 30)
    doc.text(lines, left + 4, y + 2.5)
    y += lines.length * 4.2 + 8
  }

  const pages = doc.getNumberOfPages()
  for (let p = 1; p <= pages; p++) headerFooter(p, pages)
  return doc
}

export function pdfFilename(data: EstimateData): string {
  const customer = data.customerInfo.name.replace(/[^a-zA-Z0-9]+/g, "_").replace(/^_|_$/g, "") || "Customer"
  const kind = data.documentType === "invoice" ? "Invoice" : "Estimate"
  return `EverWire_${kind}_${customer}_${data.metadata.number}.pdf`
}

function saveBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.rel = "noopener"
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 5000)
}

/**
 * Download (desktop) or share (phones/tablets) the PDF under a real filename.
 * Mobile browsers get the native share sheet with a named file so it never
 * shows up as "unknown.pdf"; if sharing is unavailable or refused we fall back
 * to a named download.
 */
export async function downloadPdf(data: EstimateData): Promise<void> {
  const doc = await buildPdf(data)
  const filename = pdfFilename(data)
  const blob = doc.output("blob")
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || (navigator.maxTouchPoints > 1 && /Macintosh/.test(navigator.userAgent))

  if (isMobile && typeof navigator.share === "function") {
    const file = new File([blob], filename, { type: "application/pdf" })
    if (!navigator.canShare || navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: filename })
        return
      } catch (err) {
        if ((err as Error).name === "AbortError") return // user closed the share sheet
        // NotAllowedError or unsupported: fall through to a named download
      }
    }
  }
  saveBlob(blob, filename)
}

export async function pdfDataUri(data: EstimateData): Promise<string> {
  const doc = await buildPdf(data)
  return doc.output("datauristring")
}
