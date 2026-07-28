import { Link } from "react-router-dom"
import { CircleCheck, Phone } from "lucide-react"
import { CONTACT } from "@/components/header/navigation"
import supportAgent from "@/assets/support-agent.png"

interface TechnicalSupportBannerProps {
  /**
   * Overrides the bundled photo. The ERP has no banner-artwork field today, so
   * the asset ships with the build; pass a URL here once one exists.
   */
  image?: string
}

/**
 * "Need Help? Technical Experts Available Now.", per the Figma's 1304 x 200
 * banner at x211 on a #C0E5F6 fill:
 *
 *   content frame  1304 x 150, inset 25 top and bottom
 *   photo          430 x 286 at x821 — bottom-aligned, overflowing 86 above
 *   button         146 x 38, radius 6, #1A74BB, 30 clear of the right edge
 *
 * The phone number comes from the site-wide `CONTACT` constant, not restated here.
 */
const TechnicalSupportBanner = ({ image = supportAgent }: TechnicalSupportBannerProps) => (
  <section className="container mx-auto px-4 sm:px-6 md:px-8 pt-[50px]" aria-label="Technical support">
      <div className="relative rounded-[10px] bg-surface-trust">
        {/* 821 - 211 = 610 of the Figma's 1304, so the photo holds its place as
            the banner narrows. It sits below the copy in the stack. */}
        <img
          src={image}
          alt=""
          aria-hidden
          className="absolute bottom-0 left-[46.8%] hidden h-[286px] w-[430px] object-contain lg:block"
        />

        <div className="relative flex flex-col gap-5 px-[30px] py-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8 lg:h-[200px] lg:py-[25px]">
          <div className="min-w-0">
            <p className="text-[24px] font-medium leading-tight tracking-[-0.02em] text-black">
              Need Help? Technical Experts Available Now.
            </p>
            <a
              href={CONTACT.phoneHref}
              className="mt-1 inline-flex items-center gap-1.5 text-[14px] text-brand-700 hover:underline"
            >
              <Phone size={14} aria-hidden />
              Tel: {CONTACT.phone}
            </a>
          </div>

          <Link
            to="/get-quote?source=technical-support"
            className="flex h-[38px] w-[146px] flex-shrink-0 items-center justify-center gap-2.5 rounded-md bg-brand-700 text-[12px] font-bold uppercase tracking-wide text-white transition-colors hover:bg-brand-800"
          >
            <CircleCheck size={16} aria-hidden />
            Get a Quote
          </Link>
        </div>
      </div>
    </section>
)

export default TechnicalSupportBanner
