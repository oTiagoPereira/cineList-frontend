import axios from "axios";
import CookieManager from "../utils/cookieManager";

const api = import.meta.env.VITE_API_BACKEND;

const axiosInstance = axios.create({
  baseURL: api,
  timeout: 10000,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Limpa dados legíveis
      CookieManager.remove('user_data');
      CookieManager.remove('user_id');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

const authService = {
  login: async (email, password) => {
    try {
      const response = await axiosInstance.post('/auth/login', { email, password });
      // Backend já setou cookies httpOnly; só persistimos user_data se veio no body
      if (response.data?.user) {
        CookieManager.set('user_data', JSON.stringify(response.data.user), { maxAge: 7 * 24 * 60 * 60 });
        CookieManager.set('user_id', response.data.user.id, { maxAge: 7 * 24 * 60 * 60 });
      }
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Erro ao fazer login' };
    }
  },
  register: async (name, email, password) => {
    try {
      const response = await axiosInstance.post('/auth/register', { name, email, password });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Erro ao fazer cadastro' };
    }
  },
  getGoogleAuthUrl: () => `${import.meta.env.VITE_API_BACKEND}/auth/google`,
  logout: async () => {
    await axiosInstance.post('/auth/logout');
    CookieManager.remove('user_data');
    CookieManager.remove('user_id');
    window.location.href = '/login';
  },
  isAuthenticated: async () => {
    try {
      const res = await axiosInstance.get('/auth/me');
      // Atualiza cookies legíveis se necessário
      if (res.data?.user) {
        CookieManager.set('user_data', JSON.stringify(res.data.user), { maxAge: 7 * 24 * 60 * 60 });
        CookieManager.set('user_id', res.data.user.id, { maxAge: 7 * 24 * 60 * 60 });
      }
      return { loggedIn: true, user: res.data.user };
    } catch {
      return { loggedIn: false };
    }
  },
  getToken: () => null, // token não é mais acessível no front (httpOnly)
  getUserData: () => {
    const userData = CookieManager.get('user_data');
    return userData ? JSON.parse(userData) : null;
  },
  getUserId: () => CookieManager.get('user_id'),
  saveUserData: () => {}, // não usado agora (mantido para compatibilidade)
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await axiosInstance.post('/auth/change-password', { currentPassword, newPassword });
      return { success: true, message: response.data.message || 'Senha alterada com sucesso' };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Erro ao alterar senha', error: error.response?.data };
    }
  },
  requestPasswordReset: async (email) => {
    try {
      const response = await axiosInstance.post('/auth/forgot-password', { email });
      return { success: true, data: response.data, message: response.data.message };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Erro ao solicitar reset' };
    }
  },
  resetPassword: async (email, token, password) => {
    try {
      const response = await axiosInstance.post('/auth/reset-password', { email, token, password });
      return { success: true, message: response.data.message };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Erro ao redefinir senha' };
    }
  },
  decodeToken: () => null // não acessível
};

export default authService;
