import { useMemo } from "react"
import { useProducts } from "@/api/hooks/useProducts"
import ProductCarouselSection from "./ProductCarouselSection"
import { toCardProduct } from "./productCard"

const TITLE = "Items you may like"
const SUBTITLE =
  "Hamtos is your trusted source for IT devices in Dubai. We know that having the right technology plays a key role in helping businesses grow and succeed."

/**
 * General catalogue rail.
 *
 * The ERP exposes no recommendation endpoint, so this reads the plain product
 * listing — which returns a different ordering from the featured/best-seller/
 * latest collections, so the rail shows items the rest of the page does not.
 * Swap the hook here if a recommendations endpoint ever lands.
 */
const ItemsYouMayLike = () => {
  const params = useMemo(() => ({ limit: 10, start: 1, include: "brand,category,photos" }), [])
  const { data, isLoading, error } = useProducts(params)

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

export default ItemsYouMayLike
