import { useMemo } from "react"
import { useProductsByCategory } from "@/api/hooks/useCategories"
import ProductCarouselSection from "./ProductCarouselSection"
import { toCardProduct } from "./productCard"

export interface SectionCategory {
  id: string
  name: string
}

interface CategoryProductsSectionProps {
  category?: SectionCategory
}

const SUBTITLE = "Find top-quality IT products at great prices in Dubai. Perfect for businesses and everyday use."

/**
 * Product rail for a single live catalogue category.
 *
 * Takes the category as a prop rather than reaching into `homeCategories[n]`
 * by index — the ERP controls that ordering, so an index silently renders the
 * wrong category the moment someone reorders or hides one.
 *
 * Note the category endpoint nests results under `products`, unlike the flat
 * product endpoints which use `data`.
 */
const CategoryProductsSection = ({ category }: CategoryProductsSectionProps) => {
  const params = useMemo(() => ({ limit: 10, start: 1, include: "brand,category,photos" }), [])
  const { data, isLoading, error } = useProductsByCategory(category?.id ?? "", params)

  const products = useMemo(
    () => ((data as any)?.products ?? []).map(toCardProduct).filter((p: any) => p.name),
    [data],
  )

  if (!category) return null

  return (
    <ProductCarouselSection
      title={`${category.name} Product in Hamtos`}
      subtitle={SUBTITLE}
      products={products}
      isLoading={isLoading}
      error={error}
      exploreHref={`/products?category=${category.id}`}
    />
  )
}

export default CategoryProductsSection
