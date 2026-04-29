"use client"

import { useState, useEffect } from "react"
import { useParams, Link, useLocation } from "react-router-dom"
import { useProductById } from "@/api/hooks/useProducts"
import { Shield, Truck, CreditCard, Plus, Minus, Star } from "lucide-react"
import { addToCart } from "@/store/cartSlice"
import { useDispatch } from "react-redux"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Helmet } from 'react-helmet-async';

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>()
  const location = useLocation()
  const [selectedTab, setSelectedTab] = useState("Key Information")
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  // Get product data from location state or fetch by ID
  const stateData = location.state as { productData?: any; productId?: string } | null
  const productId = stateData?.productId
  const passedProductData = stateData?.productData

  // Fetch product details from API if not passed in state
  // Only fetch if we have a productId and no passed data
  const { data: responseData, isLoading, error } = useProductById(
    productId || "", 
    "brand,category,photos",
    { enabled: !passedProductData && !!productId }
  );
  const dispatch = useDispatch()

  // Use passed data if available, otherwise use fetched data
  const apiResponse = passedProductData || responseData
  const data = (apiResponse as any)?.data || apiResponse

  // Scroll to top when component mounts and when tab changes
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if ("scrollBehavior" in document.documentElement.style) {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" })
    } else {
      window.scrollTo(0, 0)
    }
  }, [])

  // Show loading only if we're fetching and don't have passed data
  if (isLoading && !passedProductData)
    return <div className="container mx-auto px-4 py-8 text-center text-gray-600">Loading product details...</div>
  if ((error || !data) && !passedProductData) {
    console.error('Product detail error:', { error, responseData, data, productId, slug })
    return <div className="container mx-auto px-4 py-8 text-center text-red-500">Failed to load product details.</div>
  }

  // Debug: Log the received data
  console.log('Product detail data:', data)

  // Map API product to UI format
  let brandName = "Hamtos"
  if (typeof data.brand === "object" && data.brand && "name" in data.brand) {
    brandName = (data.brand as { name: string }).name
  } else if (typeof data.brand === "string") {
    brandName = data.brand
  }

  // Handle pricing - use unit_price or net_price if available, otherwise use price
  const priceValue = (data as any)?.unit_price || (data as any)?.net_price || data.price
  const originalPrice = Number(priceValue)
  const currentPrice = (data as any)?.promo_price ? Number((data as any).promo_price) : Number(priceValue)
  const showOriginalPrice = (data as any)?.promo_price && Number((data as any).promo_price) < Number(priceValue)

  // Get image URL - API returns image_url directly, or construct from image field
  const imageUrl = (data as any)?.image_url || 
                   (data.image ? `${import.meta.env.VITE_REACT_APP_API_URI}/assets/uploads/${data.image}` : null) ||
                   "/placeholder.svg?height=300&width=200"

  const product = {
    id: data.id,
    name: data.name,
    price: currentPrice,
    originalPrice: showOriginalPrice ? originalPrice : undefined,
    image: imageUrl,
    brand: brandName,
    product_details: (data as any)?.product_details || "",
    details: (data as any)?.details || "",
    inStock: Number(data.quantity || 0) > 0,
    isOnSale: !!showOriginalPrice,
    rating: 4,
    reviews: 0,
    meta: (data as any)?.metadata || "",
    BXGY: (data as any)?.BXGY || null,
    key_information: (data as any)?.key_information || "",
  }
  console.log(product)

  const handleQuantityChange = (change: number) => {
    setQuantity((prev) => Math.max(1, prev + change))
  }

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        item: {
          id: Number(product.id),
          name: product.name,
          price: product.price,
          promoPrice: product.originalPrice,
          image: product.image,
          brand: product.brand,
          BXGY: product.BXGY,
          quantity_available: availableQty,
        },
        quantity: quantity,
      }),
    )
    toast({
      title: "Added to cart!",
      description: `${quantity} ${product.name} added to cart`,
    })
  }

  const tabs = ["Key Information", "Product details for Invoice", "Product Description", "Reviews"]
  const mainImage = selectedImage || product.image
  
  // Get photos - API returns photos array with photo_url
  const photos: string[] = data.photos && Array.isArray(data.photos) 
    ? data.photos.map((p: any) => p.photo_url || p.photo).filter(Boolean)
    : []

  // After fetching product data - use quantity from API
  const availableQty = Number(data.quantity || 0)

  return (
    <>
      <Helmet>
        <title> {product.meta}</title>
        <meta name="description" content={product.meta} />
      </Helmet>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-16 py-6 sm:py-8">
          {/* Breadcrumb - Uncomment and adjust as needed */}
          {/* <nav className="text-sm text-gray-600 mb-4 sm:mb-6">
            <span>
              <Link to="/">Home</Link> &gt; {product.brand} &gt; {product.name}
            </span>
          </nav> */}

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 p-4 sm:p-6 md:p-8">
              {/* Product Images */}
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4 sm:p-6 flex items-center justify-center min-h-[200px] sm:min-h-[300px]">
                  <img
                    src={selectedImage || product.image}
                    alt={product.name}
                    className="w-full h-auto max-h-80 object-contain max-w-full"
                  />
                </div>
                {/* Thumbnails */}
                {photos.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-2 mt-2">
                    {photos.map((url, idx) => (
                      <img
                        key={idx}
                        src={url || "/placeholder.svg?height=64&width=64"}
                        alt={`Thumbnail ${idx + 1}`}
                        className={`w-14 h-14 sm:w-16 sm:h-16 object-contain rounded border cursor-pointer transition-all duration-200 ${
                          mainImage === url
                            ? "border-blue-500 ring-2 ring-blue-500"
                            : "border-gray-200 hover:border-gray-400"
                        }`}
                        onClick={() => setSelectedImage(url)}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2 sm:mb-4 leading-tight">
                    {product.name}
                  </h1>
                  {/* Rating */}
                  <div className="flex items-center space-x-2 mb-3 sm:mb-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < (product.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">{product.reviews} Reviews</span>
                  </div>
                </div>

                {/* Key Features */}
                <div>
                  <ul className="space-y-1.5 text-sm text-gray-700">
                    <li className="flex items-start">
                      <span className="text-gray-400 mr-2">•</span>
                      <span>Brand: {product.brand}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-gray-400 mr-2">•</span>
                      <span>In Stock: {product.inStock ? "Yes" : "No"}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-gray-400 mr-2">•</span>
                      <span>
                        Available Quantity:{" "}
                        <span className="font-semibold">{availableQty.toFixed(0)}</span>
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Price */}
                <div className="space-y-1.5">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl sm:text-3xl font-bold text-blue-600">AED {product.price}</span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-base sm:text-lg text-gray-500 line-through">AED {product.originalPrice}</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">Inclusive of VAT</div>
                  <div className="text-sm text-gray-600">Sold By: {product.brand}</div>
                </div>

                {/* Delivery Info */}
                <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                  <div className="flex items-center space-x-2 mb-1.5 sm:mb-2">
                    <Truck className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium">Delivery available</span>
                  </div>
                  <div className="text-sm font-medium">
                    {product.inStock ? (
                      <span className="text-green-600">In Stock</span>
                    ) : (
                      <Link to={`/get-quote?source=ask-for-product&productName=${encodeURIComponent(product.name)}`} className="text-red-600 hover:text-red-700 transition-colors">
                        Ask for Product
                      </Link>
                    )}
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <Shield className="w-4 h-4 text-blue-600" />
                    <span>Warranty One Year</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Truck className="w-4 h-4 text-blue-600" />
                    <span>Cash On Delivery</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    <span>Secure Transaction</span>
                  </div>
                </div>

                {/* Quantity and Add to Cart */}
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                    <div className="flex items-center border border-gray-300 rounded w-full sm:w-auto justify-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                        className="h-10 w-10 p-0 hover:bg-gray-100"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="px-4 py-2 min-w-[3rem] text-center font-medium">{quantity}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleQuantityChange(1)}
                        className="h-10 w-10 p-0 hover:bg-gray-100"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    {product.inStock && availableQty > 0 ? (
                      <Button
                        onClick={handleAddToCart}
                        className={`flex-1 py-3 font-semibold bg-[#BFD6FF] hover:bg-[#A5C9FF] text-[#101010] w-full sm:w-auto`}
                        disabled={!product.inStock}
                      >
                        Add To Cart
                      </Button>
                    ) : (
                      <Link 
                        to={`/get-quote?source=ask-for-product&productName=${encodeURIComponent(product.name)}`}
                        className="flex-1 py-3 text-center bg-red-500 text-white font-semibold w-full sm:w-auto hover:bg-red-600 transition-colors block rounded-md"
                      >
                        Ask for Product
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Product Tabs */}
            <div className="border-t border-gray-200 mt-4 sm:mt-6">
              <div className="flex overflow-x-auto whitespace-nowrap px-4 sm:px-6 md:px-8 bg-gray-50 border-b border-gray-200">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    className={`py-3 px-4 sm:px-6 font-medium text-sm sm:text-base border-b-2 transition-colors duration-200 flex-shrink-0 ${
                      selectedTab === tab
                        ? "border-blue-600 text-blue-600 bg-white"
                        : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                    onClick={() => setSelectedTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="p-4 sm:p-6 md:p-8 bg-white">
                {selectedTab === "Key Information" && (
                  <div>
                    <div
                      className="prose prose-sm sm:prose-base mb-4 text-gray-700 max-w-none"
                      dangerouslySetInnerHTML={{ __html: product.key_information }}
                    />
                  </div>
                )}
                {selectedTab === "Product details for Invoice" && (
                  <div>
                    <h3 className="font-semibold mb-4 text-lg sm:text-xl">Product Details for Invoice</h3>
                    <div
                      className="text-gray-700 prose prose-sm sm:prose-base max-w-none"
                      dangerouslySetInnerHTML={{ __html: product.details }}
                    />
                  </div>
                )}
                {selectedTab === "Product Description" && (
                  <div>
                    <h3 className="font-semibold mb-4 text-lg sm:text-xl">Product Description</h3>
                    <div
                      className="text-gray-700 prose prose-sm sm:prose-base max-w-none"
                      dangerouslySetInnerHTML={{ __html: product.product_details }}
                    />
                  </div>
                )}
                {selectedTab === "Reviews" && (
                  <div>
                    <h3 className="font-semibold mb-4 text-lg sm:text-xl">Customer Reviews</h3>
                    <p className="text-gray-700 text-sm sm:text-base">
                      No reviews yet. Be the first to review this product!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProductDetail
