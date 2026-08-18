import { useMemo } from "react"
import { ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import { CATEGORY_TREE_PARAMS, useCategories } from "@/api/hooks/useCategories"
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
 * Artwork is per category and comes from the ERP, so the row is only as good as
 * what has been uploaded. Worth knowing when a tile looks wrong: the picture is
 * almost never the code's doing. On 2026-08-18 nine of the ten home categories
 * carried byte-identical copies of one switch photo under different filenames,
 * which rendered as the same picture repeated down the row.
 *
 * The Figma draws the tiles as bare artwork with no label. The name is rendered
 * anyway — a row of unlabelled pictures is not navigable, and the link would
 * otherwise have no accessible text.
 */
const ShopByCategories = () => {
  const { setApi, pauseProps } = useCarouselAutoplay(AUTOPLAY_MS)
  // Shared with the header's category menu so the two mount off one request
  // rather than two — see CATEGORY_TREE_PARAMS.
  const { data, isLoading, error } = useCategories(CATEGORY_TREE_PARAMS)

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
    <section aria-label={TITLE} className="bg-white py-6 md:py-12">
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
                        /* White behind the artwork, not `#D9D9D9`: the tiles are
                           product shots cut out on white, so the tile has to
                           continue that background rather than box it in grey.
                           A category with no artwork still falls back to grey. */
                        /* No border on a tile that has artwork: the tiles are
                           exported from the Figma with their own rounded frame
                           already drawn in, and adding one here put a card
                           inside a card. A category with no artwork still needs
                           the grey fill to have any shape at all. */
                        className={`group flex flex-col overflow-hidden transition-colors ${
                          category.image ? "bg-white" : "bg-surface-line hover:bg-surface-control"
                        } ${TILE}`}
                      >
                        {category.image && (
                          /* The artwork gets its own row rather than the whole
                             tile, so the name below can never land on top of the
                             product. Tiles drawn at the tile's own 246x256 would
                             otherwise run their subject straight under the text. */
                          <span className="flex min-h-0 flex-1 items-center justify-center">
                            <img
                              src={category.image}
                              alt=""
                              aria-hidden
                              loading="lazy"
                              /* `contain`, not `cover`: the ERP also holds older
                                 landscape photos, and cropping those to fill a
                                 portrait tile cut the product in half. */
                              className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
                              onError={(event) => {
                                event.currentTarget.style.visibility = "hidden"
                              }}
                            />
                          </span>
                        )}
                        {/* The name is kept even though the Figma tiles carry
                            none: a row of unlabelled pictures is not navigable,
                            and the link would have no accessible text at all. */}
                        <span
                          className={`w-full px-6 text-[16px] font-semibold leading-[22px] text-ink-jet ${
                            category.image ? "pb-5" : "mt-auto pb-6"
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
