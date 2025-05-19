import { axiosUploadClient } from './axiosClient';

export interface UploadedFile {
  filename: string;
  originalname: string;
  path: string;
  mimetype: string;
  size: number;
  url: string;
}

export interface UploadResponse {
  success: boolean;
  file: UploadedFile;
}

const fileApi = {
  // Upload a file
  uploadFile: async (file: File): Promise<UploadResponse> => {
    try {
      console.log('[API] Uploading file:', file.name);

      // Convert file to base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
      });

      const formData = new FormData();
      formData.append('file', file);

      const response = await axiosUploadClient.post<UploadResponse>('/file/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Override the URL with base64 data
      if (response.data.success && response.data.file) {
        response.data.file.url = base64;
      }

      console.log('[API] File upload response:', response);
      return response.data;
    } catch (error) {
      console.error('[API] Error uploading file:', error);
      throw error;
    }
  }
};

export default fileApi; 