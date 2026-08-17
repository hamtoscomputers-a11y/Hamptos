import { useMemo } from "react"

interface ProductOverviewProps {
  /** `overview` from the ERP — the short summary written for this section. */
  overview?: string
  /** `product_details` from the ERP, used only as a fallback. */
  productDetails?: string
}

/**
 * Strip a fragment of ERP HTML down to its first paragraph of plain text.
 *
 * `product_details` is a full marketing body, so taking all of it here would
 * repeat the Product Details section further down the page. Cells are read as
 * text rather than injected, so ERP markup never reaches the DOM.
 */
const firstParagraph = (html: string): string => {
  if (typeof DOMParser === "undefined") return ""

  const doc = new DOMParser().parseFromString(html, "text/html")
  const paragraph = doc.querySelector("p")
  const text = (paragraph?.textContent ?? doc.body.textContent ?? "").trim()

  return text
}

/**
 * "Product Overview", per the Figma's block at x212: the heading over a single
 * summary paragraph, the widest measure on the page.
 *
 * The copy is the ERP's `overview` field, written for exactly this spot. Where
 * that has not been filled in yet the first paragraph of `product_details`
 * stands in, so a product is never headed by an empty section.
 */
const ProductOverview = ({ overview, productDetails }: ProductOverviewProps) => {
  const text = useMemo(() => {
    const own = (overview ?? "").trim()
    if (own) return firstParagraph(own) || own
    return productDetails ? firstParagraph(productDetails) : ""
  }, [overview, productDetails])

  if (!text) return null

  return (
    <section className="container mx-auto px-4 sm:px-6 md:px-8 pt-6 md:pt-[50px]" aria-labelledby="product-overview-heading">
      <h2
        id="product-overview-heading"
        className="text-[28px] font-medium leading-[28.9px] tracking-[-0.02em] text-black"
      >
        Product Overview
      </h2>

      <p className="mt-1.5 text-[14px] font-light leading-[1.421] text-ink-slate">{text}</p>
    </section>
  )
}

export default ProductOverview
