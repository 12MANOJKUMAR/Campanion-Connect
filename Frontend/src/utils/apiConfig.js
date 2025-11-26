const DEFAULT_REMOTE_API = 'https://campanion-connect.onrender.com/api';
const DEFAULT_LOCAL_API = 'http://localhost:5000/api';

const resolveApiBaseUrl = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '');
  }

  if (typeof window !== 'undefined' && window.location.origin.includes('localhost')) {
    return DEFAULT_LOCAL_API;
  }

  return DEFAULT_REMOTE_API;
};

export const API_BASE_URL = resolveApiBaseUrl();

export const buildApiUrl = (path = '') => {
  if (!path) return API_BASE_URL;
  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
};


