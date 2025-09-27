import React, { useEffect, useState } from "react";
import authService from "../services/authService";
import { getMovieStatus, removeMovie, saveMovie, toggleWatched } from "../services/userMoviesService";
import Button from "../components/Button/Button";
import MovieCard from "../components/MovieCard/MovieCard";
import formatRuntime from "../utils/formatRuntime";
import { FaStar } from "react-icons/fa";

const RecomendacaoDetails = ({
  chosenMovie,
  recommendations,
  handleReset,
  handleRespin,
}) => {
  const [status, setStatus] = useState({ saved: false });
  const token = authService.getToken();

  useEffect(() => {
    if (!chosenMovie || !chosenMovie.id || !token) return;

    const fetchStatus = async () => {
      try {
        const res = await getMovieStatus(chosenMovie.id);
        if (res.status === 200) {
          setStatus(res.data);
        }
      } catch (error) {
        console.error("Erro ao buscar status do filme", error);
        setStatus({ saved: false });
      }
    };

    fetchStatus();
  }, [chosenMovie, token]);


  const handleSave = async () => {
      try {
        if (!status.saved) {
          await saveMovie(chosenMovie.movieTmdbId);
        } else {
          await removeMovie(chosenMovie.movieTmdbId);
        }
        const res = await getMovieStatus(chosenMovie.movieTmdbId);
        if (res.status === 200) setStatus(res.data);
      } catch (error) {
        console.error("Erro ao salvar filme:", error);
      }
    };

  const handleWatched = async () => {
      try {
        if (!chosenMovie) return;
        await toggleWatched(chosenMovie.movieTmdbId);
        const res = await getMovieStatus(chosenMovie.movieTmdbId);
        if (res.status === 200) {
          setStatus(res.data);
        }
      } catch (error) {
        console.error("Erro ao marcar como assistido:", error);
      }
    };

  useEffect(() => {
    if (!chosenMovie) {
      console.error("Objeto chosenMovie não encontrado.");
      return;
    }
    if (!chosenMovie.movieTmdbId) {
      console.error("ID do filme não encontrado no objeto chosenMovie:", chosenMovie);
    }
  }, [chosenMovie]);


  const updatedHandleRespin = () => {
    setStatus({ saved: false });
    if (recommendations.length > 1) {
      let newChoice;
      do {
        newChoice = recommendations[Math.floor(Math.random() * recommendations.length)];
      } while (newChoice.title === chosenMovie.title);
      handleRespin(newChoice)
    }
  };

  const filteredRecommendations = recommendations.filter(
    (movie) => movie.id !== chosenMovie?.movieTmdbId
  );

  return (
    <main className="container mx-auto my-10 items-center justify-center">
      {chosenMovie && (
               <div className="bg-background-secondary flex flex-col md:flex-row items-center border border-border rounded-md p-6 md:p-8 gap-6 md:gap-8">
          <img
            src={chosenMovie.posterUrl ? `https://image.tmdb.org/t/p/w500/${chosenMovie.posterUrl}` : "https://placehold.co/400x600/222222/9ca3af?text=Poster+Indispon%C3%ADvel"}
            alt={chosenMovie.title}
            className="my-4 "
          />
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {chosenMovie.title}
            </h2>
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
              {chosenMovie.genres && chosenMovie.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="bg-primary text-text-button text-xs font-semibold px-3 py-1 rounded-full"
                >
                  {genre.name}
                </span>
              ))}
            </div>
            <p className="text-lg text-text mb-4">
              Lançado em {chosenMovie.year || "Data desconhecida"}
            </p>
            <p className="text-text leading-relaxed mb-4">
              Duração: {chosenMovie.runtime ? formatRuntime(chosenMovie.runtime) : "Duração não disponível"}
            </p>
            <p className="text-text leading-relaxed">
              {chosenMovie.synopsis || "Sinopse não disponível."}
            </p>
            <p className="text-text text-sm mt-4 flex items-center">
              <FaStar className="text-primary mr-1" />{" "}
              {chosenMovie.vote ? chosenMovie.vote.toFixed(1) : "N/A"}/10
            </p>
            <p className="text-text text-sm mt-4">
              Onde assistir: {chosenMovie.platform || "Informação não disponível"}
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
              />
              <Button
                label={
                  status.watched
                    ? "Desmarcar como assistido"
                    : "Marcar como assistido"
                }
                variant={status.watched ? "sucess" : "primary"}
                onClick={handleWatched}
              />
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8 w-full md:w-1/2 mx-auto">
        <Button
          onClick={updatedHandleRespin}
          label={"Sortear Outro"}
          type="button"
          variant="primary"
        />
        <Button
          onClick={handleReset}
          label={"Começar de Novo"}
          variant="secondary"
          type="button"
        />
      </div>

      <div className="flex flex-col mt-10">
        <h3 className="text-2xl md:text-3xl font-bold text-text-secondary mb-10">
          Outras recomendações da lista
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
          {filteredRecommendations.map((movie, index) => (
            <MovieCard
              key={movie.id || index}
              id={movie.id}
              title={movie.title}
              poster_path={movie.posterUrl}
              vote={movie.vote}
              genres={movie.genres.map((genre) => genre.name)}
              isClickable={false}
            />
          ))}
        </div>
      </div>
    </main>
  );
};

export default RecomendacaoDetails;
