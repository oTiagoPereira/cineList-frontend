import { Link } from "react-router-dom";
import Button from "../components/Button/Button";
import Footer from "../components/Footer/Footer";

const NotFound = () => {
  return (
    <section className="w-full h-screen bg-background flex flex-col justify-between items-center">
      <header className="bg-background-secondary shadow-sm shadow-shadow text-text flex flex-col items-center w-full">
        <div className="container mx-auto flex items-center justify-between my-4 px-4 w-full">
          <Link to="/" className="text-lg md:text-2xl font-bold text-text-secondary hover:text-primary transition">
            🎬 CineList
          </Link>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="bg-background-secondary p-8 rounded-lg shadow-lg shadow-shadow w-full max-w-md border border-border text-center">
          <div className="text-6xl mb-6">🎬</div>

          <h1 className="text-4xl font-bold text-text-secondary mb-4">404</h1>
          <h2 className="text-xl font-semibold text-text mb-4">Página não encontrada</h2>
          <p className="text-text mb-6">
            Ops! Parece que esta página saiu de cartaz.
            Que tal voltar para a nossa seleção principal?
          </p>

          <div className="space-y-3">
            <Link to="/" className="block">
              <Button
                label="Voltar ao Início"
                variant="primary"
                type="button"
              />
            </Link>
            <Link to="/minha-lista" className="block">
              <Button
                label="Ver Minha Lista"
                variant="secondary"
                type="button"
              />
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-text text-sm opacity-75">
            Se você acha que isso é um erro, entre em contato conosco
          </p>
        </div>
      </div>
      <Footer/>
    </section>
  );
};

export default NotFound;
