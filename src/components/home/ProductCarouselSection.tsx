import { useEffect, useState } from "react"
import { ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import ProductCarouselCard from "./ProductCarouselCard"
import type { CardProduct } from "./productCard"

export interface CarouselTab {
  /** Shown on the tab. */
  label: string
  /** Catalogue term the tab resolves to, for both the rail and Explore All. */
  term: string
}

interface ProductCarouselSectionProps {
  title: string
  /** Omitted by rails the Figma shows as a bare heading, e.g. Related Product. */
  subtitle?: string
  products: CardProduct[]
  isLoading: boolean
  /**
   * A refresh behind products that are already on screen — a tab change, say.
   * Dims the track in place rather than tearing it down for a skeleton.
   */
  isRefreshing?: boolean
  error?: unknown
  /** Destination for the Explore All action. */
  exploreHref?: string
  /**
   * Curated filter tabs under the heading. They re-fetch the rail in place —
   * the owning section holds the selection and swaps the products it passes
   * down. Only Explore All leaves the page, carrying the active tab with it.
   */
  tabs?: CarouselTab[]
  activeTab?: string
  onTabChange?: (label: string) => void
  /** `dark` renders the navy full-bleed treatment; cards stay white either way. */
  tone?: "light" | "dark"
  /**
   * Wrapper classes for the `<section>`. Defaults to the rail's own white band
   * with its standard vertical rhythm; a rail nested inside a coloured band
   * passes its own so it does not paint a white stripe through it.
   */
  frameClassName?: string
  /** Centred heading with no Explore All, per the Related Product frame. */
  align?: "split" | "center"
  showExplore?: boolean
}

const SKELETON_COUNT = 5

const TONE = {
  light: {
    section: "bg-white",
    title: "text-black",
    subtitle: "text-ink-slate",
    explore: "border-brand-700 bg-white text-brand-700 hover:bg-brand-700 hover:text-white",
    // 36px ring in `#B4C8D9` over a `#7890A5` chevron, per the Figma.
    arrow:
      "border-surface-arrow bg-white/90 text-ink-steel shadow-sm hover:bg-brand-100 hover:text-brand-700 2xl:bg-white 2xl:shadow-none",
  },
  dark: {
    section: "bg-ink-slate",
    title: "text-white",
    subtitle: "text-white/75",
    explore: "border-white bg-transparent text-white hover:bg-white hover:text-ink-slate",
    arrow: "border-white/30 bg-white/10 text-white hover:bg-white hover:text-ink-slate",
  },
} as const

/**
 * Filter tab. The Figma draws these 49px tall with a 4px gutter: the active
 * one filled `brand-700` with white text, the rest white with a 1px
 * `brand-700` outline and matching label.
 *
 * A button, not a link: selecting a tab swaps the rail's contents where it
 * stands rather than navigating away from the homepage.
 */
const Tab = ({ label, isActive, onSelect }: { label: string; isActive: boolean; onSelect: () => void }) => (
  <button
    type="button"
    role="tab"
    aria-selected={isActive}
    onClick={onSelect}
    className={`inline-flex h-[49px] items-center rounded-lg border px-5 text-[14px] transition-colors ${
      isActive
        ? "border-brand-700 bg-brand-700 text-white"
        : "border-brand-700 bg-white text-brand-700 hover:bg-brand-100"
    }`}
  >
    {label}
  </button>
)

/**
 * Shared home-page product carousel: heading block, Explore All action, and a
 * five-up track with gutter arrows.
 *
 * Both the best-seller and featured rails render through this, so their layout
 * can only drift deliberately. Callers own data fetching and pass mapped
 * products in.
 */
const ProductCarouselSection = ({
  title,
  subtitle,
  products,
  isLoading,
  isRefreshing = false,
  error,
  exploreHref = "/products",
  tabs = [],
  activeTab,
  onTabChange,
  tone = "light",
  frameClassName,
  align = "split",
  showExplore = true,
}: ProductCarouselSectionProps) => {
  const [api, setApi] = useState<CarouselApi>()

  // Declared ahead of the early return below so the hook order stays stable.
  // Changing tab while the track is scrolled would otherwise leave the new
  // products already part-scrolled, opening on the third or fourth card.
  // Jumps rather than animates: the cards underneath are being replaced, so
  // sliding back through them reads as the rail scrolling itself.
  useEffect(() => {
    api?.scrollTo(0, true)
  }, [api, activeTab])

  // A failed rail is dropped entirely rather than left as an empty frame. An
  // empty *tab*, though, keeps the section up — the tabs have to stay reachable
  // so the visitor can pick another one.
  if (error || (!isLoading && products.length === 0 && tabs.length === 0)) return null

  const styles = TONE[tone]

  return (
    <section aria-label={title} className={frameClassName ?? `py-12 ${styles.section}`}>
      <div className="container mx-auto px-4">
        <header
          className={`flex flex-wrap gap-4 ${
            align === "center" ? "justify-center text-center" : "items-start justify-between"
          }`}
        >
          <div className="max-w-[640px]">
            <h2 className={`text-[24px] font-bold leading-tight ${styles.title}`}>{title}</h2>
            {subtitle && <p className={`mt-1.5 text-[13px] leading-[18px] ${styles.subtitle}`}>{subtitle}</p>}
          </div>

          {showExplore && (
            /* 158x49 in the Figma: a white pill outlined in the brand blue
               rather than filled with it, so the filled tab below is the only
               solid block of colour in the heading. */
            <Link
              to={exploreHref}
              className={`inline-flex h-[49px] items-center gap-[14px] rounded-lg border px-5 text-[14px] transition-colors ${styles.explore}`}
            >
              Explore All
              <ArrowRight size={20} aria-hidden />
            </Link>
          )}
        </header>

        {tabs.length > 0 && (
          <div role="tablist" aria-label={`${title} filters`} className="mt-3.5 flex flex-wrap gap-1">
            {tabs.map((tab) => (
              <Tab
                key={tab.label}
                label={tab.label}
                isActive={tab.label === activeTab}
                onSelect={() => onTabChange?.(tab.label)}
              />
            ))}
          </div>
        )}

        {/* Only the very first load gets a skeleton. Once a track is on
            screen a tab change dims it and swaps the cards underneath, rather
            than collapsing to placeholders and snapping back — which read as
            the section reloading itself. */}
        <div
          className={`mt-6 transition-opacity duration-200 ${isRefreshing ? "opacity-50" : "opacity-100"}`}
          aria-busy={isRefreshing || undefined}
        >
          {isLoading && products.length === 0 ? (
            <div className="grid grid-cols-2 gap-[15px] md:grid-cols-3 lg:grid-cols-5">
              {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
                <div key={index} className="animate-pulse overflow-hidden rounded-lg bg-white">
                  <div className="aspect-[247/169] bg-surface-placeholder" />
                  <div className="space-y-2 p-5">
                    <div className="h-3 w-16 rounded bg-gray-100" />
                    <div className="h-4 w-full rounded bg-gray-100" />
                    <div className="h-4 w-20 rounded bg-gray-100" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            /* A tab the catalogue has nothing for. The rail stays in place so
               the other tabs remain one click away. */
            <p className="py-10 text-center text-[14px] text-ink-body">
              No products in this range right now.
            </p>
          ) : (
            // The track spans the full container width so the first card lines
            // up with the heading and the last card with the Explore All
            // button. Arrows sit outside it, in the page margin, and only
            // appear at widths where that margin actually exists.
            <Carousel setApi={setApi} opts={{ align: "start", loop: false }}>
              <CarouselContent className="-ml-[15px]">
                {products.map((product) => (
                  <CarouselItem key={product.id} className="basis-1/2 pl-[15px] md:basis-1/3 lg:basis-1/5">
                    <ProductCarouselCard product={product} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              {/* 36px, and parked 21px clear of the track — the Figma places
                  them at 157 and 1536 against a 215..1515 content column. */}
              <CarouselPrevious className={`left-1 hidden h-9 w-9 sm:flex 2xl:-left-[57px] ${styles.arrow}`} />
              <CarouselNext className={`right-1 hidden h-9 w-9 sm:flex 2xl:-right-[57px] ${styles.arrow}`} />
            </Carousel>
          )}
        </div>
      </div>
    </section>
  )
}

export default ProductCarouselSection
