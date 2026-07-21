import { useMemo } from "react"
import { useLatestProducts } from "@/api/hooks/useProducts"
import ProductCarouselSection from "./ProductCarouselSection"
import { toCardProduct } from "./productCard"

/** Shared by every "New X Collections" rail, per the Figma. */
export const COLLECTION_SUBTITLE =
  "Hamtos is your trusted source for IT devices in Dubai. We know that having the right technology plays a key role in helping businesses grow and succeed."

/** Cards in the track. Five show at a time, so this leaves room to scroll. */
const RAIL_LIMIT = 12

/**
 * How much of the recent catalogue to pull before narrowing to a range.
 *
 * The ERP has no way to ask for "the newest switches": `/products/latest` is
 * ordered but unfiltered, and `/products/search?q=…` filters but ignores every
 * ordering parameter — `order_by`, `sort` and `order` all come back in the same
 * arbitrary sequence. So the recency comes from `latest` and the narrowing from
 * us. Every rail built on this shares one request: same hook, same arguments,
 * so react-query serves the second one from cache.
 */
const FETCH_LIMIT = 40

/** The ERP ignores this, but the endpoint requires the parameter. */
const RECENT_DAYS = 365

interface NewCollectionRailProps {
  title: string
  /**
   * Which of the recent products belong to this rail, matched on the product
   * name. Not on the category: the ERP files all but one of its 430 products
   * under Networking, so the category says nothing about the range.
   */
  match: (name: string) => boolean
  exploreHref: string
}

/**
 * "New X Collections" — the newest products in one range of the catalogue.
 *
 * Same rail as the best-seller section, minus the filter tabs: the Figma draws
 * these as a plain heading over a single track.
 */
const NewCollectionRail = ({ title, match, exploreHref }: NewCollectionRailProps) => {
  const { data, isLoading, error } = useLatestProducts(FETCH_LIMIT, RECENT_DAYS)

  const products = useMemo(
    () =>
      (data?.data ?? [])
        .filter((item: any) => match(item?.name ?? ""))
        .map(toCardProduct)
        .filter((product) => product.name)
        .slice(0, RAIL_LIMIT),
    [data, match],
  )

  return (
    <ProductCarouselSection
      title={title}
      subtitle={COLLECTION_SUBTITLE}
      products={products}
      isLoading={isLoading}
      error={error}
      exploreHref={exploreHref}
    />
  )
}

export default NewCollectionRail
