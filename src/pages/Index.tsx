"use client"

import { useEffect, useMemo, useState, useRef } from "react"
import PromotionalSlider from "@/components/PromotionalSlider" // Assuming PromotionalSlider is responsive
import BestSelling from "@/components/BestSelling" // Assuming BestSelling is responsive
import { useProducts } from "../api/hooks/useProducts"
import { useCategories } from "../api/hooks/useCategories"
import { useNavigate, Link } from "react-router-dom"
import TopCategories from "@/components/TopCategories" // Assuming TopCategories is responsive
import FeaturedProductsSection from "@/components/FeaturedProductsSection" // Assuming FeaturedProductsSection is responsive
import TelephoneCategorySection from "@/components/TelephoneCategorySection" // Assuming TelephoneCategorySection is responsive
import SwitchesCategorySection from "@/components/SwitchesCategorySection" // Assuming SwitchesCategorySection is responsive
import BrandsWeCarrySection from "@/components/BrandsWeCarrySection" // Assuming BrandsWeCarrySection is responsive
import NewsletterSection from "@/components/NewsletterSection" // Assuming NewsletterSection is responsive
import LatestProductsSection from "@/components/LatestProductsSection" // Assuming LatestProductsSection is responsive

import guarantee from "../assets/gurantee.png"
import help from "../assets/help.png"
import delivery from "../assets/delivery.png"
import support from "../assets/chatmessage.png"
import { ProductService } from "@/api"

const Index = () => {
  const productParams = useMemo(
    () => ({
      limit: 10,
      start: 1,
      include: "brand,category,photos",
    }),
    [],
  )

  // Fetch categories for the categories section
  const categoryParams = useMemo(
    () => ({
      limit: 100,
      start: 1,
      include_products: true,
    }),
    [],
  )

  const { data: categoriesData, isLoading: categoriesLoading, error: categoriesError } = useCategories(categoryParams)
  const { data, isLoading, error } = useProducts(productParams)
  const products = data?.data || []

  // Map categories to the expected format
  const categories = useMemo(() => {
    if (!categoriesData?.data) return []
    return categoriesData?.data.map((category: any) => ({
      id: category.id,
      name: category.name,
      icon: "📦", // Default icon since API doesn't provide icons
      showinhome: category.showinhome,
      children: category.children || [],
      image:
        category.image_url ||
        category.image ||
        "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=100&h=100&fit=crop",
    }))
  }, [categoriesData])

  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)
  const [popupPosition, setPopupPosition] = useState<{ top: number; left: number } | null>(null)
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const telephoneCategory = categories?.find((category) => category.name === "Telephone")
  const switchesCategory = categories?.find((category) => category.name === "SWITCHES")

  const navigate = useNavigate()

  // Service features data
  const serviceFeatures = [
    {
      title: "Guarantee Products",
      description: "Top branded Products",
      iconType: "image",
      icon: guarantee, // imported image
    },
    {
      title: "NEED HELP?",
      description: "Call us for any Enquiry",
      iconType: "image",
      icon: help,
      highlight: "+97142528481",
    },
    {
      title: "Product Delivery",
      description: "Quick and Fast Delivery",
      iconType: "image",
      icon: delivery,
    },
    {
      title: "Best Support",
      description: "Best Customer Support",
      iconType: "image",
      icon: support,
    },
  ]

  const [slides, setSlides] = useState<any[]>([])
  useEffect(() => {
    ProductService.getWebsiteSlider().then((data) => {
      setSlides(data?.data || [])
    })
  }, [])

  const homeCategories = categories.filter((category) => category.showinhome == 1)

  return (
    <div className="min-h-screen">
      {/* Service Information Section */}
      <div className="bg-[#E7F4FD] border-t border-gray-200 py-6 sm:py-8">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {serviceFeatures.map((feature, idx) => (
              <div key={idx} className="flex items-center space-x-3 text-center sm:text-left">
                <img
                  src={feature.icon || "/placeholder.svg?height=48&width=48"}
                  alt={feature.title}
                
                />
                <div>
                  <h3 className="font-semibold text-gray-800 text-base sm:text-lg">
                    {feature.title}{" "}
                    {feature.highlight && (
                      <a
                        href="tel:+97142528481"
                        className="text-[#1a73e8] hover:underline ml-1 whitespace-nowrap"
                        style={{ cursor: "pointer" }}
                      >
                        {feature.highlight}
                      </a>
                    )}
                  </h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Promotional Slider */}
      <div className="mb-8">
        <PromotionalSlider slides={slides} />
      </div>

      <div className="w-full">
        {/* Categories Icons - Circular */}
        <section className="py-8 px-4 sm:px-6 md:px-8 lg:px-16">
          <div className="container mx-auto">
            <div className="overflow-x-auto custom-scrollbar pb-2">
              <div className="flex gap-4 sm:gap-6 min-w-max">
              {categoriesLoading
                ? // Loading state
                    Array.from({ length: 10 }).map((_, index) => (
                      <div key={index} className="text-center flex-shrink-0">
                      <div className="bg-white rounded-full p-3 shadow-sm border w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 mx-auto flex items-center justify-center animate-pulse">
                        <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-30 md:h-30 bg-gray-200 rounded-full"></div>
                      </div>
                        <div className="h-4 bg-gray-200 rounded mt-2 w-24 mx-auto animate-pulse"></div>
                    </div>
                  ))
                : categoriesError
                  ? // Error state - fallback to static data
                    [
                      {
                        name: "IP Phones",
                        icon: "📞",
                        image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=100&h=100&fit=crop",
                      },
                      {
                        name: "Networking",
                        icon: "🌐",
                        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=100&h=100&fit=crop",
                      },
                      {
                        name: "Laptops",
                        icon: "💻",
                        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=100&h=100&fit=crop",
                      },
                      {
                        name: "Smart Panels",
                        icon: "📱",
                        image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=100&h=100&fit=crop",
                      },
                      {
                        name: "POS Devices",
                        icon: "🖥️",
                        image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=100&h=100&fit=crop",
                      },
                      {
                        name: "More",
                        icon: "⋯",
                        image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=100&h=100&fit=crop",
                      },
                    ].map((category, index) => (
                        <div key={index} className="text-center flex-shrink-0">
                        <div className="bg-white rounded-full p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer border w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 mx-auto flex items-center justify-center">
                          <img
                            src={category.image || "/placeholder.svg?height=100&width=100"}
                            alt={category.name}
                            className="w-24 h-24 sm:w-28 sm:h-28 md:w-30 md:h-30 object-cover rounded-full"
                          />
                        </div>
                          <p className="text-sm font-medium text-gray-700 mt-2 max-w-[140px] mx-auto">{category.name}</p>
                      </div>
                    ))
                    : // Success state - render ALL API categories
                    categories.map((category, index) => (
                      <div
                          key={category.id || index}
                          ref={(el) => {
                            if (category.id) categoryRefs.current[category.id] = el
                          }}
                          data-category-id={category.id}
                          className="text-center cursor-pointer flex-shrink-0 relative"
                        onClick={() => navigate(`/products?category=${category.id}`)}
                          onMouseEnter={(e) => {
                            if (category.children && category.children.length > 0) {
                              const rect = e.currentTarget.getBoundingClientRect()
                              setPopupPosition({
                                top: rect.top - 10,
                                left: rect.left + rect.width / 2
                              })
                              setHoveredCategory(category.id)
                            }
                          }}
                          onMouseLeave={() => {
                            // Clear any existing timeout
                            if (hoverTimeoutRef.current) {
                              clearTimeout(hoverTimeoutRef.current)
                            }
                            // Delay to allow mouse to move to popup
                            hoverTimeoutRef.current = setTimeout(() => {
                              const popup = document.querySelector('.subcategory-popup')
                              if (!popup || !popup.matches(':hover')) {
                                setHoveredCategory(null)
                                setPopupPosition(null)
                              }
                            }, 300)
                          }}
                      >
                        <div className="bg-white rounded-full p-3 shadow-sm hover:shadow-md transition-shadow border w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 mx-auto flex items-center justify-center">
                          <img
                            src={category.image || "/placeholder.svg?height=100&width=100"}
                            alt={category.name}
                            className="w-24 h-24 sm:w-28 sm:h-28 md:w-30 md:h-30 object-cover rounded-full"
                          />
                        </div>
                          <p className="text-sm font-medium text-gray-700 mt-2 max-w-[140px] mx-auto line-clamp-2">{category.name}</p>
                      </div>
                    ))}
              </div>
            </div>
          </div>
          
          {/* Subcategories Popup - Fixed positioning outside overflow container */}
          {hoveredCategory && popupPosition && (() => {
            const category = categories.find((cat: any) => cat.id === hoveredCategory)
            if (!category || !category.children || category.children.length === 0) return null
            
            return (
              <div 
                className="subcategory-popup fixed bg-white rounded-lg shadow-2xl border border-gray-200 min-w-[220px] max-w-[280px] py-2 z-[99999] before:content-[''] before:absolute before:-bottom-2 before:left-1/2 before:-translate-x-1/2 before:border-8 before:border-transparent before:border-t-gray-200"
                style={{
                  top: `${popupPosition.top}px`,
                  left: `${popupPosition.left}px`,
                  transform: 'translate(-50%, -100%)',
                }}
                onMouseEnter={() => {
                  // Clear timeout when entering popup
                  if (hoverTimeoutRef.current) {
                    clearTimeout(hoverTimeoutRef.current)
                    hoverTimeoutRef.current = null
                  }
                  // Keep popup visible when hovering over it
                  const element = categoryRefs.current[hoveredCategory]
                  if (element) {
                    const rect = element.getBoundingClientRect()
                    setPopupPosition({
                      top: rect.top - 10,
                      left: rect.left + rect.width / 2
                    })
                  }
                }}
                onMouseLeave={() => {
                  // Clear timeout
                  if (hoverTimeoutRef.current) {
                    clearTimeout(hoverTimeoutRef.current)
                  }
                  // Delay to allow smooth transition
                  hoverTimeoutRef.current = setTimeout(() => {
                    setHoveredCategory(null)
                    setPopupPosition(null)
                  }, 300)
                }}
              >
                <div className="px-3 py-2 border-b border-gray-100 bg-gray-50 rounded-t-lg">
                  <p className="text-xs font-semibold text-[#042B43] uppercase tracking-wide">Subcategories</p>
                </div>
                <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                  {category.children.map((child: any) => (
                    <Link
                      key={child.id}
                      to={`/products?category=${category.id}&subcategory=${child.id}`}
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-[#042B43] hover:text-white transition-colors duration-200 first:mt-1"
                      onClick={() => {
                        setHoveredCategory(null)
                        setPopupPosition(null)
                      }}
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              </div>
            )
          })()}
        </section>

        {/* Brands Slider */}
        {/* <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-16">
          <BrandsSlider />
        </div> */}

        {/* Today Deals Section */}
        {homeCategories[0]?.showinhome == 1 && (
          <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-16 mb-8">
            <div className="bg-white rounded-lg p-4 sm:p-6">
              <TelephoneCategorySection homeCategories={homeCategories} />
            </div>
          </div>
        )}

        {/* Gaming Banner Section */}
        <div className=" w-full mb-8 ">
          <img
            src={slides?.[3]?.image || "/placeholder.svg?height=200&width=1200"}
            alt="Gaming Banner"
            className="w-full h-auto object-cover rounded-lg"
          />
        </div>

        {/* Featured Products Section */}
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-16 mb-8">
          <div className="rounded-lg p-4 sm:p-6" style={{ backgroundColor: "#f5f5f5" }}>
            <FeaturedProductsSection />
          </div>
        </div>

        {/* Sale Banner */}
        {/* Best Selling Products */}
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-16 mb-8">
          <div className="rounded-lg p-4 sm:p-6" style={{ backgroundColor: "#e7f1fb" }}>
            <BestSelling />
          </div>
        </div>

        <div className="w-full mb-6">
          <img
            src={slides?.[4]?.image || "/placeholder.svg?height=200&width=1200"}
            alt="Promotional Banner"
            className="w-full h-auto object-cover rounded-lg"
          />
        </div>

        {/* Networking Products & Servers */}
        {homeCategories[1]?.showinhome == 1 && (
          <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-16 mb-8">
            <div className="bg-white rounded-lg p-4 sm:p-6">
              <SwitchesCategorySection homeCategories={homeCategories} />
            </div>
          </div>
        )}

        {/* Top Categories Section */}
        <div className="mb-8">
          <TopCategories categories={categories} />
        </div>

        {/* Latest Products Section */}
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-16 mb-8">
          <div className="bg-white rounded-lg p-4 sm:p-6">
            <LatestProductsSection />
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="mb-8">
        <NewsletterSection />
      </div>

      <div className="mb-8">
        <div className="rounded-lg">
          {/* Brand We Carry Section */}
          <BrandsWeCarrySection />
        </div>
      </div>
    </div>
  )
}

export default Index
