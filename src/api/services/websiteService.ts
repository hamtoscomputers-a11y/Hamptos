import api from '../axios';
import { API_ENDPOINTS } from '../endpoints';

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
