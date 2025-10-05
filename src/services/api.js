import axios from 'axios';

const rawBase = import.meta.env.VITE_API_BACKEND || '';
const baseURL = rawBase.replace(/\/$/, '');

export const api = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 15000
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url;
    console.error('[API ERROR]', status, url, error.message);
    return Promise.reject(error);
  }
);
