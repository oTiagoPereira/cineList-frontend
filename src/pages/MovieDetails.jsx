import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../layout/mainLayout";
import getMoviesDetailsById from "../services/getMoviesDetailsById";
import { AiOutlineLoading } from "react-icons/ai";
import getMoviesSimilar from "../services/getMovieSimilar";
import MovieCard from "../components/MovieCard/MovieCard";
import { useQuery } from "@tanstack/react-query";
import getGenres from "../services/getGenres";
import Button from "../components/Button/Button";
import { FaStar } from "react-icons/fa";
import formatRuntime from "../utils/formatRuntime";
import { getMovieStatus, removeMovie, saveMovie, toggleWatched } from "../services/userMoviesService";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";

function MovieDetails() {
  const { id } = useParams();
  const [status, setStatus] = useState({ saved: false, watched: false });
  const [actionLoading, setActionLoading] = useState(false);

  const fetchStatus = useCallback(async (movieId) => {
    if (!movieId) return;
    try {
      const res = await getMovieStatus(movieId);
      if (res.status === 200) {
        setStatus(res.data);
      }
    } catch (error) {
      console.error("Erro ao buscar status do filme", error);
      setStatus({ saved: false, watched: false });
    }
  }, []);

  useEffect(() => {
    if (!id) return;
    fetchStatus(id);
  }, [id, fetchStatus]);

  // Query para buscar a lista completa de gêneros (será cacheada globalmente)
  const { data: genresList = [] } = useQuery({
    queryKey: ["genres"], // Chave global para a lista de gêneros
    queryFn: getGenres,
    staleTime: 1000 * 60 * 60 * 24, // Cache de 24 horas
  });

  // Query para buscar os detalhes do filme específico
  const {
    data: movie,
    isLoading: isLoadingMovie,
    isError: isErrorMovie,
    error: errorMovie,
  } = useQuery({
    queryKey: ["movieDetails", id],
    queryFn: () => getMoviesDetailsById({ id }),
  });

  // Query para buscar filmes similares
  const { data: similar, isLoading: isLoadingSimilar } = useQuery({
    queryKey: ["similarMovies", id],
    queryFn: () => getMoviesSimilar({ id }),
    enabled: !!movie, // Só executa essa query depois que a query do filme principal tiver sucesso
  });

  const handleSave = async () => {
    if (!id) return;
    setActionLoading(true);
    try {
      if (!status.saved) {
        await saveMovie(id);
      } else {
        await removeMovie(id);
      }
      await fetchStatus(id);
    } catch (error) {
      console.error("Erro ao salvar filme:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleWatched = async () => {
    if (!id) return;
    setActionLoading(true);
    try {
      await toggleWatched(id);
      await fetchStatus(id);
    } catch (error) {
      console.error("Erro ao marcar como assistido:", error);
    } finally {
      setActionLoading(false);
    }
  };

  // Função para "traduzir" os IDs dos gêneros para nomes
  const getGenreNames = (genreIds) => {
    if (!genreIds || !genresList.length) return [];
    const genreMap = new Map(genresList.map((g) => [g.id, g.name]));
    // Se for array de objetos {id}, pega o id. Se for array de números, usa direto.
    const ids = genreIds.map((g) => typeof g === "object" ? g.id : g);
    return ids.map((id) => genreMap.get(id)).filter(Boolean);
  };

  const movieGenres = getGenreNames(movie?.genres);

  if (isLoadingMovie || isLoadingSimilar) {
    return (
      <MainLayout>
        <LoadingSpinner />
      </MainLayout>
    );
  }

  if (isErrorMovie) {
    return (
      <MainLayout>
        <p className="text-text text-center">
          Erro ao carregar o filme: {errorMovie.message}
        </p>
      </MainLayout>
    );
  }

  if (!movie) {
    return (
      <MainLayout>
        <p className="text-text text-center">Filme não encontrado.</p>
      </MainLayout>
    );
  }

  const moviesSimilar =
    similar?.results || (Array.isArray(similar) ? similar : []);

  return (
    <MainLayout>
      <section className="container mx-auto my-10 px-4 items-center md:items-start">
        <div className="bg-background-secondary flex flex-col md:flex-row items-center border border-border rounded-md p-6 md:p-8 gap-6 md:gap-8">
          <img
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
                : "https://placehold.co/400x600/222222/9ca3af?text=Poster+Indispon%C3%ADvel'"
            }
            alt={movie.title}
            className="my-4"
          />
          <div className="flex text-center md:text-left flex-col items-center md:items-start">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {movie.title}
            </h2>
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
              {movieGenres.map((genreName) => (
                <span
                  key={genreName}
                  className="bg-primary text-text-button text-xs font-semibold px-3 py-1 rounded-full"
                >
                  {genreName}
                </span>
              ))}
            </div>
            <p className="text-lg text-text mb-4">
              Lançado em{" "}
              {movie.release_date
                ? new Date(movie.release_date).getFullYear()
                : "Data desconhecida"}
            </p>
            <p className="text-text leading-relaxed mb-4">
              Duração: {formatRuntime(movie.runtime)}
            </p>
            <p className="text-text leading-relaxed">
              {movie.overview || "Sinopse não disponível."}
            </p>
            <p className="text-text text-sm mt-4 flex items-center">
              <FaStar className="text-primary mr-1" />{" "}
              {movie.vote_average.toFixed(1)}/10
            </p>
            <p className="text-text text-sm mt-4">
              Onde assistir:{" "}
              {movie.streaming &&
              movie.streaming.flatrate &&
              movie.streaming.flatrate.length > 0
                ? movie.streaming.flatrate[0].provider_name
                : "Informação não disponível"}
            </p>
            <div className="flex flex-col gap-4 items-center w-full md:w-1/2 mt-10">
              <Button
                label={
                  status.saved
                    ? "Remover dos favoritos"
                    : "Adicionar aos favoritos"
                }
                variant={status.saved ? "secondary" : "primary"}
                onClick={handleSave}
                isLoading={actionLoading}
              />
              <Button
                label={
                  status.watched
                    ? "Desmarcar como assistido"
                    : "Marcar como assistido"
                }
                variant={status.watched ? "sucess" : "primary"}
                onClick={handleWatched}
                isLoading={actionLoading}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col mt-10">
          <h1 className="text-2xl md:text-3xl font-bold text-text-secondary mb-10">
            Recomendações
          </h1>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4 ">
            {moviesSimilar.map((movie) => {
              const genreNames = movie.genre_ids
                ? getGenreNames(movie.genre_ids)
                : [];
              return (
                <MovieCard
                  key={movie.id}
                  id={movie.id}
                  genres={genreNames}
                  title={movie.title}
                  poster_path={movie.poster_path}
                  vote={movie.vote_average}
                  isClickable={true}
                />
              );
            })}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

export default MovieDetails;
