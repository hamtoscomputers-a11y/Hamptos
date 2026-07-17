import { useMemo } from "react"
import { useFeaturedProducts } from "@/api/hooks/useProducts"
import ProductCarouselSection from "./ProductCarouselSection"
import { toCardProduct } from "./productCard"

const TITLE = "Featured Products"
const SUBTITLE =
  "Hamtos is your trusted source for IT devices in Dubai. We know that having the right technology plays a key role in helping businesses grow and succeed."

const FeaturedProducts = () => {
  const params = useMemo(() => ({ limit: 10, start: 1, include: "brand,category,photos" }), [])
  const { data, isLoading, error } = useFeaturedProducts(params)

  const products = useMemo(() => (data?.data ?? []).map(toCardProduct).filter((p) => p.name), [data])

  return (
    <ProductCarouselSection
      title={TITLE}
      subtitle={SUBTITLE}
      products={products}
      isLoading={isLoading}
      error={error}
    />
  )
}

export default FeaturedProducts
