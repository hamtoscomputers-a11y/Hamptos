import api from '../axios';
import { API_ENDPOINTS, buildPaginatedUrl, buildUrl } from '../endpoints';
import { getDeviceToken } from '../utils';
import type {
  AccessoryGroup,
  Certification,
  ComparisonProduct,
  Product,
  PaginatedResponse,
  ProductQueryParams,
  ProductQuestion,
  ProductReviewApi,
  ProductReviewsResponse,
  ProductReviewSubmission,
  SearchQueryParams,
  SearchResult,
  SearchSuggestionsResponse,
} from '../types';

export class ProductService {
  // Get all products
  static async getProducts(params?: ProductQueryParams): Promise<PaginatedResponse<Product>> {
    const url = buildPaginatedUrl(API_ENDPOINTS.PRODUCTS.BASE, params?.limit, params?.start, {
      include: params?.include,
    });
    
    const response = await api.get(url);
    return response.data;
  }

  // Get product by code
  static async getProductByCode(code: string, include?: string): Promise<Product> {
    const url = buildUrl(API_ENDPOINTS.PRODUCTS.BY_CODE(code), {
      include,
    });
    
    const response = await api.get(url);
    return response.data.data || response.data;
  }

  // Get product by ID
  static async getProductById(id: string, include?: string): Promise<Product> {
    const url = buildUrl(API_ENDPOINTS.PRODUCTS.BY_ID(id), {
      include,
    });
    
    const response = await api.get(url);
    return response.data.data || response.data;
  }

  /**
   * Accessory groups curated in the ERP for one product. Its own call rather
   * than an `include` on the product, because the detail page usually receives
   * its product through router state and never fetches it.
   */
  static async getProductAccessories(id: string): Promise<AccessoryGroup[]> {
    const response = await api.get(API_ENDPOINTS.PRODUCTS.ACCESSORIES(id));
    return response.data?.data || [];
  }

  /** Quality certification badges assigned to a product in the ERP. */
  static async getProductCertifications(id: string): Promise<Certification[]> {
    const response = await api.get(API_ENDPOINTS.PRODUCTS.CERTIFICATIONS(id));
    return response.data?.data || [];
  }

  /** Products curated as the comparison table's columns. */
  static async getProductComparisons(id: string): Promise<ComparisonProduct[]> {
    const response = await api.get(API_ENDPOINTS.PRODUCTS.COMPARISONS(id));
    return response.data?.data || [];
  }

  /**
   * The Q&A pairs written for a product in the ERP.
   *
   * Shape-checked for the same reason as the reviews below: until this endpoint
   * is deployed, the ERP answers it with the product catalogue at HTTP 200, and
   * a catalogue row has neither a question nor an answer on it.
   */
  static async getProductQuestions(id: string): Promise<ProductQuestion[]> {
    const response = await api.get(API_ENDPOINTS.PRODUCTS.QUESTIONS(id));
    const rows: unknown[] = Array.isArray(response.data?.data) ? response.data.data : [];

    return rows.filter(
      (row): row is ProductQuestion =>
        !!row &&
        typeof row === 'object' &&
        typeof (row as ProductQuestion).question === 'string' &&
        typeof (row as ProductQuestion).answer === 'string',
    );
  }

  /**
   * A product's approved reviews and their summary.
   *
   * The summary comes back with the list rather than being derived from it: the
   * page returns the newest handful, and counting the bars from those would
   * show a histogram of the last five reviews instead of all of them.
   *
   * Every row is checked for the fields a review actually has, rather than
   * trusted because the request returned 200. The ERP's REST layer falls back
   * to `index_get` when a method it does not have is asked for, so a backend
   * without this endpoint deployed answers `/products/reviews/65` with the
   * *product catalogue* — 200, `{data: [...]}`, and not one rating in it.
   * Mapping that blindly took the whole product page down.
   */
  static async getProductReviews(id: string, limit = 20): Promise<ProductReviewsResponse> {
    const response = await api.get(buildUrl(API_ENDPOINTS.PRODUCTS.REVIEWS(id), { limit }));

    const rows: unknown[] = Array.isArray(response.data?.data) ? response.data.data : [];
    const data = rows.filter(
      (row): row is ProductReviewApi =>
        !!row &&
        typeof row === 'object' &&
        typeof (row as ProductReviewApi).author === 'string' &&
        Number.isFinite(Number((row as ProductReviewApi).rating)),
    );

    // Only trusted alongside rows that survived the check — a summary from a
    // response that was not this endpoint's would put a count on an empty list.
    const summary = response.data?.summary;
    const usable = data.length === rows.length && summary && typeof summary === 'object';

    return {
      data,
      summary: usable
        ? summary
        : { average: null, total: data.length, counts: { '5': 0, '4': 0, '3': 0, '2': 0, '1': 0 } },
    };
  }

  /**
   * Submits a review. It is queued for approval in the ERP, so the caller must
   * not expect it to turn up in `getProductReviews` afterwards.
   *
   * The device token goes along so the ERP can refuse a second review of the
   * same product from the same browser.
   */
  static async submitProductReview(review: ProductReviewSubmission): Promise<{ status: boolean; message: string }> {
    const response = await api.post(API_ENDPOINTS.PRODUCTS.SUBMIT_REVIEW, {
      ...review,
      device_token: getDeviceToken(),
    });
    return response.data;
  }

  // Get featured products
  static async getFeaturedProducts(params?: ProductQueryParams): Promise<PaginatedResponse<Product>> {
    const url = buildPaginatedUrl(API_ENDPOINTS.PRODUCTS.FEATURED, params?.limit, params?.start, {
      include: params?.include,
    });
    
    const response = await api.get(url);
    return response.data;
  }

  // Get latest products
  static async getLatestProducts(
    limit: number = 10,
    days: number = 30,
    include?: string
  ): Promise<PaginatedResponse<Product>> {
    const url = buildPaginatedUrl(API_ENDPOINTS.PRODUCTS.LATEST, limit, 1, {
      days,
      include,
    });
    
    const response = await api.get(url);
    return response.data;
  }

  // Get best sellers
  static async getBestSellers(
    limit: number = 10,
    days: number = 90,
    include?: string
  ): Promise<PaginatedResponse<Product>> {
    const url = buildPaginatedUrl(API_ENDPOINTS.PRODUCTS.BEST_SELLERS, limit, 1, {
      days,
      include,
    });
    
    const response = await api.get(url);
    return response.data;
  }

  // Get on sale products
  static async getOnSaleProducts(params?: ProductQueryParams): Promise<PaginatedResponse<Product>> {
    const url = buildPaginatedUrl(API_ENDPOINTS.PRODUCTS.ON_SALE, params?.limit, params?.start, {
      include: params?.include,
    });
    
    const response = await api.get(url);
    return response.data;
  }

  // Search products, categories & brands
  static async search(params: SearchQueryParams): Promise<SearchResult> {
    const url = buildPaginatedUrl(API_ENDPOINTS.PRODUCTS.SEARCH, params.limit, params.start, {
      q: params.q,
      type: params.type,
      include: params.include,
    });
    
    const response = await api.get(url);
    return response.data;
  }

  // Get search suggestions
  static async getSearchSuggestions(
    query: string,
    limit: number = 10,
    type: 'all' | 'products' | 'categories' | 'brands' = 'all'
  ): Promise<SearchSuggestionsResponse> {
    const url = buildPaginatedUrl(API_ENDPOINTS.PRODUCTS.SUGGESTIONS, limit, 1, {
      q: query,
      type,
    });
    
    const response = await api.get(url);
    return response.data;
  }
  static async getWebsiteSlider() {
    const response = await api.get('/api/v1/website/slider');
    return response.data;
  }
  static async getWebsiteBrands() {
    const response = await api.get('/api/v1/website/brands');
    return response.data;
  }
}

export default ProductService; 

