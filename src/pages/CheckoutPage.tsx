"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "../store"
import { guestCheckout } from "@/api/services/orderService"
import { clearCart } from "../store/cartSlice"
import { Link, useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

/** Prices render as `5,500.00` across the storefront. */
const formatPrice = (value: number) =>
  value.toLocaleString("en-AE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const CONTROL =
  "h-[38px] w-full rounded border border-surface-control bg-white px-3 text-[13px] text-ink outline-none transition-colors focus:border-brand-700 focus:ring-1 focus:ring-brand-700"

interface FieldProps {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
  type?: string
}

/**
 * Declared at module scope, not inside the page: a component redefined on every
 * render remounts its input and drops the caret mid-typing.
 */
const Field = ({ label, name, value, onChange, required = false, type = "text" }: FieldProps) => (
  <div>
    <label htmlFor={name} className="mb-1.5 block text-[13px] font-medium text-ink-title">
      {label}
      {required && <span className="ml-0.5 text-red-600">*</span>}
    </label>
    <input
      id={name}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className={CONTROL}
    />
  </div>
)

const Section = ({
  title,
  action,
  children,
}: {
  title: string
  action?: React.ReactNode
  children: React.ReactNode
}) => (
  <section className="border-b border-surface-muted px-4 py-5 last:border-b-0 sm:px-5">
    <div className="mb-4 flex items-center justify-between gap-4">
      <h2 className="text-[15px] font-semibold text-ink-title">{title}</h2>
      {action}
    </div>
    {children}
  </section>
)

const CheckoutPage = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { toast } = useToast()

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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
      toast({
        title: "Checkout successful",
        description: "Order placed successfully!",
      })
      dispatch(clearCart())
      // Redirect to confirmation page with order data
      navigate("/order-confirmation", { state: { order: response } })
    } catch (err: any) {
      // Whatever the ERP objected to is the only useful thing to show; the
      // empty-cart case is the one message worth rewording for a shopper.
      const serverMessage = err?.response?.data?.message
      const message =
        serverMessage === "Cart items are required and must be a non-empty array."
          ? "Please add some products to your cart"
          : serverMessage || "We couldn't place your order. Please check your details and try again."
      setError(message)
      toast({ variant: "destructive", title: "Checkout failed", description: message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8 md:px-8">
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-[13px] text-ink-body transition-colors hover:text-brand-700"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to Cart
        </Link>

        <div className="mt-4 border-b border-surface-muted pb-4">
          <h1 className="text-[22px] font-semibold leading-tight text-ink-title sm:text-[26px]">Checkout</h1>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          <form
            onSubmit={handleSubmit}
            className="overflow-hidden rounded-lg border border-surface-muted bg-white"
          >
            <Section title="Personal Information">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label="Name" name="name" value={form.name} onChange={handleChange} required />
                <Field label="Company" name="company" value={form.company} onChange={handleChange} />
                <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
                <Field label="Phone" name="phone" type="tel" value={form.phone} onChange={handleChange} required />
              </div>
            </Section>

            <Section title="Billing Address">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <Field label="Line 1" name="billingLine1" value={form.billingLine1} onChange={handleChange} required />
                </div>
                <div className="md:col-span-2">
                  <Field label="Line 2" name="billingLine2" value={form.billingLine2} onChange={handleChange} />
                </div>
                <Field label="City" name="billingCity" value={form.billingCity} onChange={handleChange} required />
                <Field
                  label="Postal Code"
                  name="billingPostalCode"
                  value={form.billingPostalCode}
                  onChange={handleChange}
                />
                <Field label="State" name="billingState" value={form.billingState} onChange={handleChange} />
                <Field
                  label="Country"
                  name="billingCountry"
                  value={form.billingCountry}
                  onChange={handleChange}
                  required
                />
              </div>
            </Section>

            <Section
              title="Shipping Address"
              action={
                <label className="flex cursor-pointer items-center gap-2 text-[13px] text-ink-body">
                  <input
                    type="checkbox"
                    checked={sameAsBilling}
                    onChange={(e) => setSameAsBilling(e.target.checked)}
                    className="h-4 w-4 rounded border-surface-control accent-brand-700"
                  />
                  Same as Billing Address
                </label>
              }
            >
              {sameAsBilling ? (
                <p className="text-[13px] text-ink-body">
                  Your order will ship to the billing address above.
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <Field
                      label="Line 1"
                      name="shippingLine1"
                      value={form.shippingLine1}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Field label="Line 2" name="shippingLine2" value={form.shippingLine2} onChange={handleChange} />
                  </div>
                  <Field label="City" name="shippingCity" value={form.shippingCity} onChange={handleChange} required />
                  <Field
                    label="Postal Code"
                    name="shippingPostalCode"
                    value={form.shippingPostalCode}
                    onChange={handleChange}
                  />
                  <Field label="State" name="shippingState" value={form.shippingState} onChange={handleChange} />
                  <Field
                    label="Country"
                    name="shippingCountry"
                    value={form.shippingCountry}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}
            </Section>

            <Section title="Payment Method">
              <label className="flex cursor-pointer items-center gap-3 rounded border border-surface-muted px-3 py-2.5 transition-colors hover:bg-surface-subtle">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash-on-delivery"
                  checked={form.paymentMethod === "cash-on-delivery"}
                  onChange={handleChange}
                  className="h-4 w-4 accent-brand-700"
                />
                <span className="text-[13px] font-medium text-ink">Cash On Delivery</span>
              </label>

              <div className="mt-4">
                <label htmlFor="note" className="mb-1.5 block text-[13px] font-medium text-ink-title">
                  Order Note <span className="font-normal text-ink-body">(optional)</span>
                </label>
                <textarea
                  id="note"
                  name="note"
                  rows={3}
                  value={form.note}
                  onChange={handleChange}
                  className="w-full resize-y rounded border border-surface-control bg-white px-3 py-2 text-[13px] text-ink outline-none transition-colors focus:border-brand-700 focus:ring-1 focus:ring-brand-700"
                />
              </div>

              {error && (
                <p className="mt-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-[13px] text-red-700">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-5 flex h-[42px] w-full items-center justify-center rounded bg-brand-700 text-[14px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {loading ? "Placing Order..." : "Submit Order"}
              </button>
            </Section>
          </form>

          {/* Order Summary */}
          <div className="rounded-lg border border-surface-muted bg-white lg:sticky lg:top-4">
            <h2 className="border-b border-surface-muted px-5 py-3.5 text-[15px] font-semibold text-ink-title">
              Order Summary
            </h2>

            <div className="px-5 py-4">
              <dl className="space-y-3 text-[13px]">
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-ink-body">Subtotal</dt>
                  <dd className="font-medium text-ink">AED {formatPrice(orderSummary.totalWithoutTax)}</dd>
                </div>
                {orderSummary.savings > 0 && (
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-success-deep">You Save</dt>
                    <dd className="font-medium text-success-deep">AED {formatPrice(orderSummary.savings)}</dd>
                  </div>
                )}
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-ink-body">Product Tax (5%)</dt>
                  <dd className="font-medium text-ink">AED {formatPrice(orderSummary.productTax)}</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-ink-body">Delivery</dt>
                  <dd className="font-medium text-success-deep">Free</dd>
                </div>
              </dl>

              <hr className="my-4 border-surface-muted" />

              <div className="flex items-baseline justify-between gap-4">
                <span className="text-[14px] font-semibold text-ink-title">Grand Total</span>
                <span className="flex items-baseline gap-1.5">
                  <span className="text-[12px] text-ink">AED</span>
                  <span className="text-[20px] font-bold text-brand-700">
                    {formatPrice(orderSummary.grandTotal)}
                  </span>
                </span>
              </div>
              <p className="mt-1 text-right text-[12px] text-ink-body">Inclusive of VAT</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
