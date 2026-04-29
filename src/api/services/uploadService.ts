import api from '../axios';
import { API_ENDPOINTS } from '../endpoints';
import type { ApiResponse, FileUploadResponse } from '../types';

export class UploadService {
  // Upload single image
  static async uploadImage(file: File): Promise<ApiResponse<FileUploadResponse>> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post(API_ENDPOINTS.UPLOAD.IMAGE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Upload single file
  static async uploadFile(file: File): Promise<ApiResponse<FileUploadResponse>> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post(API_ENDPOINTS.UPLOAD.FILE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Upload multiple files
  static async uploadMultipleFiles(files: File[]): Promise<ApiResponse<FileUploadResponse[]>> {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`files[${index}]`, file);
    });

    const response = await api.post(API_ENDPOINTS.UPLOAD.MULTIPLE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Upload with custom endpoint
  static async uploadToEndpoint(
    endpoint: string,
    file: File,
    additionalData?: Record<string, any>
  ): Promise<ApiResponse<FileUploadResponse>> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
    }

    const response = await api.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Delete uploaded file
  static async deleteFile(fileId: string): Promise<ApiResponse<void>> {
    const response = await api.delete(`/upload/files/${fileId}`);
    return response.data;
  }

  // Get file info
  static async getFileInfo(fileId: string): Promise<ApiResponse<FileUploadResponse>> {
    const response = await api.get(`/upload/files/${fileId}`);
    return response.data;
  }

  // Validate file before upload
  static validateFile(file: File, options: {
    maxSize?: number; // in bytes
    allowedTypes?: string[];
    maxFiles?: number;
  } = {}): { isValid: boolean; error?: string } {
    const { maxSize = 10 * 1024 * 1024, allowedTypes = [], maxFiles = 1 } = options;

    // Check file size
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: `File size exceeds maximum allowed size of ${Math.round(maxSize / 1024 / 1024)}MB`,
      };
    }

    // Check file type
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: `File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`,
      };
    }

    return { isValid: true };
  }

  // Create object URL for preview
  static createPreviewUrl(file: File): string {
    return URL.createObjectURL(file);
  }

  // Revoke object URL to free memory
  static revokePreviewUrl(url: string): void {
    URL.revokeObjectURL(url);
  }
}

export default UploadService; 