import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input/Input";
import Button from "../components/Button/Button";
import authService from "../services/authService";
import useNotifications from "../hooks/useNotifications";
import NotificationContainer from "../components/Notification/NotificationContainer";

function Cadastro() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ConfirmPassword, SetConfirmPassword] = useState("");
  const {
    notifications,
    removeNotification,
    showError,
    showWarning,
    showSuccess,
    clearNotifications
  } = useNotifications();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearNotifications();

    if(!name || !email || !password || !ConfirmPassword) {
      showError("Todos os campos devem ser preenchidos");
      return;
    }

    if(password !== ConfirmPassword) {
      showError("As senhas devem ser iguais");
      return;
    }

    if(password.length < 6) {
      showWarning("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    const result = await authService.register(name, email, password);

    if (result.success) {
      showSuccess("Cadastro realizado com sucesso!");
      setTimeout(() => navigate("/login"), 800);
    } else {
      showError(result.message || "Erro ao cadastrar. Tente novamente.");
    }
  };

  const handleSubmitGoogle = () => {
    clearNotifications();
    try {
      window.location.href = authService.getGoogleAuthUrl();
    } catch(error) {
      console.error("Erro ao fazer cadastro com Google", error);
      showError("Erro ao fazer cadastro com Google");
    }
  };

  return (
    <section
      className="flex flex-col items-center justify-center bg-background min-h-screen pt-12"
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
            Crie sua Conta
          </h2>
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-4">
              <label
                htmlFor="nome-cadastro"
                className="block text-text font-medium mb-2"
              >
                Nome Completo
              </label>
              <Input
                type="text"
                id="nome-cadastro"
                placeholder="Nome Completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="email-cadastro"
                className="block text-text font-medium mb-2"
              >
                Email
              </label>
              <Input
                type="email"
                id="email-cadastro"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="senha-cadastro"
                className="block text-text font-medium mb-2"
              >
                Senha
              </label>
              <Input
                type="password"
                id="senha-cadastro"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                showToggle={true}
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="confirmar-senha-cadastro"
                className="block text-text font-medium mb-2"
              >
                Confirmar Senha
              </label>
              <Input
                type="password"
                id="confirmar-senha-cadastro"
                placeholder="Confirme a Senha"
                value={ConfirmPassword}
                onChange={(e) => SetConfirmPassword(e.target.value)}
                showToggle={true}
              />
            </div>
            <Button label="Cadastrar" type="submit" variant="primary" />
            <div className="flex items-center my-6">
              <hr className="flex-grow border-t border-border" />
              <span className="mx-4 text-text opacity-50">Ou</span>
              <hr className="flex-grow border-t border-border" />
            </div>

            <Button
              label="Entrar com Google"
              onClick={handleSubmitGoogle}
              variant="secondary"
              type="button"
            />
          </form>
          <p className="mt-6 text-center text-text">
            Já tem uma conta?{" "}
            <Link
              to={"/login"}
              id="show-login"
              className="text-text-secondary hover:underline"
            >
              Faça Login
            </Link>
          </p>
        </div>
      </div>
      <NotificationContainer
        notifications={notifications}
        onRemove={removeNotification}
      />
    </section>
  );
}

export default Cadastro;
