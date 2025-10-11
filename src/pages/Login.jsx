import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input/Input";
import Button from "../components/Button/Button";
import useAuth from "../hooks/useAuth";
import NotificationContainer from "../components/Notification/NotificationContainer";
import useNotifications from "../hooks/useNotifications";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const {
    notifications,
    removeNotification,
    showError
  } = useNotifications();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await login(email, password);

    setIsLoading(false);

    if (result.success) {
      navigate("/");
    } else {
      showError(result.message || "Falha no login. Verifique suas credenciais.");
    }
  };

  const handleGoogleLogin = () => {
    const googleAuthUrl = `${import.meta.env.VITE_API_BACKEND}/auth/google`;
    window.location.href = googleAuthUrl;
  };

  return (
    <section
      id="login"
      className="flex flex-col items-center justify-center bg-background min-h-screen"
    >
      <div className="flex flex-col items-center justify-center container mx-auto p-4 md:p-0">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-text-secondary mb-4">
            🎬 CineList
          </h1>
          <p className="text-text">Sua lista de filmes pessoal</p>
        </header>
        <div className="bg-background-secondary p-8 rounded-lg shadow-lg shadow-shadow w-full max-w-md border border-border">
          <h2 className="text-2xl font-bold mb-6 text-center text-text-secondary">
            Acesse sua Conta
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="email-login"
                className="block text-text font-medium mb-2"
              >
                Email
              </label>
              <Input
                id="email-login"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="mb-6">
              <span className="flex items-center justify-between mb-2">
                <label
                  htmlFor="senha-login"
                  className="block text-text font-medium"
                >
                  Senha
                </label>
                <Link to={"/esqueci-senha"} className="text-text-secondary hover:underline">
                  Esqueceu sua senha?
                </Link>
              </span>
              <Input
                id="senha-login"
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                showToggle={true}
                disabled={isLoading}
              />
            </div>
            <Button label="Entrar" onClick={handleSubmit} variant="primary" />

            <div className="flex items-center my-6">
              <hr className="flex-grow border-t border-border" />
              <span className="mx-4 text-text opacity-50">Ou</span>
              <hr className="flex-grow border-t border-border" />
            </div>

            <Button
              label="Entrar com Google"
              onClick={handleGoogleLogin}
              variant="secondary"
              type="button"
              disabled={isLoading}
            />
          </form>
          <p className="mt-6 text-center text-text">
            Não tem uma conta?{" "}
            <Link
              to={"/cadastro"}
              id="show-cadastro"
              className="text-text-secondary hover:underline"
            >
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
      <NotificationContainer
        notifications={notifications}
        onRemove={removeNotification}
        position="top-center"
      />
    </section>
  );
}

export default Login;
