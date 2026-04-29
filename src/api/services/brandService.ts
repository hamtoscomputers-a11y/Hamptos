import api from '../axios';
import { API_ENDPOINTS, buildPaginatedUrl } from '../endpoints';
import type {
  Brand,
  Product,
  PaginatedResponse,
  ProductQueryParams,
} from '../types';

export class BrandService {
  // Get all brands
  static async getBrands(params?: { limit?: number; start?: number }): Promise<PaginatedResponse<Brand>> {
    const url = buildPaginatedUrl(API_ENDPOINTS.BRANDS.BASE, params?.limit, params?.start);
    
    const response = await api.get(url);
    return response.data;
  }

  // Get products by brand code (brand parameter now contains brand code)
  static async getProductsByBrand(
    brandCode: string,
    params?: ProductQueryParams
  ): Promise<{
    brand: Brand;
    products: Product[];
    total: number;
    limit: number;
    start: number;
  }> {
    // CRITICAL: Build products URL with brand_code in the payload
    // The brandCode parameter is the brand code (e.g., "D-001")
    const productsParams: Record<string, any> = {
      include: params?.include,
    };

    // Always add brand_code to the query parameters
    if (brandCode) {
      productsParams.brand_code = brandCode;
      console.log(`✓ Adding brand_code=${brandCode} to products API request`);
    }
    
    const productsUrl = buildPaginatedUrl(
      API_ENDPOINTS.PRODUCTS.BASE,
      params?.limit || 1000,
      params?.start !== undefined ? params.start : 1,
      productsParams
    );
    
    // Log the final URL to verify brand_code is included
    console.log(`📡 Products API URL: ${productsUrl}`);
    console.log(`   Brand code included: ${brandCode ? 'YES ✓' : 'NO ✗'}`);
    
    const productsResponse = await api.get(productsUrl);
    const allProducts = productsResponse.data?.data || [];
    
    // Get brand info from brands endpoint to find brand by code
    let brand: Brand | undefined;
    try {
      const brandResponse = await api.get(API_ENDPOINTS.BRANDS.BASE);
      const brands = brandResponse.data?.data || [];
      brand = brands.find((b: any) => b.code === brandCode);
      
      if (brand) {
        console.log(`✓ Found brand for code ${brandCode}:`, { id: brand.id, name: brand.name });
      } else {
        console.warn(`⚠ Brand not found for code: ${brandCode}`);
      }
    } catch (e) {
      console.error('Could not fetch brand:', e);
    }
    
    return {
      brand: brand || { id: '', code: brandCode, name: 'Brand', slug: '' },
      products: allProducts, // Products are already filtered by backend using brand_code
      total: allProducts.length,
      limit: params?.limit || 100,
      start: params?.start || 0,
    };
  }
}

export default BrandService;

