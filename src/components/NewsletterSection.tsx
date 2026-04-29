"use client"

import type React from "react"
import { useState } from "react"
import { sendContactQuote } from "@/api/services/websiteService"

const NewsletterSection = () => {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccess("")
    setError("")

    try {
      // Extract first and last name from email
      const emailPrefix = email.split("@")[0]
      const nameParts = emailPrefix.split(/[._-]+/) // split on dot, underscore, or dash
      const first_name = nameParts[0] ? nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1) : ""
      const last_name = nameParts[0] ? nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1) : ""

      await sendContactQuote({
        first_name,
        last_name,
        email,
        description: "This is for newsletter subscription.",
      })

      setSuccess("Thank you for subscribing to our newsletter!")
      setEmail("")
    } catch (err: any) {
      setError("Subscription failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-16">
      <div className="p-6 sm:p-8 md:p-10 lg:p-12 my-6 sm:my-8 md:my-10 lg:my-12 bg-[#0A5D9E] rounded-t-3xl">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
            {/* Left Side - Newsletter Content */}
            <div className="text-white text-center lg:text-left">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl font-bold mb-3 sm:mb-4 leading-tight">
                Subscribe our newsletter
              </h2>
              <p className="text-sm sm:text-base md:text-lg lg:text-lg opacity-90 mb-4 sm:mb-6 leading-relaxed max-w-lg mx-auto lg:mx-0">
                Subscribe to our newsletter and be the first to receive insights, updates, and expert tips on optimizing
                your financial management.
              </p>
            </div>

            {/* Right Side - Form */}
            <div className="text-white">
              {/* Stay up to date text */}
              <div className="text-center lg:text-right mb-3 sm:mb-4">
                <p className="text-base sm:text-lg font-medium">Stay up to date</p>
              </div>

              {/* Form - Stack on mobile, inline on larger screens */}
              <form
                className="space-y-3 sm:space-y-0 sm:flex sm:gap-3 md:gap-4 mb-3 sm:mb-4"
                onSubmit={handleSubscribe}
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full sm:flex-1 px-4 sm:px-5 md:px-6 py-3 sm:py-3.5 md:py-4 rounded-full text-black placeholder-gray-500 border-0 focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm sm:text-base transition-all duration-200"
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.9)" }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 sm:px-7 md:px-8 py-3 sm:py-3.5 md:py-4 rounded-full font-semibold hover:opacity-90 transition-all duration-200 text-sm sm:text-base whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: "#0066cc", color: "white" }}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span className="hidden sm:inline">Subscribing...</span>
                      <span className="sm:hidden">Loading...</span>
                    </span>
                  ) : (
                    "Subscribe"
                  )}
                </button>
              </form>

              {/* Success/Error Messages */}
              <div className="min-h-[1.5rem] mb-2">
                {success && (
                  <div className="flex items-center justify-center sm:justify-start lg:justify-end gap-2 text-green-200 text-xs sm:text-sm">
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{success}</span>
                  </div>
                )}
                {error && (
                  <div className="flex items-center justify-center sm:justify-start lg:justify-end gap-2 text-red-200 text-xs sm:text-sm">
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{error}</span>
                  </div>
                )}
              </div>

              {/* Privacy Policy Text - Uncommented and made responsive */}
              {/* <div className="text-center lg:text-right">
                <p className="text-xs sm:text-sm opacity-80 leading-relaxed">
                  By subscribing you agree to our{" "}
                  <button
                    type="button"
                    className="underline hover:no-underline transition-all duration-200 cursor-pointer focus:outline-none focus:ring-1 focus:ring-white focus:ring-opacity-50 rounded"
                    onClick={() => {
                      // Add your privacy policy navigation logic here
                    }}
                  >
                    Privacy Policy
                  </button>
                </p>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewsletterSection
