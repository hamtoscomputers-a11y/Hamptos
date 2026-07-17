import { useMemo } from "react"
import { ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { useBestSellers } from "@/api/hooks/useProducts"
import ProductCarouselCard from "./ProductCarouselCard"
import { toCardProduct } from "./productCard"

interface BestSellingSectionProps {
  /** Live categories, rendered as chips linking into the catalogue. */
  categories?: Array<{ id: string; name: string }>
}

const TITLE = "Best selling products"
const SUBTITLE = "Find top-quality IT products at great prices in Dubai. Perfect for businesses and everyday use."
const CHIP_LIMIT = 1

const BestSellingSection = ({ categories = [] }: BestSellingSectionProps) => {
  const { data, isLoading, error } = useBestSellers(10, 1, "brand,category,photos")

  const products = useMemo(() => (data?.data ?? []).map(toCardProduct).filter((p) => p.name), [data])

  // Nothing to merchandise and no way to recover — drop the section entirely
  // rather than leave an empty frame on the page.
  if (error || (!isLoading && products.length === 0)) return null

  const chips = categories.slice(0, CHIP_LIMIT)

  return (
    <section aria-label={TITLE} className="bg-white py-10">
      <div className="container mx-auto px-4">
        <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-brand-700">{TITLE}</h2>
            <p className="mt-1 max-w-2xl text-sm text-ink-slate">{SUBTITLE}</p>

            {chips.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-2">
                {chips.map((category) => (
                  <li key={category.id}>
                    <Link
                      to={`/products?category=${category.id}`}
                      className="inline-block rounded-md bg-brand-700 px-4 py-1.5 text-xs font-medium capitalize text-white transition-colors hover:bg-brand-800"
                    >
                      {category.name.toLowerCase()}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 rounded-md bg-brand-700 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-800"
          >
            Explore All
            <ArrowRight size={16} aria-hidden />
          </Link>
        </header>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="animate-pulse rounded-lg border border-surface-muted">
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
          <Carousel opts={{ align: "start", loop: false }} className="px-0 sm:px-10">
            <CarouselContent className="-ml-4">
              {products.map((product) => (
                <CarouselItem key={product.id} className="basis-1/2 pl-4 md:basis-1/3 lg:basis-1/5">
                  <ProductCarouselCard product={product} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden border-surface-muted text-ink-steel hover:bg-brand-100 hover:text-brand-700 sm:flex" />
            <CarouselNext className="hidden border-surface-muted text-ink-steel hover:bg-brand-100 hover:text-brand-700 sm:flex" />
          </Carousel>
        )}
      </div>
    </section>
  )
}

export default BestSellingSection
