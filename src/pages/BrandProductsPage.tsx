"use client"

import { useParams, useNavigate } from "react-router-dom"
import { useProductsByBrand, useBrands } from "@/api/hooks/useProducts"
import ProductGrid from "@/components/ProductGrid"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useMemo } from "react"

const BrandProductsPage = () => {
  const { brandId } = useParams<{ brandId: string }>()
  const navigate = useNavigate()
  
  // First, fetch all brands to find the brand code from the ID
  const { data: brandsData } = useBrands({ limit: 100 })
  const brands = brandsData?.data || []
  
  // Find the brand by ID to get its code
  const brand = useMemo(() => {
    if (!brandId) return null
    const foundBrand = brands.find((b: any) => String(b.id) === String(brandId))
    return foundBrand
  }, [brands, brandId])
  
  const brandCode = brand?.code || ""
  
  // Now fetch products using the brand code
  const { data, isLoading, error } = useProductsByBrand(brandCode, {
    limit: 1000,
    start: 1,
    include: "brand,category,photos",
  })

  // Handle API response - service now returns proper structure
  const brandFromData = data?.brand;
  const apiProducts = data?.products || [];
  const actualProducts = apiProducts;
  // Use brand name from API response, or fallback to brand from brands list, or "Brand"
  const brandName = brandFromData?.name || brand?.name || "Brand"
  
  
  // Map API products to ProductGrid format
  const products = useMemo(() => {
    if (!actualProducts || actualProducts.length === 0) return []
    return actualProducts.map((item: any) => {
      // Handle pricing - if promo_price exists, use it as main price
      const originalPrice = Number(item.price)
      const currentPrice = (item as any)?.promo_price ? Number((item as any).promo_price) : Number(item.price)
      const showOriginalPrice = (item as any)?.promo_price && Number((item as any).promo_price) < Number(item.price)

      return {
        id: item.id,
        name: item.name,
        price: currentPrice,
        originalPrice: showOriginalPrice ? originalPrice : undefined,
        netPrice: Number(item.net_price) || Number(item.unit_price) || undefined,
        promoPrice: Number((item as any)?.promo_price) || undefined,
        image: item.image_url || item.image_url || 
               (item.image ? `${import.meta.env.VITE_REACT_APP_API_URI}/assets/uploads/${item.image}` : "/placeholder.svg"),
        photos: item.photos,
        brand:
          typeof item.brand === "object" && item.brand !== null
            ? (item.brand as { name: string }).name
            : item.brand || "Hamtos",
        inStock: Number(item.quantity) > 0,
        isOnSale: !!showOriginalPrice,
        rating: 4,
        reviews: 0,
        BXGY: (item as any)?.BXGY || null,
        quantity: (item as any)?.quantity || 0,
      }
    })
  }, [actualProducts])

  // Show loading while fetching brand info or products
  if (isLoading || !brandCode) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-gray-600">Loading products...</div>
      </div>
    )
  }

  // If brand not found
  if (!brand && brandId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="text-center text-gray-500">
          <h1 className="text-2xl font-bold mb-2">Brand not found</h1>
          <p className="text-sm">The brand with ID {brandId} could not be found.</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="text-center text-red-500">
          <h1 className="text-2xl font-bold mb-2">Failed to load products</h1>
          <p className="text-sm">There was an error loading products for this brand.</p>
        </div>
      </div>
    )
  }

  if (!data && !isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="text-center text-gray-500">
          <h1 className="text-2xl font-bold mb-2">No products found</h1>
          <p className="text-sm">No products were returned for this brand.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">{brandName} Products</h1>
      <p className="text-gray-600 mb-6">
        Showing {products.length} products from {brandName}
      </p>

      {products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No products found for this brand.</p>
          <p className="text-xs text-gray-400 mt-2">
            Showing 0 products
          </p>
        </div>
      )}
    </div>
  )
}

export default BrandProductsPage
