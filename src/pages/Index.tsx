"use client"

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

import { usePromoBanners, useWebsiteSlider } from "@/api/hooks/useProducts"

const Index = () => {
  const { data: sliderData, isLoading: slidesLoading } = useWebsiteSlider()
  const slides = sliderData?.data ?? []

  /**
   * The clearance banner's own artwork, from the Promo Banners block.
   *
   * Falls back to the fifth slider row, which is where it used to come from —
   * and which the tile band above also drew, so the same picture appeared
   * twice on one screen. Filling in the block separates them.
   */
  const { data: promoBanners } = usePromoBanners()
  const clearance = (promoBanners?.home_clearance_banner ?? []).find((banner) => banner.image)
  const clearanceSlide = clearance
    ? { image: clearance.image as string, link: clearance.link ?? "", caption: clearance.alt ?? "" }
    : slides?.[4]

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
        slide={clearanceSlide}
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
