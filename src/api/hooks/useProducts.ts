import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ProductService, BrandService } from '../services';
import type { ProductQueryParams, SearchQueryParams } from '../types';

export const useProducts = (params?: ProductQueryParams) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => ProductService.getProducts(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useProductByCode = (code: string, include?: string) => {
  return useQuery({
    queryKey: ['products', 'code', code, include],
    queryFn: () => ProductService.getProductByCode(code, include),
    enabled: !!code,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useProductById = (id: string, include?: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['products', 'id', id, include],
    queryFn: () => ProductService.getProductById(id, include),
    enabled: options?.enabled !== undefined ? options.enabled : !!id,
    staleTime: 0, // Always stale, always refetch on mount
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};

export const useFeaturedProducts = (params?: ProductQueryParams) => {
  return useQuery({
    queryKey: ['products', 'featured', params],
    queryFn: () => ProductService.getFeaturedProducts(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useLatestProducts = (limit: number = 10, days: number = 30, include?: string) => {
  return useQuery({
    queryKey: ['products', 'latest', limit, days, include],
    queryFn: () => ProductService.getLatestProducts(limit, days, include),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useBestSellers = (limit: number = 10, days: number = 90, include?: string) => {
  return useQuery({
    queryKey: ['products', 'best-sellers', limit, days, include],
    queryFn: () => ProductService.getBestSellers(limit, days, include),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useOnSaleProducts = (params?: ProductQueryParams) => {
  return useQuery({
    queryKey: ['products', 'on-sale', params],
    queryFn: () => ProductService.getOnSaleProducts(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useProductSearch = (params: SearchQueryParams) => {
  return useQuery({
    queryKey: ['products', 'search', params],
    queryFn: () => ProductService.search(params),
    enabled: !!params.q,
    staleTime: 0, // Always consider stale to ensure fresh data when params change (e.g., limit/start)
    refetchOnMount: true,
    // Hold the previous term's results on screen while the next ones load, so
    // changing the query swaps one set of products for another instead of
    // collapsing to a loading state and back. `isFetching` still reports the
    // refresh for callers that want to dim the stale rows.
    placeholderData: keepPreviousData,
  });
};

export const useSearchSuggestions = (
  query: string,
  limit: number = 10,
  type: 'all' | 'products' | 'categories' | 'brands' = 'all'
) => {
  return useQuery({
    queryKey: ['products', 'suggestions', query, limit, type],
    queryFn: () => ProductService.getSearchSuggestions(query, limit, type),
    enabled: !!query && query.length >= 2,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useWebsiteBrands = (options = {}) => {
  return useQuery({
    queryKey: ['website-brands'],
    queryFn: ProductService.getWebsiteBrands,
    ...options,
  });
};

export const useProductsByBrand = (brandCode: string, params?: ProductQueryParams) => {
  return useQuery({
    queryKey: ['products', 'brand', brandCode, params],
    queryFn: () => BrandService.getProductsByBrand(brandCode, params),
    enabled: !!brandCode,
    staleTime: 0, // Always refetch to ensure brand_code is in payload on every brand change
    refetchOnMount: true,
  });
};

export const useBrands = (params?: { limit?: number; start?: number }) => {
  return useQuery({
    queryKey: ['brands', params],
    queryFn: () => BrandService.getBrands(params),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}; 