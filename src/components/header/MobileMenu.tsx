import { Mail, Phone } from "lucide-react"
import { Link } from "react-router-dom"
import QuoteButton from "./QuoteButton"
import { CONTACT, NAV_CATEGORIES } from "./navigation"

interface MobileMenuProps {
  categories: any[]
  onClose: () => void
}

/** Drawer contents for viewports below the `md` breakpoint. */
const MobileMenu = ({ categories, onClose }: MobileMenuProps) => (
  <div className="absolute inset-x-0 top-full z-50 border-t border-surface-line bg-white shadow-lg md:hidden">
    <div className="container mx-auto space-y-6 px-4 py-5">
      <ul className="space-y-1">
        {NAV_CATEGORIES.map(({ label, href }) => (
          <li key={label}>
            <Link
              to={href}
              onClick={onClose}
              className="block rounded-md px-3 py-2.5 text-sm text-brand-950 hover:bg-gray-50 hover:text-brand-700"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>

      {categories.length > 0 && (
        <div className="border-t border-surface-line pt-4">
          <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
            All Categories
          </p>
          <ul className="space-y-1">
            {categories.map((category: any) => (
              <li key={category.id}>
                <Link
                  to={`/products?category=${category.id}`}
                  onClick={onClose}
                  className="block rounded-md px-3 py-2 text-sm text-brand-950 hover:bg-gray-50 hover:text-brand-700"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-2 border-t border-surface-line pt-4 text-sm text-brand-950">
        <a href={CONTACT.phoneHref} className="flex items-center gap-2 px-3 py-1.5">
          <Phone size={16} className="text-brand-700" aria-hidden />
          {CONTACT.phone}
        </a>
        <a href={CONTACT.emailHref} className="flex items-center gap-2 px-3 py-1.5">
          <Mail size={16} className="text-brand-700" aria-hidden />
          {CONTACT.email}
        </a>
      </div>

      <QuoteButton className="w-full justify-center" />
    </div>
  </div>
)

export default MobileMenu
