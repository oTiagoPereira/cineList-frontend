import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';

const AuthSuccess = () => {
  const navigate = useNavigate();
  const { updateAuthState } = useAuth();

  useEffect(() => {
    updateAuthState().then(() => {
      navigate("/", { replace: true });
    });
  }, [navigate, updateAuthState]);

  return (
    <div className='flex flex-col items-center justify-center gap-4 h-screen bg-background'>
      <h1 className='text-white text-2xl'>Autenticando...</h1>
      <LoadingSpinner />
    </div>
  );
};

export default AuthSuccess;
