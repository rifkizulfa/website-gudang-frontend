import axios from 'axios';
import BACKEND_URL from './config';

// Create axios instance dengan base URL dari environment
const apiClient = axios.create({
  baseURL: BACKEND_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Untuk kirim cookies/credentials
});

// Error interceptor
apiClient.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error);
    if (error.response?.status === 404) {
      console.error('Backend tidak ditemukan - check VITE_BACKEND_URL');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
