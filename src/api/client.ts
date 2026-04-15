import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const formattedError = {
      message: error.response?.data?.message || error.message || 'API Error',
      status: error.response?.status,
    };

    return Promise.reject(formattedError);
  }
);

export default api;
