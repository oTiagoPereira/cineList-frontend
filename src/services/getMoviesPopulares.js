import { api } from './api';

async function getMoviesPopulares () {
  try {
    const { data } = await api.get('/movies/populares');
    return data;
  } catch (error) {
    console.error('Erro getMoviesPopulares:', error.response?.status, error.message);
    throw error;
  }
};

export default getMoviesPopulares;
