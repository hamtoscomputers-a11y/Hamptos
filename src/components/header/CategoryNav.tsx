import { Menu } from "lucide-react"
import { NavLink } from "react-router-dom"
import AllCategoriesMenu from "./AllCategoriesMenu"
import QuoteButton from "./QuoteButton"
import { NAV_CATEGORIES } from "./navigation"

interface CategoryNavProps {
  categories: any[]
  isLoading: boolean
  error: unknown
  isMenuOpen: boolean
  onToggleMenu: () => void
  onCloseMenu: () => void
}

/** Desktop category rail: All Categories dropdown, primary links, quote CTA. */
const CategoryNav = ({
  categories,
  isLoading,
  error,
  isMenuOpen,
  onToggleMenu,
  onCloseMenu,
}: CategoryNavProps) => (
  /* White, not the navy of the previous design: the Figma runs one unbroken
     white field from under the blue utility strip down to the hero, with the
     links set in black and the quote button carrying the only colour. */
  <nav aria-label="Categories" className="mt-[17px] hidden bg-white md:block">
    <div className="container mx-auto px-4">
      <div className="flex h-10 items-center gap-6">
        {/* Full-height so the dropdown's `top-full` lands on the bar's bottom edge, not the button's. */}
        <div className="relative flex h-full items-center">
          <button
            type="button"
            onClick={onToggleMenu}
            aria-expanded={isMenuOpen}
            className="flex items-center gap-2 text-sm font-semibold text-black transition-colors hover:text-brand-700"
          >
            <Menu size={18} aria-hidden />
            All Categories
          </button>

          {/* Pure positioning only: the card styling now lives inside the menu
              so its flyout can escape the panel instead of being clipped. */}
          {isMenuOpen && (
            <div className="absolute left-0 top-full z-[100] mt-1 origin-top animate-in fade-in-0 slide-in-from-top-2 duration-200 ease-out motion-reduce:animate-none">
              <AllCategoriesMenu
                categories={categories}
                isLoading={isLoading}
                error={error}
                onNavigate={onCloseMenu}
              />
            </div>
          )}
        </div>

        {/* The full link row plus the CTA needs ~955px, so below lg it would
            push the page into a horizontal scroll. All Categories covers the
            same ground until there is room. */}
        <ul className="hidden items-center gap-5 lg:flex lg:gap-7">
          {NAV_CATEGORIES.map(({ label, href }) => (
            <li key={label}>
              <NavLink
                to={href}
                className="whitespace-nowrap text-sm text-black transition-colors hover:text-brand-700"
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        <QuoteButton className="ml-auto" />
      </div>
    </div>
  </nav>
)

export default CategoryNav
