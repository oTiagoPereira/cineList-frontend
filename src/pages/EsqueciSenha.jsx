import { useState } from "react";
import MainLayout from "../layout/mainLayout";
import Input from "../components/Input/Input";
import Button from "../components/Button/Button";
import authService from "../services/authService";
import useNotifications from "../hooks/useNotifications";
import NotificationContainer from "../components/Notification/NotificationContainer";
import Footer from "../components/Footer/Footer";

const EsqueciSenha = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    notifications,
    removeNotification,
    showSuccess,
    showError,
    showWarning,
  } = useNotifications();
  const [resetLinkDev, setResetLinkDev] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      showWarning("Informe seu email");
      return;
    }
    setLoading(true);
    const result = await authService.requestPasswordReset(email);
    if (result.success) {
      showSuccess(result.message || "Se o email existir, enviaremos o link");
      if (result.data?.resetLink) {
        setResetLinkDev(result.data.resetLink);
      }
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
            🎬 CineList
          </h1>
        </div>
      </header>
        <div className="bg-background-secondary p-8 rounded-lg shadow-lg shadow-shadow w-full max-w-md border border-border">
        <h1 className="text-2xl font-bold mb-4 text-text-secondary">
          Recuperar Senha
        </h1>
        <p className="text-sm text-text mb-4">
          Digite seu email e, se ele existir em nossa base, você receberá as
          instruções de redefinição.
        </p>
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
              placeholder="seu@email.com"
            />
          </div>
          <Button
            label={"Enviar"}
            disabled={loading}
            onClick={handleSubmit}
            variant={"primary"}
            type={"submit"}
          />
        </form>
        {resetLinkDev && (
          <div className="mt-4 text-xs break-all bg-background p-2 rounded border border-border">
            <p className="text-text-secondary font-semibold mb-1">
              Link de teste (dev):
            </p>
            <a className="text-primary underline" href={resetLinkDev}>
              {resetLinkDev}
            </a>
          </div>
        )}
      </div>
      <Footer />
      <NotificationContainer
        notifications={notifications}
        removeNotification={removeNotification}
      />
    </section>
  );
};

export default EsqueciSenha;
