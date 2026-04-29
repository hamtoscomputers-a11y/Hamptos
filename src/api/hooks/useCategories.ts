import { useQuery } from '@tanstack/react-query';
import { CategoryService } from '../services';
import type { CategoryQueryParams } from '../types';

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


  