import { useEffect, useRef, useState } from "react"

/**
 * How far ahead of the viewport a section counts as visible.
 *
 * Enough that a rail has started fetching by the time it is scrolled to, so the
 * deferral buys server headroom without the visitor watching skeletons fill in.
 */
const ROOT_MARGIN = "400px"

/**
 * True once the element has come near the viewport, and true from then on.
 *
 * Used to hold back the below-the-fold product rails. The homepage used to open
 * every rail's requests on mount — around thirty calls plus three dozen images
 * against one shared-hosting account — which pushed it past its process limit
 * and had the ERP refuse database connections outright. A visitor sees two
 * rails before scrolling; the rest can wait until they are asked for.
 *
 * One-way by design: a rail that scrolls back off screen keeps its data rather
 * than unmounting and refetching when it returns.
 */
export const useInViewOnce = <T extends HTMLElement>() => {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    if (inView) return

    const node = ref.current
    if (!node) return

    // Anything without the observer gets the old behaviour rather than a rail
    // that never loads.
    if (typeof IntersectionObserver === "undefined") {
      setInView(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true)
          observer.disconnect()
        }
      },
      { rootMargin: ROOT_MARGIN },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [inView])

  return { ref, inView }
}
