import fb from "@/assets/fb.svg"
import linkedin from "@/assets/linked.svg"
import twitter from "@/assets/x.svg"
import whatsapp from "@/assets/whatsapp.svg"
import youtube from "@/assets/youtube.svg"
import { CONTACT } from "@/components/header/navigation"

export interface FooterLink {
  label: string
  href: string
}

/** Category rail across the footer, mirroring the storefront's own routes. */
export const FOOTER_NAV: FooterLink[] = [
  { label: "Network Switches", href: "/network-switches" },
  { label: "Computer & Laptops", href: "/computers-laptops" },
  { label: "Mobiles & Tablets", href: "/mobiles-tablets" },
  { label: "Electronics", href: "/electronics" },
  { label: "New Releases", href: "/new-releases" },
  { label: "Clearance Sale", href: "/clearance-sale" },
  { label: "Contact Us", href: "/get-quote" },
]

export interface SocialLink {
  name: string
  icon: string
  url: string
}

/**
 * Facebook and X carry the accounts already published on the site. WhatsApp is
 * derived from the storefront's own number. YouTube and LinkedIn follow the
 * handle pattern used by the other accounts and are UNVERIFIED — confirm them
 * before launch.
 */
export const SOCIAL_LINKS: SocialLink[] = [
  { name: "Facebook", icon: fb, url: "https://www.facebook.com/hamtoscomputers/" },
  { name: "Twitter", icon: twitter, url: "https://x.com/HamtosComputers" },
  { name: "Youtube", icon: youtube, url: "https://www.youtube.com/@hamtoscomputers" },
  { name: "Linkedin", icon: linkedin, url: "https://www.linkedin.com/company/hamtoscomputers" },
  { name: "Whatsapp", icon: whatsapp, url: `https://wa.me/${CONTACT.phone.replace(/\D/g, "")}` },
]

/** Product ranges Hamtos sells. Marketing copy — not catalogue categories. */
const toSearchHref = (label: string) => `/products?search=${encodeURIComponent(label)}`

export const OUR_PRODUCTS: FooterLink[] = [
  "Security and Firewalls",
  "Ip Telephony & Pbx",
  "Backup and Storage",
  "Switches,Routers & Access Points",
  "Laptops",
  "Cables and Racks",
  "Monitors",
  "PDU and UPS",
  "Server and Virtualization",
  "Antivirus",
].map((label) => ({ label, href: toSearchHref(label) }))

/** Services Hamtos offers. No pages exist for these, so they render as text. */
export const IT_SERVICES: string[] = [
  "Managed Security Services",
  "WIFI as a services",
  "Cloud Hosted PBX on rent",
  "IP/PBX as a services",
  "Asterisk Configuration Services",
  "Advanced IT AMC Services in Dubai",
  "Best Email or Spam Protection in Dubai",
  "Networking Support Services",
]

/** Real trading address — the Figma's placeholders are not used. */
export const ADDRESS_LINES = [
  "SHOP NO-14 GATEWAY HOTEL BUILDING,",
  "BURDUBAI, DUBAI, UAE",
  "LAND LINE-042528481",
]
