import api from '../axios';
import { API_ENDPOINTS, buildPaginatedUrl } from '../endpoints';
import type {
  Sale,
  Purchase,
  Company,
  Warehouse,
  Quote,
  Transfer,
  PaginatedResponse,
} from '../types';

export class HamtosService {
  // Sales API
  static async getSales(limit: number = 10): Promise<PaginatedResponse<Sale>> {
    const url = buildPaginatedUrl(API_ENDPOINTS.SALES.BASE, limit, 1);
    const response = await api.get(url);
    return response.data;
  }

  static async getSaleByReference(reference: string): Promise<Sale> {
    const response = await api.get(API_ENDPOINTS.SALES.BY_REFERENCE(reference));
    return response.data;
  }

  // Purchases API
  static async getPurchases(limit: number = 10): Promise<PaginatedResponse<Purchase>> {
    const url = buildPaginatedUrl(API_ENDPOINTS.PURCHASES.BASE, limit, 1);
    const response = await api.get(url);
    return response.data;
  }

  static async getPurchaseByReference(reference: string): Promise<Purchase> {
    const response = await api.get(API_ENDPOINTS.PURCHASES.BY_REFERENCE(reference));
    return response.data;
  }

  // Companies API
  static async getCompaniesByGroup(group: string, limit: number = 10): Promise<PaginatedResponse<Company>> {
    const url = buildPaginatedUrl(API_ENDPOINTS.COMPANIES.BY_GROUP(group), limit, 1);
    const response = await api.get(url);
    return response.data;
  }

  static async getCompanyByName(name: string): Promise<Company> {
    const response = await api.get(API_ENDPOINTS.COMPANIES.BY_NAME(name));
    return response.data;
  }

  // Warehouses API
  static async getWarehouses(limit: number = 10): Promise<PaginatedResponse<Warehouse>> {
    const url = buildPaginatedUrl(API_ENDPOINTS.WAREHOUSES.BASE, limit, 1);
    const response = await api.get(url);
    return response.data;
  }

  static async getWarehouseByCode(code: string): Promise<Warehouse> {
    const response = await api.get(API_ENDPOINTS.WAREHOUSES.BY_CODE(code));
    return response.data;
  }

  // Quotes API
  static async getQuotes(limit: number = 10): Promise<PaginatedResponse<Quote>> {
    const url = buildPaginatedUrl(API_ENDPOINTS.QUOTES.BASE, limit, 1);
    const response = await api.get(url);
    return response.data;
  }

  static async getQuoteByReference(reference: string): Promise<Quote> {
    const response = await api.get(API_ENDPOINTS.QUOTES.BY_REFERENCE(reference));
    return response.data;
  }

  // Transfers API
  static async getTransfers(limit: number = 10): Promise<PaginatedResponse<Transfer>> {
    const url = buildPaginatedUrl(API_ENDPOINTS.TRANSFERS.BASE, limit, 1);
    const response = await api.get(url);
    return response.data;
  }

  static async getTransferByReference(reference: string): Promise<Transfer> {
    const response = await api.get(API_ENDPOINTS.TRANSFERS.BY_REFERENCE(reference));
    return response.data;
  }
}

export default HamtosService; 