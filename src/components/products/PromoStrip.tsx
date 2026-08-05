import { useState } from "react"
import { Link } from "react-router-dom"

interface PromoStripProps {
  /**
   * Artwork for the 237 x 150 left panel. Bundled asset, absolute URL, or a
   * path under `public/`. The panel keeps its width when the file is missing,
   * so the strip does not reflow once the artwork is dropped in.
   */
  image?: string
  /** Describes the artwork. Empty by default — the copy lives in the DOM, not in the image. */
  imageAlt?: string
  /** The black sentences, one per line. */
  lines?: string[]
  /** The blue bulleted keywords under the copy. */
  tags?: string[]
  /** The button. */
  cta?: { label: string; href: string }
}

const DEFAULT_LINES = [
  "Connect The Internet More Convenient With Wireless Products.",
  "Choose Various Wireless Products To Build A WiFi Network, Including Access Points, Controllers, Etc.",
]

const DEFAULT_TAGS = ["WiFi 6 AP", "802.11ac Wave 2 AP", "Outdoor AP", "WLAN Controllers"]

/**
 * The promo strip between the mosaic and Product Overview, per the Figma's
 * 1304 x 150 band at x212 on a #D9D9D9 fill:
 *
 *   photo    237 x 150 at x0    — flush left, full bleed against the fill
 *   copy     772 x 60  at x267  — 30 clear of the photo, vertically centred
 *   button   177 x 38  at x1097 — radius 6, #1A74BB, 30 clear of the right edge
 *
 * The ERP has no banner or promo endpoint, so the copy and artwork are props
 * with the Figma's content as defaults — the same treatment `PromoMosaic` and
 * `TechnicalSupportBanner` already get.
 */
const PromoStrip = ({
  image = "/promo-strip.png",
  imageAlt = "",
  lines = DEFAULT_LINES,
  tags = DEFAULT_TAGS,
  cta = { label: "Check Now", href: "/products?category=wireless" },
}: PromoStripProps) => {
  const [hasImage, setHasImage] = useState(true)

  return (
    <section className="container mx-auto px-4 sm:px-6 md:px-8 pt-[50px]" aria-label="Wireless products">
      <div className="flex flex-col overflow-hidden rounded-[10px] bg-surface-line md:h-[150px] md:flex-row md:items-stretch">
        {/* 237 of the Figma's 1304. Reserved even without artwork, so the fill
            reads as one band rather than the copy jumping to the edge. */}
        <div className="h-[150px] w-full flex-shrink-0 md:w-[237px]">
          {hasImage && (
            <img
              src={image}
              alt={imageAlt}
              loading="lazy"
              onError={() => setHasImage(false)}
              className="h-full w-full object-cover"
            />
          )}
        </div>

        <div className="flex flex-1 flex-col gap-5 px-[30px] py-6 md:flex-row md:items-center md:justify-between md:gap-8 md:py-0">
          {/* 772 at the Figma's width; 3px between rows, 26px between tags. */}
          <div className="min-w-0 md:max-w-[772px]">
            {lines.map((line) => (
              <p key={line} className="text-[14px] leading-[18px] text-black">
                {line}
              </p>
            ))}

            {tags.length > 0 && (
              <ul className="mt-[3px] flex flex-wrap gap-x-[26px] gap-y-[3px]">
                {tags.map((tag) => (
                  <li key={tag} className="text-[14px] leading-[18px] text-brand-700">
                    {/* The bullet is part of the blue keyword in the Figma, not a
                        list marker, so it stays inside the text and out of the
                        accessibility tree. */}
                    <span aria-hidden>•</span> {tag}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Link
            to={cta.href}
            className="flex h-[38px] w-full flex-shrink-0 items-center justify-center rounded-md bg-brand-700 text-[12px] font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-brand-800 md:w-[177px]"
          >
            {cta.label}
          </Link>
        </div>
      </div>
    </section>
  )
}

export default PromoStrip
