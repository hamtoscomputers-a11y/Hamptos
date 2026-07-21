import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { useCarouselAutoplay } from "@/hooks/useCarouselAutoplay"

export interface Slide {
  id?: string | number
  image?: string
  title?: string
  link?: string
}

interface HeroSliderProps {
  slides: Slide[]
  isLoading?: boolean
}

/**
 * The Figma hero is a 1751x583 frame — a 3:1 ratio that resolves to 576px at
 * the design width. Held only from `lg` up: the ERP's artwork carries its own
 * headline and CTA, and at phone widths 3:1 crops them out, so the ratio
 * deepens as the viewport narrows.
 */
const HERO_ASPECT = "aspect-[2/1] sm:aspect-[5/2] lg:aspect-[3/1]"

/**
 * Well slower than the thin rails: a hero slide carries a headline and a CTA,
 * so it has to stay put long enough to read and click.
 */
const AUTOPLAY_MS = 6000

/**
 * The Figma opens the hero at y=174 against a header that ends at y=166 —
 * a deliberate 8px of white between the category rail and the artwork.
 */
const HEADER_GAP = "mt-2"

/**
 * How many slides the hero takes off the top of `/website/slider`.
 *
 * The rest of the payload is not spare: the homepage hands slides 4 and 5 to
 * the two `PromoBanner` slots, so widening this range would republish those
 * banners here as well.
 */
const HERO_SLIDE_COUNT = 3

/**
 * Full-bleed hero carousel. Slides are live content from
 * `/api/v1/website/slider`, so this renders whatever the ERP returns and
 * degrades to a placeholder rather than assuming any slide exists.
 *
 * Image only, with no text layer over it. The Figma draws the headline, body
 * and CTA as separate elements, but every banner the ERP serves already has
 * that copy painted into the artwork, and the endpoint returns no field to
 * source it from — `image`, `link` and `caption` are the whole payload. An
 * overlay would print a second headline and a second button across the first.
 * Marketing controls the whole frame from the ERP admin instead; move the copy
 * back into markup only once the slider payload can carry it.
 */
const HeroSlider = ({ slides, isLoading = false }: HeroSliderProps) => {
  // Ahead of the early returns below, so the hook order stays stable while the
  // slides are still loading.
  const { setApi, pauseProps } = useCarouselAutoplay(AUTOPLAY_MS)
  const visibleSlides = slides.filter((slide) => !!slide.image).slice(0, HERO_SLIDE_COUNT)

  if (isLoading) {
    return <div className={`w-full animate-pulse bg-surface-accent ${HEADER_GAP} ${HERO_ASPECT}`} aria-hidden />
  }

  if (visibleSlides.length === 0) return null

  return (
    <section aria-label="Promotions" className={`bg-white ${HEADER_GAP}`}>
      <Carousel
        setApi={setApi}
        className="w-full"
        opts={{ align: "start", loop: visibleSlides.length > 1 }}
        {...pauseProps}
      >
        <CarouselContent className="ml-0">
          {visibleSlides.map((slide, index) => (
            <CarouselItem key={slide.id ?? `slide-${index}`} className="pl-0">
              <img
                src={slide.image}
                alt={slide.title || ""}
                className={`w-full object-cover object-center ${HERO_ASPECT}`}
                loading={index === 0 ? "eager" : "lazy"}
              />
            </CarouselItem>
          ))}
        </CarouselContent>

        {visibleSlides.length > 1 && (
          <>
            <CarouselPrevious className="left-4 border-none bg-white/80 text-brand-950 hover:bg-white" />
            <CarouselNext className="right-4 border-none bg-white/80 text-brand-950 hover:bg-white" />
          </>
        )}
      </Carousel>
    </section>
  )
}

export default HeroSlider
