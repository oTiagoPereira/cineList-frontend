export async function getSavedMoviesDetails() {
  return axios.get(`${API}/user/movies/details`, {
    headers: { Authorization: `Bearer ${token()}` },
  });
}
import axios from "axios";

const API = import.meta.env.VITE_API_BACKEND;
const token = () => localStorage.getItem("token");

export async function saveMovie(id) {
  return axios.post(
    `${API}/user/movies`,
    { movieId: id },
    { headers: { Authorization: `Bearer ${token()}` } }
  );
}

export async function removeMovie(id) {
  return axios.delete(`${API}/user/movies/${id}`, {
    headers: { Authorization: `Bearer ${token()}` },
  });
}

export async function unfavoriteMovie(id) {
  return axios.patch(
    `${API}/user/movies/unfavorite/${id}`,
    {},
    { headers: { Authorization: `Bearer ${token()}` } }
  );
}

export async function toggleWatched(id) {
  return axios.patch(
    `${API}/user/movies/${id}`,
    {},
    { headers: { Authorization: `Bearer ${token()}` } }
  );
}

export async function getMovieStatus(id) {
  return axios.get(`${API}/user/movies/${id}/status`, {
    headers: { Authorization: `Bearer ${token()}` },
  });
}
