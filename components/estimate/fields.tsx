"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const control =
  "w-full rounded-md border border-border bg-background px-3 py-2 text-base text-foreground placeholder:text-muted-foreground outline-none transition-colors focus-visible:border-brand-lime focus-visible:ring-[3px] focus-visible:ring-brand-lime/40 disabled:opacity-60 md:text-sm min-h-11 md:min-h-10"

export function Field({
  label,
  htmlFor,
  required,
  error,
  hint,
  className,
  children,
}: {
  label: string
  htmlFor: string
  required?: boolean
  error?: string
  hint?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-foreground">
        {label}
        {required && <span className="ml-0.5 text-brand-lime-ink" aria-hidden="true">*</span>}
      </label>
      {children}
      {error ? (
        <p className="text-sm text-destructive" role="alert">{error}</p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  )
}

export function TextInput({ className, invalid, ...props }: React.ComponentProps<"input"> & { invalid?: boolean }) {
  return <input className={cn(control, invalid && "border-destructive", className)} aria-invalid={invalid || undefined} {...props} />
}

export function NumberInput({ className, value, onValueChange, ...props }: Omit<React.ComponentProps<"input">, "value" | "onChange"> & { value: number; onValueChange: (n: number) => void }) {
  return (
    <input
      type="number"
      inputMode="decimal"
      className={cn(control, "text-right tabular-nums", className)}
      value={Number.isFinite(value) ? value : 0}
      onChange={(e) => onValueChange(e.target.value === "" ? 0 : Number(e.target.value))}
      onFocus={(e) => e.target.select()}
      {...props}
    />
  )
}

export function Select({ className, children, ...props }: React.ComponentProps<"select">) {
  return (
    <select className={cn(control, "appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%236b6f72%22 stroke-width=%222%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-[length:12px] bg-[right_0.75rem_center] bg-no-repeat pr-9", className)} {...props}>
      {children}
    </select>
  )
}

export function TextArea({ className, ...props }: React.ComponentProps<"textarea">) {
  return <textarea className={cn(control, "min-h-24 resize-y leading-relaxed", className)} {...props} />
}

export function Toggle({ id, label, checked, onCheckedChange }: { id: string; label: string; checked: boolean; onCheckedChange: (v: boolean) => void }) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-center justify-between gap-4 rounded-md border border-border px-3 py-2.5">
      <span className="text-sm text-foreground">{label}</span>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onCheckedChange(!checked)}
        className={cn("relative h-6 w-11 shrink-0 rounded-full transition-colors", checked ? "bg-brand-lime" : "bg-brand-line")}
      >
        <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform", checked ? "left-0.5 translate-x-5" : "left-0.5")} />
      </button>
    </label>
  )
}

export function SectionCard({
  title,
  description,
  icon: Icon,
  action,
  children,
  className,
}: {
  title: string
  description?: string
  icon?: React.ComponentType<{ className?: string }>
  action?: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  return (
    <section className={cn("rounded-xl border border-border bg-card", className)}>
      <header className="flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          {Icon && (
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-accent/15 text-brand-lime-ink">
              <Icon className="h-4.5 w-4.5" />
            </span>
          )}
          <div>
            <h2 className="text-base font-bold text-foreground">{title}</h2>
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
          </div>
        </div>
        {action}
      </header>
      <div className="p-5">{children}</div>
    </section>
  )
}
