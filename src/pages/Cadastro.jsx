import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Input from "../components/Input/Input";
import Button from "../components/Button/Button";

const api = import.meta.env.VITE_API_BACKEND;

function Cadastro() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ConfirmPassword, SetConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      if(password !== ConfirmPassword) {
        setError("As senhas devem ser iguais");
        return;
      }
      await axios.post(`${api}/auth/register`, { name, email, password });
      alert(`Usuário ${name} cadastrado com sucesso!`)
      navigate("/login");
    } catch (error) {
      console.log(error);
      setError("Erro ao cadastrar usuário", error);
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
          <form onSubmit={handleSubmit}>
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
                required
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
                required
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
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                required
                value={ConfirmPassword}
                onChange={(e) => SetConfirmPassword(e.target.value)}
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
              onClick={() => {}}
              variant="secondary"
              type="button"
            />
          </form>
          {error && (
            <div className="bg-red-100 p-4 rounded-lg shadow-lg w-full max-w-lg mt-6">
              <p className="text-red-700 text-center">{error}</p>
            </div>
          )}
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
    </section>
  );
}

export default Cadastro;
