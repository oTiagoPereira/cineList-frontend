import { api } from './api';

const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data?.token) {
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Erro ao fazer login' };
    }
  },

  register: async (name, email, password) => {
    try {
      const response = await api.post('/auth/register', { name, email, password });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Erro ao fazer cadastro' };
    }
  },
  getGoogleAuthUrl: () => `${import.meta.env.VITE_API_BACKEND}/api/auth/google`,
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error("Erro no logout do servidor:", error);
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
  },

  isAuthenticated: async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      localStorage.removeItem('user');
      return { loggedIn: false };
    }

    try {
      const res = await api.get('/auth/me');
      if (res.data?.user) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
        return { loggedIn: true, user: res.data.user };
      }
      return { loggedIn: false };
    } catch {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      return { loggedIn: false };
    }
  },

  getUserData: () => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  },

  getUserId: () => {
    const user = authService.getUserData();
    return user ? user.id : null;
  },

  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await api.post('/auth/change-password', { currentPassword, newPassword });
      return { success: true, message: response.data.message || 'Senha alterada com sucesso' };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Erro ao alterar senha', error: error.response?.data };
    }
  },

  requestPasswordReset: async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return { success: true, data: response.data, message: response.data.message };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Erro ao solicitar reset' };
    }
  },

  resetPassword: async (email, token, password) => {
    try {
      const response = await api.post('/auth/reset-password', { email, token, password });
      return { success: true, message: response.data.message };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Erro ao redefinir senha' };
    }
  },
};

export default authService;
