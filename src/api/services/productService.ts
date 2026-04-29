import api from '../axios';
import { API_ENDPOINTS, buildPaginatedUrl, buildUrl } from '../endpoints';
import type {
  Product,
  PaginatedResponse,
  ProductQueryParams,
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

