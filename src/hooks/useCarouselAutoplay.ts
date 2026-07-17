import { useEffect, useState } from "react"
import type { CarouselApi } from "@/components/ui/carousel"

const DEFAULT_DELAY_MS = 2000

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches

/**
 * Advances a carousel on a timer.
 *
 * Embla owns the animation, so this only has to nudge it. Pausing on hover and
 * focus keeps a rail still while it's being read or tabbed through, and
 * reduced-motion users never get the timer at all.
 *
 * Note the carousel must have somewhere to scroll for this to do anything: a
 * rail whose slides all fit on screen has its loop disabled by embla, and both
 * the timer and the arrows become no-ops. Keep the visible slot count below the
 * number of slides.
 *
 * Spread `pauseProps` onto the `<Carousel>` and pass `setApi` to its `setApi`.
 */
export const useCarouselAutoplay = (delayMs: number = DEFAULT_DELAY_MS) => {
  const [api, setApi] = useState<CarouselApi>()
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (!api || paused || prefersReducedMotion()) return

    const timer = window.setInterval(() => api.scrollNext(), delayMs)
    return () => window.clearInterval(timer)
  }, [api, paused, delayMs])

  return {
    setApi,
    pauseProps: {
      onMouseEnter: () => setPaused(true),
      onMouseLeave: () => setPaused(false),
      onFocusCapture: () => setPaused(true),
      onBlurCapture: () => setPaused(false),
    },
  }
}
