import { Link } from "react-router-dom"

export interface BannerSlide {
  image?: string
  link?: string
  caption?: string
}

interface PromoBannerProps {
  slide?: BannerSlide
  /** Figma banner frame is 1512x388.19. */
  className?: string
}

const BANNER_ASPECT = "aspect-[1512/389]"

const isExternal = (link: string) => /^https?:\/\//i.test(link) || !link.startsWith("/")

/**
 * Full-bleed promotional banner driven by `/api/v1/website/slider`.
 *
 * Renders nothing when the ERP has no banner in that slot, so an unset slide
 * collapses instead of leaving a blank frame. `link` and `caption` come from
 * the slider payload — marketing can change the artwork, destination and alt
 * text without a deploy.
 */
const PromoBanner = ({ slide, className = "" }: PromoBannerProps) => {
  if (!slide?.image) return null

  const image = (
    <img
      src={slide.image}
      alt={slide.caption || ""}
      loading="lazy"
      className={`w-full object-cover ${BANNER_ASPECT}`}
    />
  )

  const link = slide.link?.trim()
  if (!link) return <section className={`w-full ${className}`}>{image}</section>

  return (
    <section className={`w-full ${className}`}>
      {isExternal(link) ? (
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
      )}
    </section>
  )
}

export default PromoBanner
