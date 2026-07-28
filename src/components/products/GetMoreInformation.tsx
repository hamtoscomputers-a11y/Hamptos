import { Link } from "react-router-dom"
import { CONTACT } from "@/components/header/navigation"

interface GetMoreInformationProps {
  /** The ERP product `code` — the copy names the product being asked about. */
  code: string
  name: string
  /**
   * `compact` is the Figma's 642-wide pair of lines under the comparison table;
   * `wide` is the 1304-wide paragraph under the specification table.
   */
  variant?: "compact" | "wide"
}

/** Shared by both variants — brand-blue chat link, black email. */
const ContactLinks = () => (
  <>
    <Link to="/get-quote?source=live-chat" className="font-semibold text-brand-700 hover:underline">
      Live Chat
    </Link>{" "}
    or{" "}
    <a href={CONTACT.emailHref} className="font-semibold text-black hover:underline">
      {CONTACT.email}
    </a>
  </>
)

/**
 * "Get More Information", per the Figma's two blocks at x212, both on a 6px
 * vertical gap:
 *
 *   642 x 82  — two short lines, under "Compare to Similar Items"
 *   1304 x 82 — one paragraph, under the specification table
 *
 *   heading  #000000 · body #2A4153 · chat link #1A74BB · email #000000
 *
 * The product code is live; the contact details come from the site-wide
 * `CONTACT` constant rather than being restated here.
 */
const GetMoreInformation = ({ code, name, variant = "compact" }: GetMoreInformationProps) => {
  const label = code || name

  return (
    <section className="container mx-auto px-4 sm:px-6 md:px-8 pt-[50px]" aria-label="Get More Information">
      <div className={variant === "wide" ? "max-w-[1304px]" : "max-w-[642px]"}>
        <h2 className="text-[28px] font-medium leading-[28.9px] tracking-[-0.02em] text-black">
          Get More Information
        </h2>

        {variant === "wide" ? (
          // 6px under the heading — the block's gap.
          <p className="mt-1.5 text-[14px] font-light leading-[1.421] text-ink-slate">
            Discover unbeatable prices and fast shipping for the {label}. Access the detailed {label} datasheet and
            ensure you&apos;re getting the best deal with our reliable delivery service. Need assistance? Our free live
            chat support is here to help. For more information about the product and pricing, contact us via{" "}
            <ContactLinks />
          </p>
        ) : (
          <>
            <p className="mt-1.5 text-[14px] font-light leading-[1.421] text-ink-slate">
              Do you have any question about the {label}?
            </p>
            <p className="mt-1.5 text-[14px] font-light leading-[1.421] text-ink-slate">
              Contact us now via <ContactLinks />
            </p>
          </>
        )}
      </div>
    </section>
  )
}

export default GetMoreInformation
