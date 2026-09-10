/** US phone helpers: normalize keystrokes into (XXX) XXX-XXXX and validate. */

export function phoneDigits(value: string): string {
  let d = value.replace(/\D/g, "")
  if (d.length === 11 && d.startsWith("1")) d = d.slice(1) // drop country code
  return d.slice(0, 10)
}

export function formatPhone(value: string): string {
  const d = phoneDigits(value)
  if (d.length === 0) return ""
  if (d.length < 4) return `(${d}`
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`
}

/** Empty is allowed (optional field). Otherwise require 10 digits with a valid area code. */
export function isValidPhone(value: string): boolean {
  const d = phoneDigits(value)
  if (d.length === 0) return true
  return d.length === 10 && /^[2-9]/.test(d) && /^[2-9]/.test(d.slice(3))
}
