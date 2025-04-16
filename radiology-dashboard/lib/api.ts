// Define the API URL for the backend
export const API_URL = 'http://localhost:8000'; // Change this to your FastAPI backend URL

/**
 * Uploads an image file to the backend for processing
 */
export async function uploadImage(file: File, modelId: string) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('model_id', modelId);

    const response = await fetch(`${API_URL}/upload_image`, {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type header, let the browser set it with the boundary
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API Error: ${response.status} - ${errorData.detail || 'Unknown error'}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

/**
 * Uploads a video file to the backend for processing
 */
export async function uploadVideo(file: File, modelId: string) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('model_id', modelId);

    const response = await fetch(`${API_URL}/upload_video`, {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type header, let the browser set it with the boundary
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API Error: ${response.status} - ${errorData.detail || 'Unknown error'}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error uploading video:', error);
    throw error;
  }
} 