import { useMemo } from "react"
import { useQueries } from "@tanstack/react-query"
import { ProductService } from "@/api"
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

/**
 * Rows to pull on the search fallback.
 *
 * Wider than the rail because `match` still has to run over the results — a
 * search for "router" comes back with a third of its rows belonging to another
 * range — so requesting exactly a railful would leave the track half empty.
 * The search endpoint returns a slim 14-column row, so 30 costs ~13KB.
 */
const SEARCH_LIMIT = 30

interface NewCollectionRailProps {
  title: string
  /**
   * Which of the recent products belong to this rail, matched on the product
   * name. Not on the category: the ERP files all but one of its 430 products
   * under Networking, so the category says nothing about the range.
   */
  match: (name: string) => boolean
  /**
   * Falls back to a catalogue search when the recent window holds none of this
   * range — routers, for instance, are all older stock. Loses the recency
   * ordering, which the search endpoint has no way to honour, so it is only
   * used when `match` comes back empty.
   *
   * Several terms because the ERP's search matches whole words against one
   * field at a time: no single query returns a whole range. "access" finds 4
   * of the 6 wireless products, "wifi" finds 2 others. The results are merged
   * and deduplicated, then `match` decides what actually belongs.
   */
  searchTerms?: string[]
  exploreHref: string
  tone?: "light" | "blue"
  /** Passed through when the rail sits inside a coloured band. */
  frameClassName?: string
}

/**
 * "New X Collections" — the newest products in one range of the catalogue.
 *
 * Same rail as the best-seller section, minus the filter tabs: the Figma draws
 * these as a plain heading over a single track.
 */
const NewCollectionRail = ({
  title,
  match,
  searchTerms,
  exploreHref,
  tone = "light",
  frameClassName,
}: NewCollectionRailProps) => {
  const { data, isLoading, error } = useLatestProducts(FETCH_LIMIT, RECENT_DAYS)

  const recent = useMemo(
    () =>
      (data?.data ?? [])
        .filter((item: any) => match(item?.name ?? ""))
        .map(toCardProduct)
        .filter((product) => product.name)
        .slice(0, RAIL_LIMIT),
    [data, match],
  )

  // Only queried once the recent window is known to hold nothing — the queries
  // stay disabled otherwise, so no request goes out.
  const needsSearch = !isLoading && recent.length === 0 && !!searchTerms?.length

  const searches = useQueries({
    queries: (searchTerms ?? []).map((term) => ({
      queryKey: ["products", "search", { q: term, limit: SEARCH_LIMIT, start: 1 }],
      queryFn: () => ProductService.search({ q: term, limit: SEARCH_LIMIT, start: 1 }),
      enabled: needsSearch,
      staleTime: 5 * 60 * 1000,
    })),
  })

  const searching = searches.some((result) => result.isLoading)
  const searchedAt = searches.map((result) => result.dataUpdatedAt).join()

  const products = useMemo(() => {
    if (recent.length > 0) return recent
    const rows = searches.flatMap((result) => (result.data as any)?.results?.products ?? [])
    return rows
      .filter(
        (item: any, index: number, all: any[]) =>
          all.findIndex((other) => other?.id === item?.id) === index,
      )
      // `match` applies here too. A search term is only ever a broad stem —
      // "router" also returns MikroTik's Cloud Router *Switch* line — so
      // skipping the filter on this path puts the wrong range in the rail.
      .filter((item: any) => match(item?.name ?? ""))
      .map(toCardProduct)
      .filter((product: any) => product.name)
      .slice(0, RAIL_LIMIT)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recent, searchedAt, match])

  return (
    <ProductCarouselSection
      title={title}
      subtitle={COLLECTION_SUBTITLE}
      products={products}
      isLoading={isLoading || (needsSearch && searching)}
      error={error}
      exploreHref={exploreHref}
      tone={tone}
      frameClassName={frameClassName}
    />
  )
}

export default NewCollectionRail
