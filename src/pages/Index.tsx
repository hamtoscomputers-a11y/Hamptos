"use client"

import { useEffect, useMemo, useState } from "react"
import BrandsWeCarrySection from "@/components/BrandsWeCarrySection"
import LatestProductsSection from "@/components/LatestProductsSection"
import NewsletterSection from "@/components/NewsletterSection"
import SwitchesCategorySection from "@/components/SwitchesCategorySection"
import TelephoneCategorySection from "@/components/TelephoneCategorySection"
import TopCategories from "@/components/TopCategories"
import BestSellingSection from "@/components/home/BestSellingSection"
import BestSellingShowcase from "@/components/home/BestSellingShowcase"
import CategoryIconRail from "@/components/home/CategoryIconRail"
import FeaturedProducts from "@/components/home/FeaturedProducts"
import HeroSlider from "@/components/home/HeroSlider"
import PromoBanner from "@/components/home/PromoBanner"
import ServiceFeatures from "@/components/home/ServiceFeatures"
import { ProductService } from "@/api"
import { useCategories } from "../api/hooks/useCategories"
import { useProducts } from "../api/hooks/useProducts"

const Index = () => {
  const productParams = useMemo(
    () => ({
      limit: 10,
      start: 1,
      include: "brand,category,photos",
    }),
    [],
  )

  const categoryParams = useMemo(
    () => ({
      limit: 100,
      start: 1,
      include_products: true,
    }),
    [],
  )

  const { data: categoriesData, isLoading: categoriesLoading, error: categoriesError } = useCategories(categoryParams)
  useProducts(productParams)

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

      <div className="w-full">
        {/* Today Deals Section */}
        {homeCategories[0]?.showinhome == 1 && (
          <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-16 mb-8">
            <div className="bg-white rounded-lg p-4 sm:p-6">
              <TelephoneCategorySection homeCategories={homeCategories} />
            </div>
          </div>
        )}



        <PromoBanner slide={slides?.[4]} className="mb-6" />

        {/* Networking Products & Servers */}
        {homeCategories[1]?.showinhome == 1 && (
          <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-16 mb-8">
            <div className="bg-white rounded-lg p-4 sm:p-6">
              <SwitchesCategorySection homeCategories={homeCategories} />
            </div>
          </div>
        )}

        {/* Top Categories Section */}
        <div className="mb-8">
          <TopCategories categories={categories} />
        </div>

        {/* Latest Products Section */}
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-16 mb-8">
          <div className="bg-white rounded-lg p-4 sm:p-6">
            <LatestProductsSection />
          </div>
        </div>
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
