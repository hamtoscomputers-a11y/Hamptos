import { Link } from "react-router-dom"
import { createSlug } from "@/lib/utils"
import { formatAed, type CardProduct } from "./productCard"

interface ProductCarouselCardProps {
  product: CardProduct
}

/**
 * Product card used by the home carousels.
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
      {/* Source images from the ERP already carry their own white padding, so
          the frame stays white and adds none of its own — anything else double
          -frames the product. Products with no image render an empty tile. */}
      <Link to={to} state={{ productId: product.id }} className="relative block bg-white">
        {originalPrice && (
          <span className="absolute right-0 top-3 z-10 rounded-l bg-brand-700 px-2 py-1 text-[10px] font-bold text-white">
            SALE
          </span>
        )}
        {image ? (
          <img
            src={image}
            alt={name}
            loading="lazy"
            className="aspect-[4/3] w-full object-contain"
            onError={(event) => {
              event.currentTarget.style.visibility = "hidden"
            }}
          />
        ) : (
          <div className="aspect-[4/3] w-full bg-[#F3F3F3]" />
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <div className="flex items-center gap-2">
          <span className={`text-[11px] ${inStock ? "text-ink-muted" : "text-ink-muted/70"}`}>
            {inStock ? "In Stock" : "Out of Stock"}
          </span>
          {discountPercent !== undefined && (
            <span className="rounded bg-success-light px-1.5 py-0.5 text-[10px] font-semibold text-success-dark">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        <Link
          to={to}
          state={{ productId: product.id }}
          className="line-clamp-2 text-sm font-medium text-ink hover:text-brand-700"
          title={name}
        >
          {name}
        </Link>

        <span className="w-fit rounded bg-brand-100 px-2 py-0.5 text-[10px] font-medium text-brand-700">
          Fulfilled by Hamtos
        </span>

        <div className="mt-auto">
          <p className="text-sm text-ink-muted">
            AED <span className="text-base font-bold text-brand-700">{formatAed(price)}</span>
          </p>
          {originalPrice && (
            <p className="text-xs text-ink-muted/80 line-through">AED {formatAed(originalPrice)}</p>
          )}
        </div>

        {!inStock && (
          <Link
            to="/get-quote"
            className="mt-2 block rounded bg-brand-200 py-2 text-center text-[11px] font-bold tracking-wide text-brand-950 transition-colors hover:bg-brand-300 hover:text-white"
          >
            GET QUOTATION
          </Link>
        )}
      </div>
    </article>
  )
}

export default ProductCarouselCard
