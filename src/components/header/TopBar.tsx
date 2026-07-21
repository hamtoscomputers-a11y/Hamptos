import { Mail, Phone } from "lucide-react"
import { CONTACT, SHIPPING_NOTICE } from "./navigation"

/**
 * Slim blue utility strip above the main header.
 *
 * Flat `brand-600` rather than the brand gradient: the Figma fills this bar
 * with a single #147FC2, and a gradient reads as a seam against the flat blue
 * of the quote button below it.
 */
const TopBar = () => (
  <div className="bg-brand-600 text-white">
    <div className="container mx-auto px-4">
      {/* The three items are one left-aligned group in the Figma, not a
          shipping notice pushed apart from the contact details. Below `sm`
          the contacts collapse to their icons and move to the right, since
          all three lines of copy will not fit on a phone. */}
      <div className="flex h-10 items-center gap-4 text-[13px] sm:gap-7">
        <span className="truncate">{SHIPPING_NOTICE}</span>

        <div className="ml-auto flex items-center gap-4 sm:ml-0 sm:gap-7">
          <a href={CONTACT.phoneHref} className="flex items-center gap-2 hover:underline">
            <Phone size={14} aria-hidden />
            <span className="hidden sm:inline">{CONTACT.phone}</span>
          </a>
          <a href={CONTACT.emailHref} className="flex items-center gap-2 hover:underline">
            <Mail size={14} aria-hidden />
            <span className="hidden sm:inline">{CONTACT.email}</span>
          </a>
        </div>
      </div>
    </div>
  </div>
)

export default TopBar
