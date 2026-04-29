"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "../store"
import { updateQuantity, removeFromCart, clearCart } from "../store/cartSlice"
import { Button } from "@/components/ui/button"

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
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-12 h-12 text-gray-400" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-[#1A74BB] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#1A74BB] transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-16 py-6 sm:py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 mb-4 text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Link>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-0">Shopping Cart</h1>
            <div className="text-sm text-gray-500">
              {cart.length} {cart.length === 1 ? "item" : "items"}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                  <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900">Items in your cart</h2>
                  <button
                    onClick={() => dispatch(clearCart())}
                    className="text-red-600 hover:text-red-700 text-xs sm:text-sm font-medium transition-colors duration-200"
                  >
                    Clear all items
                  </button>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {displayCart.map((item, idx) => {
                  const isUpdating = updatingItems.has(item.id)
                  return (
                    <div
                      key={item.id + (item.is_free ? "-free" : "")}
                      className={`p-3 sm:p-4 md:p-6 transition-all duration-200 ${
                        isUpdating ? "opacity-50 pointer-events-none" : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex gap-3 sm:gap-4">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gray-100 rounded-lg sm:rounded-xl overflow-hidden">
                            <img
                              src={item?.image || "/placeholder.svg?height=100&width=100"}
                              alt={item.name}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.src = "/placeholder.svg?height=100&width=100"
                              }}
                            />
                          </div>
                        </div>
                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1 min-w-0 pr-2">
                              <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 line-clamp-2 mb-1">
                                {item.name}
                                {item.is_free && <span className="ml-1 sm:ml-2 text-green-600 text-xs sm:text-sm">(FREE)</span>}
                              </h3>
                              <p className="text-xs sm:text-sm text-gray-500 mb-1">{item.brand}</p>
                              {/* Show available quantity */}
                              <p className="text-xs text-gray-500">
                                Available:{" "}
                                <span className="font-semibold">
                                  {Number.parseInt(item.quantity_available).toFixed(0) ?? "-"}
                                </span>
                              </p>
                            </div>
                            {!item.is_free && (
                              <button
                                onClick={() => handleRemoveItem(item.id)}
                                disabled={isUpdating}
                                className="p-1.5 sm:p-2 text-gray-400 hover:text-red-500 transition-colors duration-200 disabled:opacity-50 flex-shrink-0"
                                aria-label={`Remove ${item.name} from cart`}
                              >
                                <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                              </button>
                            )}
                          </div>
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 mt-2">
                            {/* Price */}
                            <div className="flex items-center gap-2">
                              <span className="text-base sm:text-lg md:text-xl font-bold text-gray-900">
                                AED {item.is_free ? "0.00" : (item.promoPrice || item.price).toFixed(2)}
                              </span>
                              {item.promoPrice && !item.is_free && (
                                <span className="text-xs sm:text-sm text-gray-400 line-through">AED {item.price.toFixed(2)}</span>
                              )}
                            </div>
                            {/* Quantity Controls */}
                            {!item.is_free ? (
                              <div className="flex items-center gap-2 sm:gap-3">
                                <div className="flex items-center border border-gray-200 rounded-lg">
                                  <button
                                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                    disabled={item.quantity <= 1 || isUpdating}
                                    className="p-1.5 sm:p-2 hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    aria-label="Decrease quantity"
                                  >
                                    <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                  </button>
                                  <span className="px-2 sm:px-4 py-1.5 sm:py-2 text-center min-w-[2.5rem] sm:min-w-[3rem] font-medium text-sm sm:text-base">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                    disabled={isUpdating}
                                    className="p-1.5 sm:p-2 hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
                                    aria-label="Increase quantity"
                                  >
                                    <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <span className="px-2 sm:px-4 py-1.5 sm:py-2 text-center min-w-[2.5rem] sm:min-w-[3rem] font-medium text-xs sm:text-sm bg-gray-100 rounded-lg">
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
          </div>

          {/* Order Summary */}
          <div className="order-1 lg:order-2">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 md:p-8 sticky top-4">
              <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Order Summary</h2>
              <div className="flex justify-between mb-3 sm:mb-4 text-sm sm:text-base">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold text-gray-900">AED {subtotal.toFixed(2)}</span>
              </div>
              {savings > 0 && (
                <div className="flex justify-between mb-3 sm:mb-4 text-sm sm:text-base">
                  <span className="text-green-600">You Save</span>
                  <span className="font-semibold text-green-600">AED {savings.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between mb-4 sm:mb-6 text-sm sm:text-base">
                <span className="text-gray-600">Delivery</span>
                <span className="font-semibold text-gray-900">Free</span>
              </div>
              <Button
                className="w-full bg-[#1A74BB] text-white py-2.5 sm:py-3 md:py-4 rounded-lg font-semibold text-sm sm:text-base md:text-lg transition-colors duration-200"
                onClick={() => navigate("/cart/checkout")}
              >
                Proceed to Checkout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage
