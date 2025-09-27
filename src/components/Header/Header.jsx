import { Link, useLocation } from "react-router-dom";
import Button from "../Button/Button";
import authService from "../../services/authService";

const Header = () => {
  const location = useLocation();
  const pathname = location.pathname;

  const userData = authService.getUserData();
  const userName = userData?.name || "Usuário";

  const getLinkClass = (path) => {
    return pathname === path
      ? "bg-background-select-nav border-b-2 border-primary py-2 px-4 hover:bg-background-select-nav text-text-secondary"
      : "py-2 px-4 hover:bg-background-select-nav";
  };

  return (
    <header className="bg-background-secondary shadow-sm shadow-shadow text-text flex flex-col items-center w-full">
      <div className="container mx-auto flex items-center justify-between mt-4 px-4 w-full">
        <h1 className="text-lg md:text-2xl font-bold text-text-secondary">
          🎬 CineList
        </h1>
        <span className="flex items-center space-x-4">
          <Link to={"/perfil"} className="hover:text-text-secondary">
            {userName}
          </Link>
          <Button
            label="Sair"
            onClick={authService.logout}
            variant="secondary"
            type="button"
          />
        </span>
      </div>
      <nav className="bg-background-input w-full mt-4">
        <div className="container mx-auto">
          <ul className="flex px-4 text-text">
            <li className={getLinkClass("/")}>
              <Link to={"/"} className="hover:text-text">
                Início
              </Link>
            </li>
            <li className={getLinkClass("/minha-lista")}>
              <Link
                to={"/minha-lista"}
                id="show-list"
                className="hover:text-text"
              >
                Minha Lista
              </Link>
            </li>
            <li className={getLinkClass("/recomendacao")}>
              <Link
                to={"/recomendacao"}
                id="re"
                className="hover:text-text"
              >
                Recomendar
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
