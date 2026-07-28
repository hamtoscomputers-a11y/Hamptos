import { useMemo } from "react"
import ProductCarouselSection from "@/components/home/ProductCarouselSection"
import { toCardProduct } from "@/components/home/productCard"

interface RelatedProductsProps {
  /** Every product matching the current filters, before pagination. */
  products: any[]
  /**
   * Catalogue-wide pool used when the filters leave nothing over — an empty
   * category is exactly when the reader most needs somewhere to go next.
   */
  fallbackProducts?: any[]
  /** Ids on screen right now — excluded so the rail isn't a repeat of the grid. */
  shownIds: string[]
  isLoading: boolean
  /**
   * Presentation. Defaults are the listing page's centred dark rail; the
   * product detail page passes the Figma's white split treatment instead.
   */
  title?: string
  subtitle?: string
  tone?: "light" | "dark" | "blue"
  align?: "split" | "center"
  showExplore?: boolean
  exploreHref?: string
}

const MAX_ITEMS = 10

/**
 * Dark full-bleed rail under the listing. Reuses the home-page carousel so the
 * two can only drift deliberately, and draws on products already fetched for
 * the current filters rather than issuing another request.
 */
const RelatedProducts = ({
  products,
  fallbackProducts = [],
  shownIds,
  isLoading,
  title = "Related Product",
  subtitle,
  tone = "dark",
  align = "center",
  showExplore = false,
  exploreHref,
}: RelatedProductsProps) => {
  const related = useMemo(() => {
    const shown = new Set(shownIds.map(String))
    const pick = (pool: any[]) =>
      pool.filter((item) => item?.id && !shown.has(String(item.id))).slice(0, MAX_ITEMS)

    const fromFilters = pick(products)
    return (fromFilters.length > 0 ? fromFilters : pick(fallbackProducts)).map(toCardProduct)
  }, [products, fallbackProducts, shownIds])

  return (
    <ProductCarouselSection
      title={title}
      subtitle={subtitle}
      products={related}
      isLoading={isLoading}
      tone={tone}
      align={align}
      showExplore={showExplore}
      exploreHref={exploreHref}
    />
  )
}

export default RelatedProducts
