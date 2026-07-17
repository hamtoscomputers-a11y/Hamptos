/**
 * Static header content, kept out of the components so copy and links can be
 * edited without touching markup.
 */

export interface NavCategory {
  label: string
  /** Resolved against the live catalogue via the products search param. */
  href: string
}

const toSearchHref = (label: string) => `/products?search=${encodeURIComponent(label)}`

/** Primary category rail, per the Figma header design. */
export const NAV_CATEGORIES: NavCategory[] = [
  "Router",
  "Switches",
  "Firewalls",
  "Wireless",
  "Servers",
  "IP Phones",
  "Accessories",
  "Optical Network",
].map((label) => ({ label, href: toSearchHref(label) }))

export const CONTACT = {
  phone: "+97142528481",
  phoneHref: "tel:+97142528481",
  email: "info@hamtos.com",
  emailHref: "mailto:info@hamtos.com",
} as const

export const SHIPPING_NOTICE = "Express shipping to United Arab Emirates"

export const SEARCH_PLACEHOLDER = "I'm looking For....."
