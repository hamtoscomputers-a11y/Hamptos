import type React from "react"
import ProductCard from "./ProductCard" // Assuming ProductCard is already responsive or will be made responsive
import { Link } from "react-router-dom"
import { Search } from "lucide-react" // Only Search is used from lucide-react
import arrowRight from "../assets/arrow.svg"
interface Product {
  id: string
  name: string
  price: number
  netPrice?: number
  promoPrice?: number
  originalPrice?: number
  image: string
  brand: string
  inStock: boolean
  isOnSale?: boolean
  rating?: number
  reviews?: number
  BXGY?: any
  quantity?: number
  quantity_available?: number // Added based on ProductCard props
}

interface ProductGridProps {
  products: Product[]
  title?: string
  description?: string
  showViewAll?: boolean
  viewMode?: "grid" | "list"
  isLoading?: boolean
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  title,
  description,
  showViewAll = true,
  viewMode = "grid",
  isLoading = false,
}) => {
  // Filter valid products
  const validProducts = products?.filter((product) => product && product?.price !== undefined && product?.id && product?.name) || []

  const LoadingSkeleton = () => (
    <div
      className={`grid gap-4 sm:gap-6 ${
        viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" : "grid-cols-1"
      }`}
    >
      {Array.from({ length: viewMode === "grid" ? 10 : 5 }).map((_, i) => (
        <div key={i} className="animate-pulse bg-white rounded-lg shadow-sm p-4">
          <div className="bg-gray-200 rounded-lg h-32 sm:h-40 md:h-48 mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      ))}
    </div>
  )

  // Enhanced empty state
  const EmptyState = () => (
    <div className="text-center py-12 sm:py-16 px-4">
      <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4 sm:mb-6">
        <Search className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
      </div>
      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No products found</h3>
      <p className="text-gray-500 mb-4 sm:mb-6 max-w-xs sm:max-w-md mx-auto text-sm sm:text-base">
        We couldn't find any products matching your criteria. Try adjusting your search or browse our categories.
      </p>
      <Link
        to="/products"
        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm sm:text-base"
      >
        Browse Products
      </Link>
    </div>
  )

  // List view component for individual products
  const ProductListItem = ({ product }: { product: Product }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 p-3 sm:p-4">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center">
        <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 mx-auto sm:mx-0">
          <img
            src={product.image || "/placeholder.svg?height=96&width=96"}
            alt={product.name}
            className="w-full h-full object-cover rounded-md"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = "/placeholder.svg?height=96&width=96"
            }}
          />
        </div>
        <div className="flex-1 min-w-0 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start mb-2">
            <div className="mb-1 sm:mb-0">
              <p className="text-xs sm:text-sm text-gray-500 font-medium">{product.brand}</p>
              <h3 className="font-semibold text-gray-900 leading-tight line-clamp-2 text-base sm:text-lg">
                {product.name}
              </h3>
            </div>
            {product.isOnSale && (
              <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded flex-shrink-0">Sale</span>
            )}
          </div>
          {product.rating && (
            <div className="flex items-center justify-center sm:justify-start gap-1 mb-2">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className={`w-3 h-3 sm:w-4 sm:h-4 ${i < (product.rating || 0) ? "text-yellow-400" : "text-gray-300"}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              {product.reviews && <span className="text-xs sm:text-sm text-gray-500">({product.reviews})</span>}
            </div>
          )}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mt-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-base sm:text-lg text-gray-900">${product.price}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs sm:text-sm text-gray-500 line-through">${product.originalPrice}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {!product.inStock && (
                <Link to={`/get-quote?source=ask-for-product&productName=${encodeURIComponent(product.name)}`} className="text-xs sm:text-sm text-red-600 font-medium hover:text-red-700 transition-colors">
                  Ask for Product
                </Link>
              )}
              {product.inStock ? (
              <button
                  className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors duration-200 bg-blue-600 text-white hover:bg-blue-700"
                >
                  Add to Cart
              </button>
              ) : (
                <Link
                  to={`/get-quote?source=ask-for-product&productName=${encodeURIComponent(product.name)}`}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors duration-200 bg-red-500 text-white hover:bg-red-600 text-center"
                >
                  Ask for Product
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <section className="py-6 sm:py-8 md:py-10 px-4 sm:px-6 md:px-8 lg:px-16">
      {title && (
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4 sm:mb-6">
          <div className="text-center sm:text-left mb-4 sm:mb-0">
            <h2 className="text-xl sm:text-2xl font-semibold text-[#1A74BB]">{title}</h2>
            {description && (
              <p className="text-[#2A4153] mt-1 font-normal text-sm sm:text-base max-w-md mx-auto sm:mx-0">
                {description}
              </p>
            )}
          </div>
          {showViewAll && window.location.pathname !== "/products" && validProducts.length > 0 && (
            <Link
              to="/products"
              className="inline-flex p-2 justify-center rounded gap-2 items-center bg-[#1A74BB] text-white font-bold transition-colors duration-200 group text-sm sm:text-[14px]"
            >
              <span>Explore All</span>
              <img
                src={arrowRight} // Using placeholder for arrowRight
                alt="arrow-right"
                className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200"
              />
            </Link>
          )}
        </div>
      )}

      {isLoading ? (
        <LoadingSkeleton />
      ) : validProducts.length > 0 ? (
        <div className={`transition-all duration-300 ${viewMode === "list" ? "space-y-3 sm:space-y-4" : ""}`}>
          {viewMode === "grid" ? (
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 ${
                window.location.href.includes("/products") ? "lg:grid-cols-4 gap-[15px]" : "lg:grid-cols-5 gap-4 sm:gap-6"
              } items-stretch`}
            >
              {validProducts.map((product) => (
                <div key={product.id} className="h-full flex">
                  <ProductCard
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    netPrice={product.netPrice}
                    promoPrice={product.promoPrice}
                    originalPrice={product.originalPrice}
                    image={product.image}
                    brand={product.brand}
                    inStock={product.inStock}
                    isOnSale={product.isOnSale}
                    rating={product.rating}
                    reviews={product.reviews}
                    BXGY={product.BXGY}
                    quantity_available={product.quantity_available || product.quantity} // Use quantity_available or quantity
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {validProducts.map((product) => (
                <ProductListItem key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <EmptyState />
      )}

    </section>
  )
}

export default ProductGrid
