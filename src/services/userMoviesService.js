import axios from "axios";
import authService from "./authService";

const API = import.meta.env.VITE_API_BACKEND;

export async function saveMovie(id) {
  return axios.post(
    `${API}/user/movies`,
    { movieId: id },
    { headers: { Authorization: `Bearer ${authService.getToken()}` } }
  );
}

export async function getSavedMoviesDetails() {
  return axios.get(`${API}/user/movies/details`, {
    headers: { Authorization: `Bearer ${authService.getToken()}` },
  });
}

export async function removeMovie(id) {
  return axios.delete(`${API}/user/movies/${id}`, {
    headers: { Authorization: `Bearer ${authService.getToken()}` },
  });
}

export async function unfavoriteMovie(id) {
  return axios.patch(
    `${API}/user/movies/unfavorite/${id}`,
    {},
    { headers: { Authorization: `Bearer ${authService.getToken()}` } }
  );
}

export async function toggleWatched(id) {
  return axios.patch(
    `${API}/user/movies/${id}`,
    {},
    { headers: { Authorization: `Bearer ${authService.getToken()}` } }
  );
}

export async function getMovieStatus(id) {
  return axios.get(`${API}/user/movies/${id}/status`, {
    headers: { Authorization: `Bearer ${authService.getToken()}` },
  });
}
