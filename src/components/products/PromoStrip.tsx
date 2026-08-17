import { useState } from "react"
import { Link } from "react-router-dom"
import { usePromoBanners } from "@/api/hooks/useProducts"

interface PromoStripProps {
  /**
   * Overrides the ERP's artwork for the 237 x 150 left panel. Bundled asset,
   * absolute URL, or a path under `public/`. Missing artwork is omitted so
   * mobile does not keep an empty grey band the height of the photo.
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
 * Content comes from the ERP under Front End → Promo Banners. Props override
 * it, and the Figma's copy stands in until a banner has been set up — so the
 * section never renders as an empty grey band.
 */
const PromoStrip = ({ image, imageAlt, lines, tags, cta }: PromoStripProps) => {
  // The src that failed, not a boolean: the artwork swaps from the placeholder
  // to the ERP's once the query resolves, and a boolean would keep the panel
  // blank because the placeholder had 404'd a moment earlier.
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const { data } = usePromoBanners()

  // Only the first active banner is shown. The block is one strip in the
  // design, so a second row is a scheduled replacement, not a carousel.
  const banner = data?.product_strip?.[0]

  // Once a banner exists its content is authoritative, empty fields included —
  // the Figma's copy only stands in while nothing has been set up in the ERP.
  const resolvedImage = image ?? banner?.image ?? "/promo-strip.png"
  const resolvedAlt = imageAlt ?? banner?.alt ?? ""
  const resolvedLines =
    lines ?? (banner ? ([banner.heading, banner.subheading].filter(Boolean) as string[]) : DEFAULT_LINES)
  const resolvedTags = tags ?? (banner ? banner.tags : DEFAULT_TAGS)
  const resolvedCta = cta ?? {
    label: banner?.button_label || "Check Now",
    href: banner?.link || "/products",
  }

  const showImage = Boolean(resolvedImage) && resolvedImage !== failedSrc

  return (
    <section className="container mx-auto px-4 sm:px-6 md:px-8 pt-3 md:pt-[50px]" aria-label="Wireless products">
      <div className="flex flex-col overflow-hidden rounded-[10px] bg-surface-line md:h-[150px] md:flex-row md:items-stretch">
        {/* 237 of the Figma's 1304. Shorter on small screens so the stacked
            card is the photo + copy, not a 150px image over empty grey.
            The box is omitted when artwork 404s, so mobile does not keep a
            blank grey band the height of the missing photo. */}
        {showImage && (
          <div className="h-[88px] w-full flex-shrink-0 md:h-[150px] md:w-[237px]">
            <img
              src={resolvedImage}
              alt={resolvedAlt}
              loading="lazy"
              onError={() => setFailedSrc(resolvedImage)}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <div className="flex flex-col gap-2 px-3.5 py-3 md:flex-1 md:flex-row md:items-center md:justify-between md:gap-8 md:px-[30px] md:py-0">
          {/* 772 at the Figma's width; 3px between rows, 26px between tags. */}
          <div className="min-w-0 md:max-w-[772px]">
            {resolvedLines.map((line) => (
              <p key={line} className="text-[14px] leading-[18px] text-black">
                {line}
              </p>
            ))}

            {resolvedTags.length > 0 && (
              <ul className="mt-1.5 flex flex-wrap gap-x-5 gap-y-0.5 md:mt-[3px] md:gap-x-[26px] md:gap-y-[3px]">
                {resolvedTags.map((tag) => (
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
            to={resolvedCta.href}
            className="flex h-[38px] w-full flex-shrink-0 items-center justify-center rounded-md bg-brand-700 text-[12px] font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-brand-800 md:w-[177px]"
          >
            {resolvedCta.label}
          </Link>
        </div>
      </div>
    </section>
  )
}

export default PromoStrip
