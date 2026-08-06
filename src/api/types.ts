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
  /** Short summary for the storefront's "Product Overview" heading. */
  overview?: string;
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

/** One product recommended as an accessory, flattened by the API's join. */
export interface AccessoryProduct {
  id: string;
  code: string;
  name: string;
  slug: string;
  price: string;
  promotion?: string;
  promo_price?: string;
  start_date?: string;
  end_date?: string;
  quantity: string;
  image?: string;
  image_url?: string;
  brand_id?: string;
  brand_name?: string;
  category_id?: string;
  category_name?: string;
}

/**
 * An accessory group. `name` is free text typed by the admin and is what the
 * storefront shows as a tab label, so there is no fixed set of these.
 */
export interface AccessoryGroup {
  name: string;
  products: AccessoryProduct[];
}

/** A quality certification badge. `image_url` is null when no logo was uploaded. */
export interface Certification {
  id: string;
  name: string;
  image?: string | null;
  image_url?: string | null;
}

/**
 * A curated comparison product. Same join as an accessory, plus the specs the
 * comparison table reads — accessories omit `key_information` to stay light.
 */
export interface ComparisonProduct extends AccessoryProduct {
  key_information?: string;
}

/**
 * One artwork block on the product page, from the ERP's Promo Banners.
 *
 * The mosaic's tiles carry their copy inside the artwork, so `heading`,
 * `subheading` and `button_label` come back null for them and `tags` empty.
 * The strip uses all of it.
 */
export interface PromoBanner {
  id: number;
  image: string | null;
  alt: string | null;
  link: string | null;
  heading: string | null;
  subheading: string | null;
  button_label: string | null;
  tags: string[];
}

/** Banners keyed by the block they belong to. A block with none is absent. */
export interface PromoBannersByPlacement {
  product_mosaic?: PromoBanner[];
  product_strip?: PromoBanner[];
}

/**
 * One approved review. The reviewer's email is deliberately not part of this —
 * the ERP holds it for moderation and never puts it in the response.
 */
export interface ProductReviewApi {
  id: number;
  author: string;
  rating: number;
  title: string | null;
  body: string | null;
  /** True when the email given matched a customer invoiced for this product. */
  verified_buyer: boolean;
  /** `YYYY-MM-DD HH:MM:SS`, the ERP's own format. */
  created_at: string;
}

/**
 * Counts across *every* approved review, not just the page returned alongside
 * it — the summary says "44 Reviews" while the list shows five.
 */
export interface ProductReviewSummary {
  /** Null when there are no reviews, so "unrated" is distinguishable from 0. */
  average: number | null;
  total: number;
  counts: Record<'1' | '2' | '3' | '4' | '5', number>;
}

export interface ProductReviewsResponse {
  data: ProductReviewApi[];
  summary: ProductReviewSummary;
}

/**
 * One published Q&A pair. Unanswered questions are filtered out by the ERP, so
 * `answer` is always present here.
 */
export interface ProductQuestion {
  id: number;
  question: string;
  answer: string;
}

/**
 * One downloadable file under "Resources Downloads". The ERP resolves the
 * upload-or-link choice, so `url` is always ready to use.
 */
export interface ProductResource {
  id: number;
  /** The grey heading above the row, e.g. "Support and Resources". */
  label: string;
  /** The link text, e.g. "Datasheet.pdf". */
  title: string;
  url: string;
  /** True for a file the ERP holds; false for a link to another site. */
  hosted: boolean;
  /** Bytes. Null for external links, whose size the ERP cannot know. */
  size: number | null;
}

/** One button in a configurator row. */
export interface ProductOption {
  id: number;
  /** The button label, e.g. "Original New", "None", "R3K00A". */
  name: string;
  /** Added to the product price when picked. 0 for a free choice. */
  price: number;
}

/** One labelled row of buttons, e.g. "Wall Mounting Bracket". */
export interface ProductOptionGroup {
  name: string;
  options: ProductOption[];
}

/** One badge on the pale-blue trust band under the price. */
export interface TrustBadge {
  id: number;
  /** Icon key the storefront maps to a Lucide component; unknown draws a shield. */
  icon: string;
  /** The bold line, e.g. "3 Years Warranty". */
  title: string;
  /** The grey line under it. May be empty. */
  subtitle: string;
}

/** What the "Write a review" form sends. */
export interface ProductReviewSubmission {
  product_id: string | number;
  rating: number;
  author: string;
  email?: string;
  title?: string;
  body?: string;
}

/** One "Industry News & Insights" card. */
export interface IndustryNewsItem {
  id: number;
  image: string | null;
  alt: string | null;
  title: string;
  excerpt: string | null;
  link: string | null;
  /** `YYYY-MM-DD`, or null when it was left blank. */
  published_at: string | null;
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