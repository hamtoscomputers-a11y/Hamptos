import { useQuery } from '@tanstack/react-query';
import { CategoryService } from '../services';
import type { CategoryQueryParams } from '../types';

/**
 * The one set of arguments every consumer of the category tree asks for.
 *
 * The header and the Shop-by-Categories rail used to pass their own — `limit:
 * 20` against `limit: 100` — which made two react-query keys, and so two
 * requests, for a response that comes back byte-identical either way: the ERP
 * ignores `limit` on the tree endpoint and always returns all 28 categories.
 * Sharing one frozen object keeps the keys identical, so whichever mounts
 * second reads the first one's cache instead of opening a second request.
 */
export const CATEGORY_TREE_PARAMS: CategoryQueryParams = Object.freeze({
  limit: 100,
  start: 1,
  include_products: true,
});

export const useCategories = (params?: CategoryQueryParams, options = {}) => {
  return useQuery({
    queryKey: ['categories', params],
    queryFn: () => CategoryService.getCategories(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

export const useProductsByCategory = (
  categoryId: string,
  params?: {
    limit?: number;
    start?: number;
    include?: string;
    search?: string;
    order_by?: string;
    parent_id?: string;
  }
) => {
  return useQuery({
    queryKey: ['categories', 'products', categoryId, params],
    queryFn: () => CategoryService.getProductsByCategory(categoryId, params),
    enabled: !!categoryId,
    staleTime: 0, // Always consider data stale to ensure fresh fetches when filters change
    refetchOnMount: true, // Refetch when component mounts
    refetchOnWindowFocus: false, // Don't refetch on window focus to avoid unnecessary calls
  });
};


  