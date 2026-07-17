"use client"

import { useEffect, useMemo, useState } from "react"
import BrandsWeCarrySection from "@/components/BrandsWeCarrySection"
import NewsletterSection from "@/components/NewsletterSection"
import SwitchesCategorySection from "@/components/SwitchesCategorySection"
import BestSellingHighlight from "@/components/home/BestSellingHighlight"
import BestSellingSection from "@/components/home/BestSellingSection"
import BestSellingShowcase from "@/components/home/BestSellingShowcase"
import CategoryIconRail from "@/components/home/CategoryIconRail"
import CategoryProductsSection from "@/components/home/CategoryProductsSection"
import CategoryTileGrid from "@/components/home/CategoryTileGrid"
import FeaturedProducts from "@/components/home/FeaturedProducts"
import HeroSlider from "@/components/home/HeroSlider"
import ItemsYouMayLike from "@/components/home/ItemsYouMayLike"
import LatestProducts from "@/components/home/LatestProducts"
import PromoBanner from "@/components/home/PromoBanner"
import ServiceFeatures from "@/components/home/ServiceFeatures"

import { ProductService } from "@/api"
import { useCategories } from "../api/hooks/useCategories"

const Index = () => {
  const categoryParams = useMemo(
    () => ({
      limit: 100,
      start: 1,
      include_products: true,
    }),
    [],
  )

  const { data: categoriesData, isLoading: categoriesLoading, error: categoriesError } = useCategories(categoryParams)

  const categories = useMemo(() => {
    if (!categoriesData?.data) return []
    return categoriesData.data.map((category: any) => ({
      id: category.id,
      name: category.name,
      showinhome: category.showinhome,
      children: category.children || [],
      image: category.image_url || category.image || "",
    }))
  }, [categoriesData])

  const homeCategories = categories.filter((category) => category.showinhome == 1)

  // Resolved by name, not by array index: the ERP owns category ordering and
  // the showinhome flag, so an index silently points at the wrong category
  // whenever either changes.
  const networkingCategory = useMemo(
    () => homeCategories.find((category) => /networking/i.test(category.name)),
    [homeCategories],
  )

  // Subcategories, flattened across every parent. A child links via its
  // parent's id plus `parent_id` — the ERP's convention, matching the header
  // menu, where `parent_id` confusingly carries the *child* id.
  const subCategories = useMemo(
    () =>
      categories.flatMap((parent: any) =>
        (parent.children ?? []).map((child: any) => ({
          id: child.id,
          name: child.name,
          image: child.image_url || child.image || "",
          href: `/products?category=${parent.id}&parent_id=${child.id}`,
        })),
      ),
    [categories],
  )

  const [slides, setSlides] = useState<any[]>([])
  const [slidesLoading, setSlidesLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    ProductService.getWebsiteSlider()
      .then((response) => {
        if (!cancelled) setSlides(response?.data || [])
      })
      .catch(() => {
        if (!cancelled) setSlides([])
      })
      .finally(() => {
        if (!cancelled) setSlidesLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="min-h-screen">
      <ServiceFeatures />

      <HeroSlider slides={slides} isLoading={slidesLoading} />

      <CategoryIconRail categories={categories} isLoading={categoriesLoading} error={categoriesError} />

      <BestSellingSection categories={homeCategories} />

      <PromoBanner slide={slides?.[3]} />

      <div className="my-8">
        <BestSellingShowcase />
      </div>

      <FeaturedProducts />

      <CategoryProductsSection category={networkingCategory} />

      <PromoBanner slide={slides?.[4]} aspectClassName="aspect-[1199/263]" contained className="mb-8" />

      <BestSellingHighlight />

      <CategoryTileGrid
        title="Top Categories"
        subtitle="Explore top trusted brands in IT products, all in one place."
        categories={categories}
        isLoading={categoriesLoading}
      />

      <LatestProducts />

      <ItemsYouMayLike />

      <CategoryTileGrid
        title="Explore Other Categories"
        subtitle="Explore top trusted brands in IT products, all in one place."
        categories={subCategories}
        isLoading={categoriesLoading}
      />

      <div className="w-full">

        {/* Networking Products & Servers */}
        {homeCategories[1]?.showinhome == 1 && (
          <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-16 mb-8">
            <div className="bg-white rounded-lg p-4 sm:p-6">
              <SwitchesCategorySection homeCategories={homeCategories} />
            </div>
          </div>
        )}

      </div>

      {/* Newsletter Section */}
      <div className="mb-8">
        <NewsletterSection />
      </div>

      <div className="mb-8">
        <div className="rounded-lg">
          <BrandsWeCarrySection />
        </div>
      </div>
    </div>
  )
}

export default Index
