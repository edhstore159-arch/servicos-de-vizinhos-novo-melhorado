import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;

// In production, warn loudly if the backend URL is missing or invalid
// This is the most common reason logins fail after deploying to Render/Vercel
if (typeof window !== 'undefined') {
  if (!API_URL) {
    console.error(
      '[ServiVizinhos] REACT_APP_BACKEND_URL não está definida! ' +
      'Configure essa variável no Render (Environment) e refaça o deploy.'
    );
  } else if (!/^https?:\/\//.test(API_URL)) {
    console.error('[ServiVizinhos] REACT_APP_BACKEND_URL inválida:', API_URL);
  } else {
    console.info('[ServiVizinhos] Backend URL:', API_URL);
  }
}

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config.url?.includes('/auth/')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;
