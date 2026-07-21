import { useMemo } from "react"
import { useQueries } from "@tanstack/react-query"
import { CategoryService } from "@/api"
import ProductCarouselSection from "./ProductCarouselSection"
import { toCardProduct } from "./productCard"

const TITLE = "New Servers Collections"
const SUBTITLE =
  "Hamtos is your trusted source for IT devices in Dubai. We know that having the right technology plays a key role in helping businesses grow and succeed."

/**
 * The ERP's server categories, by id.
 *
 * Servers are the one range the catalogue files properly, so this rail is
 * category-driven rather than name-matched like the switches one above it —
 * a server's name rarely contains the word.
 */
const SERVER_CATEGORY_IDS = [
  "55", // Rack Server
  "57", // Tower Server
  "56", // Server Rack
  "43", // Server and Storage
]

/** Cards in the track. Five show at a time, so this leaves room to scroll. */
const RAIL_LIMIT = 12

/** Newest first, so "New" means something. `order_by` works on this endpoint. */
const ORDER_BY = "id,desc"

/**
 * "New Servers Collections" — the newest products across the server categories.
 *
 * Same rail as the switches section, sitting inside the grey band with the
 * brand wall, so it carries the band's background rather than its own white one.
 */
const NewServersSection = () => {
  const results = useQueries({
    queries: SERVER_CATEGORY_IDS.map((id) => ({
      queryKey: ["categories", "products", id, { limit: RAIL_LIMIT, order_by: ORDER_BY }],
      queryFn: () =>
        CategoryService.getProductsByCategory(id, { limit: RAIL_LIMIT, start: 1, order_by: ORDER_BY }),
      staleTime: 5 * 60 * 1000,
    })),
  })

  const isLoading = results.some((result) => result.isLoading)
  // Only a total failure kills the rail — one category being unreachable still
  // leaves the others worth showing.
  const error = results.every((result) => result.isError) ? results[0]?.error : undefined

  const products = useMemo(
    () =>
      results
        .flatMap((result) => (result.data as any)?.products ?? [])
        // The categories overlap, so the same product can arrive twice.
        .filter(
          (item: any, index: number, all: any[]) =>
            all.findIndex((other) => other?.id === item?.id) === index,
        )
        .sort((a: any, b: any) => Number(b?.id ?? 0) - Number(a?.id ?? 0))
        .map(toCardProduct)
        .filter((product) => product.name)
        .slice(0, RAIL_LIMIT),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [results.map((result) => result.dataUpdatedAt).join()],
  )

  return (
    <ProductCarouselSection
      title={TITLE}
      subtitle={SUBTITLE}
      products={products}
      isLoading={isLoading}
      error={error}
      exploreHref={`/products?category=${SERVER_CATEGORY_IDS[0]}`}
      // Inside the grey band: no background of its own, and no vertical padding
      // — the band's 54px gap under the brand wall is the only spacing wanted.
      frameClassName=""
    />
  )
}

export default NewServersSection
