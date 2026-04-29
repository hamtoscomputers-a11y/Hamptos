import api from '../axios';
import { API_ENDPOINTS, buildPaginatedUrl } from '../endpoints';
import type {
  Category,
  Product,
  PaginatedResponse,
  CategoryQueryParams,
} from '../types';

export class CategoryService {
  // Get all categories
  static async getCategories(params?: CategoryQueryParams): Promise<{ data: Category[]; total: number }> {
    // Use the new endpoint with tree and include_products always true
    let url = '/api/v1/categories?tree=true&include_products=true';
    // If there are additional params, append them
    if (params) {
      const searchParams = new URLSearchParams();
      if (params.limit) searchParams.append('limit', String(params.limit));
      if (params.start) searchParams.append('start', String(params.start));
      // Add any other params as needed
      // ...
      const extra = searchParams.toString();
      if (extra) url += `&${extra}`;
    }
    const response = await api.get(url);
    return response.data;
  }

  // Get products by category
  static async getProductsByCategory(
    categoryId: string,
    params?: {
      limit?: number;
      start?: number;
      include?: string;
      search?: string;
      order_by?: string;
      parent_id?: string; // <-- already present
    }
  ): Promise<{
    category: Category;
    products: Product[];
    total: number;
    limit: number;
    start: number;
  }> {
    // Build query params object, only including parent_id if present
    const queryParams: Record<string, string | number | undefined> = {
      include: params?.include,
      search: params?.search,
      order_by: params?.order_by,
    };
    if (params?.parent_id) {
      queryParams.parent_id = params.parent_id;
    }

    const url = buildPaginatedUrl(
      API_ENDPOINTS.CATEGORIES.PRODUCTS(categoryId),
      params?.limit,
      params?.start,
      queryParams
    );

    const response = await api.get(url);
    return response.data;
  }
 
}

export default CategoryService; 