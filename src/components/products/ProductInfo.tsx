import { useState } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, Award, BadgePlus, Heart, Minus, Plus, ShieldCheck, UserRound } from "lucide-react"
import RatingStars from "./RatingStars"
import { useProductQuestions, useProductReviews } from "@/api/hooks/useProducts"

interface ProductInfoProps {
  name: string
  brand: string
  /**
   * Whose reviews and questions to count in the line under the title. Both come
   * from the same cache entries the sections further down use, so this adds no
   * requests to the page.
   */
  productId?: string
  /** Brand id, for the brand link; omitted when the ERP sends only a name. */
  brandId?: string | number
  /** The ERP product `code` — shown as the Model number. */
  model: string
  price: number
  /** List price, present only when a promo undercuts it. */
  originalPrice?: number
  inStock: boolean
  availableQty: number
  quantity: number
  onQuantityChange: (quantity: number) => void
  onAddToCart: () => void
  /** Whether this product is saved; the page owns the wishlist, as it does the cart. */
  isWishlisted?: boolean
  onToggleWishlist?: () => void
}

/** Prices render as `700.00` in the Figma. */
const formatPrice = (value: number) =>
  value.toLocaleString("en-AE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })

/**
 * The three trust points on the pale-blue band. Site-wide chrome, identical for
 * every product, so they carry no product data.
 */
const TRUST_BADGES = [
  { icon: ShieldCheck, title: "100% Genuine", subtitle: "Original, Factory-Verified" },
  { icon: BadgePlus, title: "3 Years Warranty", subtitle: "Extended, Enterprise Grade" },
  { icon: Award, title: "10 Years Expertise", subtitle: "Proven, Deployment-Focused" },
]

/**
 * Configurator rows. The ERP exposes no product-options schema, so these are
 * presentational placeholders — selecting one does not change the subtotal.
 */
const OPTION_GROUPS: { label: string; options: string[] }[] = [
  { label: "Condition", options: ["Original New"] },
  { label: "Wall Mounting Bracket", options: ["None", "R3j18A (Solid Surface) + AED70.00"] },
  { label: "Power Adaptor", options: ["None", "R3K00A + AED 70.00"] },
]

/** One selectable configurator row; local-only, drives no pricing. */
const OptionGroup = ({ label, options }: { label: string; options: string[] }) => {
  const [selected, setSelected] = useState(0)

  return (
    <div className="mt-4">
      <p className="text-[16px] font-semibold leading-[1.275] text-black">{label}</p>
      <div className="mt-2 flex flex-wrap gap-3.5">
        {options.map((option, index) => (
          <button
            key={option}
            type="button"
            onClick={() => setSelected(index)}
            aria-pressed={selected === index}
            className={`rounded-lg border border-brand-700 bg-white px-5 py-[15px] text-[15px] leading-none transition-colors ${
              selected === index ? "font-medium text-brand-700" : "text-ink-muted hover:text-brand-700"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}

/**
 * Right column of the product header: title, identity line, price, trust band,
 * configurator, subtotal, cart controls and the expertise card. Everything with
 * an ERP field is live, the rating line included; the configurator and the
 * marketing copy are still static design placeholders.
 */
const ProductInfo = ({
  name,
  brand,
  productId,
  brandId,
  model,
  price,
  originalPrice,
  inStock,
  availableQty,
  quantity,
  onQuantityChange,
  onAddToCart,
  isWishlisted = false,
  onToggleWishlist,
}: ProductInfoProps) => {

  // Both share the cache entries Customer Reviews and Questions & Answers
  // already fill, so this summary line costs no extra request.
  const { data: reviewData } = useProductReviews(productId ?? "")
  const { data: questionData } = useProductQuestions(productId ?? "")

  const reviewCount = reviewData?.summary.total ?? 0
  const averageRating = reviewData?.summary.average ?? 0
  const questionCount = questionData?.length ?? 0

  const showListPrice = typeof originalPrice === "number" && originalPrice > price
  const discountPct = showListPrice ? Math.round((1 - price / (originalPrice as number)) * 100) : 0
  const subtotal = price * quantity
  const maxQty = Math.max(1, availableQty || 1)

  return (
    <div className="min-w-0">
      <h1 className="text-[24px] font-medium leading-[1.05] tracking-[-0.02em] text-black md:text-[28px]">{name}</h1>

      {/* Identity line — all live: brand link, ERP code as the model, stock. */}
      <div className="mt-3.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[14px]">
        <span className="text-black">
          Brand:{" "}
          {brandId ? (
            <Link to={`/brand/${brandId}/products`} className="font-medium text-brand-700 hover:underline">
              {brand}
            </Link>
          ) : (
            <span className="font-medium text-brand-700">{brand}</span>
          )}
        </span>
        <span className="text-black">
          Model: <span className="font-medium">{model}</span>
        </span>
        <span className="text-surface-line">|</span>
        <span className={inStock ? "font-medium text-success-dark" : "text-ink-grey"}>
          {inStock ? "In Stock" : "Out of Stock"}
        </span>
      </div>

      {/* Rating — the approved reviews and published Q&A for this product,
          counted by the ERP. Stars fill to the average, so an unrated product
          shows five empty ones rather than a flattering five full ones. */}
      <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[13px] text-ink-muted">
        <RatingStars
          rating={averageRating}
          size={15}
          className="gap-0.5"
          fillClass="text-flash"
          emptyClass="text-surface-line"
        />
        <span>
          {reviewCount > 0
            ? `(${averageRating.toFixed(1)}/5.0) ${reviewCount} ${reviewCount === 1 ? "Review" : "Reviews"}`
            : "No reviews yet"}
        </span>
        {/* Dropped entirely when there are none — a lone separator followed by
            "0 Questions" is noise on a product nobody has asked about. */}
        {questionCount > 0 && (
          <>
            <span className="text-surface-line">|</span>
            <span>
              {questionCount} {questionCount === 1 ? "Question" : "Questions"}
            </span>
          </>
        )}
      </div>

      {/* Price */}
      <div className="mt-4">
        {showListPrice && (
          <div className="flex items-center gap-2.5">
            <span className="text-[13px] text-ink-muted line-through">List Price: AED {formatPrice(originalPrice as number)}</span>
            <span className="rounded bg-success-light px-1.5 py-0.5 text-[11px] font-semibold text-success-dark">
              {discountPct}% OFF
            </span>
          </div>
        )}
        <p className="mt-1.5 text-[32px] font-medium leading-none tracking-tight text-ink-muted">
          AED <span className="text-brand-700">{formatPrice(price)}</span>
        </p>
      </div>

      {/* Trust band — site-wide chrome. */}
      <div className="mt-4 grid grid-cols-1 gap-2.5 rounded-md bg-surface-trust px-5 py-3 sm:grid-cols-3 sm:gap-0">
        {TRUST_BADGES.map(({ icon: Icon, title, subtitle }) => (
          <div key={title} className="flex items-center gap-2.5">
            <Icon className="h-5 w-5 flex-shrink-0 text-black" strokeWidth={1.75} aria-hidden />
            <span className="leading-tight">
              <span className="block text-[12px] font-semibold text-black">{title}</span>
              <span className="block text-[11px] text-ink-steel">{subtitle}</span>
            </span>
          </div>
        ))}
      </div>

      {/* Configurator — presentational placeholders. */}
      {OPTION_GROUPS.map((group) => (
        <OptionGroup key={group.label} label={group.label} options={group.options} />
      ))}

      {/* Subtotal — live: current price x quantity. */}
      <div className="mt-5">
        <p className="text-[13px] font-semibold text-black">Subtotal Price</p>
        <p className="mt-1.5 text-[32px] font-medium leading-none tracking-tight text-ink-muted">
          AED <span className="text-brand-700">{formatPrice(subtotal)}</span>
        </p>
      </div>

      {/* Quantity + actions */}
      <div className="mt-3 flex flex-wrap items-center gap-2.5">
        <div className="flex h-[38px] items-center gap-[15px]">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
            className="flex h-[38px] w-[38px] items-center justify-center rounded-md bg-surface-trust text-ink-pebble transition-colors hover:brightness-95 disabled:opacity-40"
          >
            <Minus size={16} />
          </button>
          <span className="min-w-[18px] text-center text-[15px] font-medium text-black">{quantity}</span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => onQuantityChange(Math.min(maxQty, quantity + 1))}
            disabled={quantity >= maxQty}
            className="flex h-[38px] w-[38px] items-center justify-center rounded-md bg-surface-trust text-ink-pebble transition-colors hover:brightness-95 disabled:opacity-40"
          >
            <Plus size={16} />
          </button>
        </div>

        <button
          type="button"
          onClick={onAddToCart}
          className="flex h-[38px] items-center gap-2 rounded-md bg-brand-700 px-4 text-[13px] font-bold uppercase tracking-wide text-white transition-colors hover:bg-brand-800"
        >
          Add to Cart
        </button>

        <Link
          to={`/get-quote?source=ask-for-product&productName=${encodeURIComponent(name)}`}
          className="flex h-[38px] items-center gap-2 rounded-md bg-brand-700 px-4 text-[13px] font-bold uppercase tracking-wide text-white transition-colors hover:bg-brand-800"
        >
          <ShieldCheck size={16} aria-hidden />
          Get a Quote
        </Link>

        <button
          type="button"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={isWishlisted}
          onClick={onToggleWishlist}
          className="flex h-[38px] w-[38px] items-center justify-center rounded-md border border-brand-700 bg-brand-700 text-white transition-colors hover:bg-brand-800"
        >
          <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Shipping — static copy. */}
      <p className="mt-3.5 text-[16px] font-medium leading-[1.42] text-ink-slate">
        Fast Shipping Across the UAE{" "}
        <Link to="/get-quote?source=shipping-estimate" className="text-brand-700 hover:underline">
          Get an Instant Shipping Estimate
        </Link>
      </p>
      <p className="text-[16px] font-medium leading-[1.42] text-ink-slate">
        Estimated delivery: 2-6 business days via DHL, FedEx, UPS &amp; trusted carriers.
      </p>

      {/* Expertise card — static chrome. */}
      <div className="mt-4 flex items-center gap-2 rounded-lg border border-brand-700 px-5 py-2.5">
        <div className="flex flex-shrink-0 -space-x-3">
          {["#1A74BB", "#07619A", "#47A9F6"].map((color, i) => (
            <span
              key={i}
              className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border-2 border-white text-white"
              style={{ backgroundColor: color }}
              aria-hidden
            >
              <UserRound size={18} fill="currentColor" strokeWidth={0} />
            </span>
          ))}
        </div>
        <div className="min-w-0">
          <p className="text-[14px] font-semibold text-black">Enterprise Expertise You Can Trust</p>
          <p className="text-[12px] text-ink-slate">
            Certified engineers delivering reliable IT solutions for every business.
          </p>
          <Link
            to="/get-quote?source=talk-to-experts"
            className="mt-1 inline-flex items-center gap-1 text-[13px] font-semibold text-brand-700 hover:underline"
          >
            Talk to Our Experts <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ProductInfo
