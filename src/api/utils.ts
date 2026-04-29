// API utility functions
import api from './axios';

/**
 * Set API key in localStorage
 */
export const setApiKey = (apiKey: string): void => {
  localStorage.setItem('apiKey', apiKey);
};

/**
 * Get API key from localStorage
 */
export const getApiKey = (): string | null => {
  return localStorage.getItem('apiKey');
};

/**
 * Remove API key from localStorage
 */
export const removeApiKey = (): void => {
  localStorage.removeItem('apiKey');
};

/**
 * Check if API key exists
 */
export const hasApiKey = (): boolean => {
  return !!getApiKey();
};

/**
 * Format API error message
 */
export const formatApiError = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error.response?.data?.errors) {
    const errors = error.response.data.errors;
    if (Array.isArray(errors)) {
      return errors.join(', ');
    }
    if (typeof errors === 'object') {
      return Object.values(errors).flat().join(', ');
    }
  }
  
  if (error.message) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
};

/**
 * Create a generic API service class
 */
export class BaseApiService {
  protected static async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const response = await api.get(endpoint, { params });
    return response.data;
  }

  protected static async post<T>(endpoint: string, data?: any): Promise<T> {
    const response = await api.post(endpoint, data);
    return response.data;
  }

  protected static async put<T>(endpoint: string, data?: any): Promise<T> {
    const response = await api.put(endpoint, data);
    return response.data;
  }

  protected static async patch<T>(endpoint: string, data?: any): Promise<T> {
    const response = await api.patch(endpoint, data);
    return response.data;
  }

  protected static async delete<T>(endpoint: string): Promise<T> {
    const response = await api.delete(endpoint);
    return response.data;
  }
} 