import { Helmet } from "react-helmet-async"
import { useLocation } from "react-router-dom"

export const SITE_URL = "https://hamtos.com"
export const SITE_NAME = "Hamtos Computers"
export const DEFAULT_TITLE = "Hamtos Computers - IT & Networking Hardware Distributor in Dubai"
export const DEFAULT_DESCRIPTION =
  "Switches, firewalls, routers, servers, access points and gateways from Huawei, MikroTik, Ubiquiti, D-Link and more. Trusted IT hardware distribution across Dubai and the UAE."
export const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`

// Query parameters that define a distinct, indexable listing. Everything else
// (search, sort, page, price and stock filters) is a view of the same set, so
// it is dropped from the canonical URL.
const CANONICAL_PARAMS = ["category", "parent_id", "subcategory", "brand"]

export function canonicalFor(pathname: string, search = ""): string {
  const path = pathname === "/" ? "/" : pathname.replace(/\/+$/, "")
  const params = new URLSearchParams(search)
  const kept = new URLSearchParams()
  for (const key of CANONICAL_PARAMS) {
    const value = params.get(key)
    if (value) kept.set(key, value)
  }
  const query = kept.toString()
  return `${SITE_URL}${path}${query ? `?${query}` : ""}`
}

/** Plain text from ERP rich-text, trimmed to a meta-description length. */
export function toDescription(html: string | undefined | null, max = 160): string {
  if (!html) return ""
  const text = String(html)
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim()
  if (text.length <= max) return text
  const cut = text.slice(0, max - 1)
  return `${cut.slice(0, cut.lastIndexOf(" ") > 80 ? cut.lastIndexOf(" ") : cut.length).trim()}…`
}

interface SeoProps {
  title?: string
  description?: string
  /** Absolute canonical URL. Defaults to the current path with filter params stripped. */
  canonical?: string
  image?: string
  type?: "website" | "product"
  noindex?: boolean
  jsonLd?: Record<string, unknown> | Record<string, unknown>[]
}

/**
 * Per-route head tags. index.html carries the same tags with data-rh="true" as
 * the no-JavaScript fallback; Helmet replaces them once a route renders.
 */
const Seo = ({
  title,
  description,
  canonical,
  image = DEFAULT_IMAGE,
  type = "website",
  noindex = false,
  jsonLd,
}: SeoProps) => {
  const location = useLocation()
  const fullTitle = title?.trim() || DEFAULT_TITLE
  const desc = description?.trim() || DEFAULT_DESCRIPTION
  const url = canonical || canonicalFor(location.pathname, location.search)
  const blocks = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : []

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      {noindex ? <meta name="robots" content="noindex, follow" /> : <link rel="canonical" href={url} />}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={image} />
      {blocks.map((block, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(block)}
        </script>
      ))}
    </Helmet>
  )
}

export default Seo
