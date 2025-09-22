import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Cadastro from "../pages/Cadastro";
import ProtectedRoute from "./ProtectedRoute";
import Perfil from "../pages/Perfil";
import Home from "../pages/Home";
import MinhaLista from "../pages/MinhaLista";
import Recomendacao from "../pages/Recomendacao";
import MovieDetails from "../pages/MovieDetails";

function AppRoutes() {
  return (
      <Routes>
        <Route path="*" element={<h1>Página não encontrada</h1>} />
        <Route path="/" element={<ProtectedRoute><Home/></ProtectedRoute>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/cadastro" element={<Cadastro/>} />
        <Route path="/perfil" element={<ProtectedRoute><Perfil/></ProtectedRoute>} />
        <Route path="/minha-lista" element={<ProtectedRoute><MinhaLista/></ProtectedRoute>} />
        <Route path="/recomendacao" element={<ProtectedRoute><Recomendacao/></ProtectedRoute>} />
        <Route path="/filme/:id" element={<ProtectedRoute><MovieDetails /></ProtectedRoute>} />
      </Routes>
  )
}

export default AppRoutes;
