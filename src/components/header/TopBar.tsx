import { Mail, Phone } from "lucide-react"
import { CONTACT, SHIPPING_NOTICE } from "./navigation"

/** Slim blue utility strip above the main header. */
const TopBar = () => (
  <div className="bg-brand-gradient text-white">
    <div className="container mx-auto px-4">
      <div className="flex h-9 items-center gap-4 text-[13px] sm:gap-8">
        <span className="truncate">{SHIPPING_NOTICE}</span>

        <div className="ml-auto flex items-center gap-4 sm:ml-0 sm:gap-8">
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
