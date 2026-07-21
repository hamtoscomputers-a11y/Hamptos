"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { sendContactQuote } from "@/api/services/websiteService"

const TITLE = "Subscribe our newsletter"
const SUBTITLE =
  "Subscribe to our newsletter and be the first to receive insights, updates, and expert tips on optimizing your financial management."

/**
 * Newsletter capture panel.
 *
 * There is no newsletter endpoint on the ERP, so a subscription is posted
 * through the website contact form with a marker description — matching the
 * behaviour this section already had.
 */
const NewsletterPanel = () => {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const handleSubscribe = async (event: React.FormEvent) => {
    event.preventDefault()
    setStatus("loading")

    // The contact endpoint requires a name; derive a best-effort one from the
    // address since the form only collects an email.
    const prefix = email.split("@")[0] ?? ""
    const [first = ""] = prefix.split(/[._-]+/)
    const name = first ? first.charAt(0).toUpperCase() + first.slice(1) : "Subscriber"

    try {
      await sendContactQuote({
        first_name: name,
        last_name: name,
        email,
        description: "This is for newsletter subscription.",
      })
      setStatus("success")
      setEmail("")
    } catch {
      setStatus("error")
    }
  }

  return (
    // Full-bleed panel with container-aligned content, rounded across the top
    // only — it closes the page against the footer.
    <section aria-label={TITLE} className="w-full">
      {/* 300 tall in the Figma, on a `#0A5D9E` fill. */}
      <div className="rounded-t-[2.5rem] bg-brand-850 py-10 lg:h-[300px] lg:py-0">
        <div className="container mx-auto grid h-full grid-cols-1 items-center gap-8 px-4 lg:grid-cols-2 lg:gap-12">
          {/* Left: copy */}
          <div className="text-surface-paper">
            {/* Held narrow so it breaks after "our", as the Figma sets it —
                the column is wide enough to fit the line otherwise. */}
            <h2 className="max-w-[300px] text-3xl font-bold leading-tight md:text-4xl">{TITLE}</h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed">{SUBTITLE}</p>
          </div>

          {/* Right: capture form */}
          <div className="text-surface-paper">
            <p className="mb-3 text-sm font-medium">Stay up to date</p>

            <form onSubmit={handleSubscribe} className="flex flex-col gap-[15px] sm:flex-row">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your email"
                /* The Figma's two white alphas: the pill is white at 32%, the
                   placeholder inside it white at 40%. */
                className="h-[59px] w-full flex-1 rounded-full border-0 bg-white/[0.32] px-6 text-sm text-surface-paper placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/60"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="h-[59px] whitespace-nowrap rounded-full bg-brand-450 px-8 text-sm font-semibold text-surface-paper transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {status === "loading" ? "Subscribing..." : "Subscribe"}
              </button>
            </form>

            <p className="mt-3 text-xs" role={status === "error" ? "alert" : undefined}>
              {status === "success" ? (
                "Thank you for subscribing to our newsletter!"
              ) : status === "error" ? (
                "Subscription failed. Please try again."
              ) : (
                <>
                  By subscribing you agree to our{" "}
                  <Link to="/privacy-policy" className="underline hover:no-underline">
                    Privacy Policy
                  </Link>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default NewsletterPanel
