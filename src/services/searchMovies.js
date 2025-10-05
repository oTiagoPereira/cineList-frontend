import { api } from './api';

async function searchMovies({ query }) {
  try {
    const { data } = await api.get(`/movies/search/${encodeURIComponent(query)}`);
    if (Array.isArray(data?.results)) return { results: data.results };
    if (Array.isArray(data)) return { results: data };
    return { results: [] };
  } catch (error) {
    console.error('Erro searchMovies:', error.response?.status, error.message);
    return { results: [] };
  }
}

export default searchMovies;
