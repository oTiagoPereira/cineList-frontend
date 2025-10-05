import { api } from "./api";

export async function saveMovie(id) {
  return api.post("/user/movies", { movieId: id });
}

export async function getSavedMoviesDetails() {
  return api.get("/user/movies/details");
}

export async function removeMovie(id) {
  return api.delete(`/user/movies/${id}`);
}

export async function toggleWatched(id) {
  return api.patch(`/user/movies/${id}`);
}

export async function getMovieStatus(id) {
  return api.get(`/user/movies/${id}/status`);
}
