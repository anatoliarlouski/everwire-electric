import path from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    qualities: [75, 85],
  },
  trailingSlash: true,
  distDir: '.next',
  turbopack: {
    // Several lockfiles exist above this folder; pin the workspace root here.
    root: projectRoot,
  },
}

export default nextConfig
