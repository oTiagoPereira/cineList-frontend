import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import MainLayout from "../layout/mainLayout";
import Input from "../components/Input/Input";
import Button from "../components/Button/Button";
import authService from "../services/authService";
import useNotifications from "../hooks/useNotifications";
import NotificationContainer from "../components/Notification/NotificationContainer";
import Footer from "../components/Footer/Footer";

const ResetarSenha = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") || "";
  const emailParam = searchParams.get("email") || "";
  const [email, setEmail] = useState(emailParam);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    notifications,
    removeNotification,
    showSuccess,
    showError,
    showWarning,
  } = useNotifications();

  useEffect(() => {
    if (!token || !emailParam) {
      showError("Link inválido ou incompleto");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !token) {
      showError("Token ou email ausente");
      return;
    }
    if (!password || !confirmPassword) {
      showWarning("Preencha a nova senha e confirmação");
      return;
    }
    if (password.length < 6) {
      showWarning("Senha deve ter pelo menos 6 caracteres");
      return;
    }
    if (password !== confirmPassword) {
      showWarning("As senhas não coincidem");
      return;
    }
    setLoading(true);
    const result = await authService.resetPassword(email, token, password);
    if (result.success) {
      showSuccess("Senha redefinida. Faça login.");
      setTimeout(() => navigate("/login"), 1200);
    } else {
      showError(result.message);
    }
    setLoading(false);
  };

  return (
    <section className="w-full h-screen bg-background flex flex-col justify-between items-center">
        <header className="bg-background-secondary shadow-sm shadow-shadow text-text flex flex-col items-center w-full">
        <div className="container mx-auto flex items-center justify-between my-4 px-4 w-full">
          <h1 className="text-lg md:text-2xl font-bold text-text-secondary">
            🎬 <Link to="/">CineList</Link>
          </h1>
        </div>
      </header>
        <div className="bg-background-secondary p-8 rounded-lg shadow-lg shadow-shadow w-full max-w-md border border-border">
          <h1 className="text-2xl font-bold mb-4 text-text-secondary">
            Redefinir Senha
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label className="block text-text mb-1" htmlFor="email">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!!emailParam}
              />
            </div>
            <div>
              <label className="block text-text mb-1" htmlFor="password">
                Nova Senha
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                showToggle={true}
              />
            </div>
            <div>
              <label className="block text-text mb-1" htmlFor="confirmPassword">
                Confirmar Senha
              </label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                showToggle={true}
              />
            </div>
            <Button
              type="submit"
              label={loading ? "Redefinindo..." : "Redefinir Senha"}
              disabled={loading}
              variant={"primary"}
            />
          </form>
        </div>
        <Footer/>
        <NotificationContainer
          notifications={notifications}
          removeNotification={removeNotification}
        />
      </section>
  );
};

export default ResetarSenha;
