"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import ProductFilters from "@/components/products/ProductFilters"
import { useLocation, useNavigate } from "react-router-dom"
import { useProductSearch, useProducts, useProductsByBrand, useBrands } from "@/api/hooks/useProducts"
import { useProductsByCategory, useCategories } from "@/api/hooks/useCategories"
import ProductGrid from "@/components/ProductGrid" // Assuming ProductGrid is already responsive
import { Filter, X } from "lucide-react" // Import icons for mobile filter

const ProductsPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const params = new URLSearchParams(location.search)
  const page = Number(params.get("page") || 1)
  const search = params.get("search") || ""
  const category = params.get("category") || ""
  const subcategory = params.get("subcategory") || ""
  const parent_id = params.get("parent_id") || ""
  const brand = params.get("brand") || ""
  const limit = 20
  // Always use high limit when category or brand is selected to ensure we get all products for frontend filtering
  // This is necessary because we filter by brand/subcategory on the frontend
  const effectiveLimit = (category || brand) ? 1000 : limit

  const [isSidebarOpen, setIsSidebarOpen] = useState(false) // State for mobile sidebar
  const [priceMin, setPriceMin] = useState(params.get("price_min") || "")
  const [priceMax, setPriceMax] = useState(params.get("price_max") || "")
  const includeOutOfStock = params.get("in_stock") === "0"

  // Scroll to top when component mounts and when tab changes
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if ("scrollBehavior" in document.documentElement.style) {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" })
    } else {
      window.scrollTo(0, 0)
    }
  }, [])

  // Fetch categories for sidebar
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories({ limit: 100 })
  const categories = categoriesData?.data || []

  // Get subcategories based on selected category or all subcategories
  const subcategories = useMemo(() => {
    if (!category) {
      // Show all subcategories from all categories
      return categories.flatMap((cat: any) => cat.children || [])
    }
    // Show subcategories of selected category
    const selectedCat = categories.find((cat: any) => String(cat.id) === category)
    return selectedCat?.children || []
  }, [categories, category])

  // Fetch brands for sidebar
  const { data: brandsData, isLoading: brandsLoading } = useBrands({ limit: 100 })
  const brands = brandsData?.data || []

  // 1. Search - disable when both search and brand are active (we use brandData instead)
  // Otherwise use server-side pagination
  const searchLimit = (search && brand) ? 1000 : limit
  const searchStart = (search && brand) ? 1 : (page - 1) * limit + 1
  const {
    data: searchData,
    isLoading: searchLoading,
    error: searchError,
  } = useProductSearch({
    q: search,
    limit: searchLimit,
    start: searchStart, // Get all results if brand filter is active
    type: "all",
    include: "brand,category,photos",
  })
  // Note: When both search and brand are active, we use brandData, not searchData
  
  // Main category products - always use high limit when category is selected for frontend filtering
  // Explicitly set start: 1 to ensure we get the first page with all products
  const {
    data: categoryData,
    isLoading: categoryLoading,
    error: categoryError,
  } = useProductsByCategory(category, {
    limit: effectiveLimit,
    start: 1,
    include: "brand,category,photos",
    parent_id: parent_id || undefined,
  });

  // Products by brand - always use high limit to get all products for filtering
  const {
    data: brandData,
    isLoading: brandLoading,
    error: brandError,
  } = useProductsByBrand(brand, {
    limit: brand ? effectiveLimit : limit,
    start: 1, // Explicitly set start to 1 to get first page
    include: "brand,category,photos",
  });

  // Debug: Log when brand data changes (especially when both search and brand are active)
  useEffect(() => {
    if (brand && brandData) {
      console.log('Brand data updated:', {
        brand,
        search,
        productsCount: brandData?.products?.length || 0,
        total: brandData?.total || 0,
        brandName: brandData?.brand?.name,
        isLoading: brandLoading,
        error: brandError
      })
    }
  }, [brand, brandData, search, brandLoading, brandError])

  // All products
  const {
    data: allData,
    isLoading: allLoading,
    error: allError,
  } = useProducts({
    limit,
    start: (page - 1) * limit,
    include: "brand,category,photos",
  });

  const navigationState = location.state as { products?: any[]; categoryId?: string; parentId?: string } | undefined

  // Decide which data to show and apply filters on frontend
  const products = useMemo(() => {
    console.log('🔄 Products memo recalculating:', { 
      search, 
      brand, 
      hasSearchData: !!searchData,
      hasBrandData: !!brandData,
      searchProductsCount: searchData?.results?.products?.length || 0,
      brandProductsCount: brandData?.products?.length || 0,
      category 
    })
    let baseProducts: any[] = [];
    if (navigationState?.products) {
      baseProducts = navigationState.products;
    } else if (search && brand) {
      // When both search and brand are active: use brand products API, then filter by search term
      // This ensures we get products from the selected brand that match the search
      baseProducts = brandData?.products || [];
      console.log('📦 Using brand products (will filter by search):', { 
        count: baseProducts.length, 
        brand,
        search,
        brandDataExists: !!brandData,
        brandLoading,
        brandError,
        sampleProduct: baseProducts[0] ? {
          id: baseProducts[0].id,
          name: baseProducts[0].name,
          brand: baseProducts[0].brand
        } : null
      })
    } else if (search) {
      // Search only (no brand filter)
      baseProducts = searchData?.results?.products || [];
      console.log('📦 Using search products:', { 
        count: baseProducts.length, 
        brand,
        sampleBrand: baseProducts[0]?.brand 
      })
    } else if (category) {
      // When category is selected, use category data (this handles both category-only and category+brand cases)
      if (categoryData?.products && categoryData.products.length > 0) {
        baseProducts = categoryData.products;
      } else {
        // Fallback: if category data is not loaded yet, use empty array to avoid showing wrong data
        baseProducts = [];
        console.warn('Category data not loaded yet or empty', { category, categoryData });
      }
      // Log if API returned fewer products than total (indicates pagination issue)
      if (categoryData && categoryData.total && categoryData.products) {
        const returnedCount = categoryData.products.length;
        const totalCount = categoryData.total;
        if (returnedCount < totalCount && returnedCount < effectiveLimit) {
          console.warn(`API returned ${returnedCount} products but total is ${totalCount}. Requested limit: ${effectiveLimit}. This may cause missing products.`);
        }
      }
    } else if (brand) {
      // When only brand is selected (no category)
      baseProducts = brandData?.products || [];
    } else {
      baseProducts = allData?.data || [];
    }
    
    // Debug logging (remove in production)
    if (category && (brand || subcategory)) {
      console.log('Filtering products:', {
        baseProductsCount: baseProducts.length,
        category,
        subcategory,
        brand,
        effectiveLimit,
        categoryDataTotal: categoryData?.total,
        categoryDataLimit: categoryData?.limit,
        categoryDataProductsCount: categoryData?.products?.length,
        usingCategoryData: !!categoryData,
        usingAllData: baseProducts === allData?.data,
        sampleProduct: baseProducts[0] ? {
          id: baseProducts[0].id,
          name: baseProducts[0].name,
          brand: baseProducts[0].brand,
          brandId: typeof baseProducts[0].brand === 'object' ? baseProducts[0].brand?.id : baseProducts[0].brand,
          subcategory_id: baseProducts[0].subcategory_id,
          category_id: baseProducts[0].category_id
        } : null,
        allDLinkProducts: baseProducts.filter((p: any) => {
          const brandId = typeof p.brand === 'object' ? p.brand?.id : p.brand;
          return String(brandId) === '21' || String(brandId) === '32';
        }).length
      });
    }
    
    // Apply filters on frontend
    let filteredProducts = baseProducts;
    
    // When both search and brand are active: brand products are already filtered by brand,
    // so we only need to filter by search term
    // If search doesn't match any products, show all brand products instead (better UX)
    if (search && brand) {
      const searchLower = search.toLowerCase();
      const beforeCount = filteredProducts.length;
      const searchFiltered = filteredProducts.filter((item: any) => {
        const name = (item.name || '').toLowerCase();
        const code = (item.code || '').toLowerCase();
        const description = ((item.description || item.details || item.product_details || '')).toLowerCase();
        const matches = name.includes(searchLower) || code.includes(searchLower) || description.includes(searchLower);
        return matches;
      });
      
      // If search filter results in 0 products, show all brand products instead
      // This provides better UX - user can see products from the brand they selected
      if (searchFiltered.length === 0 && beforeCount > 0) {
        console.log('🔍 Search filter returned 0 results, showing all brand products instead:', {
          search,
          searchLower,
          brand,
          brandProductsCount: beforeCount
        });
        // Keep all brand products (don't apply search filter)
        filteredProducts = filteredProducts; // Already set to baseProducts
      } else {
        filteredProducts = searchFiltered;
        console.log('🔍 Applied search filter on brand products:', {
          search,
          searchLower,
          brand,
          beforeCount,
          afterCount: filteredProducts.length,
          sampleMatches: filteredProducts.slice(0, 3).map((p: any) => ({
            id: p.id,
            name: p.name,
            nameMatch: (p.name || '').toLowerCase().includes(searchLower),
            codeMatch: (p.code || '').toLowerCase().includes(searchLower)
          }))
        });
      }
    }
    // Apply brand filter on frontend if brand is selected (but not when search + brand, handled above)
    else if (brand) {
      // Brand is stored as brand code (e.g., "D-001"), need to find matching products
      const brandCode = brand; // brand is already the code
      const beforeCount = filteredProducts.length;
      
      // Get brand ID from brands list to match by ID if code is not available in product
      const selectedBrand = brands.find((b: any) => b.code === brandCode);
      const brandId = selectedBrand?.id ? String(selectedBrand.id) : null;
      
      console.log('🔍 Applying brand filter:', { 
        brandCode, 
        brandId,
        baseProductsCount: baseProducts.length,
        sampleProducts: baseProducts.slice(0, 5).map((p: any) => ({
          id: p.id,
          name: p.name,
          brand: p.brand,
          brandType: typeof p.brand,
          brandCode: typeof p.brand === 'object' ? p.brand?.code : null,
          brandId: typeof p.brand === 'object' ? p.brand?.id : (typeof p.brand === 'string' || typeof p.brand === 'number' ? String(p.brand) : null),
          brand_id: p.brand_id
        }))
      })
      
      let matchCount = 0;
      filteredProducts = baseProducts.filter((item: any) => {
        let itemBrandId: string | null = null;
        let itemBrandCode: string | null = null;
        
        // Extract brand ID and code from product
        if (typeof item.brand === 'object' && item.brand !== null) {
          itemBrandId = item.brand.id ? String(item.brand.id) : null;
          itemBrandCode = item.brand.code || null;
        } else if (item.brand !== null && item.brand !== undefined) {
          itemBrandId = String(item.brand);
        }
        
        // Also check brand_id field
        if (!itemBrandId && item.brand_id) {
          itemBrandId = String(item.brand_id);
        }
        
        // Match by code first (most reliable)
        if (itemBrandCode === brandCode) {
          matchCount++;
          return true;
        }
        
        // Match by ID
        if (brandId && itemBrandId) {
          // Try exact string match
          if (itemBrandId === brandId || itemBrandId === String(brandId)) {
            matchCount++;
            return true;
          }
          // Try number comparison
          const itemBrandIdNum = Number(itemBrandId);
          const brandIdNum = Number(brandId);
          if (!isNaN(itemBrandIdNum) && !isNaN(brandIdNum) && itemBrandIdNum === brandIdNum) {
            matchCount++;
            return true;
          }
        }
        
        return false;
      });
      
      if (matchCount === 0 && baseProducts.length > 0) {
        console.warn('⚠️ No brand matches found. Sample product brands:', {
          brandCode,
          brandId,
          sampleBrands: baseProducts.slice(0, 5).map((p: any) => ({
            productId: p.id,
            productName: p.name,
            brand: p.brand,
            brandType: typeof p.brand,
            extractedBrandId: typeof p.brand === 'object' ? String(p.brand?.id || '') : String(p.brand || ''),
            extractedBrandCode: typeof p.brand === 'object' ? p.brand?.code : null
          }))
        });
      }
      
      console.log('✅ After brand filter:', { 
        beforeCount, 
        afterCount: filteredProducts.length, 
        brandCode,
        brandId,
        filteredCount: filteredProducts.length,
        sampleFiltered: filteredProducts[0] ? {
          id: filteredProducts[0].id,
          name: filteredProducts[0].name,
          brand: filteredProducts[0].brand
        } : null
      });
    }
    
    // Apply subcategory filter on frontend if subcategory is selected
    if (subcategory) {
      const subcategoryIdNum = Number(subcategory);
      const beforeCount = filteredProducts.length;
      filteredProducts = filteredProducts.filter((item: any) => {
        // Check subcategory_id field (primary check)
        if (item.subcategory_id) {
          return String(item.subcategory_id) === subcategory || item.subcategory_id === subcategoryIdNum;
        }
        // Fallback: check if category object matches subcategory
        if (typeof item.category === 'object' && item.category?.id) {
          return String(item.category.id) === subcategory || item.category.id === subcategoryIdNum;
        }
        // Fallback: check category_id if it matches subcategory
        if (item.category_id) {
          return String(item.category_id) === subcategory || item.category_id === subcategoryIdNum;
        }
        return false;
      });
      console.log('After subcategory filter:', { beforeCount, afterCount: filteredProducts.length, subcategory, subcategoryIdNum });
    }
    
    // Apply price filter on frontend, plus stock unless out-of-stock is opted in.
    const finalProducts = filteredProducts.filter((item: any) => {
      const price = Number(item.price);
      if (priceMin && price < Number(priceMin)) return false;
      if (priceMax && price > Number(priceMax)) return false;
      if (!includeOutOfStock && Number(item.quantity) <= 0) return false;
      return true;
    });
    
    console.log('✅ Final products count:', finalProducts.length, { 
      search, 
      brand, 
      category,
      filteredCount: filteredProducts.length,
      finalCount: finalProducts.length
    })
    
    return finalProducts;
  }, [navigationState, search, searchData, brand, brandData, category, categoryData, subcategory, allData, priceMin, priceMax, brands, includeOutOfStock]);

  // Determine loading and error states based on active filters
  // When both search and brand are active, we use brandData, so wait for brandLoading
  const isLoading = (search && brand)
    ? brandLoading  // When both search and brand, we use brandData, so wait for brand to load
    : search 
    ? searchLoading 
    : category 
    ? categoryLoading 
    : brand 
    ? brandLoading 
    : allLoading;
  const error = (search && brand)
    ? brandError  // When both search and brand, check brandError
    : search 
    ? searchError 
    : category 
    ? categoryError 
    : brand 
    ? brandError 
    : allError;

  // Get category name from API if category is selected
  const categoryName = category ? categoryData?.category?.name || "Category" : ""

  // Get brand name from API if brand is selected
  const brandName = brand ? brandData?.brand?.name || "Brand" : ""

  // Handle category change
  const handleCategoryChange = (catId: string) => {
    const searchParams = new URLSearchParams(location.search)
    if (catId) {
      searchParams.set("category", catId)
    } else {
      searchParams.delete("category")
    }
    // Keep subcategory and brand for faceted filtering
    searchParams.delete("page") // Reset page when category changes
    navigate({ search: searchParams.toString() })
    // Don't close sidebar - allow multiple selections
  }

  // Handle subcategory change
  const handleSubcategoryChange = (subcatId: string) => {
    const searchParams = new URLSearchParams(location.search)
    if (subcatId) {
      searchParams.set("subcategory", subcatId)
    } else {
      searchParams.delete("subcategory")
    }
    // Keep category and brand for faceted filtering
    searchParams.delete("page") // Reset page when subcategory changes
    navigate({ search: searchParams.toString() })
    // Don't close sidebar - allow multiple selections
  }

  // Handle brand change - now uses brand code instead of brand ID
  const handleBrandChange = (brandCode: string) => {
    const searchParams = new URLSearchParams(location.search)
    if (brandCode) {
      searchParams.set("brand", brandCode) // Store brand code in URL (e.g., "D-001")
    } else {
      searchParams.delete("brand")
    }
    // Keep category and subcategory for faceted filtering
    searchParams.delete("page") // Reset page when brand changes
    navigate({ search: searchParams.toString() })
    // Close sidebar on mobile when brand is selected
    setIsSidebarOpen(false)
  }

  // Out-of-stock products are hidden by default; `in_stock=0` opts them back in.
  const handleIncludeOutOfStockChange = (next: boolean) => {
    const searchParams = new URLSearchParams(location.search)
    if (next) {
      searchParams.set("in_stock", "0")
    } else {
      searchParams.delete("in_stock")
    }
    searchParams.delete("page")
    navigate({ search: searchParams.toString() })
  }

  // Handle price filter change
  const handlePriceFilterChange = () => {
    const searchParams = new URLSearchParams(location.search)
    if (priceMin) {
      searchParams.set("price_min", priceMin)
    } else {
      searchParams.delete("price_min")
    }
    if (priceMax) {
      searchParams.set("price_max", priceMax)
    } else {
      searchParams.delete("price_max")
    }
    searchParams.delete("page") // Reset page when price filter changes
    navigate({ search: searchParams.toString() })
    // Don't close sidebar - allow multiple selections
  }

  // Determine if we're using frontend filtering (category/brand/subcategory selected)
  // Note: When search + brand is used, we filter search results on frontend
  const isFrontendFiltering = !!(category || brand || subcategory || (search && brand))
  
  // Calculate pagination
  // When filters are applied, we filter on frontend, so use filtered products length
  // When no filters, use server-side pagination (API handles pagination)
  let totalFilteredProducts = 0
  let totalPages = 1
  
  if (isFrontendFiltering) {
    // Frontend filtering: paginate filtered results
    totalFilteredProducts = products.length
    totalPages = totalFilteredProducts > 0 ? Math.ceil(totalFilteredProducts / limit) : 1
  } else {
    // Server-side pagination: use API total
    if (search) {
      // Use total from API response, not the current page's product count
      totalFilteredProducts = searchData?.total || 0
      totalPages = totalFilteredProducts > 0 ? Math.ceil(totalFilteredProducts / limit) : 1
    } else {
      totalFilteredProducts = allData?.total || 0
      totalPages = totalFilteredProducts > 0 ? Math.ceil(totalFilteredProducts / limit) : 1
    }
  }
  
  // Reset to page 1 if current page exceeds total pages (e.g., after filtering)
  // Only reset when filters change, not when user clicks pagination
  const prevFiltersRef = useRef<{ category: string; subcategory: string; brand: string; search: string }>({ 
    category, 
    subcategory, 
    brand, 
    search
  })
  
  useEffect(() => {
    const filtersChanged = 
      prevFiltersRef.current.category !== category ||
      prevFiltersRef.current.subcategory !== subcategory ||
      prevFiltersRef.current.brand !== brand ||
      prevFiltersRef.current.search !== search
    
    // Only reset if filters changed and current page is invalid
    if (filtersChanged) {
      // Read current page from URL to check if it's valid
      const currentPage = Number(new URLSearchParams(location.search).get("page") || 1)
      if (currentPage > totalPages && totalPages > 0) {
        const searchParams = new URLSearchParams(location.search)
        searchParams.delete("page")
        navigate({ search: searchParams.toString() }, { replace: true })
      }
      // Update ref with current filter values
      prevFiltersRef.current = { category, subcategory, brand, search }
    }
  }, [category, subcategory, brand, search, totalPages, navigate, location.search])
  
  // Slice products for current page only when using frontend filtering
  // When no filters, products are already paginated by the API
  const paginatedProducts = useMemo(() => {
    if (isFrontendFiltering) {
      // Frontend filtering: slice the filtered products array
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      return products.slice(startIndex, endIndex)
    } else {
      // Server-side pagination: use products directly (already paginated by API)
      return products
    }
  }, [products, page, limit, isFrontendFiltering])

  const handlePageChange = (newPage: number) => {
    // Prevent invalid page numbers
    if (newPage < 1 || (totalPages > 0 && newPage > totalPages)) {
      return
    }
    
    const searchParams = new URLSearchParams(location.search)
    if (newPage > 1) {
      searchParams.set("page", String(newPage))
    } else {
      searchParams.delete("page")
    }
    // Use replace: false to allow browser back/forward navigation
    navigate({ search: searchParams.toString() }, { replace: false })
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-16 py-6 sm:py-8 flex flex-col lg:flex-row gap-6 lg:gap-8">
      {/* Mobile Filter Button */}
      <div className="lg:hidden flex justify-end mb-4">
        <button
          className="flex items-center px-4 py-2 bg-[#1A74BB] text-white rounded-lg hover:bg-[#1A74BB] transition-colors duration-200 text-sm"
          onClick={() => setIsSidebarOpen(true)}
        >
          <Filter size={16} className="mr-2" />
          Filter Products
        </button>
      </div>

      {/* Sidebar - Desktop & Mobile Drawer */}
      <div
        className={`fixed inset-y-0 left-0 h-full w-64 bg-white z-50 shadow-lg transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:relative lg:h-auto lg:w-[197px] lg:flex-shrink-0 lg:translate-x-0 lg:overflow-visible lg:bg-transparent lg:shadow-none transition-transform duration-300 ease-in-out overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 lg:p-0">
          <div className="flex justify-between items-center mb-6 lg:hidden">
            <h3 className="font-semibold text-lg">Filters</h3>
            <button onClick={() => setIsSidebarOpen(false)} className="p-2 rounded-full hover:bg-gray-100">
              <X size={20} />
            </button>
          </div>

          <ProductFilters
            categories={categories.map((c: any) => ({ id: String(c.id), name: c.name }))}
            subcategories={subcategories.map((c: any) => ({ id: String(c.id), name: c.name }))}
            brands={brands.map((b: any) => ({ id: String(b.id), name: b.name, code: b.code }))}
            category={category}
            subcategory={subcategory}
            brand={brand}
            priceMin={priceMin}
            priceMax={priceMax}
            includeOutOfStock={includeOutOfStock}
            onCategoryChange={handleCategoryChange}
            onSubcategoryChange={handleSubcategoryChange}
            onBrandChange={handleBrandChange}
            onPriceMinChange={setPriceMin}
            onPriceMaxChange={setPriceMax}
            onPriceCommit={handlePriceFilterChange}
            onIncludeOutOfStockChange={handleIncludeOutOfStockChange}
          />
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" 
          onClick={(e) => {
            e.stopPropagation();
            setIsSidebarOpen(false);
          }} 
        />
      )}

      {/* Main Content */}
      <div className="flex-1">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center sm:text-left mb-2 sm:mb-0">
            {(() => {
              // Build heading based on active filters
              if (search && brand) {
                return `Search Results for "${search}" - ${brandName} Products`;
              } else if (search && category) {
                return `Search Results for "${search}" - ${categoryName}`;
              } else if (search) {
                return `Search Results for "${search}"`;
              } else if (brand && category) {
                return `${brandName} Products in ${categoryName}`;
              } else if (brand) {
                return `${brandName} Products`;
              } else if (category) {
                return `Products in ${categoryName}`;
              } else {
                return "All Products";
              }
            })()}
          </h2>
          {/* Add sorting/view mode toggles here if needed */}
        </div>

        {/* Product grid */}
        {isLoading && <div className="text-center py-8 text-gray-600">Loading products...</div>}
        {error && <div className="text-center py-8 text-red-500">Failed to load products.</div>}
        {!isLoading && !error && (
          <>
            <ProductGrid
              products={paginatedProducts.map((item: any) => ({
                id: item.id,
                name: item.name,
                price: Number(item.price),
                originalPrice: Number(item?.unit_price) || undefined,
                image: item.image_url || `${import.meta.env.VITE_REACT_APP_API_URI}/assets/uploads/${item.image}`,
                brand: typeof item.brand === "object" && item.brand ? (item.brand as any).name : item.brand || "Hamtos",
                inStock: Number(item?.quantity) > 0,
                isOnSale: false,
                rating: item.rating || 0,
                reviews: item.reviews || 0,
                netPrice: Number(item?.unit_price) || undefined,
                promoPrice: Number(item?.promo_price) || undefined,
                quantity: item.quantity || 0,
              }))}
              title=""
            />

            {/* Pagination */}
            {totalPages > 0 && (
              <div className="flex justify-center mt-6 sm:mt-8 space-x-1 sm:space-x-2 flex-wrap">
                <button
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-sm transition-colors duration-200 ${
                    page === 1
                      ? "bg-[#1A74BB] text-white cursor-not-allowed opacity-70"
                      : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pageNum = idx + 1
                  return (
                    <button
                      key={pageNum}
                      className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-sm transition-colors duration-200 ${
                        pageNum === page
                          ? "bg-[#1A74BB] text-white"
                          : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </button>
                  )
                })}

                <button
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-sm transition-colors duration-200 ${
                    page >= totalPages
                      ? "bg-[#1A74BB] text-white cursor-not-allowed opacity-70"
                      : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default ProductsPage
