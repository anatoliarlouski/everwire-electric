/**
 * localStorage helpers for the estimate builder. All reads are guarded so
 * server rendering and private browsing never throw.
 */

const PREFIX = "everwire.estimate."

export function loadJSON<T>(key: string): T | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(PREFIX + key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

export function saveJSON(key: string, value: unknown): boolean {
  if (typeof window === "undefined") return false
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export function removeKey(key: string): void {
  if (typeof window === "undefined") return
  try {
    window.localStorage.removeItem(PREFIX + key)
  } catch {
    /* ignore */
  }
}
