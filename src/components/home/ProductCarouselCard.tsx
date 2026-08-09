import { Link } from "react-router-dom"
import { createSlug } from "@/lib/utils"
import { formatAed, type CardProduct } from "./productCard"

interface ProductCarouselCardProps {
  product: CardProduct
}

/**
 * Delivery day shown on in-stock cards.
 *
 * The Figma prints a fixed "Today, Jun 13". The ERP returns no delivery,
 * fulfilment or dispatch field of any kind, so there is nothing to derive a
 * real date from — this renders the current day rather than a hard-coded one,
 * which at least never contradicts itself. It remains a marketing claim, not
 * data: drop the line, or wire it to a real field, if that promise is wrong.
 */
const deliveryDay = () =>
  `Today, ${new Date().toLocaleDateString("en-GB", { month: "short", day: "numeric" })}`

/**
 * Product card used by the home carousels.
 *
 * Figma geometry, taken from the 246.32 x 439.46 instance: a 1.09 `#E5E5E5`
 * outside stroke on `#FFFFFF`, 8.68 corners, and a 227 x 155 image well whose
 * fill is the image itself, bled to the well's edges.
 *
 * That well carries `padding 32.55 / 27.13` in the file, which is autolayout
 * padding for anything nested inside it — not an inset on the fill. A frame
 * whose Fill is an image covers the frame regardless. Reading it as an inset
 * is what left the product floating in a field of white.
 *
 * The sale badge, discount chip and struck-through price are all conditional
 * on the ERP returning `promo_price`. No product currently carries one, so
 * they stay hidden until real promo data exists — they are not decoration.
 */
const ProductCarouselCard = ({ product }: ProductCarouselCardProps) => {
  const { name, image, price, originalPrice, discountPercent, inStock } = product
  const to = `/product/${createSlug(name)}`

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-lg border border-surface-muted bg-white">
      <Link
        to={to}
        state={{ productId: product.id }}
        /* White behind the shot, per the Figma — its image well is filled with
           the image itself, and #E7E7E7 appears nowhere in the frame's colours.
           The grey is kept only for a card with no photo, where a plain white
           gap would read as a broken card rather than a missing image. */
        className={`relative block aspect-[227/155] shrink-0 ${image ? "bg-white" : "bg-surface-placeholder"}`}
      >
        {originalPrice && (
          <span className="absolute right-3 top-3 z-10 rounded bg-brand-700 px-2.5 py-1 text-[11px] font-semibold text-white">
            SALE
          </span>
        )}
        {image && (
          /* Absolute so the shot cannot drive the well's height — an img is a
             replaced element and its intrinsic size otherwise wins over the
             `aspect-ratio` box, leaving every card a different depth. */
          <img
            src={image}
            alt={name}
            loading="lazy"
            /* `cover`, to fill the well as the Figma's image fill does. It
               crops, which suits this catalogue: the ERP's shots are products
               centred on white, so what a wide well trims off a squarer photo
               is the empty margin above and below rather than the product.
               A tall product would lose its ends — worth revisiting if the
               range ever grows past rack gear. */
            className="absolute inset-0 h-full w-full object-cover"
            onError={(event) => {
              event.currentTarget.style.visibility = "hidden"
            }}
          />
        )}
      </Link>

      <div className="flex flex-1 flex-col px-4 pb-5 pt-4">
        <div className="flex items-center gap-2">
          <span className="text-[12px] text-ink-muted">{inStock ? "In Stock" : "Out of Stock"}</span>
          {discountPercent !== undefined && (
            <span className="rounded bg-success-light px-1.5 py-0.5 text-[11px] font-semibold text-success-dark">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        <Link
          to={to}
          state={{ productId: product.id }}
          className="mt-3 line-clamp-2 text-[15px] leading-[21px] text-black hover:text-brand-700"
          title={name}
        >
          {name}
        </Link>

        <span className="mt-2.5 w-fit rounded bg-surface-badge px-2.5 py-1 text-[10px] text-ink-slate">
          Fulfilled by Hamtos
        </span>

        <div className="mt-2.5">
          <p className="text-[13px] text-black">
            AED <span className="text-[16px] font-bold text-brand-700">{formatAed(price)}</span>
          </p>
          {originalPrice && (
            <p className="text-[12px] text-ink-silver line-through">AED {formatAed(originalPrice)}</p>
          )}
        </div>

        {/* Delivery only when there is stock to deliver: the Figma swaps this
            block for the quotation button on an out-of-stock card rather than
            showing both, and promising same-day delivery on something the ERP
            reports as unavailable would be the wrong claim.

            The box keeps its height either way — both Figma variants are the
            same 439 tall — so a rail of out-of-stock products does not render
            visibly shorter cards than a rail of in-stock ones. Pinned to the
            foot so it lines up across titles that wrap to different depths. */}
        <div className="mt-auto min-h-[62px] pt-5 text-[12px] leading-[21px] text-ink-muted">
          {inStock && (
            <>
              <p>
                Free delivery by <span className="text-success">{deliveryDay()}</span>
              </p>
              <p>Free store pickup</p>
            </>
          )}
        </div>
      </div>

      {/* Outside the padded body so it spans the full card width, flush with
          the card edges as per the design. */}
      {!inStock && (
        <Link
          to="/get-quote"
          className="mt-auto flex h-[49px] items-center justify-center bg-surface-quote text-[12px] font-semibold tracking-wide text-ink transition-colors hover:bg-brand-300 hover:text-white"
        >
          GET QUOTATION
        </Link>
      )}
    </article>
  )
}

export default ProductCarouselCard
