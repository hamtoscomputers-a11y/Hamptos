import api from '../axios';
import { API_ENDPOINTS } from '../endpoints';
import type { PromoBannersByPlacement } from '../types';

export interface QuoteRequestPayload {
  first_name: string;
  last_name: string;
  email: string;
  description: string;
}

export const sendContactQuote = async (payload: QuoteRequestPayload) => {
  const response = await api.post(API_ENDPOINTS.WEBSITE.SEND_CONTACT, payload);
  return response.data;
};

/** Every promo block in one request, keyed by placement. */
export const getPromoBanners = async (): Promise<PromoBannersByPlacement> => {
  const response = await api.get(API_ENDPOINTS.WEBSITE.PROMO_BANNERS);
  return response.data?.data ?? {};
};
