"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Building2,
  Calculator,
  ClipboardList,
  Download,
  Eye,
  FileText,
  Plus,
  RotateCcw,
  Trash2,
  User,
  Wrench,
  Package,
  FileCheck,
  BookOpen,
  Check,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Field, NumberInput, PhoneInput, SectionCard, Select, TextArea, TextInput } from "@/components/estimate/fields"
import { PricingManager } from "@/components/estimate/pricing-manager"
import { PdfPreview } from "@/components/estimate/pdf-preview"
import { AddressAutocomplete } from "@/components/estimate/address-autocomplete"
import { BUSINESS, CONTACT, CREDENTIALS } from "@/lib/constants"
import { addDays, computeTotals, money, toDateInput } from "@/lib/estimate/calc"
import { downloadPdf } from "@/lib/estimate/pdf"
import { loadJSON, saveJSON } from "@/lib/estimate/storage"
import { isValidPhone } from "@/lib/estimate/phone"
import { BUILT_IN_TEMPLATES, CATEGORY_META, DEFAULT_SETTINGS, LEGACY_INVOICE_TERMS, PROJECT_TYPES, UNITS, isBuiltInTemplate } from "@/lib/estimate/templates"
import type { CompanyInfo, CustomerInfo, DocumentType, EstimateData, EstimateItem, EstimateSettings, ItemCategory, PricingTemplate } from "@/lib/estimate/types"

/** Company details come from the site constants and are not editable here. */
const COMPANY: CompanyInfo = {
  name: BUSINESS.name,
  description: CREDENTIALS.license,
  phone: CONTACT.phone.display,
  email: CONTACT.email,
  address: `${CONTACT.location.region}, IL`,
}

const EMPTY_CUSTOMER: CustomerInfo = { name: "", email: "", phone: "", address: "", projectDescription: "" }

let itemSeq = 0
const nextItemId = () => `item-${++itemSeq}`

const newItem = (category: ItemCategory, overrides: Partial<EstimateItem> = {}): EstimateItem => ({
  id: nextItemId(),
  description: "",
  quantity: 1,
  unit: CATEGORY_META[category].defaultUnit,
  rate: 0,
  total: 0,
  category,
  ...overrides,
})

type Notice = { kind: "success" | "error"; text: string } | null

/** Where to scroll when a validation rule fails */
const FIELD_IDS: Record<string, string> = {
  customerName: "cu-name",
  customerPhone: "cu-phone",
  projectType: "cu-type",
  items: "work-items",
}

export function EstimateBuilder() {
  const [hydrated, setHydrated] = useState(false)
  const [documentType, setDocumentType] = useState<DocumentType>("estimate")
  const [customer, setCustomer] = useState<CustomerInfo>(EMPTY_CUSTOMER)
  const [projectType, setProjectType] = useState("")
  const [items, setItems] = useState<EstimateItem[]>([])
  const [notes, setNotes] = useState("")
  const [customNumber, setCustomNumber] = useState("")
  const [createdDate, setCreatedDate] = useState("")
  const [validUntil, setValidUntil] = useState("")
  const [settings, setSettings] = useState<EstimateSettings>(DEFAULT_SETTINGS)
  const [templates, setTemplates] = useState<PricingTemplate[]>(BUILT_IN_TEMPLATES)
  const [pricingOpen, setPricingOpen] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewData, setPreviewData] = useState<EstimateData | null>(null)
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState<Notice>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Load saved data once on the client (deferred a tick; runs even in a background tab)
  useEffect(() => {
    const timer = setTimeout(() => {
    const today = toDateInput(new Date())
    setCreatedDate(today)
    setValidUntil(addDays(today, DEFAULT_SETTINGS.validityDays))
    const savedSettings = loadJSON<EstimateSettings>("settings")
    const userTemplates = loadJSON<PricingTemplate[]>("templates")
    const savedType = loadJSON<DocumentType>("documentType")
    if (savedSettings) {
      const merged = { ...DEFAULT_SETTINGS, ...savedSettings }
      if (LEGACY_INVOICE_TERMS.includes(merged.invoiceTerms)) merged.invoiceTerms = DEFAULT_SETTINGS.invoiceTerms
      setSettings(merged)
      setValidUntil(addDays(today, merged.validityDays))
    }
    if (userTemplates) setTemplates([...BUILT_IN_TEMPLATES, ...userTemplates.filter((t) => !isBuiltInTemplate(t.id))])
    if (savedType === "estimate" || savedType === "invoice") setDocumentType(savedType)
    setHydrated(true)
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!notice) return
    const t = setTimeout(() => setNotice(null), notice.kind === "error" ? 6000 : 4000)
    return () => clearTimeout(t)
  }, [notice])

  const totals = useMemo(() => computeTotals(items, settings), [items, settings])

  // ----- items -----
  const updateItem = (id: string, patch: Partial<EstimateItem>) =>
    setItems((list) =>
      list.map((it) => {
        if (it.id !== id) return it
        const next = { ...it, ...patch }
        next.total = Math.round(next.quantity * next.rate * 100) / 100
        return next
      })
    )
  const removeItem = (id: string) => setItems((list) => list.filter((it) => it.id !== id))
  const addItem = (category: ItemCategory) => setItems((list) => [...list, newItem(category)])
  const useTemplate = (t: PricingTemplate) =>
    setItems((list) => [...list, newItem(t.category, { description: t.name, unit: t.unit, rate: t.rate, total: t.rate })])

  // ----- persistence -----
  const changeSettings = (s: EstimateSettings) => {
    setSettings(s)
    saveJSON("settings", s)
    setValidUntil(addDays(createdDate, s.validityDays))
  }
  const changeTemplates = (t: PricingTemplate[]) => {
    setTemplates(t)
    saveJSON("templates", t.filter((x) => !isBuiltInTemplate(x.id)))
  }

  // ----- validation + document assembly -----
  const validate = (): boolean => {
    const next: Record<string, string> = {}
    if (!customer.name.trim()) next.customerName = "Customer name is required"
    if (!isValidPhone(customer.phone)) next.customerPhone = "Enter a 10-digit phone number, e.g. (847) 555-0100"
    if (!projectType) next.projectType = "Choose a project type"
    // Blank lines (no description and no rate) are ignored; a rate without a description is an error.
    const isBlank = (i: EstimateItem) => !i.description.trim() && i.rate <= 0
    const incomplete = items.some((i) => !isBlank(i) && !i.description.trim())
    const complete = items.filter((i) => i.description.trim() && i.quantity > 0 && i.rate > 0)
    if (incomplete) next.items = "A line has a rate but no description"
    else if (complete.length === 0) next.items = "Add at least one line with a description, quantity, and rate"
    setErrors(next)
    const keys = Object.keys(next)
    if (keys.length) {
      setNotice({ kind: "error", text: Object.values(next)[0] })
      const targetId = FIELD_IDS[keys[0]]
      const el = targetId ? document.getElementById(targetId) : null
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" })
        setTimeout(() => el.focus({ preventScroll: true }), 350)
      }
    }
    return keys.length === 0
  }

  const changeDocumentType = (t: DocumentType) => {
    setDocumentType(t)
    saveJSON("documentType", t)
  }

  const documentNumber = () => customNumber.trim() || `${documentType === "invoice" ? "INV" : "EST"}-${Date.now().toString().slice(-6)}`

  const assemble = (): EstimateData => ({
    documentType,
    companyInfo: COMPANY,
    customerInfo: customer,
    projectType,
    items: items.filter((i) => i.description.trim()),
    notes,
    settings,
    totals,
    metadata: {
      number: documentNumber(),
      createdDate: `${createdDate || toDateInput(new Date())}T00:00:00`,
      expiryDate: `${validUntil || addDays(createdDate || toDateInput(new Date()), settings.validityDays)}T00:00:00`,
    },
  })

  const handlePreview = () => {
    if (!validate()) return
    setPreviewData(assemble())
    setPreviewOpen(true)
  }

  const handleDownload = async () => {
    if (!validate()) return
    setBusy(true)
    try {
      await downloadPdf(assemble())
      setNotice({ kind: "success", text: `PDF ${documentType} ready.` })
    } catch {
      setNotice({ kind: "error", text: "Could not build the PDF. Please try again." })
    } finally {
      setBusy(false)
    }
  }

  const handleClear = () => {
    setCustomer(EMPTY_CUSTOMER)
    setProjectType("")
    setItems([])
    setNotes("")
    setErrors({})
    setCreatedDate(toDateInput(new Date()))
    setValidUntil(addDays(toDateInput(new Date()), settings.validityDays))
  }

  const docLabel = documentType === "invoice" ? "Invoice" : "Estimate"

  return (
    <div className="bg-secondary">
      {/* Tool header */}
      <div className="border-b border-border bg-background">
        <div className="container mx-auto flex flex-col gap-4 px-4 py-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-md bg-brand-navy text-brand-lime">
              <Calculator className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Estimate Builder</h1>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => setPricingOpen(true)}>
              <BookOpen className="h-4 w-4" aria-hidden="true" /> Price list &amp; settings
            </Button>
            <Button variant="accent" onClick={handleDownload} disabled={busy}>
              <Download className="h-4 w-4" aria-hidden="true" /> {busy ? "Building…" : `Download ${docLabel}`}
            </Button>
          </div>
        </div>
      </div>

      {/* Toast: fixed so it is visible wherever the user clicked; sits above the mobile call bar */}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-24 z-[80] flex justify-center px-4 md:bottom-6">
        {notice && (
          <div
            role={notice.kind === "error" ? "alert" : "status"}
            className={`pointer-events-auto flex max-w-lg items-start gap-2 rounded-md border px-4 py-3 text-sm shadow-lg ${notice.kind === "success" ? "border-brand-lime/60 bg-background text-foreground" : "border-destructive/50 bg-background text-destructive"}`}
          >
            {notice.kind === "success" ? <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-lime-ink" aria-hidden="true" /> : <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />}
            <span>{notice.text}</span>
          </div>
        )}
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {/* Company (static) */}
            <div className="flex flex-col gap-3 rounded-xl border border-border bg-card px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-accent/15 text-brand-lime-ink">
                  <Building2 className="h-4.5 w-4.5" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-bold text-foreground">{COMPANY.name}</p>
                  <p className="text-sm text-muted-foreground">{COMPANY.description}</p>
                </div>
              </div>
              <dl className="grid gap-x-6 gap-y-1 text-sm text-muted-foreground sm:text-right">
                <div className="flex gap-2 sm:justify-end"><dt className="sr-only">Phone</dt><dd>{COMPANY.phone}</dd></div>
                <div className="flex gap-2 sm:justify-end"><dt className="sr-only">Email</dt><dd>{COMPANY.email}</dd></div>
                <div className="flex gap-2 sm:justify-end"><dt className="sr-only">Service area</dt><dd>{COMPANY.address}</dd></div>
              </dl>
            </div>

            {/* Customer */}
            <SectionCard title="Customer" description={`Who this ${docLabel.toLowerCase()} is for`} icon={User}>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Customer name" htmlFor="cu-name" required error={errors.customerName}>
                  <TextInput id="cu-name" value={customer.name} invalid={!!errors.customerName} onChange={(e) => setCustomer((c) => ({ ...c, name: e.target.value }))} placeholder="Jane Smith" />
                </Field>
                <Field label="Project type" htmlFor="cu-type" required error={errors.projectType}>
                  <Select id="cu-type" value={projectType} onChange={(e) => setProjectType(e.target.value)} aria-invalid={!!errors.projectType || undefined} className={errors.projectType ? "border-destructive" : ""}>
                    <option value="">Select a project type</option>
                    {PROJECT_TYPES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                  </Select>
                </Field>
                <Field label="Phone" htmlFor="cu-phone" error={errors.customerPhone}>
                  <PhoneInput id="cu-phone" value={customer.phone} invalid={!!errors.customerPhone} onValueChange={(v) => setCustomer((c) => ({ ...c, phone: v }))} placeholder="(847) 555-0100" />
                </Field>
                <Field label="Email" htmlFor="cu-email">
                  <TextInput id="cu-email" type="email" value={customer.email} onChange={(e) => setCustomer((c) => ({ ...c, email: e.target.value }))} placeholder="jane@example.com" />
                </Field>
                <Field label="Job address" htmlFor="cu-addr" className="sm:col-span-2">
                  <AddressAutocomplete id="cu-addr" value={customer.address} onValueChange={(v) => setCustomer((c) => ({ ...c, address: v }))} placeholder="123 Main St, Schaumburg, IL 60193" />
                </Field>
                <Field label="Project description" htmlFor="cu-desc" className="sm:col-span-2" hint="Shown on the PDF under Project">
                  <TextArea id="cu-desc" value={customer.projectDescription} onChange={(e) => setCustomer((c) => ({ ...c, projectDescription: e.target.value }))} placeholder="Install Level 2 EV charger in attached garage, 40A dedicated circuit from main panel." />
                </Field>
              </div>
            </SectionCard>

            {/* Line items */}
            {(["Labor", "Materials", "Permits"] as ItemCategory[]).map((category) => {
              const meta = CATEGORY_META[category]
              const list = items.filter((i) => i.category === category)
              const priceOnly = category !== "Labor"
              const Icon = category === "Labor" ? Wrench : category === "Materials" ? Package : FileCheck
              return (
                <SectionCard
                  key={category}
                  title={category === "Labor" && documentType === "invoice" ? "Work performed" : meta.title}
                  description={meta.description}
                  icon={Icon}
                  action={
                    <div className="flex gap-2">
                      {category === "Labor" && (
                        <Button size="sm" variant="outline" onClick={() => setPricingOpen(true)}>
                          <BookOpen className="h-4 w-4" aria-hidden="true" /> From price list
                        </Button>
                      )}
                      <Button size="sm" variant="secondary" onClick={() => addItem(category)}>
                        <Plus className="h-4 w-4" aria-hidden="true" /> {meta.addLabel}
                      </Button>
                    </div>
                  }
                >
                  {category === "Labor" && <span id="work-items" tabIndex={-1} className="block outline-none" aria-hidden="true" />}
                  {category === "Labor" && errors.items && <p className="mb-3 text-sm text-destructive" role="alert">{errors.items}</p>}
                  {list.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Nothing added yet.</p>
                  ) : (
                    <ul className="space-y-3">
                      {list.map((item) => (
                        <li key={item.id} className="rounded-lg border border-border bg-background p-3">
                          <div className={`grid gap-3 ${priceOnly ? "sm:grid-cols-[1fr_140px_120px_auto]" : "sm:grid-cols-[1fr_90px_110px_120px_110px_auto]"} sm:items-end`}>
                            <Field label="Description" htmlFor={`d-${item.id}`}>
                              <TextInput id={`d-${item.id}`} value={item.description} onChange={(e) => updateItem(item.id, { description: e.target.value })} placeholder={priceOnly ? "e.g. 50A breaker, 6/3 NM-B cable" : "e.g. Install Level 2 EV charger"} />
                            </Field>
                            {!priceOnly && (
                              <>
                                <Field label="Qty" htmlFor={`q-${item.id}`}>
                                  <NumberInput id={`q-${item.id}`} min={0} step="0.5" value={item.quantity} onValueChange={(n) => updateItem(item.id, { quantity: n })} />
                                </Field>
                                <Field label="Unit" htmlFor={`u-${item.id}`}>
                                  <Select id={`u-${item.id}`} value={item.unit} onChange={(e) => updateItem(item.id, { unit: e.target.value })}>
                                    {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                                  </Select>
                                </Field>
                              </>
                            )}
                            <Field label={priceOnly ? "Price ($)" : "Rate ($)"} htmlFor={`r-${item.id}`}>
                              <NumberInput id={`r-${item.id}`} min={0} step="0.01" value={item.rate} onValueChange={(n) => updateItem(item.id, { rate: n, ...(priceOnly ? { quantity: 1 } : {}) })} />
                            </Field>
                            <div className="space-y-1.5">
                              <p className="text-sm font-medium text-foreground">Total</p>
                              <p className="flex min-h-11 items-center justify-end rounded-md bg-secondary px-3 text-sm font-semibold tabular-nums text-foreground md:min-h-10">{money(item.total)}</p>
                            </div>
                            <Button size="icon" variant="ghost" onClick={() => removeItem(item.id)} aria-label="Remove line" className="justify-self-end text-muted-foreground hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </SectionCard>
              )
            })}

            {/* Notes */}
            <SectionCard title="Notes" description="Scope details, exclusions, scheduling" icon={ClipboardList}>
              <TextArea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Price includes permit pull and final inspection. Drywall patching not included." aria-label="Notes" />
            </SectionCard>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-xl bg-brand-navy p-5 text-white">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-brand-lime">Summary</p>
              <dl className="space-y-2 text-sm">
                <Row label="Work items" value={money(totals.laborTotal)} />
                <Row label="Materials" value={money(totals.materialsTotal)} />
                <Row label="Permits" value={money(totals.permitsTotal)} />
                <div className="my-2 border-t border-white/10" />
                <Row label="Subtotal" value={money(totals.subtotal)} />
                {totals.discountAmount > 0 && <Row label={`Discount on work items (${settings.discount}%)`} value={`-${money(totals.discountAmount)}`} />}
                {totals.tax > 0 && <Row label={`Tax on materials (${settings.taxRate}%)`} value={money(totals.tax)} />}
              </dl>
              <div className="mt-4 flex items-baseline justify-between border-t border-brand-lime/40 pt-4">
                <span className="text-sm font-semibold uppercase tracking-wider">{documentType === "invoice" ? "Amount due" : "Total"}</span>
                <span className="text-2xl font-bold tabular-nums">{money(totals.total)}</span>
              </div>
            </div>

            <SectionCard title="Document" icon={FileText}>
              <div className="space-y-4">
                <div className="inline-flex w-full rounded-md border border-border bg-secondary p-1" role="group" aria-label="Document type">
                  {(["estimate", "invoice"] as DocumentType[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      aria-pressed={documentType === t}
                      onClick={() => changeDocumentType(t)}
                      className={`min-h-10 flex-1 rounded text-sm font-medium capitalize transition-colors ${documentType === t ? "bg-brand-navy text-white" : "text-foreground hover:bg-background"}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <Field label={`${docLabel} number`} htmlFor="doc-num" hint="Leave blank to auto-number">
                  <TextInput id="doc-num" value={customNumber} onChange={(e) => setCustomNumber(e.target.value)} placeholder={documentType === "invoice" ? "INV-001234" : "EST-001234"} />
                </Field>
                <Field label="Date" htmlFor="doc-date">
                  <TextInput id="doc-date" type="date" value={createdDate} onChange={(e) => { setCreatedDate(e.target.value); setValidUntil(addDays(e.target.value, settings.validityDays)) }} />
                </Field>
                {documentType === "estimate" && (
                  <Field label="Valid until" htmlFor="doc-valid">
                    <TextInput id="doc-valid" type="date" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} />
                  </Field>
                )}
              </div>
            </SectionCard>

            <div className="grid gap-2">
              <Button variant="accent" size="lg" onClick={handleDownload} disabled={busy}>
                <Download className="h-5 w-5" aria-hidden="true" /> {busy ? "Building…" : `Download ${docLabel} PDF`}
              </Button>
              <Button variant="outline" size="lg" onClick={handlePreview}>
                <Eye className="h-5 w-5" aria-hidden="true" /> Preview
              </Button>
              <Button variant="ghost" onClick={handleClear}>
                <RotateCcw className="h-4 w-4" aria-hidden="true" /> Start a new {docLabel.toLowerCase()}
              </Button>
            </div>
          </aside>
        </div>
      </div>

      <PricingManager
        open={pricingOpen}
        onOpenChange={setPricingOpen}
        templates={templates}
        settings={settings}
        onTemplatesChange={changeTemplates}
        onSettingsChange={changeSettings}
        onUseTemplate={useTemplate}
      />
      <PdfPreview data={previewData} open={previewOpen} onOpenChange={setPreviewOpen} />
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-white/75">{label}</dt>
      <dd className="tabular-nums">{value}</dd>
    </div>
  )
}
