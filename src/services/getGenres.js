import axios from "axios";
const API = import.meta.env.VITE_API_BACKEND;

const API_URL = `${API}/movies/genres`;

const getGenres = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar a lista de gêneros:", error);
    throw new Error("Não foi possível carregar os gêneros.");
  }
};

export default getGenres;
