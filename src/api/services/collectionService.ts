import api from '../axios';
import { API_ENDPOINTS, buildPaginatedUrl } from '../endpoints';
import type {
  Collection,
  CollectionQueryParams,
} from '../types';

export class CollectionService {
  // Get featured collection
  static async getFeaturedCollection(params?: CollectionQueryParams): Promise<Collection> {
    const url = buildPaginatedUrl(API_ENDPOINTS.COLLECTIONS.FEATURED, params?.limit, params?.start);
    
    const response = await api.get(url);
    return response.data;
  }

  // Get new arrivals collection
  static async getNewArrivalsCollection(
    limit: number = 10,
    days: number = 30
  ): Promise<Collection> {
    const url = buildPaginatedUrl(API_ENDPOINTS.COLLECTIONS.NEW_ARRIVALS, limit, 1, {
      days,
    });
    
    const response = await api.get(url);
    return response.data;
  }

  // Get best sellers collection
  static async getBestSellersCollection(
    limit: number = 10,
    days: number = 90
  ): Promise<Collection> {
    const url = buildPaginatedUrl(API_ENDPOINTS.COLLECTIONS.BEST_SELLERS, limit, 1, {
      days,
    });
    
    const response = await api.get(url);
    return response.data;
  }

  // Get on sale collection
  static async getOnSaleCollection(params?: CollectionQueryParams): Promise<Collection> {
    const url = buildPaginatedUrl(API_ENDPOINTS.COLLECTIONS.ON_SALE, params?.limit, params?.start);
    
    const response = await api.get(url);
    return response.data;
  }

  // Get collection by ID
  static async getCollectionById(id: string, limit: number = 10): Promise<Collection> {
    const url = buildPaginatedUrl(API_ENDPOINTS.COLLECTIONS.BY_ID(id), limit, 1);
    
    const response = await api.get(url);
    return response.data;
  }
}

export default CollectionService; 