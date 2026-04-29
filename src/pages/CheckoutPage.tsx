"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "../store"
import { guestCheckout } from "@/api/services/orderService"
import { clearCart } from "../store/cartSlice"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button" // Assuming Button is available from shadcn/ui
import { useToast } from "@/components/ui/use-toast"
const CheckoutPage = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {toast} = useToast()
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/")
    }
  }, [])

  // Calculate subtotal and savings
  const subtotal = cartItems.reduce((sum, item) => sum + (item.promoPrice || item.price) * item.quantity, 0)
  const productTax = subtotal * 0.05 // 5% tax
  const total = subtotal + productTax
  const savings = cartItems.reduce((sum, item) => {
    if (item.promoPrice) {
      return sum + (item.price - item.promoPrice) * item.quantity
    }
    return sum
  }, 0)

  const orderSummary = {
    totalWithoutTax: subtotal,
    productTax,
    total,
    shipping: 0.0,
    grandTotal: total, // add shipping if needed
    savings,
  }

  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    billingLine1: "",
    billingLine2: "",
    billingCity: "",
    billingPostalCode: "",
    billingState: "",
    billingCountry: "",
    shippingLine1: "",
    shippingLine2: "",
    shippingCity: "",
    shippingPostalCode: "",
    shippingState: "",
    shippingCountry: "",
    paymentMethod: "cash-on-delivery",
    note: "",
  })

  const [sameAsBilling, setSameAsBilling] = useState(true)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [checkoutResponse, setCheckoutResponse] = useState<any>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        company: form.company,
        billing_line1: form.billingLine1,
        billing_line2: form.billingLine2,
        billing_city: form.billingCity,
        billing_state: form.billingState,
        billing_postal_code: form.billingPostalCode,
        billing_country: form.billingCountry,
        shipping_line1: sameAsBilling ? form.billingLine1 : form.shippingLine1,
        shipping_line2: sameAsBilling ? form.billingLine2 : form.shippingLine2,
        shipping_city: sameAsBilling ? form.billingCity : form.shippingCity,
        shipping_state: sameAsBilling ? form.billingState : form.shippingState,
        shipping_postal_code: sameAsBilling ? form.billingPostalCode : form.shippingPostalCode,
        shipping_country: sameAsBilling ? form.billingCountry : form.shippingCountry,
        shipping_phone: form.phone, // or a separate shipping phone if you have it
        items: cartItems.map((item) => ({
          product_id: item.id,
          qty: item.quantity,
          option_id: null, // or item.option_id if you support options
        })),
        payment_method: "cod",
        note: form.note || "",
      }

      const response = await guestCheckout(payload)
      setSuccess(true)
      setCheckoutResponse(response)
      toast({
        title: "Checkout successful",
        description: "Order placed successfully!",
      })
      dispatch(clearCart())
      // Redirect to confirmation page with order data
      navigate("/order-confirmation", { state: { order: response } })
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Checkout failed",
        description: err?.response?.data?.message === "Cart items are required and must be a non-empty array." ? "Please add some products to your cart" : "Checkout failed",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8 md:py-10">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-16 max-w-7xl">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 sm:mb-8 text-center lg:text-left">
          Checkout
        </h1>
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
          {/* Main Form */}
          <div className="flex-1">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm">
              {/* Personal Information */}
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                    <input
                      type="text"
                      name="company"
                      value={form.company}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Billing Address */}
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">Billing Address</h3>
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Line 1 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="billingLine1"
                      value={form.billingLine1}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Line 2</label>
                    <input
                      type="text"
                      name="billingLine2"
                      value={form.billingLine2}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="billingCity"
                        value={form.billingCity}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                      <input
                        type="text"
                        name="billingPostalCode"
                        value={form.billingPostalCode}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                      <input
                        type="text"
                        name="billingState"
                        value={form.billingState}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="billingCountry"
                        value={form.billingCountry}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h3 className="text-base sm:text-lg font-semibold">Shipping Address</h3>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sameAsBilling}
                      onChange={(e) => setSameAsBilling(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Same as Billing Address</span>
                  </label>
                </div>
                {!sameAsBilling && (
                  <div className="space-y-4 sm:space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Line 1 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="shippingLine1"
                        value={form.shippingLine1}
                        onChange={handleChange}
                        required={!sameAsBilling}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Line 2</label>
                      <input
                        type="text"
                        name="shippingLine2"
                        value={form.shippingLine2}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="shippingCity"
                          value={form.shippingCity}
                          onChange={handleChange}
                          required={!sameAsBilling}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                        <input
                          type="text"
                          name="shippingPostalCode"
                          value={form.shippingPostalCode}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                        <input
                          type="text"
                          name="shippingState"
                          value={form.shippingState}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Country <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="shippingCountry"
                          value={form.shippingCountry}
                          onChange={handleChange}
                          required={!sameAsBilling}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div className="p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">Payment Method</h3>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash-on-delivery"
                      checked={form.paymentMethod === "cash-on-delivery"}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Cash On Delivery</span>
                  </label>
                </div>
                {loading && <div className="mt-4 text-center text-gray-600">Placing order...</div>}
                {error && <div className="mt-4 text-red-600 text-center">{error}</div>}
                {success && <div className="mt-4 text-green-600 text-center">Order placed successfully!</div>}
                <Button
                  type="submit"
                  className="w-full mt-6 sm:mt-8 bg-[#1A74BB] hover:bg-[#1A74BB] text-white font-semibold py-3 sm:py-4 px-4 rounded-lg transition-colors duration-200 text-base sm:text-lg"
                  disabled={loading}
                >
                  {loading ? "Placing Order..." : "Submit Order"}
                </Button>
                {submitted && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800 font-semibold">Order placed successfully! (Demo only)</p>
                  </div>
                )}
              </div>
            </form>

            {/* Show checkout response as a table if present */}
            {checkoutResponse && (
              <div className="mt-6 sm:mt-8 bg-white rounded-lg shadow-sm p-4 sm:p-6">
                <h3 className="text-lg font-semibold mb-4">Order Response</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <tbody>
                      {Object.entries(checkoutResponse).map(([key, value]) => (
                        <tr key={key} className="border-b border-gray-100 last:border-b-0">
                          <td className="font-medium pr-4 py-2 text-gray-700 whitespace-nowrap">{key}</td>
                          <td className="py-2 text-gray-900">
                            {typeof value === "object" ? JSON.stringify(value) : String(value)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 sticky top-8">
              <div className="flex items-center mb-4 sm:mb-6">
                <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                <h3 className="text-lg sm:text-xl font-semibold">Order Summary</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-600">Total w/o Tax</span>
                  <span className="font-medium">AED {orderSummary.totalWithoutTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-600">Product Tax</span>
                  <span className="font-medium">AED {orderSummary.productTax.toFixed(2)} (5%)</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-600">Total</span>
                  <span className="font-medium">AED {orderSummary.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-600">
                    Shipping <span className="text-red-500">*</span>
                  </span>
                  <span className="font-medium">AED {orderSummary.shipping.toFixed(2)}</span>
                </div>
                {orderSummary.savings > 0 && (
                  <div className="flex justify-between text-sm sm:text-base text-green-600">
                    <span>You Save</span>
                    <span className="font-semibold">AED {orderSummary.savings.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-3 mt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Grand Total</span>
                    <span>AED {orderSummary.grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
