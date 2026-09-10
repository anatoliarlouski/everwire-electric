"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2, Settings2, BookOpen, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Field, NumberInput, Select, TextArea, TextInput, Toggle } from "@/components/estimate/fields"
import { money } from "@/lib/estimate/calc"
import { isBuiltInTemplate, UNITS, DEFAULT_SETTINGS } from "@/lib/estimate/templates"
import type { EstimateSettings, ItemCategory, PricingTemplate } from "@/lib/estimate/types"

const CATEGORIES: ItemCategory[] = ["Labor", "Materials", "Permits"]

const emptyTemplate = (): PricingTemplate => ({ id: "", name: "", category: "Labor", description: "", rate: 0, unit: "Each" })

interface Props {
  open: boolean
  onOpenChange: (o: boolean) => void
  templates: PricingTemplate[]
  settings: EstimateSettings
  onTemplatesChange: (t: PricingTemplate[]) => void
  onSettingsChange: (s: EstimateSettings) => void
  onUseTemplate: (t: PricingTemplate) => void
}

export function PricingManager({ open, onOpenChange, templates, settings, onTemplatesChange, onSettingsChange, onUseTemplate }: Props) {
  const [tab, setTab] = useState<"templates" | "settings">("templates")
  const [draft, setDraft] = useState<PricingTemplate | null>(null)
  const [local, setLocal] = useState<EstimateSettings>(settings)
  const [saved, setSaved] = useState(false)
  const [added, setAdded] = useState<string | null>(null)

  const startNew = () => setDraft(emptyTemplate())
  const startEdit = (t: PricingTemplate) => setDraft({ ...t })

  const saveDraft = () => {
    if (!draft || !draft.name.trim() || draft.rate <= 0) return
    if (draft.id) {
      onTemplatesChange(templates.map((t) => (t.id === draft.id ? draft : t)))
    } else {
      onTemplatesChange([...templates, { ...draft, id: `user-${Date.now()}` }])
    }
    setDraft(null)
  }

  const remove = (id: string) => onTemplatesChange(templates.filter((t) => t.id !== id))

  const use = (t: PricingTemplate) => {
    onUseTemplate(t)
    setAdded(t.id)
    setTimeout(() => setAdded(null), 1200)
  }

  const saveSettings = () => {
    onSettingsChange(local)
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (o) setLocal(settings) }}>
      <DialogContent className="max-w-3xl h-[calc(100dvh-1.5rem)] sm:h-auto sm:max-h-[calc(100dvh-3rem)]">
        <DialogHeader>
          <DialogTitle>Pricing &amp; settings</DialogTitle>
          <DialogDescription>Reusable line items and document defaults. Saved on this device.</DialogDescription>
          <div className="mt-3 inline-flex rounded-full border border-border bg-secondary p-1" role="tablist">
            {([
              ["templates", "Price list", BookOpen],
              ["settings", "Settings", Settings2],
            ] as const).map(([key, label, Icon]) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={tab === key}
                onClick={() => setTab(key)}
                className={`flex min-h-10 items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors ${tab === key ? "bg-brand-navy text-white" : "text-foreground hover:bg-background"}`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {label}
              </button>
            ))}
          </div>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          {tab === "templates" && !draft && (
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-muted-foreground">Tap <span className="font-medium text-foreground">Use</span> to add an item to the current document.</p>
                <Button size="sm" variant="accent" onClick={startNew}>
                  <Plus className="h-4 w-4" aria-hidden="true" /> New item
                </Button>
              </div>
              {CATEGORIES.map((cat) => {
                const list = templates.filter((t) => t.category === cat)
                if (list.length === 0) return null
                return (
                  <div key={cat}>
                    <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-brand-lime-ink">{cat}</h3>
                    <ul className="divide-y divide-border rounded-lg border border-border">
                      {list.map((t) => (
                        <li key={t.id} className="flex flex-col gap-2 p-3 sm:flex-row sm:items-center sm:justify-between">
                          <div className="min-w-0">
                            <p className="font-medium text-foreground">{t.name}</p>
                            {t.description && <p className="text-sm text-muted-foreground line-clamp-2">{t.description}</p>}
                            <p className="mt-1 text-sm font-semibold tabular-nums text-foreground">{money(t.rate)} <span className="font-normal text-muted-foreground">/ {t.unit}</span></p>
                          </div>
                          <div className="flex shrink-0 items-center gap-1">
                            {!isBuiltInTemplate(t.id) && (
                              <>
                                <Button size="icon" variant="ghost" onClick={() => startEdit(t)} aria-label={`Edit ${t.name}`}><Pencil className="h-4 w-4" /></Button>
                                <Button size="icon" variant="ghost" onClick={() => remove(t.id)} aria-label={`Delete ${t.name}`}><Trash2 className="h-4 w-4" /></Button>
                              </>
                            )}
                            <Button size="sm" variant={added === t.id ? "default" : "outline"} onClick={() => use(t)}>
                              {added === t.id ? <><Check className="h-4 w-4" aria-hidden="true" /> Added</> : "Use"}
                            </Button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          )}

          {tab === "templates" && draft && (
            <form className="grid gap-4 sm:grid-cols-2" onSubmit={(e) => { e.preventDefault(); saveDraft() }}>
              <Field label="Name" htmlFor="tpl-name" required className="sm:col-span-2">
                <TextInput id="tpl-name" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="e.g. Smart switch installation" />
              </Field>
              <Field label="Category" htmlFor="tpl-cat">
                <Select id="tpl-cat" value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value as ItemCategory })}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </Select>
              </Field>
              <Field label="Unit" htmlFor="tpl-unit">
                <Select id="tpl-unit" value={draft.unit} onChange={(e) => setDraft({ ...draft, unit: e.target.value })}>
                  {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                </Select>
              </Field>
              <Field label="Rate ($)" htmlFor="tpl-rate" required>
                <NumberInput id="tpl-rate" min={0} step="0.01" value={draft.rate} onValueChange={(n) => setDraft({ ...draft, rate: n })} />
              </Field>
              <Field label="Description" htmlFor="tpl-desc" className="sm:col-span-2">
                <TextArea id="tpl-desc" value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} placeholder="What the customer sees on the document" />
              </Field>
              <div className="flex gap-2 sm:col-span-2">
                <Button type="submit" variant="accent" disabled={!draft.name.trim() || draft.rate <= 0}>{draft.id ? "Save changes" : "Add to price list"}</Button>
                <Button type="button" variant="outline" onClick={() => setDraft(null)}>Cancel</Button>
              </div>
            </form>
          )}

          {tab === "settings" && (
            <form className="grid gap-4 sm:grid-cols-2" onSubmit={(e) => { e.preventDefault(); saveSettings() }}>
              <Field label="Sales tax on materials (%)" htmlFor="set-tax">
                <NumberInput id="set-tax" min={0} max={100} step="0.01" value={local.taxRate} onValueChange={(n) => setLocal({ ...local, taxRate: n })} />
              </Field>
              <Field label="Discount (%)" htmlFor="set-disc">
                <NumberInput id="set-disc" min={0} max={100} step="0.5" value={local.discount} onValueChange={(n) => setLocal({ ...local, discount: n })} />
              </Field>
              <Field label="Estimate valid for (days)" htmlFor="set-valid">
                <NumberInput id="set-valid" min={1} max={365} step="1" value={local.validityDays} onValueChange={(n) => setLocal({ ...local, validityDays: n })} />
              </Field>
              <div className="space-y-2 sm:col-span-2">
                <p className="text-sm font-medium text-foreground">Apply discount to</p>
                <div className="grid gap-2 sm:grid-cols-3">
                  <Toggle id="d-labor" label="Work items" checked={local.applyDiscountToLabor} onCheckedChange={(v) => setLocal({ ...local, applyDiscountToLabor: v })} />
                  <Toggle id="d-mat" label="Materials" checked={local.applyDiscountToMaterials} onCheckedChange={(v) => setLocal({ ...local, applyDiscountToMaterials: v })} />
                  <Toggle id="d-per" label="Permits" checked={local.applyDiscountToPermits} onCheckedChange={(v) => setLocal({ ...local, applyDiscountToPermits: v })} />
                </div>
              </div>
              <Field label="Estimate terms" htmlFor="set-eterms" className="sm:col-span-2">
                <TextArea id="set-eterms" value={local.estimateTerms} onChange={(e) => setLocal({ ...local, estimateTerms: e.target.value })} />
              </Field>
              <Field label="Invoice terms" htmlFor="set-iterms" className="sm:col-span-2">
                <TextArea id="set-iterms" value={local.invoiceTerms} onChange={(e) => setLocal({ ...local, invoiceTerms: e.target.value })} />
              </Field>
              <div className="flex flex-wrap gap-2 sm:col-span-2">
                <Button type="submit" variant="accent">{saved ? <><Check className="h-4 w-4" aria-hidden="true" /> Saved</> : "Save settings"}</Button>
                <Button type="button" variant="outline" onClick={() => setLocal(DEFAULT_SETTINGS)}>Reset to defaults</Button>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
