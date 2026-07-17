import { useMemo } from "react"
import { useBestSellers } from "@/api/hooks/useProducts"
import ProductCarouselSection from "./ProductCarouselSection"
import { toCardProduct } from "./productCard"

const TITLE = "Best Selling Products Of The Hamtos"
const SUBTITLE =
  "We are a leading IT device e-commerce company in Dubai. At Hamtos, we understand how important reliable IT equipment is for the success of any business."

/** Navy full-bleed best-seller rail. */
const BestSellingHighlight = () => {
  const { data, isLoading, error } = useBestSellers(10, 1, "brand,category,photos")

  const products = useMemo(() => (data?.data ?? []).map(toCardProduct).filter((p) => p.name), [data])

  return (
    <ProductCarouselSection
      title={TITLE}
      subtitle={SUBTITLE}
      products={products}
      isLoading={isLoading}
      error={error}
      tone="dark"
    />
  )
}

export default BestSellingHighlight
