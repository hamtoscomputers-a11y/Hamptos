"use client"

import { useEffect, useMemo, useState } from "react"
import BestSellingHighlight from "@/components/home/BestSellingHighlight"
import BestSellingSection from "@/components/home/BestSellingSection"
import BrandWall from "@/components/home/BrandWall"
import CategoryMosaic from "@/components/home/CategoryMosaic"
import CategoryProductsSection from "@/components/home/CategoryProductsSection"
import CategoryTileGrid from "@/components/home/CategoryTileGrid"
import HeroSlider from "@/components/home/HeroSlider"
import ItemsYouMayLike from "@/components/home/ItemsYouMayLike"
import LatestProducts from "@/components/home/LatestProducts"
import NewFirewallsSection from "@/components/home/NewFirewallsSection"
import NewServersSection from "@/components/home/NewServersSection"
import NewSwitchesSection from "@/components/home/NewSwitchesSection"
import NewsletterPanel from "@/components/home/NewsletterPanel"
import PrototypeNote from "@/components/PrototypeNote"
import PricingPromo from "@/components/home/PricingPromo"
import PromoBanner from "@/components/home/PromoBanner"
import PromoTileBand from "@/components/home/PromoTileBand"
import ShopByCategories from "@/components/home/ShopByCategories"

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

  const { data: categoriesData, isLoading: categoriesLoading } = useCategories(categoryParams)

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

  // Subcategories, flattened across the home-flagged parents only — a parent
  // hidden from the homepage must not leak its children back in.
  // A child links via its parent's id plus `parent_id`: the ERP's convention,
  // matching the header menu, where `parent_id` carries the *child* id.
  const subCategories = useMemo(
    () =>
      homeCategories.flatMap((parent: any) =>
        (parent.children ?? []).map((child: any) => ({
          id: child.id,
          name: child.name,
          image: child.image_url || child.image || "",
          href: `/products?category=${parent.id}&parent_id=${child.id}`,
        })),
      ),
    [homeCategories],
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
      <HeroSlider slides={slides} isLoading={slidesLoading} />

      <CategoryMosaic />

      <BestSellingSection />

      <PricingPromo />

      <NewSwitchesSection />

      {/* One full-bleed `#F8F8F8` band holding the brand wall and the servers
          rail: 36 above, 54 between the two, 70 below, per the Figma frame. */}
      <div className="flex flex-col gap-[54px] bg-surface-band pb-[70px] pt-9">
        <BrandWall />
        <NewServersSection />
      </div>

      <ShopByCategories />

      <NewFirewallsSection />

      <PromoTileBand slides={slides} isLoading={slidesLoading} />

      <CategoryProductsSection category={networkingCategory} />

      <PromoBanner slide={slides?.[4]} aspectClassName="aspect-[1199/263]" contained className="mb-8" />

      <BestSellingHighlight />

      <CategoryTileGrid
        title="Top Categories"
        subtitle="Explore top trusted brands in IT products, all in one place."
        categories={homeCategories}
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

      <PrototypeNote />

      <NewsletterPanel />
    </div>
  )
}

export default Index
