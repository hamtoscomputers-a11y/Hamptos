"use client"

import { useEffect, useRef, useState } from "react"
import { useParams, Link, useLocation } from "react-router-dom"
import { useProductById, useProducts } from "@/api/hooks/useProducts"
import { useProductsByCategory } from "@/api/hooks/useCategories"
import ProductGallery from "@/components/products/ProductGallery"
import ProductSummary from "@/components/products/ProductSummary"
import PurchasePanel from "@/components/products/PurchasePanel"
import ProductTabs, { type TabKey } from "@/components/products/ProductTabs"
import RelatedProducts from "@/components/products/RelatedProducts"
import { addToCart } from "@/store/cartSlice"
import { useDispatch } from "react-redux"
import { toast } from "@/hooks/use-toast"
import { Helmet } from 'react-helmet-async';

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>()
  const location = useLocation()
  const [selectedTab, setSelectedTab] = useState<TabKey>("key")
  const [quantity, setQuantity] = useState(1)
  const tabsRef = useRef<HTMLDivElement>(null)

  // The ERP carries no datasheet URL, so the button opens the spec tabs, which
  // hold the same detail content.
  const handleViewDatasheet = () => {
    setSelectedTab("specs")
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    tabsRef.current?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" })
  }

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

  // Pools for the Related Product rail. Same category first; the catalogue-wide
  // pool covers a category that holds nothing but this product. Both must be
  // called before the early returns below, so they read straight off `data`.
  const relatedCategoryId = (data as any)?.category?.id || ""
  const { data: relatedCategoryData, isLoading: relatedLoading } = useProductsByCategory(relatedCategoryId, {
    limit: 20,
    start: 1,
    include: "brand,category,photos",
  })
  const { data: relatedPoolData } = useProducts({ limit: 20, start: 0, include: "brand,category,photos" })

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
    // The ERP exposes no rating or review fields — left undefined rather than
    // invented, so the summary renders its empty state until a source exists.
    rating: undefined as number | undefined,
    reviews: undefined as number | undefined,
    meta: (data as any)?.metadata || "",
    BXGY: (data as any)?.BXGY || null,
    key_information: (data as any)?.key_information || "",
  }
  console.log(product)

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

  const categoryName = typeof data.category === "object" && data.category ? (data.category as any).name : ""

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
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8">
          <nav aria-label="Breadcrumb" className="mb-6 text-[13px] text-ink-body">
            <Link to="/" className="transition-colors hover:text-brand-700">
              Home
            </Link>
            {categoryName && (
              <>
                <span className="px-1.5">&gt;</span>
                <Link
                  to={`/products?category=${(data.category as any).id}`}
                  className="transition-colors hover:text-brand-700"
                >
                  {categoryName}
                </Link>
              </>
            )}
            <span className="px-1.5">&gt;</span>
            <span className="text-ink-title">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[520px_minmax(0,1fr)_300px] lg:gap-x-6">
            <ProductGallery image={product.image} photos={photos} name={product.name} />

            <ProductSummary
              name={product.name}
              rating={product.rating}
              reviews={product.reviews}
              keyInformation={product.key_information}
              onViewDatasheet={handleViewDatasheet}
            />

            <PurchasePanel
              name={product.name}
              price={product.price}
              originalPrice={product.originalPrice}
              brand={product.brand}
              inStock={product.inStock}
              availableQty={availableQty}
              quantity={quantity}
              onQuantityChange={setQuantity}
              onAddToCart={handleAddToCart}
            />
          </div>

          <div ref={tabsRef}>
            <ProductTabs
              active={selectedTab}
              onActiveChange={setSelectedTab}
              keyInformation={product.key_information}
              // The ERP's field names invert the tabs: `product_details` holds
              // the prose the Details tab wants, and `key_information` holds the
              // grouped spec table. `details` itself comes back empty.
              details={product.details || product.product_details}
              specifications={product.key_information}
            />
          </div>
        </div>

        <RelatedProducts
          products={relatedCategoryData?.products || []}
          fallbackProducts={relatedPoolData?.data || []}
          shownIds={[String(product.id)]}
          isLoading={relatedLoading}
        />
      </div>
    </>
  )
}

export default ProductDetail
