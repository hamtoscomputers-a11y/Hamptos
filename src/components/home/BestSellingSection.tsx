import { useMemo, useState } from "react"
import { useProductSearch } from "@/api/hooks/useProducts"
import ProductCarouselSection, { type CarouselTab } from "./ProductCarouselSection"
import { toCardProduct } from "./productCard"

const TITLE = "Best selling products"
const SUBTITLE =
  "Hamtos is your trusted source for IT devices in Dubai. We know that having the right technology plays a key role in helping businesses grow and succeed."

/**
 * The Figma's four filter tabs.
 *
 * Curated labels rather than ERP categories, for the same reason the homepage
 * mosaic uses them: the catalogue's own category names either do not exist
 * here (`Routers`, `Firewalls`) or return nothing when searched (`POS`,
 * `IT Accessories`).
 *
 * `term` is the singular stem the catalogue actually matches on — searching
 * the plural label finds a fraction of the range ("Switches" 8, "switch" 380).
 */
const TABS: CarouselTab[] = [
  { label: "Switches", term: "switch" },
  { label: "Routers", term: "router" },
  { label: "Firewalls", term: "firewall" },
  { label: "Wireless", term: "wireless" },
]

/** Cards in the track. Five show at a time, so this leaves room to scroll. */
const RAIL_LIMIT = 12

/**
 * Best-seller rail with live category tabs.
 *
 * Each tab re-queries the catalogue in place rather than navigating — only
 * Explore All leaves the page, and it carries the selected tab with it.
 *
 * Fetched per tab through the search endpoint (~5KB a tab, cached by
 * react-query) rather than by pulling the best-seller list and filtering it
 * here: the ERP has no category parameter on `/best-sellers`, and covering
 * every tab from that endpoint means requesting 200 products — 775KB — since
 * it returns every column whatever `include` says.
 */
const BestSellingSection = () => {
  const [activeTab, setActiveTab] = useState(TABS[0].label)

  const term = useMemo(
    () => TABS.find((tab) => tab.label === activeTab)?.term ?? TABS[0].term,
    [activeTab],
  )

  const params = useMemo(() => ({ q: term, limit: RAIL_LIMIT, start: 1 }), [term])
  // `isLoading` is the cold start; `isFetching` also covers a tab change, where
  // the previous tab's cards are still on screen and only want dimming.
  const { data, isLoading, isFetching, error } = useProductSearch(params)

  // The search endpoint nests its rows under `results.products`, unlike the
  // flat product endpoints which use `data`.
  const products = useMemo(
    () => ((data as any)?.results?.products ?? []).map(toCardProduct).filter((p: any) => p.name),
    [data],
  )

  return (
    <ProductCarouselSection
      title={TITLE}
      subtitle={SUBTITLE}
      products={products}
      isLoading={isLoading}
      isRefreshing={isFetching && !isLoading}
      error={error}
      tabs={TABS}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      exploreHref={`/products?search=${encodeURIComponent(term)}`}
    />
  )
}

export default BestSellingSection
