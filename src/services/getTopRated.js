import { api } from './api';

async function getTopRated () {
  try {
    const { data } = await api.get('/movies/top-rated');
    return data;
  } catch (error) {
    console.error('Erro getTopRated:', error.response?.status, error.message);
    throw error;
  }
};

export default getTopRated;
