import { useState } from "react";
import MainLayout from "../layout/mainLayout";
import Input from "../components/Input/Input";
import Button from "../components/Button/Button";
import authService from "../services/authService";
import useNotifications from "../hooks/useNotifications";
import NotificationContainer from "../components/Notification/NotificationContainer";

function Perfil() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    notifications,
    removeNotification,
    showSuccess,
    showWarning,
    showError
  } = useNotifications();

  const userData = authService.getUserData();
  const userName = userData?.name || "Usuário";
  const userEmail = userData?.email || "";

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!currentPassword || !newPassword || !confirmPassword) {
      showWarning("Todos os campos são obrigatórios");
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      showWarning("A nova senha e a confirmação devem ser iguais");
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      showWarning("A nova senha deve ter pelo menos 6 caracteres");
      setLoading(false);
      return;
    }

    if (currentPassword === newPassword) {
      showWarning("A nova senha deve ser diferente da senha atual");
      setLoading(false);
      return;
    }

    try {
      const response = await authService.changePassword(
        currentPassword,
        newPassword
      );

      if (response.success) {
        showSuccess(response.message || "Senha alterada com sucesso!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        showError(response.message || "Erro ao alterar senha");
      }
    } catch (err) {
      console.error("Erro ao alterar senha:", err);
      showError("Erro ao alterar senha. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <section className="container mx-auto px-4 flex flex-col items-center">
        <header className="flex w-full flex-row items-center justify-center my-10 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-text-secondary">
            Meu Perfil
          </h1>
        </header>
        <div className="bg-background-secondary rounded-lg shadow-md p-6 mb-8 w-full md:max-w-2xl">
          <div className="mb-8 p-4 bg-background-input rounded-lg">
            <h2 className="text-xl font-semibold text-text-secondary mb-4">
              Informações Pessoais
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-text opacity-70">
                  Nome:
                </span>
                <p className="text-text font-medium">{userName}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-text opacity-70">
                  Email:
                </span>
                <p className="text-text font-medium">{userEmail}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-6">
            <h2 className="text-xl font-semibold text-text-secondary mb-4">
              Alterar Senha
            </h2>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label
                  htmlFor="current-password"
                  className="block text-text font-medium mb-2"
                >
                  Senha Atual <span className="text-red-500">*</span>
                </label>
                <Input
                  id="current-password"
                  type="password"
                  placeholder="Digite sua senha atual"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  showToggle={true}
                />
              </div>

              <div>
                <label
                  htmlFor="new-password"
                  className="block text-text font-medium mb-2"
                >
                  Nova Senha <span className="text-red-500">*</span>
                </label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="Digite sua nova senha (mín. 6 caracteres)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  showToggle={true}
                />
              </div>

              <div>
                <label
                  htmlFor="confirm-password"
                  className="block text-text font-medium mb-2"
                >
                  Confirmar Nova Senha <span className="text-red-500">*</span>
                </label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirme sua nova senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  showToggle={true}
                />
              </div>

              <div className="pt-4">
                <Button
                  label={loading ? "Alterando..." : "Alterar Senha"}
                  onClick={handleChangePassword}
                  variant="primary"
                  disabled={loading}
                />
              </div>
            </form>

            <div className="mt-6 p-4 bg-background-input border border-border rounded-lg">
              <h3 className="text-sm font-semibold text-text mb-2">
                💡 Dicas para uma senha segura:
              </h3>
              <ul className="text-sm text-text space-y-1">
                <li>• Use pelo menos 8 caracteres</li>
                <li>• Combine letras maiúsculas e minúsculas</li>
                <li>• Inclua números e símbolos</li>
                <li>• Evite informações pessoais óbvias</li>
                <li>• Não reutilize senhas de outras contas</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <NotificationContainer
        notifications={notifications}
        onRemove={removeNotification}
        position="top-center"
      />
    </MainLayout>
  );
}

export default Perfil;
