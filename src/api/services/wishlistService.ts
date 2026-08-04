import api from '../axios';
import { API_ENDPOINTS } from '../endpoints';
import { getDeviceToken } from '../utils';

/**
 * A saved product as the ERP returns it.
 *
 * The list endpoint joins the product in, so a card renders from this alone —
 * a wishlist is read far more often than written, and fetching each product
 * separately would be a request per row.
 */
export interface WishlistApiItem {
  wishlist_id: string;
  created_at: string | null;
  id: string;
  code: string;
  name: string;
  slug: string;
  price: string;
  promotion: string | null;
  promo_price: string | null;
  quantity: string;
  image: string | null;
  image_url: string;
  brand_name: string | null;
  brand_id: string | null;
}

interface WishlistResponse {
  status: boolean;
  data: WishlistApiItem[];
  total: number;
}

interface WishlistMutationResponse {
  status: boolean;
  message: string;
  total: number;
}

export const WishlistService = {
  async list(): Promise<WishlistApiItem[]> {
    const response = await api.get<WishlistResponse>(API_ENDPOINTS.WISHLIST.BASE, {
      params: { device_token: getDeviceToken() },
    });
    return response.data?.data ?? [];
  },

  async add(productId: number | string): Promise<WishlistMutationResponse> {
    const response = await api.post<WishlistMutationResponse>(API_ENDPOINTS.WISHLIST.ADD, {
      device_token: getDeviceToken(),
      product_id: productId,
    });
    return response.data;
  },

  async remove(productId: number | string): Promise<WishlistMutationResponse> {
    const response = await api.post<WishlistMutationResponse>(API_ENDPOINTS.WISHLIST.REMOVE, {
      device_token: getDeviceToken(),
      product_id: productId,
    });
    return response.data;
  },

  async clear(): Promise<WishlistMutationResponse> {
    const response = await api.post<WishlistMutationResponse>(API_ENDPOINTS.WISHLIST.CLEAR, {
      device_token: getDeviceToken(),
    });
    return response.data;
  },
};

export default WishlistService;
