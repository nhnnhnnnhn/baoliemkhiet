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
      const formData = new FormData();
      formData.append('file', file);

      const response = await axiosUploadClient.post<UploadResponse>('/file/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('[API] File upload response:', response);
      return response.data;
    } catch (error) {
      console.error('[API] Error uploading file:', error);
      throw error;
    }
  }
};

export default fileApi; 