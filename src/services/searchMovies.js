import axios from "axios";

const API = import.meta.env.VITE_API_BACKEND;

async function searchMovies({ query }) {
  const api = `${API}/movies/search/${query}`;
  try {
    const response = await axios.get(api);
    const data = await response.data;
    if (Array.isArray(data?.results)) {
      return { results: data.results };
    }
    if (Array.isArray(data)) {
      return { results: data };
    }
    return { results: [] };
  } catch (error) {
    console.error(error);
    return { results: [] };
  }
}

export default searchMovies;
