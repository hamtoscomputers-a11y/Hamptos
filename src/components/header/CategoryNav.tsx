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
  <nav aria-label="Categories" className="hidden bg-ink-navy md:block">
    <div className="container mx-auto px-4">
      <div className="flex h-[52px] items-center gap-6">
        {/* Full-height so the dropdown's `top-full` lands on the bar's bottom edge, not the button's. */}
        <div className="relative flex h-full items-center">
          <button
            type="button"
            onClick={onToggleMenu}
            aria-expanded={isMenuOpen}
            className="flex items-center gap-2 text-sm font-semibold text-white transition-colors hover:text-brand-300"
          >
            <Menu size={18} aria-hidden />
            All Categories
          </button>

          {isMenuOpen && (
            <div className="absolute left-0 top-full z-[100] w-[250px] overflow-hidden bg-ink-navy shadow-2xl">
              <AllCategoriesMenu
                categories={categories}
                isLoading={isLoading}
                error={error}
                onNavigate={onCloseMenu}
              />
            </div>
          )}
        </div>

        <ul className="flex items-center gap-5 lg:gap-7">
          {NAV_CATEGORIES.map(({ label, href }) => (
            <li key={label}>
              <NavLink
                to={href}
                className="whitespace-nowrap text-sm text-white transition-colors hover:text-brand-300"
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
