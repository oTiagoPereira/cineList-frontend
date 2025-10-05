import { api } from './api';

async function getMoviesDetailsById ({id}) {
  try {
    const [{ data }, streaming] = await Promise.all([
      api.get(`/movies/details/${id}`),
      api.get(`/movies/streaming/${id}`)
    ]);
    data.streaming = streaming.data;
    return data;
  } catch (error) {
    console.error('Erro getMoviesDetailsById:', error.response?.status, error.message);
    throw error;
  }
};

export default getMoviesDetailsById;
