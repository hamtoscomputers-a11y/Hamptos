import { useState } from "react"
import { Link } from "react-router-dom"
import { ImageOff } from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { useCarouselAutoplay } from "@/hooks/useCarouselAutoplay"
import { isRealImage } from "./categoryImage"

interface RailCategory {
  id: string
  name: string
  image?: string
}

interface CategoryIconRailProps {
  categories: RailCategory[]
  isLoading: boolean
  error: unknown
}

const SKELETON_COUNT = 9

const ARROW =
  "hidden h-9 w-9 border-surface-line bg-white/90 text-ink-steel shadow-sm hover:bg-brand-100 hover:text-brand-700 sm:flex 2xl:bg-white 2xl:shadow-none"

/**
 * Slots per breakpoint, topping out at 9. Deliberately fewer than the catalogue
 * has categories: a rail that fits entirely on screen has nowhere to scroll, so
 * embla disables the loop and greys out both arrows. Keeping a couple of
 * categories off-screen is what keeps the arrows live and autoplay moving.
 */
const ITEM_BASIS = "basis-1/3 sm:basis-1/5 md:basis-1/6 lg:basis-[14.2857%] xl:basis-[11.1111%]"

/**
 * Rail artwork, always a circle. Most categories carry no usable image, so
 * rather than a grey square each one falls back to the same "no image" mark.
 */
const RailArtwork = ({ category }: { category: RailCategory }) => {
  const [failed, setFailed] = useState(false)
  const src = isRealImage(category.image) && !failed ? category.image : undefined

  return (
    <span className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-surface-placeholder">
      {src ? (
        <img
          src={src}
          alt=""
          aria-hidden
          loading="lazy"
          className="h-full w-full object-contain p-2"
          onError={() => setFailed(true)}
        />
      ) : (
        <ImageOff className="h-6 w-6 text-ink-faint" aria-hidden />
      )}
    </span>
  )
}

/**
 * Horizontal icon rail beneath the hero, linking into the live catalogue.
 *
 * Categories come from the API, so the rail always reflects the real
 * catalogue, artwork included.
 */
const CategoryIconRail = ({ categories, isLoading, error }: CategoryIconRailProps) => {
  const { setApi, pauseProps } = useCarouselAutoplay()

  // The header's All Categories menu is the fallback path, so a failed rail
  // stays silent rather than pushing an error banner into the hero area.
  if (error) return null

  return (
    <section aria-label="Shop by category" className="bg-white">
      <div className="container mx-auto px-4 py-5">
        {isLoading ? (
          <ul className="flex items-start justify-center gap-2 sm:gap-4">
            {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
              <li key={index} className="w-28 flex-shrink-0 animate-pulse text-center">
                <div className="mx-auto h-10 w-10 rounded-full bg-gray-200" />
                <div className="mx-auto mt-3 h-3 w-16 rounded bg-gray-200" />
              </li>
            ))}
          </ul>
        ) : (
          <Carousel
            setApi={setApi}
            opts={{ align: "start", loop: true }}
            // Inset the track so the arrows sit in a gutter instead of over the
            // labels; above 2xl they move outside the container entirely.
            className="sm:px-10 2xl:px-0"
            {...pauseProps}
          >
            <CarouselContent className="-ml-2">
              {categories.map((category) => (
                <CarouselItem key={category.id} className={`pl-2 ${ITEM_BASIS}`}>
                  <Link
                    to={`/products?category=${category.id}`}
                    className="group flex flex-col items-center gap-3 rounded-lg px-2 py-3 text-center transition-colors hover:bg-surface-accent"
                  >
                    <RailArtwork category={category} />
                    <span className="text-xs font-medium capitalize text-brand-950 transition-colors group-hover:text-brand-700">
                      {category.name.toLowerCase()}
                    </span>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className={`left-0 2xl:-left-11 ${ARROW}`} />
            <CarouselNext className={`right-0 2xl:-right-11 ${ARROW}`} />
          </Carousel>
        )}
      </div>
    </section>
  )
}

export default CategoryIconRail
