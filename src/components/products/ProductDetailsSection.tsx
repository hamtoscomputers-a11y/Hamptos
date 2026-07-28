interface ProductDetailsSectionProps {
  /** The ERP product `code` — used in the figure caption. */
  code: string
  name: string
  /** Main image, already resolved to an absolute URL by the page. */
  image: string
  /** `photos` from the ERP. A second photo, when present, is the front panel. */
  photos?: string[]
  /** `product_details` from the ERP — HTML prose. */
  productDetails?: string
}

/**
 * Product Details, per the Figma's block at x212:
 *
 *   "Product Details"       28 / 28.9 / -2%   #000000
 *   figure caption          14 Light / 142.1% #2A4153   (6px below)
 *   509 x 509 image frame                               (30px below)
 *   benefits copy           642 wide, #2A4153            (30px below)
 *
 * The copy is the ERP's `product_details` verbatim — whatever markup it holds
 * (paragraphs, or the Figma's intro line over a bullet list) renders in the
 * Figma's type. Nothing here is written copy.
 */
const ProductDetailsSection = ({ code, name, image, photos = [], productDetails }: ProductDetailsSectionProps) => {
  // The Figma captions this figure as the front panel — the second photo when
  // the ERP has one, otherwise the product's main image.
  const figure = photos[1] || photos[0] || image
  const caption = code ? `Figure 2 shows the front panel of ${code}.` : `Figure 2 shows the front panel of ${name}.`

  if (!figure && !productDetails) return null

  return (
    <section className="container mx-auto px-4 sm:px-6 md:px-8 pt-[50px]" aria-labelledby="product-details-heading">
      <h2
        id="product-details-heading"
        className="text-[28px] font-medium leading-[28.9px] tracking-[-0.02em] text-black"
      >
        Product Details
      </h2>

      <p className="mt-1.5 max-w-[642px] text-[14px] font-light leading-[1.421] text-ink-slate">{caption}</p>

      <div className="mt-[30px] aspect-square w-full max-w-[509px] overflow-hidden">
        <img src={figure} alt={name} className="h-full w-full object-contain" loading="lazy" />
      </div>

      {productDetails && (
        // 642 in the Figma — a fixed measure, not the container width. The
        // arbitrary variants give the ERP's own tags the Figma's list and
        // paragraph rhythm without letting its markup carry styling of its own.
        <div
          className="mt-[30px] max-w-[642px] text-[14px] font-light leading-[1.421] text-ink-slate [&_b]:font-semibold [&_li]:mt-0.5 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mt-3 [&_p:first-child]:mt-0 [&_strong]:font-semibold [&_ul]:mt-1.5 [&_ul]:list-disc [&_ul]:pl-5"
          dangerouslySetInnerHTML={{ __html: productDetails }}
        />
      )}
    </section>
  )
}

export default ProductDetailsSection
