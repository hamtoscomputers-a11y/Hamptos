import { useMemo } from "react"
import { useBestSellers } from "@/api/hooks/useProducts"
import ProductCarouselSection, { type CarouselChip } from "./ProductCarouselSection"
import { toCardProduct } from "./productCard"

interface BestSellingSectionProps {
  /** Live categories, rendered as chips under the subtitle. */
  categories?: CarouselChip[]
}

const TITLE = "Best selling products"
const SUBTITLE = "Find top-quality IT products at great prices in Dubai. Perfect for businesses and everyday use."
const CHIP_LIMIT = 1

const BestSellingSection = ({ categories = [] }: BestSellingSectionProps) => {
  const { data, isLoading, error } = useBestSellers(10, 1, "brand,category,photos")

  const products = useMemo(() => (data?.data ?? []).map(toCardProduct).filter((p) => p.name), [data])

  return (
    <ProductCarouselSection
      title={TITLE}
      subtitle={SUBTITLE}
      products={products}
      isLoading={isLoading}
      error={error}
      chips={categories.slice(0, CHIP_LIMIT)}
    />
  )
}

export default BestSellingSection
