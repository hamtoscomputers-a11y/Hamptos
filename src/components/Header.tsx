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

  // Escape closes either menu — the outside-click catcher is mouse-only.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return
      setIsCategoryMenuOpen(false)
      setIsMobileMenuOpen(false)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  return (
    <header className="relative bg-white">
      <TopBar />

      {/* The Figma stacks the three bands to 166 overall: a 40px utility
          strip, 19px, the 50px logo/search row, 17px, then the 40px category
          rail. The gaps are what give the white block its breathing room, so
          the rows themselves sit tight around their content. */}
      <div className="container mx-auto px-4 pt-[19px]">
        {/* Logo, search and account spread across the full column, so the
            account cluster's right edge lands on the same line as the quote
            button below it. The Figma's 101px gutters are what that spacing
            works out to once the 1300 column holds a 223 logo, a 626 field and
            a 236 cluster — they are the result, not a fixed value. */}
        <div className="flex items-center justify-between gap-4 pb-2 md:h-[50px] md:pb-0 lg:gap-8">
          <Link to="/" className="flex-shrink-0" aria-label="Hamtos home">
            <img src={mainLogo} alt="Hamtos" className="h-8 w-auto md:h-[42px]" />
          </Link>

          <SearchBar
            value={query}
            onChange={setQuery}
            onSubmit={submit}
            // Fixed at its Figma width from `xl`, so the row's free space falls
            // into the two gutters instead of being swallowed by the field.
            // Not before: logo + 626 + account needs 1086, and the column is
            // only 960 at `lg`, which pushes the page into a sideways scroll.
            className="hidden flex-1 md:block md:max-w-md lg:max-w-xl xl:w-[626px] xl:max-w-[626px] xl:flex-none"
          />

          <div className="flex items-center gap-4">
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
