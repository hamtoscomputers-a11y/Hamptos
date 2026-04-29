"use client"

import type React from "react"
import { useState, useMemo, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { ShoppingCart, Phone, Mail, ChevronDown, ChevronRight, Grid3X3, Package, Menu, X, Search } from "lucide-react"
import { Link } from "react-router-dom"
import { useCategories } from "../api/hooks/useCategories"
import mainLogo from "../assets/mainLogo.png"
import searchIcon from "../assets/search.png"
import quoteIcon from "../assets/quott.png"
import { useSelector } from "react-redux"
import type { RootState } from "../store"
import { useProducts } from "@/api/hooks/useProducts"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const cart = useSelector((state: RootState) => state.cart.items)
  const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 0), 0)

  // Clear search query when route changes (unless we're on products page with search param)
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const searchParam = params.get("search")
    
    // If we're not on products page, or on products page without search param, clear the search input
    if (location.pathname !== "/products" || !searchParam) {
      setSearchQuery("")
      setIsSearchOpen(false)
    } else {
      // If we're on products page with search param, sync the input with the URL
      setSearchQuery(searchParam)
    }
  }, [location.pathname, location.search])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setIsSearchOpen(false)
    }
  }

  const categoryParams = useMemo(() => ({ include_products: true, limit: 20 }), [])
  const { data, isLoading, error } = useCategories(categoryParams)
  const categories = data?.data || []

  const mainNavCategories = categories.filter((cat: any) =>
    ["ROUTERS", "Telephone", "WIRELESS BRIDGE"].includes(cat.name),
  )

  const { refetch: refetchProductsByCategory } = useProducts()

  const handleCategoryClick = (catId: string) => {
    setActiveCategory(catId)
    navigate(`/products?category=${catId}`)
    setIsMobileMenuOpen(false)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
    setIsMenuOpen(false)
  }

  return (
    <>
      <header className="bg-white shadow-sm relative">
        {/* Top Navigation Bar - Hidden on mobile */}
        <div className="hidden md:block bg-white border-b border-gray-200 text-gray-700 text-sm py-2">
          <div className="container mx-auto px-4 py-1 flex justify-end items-center">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Phone size={14} className="text-blue-800" />
                <span className="hidden lg:inline">+97142528481</span>
                <span className="lg:hidden">Call Us</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail size={14} className="text-blue-800" />
                <span className="hidden lg:inline">info@hamtos.com</span>
                <span className="lg:hidden">Email</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main header */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center flex-shrink-0">
              <img src={mainLogo || "/placeholder.svg"} alt="Logo" className="h-8 md:h-10 w-auto" />
            </Link>

            {/* Desktop Search Bar */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-4 lg:mx-8">
              <form onSubmit={handleSearchSubmit} className="w-full">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleInputChange}
                    placeholder="Search for products..."
                    className="w-full px-4 py-3 border border-gray-200 bg-[#F3F3F3] rounded-lg focus:outline-none focus:border-blue-500 text-xs font-medium text-black"
                  />
                  <button type="submit" className="absolute right-2 top-3">
                    <img src={searchIcon || "/placeholder.svg"} alt="Search" className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-2 md:space-x-4">
              {/* Mobile Search Toggle */}
              <button
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                <Search size={20} className="text-gray-700" />
              </button>

              {/* Cart */}
              <Link to="/cart" className="p-2 md:p-3 hover:bg-gray-100 rounded-lg relative">
                <ShoppingCart size={24} className="text-gray-700" />
                <span
                  className="absolute -top-1 -right-1 text-white text-xs rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center font-bold"
                  style={{ backgroundColor: "#004a87" }}
                >
                  {cartCount}
                </span>
              </Link>

              {/* Get Quote Button - Hidden on small mobile */}
              <button
                className="hidden sm:flex text-white px-3 md:px-6 py-2 md:py-3 font-sm items-center gap-2 rounded-full hover:opacity-90 font-bold text-sm md:text-lg bg-[#1A74BB]"
                onClick={() => navigate("/get-quote")}
              >
                <img src={quoteIcon || "/placeholder.svg"} alt="Quote" className="w-4 h-4" />
                <span className="hidden md:inline text-sm">GET A QUOTE</span>
                <span className="md:hidden text-xs">QUOTE</span>
              </button>

              {/* Mobile Menu Toggle */}
              <button
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X size={24} className="text-gray-700" />
                ) : (
                  <Menu size={24} className="text-gray-700" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          {isSearchOpen && (
            <div className="md:hidden mt-4 pb-4 border-b border-gray-200">
              <form onSubmit={handleSearchSubmit}>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleInputChange}
                    placeholder="Search for products..."
                    className="w-full px-4 py-3 border border-gray-200 bg-[#F3F3F3] rounded-lg focus:outline-none focus:border-blue-500 text-sm font-medium text-black"
                  />
                  <button type="submit" className="absolute right-2 top-3">
                    <img src={searchIcon || "/placeholder.svg"} alt="Search" className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:block text-white relative bg-[#042B43] shadow-lg border-b border-[#0A3A5C]">
          <div className="container mx-auto px-4">
            <div className="flex items-center">
              {/* All Categories Mega Menu */}
              <div className="relative">
                <button
                  className="flex items-center space-x-2 px-4 lg:px-6 py-4 font-semibold hover:bg-[#0A3A5C] transition-all duration-200 rounded-sm border-r border-[#0A3A5C] group"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <Grid3X3 size={20} className="group-hover:rotate-180 transition-transform duration-300" />
                  <span className="hidden lg:inline">All Categories</span>
                  <span className="lg:hidden">Categories</span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${isMenuOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Mega Menu Dropdown */}
                {isMenuOpen && (
                  <div className="absolute top-full left-0 bg-white shadow-2xl z-[100] border border-gray-200 rounded-lg overflow-hidden w-[400px] mt-1">
                    {isLoading && (
                      <div className="p-6 text-center">
                        <div className="inline-flex items-center space-x-2 text-gray-500">
                          <div className="w-5 h-5 bg-gray-300 rounded-full animate-bounce"></div>
                          <span className="text-sm">Loading categories...</span>
                        </div>
                      </div>
                    )}
                    {error && <div className="p-6 text-center text-red-500 bg-red-50 text-sm">Failed to load categories</div>}
                    {!isLoading && !error && (
                      <div className="max-h-[70vh] overflow-y-auto custom-scrollbar">
                        {categories?.map((category: any) => (
                          <div key={category.id} className="border-b border-gray-100 last:border-b-0">
                            {/* Category Header - Clickable */}
                            <div
                              className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors duration-200 group"
                              onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
                            >
                              <Link
                                to={`/products?category=${category.id}`}
                                className="flex items-center space-x-2 flex-1"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setIsMenuOpen(false)
                                }}
                              >
                                <Package size={16} className="text-[#042B43] flex-shrink-0" />
                                <span className="font-medium text-sm text-gray-900 group-hover:text-[#042B43] transition-colors">
                                  {category.name}
                                </span>
                              </Link>
                              {category.children && category.children.length > 0 && (
                                <ChevronRight
                                  size={16}
                                  className={`text-gray-400 transition-transform duration-200 flex-shrink-0 ${
                                    expandedCategory === category.id ? "rotate-90" : ""
                                  }`}
                                />
                              )}
                            </div>
                            {/* Expandable Subcategories */}
                            {expandedCategory === category.id && category.children && category.children.length > 0 && (
                              <div className="bg-gray-50 border-t border-gray-100">
                                <div className="py-2">
                                  {category.children.map((child: any) => (
                                    <Link
                                      key={child.id}
                                      to={`/products?category=${category.id}&parent_id=${child.id}`}
                                      className="flex items-center space-x-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-[#042B43] hover:text-white transition-colors duration-200"
                                      onClick={() => {
                                        setIsMenuOpen(false)
                                        setExpandedCategory(null)
                                      }}
                                    >
                                      <ChevronRight size={12} className="text-gray-400 flex-shrink-0" />
                                      <span>{child.name}</span>
                                    </Link>
                                  ))}
                                </div>
                              </div>
                              )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Main Navigation Links */}
              <div className="flex items-center space-x-2 ml-4 lg:ml-8">
                <button className="px-3 lg:px-4 py-4 hover:bg-[#0A3A5C] hover:text-white transition-all duration-200 font-medium bg-transparent border-none outline-none cursor-pointer rounded-sm relative group">
                  <Link to="/">Home</Link>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
                </button>
                <button className="px-3 lg:px-4 py-4 hover:bg-[#0A3A5C] hover:text-white transition-all duration-200 font-medium bg-transparent border-none outline-none cursor-pointer rounded-sm relative group">
                  <Link to="/products">Products</Link>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
                </button>
                <button className="px-3 lg:px-4 py-4 hover:bg-[#0A3A5C] hover:text-white transition-all duration-200 font-medium bg-transparent border-none outline-none cursor-pointer rounded-sm relative group">
                  <Link to="/cart">Cart</Link>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
                </button>
                <button className="px-3 lg:px-4 py-4 hover:bg-[#0A3A5C] hover:text-white transition-all duration-200 font-medium bg-transparent border-none outline-none cursor-pointer rounded-sm relative group">
                  <Link to="/cart/checkout">Checkout</Link>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
                </button>
              </div>

              {/* Category Quick Links */}
              <div className="hidden lg:flex space-x-2 ml-8 border-l border-[#0A3A5C] pl-8">
                {mainNavCategories.map((cat: any) => (
                  <button
                    key={cat.id}
                    className={`px-4 py-4 hover:bg-[#0A3A5C] hover:text-white transition-all duration-200 font-medium bg-transparent border-none outline-none cursor-pointer rounded-sm relative group transform hover:scale-105 ${
                      activeCategory === cat.id ? "bg-[#0A3A5C] text-white shadow-inner" : ""
                    }`}
                    onClick={() => handleCategoryClick(cat.id)}
                  >
                    {cat.name}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-200 rounded-sm"></div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-[#042B43] text-white z-50 shadow-lg">
            <div className="container mx-auto px-4 py-4">
              {/* Mobile Navigation Links */}
              <div className="space-y-2 mb-4">
                <Link
                  to="/"
                  className="block px-4 py-3 hover:bg-[#0A3A5C] rounded-lg transition-colors"
                  onClick={closeMobileMenu}
                >
                  Home
                </Link>
                <Link
                  to="/products"
                  className="block px-4 py-3 hover:bg-[#0A3A5C] rounded-lg transition-colors"
                  onClick={closeMobileMenu}
                >
                  Products
                </Link>
                <Link
                  to="/cart"
                  className="block px-4 py-3 hover:bg-[#0A3A5C] rounded-lg transition-colors"
                  onClick={closeMobileMenu}
                >
                  Cart ({cartCount})
                </Link>
                <Link
                  to="/cart/checkout"
                  className="block px-4 py-3 hover:bg-[#0A3A5C] rounded-lg transition-colors"
                  onClick={closeMobileMenu}
                >
                  Checkout
                </Link>
              </div>

              {/* Mobile Categories */}
              <div className="border-t border-[#0A3A5C] pt-4">
                <button
                  className="flex items-center justify-between w-full px-4 py-3 hover:bg-[#0A3A5C] rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <span className="flex items-center space-x-2">
                    <Grid3X3 size={20} />
                    <span>All Categories</span>
                  </span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${isMenuOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Mobile Categories Dropdown */}
                {isMenuOpen && (
                  <div className="mt-2 ml-4 space-y-2">
                    {isLoading && <div className="px-4 py-2 text-gray-300">Loading categories...</div>}
                    {error && <div className="px-4 py-2 text-red-300">Failed to load categories</div>}
                    {!isLoading &&
                      !error &&
                      categories?.map((category: any) => (
                        <div key={category.id} className="space-y-1">
                          <Link
                            to={`/products?category=${category.id}`}
                            className="block px-4 py-2 text-sm hover:bg-[#0A3A5C] rounded-lg transition-colors"
                            onClick={closeMobileMenu}
                          >
                            {category.name}
                          </Link>
                          {category.children && category.children.length > 0 && (
                            <div className="ml-4 space-y-1">
                              {category.children.map((child: any) => (
                                <Link
                                  key={child.id}
                                  to={`/products?category=${category.id}&parent_id=${child.id}`}
                                  className="block px-4 py-2 text-xs text-gray-300 hover:bg-[#0A3A5C] hover:text-white rounded-lg transition-colors"
                                  onClick={closeMobileMenu}
                                >
                                  {child.name}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* Mobile Quick Categories */}
              <div className="border-t border-[#0A3A5C] pt-4 mt-4">
                <div className="text-sm text-gray-300 px-4 mb-2">Quick Categories</div>
                <div className="space-y-2">
                  {mainNavCategories.map((cat: any) => (
                    <button
                      key={cat.id}
                      className="block w-full text-left px-4 py-2 hover:bg-[#0A3A5C] rounded-lg transition-colors"
                      onClick={() => handleCategoryClick(cat.id)}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Contact Info */}
              <div className="border-t border-[#0A3A5C] pt-4 mt-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 px-4 py-2 text-sm">
                    <Phone size={16} className="text-blue-300" />
                    <span>+97142528481</span>
                  </div>
                  <div className="flex items-center space-x-2 px-4 py-2 text-sm">
                    <Mail size={16} className="text-blue-300" />
                    <span>info@hamtos.com</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Desktop Mega Menu Overlay */}
        {isMenuOpen && (
          <div
            className="hidden md:block fixed inset-0 bg-black bg-opacity-25 z-[90]"
            onClick={() => setIsMenuOpen(false)}
          />
        )}

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 bg-black bg-opacity-25 z-40" onClick={closeMobileMenu} />
        )}
      </header>
    </>
  )
}

export default Header
