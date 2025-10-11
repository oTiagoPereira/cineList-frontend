import { useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    const result = await authService.isAuthenticated();
    if (result.loggedIn) {
      setIsAuthenticated(true);
      setUser(result.user);
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const login = async (email, password) => {
    const result = await authService.login(email, password);
    if (result.success) {
      await fetchStatus();
    }
    return result;
  };

  const register = async (name, email, password) => {
    return await authService.register(name, email, password);
  };

  const logout = useCallback(async () => {
    await authService.logout();
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  const updateUser = async (userData) => {
    const result = await authService.updateUser(userData);
    if (result.success) {
      await fetchStatus();
    }
    return result;
  };

  const getToken = useCallback(() => null, []);

  return {
    isAuthenticated,
    user,
    loading,
    login,
    register,
    logout,
    getToken,
    updateAuthState: fetchStatus,
    updateUser,
    userId: user?.id,
    userEmail: user?.email,
    userName: user?.name,
  };
};

export default useAuth;
