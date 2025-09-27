import axios from "axios";
import CookieManager from "../utils/cookieManager";

const api = import.meta.env.VITE_API_BACKEND;

// Configuração do axios para interceptar erros
const axiosInstance = axios.create({
  baseURL: api,
  timeout: 10000,
  withCredentials: true, // Importante para enviar cookies
});

// Interceptor para adicionar token em requisições (se necessário)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = CookieManager.get('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de resposta
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Se token expirou, redireciona para login
    if (error.response?.status === 401) {
      CookieManager.remove('auth_token');
      CookieManager.remove('user_data');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Serviços de autenticação
const authService = {
  // Login com email e senha
  login: async (email, password) => {
    try {
      const response = await axiosInstance.post('/auth/login', {
        email,
        password
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao fazer login',
        error: error.response?.data
      };
    }
  },

  // Registro de novo usuário
  register: async (name, email, password) => {
    try {
      const response = await axiosInstance.post('/auth/register', {
        name,
        email,
        password
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao fazer cadastro',
        error: error.response?.data
      };
    }
  },

  // URL para Google OAuth
  getGoogleAuthUrl: () => {
    return `${api}/auth/google`;
  },

  // Logout
  logout: () => {
    CookieManager.remove('auth_token');
    CookieManager.remove('user_data');
    CookieManager.remove('user_id');
    window.location.href = '/login';
  },

  // Verificar se usuário está logado
  isAuthenticated: () => {
    const token = CookieManager.get('auth_token');
    return !!token;
  },

  // Obter token dos cookies
  getToken: () => {
    return CookieManager.get('auth_token');
  },

  // Obter dados do usuário dos cookies
  getUserData: () => {
    const userData = CookieManager.get('user_data');
    return userData ? JSON.parse(userData) : null;
  },

  // Obter ID do usuário dos cookies
  getUserId: () => {
    return CookieManager.get('user_id');
  },

  // Salvar dados do usuário após login/cadastro
  saveUserData: (token, userData = null) => {
    // Configurações seguras para o token
    const tokenOptions = {
      maxAge: 24 * 60 * 60, // 24 horas em segundos
      secure: import.meta.env.PROD, // HTTPS em produção
      sameSite: 'Strict' // Proteção contra CSRF
    };

    // Salvar token
    CookieManager.set('auth_token', token, tokenOptions);

    // Se há dados do usuário, salvar também
    if (userData) {
      const userDataOptions = {
        maxAge: 7 * 24 * 60 * 60, // 7 dias em segundos
        secure: import.meta.env.PROD,
        sameSite: 'Strict'
      };

      // Salvar dados do usuário como JSON
      CookieManager.set('user_data', JSON.stringify(userData), userDataOptions);

      // Salvar ID do usuário separadamente para fácil acesso
      if (userData.id || userData.userId) {
        CookieManager.set('user_id', userData.id || userData.userId, userDataOptions);
      }
    }

    // Decodificar token para extrair dados se não foram fornecidos
    if (!userData) {
      const decodedToken = authService.decodeToken(token);
      if (decodedToken) {
        const extractedUserData = {
          id: decodedToken.userId || decodedToken.id,
          email: decodedToken.email,
          name: decodedToken.name
        };

        CookieManager.set('user_data', JSON.stringify(extractedUserData), {
          maxAge: 7 * 24 * 60 * 60, // 7 dias em segundos
          secure: import.meta.env.PROD,
          sameSite: 'Strict'
        });

        if (extractedUserData.id) {
          CookieManager.set('user_id', extractedUserData.id, {
            maxAge: 7 * 24 * 60 * 60, // 7 dias em segundos
            secure: import.meta.env.PROD,
            sameSite: 'Strict'
          });
        }
      }
    }
  },

  // Alterar senha do usuário
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await axiosInstance.post('/auth/change-password', {
        currentPassword,
        newPassword
      });
      return {
        success: true,
        message: response.data.message || 'Senha alterada com sucesso'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao alterar senha',
        error: error.response?.data
      };
    }
  },

  // Decodificar token JWT (básico)
  decodeToken: (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
      return null;
    }
  }
};

export default authService;
