"use client"

import { useEffect, useState } from "react"
import BestSellingSection from "@/components/home/BestSellingSection"
import BrandWall from "@/components/home/BrandWall"
import CategoryMosaic from "@/components/home/CategoryMosaic"
import HeroSlider from "@/components/home/HeroSlider"
import NewFirewallsSection from "@/components/home/NewFirewallsSection"
import NewServersSection from "@/components/home/NewServersSection"
import NewGatewaysSection from "@/components/home/NewGatewaysSection"
import NewSwitchesSection from "@/components/home/NewSwitchesSection"
import NewWirelessSection from "@/components/home/NewWirelessSection"
import NewsletterPanel from "@/components/home/NewsletterPanel"
import PricingPromo from "@/components/home/PricingPromo"
import PromoBanner from "@/components/home/PromoBanner"
import PromoTileBand from "@/components/home/PromoTileBand"
import ShopByCategories from "@/components/home/ShopByCategories"

import { ProductService } from "@/api"

const Index = () => {
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
      {/* The page's only h1. The design opens straight on the hero artwork,
          which carries its headline inside the image, so there is no visible
          heading for a screen reader or a crawler to read. */}
      <h1 className="sr-only">Hamtos Computers - IT and networking hardware in Dubai</h1>

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

      {/* 1300x285 on the page column, 12px corners, 79 clear of the blue band
          above it. Figma frame at y 6468. */}
      <PromoBanner
        slide={slides?.[4]}
        aspectClassName="aspect-[1300/285]"
        contained
        className="mt-[79px] mb-12"
      />

      <NewWirelessSection />

      <NewGatewaysSection />

      <NewsletterPanel />
    </div>
  )
}

export default Index
