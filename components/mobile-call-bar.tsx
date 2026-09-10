import { Phone } from "lucide-react"
import { CONTACT } from "@/lib/constants"

/**
 * Sticky call button for small screens.
 * Rendered as a plain link so the phone number is never delayed by scripts.
 */
export function MobileCallBar() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 md:hidden border-t border-border bg-background/95 backdrop-blur px-4 pt-3"
      style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
    >
      <a
        href={`tel:${CONTACT.phone.tel}`}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-accent text-accent-foreground text-base font-semibold"
      >
        <Phone className="h-5 w-5" aria-hidden="true" />
        <span>Call {CONTACT.phone.display}</span>
      </a>
    </div>
  )
}
