import { ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import ProductCarouselCard from "./ProductCarouselCard"
import type { CardProduct } from "./productCard"

export interface CarouselChip {
  id: string
  name: string
}

interface ProductCarouselSectionProps {
  title: string
  subtitle: string
  products: CardProduct[]
  isLoading: boolean
  error?: unknown
  /** Destination for the Explore All action. */
  exploreHref?: string
  /** Optional category chips rendered under the subtitle. */
  chips?: CarouselChip[]
  /** `dark` renders the navy full-bleed treatment; cards stay white either way. */
  tone?: "light" | "dark"
}

const SKELETON_COUNT = 5

const TONE = {
  light: {
    section: "bg-white",
    title: "text-brand-700",
    subtitle: "text-ink-slate",
    arrow:
      "border-surface-muted bg-white/90 text-ink-steel shadow-sm hover:bg-brand-100 hover:text-brand-700 2xl:bg-white 2xl:shadow-none",
  },
  dark: {
    section: "bg-ink-slate",
    title: "text-white",
    subtitle: "text-white/75",
    arrow: "border-white/30 bg-white/10 text-white hover:bg-white hover:text-ink-slate",
  },
} as const

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
  error,
  exploreHref = "/products",
  chips = [],
  tone = "light",
}: ProductCarouselSectionProps) => {
  // Nothing to merchandise and no way to recover — drop the section rather
  // than leave an empty frame on the page.
  if (error || (!isLoading && products.length === 0)) return null

  const styles = TONE[tone]

  return (
    <section aria-label={title} className={`py-10 ${styles.section}`}>
      <div className="container mx-auto px-4">
        <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className={`text-2xl font-semibold ${styles.title}`}>{title}</h2>
            <p className={`mt-1 max-w-2xl text-sm ${styles.subtitle}`}>{subtitle}</p>

            {chips.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-2">
                {chips.map((chip) => (
                  <li key={chip.id}>
                    <Link
                      to={`/products?category=${chip.id}`}
                      className="inline-block rounded-md bg-brand-700 px-4 py-1.5 text-xs font-medium capitalize text-white transition-colors hover:bg-brand-800"
                    >
                      {chip.name.toLowerCase()}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Link
            to={exploreHref}
            className="inline-flex items-center gap-2 rounded-md bg-brand-700 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-800"
          >
            Explore All
            <ArrowRight size={16} aria-hidden />
          </Link>
        </header>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
              <div key={index} className="animate-pulse rounded-lg border border-surface-muted bg-white">
                <div className="aspect-[4/3] rounded-t-lg bg-gray-100" />
                <div className="space-y-2 p-3">
                  <div className="h-3 w-16 rounded bg-gray-100" />
                  <div className="h-4 w-full rounded bg-gray-100" />
                  <div className="h-4 w-20 rounded bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          // The track spans the full container width so the first card lines up
          // with the heading and the last card with the Explore All button.
          // Arrows sit outside it, in the page margin, and only appear at
          // widths where that margin actually exists.
          <Carousel opts={{ align: "start", loop: false }}>
            <CarouselContent className="-ml-4">
              {products.map((product) => (
                <CarouselItem key={product.id} className="basis-1/2 pl-4 md:basis-1/3 lg:basis-1/5">
                  <ProductCarouselCard product={product} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className={`left-1 hidden h-9 w-9 sm:flex 2xl:-left-11 ${styles.arrow}`} />
            <CarouselNext className={`right-1 hidden h-9 w-9 sm:flex 2xl:-right-11 ${styles.arrow}`} />
          </Carousel>
        )}
      </div>
    </section>
  )
}

export default ProductCarouselSection
