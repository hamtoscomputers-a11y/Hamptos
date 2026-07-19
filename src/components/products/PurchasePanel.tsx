import { Link } from "react-router-dom"
import { BadgeCheck, Banknote, Lock, MapPin, ShoppingCart } from "lucide-react"
import emiratesNbdLogo from "@/assets/payment-emirates-nbd.png"
import fabDubaiFirstLogo from "@/assets/payment-fab-dubai-first.png"

interface PurchasePanelProps {
  name: string
  price: number
  /** List price, present only when a promo undercuts it. */
  originalPrice?: number
  brand: string
  inStock: boolean
  availableQty: number
  quantity: number
  onQuantityChange: (quantity: number) => void
  onAddToCart: () => void
}

/**
 * Payment partners shown under the stock line. The supplied artwork already
 * carries the card's outline, so a logo card draws no border of its own.
 */
const PAYMENT_PARTNERS: { name: string; logo?: string }[] = [
  { name: "Emirates NBD", logo: emiratesNbdLogo },
  { name: "FAB / dubai first", logo: fabDubaiFirstLogo },
]

const DELIVERY_REGION = "Delivery to Dubai, Abhu Dhabi"

const TRUST_POINTS = [
  { icon: BadgeCheck, label: "Warranty One Year" },
  { icon: Banknote, label: "Cash On Delivery" },
]

/** Prices render as `5,500.00` in the Figma. */
const formatPrice = (value: number) =>
  value.toLocaleString("en-AE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })

/**
 * Right-hand rail of the product detail page: price, delivery, stock, payment
 * partners, cart controls and trust points — the Figma's 264px column.
 */
const PurchasePanel = ({
  name,
  price,
  originalPrice,
  brand,
  inStock,
  availableQty,
  quantity,
  onQuantityChange,
  onAddToCart,
}: PurchasePanelProps) => {
  // The Figma's quantity control is a select, so cap the options at what's held.
  const quantityOptions = Array.from({ length: Math.max(1, Math.min(availableQty, 10)) }, (_, i) => i + 1)

  return (
    <div className="w-full lg:max-w-[288px] lg:border-l lg:border-surface-muted lg:pl-6">
      <div className="flex items-end gap-1.5">
        <span className="pb-1 text-[14px] text-black">AED</span>
        <span className="text-[30px] font-semibold leading-[1.53] tracking-[-0.01em] text-black">
          {formatPrice(price)}
        </span>
      </div>

      {originalPrice && originalPrice > price && (
        <div className="text-[13px] text-ink-body line-through">AED {formatPrice(originalPrice)}</div>
      )}

      <p className="mt-1 text-[13px] text-ink-body">Inclusive of VAT</p>
      <p className="mt-1.5 text-[13px] text-ink-body">Sold By : {brand}</p>

      <hr className="my-5 border-surface-muted" />

      <p className="flex items-center gap-2 text-[13px] font-medium text-brand-700">
        <MapPin className="h-4 w-4 flex-shrink-0 text-brand-900" fill="currentColor" strokeWidth={0} />
        {DELIVERY_REGION}
      </p>

      <p className={`mt-4 text-[13px] ${inStock ? "text-success-bright" : "text-ink-body"}`}>
        {inStock ? "In Stock" : "Out of Stock"}
      </p>

      <div className="mt-4 flex gap-[11px]">
        {PAYMENT_PARTNERS.map((partner) => (
          <div
            key={partner.name}
            className={`flex h-[46px] flex-1 items-center justify-center bg-white ${
              partner.logo ? "" : "border border-surface-card px-2"
            }`}
          >
            {partner.logo ? (
              <img src={partner.logo} alt={partner.name} className="h-full w-full object-contain" />
            ) : (
              <span className="text-center text-[10px] leading-tight text-ink-body">{partner.name}</span>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-[7px]">
        <label className="sr-only" htmlFor="product-quantity">
          Quantity
        </label>
        <select
          id="product-quantity"
          value={quantity}
          onChange={(event) => onQuantityChange(Number(event.target.value))}
          disabled={!inStock}
          className="h-[37px] w-[49px] rounded border border-surface-control bg-white px-2 text-[13px] text-ink disabled:opacity-50"
        >
          {quantityOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        {inStock ? (
          <button
            type="button"
            onClick={onAddToCart}
            className="flex h-[37px] flex-1 items-center justify-center gap-[9px] rounded bg-success-bright text-[14px] font-semibold text-white transition-colors hover:bg-success-deep"
          >
            <ShoppingCart className="h-5 w-5" />
            Add To Cart
          </button>
        ) : (
          <Link
            to={`/get-quote?source=ask-for-product&productName=${encodeURIComponent(name)}`}
            className="flex h-[37px] flex-1 items-center justify-center rounded bg-brand-700 text-[14px] font-semibold text-white transition-opacity hover:opacity-90"
          >
            Ask for Product
          </Link>
        )}
      </div>

      <hr className="my-5 border-surface-muted" />

      <ul className="space-y-4">
        {TRUST_POINTS.map(({ icon: Icon, label }) => (
          <li key={label} className="flex items-center gap-3 text-[13px] text-ink">
            <Icon className="h-[18px] w-[18px] flex-shrink-0 text-ink" strokeWidth={1.5} />
            {label}
          </li>
        ))}
      </ul>

      <hr className="my-5 border-surface-muted" />

      <p className="flex items-center gap-3 text-[13px] text-ink">
        <Lock className="h-[18px] w-[18px] flex-shrink-0 text-ink" strokeWidth={1.5} />
        Secure Transaction
      </p>
    </div>
  )
}

export default PurchasePanel
