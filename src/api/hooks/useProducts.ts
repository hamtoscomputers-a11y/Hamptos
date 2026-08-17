import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ProductService, BrandService } from '../services';
import { getIndustryNews, getPromoBanners } from '../services/websiteService';
import type { ProductQueryParams, ProductReviewSubmission, SearchQueryParams } from '../types';

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

export const useProductBySlug = (slug: string, include?: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['products', 'slug', slug, include],
    queryFn: () => ProductService.getProductBySlug(slug, include),
    enabled: options?.enabled !== undefined ? options.enabled : !!slug,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};

/**
 * Accessory groups curated for a product. Cached for a while: the groups change
 * only when someone edits them in the ERP, and the product page already fires
 * several requests on load.
 */
export const useProductAccessories = (id: string) => {
  return useQuery({
    queryKey: ['products', 'accessories', id],
    queryFn: () => ProductService.getProductAccessories(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

/** Certification badges for a product. Changes only when the ERP is edited. */
export const useProductCertifications = (id: string) => {
  return useQuery({
    queryKey: ['products', 'certifications', id],
    queryFn: () => ProductService.getProductCertifications(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

/** Curated comparison products for the "Compare to Similar Items" table. */
export const useProductComparisons = (id: string) => {
  return useQuery({
    queryKey: ['products', 'comparisons', id],
    queryFn: () => ProductService.getProductComparisons(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * The Q&A pairs written for a product in the ERP. Cached like the other curated
 * sections — they change only when someone edits them.
 */
export const useProductQuestions = (id: string) => {
  return useQuery({
    queryKey: ['products', 'questions', id],
    queryFn: () => ProductService.getProductQuestions(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * The datasheets and manuals attached to a product in the ERP. Curated, so
 * cached like the sections above.
 */
export const useProductResources = (id: string) => {
  return useQuery({
    queryKey: ['products', 'resources', id],
    queryFn: () => ProductService.getProductResources(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * The configurator rows for a product. Its own call rather than an `include` on
 * the product, because the detail page is usually handed its product through
 * router state and never fetches it — an include would arrive only on a direct
 * URL open, so the buttons would come and go depending on how you got there.
 */
export const useProductOptions = (id: string) => {
  return useQuery({
    queryKey: ['products', 'options', id],
    queryFn: () => ProductService.getProductOptions(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Every written section of the product page in one request, keyed by section.
 *
 * One query rather than seven: they come from a single table and the page
 * draws them in one pass, so separate hooks would buy nothing but seven times
 * the latency and seven cache entries to invalidate together.
 */
export const useProductSections = (id: string) => {
  return useQuery({
    queryKey: ['products', 'sections', id],
    queryFn: () => ProductService.getProductSections(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * The trust band under the price. Mostly site-wide wording that changes maybe
 * twice a year, so it is cached longer than the per-product sections above.
 */
export const useTrustBadges = (id: string) => {
  return useQuery({
    queryKey: ['products', 'trust-badges', id],
    queryFn: () => ProductService.getTrustBadges(id),
    enabled: !!id,
    staleTime: 30 * 60 * 1000,
  });
};

/**
 * A product's approved reviews and their summary.
 *
 * Short `staleTime` compared with the curated sections above: reviews are
 * written by visitors rather than edited in the ERP, so a newly approved one
 * should appear without a hard refresh.
 */
export const useProductReviews = (id: string) => {
  return useQuery({
    queryKey: ['products', 'reviews', id],
    queryFn: () => ProductService.getProductReviews(id),
    enabled: !!id,
    staleTime: 60 * 1000,
  });
};

/**
 * Submits a review.
 *
 * The list is *not* invalidated on success. The ERP holds every submission for
 * approval, so refetching would return exactly what it returned before and make
 * it look as though the review had been dropped.
 */
export const useSubmitProductReview = () => {
  return useMutation({
    mutationFn: (review: ProductReviewSubmission) => ProductService.submitProductReview(review),
  });
};

export const useFeaturedProducts = (params?: ProductQueryParams) => {
  return useQuery({
    queryKey: ['products', 'featured', params],
    queryFn: () => ProductService.getFeaturedProducts(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * `options.enabled` lets a caller hold the request back until its section is
 * scrolled near — see useInViewOnce. Every "New X Collections" rail shares this
 * one cache entry, so the first rail to come into view fetches it for all of
 * them.
 */
export const useLatestProducts = (
  limit: number = 10,
  days: number = 30,
  include?: string,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ['products', 'latest', limit, days, include],
    queryFn: () => ProductService.getLatestProducts(limit, days, include),
    enabled: options?.enabled ?? true,
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

/**
 * The homepage slider images, which also feed the promo tiles and the banner.
 *
 * Through react-query rather than a `useEffect` so the one response serves
 * every consumer: StrictMode mounts effects twice in development, which fetched
 * the slider twice on every load, and leaving the page and coming back fetched
 * it again. Cached, that is one request.
 */
export const useWebsiteSlider = () => {
  return useQuery({
    queryKey: ['website-slider'],
    queryFn: ProductService.getWebsiteSlider,
  });
};

/**
 * The product page's artwork blocks, keyed by placement.
 *
 * One query for every block on the page: the mosaic and the strip are separate
 * components but share this cache entry, so they cost one request between them
 * rather than one each. Marketing artwork changes rarely, hence the long
 * `staleTime` — moving between products does not refetch it.
 */
export const usePromoBanners = () => {
  return useQuery({
    queryKey: ['website-promo-banners'],
    queryFn: getPromoBanners,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * The "Industry News & Insights" cards. One cache entry for the whole site —
 * they are the same on every product, so moving between products does not
 * refetch them.
 */
export const useIndustryNews = () => {
  return useQuery({
    queryKey: ['website-industry-news'],
    queryFn: getIndustryNews,
    staleTime: 10 * 60 * 1000,
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