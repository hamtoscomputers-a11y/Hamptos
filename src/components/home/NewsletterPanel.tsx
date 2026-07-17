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
    <section aria-label={TITLE} className="w-full px-4 sm:px-6 lg:px-16">
      <div className="rounded-t-[2.5rem] bg-brand-800 px-6 py-10 sm:px-10 md:px-14 lg:py-14">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left: copy */}
          <div className="text-white">
            <h2 className="text-3xl font-bold leading-tight md:text-4xl">{TITLE}</h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/80">{SUBTITLE}</p>
          </div>

          {/* Right: capture form */}
          <div className="text-white">
            <p className="mb-3 text-sm font-medium">Stay up to date</p>

            <form onSubmit={handleSubscribe} className="flex flex-col gap-3 sm:flex-row">
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
                className="w-full flex-1 rounded-full border-0 bg-white/30 px-5 py-3 text-sm text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-white/60"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="whitespace-nowrap rounded-full bg-brand-400 px-8 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {status === "loading" ? "Subscribing..." : "Subscribe"}
              </button>
            </form>

            <p className="mt-3 text-xs text-white/80" role={status === "error" ? "alert" : undefined}>
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
