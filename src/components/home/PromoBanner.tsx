import { Link } from "react-router-dom"

export interface BannerSlide {
  image?: string
  link?: string
  caption?: string
}

interface PromoBannerProps {
  slide?: BannerSlide
  /**
   * Tailwind aspect class matching the artwork's own ratio, so the image never
   * crops. Defaults to the full-bleed hero banner (Figma 1512x389).
   */
  aspectClassName?: string
  /**
   * Constrain the banner to the page container and round its corners, rather
   * than bleeding edge to edge (Figma 1300x285, radius 12).
   */
  contained?: boolean
  className?: string
}

const isExternal = (link: string) => /^https?:\/\//i.test(link) || !link.startsWith("/")

/**
 * Promotional banner driven by `/api/v1/website/slider`.
 *
 * Renders nothing when the ERP has no banner in that slot, so an unset slide
 * collapses instead of leaving a blank frame. `link` and `caption` come from
 * the slider payload — marketing can change artwork, destination and alt text
 * without a deploy.
 */
const PromoBanner = ({
  slide,
  aspectClassName = "aspect-[1512/389]",
  contained = false,
  className = "",
}: PromoBannerProps) => {
  if (!slide?.image) return null

  const image = (
    <img
      src={slide.image}
      alt={slide.caption || ""}
      loading="lazy"
      className={`w-full object-cover ${aspectClassName} ${contained ? "rounded-xl" : ""}`}
    />
  )

  const link = slide.link?.trim()
  const body = !link ? (
    image
  ) : isExternal(link) ? (
    <a
      href={link.startsWith("http") ? link : `https://${link}`}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      {image}
    </a>
  ) : (
    <Link to={link} className="block">
      {image}
    </Link>
  )

  if (contained) {
    return (
      <section className={className}>
        <div className="container mx-auto px-4">{body}</div>
      </section>
    )
  }

  return <section className={`w-full ${className}`}>{body}</section>
}

export default PromoBanner
