import api from '../axios';
import { API_ENDPOINTS } from '../endpoints';
import type { IndustryNewsItem, PromoBannersByPlacement } from '../types';

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

/**
 * The news cards, newest-first within the order set in the ERP.
 *
 * Shape-checked like the other new endpoints: until this is deployed the ERP
 * answers with something else entirely at HTTP 200, and a row without a title
 * is not a news card.
 */
export const getIndustryNews = async (): Promise<IndustryNewsItem[]> => {
  const response = await api.get(API_ENDPOINTS.WEBSITE.INDUSTRY_NEWS);
  const rows: unknown[] = Array.isArray(response.data?.data) ? response.data.data : [];

  return rows.filter(
    (row): row is IndustryNewsItem =>
      !!row && typeof row === 'object' && typeof (row as IndustryNewsItem).title === 'string',
  );
};
