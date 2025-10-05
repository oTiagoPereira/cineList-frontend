import { api } from './api';

async function getMoviesSimilar ({id}) {
  try {
    const { data } = await api.get(`/movies/similar/${id}`);
    return data;
  } catch (error) {
    console.error('Erro getMoviesSimilar:', error.response?.status, error.message);
    throw error;
  }
};

export default getMoviesSimilar;
