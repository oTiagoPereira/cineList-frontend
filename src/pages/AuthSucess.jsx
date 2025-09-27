import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';

const AuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      if (authService.isAuthenticated()) {
        navigate('/', { replace: true });
      } else {
        navigate('/login?error=auth_failed', { replace: true });
      }
    }, 1000);
  }, [navigate]);

  return (
    <div className='flex flex-col items-center justify-center gap-4 h-screen bg-background'>
      <LoadingSpinner />
    </div>
  );
};

export default AuthSuccess;
