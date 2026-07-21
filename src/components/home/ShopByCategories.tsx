import { useMemo } from "react"
import { ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import { useCategories } from "@/api/hooks/useCategories"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { useCarouselAutoplay } from "@/hooks/useCarouselAutoplay"

const TITLE = "Shop By Categories"
const SUBTITLE =
  "Hamtos is your trusted source for IT devices in Dubai. We know that having the right technology plays a key role in helping businesses grow and succeed."

/** Same CTA as the navy panel — and the same Figma typo, corrected. */
const CTA = { label: "View Switch Info", href: "/products" } as const

/** The Figma holds the copy block to 422 and starts the tiles 106 clear of it. */
const COPY_WIDTH = "lg:w-[422px]"

/** 246x256 with 31px corners, per the tile frame. */
const TILE = "h-[256px] w-[246px] rounded-[31px]"

const SKELETON_COUNT = 6

/**
 * 15px between tiles, matching the product rails.
 *
 * Spelled out as literal classes rather than built from a constant: Tailwind
 * generates utilities by scanning the source text, so an interpolated class
 * name never makes it into the stylesheet.
 */
const TILE_GAP = { track: "-ml-[15px]", item: "pl-[15px]", flex: "gap-[15px]" } as const

/** Slow enough to read a tile before the next one arrives. */
const AUTOPLAY_MS = 3000

/** The ERP's placeholder file, which is not artwork worth rendering. */
const isRealImage = (url?: string) => !!url && !/no_image/i.test(url)

/**
 * "Shop By Categories" — copy block on the left, a scrolling row of category
 * tiles on the right.
 *
 * The Figma draws the tiles as plain grey boxes with no label, which is how a
 * placeholder reads before artwork lands: only 3 of the ERP's 28 categories
 * have a real image, the rest return `no_image.png`. So the name is rendered
 * into the tile rather than left to the artwork — a wall of unlabelled grey
 * squares is not navigable.
 */
const ShopByCategories = () => {
  const { setApi, pauseProps } = useCarouselAutoplay(AUTOPLAY_MS)
  const params = useMemo(() => ({ limit: 100, start: 1, include_products: true }), [])
  const { data, isLoading, error } = useCategories(params)

  const categories = useMemo(
    () =>
      (data?.data ?? [])
        .filter((category: any) => String(category?.showinhome) === "1" && category?.name)
        .map((category: any) => ({
          id: String(category.id),
          name: category.name as string,
          image: isRealImage(category.image_url) ? (category.image_url as string) : "",
        })),
    [data],
  )

  if (error || (!isLoading && categories.length === 0)) return null

  return (
    <section aria-label={TITLE} className="bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-[106px]">
          {/* 422x209: heading, three lines of body, then the CTA. */}
          <div className={`shrink-0 ${COPY_WIDTH}`}>
            <h2 className="text-[28px] font-bold tracking-[-0.03em] text-ink-jet lg:text-[35px]">{TITLE}</h2>
            <p className="mt-3 text-[13px] leading-[19px] text-ink-slate">{SUBTITLE}</p>
            <Link
              to={CTA.href}
              className="mt-5 inline-flex h-12 items-center gap-[14px] rounded-lg bg-brand-700 px-5 text-[15px] font-semibold text-white transition-colors hover:bg-brand-800"
            >
              {CTA.label}
              <ArrowRight size={20} aria-hidden />
            </Link>
          </div>

          {/* The Figma runs the tiles off the right edge of the page, so the
              row is longer than the column by design. It advances itself
              rather than waiting to be dragged — no arrows and no scrollbar,
              just the tiles moving. Pauses while hovered or tabbed through. */}
          <div className="min-w-0 flex-1">
            {isLoading ? (
              <div className={`flex overflow-hidden ${TILE_GAP.flex}`}>
                {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
                  <div key={index} className={`shrink-0 animate-pulse bg-surface-line ${TILE}`} />
                ))}
              </div>
            ) : (
              <Carousel
                setApi={setApi}
                // Tiles are a fixed width, so the track holds whatever number
                // fits rather than dividing the column into equal slots.
                opts={{ align: "start", loop: true, containScroll: false }}
                {...pauseProps}
              >
                <CarouselContent className={TILE_GAP.track}>
                  {categories.map((category) => (
                    <CarouselItem key={category.id} className={`basis-auto ${TILE_GAP.item}`}>
                      <Link
                        to={`/products?category=${category.id}`}
                        /* `#D9D9D9`, the same value the `surface-line` token
                           already carries, used here as the tile fill. */
                        className={`group relative flex items-end overflow-hidden bg-surface-line transition-colors hover:bg-surface-control ${TILE}`}
                      >
                        {category.image && (
                          <img
                            src={category.image}
                            alt=""
                            aria-hidden
                            loading="lazy"
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                            onError={(event) => {
                              event.currentTarget.style.visibility = "hidden"
                            }}
                          />
                        )}
                        <span
                          className={`relative w-full px-6 pb-6 text-[16px] font-semibold leading-[22px] ${
                            category.image
                              ? "bg-gradient-to-t from-black/70 to-transparent pt-10 text-white"
                              : "text-ink-jet"
                          }`}
                        >
                          {category.name}
                        </span>
                      </Link>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ShopByCategories
