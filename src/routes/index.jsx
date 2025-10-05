import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Cadastro from "../pages/Cadastro";
import ProtectedRoute from "./ProtectedRoute";
import Perfil from "../pages/Perfil";
import Home from "../pages/Home";
import MinhaLista from "../pages/MinhaLista";
import Recomendacao from "../pages/Recomendacao";
import MovieDetails from "../pages/MovieDetails";
import AuthSuccess from "../pages/AuthSucess";
import EsqueciSenha from "../pages/EsqueciSenha";
import ResetarSenha from "../pages/ResetarSenha";
import NotFound from "../pages/NotFound";

function AppRoutes() {
  return (
      <Routes>
        <Route path="/" element={<ProtectedRoute><Home/></ProtectedRoute>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/cadastro" element={<Cadastro/>} />
        <Route path="/esqueci-senha" element={<EsqueciSenha/>} />
        <Route path="/resetar-senha" element={<ResetarSenha/>} />
        <Route path="/auth/success" element={<AuthSuccess/>}/>
        <Route path="/perfil" element={<ProtectedRoute><Perfil/></ProtectedRoute>} />
        <Route path="/minha-lista" element={<ProtectedRoute><MinhaLista/></ProtectedRoute>} />
        <Route path="/recomendacao" element={<ProtectedRoute><Recomendacao/></ProtectedRoute>} />
        <Route path="/filme/:id" element={<ProtectedRoute><MovieDetails /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
  )
}

export default AppRoutes;
