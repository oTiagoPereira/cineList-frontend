import axios from "axios";
const API = import.meta.env.VITE_API_BACKEND;

async function getMoviesSimilar ({id}) {
  const api = `${API}/movies/similar/${id}`;
  try {
    const response = await axios.get(api);
    const data = await response.data;
    return data;
  } catch (error) {
    console.error(error);
  }
};

export default getMoviesSimilar;
