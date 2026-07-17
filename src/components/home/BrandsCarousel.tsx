import { Link } from "react-router-dom"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { useWebsiteBrands } from "@/api/hooks/useProducts"

const TITLE = "Brands we carry"
const SUBTITLE = "Explore top trusted brands in IT products, all in one place."
const SKELETON_COUNT = 6

const ARROW =
  "hidden h-9 w-9 border-surface-line bg-white/90 text-ink-steel shadow-sm hover:bg-brand-100 hover:text-brand-700 sm:flex 2xl:bg-white 2xl:shadow-none"

/** Brand logo rail, linking into each brand's product listing. */
const BrandsCarousel = () => {
  const { data, isLoading, error } = useWebsiteBrands()
  const brands = (data?.data ?? []).filter((brand: any) => brand?.image)

  if (error || (!isLoading && brands.length === 0)) return null

  return (
    <section aria-label={TITLE} className="bg-surface-subtle py-10">
      <div className="container mx-auto px-4">
        <header className="mb-6">
          <h2 className="text-2xl font-semibold text-brand-700">{TITLE}</h2>
          <p className="mt-1 text-sm text-ink">{SUBTITLE}</p>
        </header>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
              <div key={index} className="h-28 animate-pulse rounded-lg border border-surface-line bg-white" />
            ))}
          </div>
        ) : (
          <Carousel opts={{ align: "start", loop: false }}>
            <CarouselContent className="-ml-4">
              {brands.map((brand: any) => (
                <CarouselItem
                  key={brand.id}
                  className="basis-1/2 pl-4 sm:basis-1/3 md:basis-1/4 lg:basis-1/6"
                >
                  <Link
                    to={`/brand/${brand.id}/products`}
                    className="flex h-28 items-center justify-center rounded-lg border border-surface-line bg-white p-4 transition-shadow hover:shadow-md"
                  >
                    <img
                      src={brand.image}
                      alt={brand.name}
                      loading="lazy"
                      className="max-h-16 max-w-full object-contain"
                      onError={(event) => {
                        event.currentTarget.style.visibility = "hidden"
                      }}
                    />
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className={`left-1 2xl:-left-11 ${ARROW}`} />
            <CarouselNext className={`right-1 2xl:-right-11 ${ARROW}`} />
          </Carousel>
        )}
      </div>
    </section>
  )
}

export default BrandsCarousel
