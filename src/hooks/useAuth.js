import { useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const updateAuthState = useCallback(() => {
    const authenticated = authService.isAuthenticated();
    const userData = authService.getUserData();

    setIsAuthenticated(authenticated);
    setUser(userData);
    setLoading(false);
  }, []);

  useEffect(() => {
    updateAuthState();
  }, [updateAuthState]);

  const login = async (email, password) => {
    const result = await authService.login(email, password);

    if (result.success) {
      authService.saveUserData(result.data.token, result.data.user);
      updateAuthState();
    }

    return result;
  };

  const register = async (name, email, password) => {
    const result = await authService.register(name, email, password);
    return result;
  };

  const logout = useCallback(() => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  const getToken = useCallback(() => {
    return authService.getToken();
  }, []);

  const hasPermission = useCallback((permission) => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission);
  }, [user]);

  return {
    isAuthenticated,
    user,
    loading,

    login,
    register,
    logout,
    getToken,
    hasPermission,
    updateAuthState,

    userId: user?.id,
    userEmail: user?.email,
    userName: user?.name,
  };
};

export default useAuth;
