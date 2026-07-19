import { useEffect, useMemo, useState } from "react"
import { Menu, X } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { useSelector } from "react-redux"
import type { RootState } from "../store"
import { useCategories } from "../api/hooks/useCategories"
import mainLogo from "../assets/mainLogo.png"
import CategoryNav from "./header/CategoryNav"
import HeaderActions from "./header/HeaderActions"
import MobileMenu from "./header/MobileMenu"
import SearchBar from "./header/SearchBar"
import TopBar from "./header/TopBar"
import { useHeaderSearch } from "./header/useHeaderSearch"

const Header = () => {
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const location = useLocation()
  const { query, setQuery, submit } = useHeaderSearch()

  const cartItems = useSelector((state: RootState) => state.cart.items)
  const cartCount = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0)

  const categoryParams = useMemo(() => ({ include_products: true, limit: 20 }), [])
  const { data, isLoading, error } = useCategories(categoryParams)
  const categories = data?.data ?? []

  // Any navigation should leave both menus closed.
  useEffect(() => {
    setIsCategoryMenuOpen(false)
    setIsMobileMenuOpen(false)
  }, [location.pathname, location.search])

  return (
    <header className="relative bg-white">
      <TopBar />

      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center gap-4 lg:gap-8">
          <Link to="/" className="flex-shrink-0" aria-label="Hamtos home">
            <img src={mainLogo} alt="Hamtos" className="h-8 w-auto md:h-9" />
          </Link>

          <SearchBar
            value={query}
            onChange={setQuery}
            onSubmit={submit}
            className="hidden flex-1 md:block md:max-w-md lg:max-w-xl"
          />

          <div className="ml-auto flex items-center gap-4">
            <HeaderActions cartCount={cartCount} />

            <button
              type="button"
              className="text-brand-950 md:hidden"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen((open) => !open)}
            >
              {isMobileMenuOpen ? <X size={24} aria-hidden /> : <Menu size={24} aria-hidden />}
            </button>
          </div>
        </div>

        <SearchBar value={query} onChange={setQuery} onSubmit={submit} className="pb-4 md:hidden" />
      </div>

      <CategoryNav
        categories={categories}
        isLoading={isLoading}
        error={error}
        isMenuOpen={isCategoryMenuOpen}
        onToggleMenu={() => setIsCategoryMenuOpen((open) => !open)}
        onCloseMenu={() => setIsCategoryMenuOpen(false)}
      />

      {isMobileMenuOpen && (
        <MobileMenu categories={categories} onClose={() => setIsMobileMenuOpen(false)} />
      )}

      {isCategoryMenuOpen && (
        <div
          /* Invisible catcher: closes the menu on an outside click without dimming the page. */
          className="fixed inset-0 z-[90] hidden md:block"
          onClick={() => setIsCategoryMenuOpen(false)}
          aria-hidden
        />
      )}
    </header>
  )
}

export default Header
