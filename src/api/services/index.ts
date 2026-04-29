// Export all API services
export { default as UploadService } from './uploadService';
export { default as ProductService } from './productService';
export { default as CategoryService } from './categoryService';
export { default as CollectionService } from './collectionService';
export { default as HamtosService } from './hamtosService';
export { default as BrandService } from './brandService';

// Re-export types for convenience
export type {
  ApiResponse,
  PaginatedResponse,
  ApiError,
  PaginationParams,
  SearchParams,
  CreateRequest,
  UpdateRequest,
  DeleteRequest,
  FileUploadResponse,
  // HAMTOS specific types
  Product,
  Category,
  Brand,
  Collection,
  SearchResult,
  SearchSuggestion,
  SearchSuggestionsResponse,
  Sale,
  Purchase,
  Company,
  Warehouse,
  Quote,
  Transfer,
  ProductQueryParams,
  CategoryQueryParams,
  SearchQueryParams,
  CollectionQueryParams,
} from '../types';

// Re-export endpoints and utilities
export { API_ENDPOINTS, buildUrl, buildPaginatedUrl } from '../endpoints';
export { default as api } from '../axios'; 