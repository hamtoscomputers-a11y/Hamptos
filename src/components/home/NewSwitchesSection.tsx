import { useMemo } from "react"
import { useLatestProducts } from "@/api/hooks/useProducts"
import ProductCarouselSection from "./ProductCarouselSection"
import { toCardProduct } from "./productCard"

const TITLE = "New Switches Collections"
const SUBTITLE =
  "Hamtos is your trusted source for IT devices in Dubai. We know that having the right technology plays a key role in helping businesses grow and succeed."

/** Cards in the track. Five show at a time, so this leaves room to scroll. */
const RAIL_LIMIT = 12

/**
 * How much of the recent catalogue to pull before narrowing to switches.
 *
 * The ERP has no way to ask for "the newest switches": `/products/latest` is
 * ordered but unfiltered, and `/products/search?q=switch` filters but ignores
 * every ordering parameter — `order_by`, `sort`, `order` all come back in the
 * same arbitrary sequence. So the recency has to come from `latest` and the
 * narrowing from us. 24 rows is enough to fill a 12-card rail: 37 of the 40
 * most recent products are switches.
 */
const FETCH_LIMIT = 24

/** The ERP ignores this, but the endpoint requires the parameter. */
const RECENT_DAYS = 365

/**
 * "New Switches Collections" — the newest switches in the catalogue.
 *
 * Same rail as the best-seller section above it, minus the filter tabs: the
 * Figma draws this one as a plain heading over a single track.
 */
const NewSwitchesSection = () => {
  const { data, isLoading, error } = useLatestProducts(FETCH_LIMIT, RECENT_DAYS)

  // Matched on the product name rather than a category: the ERP files all but
  // one of its 430 products under Networking, so the category tells us nothing
  // about which of them are switches.
  const products = useMemo(
    () =>
      (data?.data ?? [])
        .filter((item: any) => /switch/i.test(item?.name ?? ""))
        .map(toCardProduct)
        .filter((product) => product.name)
        .slice(0, RAIL_LIMIT),
    [data],
  )

  return (
    <ProductCarouselSection
      title={TITLE}
      subtitle={SUBTITLE}
      products={products}
      isLoading={isLoading}
      error={error}
      exploreHref="/products?search=switch"
    />
  )
}

export default NewSwitchesSection
