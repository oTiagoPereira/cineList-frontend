import axios from "axios";
const API = import.meta.env.VITE_API_BACKEND;

async function getMoviesDetailsById ({id}) {
  const api = `${API}/movies/details/${id}`;
  const apiStreaming = `${API}/movies/streaming/${id}`;
  try {
    const response = await axios.get(api);
    const streaming = await axios.get(apiStreaming);
    response.data.streaming = streaming.data;
    const data = await response.data;
    return data;
  } catch (error) {
    console.error(error);
  }
};

export default getMoviesDetailsById;
