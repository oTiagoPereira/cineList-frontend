import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";

const AuthSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      // Salva o token no localStorage
      localStorage.setItem("auth_token", token);
      // Redireciona para a home
      navigate("/", { replace: true });
    } else {
      // Se não houver token, redireciona para o login
      navigate("/login", { replace: true });
    }
  }, [navigate, searchParams]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 h-screen bg-background">
      <LoadingSpinner />
      <h1 className="text-primary text-2xl">Autenticando...</h1>
    </div>
  );
};

export default AuthSuccess;
