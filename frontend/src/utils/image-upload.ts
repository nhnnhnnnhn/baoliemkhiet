interface UploadResponse {
  url: string;
  error?: string;
}

export const uploadImage = async (file: File, progressFn?: (percent: number) => void): Promise<UploadResponse> => {
  try {
    // Create a FormData instance
    const formData = new FormData();
    formData.append('file', file);

    // For now, return base64 of the image
    // TODO: Implement actual file upload to server
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          resolve({ url: reader.result });
        } else {
          reject({ error: 'Failed to convert image to base64' });
        }
      };
      reader.onerror = () => reject({ error: 'Failed to read file' });
      reader.readAsDataURL(file);

      // Simulate progress
      if (progressFn) {
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          progressFn(Math.min(progress, 100));
          if (progress >= 100) clearInterval(interval);
        }, 100);
      }
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    return {
      error: 'Failed to upload image',
      url: ''
    };
  }
};