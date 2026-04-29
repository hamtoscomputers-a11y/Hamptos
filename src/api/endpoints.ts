// API Endpoints configuration for HAMTOS
// This file centralizes all API endpoints for easy management

export const API_ENDPOINTS = {
  // Products API
  PRODUCTS: {
    BASE: '/api/v1/products',
    BY_CODE: (code: string) => `/api/v1/products/code/${code}`,
    BY_ID: (id: string) => `/api/v1/products/view/${id}`,
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