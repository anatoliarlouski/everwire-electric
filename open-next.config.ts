import { defineCloudflareConfig } from "@opennextjs/cloudflare"

// All pages are statically prerendered; no incremental cache needed.
export default defineCloudflareConfig({})
