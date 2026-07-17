import { useMemo } from "react"
import { useLatestProducts } from "@/api/hooks/useProducts"
import ProductCarouselSection from "./ProductCarouselSection"
import { toCardProduct } from "./productCard"

const TITLE = "Latest Products"
const SUBTITLE =
  "Hamtos is your trusted source for IT devices in Dubai. We know that having the right technology plays a key role in helping businesses grow and succeed."

/** Days window the ERP uses to decide what counts as "latest". */
const RECENT_DAYS = 30

const LatestProducts = () => {
  const { data, isLoading, error } = useLatestProducts(10, RECENT_DAYS, "brand,category,photos")

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

export default LatestProducts
