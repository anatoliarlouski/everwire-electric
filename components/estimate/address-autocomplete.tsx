"use client"

import { useEffect, useId, useRef, useState } from "react"
import { MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import { CONTACT } from "@/lib/constants"

interface Suggestion {
  id: string
  label: string
  detail: string
}

interface Props {
  id: string
  value: string
  onValueChange: (v: string) => void
  placeholder?: string
  invalid?: boolean
  className?: string
}

const API_KEY = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY
const control =
  "w-full rounded-md border border-border bg-background px-3 py-2 text-base text-foreground placeholder:text-muted-foreground outline-none transition-colors focus-visible:border-brand-lime focus-visible:ring-[3px] focus-visible:ring-brand-lime/40 disabled:opacity-60 md:text-sm min-h-11 md:min-h-10"

export function formatAddress(p: Record<string, string | undefined>): string {
  const street = [p.housenumber, p.street].filter(Boolean).join(" ")
  return [street, p.city, [p.state_code || p.state, p.postcode].filter(Boolean).join(" ")].filter(Boolean).join(", ")
}

/**
 * Street address input with Geoapify suggestions (US only, biased to the service area).
 * Falls back to a plain input when no API key is configured.
 */
export function AddressAutocomplete({ id, value, onValueChange, placeholder, invalid, className }: Props) {
  const [items, setItems] = useState<Suggestion[]>([])
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const [loading, setLoading] = useState(false)
  const listId = useId()
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const abort = useRef<AbortController | null>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  const clear = () => {
    setItems([])
    setOpen(false)
    setActive(-1)
  }

  const search = (text: string) => {
    if (timer.current) clearTimeout(timer.current)
    if (abort.current) abort.current.abort()
    if (!API_KEY || text.trim().length < 4) {
      clear()
      return
    }
    timer.current = setTimeout(async () => {
      const controller = new AbortController()
      abort.current = controller
      setLoading(true)
      try {
        const params = new URLSearchParams({
          text,
          apiKey: API_KEY,
          limit: "5",
          filter: "countrycode:us",
          bias: `proximity:${CONTACT.coordinates.lng},${CONTACT.coordinates.lat}`,
          format: "json",
        })
        const res = await fetch(`https://api.geoapify.com/v1/geocode/autocomplete?${params}`, { signal: controller.signal })
        if (!res.ok) throw new Error(String(res.status))
        const data = (await res.json()) as { results?: Array<Record<string, string | undefined> & { place_id?: string; formatted?: string }> }
        const next = (data.results ?? [])
          .map((r, i) => ({ id: r.place_id ?? String(i), label: formatAddress(r) || r.formatted || "", detail: r.formatted ?? "" }))
          .filter((s) => s.label)
        setItems(next)
        setOpen(next.length > 0)
        setActive(-1)
      } catch (err) {
        if ((err as Error).name !== "AbortError") clear()
      } finally {
        setLoading(false)
      }
    }, 300)
  }

  const choose = (s: Suggestion) => {
    onValueChange(s.label)
    clear()
  }

  // Close on outside click
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onDown)
    return () => document.removeEventListener("mousedown", onDown)
  }, [])

  return (
    <div ref={wrapRef} className="relative">
      <input
        id={id}
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
        aria-invalid={invalid || undefined}
        autoComplete="street-address"
        className={cn(control, invalid && "border-destructive", className)}
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          onValueChange(e.target.value)
          search(e.target.value)
        }}
        onFocus={() => items.length > 0 && setOpen(true)}
        onKeyDown={(e) => {
          if (!open) return
          if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, items.length - 1)) }
          else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)) }
          else if (e.key === "Enter" && active >= 0) { e.preventDefault(); choose(items[active]) }
          else if (e.key === "Escape") setOpen(false)
        }}
      />
      {loading && <span className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin rounded-full border-2 border-brand-line border-t-brand-lime" aria-hidden="true" />}
      {open && (
        <ul id={listId} role="listbox" className="absolute z-30 mt-1 w-full overflow-hidden rounded-md border border-border bg-background shadow-lg">
          {items.map((s, i) => (
            <li
              key={s.id}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === active}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => choose(s)}
              onMouseEnter={() => setActive(i)}
              className={cn("flex cursor-pointer items-start gap-2 px-3 py-2.5 text-sm", i === active ? "bg-secondary" : "")}
            >
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-lime-ink" aria-hidden="true" />
              <span className="min-w-0">
                <span className="block font-medium text-foreground">{s.label}</span>
                {s.detail && s.detail !== s.label && <span className="block truncate text-xs text-muted-foreground">{s.detail}</span>}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
