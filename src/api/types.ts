// Common API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  limit: number;
  start: number;
}

// Error types
export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

// Common request types
export interface PaginationParams {
  limit?: number;
  start?: number;
  page?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SearchParams extends PaginationParams {
  search?: string;
  filters?: Record<string, any>;
}

// Product types
export interface Product {
  id: string;
  code: string;
  name: string;
  slug: string;
  details?: string;
  cost: string;
  price: string;
  promo_price?: string;
  promotion?: string;
  quantity: string;
  alert_quantity: string;
  image: string;
  image_url?: string;
  type: 'standard' | 'combo' | 'digital' | 'service';
  unit: string;
  barcode_symbology: string;
  tax_method: string;
  tax_rate: string;
  hsn_code?: string;
  category_id: string;
  brand?: string;
  warehouse?: string;
  photos?: ProductPhoto[];
  brand_data?: Brand;
  category_data?: Category;
}

export interface ProductPhoto {
  id: string;
  product_id: string;
  photo: string;
  photo_url: string;
}

// Category types
export interface Category {
  id: string;
  code: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  image_url?: string;
  parent_id: string;
  product_count?: string;
  children?: Category[]; // For nested categories
}

// Brand types
export interface Brand {
  id: string | number;
  code: string;
  name: string;
  slug: string;
  image?: string;
  image_url?: string;
  description?: string;
  product_count?: number | string;
}

// Collection types
export interface Collection {
  id: number;
  slug: string;
  name: string;
  description: string;
  products: Product[];
  total: number;
  limit: number;
  start: number;
}

// Search types
export interface SearchResult {
  query: string;
  results: {
    products: Product[];
    categories: Category[];
    brands: Brand[];
  };
  total: number;
  limit: number;
  start: number;
  type: string;
}

export interface SearchSuggestion {
  id: string;
  text: string;
  code: string;
  slug: string;
  type: 'product' | 'category' | 'brand';
  price?: string;
  promo_price?: string;
  image_url?: string;
}

export interface SearchSuggestionsResponse {
  query: string;
  suggestions: SearchSuggestion[];
  total: number;
  type: string;
}

// Sales types
export interface Sale {
  id: string;
  reference_no: string;
  customer_id: string;
  customer_name: string;
  total: string;
  paid: string;
  grand_total: string;
  sale_status: string;
  payment_status: string;
  created_at: string;
  updated_at: string;
}

// Purchase types
export interface Purchase {
  id: string;
  reference_no: string;
  supplier_id: string;
  supplier_name: string;
  total: string;
  paid: string;
  grand_total: string;
  purchase_status: string;
  payment_status: string;
  created_at: string;
  updated_at: string;
}

// Company types
export interface Company {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  group_id: string;
  group_name: string;
  created_at: string;
  updated_at: string;
}

// Warehouse types
export interface Warehouse {
  id: string;
  code: string;
  name: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;
  email: string;
  created_at: string;
  updated_at: string;
}

// Quote types
export interface Quote {
  id: string;
  reference_no: string;
  customer_id: string;
  customer_name: string;
  total: string;
  grand_total: string;
  status: string;
  created_at: string;
  updated_at: string;
}

// Transfer types
export interface Transfer {
  id: string;
  reference_no: string;
  from_warehouse_id: string;
  from_warehouse_name: string;
  to_warehouse_id: string;
  to_warehouse_name: string;
  total: string;
  grand_total: string;
  status: string;
  created_at: string;
  updated_at: string;
}

// Generic CRUD types
export interface CreateRequest<T> {
  data: Partial<T>;
}

export interface UpdateRequest<T> {
  id: string;
  data: Partial<T>;
}

export interface DeleteRequest {
  id: string;
}

// File upload types
export interface FileUploadResponse {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

// API Query Parameters
export interface ProductQueryParams extends PaginationParams {
  include?: string; // brand,category,photos,sub_units
  price_min?: string;
  price_max?: string;
}

export interface CategoryQueryParams extends PaginationParams {
  include_products?: boolean;
  parent_id?: string;
  price_min?: string;
  price_max?: string;
}

export interface SearchQueryParams extends PaginationParams {
  q: string; // search query (required)
  type?: 'all' | 'products' | 'categories' | 'brands';
  include?: string;
}

export interface CollectionQueryParams extends PaginationParams {
  days?: number; // for latest/best-sellers collections
} 