"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "../store"
import { updateQuantity, removeFromCart, clearCart } from "../store/cartSlice"

/** Prices render as `5,500.00` across the storefront. */
const formatPrice = (value: number) =>
  value.toLocaleString("en-AE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const CartPage: React.FC = () => {
  const cart = useSelector((state: RootState) => state.cart.items)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [updatingItems, setUpdatingItems] = useState<Set<number>>(new Set())

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if ("scrollBehavior" in document.documentElement.style) {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" })
    } else {
      window.scrollTo(0, 0)
    }
  }, [])

  useEffect(() => {
    if (cart.length === 0) {
      navigate("/")
    }
  }, [cart, navigate])

  const handleQuantityChange = async (id: number, newQuantity: number) => {
    setUpdatingItems((prev) => new Set(prev).add(id))
    dispatch(updateQuantity({ id, quantity: newQuantity }))
    setTimeout(() => {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev)
        newSet.delete(id)
        return newSet
      })
    }, 200)
  }

  const handleRemoveItem = async (id: number) => {
    setUpdatingItems((prev) => new Set(prev).add(id))
    dispatch(removeFromCart(id))
    setTimeout(() => {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev)
        newSet.delete(id)
        return newSet
      })
    }, 200)
  }

  // Calculate subtotal and savings
  const subtotal = cart.reduce((sum, item) => sum + (item.promoPrice || item.price) * item.quantity, 0)
  const savings = cart.reduce((sum, item) => {
    if (item.promoPrice) {
      return sum + (item.price - item.promoPrice) * item.quantity
    }
    return sum
  }, 0)

  // Empty cart state
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto max-w-3xl px-4 py-16 sm:px-6 md:px-8">
          <div className="rounded-lg border border-surface-muted bg-white px-6 py-12 text-center">
            <span className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-surface-placeholder">
              <ShoppingBag className="h-9 w-9 text-ink-faint" aria-hidden />
            </span>
            <h1 className="text-[20px] font-semibold text-ink-title">Your cart is empty</h1>
            <p className="mx-auto mt-3 max-w-sm text-[13px] leading-[20px] text-ink-body">
              Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
            </p>
            <Link
              to="/products"
              className="mt-7 inline-flex h-[40px] items-center gap-2 rounded bg-brand-700 px-6 text-[14px] font-semibold text-white transition-opacity hover:opacity-90"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Build a display list with free items for BXGY
  const displayCart = []
  cart.forEach((item) => {
    // Add the purchased item
    displayCart.push({ ...item, is_free: false })

    // BXGY logic for free items
    if (item.BXGY) {
      const qtypurchase = Number(item.BXGY.qtypurchase)
      const qtygte = Number(item.BXGY.qtygte)
      if (qtypurchase > 0 && qtygte > 0) {
        const freeQty = Math.floor(item.quantity / qtypurchase) * qtygte
        if (freeQty > 0) {
          displayCart.push({
            ...item,
            quantity: freeQty,
            is_free: true,
          })
        }
      }
    }
  })

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8 md:px-8">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-[13px] text-ink-body transition-colors hover:text-brand-700"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Continue Shopping
        </Link>

        <div className="mt-4 flex items-baseline justify-between gap-4 border-b border-surface-muted pb-4">
          <h1 className="text-[22px] font-semibold leading-tight text-ink-title sm:text-[26px]">Shopping Cart</h1>
          <span className="flex-shrink-0 text-[13px] text-ink-body">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </span>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          {/* Cart Items */}
          <div className="overflow-hidden rounded-lg border border-surface-muted bg-white">
            <div className="flex items-center justify-between gap-4 border-b border-surface-muted px-4 py-3.5 sm:px-5">
              <h2 className="text-[15px] font-semibold text-ink-title">Items in your cart</h2>
              <button
                onClick={() => dispatch(clearCart())}
                className="flex-shrink-0 text-[13px] text-ink-body transition-colors hover:text-red-600"
              >
                Clear all items
              </button>
            </div>

            <div className="divide-y divide-surface-muted">
              {displayCart.map((item) => {
                const isUpdating = updatingItems.has(item.id)
                // The ERP sends this as a numeric string, and omits it entirely
                // on some products — so it is only shown once it parses.
                const available = Number(item.quantity_available)
                const hasAvailable = Number.isFinite(available) && available > 0
                const atStockLimit = hasAvailable && item.quantity >= available

                return (
                  <div
                    key={item.id + (item.is_free ? "-free" : "")}
                    className={`px-4 py-4 transition-opacity sm:px-5 sm:py-5 ${
                      isUpdating ? "pointer-events-none opacity-50" : ""
                    }`}
                  >
                    <div className="flex gap-4">
                      {/* White, not the grey product-card well: the ERP's shots
                          run anywhere from 1:1 to 2.8:1 on a white background,
                          so a tinted box letterboxes the wide ones into a thin
                          strip floating in grey. On white the padding simply
                          disappears and the product reads at its own shape. */}
                      <span className="flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded border border-surface-muted bg-white sm:h-[92px] sm:w-[92px]">
                        <img
                          src={item?.image || "/placeholder.svg?height=100&width=100"}
                          alt={item.name}
                          className="h-full w-full object-contain p-1.5"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = "/placeholder.svg?height=100&width=100"
                          }}
                        />
                      </span>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <h3 className="line-clamp-2 text-[14px] font-semibold leading-[19px] text-ink-title">
                              {item.name}
                            </h3>
                            {item.is_free && (
                              <span className="mt-1.5 inline-block rounded bg-success-light px-1.5 py-px text-[10px] font-semibold uppercase text-success-dark">
                                Free
                              </span>
                            )}
                            <p className="mt-1.5 text-[12px] uppercase text-ink-body">{item.brand}</p>
                            {hasAvailable && (
                              <p className="mt-0.5 text-[12px] text-ink-body">
                                Available: <span className="font-medium text-ink">{available}</span>
                              </p>
                            )}
                          </div>

                          {!item.is_free && (
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              disabled={isUpdating}
                              className="-mr-1 flex-shrink-0 p-1 text-red-600 transition-colors hover:text-red-700 disabled:opacity-50"
                              aria-label={`Remove ${item.name} from cart`}
                            >
                              <Trash2 className="h-[18px] w-[18px]" />
                            </button>
                          )}
                        </div>

                        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-[12px] text-ink">AED</span>
                            <span className="text-[16px] font-bold text-brand-700">
                              {item.is_free ? "0.00" : formatPrice(item.promoPrice || item.price)}
                            </span>
                            {item.promoPrice && !item.is_free && (
                              <span className="text-[12px] text-ink-body line-through">
                                AED {formatPrice(item.price)}
                              </span>
                            )}
                          </div>

                          {!item.is_free ? (
                            <div className="flex h-[34px] items-center rounded border border-surface-control">
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1 || isUpdating}
                                className="flex h-full w-9 items-center justify-center text-ink transition-colors hover:bg-surface-subtle disabled:cursor-not-allowed disabled:opacity-40"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="min-w-[38px] px-1 text-center text-[13px] font-medium text-ink">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                // The product page caps quantity at the stock the
                                // ERP reports; the cart has to agree, or an order
                                // can be placed for more than exists.
                                disabled={isUpdating || atStockLimit}
                                className="flex h-full w-9 items-center justify-center text-ink transition-colors hover:bg-surface-subtle disabled:cursor-not-allowed disabled:opacity-40"
                                aria-label="Increase quantity"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ) : (
                            <span className="flex h-[34px] min-w-[38px] items-center justify-center rounded bg-surface-subtle px-3 text-[13px] font-medium text-ink">
                              {item.quantity}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Order Summary */}
          <div className="rounded-lg border border-surface-muted bg-white lg:sticky lg:top-4">
            <h2 className="border-b border-surface-muted px-5 py-3.5 text-[15px] font-semibold text-ink-title">
              Order Summary
            </h2>

            <div className="px-5 py-4">
              <dl className="space-y-3 text-[13px]">
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-ink-body">Subtotal</dt>
                  <dd className="font-medium text-ink">AED {formatPrice(subtotal)}</dd>
                </div>
                {savings > 0 && (
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-success-deep">You Save</dt>
                    <dd className="font-medium text-success-deep">AED {formatPrice(savings)}</dd>
                  </div>
                )}
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-ink-body">Delivery</dt>
                  <dd className="font-medium text-success-deep">Free</dd>
                </div>
              </dl>

              <hr className="my-4 border-surface-muted" />

              <div className="flex items-baseline justify-between gap-4">
                <span className="text-[14px] font-semibold text-ink-title">Total</span>
                <span className="flex items-baseline gap-1.5">
                  <span className="text-[12px] text-ink">AED</span>
                  <span className="text-[20px] font-bold text-brand-700">{formatPrice(subtotal)}</span>
                </span>
              </div>
              <p className="mt-1 text-right text-[12px] text-ink-body">Inclusive of VAT</p>

              <button
                type="button"
                className="mt-5 flex h-[42px] w-full items-center justify-center rounded bg-brand-700 text-[14px] font-semibold text-white transition-opacity hover:opacity-90"
                onClick={() => navigate("/cart/checkout")}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage
