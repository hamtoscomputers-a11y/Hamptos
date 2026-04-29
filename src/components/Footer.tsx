"use client"
import { Link, useNavigate } from "react-router-dom"
import { useCategories } from "../api/hooks/useCategories"
import { useProducts } from "@/api/hooks/useProducts"
import fb from "../assets/fb.svg"
import twitter from "../assets/x.svg"
import mainLogo from "../assets/mainLogo.png"
import { ChevronDown, Menu, Instagram } from "lucide-react"
import { useState } from "react"
import { createSlug } from "@/lib/utils"

const Footer = () => {
  const navigate = useNavigate()
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)

  // Fetch categories
  const { data: categoriesData } = useCategories({ limit: 100 })
  const categories = categoriesData?.data || []


  // Fetch products for 'Our Products' section
  const { data: productsData } = useProducts({ limit: 6, include: "brand,category,photos" })
  const products = productsData?.data || []

  const socialLinks = [
    { icon: fb, name: "Facebook", alt: "facebook", url: "https://www.facebook.com/hamtoscomputers/", isSvg: true },
    { icon: "instagram", name: "Instagram", alt: "instagram", url: "https://www.instagram.com/hamtoscomputers/", isSvg: false },
    { icon: "pinterest", name: "Pinterest", alt: "pinterest", url: "https://www.pinterest.com/hamtoscomputers/", isSvg: false },
    { icon: twitter, name: "X (Twitter)", alt: "twitter", url: "https://x.com/HamtosComputers", isSvg: true },
    { icon: "tiktok", name: "TikTok", alt: "tiktok", url: "https://www.tiktok.com/@hamtoscomputers33", isSvg: false },
  ]

  const itServices = [
    "Managed Security Services",
    "WIFI as a services",
    "Cloud Hosted PBX on rent",
    "IP/PBX as a services",
    "Asterisk Configuration Services",
    "Advanced IT AMC Services in Dubai",
    "Best Email or Spam Protection in Dubai",
    "Networking Support Services",
  ]

  return (
    <footer>
      {/* Top Section with Logo and Navigation */}
      <div className="bg-white px-4 sm:px-6 md:px-8 lg:px-16">
        <div className="py-6 sm:py-8 border-b border-[#989494] border-dashed">
          {/* Logo */}
          <div className="flex justify-center mb-6 sm:mb-8 border-b border-[#989494] border-dashed pb-4">
            <img src={mainLogo || "/placeholder.svg"} alt="Hamtos Logo" className="h-8 sm:h-10 md:h-12 w-auto" />
          </div>

          {/* Navigation Menu */}
          <div className="mb-6 sm:mb-8 border-b border-[#989494] border-dashed pb-4">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex flex-wrap justify-center items-center gap-4 lg:gap-8 text-gray-600">
              <button
                className="flex items-center space-x-1 hover:text-blue-600 transition-colors duration-200 px-2 py-1 rounded"
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
              >
                <Menu size={18} />
                <span className="text-sm lg:text-base">All Categories</span>
              </button>
              {categories?.map((cat: any) => (
                <button
                  key={cat.id}
                  className="hover:text-blue-600 bg-transparent border-none outline-none cursor-pointer transition-colors duration-200 px-2 py-1 rounded text-sm lg:text-base"
                  onClick={() => navigate(`/products?category=${cat.id}`)}
                >
                  {cat.name}
                </button>
              ))}
            </nav>

            {/* Mobile Navigation */}
            <div className="md:hidden">
              <button
                className="flex items-center justify-center space-x-2 w-full py-3 px-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 text-gray-600"
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
              >
                <Menu size={18} />
                <span>All Categories</span>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${isCategoriesOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Mobile Categories Dropdown */}
              {isCategoriesOpen && (
                <div className="mt-3 space-y-2">
                  {categories?.map((cat: any) => (
                    <button
                      key={cat.id}
                      className="block w-full text-left py-2 px-4 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded transition-colors duration-200"
                      onClick={() => {
                        navigate(`/products?category=${cat.id}`)
                        setIsCategoriesOpen(false)
                      }}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Social Media Icons */}
          <div className="pb-4">
            {/* Desktop Social Links */}
            <div className="hidden sm:flex justify-center flex-wrap gap-4 md:gap-6 lg:gap-8">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-[#4F697D] hover:text-blue-600 transition-colors duration-200 px-2 py-1 rounded"
                >
                  {social.isSvg ? (
                  <img src={social.icon || "/placeholder.svg"} alt={social.alt} className="w-4 h-4" />
                  ) : social.icon === "instagram" ? (
                    <Instagram className="w-4 h-4" />
                  ) : social.icon === "pinterest" ? (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.237 2.636 7.855 6.356 9.312-.088-.791-.167-2.005.035-2.868.181-.78 1.172-4.97 1.172-4.97s-.299-.599-.299-1.484c0-1.388.805-2.425 1.809-2.425.853 0 1.264.64 1.264 1.408 0 .858-.546 2.14-.828 3.33-.236.995.5 1.807 1.481 1.807 1.778 0 3.144-1.874 3.144-4.58 0-2.393-1.72-4.068-4.177-4.068-2.845 0-4.515 2.135-4.515 4.34 0 .859.331 1.781.745 2.281a.3.3 0 0 1 .069.288l-.278 1.133c-.044.183-.145.223-.334.135-1.249-.581-2.03-2.407-2.03-3.874 0-3.154 2.292-6.052 6.608-6.052 3.469 0 6.165 2.473 6.165 5.776 0 3.447-2.173 6.22-5.19 6.22-1.013 0-1.965-.527-2.292-1.155l-.623 2.378c-.226.869-.835 1.958-1.244 2.621.937.29 1.931.446 2.962.446 5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
                    </svg>
                  ) : social.icon === "tiktok" ? (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                    </svg>
                  ) : null}
                  <span className="text-sm font-normal">{social.name}</span>
                </a>
              ))}
            </div>

            {/* Mobile Social Links - Icons Only */}
            <div className="sm:hidden flex justify-center space-x-6">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-[#4F697D] hover:text-blue-600 transition-colors duration-200 rounded-full hover:bg-gray-100"
                  aria-label={social.name}
                >
                  {social.isSvg ? (
                  <img src={social.icon || "/placeholder.svg"} alt={social.alt} className="w-5 h-5" />
                  ) : social.icon === "instagram" ? (
                    <Instagram className="w-5 h-5" />
                  ) : social.icon === "pinterest" ? (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.237 2.636 7.855 6.356 9.312-.088-.791-.167-2.005.035-2.868.181-.78 1.172-4.97 1.172-4.97s-.299-.599-.299-1.484c0-1.388.805-2.425 1.809-2.425.853 0 1.264.64 1.264 1.408 0 .858-.546 2.14-.828 3.33-.236.995.5 1.807 1.481 1.807 1.778 0 3.144-1.874 3.144-4.58 0-2.393-1.72-4.068-4.177-4.068-2.845 0-4.515 2.135-4.515 4.34 0 .859.331 1.781.745 2.281a.3.3 0 0 1 .069.288l-.278 1.133c-.044.183-.145.223-.334.135-1.249-.581-2.03-2.407-2.03-3.874 0-3.154 2.292-6.052 6.608-6.052 3.469 0 6.165 2.473 6.165 5.776 0 3.447-2.173 6.22-5.19 6.22-1.013 0-1.965-.527-2.292-1.155l-.623 2.378c-.226.869-.835 1.958-1.244 2.621.937.29 1.931.446 2.962.446 5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
                    </svg>
                  ) : social.icon === "tiktok" ? (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                    </svg>
                  ) : null}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-8 sm:py-10 md:py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2  gap-8 md:gap-10 lg:gap-12">
            {/* Contact Address */}
            <div className="text-center md:text-left">
              <h4 className="font-bold text-lg sm:text-xl mb-4 sm:mb-6 text-[#1A74BB]">Contact Address</h4>
              <div className="space-y-1 sm:space-y-2 text-[#102D43] text-sm sm:text-base">
                <p className="font-semibold">Hamtos, E-Store</p>
                <p>SHOP NO-14 GATEWAY HOTEL BUILDING,</p>
                <p>BURDUBAI, DUBAI, UAE</p>
                <p>LAND LINE-042528481</p>
                <p>Tel: +97142528481</p>
                <p>Email: info@hamtos.com</p>
              </div>
            </div>

            {/* Our Products */}
            <div className="text-center md:text-left">
              <h4 className="font-bold text-lg sm:text-xl mb-4 sm:mb-6 text-[#1A74BB]">Our Products</h4>
              <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-1 lg:grid-cols-2 sm:gap-x-4 lg:gap-x-8">
                {/* First Column */}
                <ul className="space-y-1 sm:space-y-2 text-[#102D43] text-sm">
                  {products.slice(0, 3).map((product: any) => (
                    <li key={product.id}>
                      <Link
                        to={`/product/${createSlug(product.name)}`}
                        state={{ productId: product.id }}
                        className="hover:text-blue-600 transition-colors duration-200 inline-block"
                      >
                        • {product.name}
                      </Link>
                    </li>
                  ))}
                </ul>
                {/* Second Column */}
                <ul className="space-y-1 sm:space-y-2 text-[#102D43] text-sm">
                  {products.slice(3, 6).map((product: any) => (
                    <li key={product.id}>
                      <Link
                        to={`/product/${createSlug(product.name)}`}
                        state={{ productId: product.id }}
                        className="hover:text-blue-600 transition-colors duration-200 inline-block"
                      >
                        • {product.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* IT Services */}
            {/* <div className="text-center md:text-left md:col-span-2 lg:col-span-1">
              <h4 className="font-bold text-lg sm:text-xl mb-4 sm:mb-6 text-[#1A74BB]">IT Services</h4>
              <ul className="space-y-1 sm:space-y-2 text-[#102D43] text-sm">
                {itServices.map((service, index) => (
                  <li key={index} className="leading-relaxed">
                    • {service}
                  </li>
                ))}
              </ul>
            </div> */}
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="py-4 sm:py-6 bg-[#E1E1E1] border-t border-gray-200 px-4 sm:px-6 md:px-8 lg:px-16">
        <div className="container mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center text-xs sm:text-sm text-gray-600 space-y-3 sm:space-y-0">
            <div className="text-center sm:text-left">Copyright ©2022 Hamtos. All Rights Reserved.</div>
            <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4">
              <Link to="/privacy-policy" className="hover:text-blue-600 transition-colors duration-200 px-1">
                Privacy Policy
              </Link>
              <span className="text-gray-400">|</span>
              <Link to="/terms-and-conditions" className="hover:text-blue-600 transition-colors duration-200 px-1">
                Terms and Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
