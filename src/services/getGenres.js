import { api } from './api';

const getGenres = async () => {
  try {
    const { data } = await api.get('/movies/genres');
    return data;
  } catch (error) {
    console.error('Erro getGenres:', error.response?.status, error.message);
    throw new Error('Não foi possível carregar os gêneros.');
  }
};

export default getGenres;
