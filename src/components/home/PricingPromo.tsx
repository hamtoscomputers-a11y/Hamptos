import { ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"

/**
 * Copy for the panel.
 *
 * Static: the ERP's `/website/slider` payload carries only `image`, `link` and
 * `caption`, so there is no field a headline or CTA label could come from. The
 * Figma draws this as a designed block rather than artwork — a flat `#03324C`
 * fill with live text over it — so it is not driven by the slider either.
 */
const COPY = {
  headline: "Shop In Best Pricing",
  subhead: "With In-Stock Ready-To-Ship Products",
  // The Figma reads "Swith" — a typo in the design, corrected here.
  cta: "View Switch Info",
  href: "/products",
} as const

/**
 * Full-width navy pricing panel between the best-seller and switches rails.
 *
 * Figma geometry: 1297x499 on the page column, 37px corners, and a copy block
 * inset 67 from the left and 111 from the top, held to 734 wide by a 496
 * right-hand gutter — which is what keeps the headline off the panel's
 * right half.
 */
const PricingPromo = () => (
  <section aria-label={COPY.headline} className="bg-white py-8">
    <div className="container mx-auto px-4">
      <div className="rounded-[37px] bg-surface-panel px-8 py-14 sm:px-12 lg:px-[67px] lg:pb-[109px] lg:pt-[111px]">
        <div className="max-w-[734px]">
          {/* One heading, two weights: the Figma sets the first line bold and
              lets the rest run regular, so they read as a single sentence
              rather than a title with a subtitle under it. */}
          <h2 className="text-[32px] leading-[1.22] text-white sm:text-[42px] lg:text-[56px] lg:leading-[68px]">
            <strong className="font-bold">{COPY.headline}</strong>
            <br />
            <span className="font-normal">{COPY.subhead}</span>
          </h2>

          <Link
            to={COPY.href}
            className="mt-[17px] inline-flex h-[58px] items-center gap-[14px] rounded-lg bg-brand-700 px-5 text-[16px] font-medium text-white transition-colors hover:bg-brand-800"
          >
            {COPY.cta}
            <ArrowRight size={24} aria-hidden />
          </Link>
        </div>
      </div>
    </div>
  </section>
)

export default PricingPromo
