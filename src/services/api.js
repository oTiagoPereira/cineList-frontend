import axios from 'axios';


export const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  timeout: 15000
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url;
    console.error('[API ERROR]', status, url, error.message);

    if (status === 401) {
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);
