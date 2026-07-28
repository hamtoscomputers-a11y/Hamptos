import { Link } from "react-router-dom"
import { CONTACT } from "@/components/header/navigation"

interface GetMoreInformationProps {
  /** The ERP product `code` — the question names the product being asked about. */
  code: string
  name: string
}

/**
 * "Get More Information", per the Figma's 642 x 82 block at x212 with a 6px
 * vertical gap:
 *
 *   "Get More Information"                       #000000
 *   "Do you have any question about the <code>?" #2A4153
 *   "Contact us now via Live Chat or <email>"    #2A4153, links #1A74BB
 *
 * The product code is live; the contact details come from the site-wide
 * `CONTACT` constant rather than being restated here.
 */
const GetMoreInformation = ({ code, name }: GetMoreInformationProps) => (
  <section className="container mx-auto px-4 sm:px-6 md:px-8 pt-[50px]" aria-labelledby="get-more-information-heading">
    <div className="max-w-[642px]">
      <h2
        id="get-more-information-heading"
        className="text-[28px] font-medium leading-[28.9px] tracking-[-0.02em] text-black"
      >
        Get More Information
      </h2>

      {/* 6px under the heading and again between the two lines — the block's gap. */}
      <p className="mt-1.5 text-[14px] font-light leading-[1.421] text-ink-slate">
        Do you have any question about the {code || name}?
      </p>
      <p className="mt-1.5 text-[14px] font-light leading-[1.421] text-ink-slate">
        Contact us now via{" "}
        <Link to="/get-quote?source=live-chat" className="font-semibold text-brand-700 hover:underline">
          Live Chat
        </Link>{" "}
        or{" "}
        <a href={CONTACT.emailHref} className="font-semibold text-black hover:underline">
          {CONTACT.email}
        </a>
      </p>
    </div>
  </section>
)

export default GetMoreInformation
