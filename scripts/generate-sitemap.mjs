// Writes dist/sitemap.xml from the live catalogue. Runs after `vite build`
// (see package.json), so the committed dist/ the VPS serves carries a sitemap
// that is as fresh as the last build.
//
// URLs match what the storefront links to and what src/components/Seo.tsx
// declares as canonical:
//   products   /product/<createSlug(name)>
//   brands     /brand/<id>/products
//   categories /products?category=<id>[&parent_id=<id>]   (non-empty only)
//
// If the API cannot be reached the build still succeeds, but the existing
// dist/sitemap.xml is kept rather than replaced with a partial one.

import { writeFileSync, existsSync } from "node:fs"
import { fileURLToPath } from "node:url"
import path from "node:path"

const SITE = "https://hamtos.com"
const API = process.env.SITEMAP_API_URL || "https://portal.hamtos.com/api/v1"
// Same public storefront key the browser bundle sends (src/api/axios.ts).
const KEY = process.env.VITE_API_KEY || "s40cs8wg4cwwo8cgsko0o4g88www8g4co8w4k004"
const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "dist", "sitemap.xml")

// Keep in step with createSlug in src/lib/utils.ts.
const createSlug = (name) =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")

const xmlEscape = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;")

async function get(endpoint, params = {}) {
  const url = new URL(`${API}/${endpoint}`)
  for (const [k, v] of Object.entries({ ...params, "api-key": KEY })) url.searchParams.set(k, String(v))
  const res = await fetch(url, { headers: { Accept: "application/json" } })
  if (!res.ok) throw new Error(`${endpoint}: HTTP ${res.status}`)
  return res.json()
}

async function allProducts() {
  const limit = 200
  const out = []
  // `start` is a 1-based offset on this API.
  for (let start = 1; ; start += limit) {
    const page = await get("products", { limit, start })
    const rows = page.data ?? []
    out.push(...rows)
    if (rows.length < limit || out.length >= Number(page.total ?? 0)) break
  }
  return out
}

async function main() {
  const [products, brands, categories] = await Promise.all([
    allProducts(),
    get("brands", { limit: 500 }).then((r) => r.data ?? []),
    get("products/categories").then((r) => r.data ?? []),
  ])

  const urls = new Set([
    `${SITE}/`,
    `${SITE}/products`,
    `${SITE}/get-quote`,
    `${SITE}/terms-and-conditions`,
    `${SITE}/privacy-policy`,
    `${SITE}/returns-and-refund-policy`,
  ])

  for (const c of categories) {
    if (!(Number(c.product_count) > 0)) continue
    const parent = String(c.parent_id ?? "0")
    urls.add(
      parent === "0"
        ? `${SITE}/products?category=${c.id}`
        : `${SITE}/products?category=${parent}&parent_id=${c.id}`,
    )
  }
  for (const b of brands) {
    if (b.product_count !== undefined && !(Number(b.product_count) > 0)) continue
    urls.add(`${SITE}/brand/${b.id}/products`)
  }
  for (const p of products) {
    const slug = createSlug(String(p.name ?? ""))
    if (slug) urls.add(`${SITE}/product/${slug}`)
  }

  const body = [...urls].map((u) => `  <url><loc>${xmlEscape(u)}</loc></url>`).join("\n")
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`
  writeFileSync(OUT, xml)
  console.log(`sitemap: ${urls.size} URLs (${products.length} products, ${brands.length} brands) -> dist/sitemap.xml`)
}

main().catch((err) => {
  console.warn(`sitemap: skipped (${err.message}).${existsSync(OUT) ? " Kept the existing dist/sitemap.xml." : ""}`)
})
