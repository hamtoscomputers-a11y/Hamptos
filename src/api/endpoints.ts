// API Endpoints configuration for HAMTOS
// This file centralizes all API endpoints for easy management

export const API_ENDPOINTS = {
  // Products API
  PRODUCTS: {
    BASE: '/api/v1/products',
    BY_CODE: (code: string) => `/api/v1/products/code/${code}`,
    BY_ID: (id: string) => `/api/v1/products/view/${id}`,
    // Storefront URL slug: name-slug from createSlug, or the ERP code/slug.
    BY_SLUG: (slug: string) => `/api/v1/products/slug/${encodeURIComponent(slug)}`,
    // Admin-curated accessory recommendations, already grouped — each group is
    // a tab in the "Shop Bundles or Accessories" section.
    ACCESSORIES: (id: string) => `/api/v1/products/accessories/${id}`,
    // Quality certification badges assigned to the product.
    CERTIFICATIONS: (id: string) => `/api/v1/products/certifications/${id}`,
    // Products curated as columns of "Compare to Similar Items".
    COMPARISONS: (id: string) => `/api/v1/products/comparisons/${id}`,
    // Approved customer reviews, with the summary the histogram is drawn from.
    REVIEWS: (id: string) => `/api/v1/products/reviews/${id}`,
    // Published Q&A pairs, written in the ERP under Products → Questions & Answers.
    QUESTIONS: (id: string) => `/api/v1/products/questions/${id}`,
    // Datasheets and manuals, from Products → Resources & Downloads.
    RESOURCES: (id: string) => `/api/v1/products/resources/${id}`,
    // The configurator rows — Condition, Wall Mounting Bracket, Power Adaptor —
    // grouped by heading, from Products → Product Options.
    OPTIONS: (id: string) => `/api/v1/products/options/${id}`,
    // The pale-blue band under the price. Answers with the product's own badges
    // when it has any, otherwise the site-wide set — so one request either way.
    TRUST_BADGES: (id: string) => `/api/v1/products/trust_badges/${id}`,
    // The written sections typed under the product's Page Content tab — Why
    // Choose This Product, Features & Capabilities, Use Cases, Who Is This
    // Product For, the price paragraph, Availability and Support. All of them
    // in one response, grouped by section, because the page draws in one pass.
    SECTIONS: (id: string) => `/api/v1/products/sections/${id}`,
    // Submitting one. It is held for approval in the ERP, so nothing posted
    // here appears in the list above until someone lets it through.
    SUBMIT_REVIEW: '/api/v1/products/reviews',
    FEATURED: '/api/v1/products/featured',
    LATEST: '/api/v1/products/latest',
    BEST_SELLERS: '/api/v1/products/best-sellers',
    ON_SALE: '/api/v1/products/on-sale',
    SEARCH: '/api/v1/products/search',
    SUGGESTIONS: '/api/v1/products/suggestions',
  },

  // Categories API
  CATEGORIES: {
    BASE: '/api/v1/products/categories',
    PRODUCTS: (categoryId: string) => `/api/v1/products/category_products/${categoryId}`,
    SUB_CATEGORIES: (categoryId: string, parent_id: string) => `/api/v1/categories/${categoryId}/products?parent_id=${parent_id}`,
  },

  // Collections API
  COLLECTIONS: {
    FEATURED: '/api/v1/products/collections/featured',
    NEW_ARRIVALS: '/api/v1/products/collections/new-arrivals',
    BEST_SELLERS: '/api/v1/products/collections/best-sellers',
    ON_SALE: '/api/v1/products/collections/on-sale',
    BY_ID: (id: string) => `/api/v1/products/collections/${id}`,
  },

  // Sales API
  SALES: {
    BASE: '/api/v1/sales',
    BY_REFERENCE: (reference: string) => `/api/v1/sales/reference/${reference}`,
  },

  // Purchases API
  PURCHASES: {
    BASE: '/api/v1/purchases',
    BY_REFERENCE: (reference: string) => `/api/v1/purchases/reference/${reference}`,
  },

  // Companies API
  COMPANIES: {
    BY_GROUP: (group: string) => `/api/v1/companies/group/${group}`,
    BY_NAME: (name: string) => `/api/v1/companies/name/${name}`,
  },

  // Brands API
  BRANDS: {
    BASE: '/api/v1/brands',
    PRODUCTS: (brandId: string) => `/api/v1/brands/${brandId}/products`,
  },

  // Warehouses API
  WAREHOUSES: {
    BASE: '/api/v1/warehouses',
    BY_CODE: (code: string) => `/api/v1/warehouses/code/${code}`,
  },

  // Quotes API
  QUOTES: {
    BASE: '/api/v1/quotes',
    BY_REFERENCE: (reference: string) => `/api/v1/quotes/reference/${reference}`,
  },

  // Transfers API
  TRANSFERS: {
    BASE: '/api/v1/transfers',
    BY_REFERENCE: (reference: string) => `/api/v1/transfers/reference/${reference}`,
  },

  // File upload
  UPLOAD: {
    IMAGE: '/upload/image',
    FILE: '/upload/file',
    MULTIPLE: '/upload/multiple',
  },

  WEBSITE: {
    SEND_CONTACT: '/api/v1/website/send_contact',
    // Artwork blocks managed in the ERP under Front End → Promo Banners.
    // Without `?placement=` the response is keyed by placement, so the product
    // page takes the mosaic and the strip in one request.
    PROMO_BANNERS: '/api/v1/website/promo_banners',
    // "Industry News & Insights" cards. Site-wide, not per product — the same
    // cards run under every product page.
    INDUSTRY_NEWS: '/api/v1/website/industry_news',
  },

  // Saved products. Keyed on a token the browser keeps, not on a customer —
  // the storefront has no login for the ERP to identify anyone by.
  WISHLIST: {
    BASE: '/api/v1/wishlist',
    ADD: '/api/v1/wishlist/add',
    REMOVE: '/api/v1/wishlist/remove',
    CLEAR: '/api/v1/wishlist/clear',
  },
} as const;

// Helper function to build URL with query parameters
export const buildUrl = (endpoint: string, params?: Record<string, any>): string => {
  if (!params) return endpoint;
  
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });
  
  const queryString = searchParams.toString();
  return queryString ? `${endpoint}?${queryString}` : endpoint;
};

// Helper function to build paginated URL for HAMTOS API
export const buildPaginatedUrl = (
  endpoint: string, 
  limit: number = 10, 
  start: number = 1,
  additionalParams?: Record<string, any>
): string => {
  const params = {
    limit,
    start,
    ...additionalParams,
  };
  
  return buildUrl(endpoint, params);
};

export default API_ENDPOINTS; 