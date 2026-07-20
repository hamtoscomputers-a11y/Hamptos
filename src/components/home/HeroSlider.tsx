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
 * The Figma hero is 1920x480 — a 4:1 ratio that resolves to exactly 480px at
 * the design width. Held only from `lg` up: at phone widths 4:1 collapses to
 * under 100px tall, so the ratio deepens and the image crops from the left,
 * which keeps the headline and CTA baked into each slide visible.
 */
const HERO_ASPECT = "aspect-[2/1] sm:aspect-[3/1] lg:aspect-[4/1]"

/**
 * Well slower than the thin rails: a hero slide carries a headline and a CTA,
 * so it has to stay put long enough to read and click.
 */
const AUTOPLAY_MS = 6000

/**
 * Full-bleed hero carousel. Slides are live content from
 * `/api/v1/website/slider`, so this renders whatever the ERP returns and
 * degrades to a placeholder rather than assuming any slide exists.
 */
const HeroSlider = ({ slides, isLoading = false }: HeroSliderProps) => {
  // Ahead of the early returns below, so the hook order stays stable while the
  // slides are still loading.
  const { setApi, pauseProps } = useCarouselAutoplay(AUTOPLAY_MS)
  const visibleSlides = slides.filter((slide) => !!slide.image).slice(0, 3)

  if (isLoading) {
    return <div className={`w-full animate-pulse bg-surface-accent ${HERO_ASPECT}`} aria-hidden />
  }

  if (visibleSlides.length === 0) return null

  return (
    <section aria-label="Promotions" className="bg-white">
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
                className={`w-full object-cover object-left ${HERO_ASPECT}`}
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
