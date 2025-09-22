import axios from "axios";

const API = import.meta.env.VITE_API_BACKEND;

async function getTopRated () {
  const api = `${API}/movies/top-rated`;
  try {
    const response = await axios.get(api);
    const data = await response.data;
    return data;
  } catch (error) {
    console.error(error);
  }
};

export default getTopRated;
