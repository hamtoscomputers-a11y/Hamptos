"use client"

import { useEffect, useState } from "react"
import { useParams, Link, useLocation } from "react-router-dom"
import { useProductById, useProducts } from "@/api/hooks/useProducts"
import { useProductsByCategory } from "@/api/hooks/useCategories"
import ProductGallery from "@/components/products/ProductGallery"
import ProductInfo from "@/components/products/ProductInfo"
import BundleAccessories from "@/components/products/BundleAccessories"
import PromoMosaic from "@/components/products/PromoMosaic"
import QuickSpecs from "@/components/products/QuickSpecs"
import ProductDetailsSection from "@/components/products/ProductDetailsSection"
import AccessoriesTable from "@/components/products/AccessoriesTable"
import CompareSimilarItems from "@/components/products/CompareSimilarItems"
import GetMoreInformation from "@/components/products/GetMoreInformation"
import QualityCertifications from "@/components/products/QualityCertifications"
import ProductSpecTable from "@/components/products/ProductSpecTable"
import TechnicalSupportBanner from "@/components/products/TechnicalSupportBanner"
import CustomerReviews from "@/components/products/CustomerReviews"
import QuestionsAnswers from "@/components/products/QuestionsAnswers"
import IndustryNews from "@/components/products/IndustryNews"
import ResourcesDownloads from "@/components/products/ResourcesDownloads"
import RelatedProducts from "@/components/products/RelatedProducts"
import NewsletterPanel from "@/components/home/NewsletterPanel"
import { addToCart } from "@/store/cartSlice"
import { toggleWishlistItem } from "@/store/wishlistSlice"
import type { AppDispatch, RootState } from "@/store"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "@/hooks/use-toast"
import { Helmet } from 'react-helmet-async';

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>()
  const location = useLocation()
  const [quantity, setQuantity] = useState(1)

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
  const dispatch = useDispatch<AppDispatch>()
  // Read before the early returns below, so the hook order stays stable.
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items)

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
  let brandId: string | number | undefined
  if (typeof data.brand === "object" && data.brand && "name" in data.brand) {
    brandName = (data.brand as { name: string }).name
    brandId = (data.brand as { id?: string | number }).id
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
    code: (data as any)?.code || "",
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

  const isWishlisted = wishlistItems.some((item) => item.id === Number(product.id))

  const handleToggleWishlist = () => {
    dispatch(
      toggleWishlistItem({
        id: Number(product.id),
        name: product.name,
        brand: product.brand,
        price: product.price,
        promoPrice: product.originalPrice,
        image: product.image,
        slug: (data as any)?.slug,
      }),
    )
    toast({
      title: isWishlisted ? "Removed from wishlist" : "Saved to wishlist",
      description: product.name,
    })
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
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,560px)_minmax(0,1fr)] lg:gap-x-12">
            <ProductGallery
              image={product.image}
              photos={photos}
              name={product.name}
              onSale={product.isOnSale}
            />

            <ProductInfo
              name={product.name}
              brand={product.brand}
              brandId={brandId}
              model={product.code}
              price={product.price}
              originalPrice={product.originalPrice}
              inStock={product.inStock}
              availableQty={availableQty}
              quantity={quantity}
              onQuantityChange={setQuantity}
              onAddToCart={handleAddToCart}
              isWishlisted={isWishlisted}
              onToggleWishlist={handleToggleWishlist}
            />
          </div>
        </div>

        {/* Curated bundle rail, filled from live catalogue products. */}
        <BundleAccessories
          products={relatedCategoryData?.products || []}
          fallbackProducts={relatedPoolData?.data || []}
          currentId={String(product.id)}
          isLoading={relatedLoading}
        />

        {/* Promo mosaic, in place of the old detail tabs. Nothing is lost: the
            tabs' `key_information` and `product_details` now render in Quick
            Specs, Product Details and the specification table below. */}
        <PromoMosaic />

        {/* Quick Specs — the figure and its spec table. */}
        <QuickSpecs
          code={product.code}
          image={product.image}
          name={product.name}
          categoryName={categoryName}
          keyInformation={product.key_information}
        />

        {/* Product Details — the front-panel figure over the ERP's own prose. */}
        <ProductDetailsSection
          code={product.code}
          name={product.name}
          image={product.image}
          photos={photos}
          productDetails={product.product_details || product.details}
        />

        {/* The Accessories — catalogue products grouped by their ERP category. */}
        <AccessoriesTable
          products={relatedCategoryData?.products || []}
          fallbackProducts={relatedPoolData?.data || []}
          currentId={String(product.id)}
          code={product.code}
          name={product.name}
        />

        {/* Compare to Similar Items — this product's specs beside four others'. */}
        <CompareSimilarItems
          products={relatedCategoryData?.products || []}
          fallbackProducts={relatedPoolData?.data || []}
          currentId={String(product.id)}
          code={product.code}
          name={product.name}
          keyInformation={product.key_information}
        />

        {/* Get More Information — the contact prompt under the comparison. */}
        <GetMoreInformation code={product.code} name={product.name} />

        <QualityCertifications />

        {/* The full spec table, two-up and striped. */}
        <ProductSpecTable
          brand={product.brand}
          code={product.code}
          name={product.name}
          keyInformation={product.key_information}
        />

        <GetMoreInformation code={product.code} name={product.name} variant="wide" />

        <QualityCertifications />

        {/* Support banner — the photo overflows the fill upward. */}
        <TechnicalSupportBanner />

        <CustomerReviews />

        <QuestionsAnswers name={product.name} code={product.code} />

        <IndustryNews />

        <ResourcesDownloads />

        {/* Related Products — the home page's rail, on the Figma's white split
            treatment, filled from the pools already fetched for this page. */}
        <RelatedProducts
          products={relatedCategoryData?.products || []}
          fallbackProducts={relatedPoolData?.data || []}
          shownIds={[String(product.id)]}
          isLoading={relatedLoading}
          title="Related Products"
          subtitle="Hamtos is your trusted source for IT devices in Dubai. We know that having the right technology plays a key role in helping businesses grow and succeed."
          tone="light"
          align="split"
          showExplore
          exploreHref="/products"
        />

        {/* The Figma closes the product page on the same newsletter panel the
            homepage uses — full-bleed, rounded across the top, against the footer. */}
        <NewsletterPanel />
      </div>
    </>
  )
}

export default ProductDetail
