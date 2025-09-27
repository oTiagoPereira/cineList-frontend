import { useState, useCallback } from 'react';

const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((message, type = 'success', options = {}) => {
    const id = Date.now() + Math.random();
    const notification = {
      id,
      message,
      type,
      isVisible: true,
      ...options
    };

    setNotifications(prev => [...prev, notification]);

    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);


  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const showSuccess = useCallback((message, options) => {
    return addNotification(message, 'success', options);
  }, [addNotification]);

  const showError = useCallback((message, options) => {
    return addNotification(message, 'error', options);
  }, [addNotification]);

  const showWarning = useCallback((message, options) => {
    return addNotification(message, 'warning', options);
  }, [addNotification]);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
    showSuccess,
    showError,
    showWarning
  };
};

export default useNotifications;
