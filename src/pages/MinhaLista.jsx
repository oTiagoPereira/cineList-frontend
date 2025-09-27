import { useEffect, useState } from "react";
import MainLayout from "../layout/mainLayout";
import { getSavedMoviesDetails, removeMovie, toggleWatched } from "../services/userMoviesService";
import SavedMovieCard from "../components/SavedMovieCard/SavedMovieCard";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";
import authService from "../services/authService";

function MinhaLista() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("Todos os filmes");
  const [orderFilter, setOrderFilter] = useState("Data de adição");
  const token = authService.getToken();

  // Buscar lista de favoritos ao montar
  useEffect(() => {
    async function fetchMovies() {
      setLoading(true);
      try {
        const res = await getSavedMoviesDetails();
        setMovies(res.data);
      } catch {
        setMovies([]);
      } finally {
        setLoading(false);
      }
    }
    fetchMovies();
  }, [token]);

  const handleRemove = async (movieTmdbId) => {
    await removeMovie(movieTmdbId);
    setMovies(
      movies.filter(
        (m) => m.id !== movieTmdbId && m.movieTmdbId !== movieTmdbId
      )
    );
  };

  const handleWatched = async (movieTmdbId) => {
    try {
      await toggleWatched(movieTmdbId);
      setMovies(
        movies.map((m) => {
          if (m.id === movieTmdbId || m.movieTmdbId === movieTmdbId) {
            return { ...m, watched: !m.watched };
          }
          return m;
        })
      )
    } catch (error) {
      console.error("Erro ao marcar como assistido:", error);
    }
  };
  return (
    <MainLayout>
      <section className="container mx-auto px-4">
        <header className="flex flex-row items-center justify-between md:items-start mt-10 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-text-secondary">
            Minha Lista
          </h1>
          <span className="flex flex-col md:flex-row gap-4 items-center">
            <select
              name="status"
              id="status"
              className="bg-background-secondary mr-4 border border-border text-text px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="Todos os filmes" className="text-text bg-background-input">Todos os filmes</option>
              <option value="para assistir" className="text-text bg-background-input">Para assistir</option>
              <option value="Assistidos" className="text-text bg-background-input">Assistidos</option>
            </select>
            <select
              name="ordem"
              id="ordem"
              className="bg-background-secondary mr-4 border border-border text-text px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              value={orderFilter}
              onChange={e => setOrderFilter(e.target.value)}
            >
              <option value="Data de adição" className="text-text bg-background-input">Data de adição</option>
              <option value="Título" className="text-text bg-background-input">Título</option>
              <option value="Nota" className="text-text bg-background-input">Nota</option>
            </select>
          </span>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center text-center text-text h-screen">
            <LoadingSpinner />
          </div>
        ) : movies.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center text-text h-screen">
            <p className="text-5xl">🎬</p>
            <p className="text-2xl font-bold mt-4">Sua lista está vazia</p>
            <p className="text-lg mt-2 opacity-80">
              Adicione alguns filmes à lista
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-4 mt-10">
              <div className="flex flex-col items-center bg-background-secondary px-4 py-4 rounded-md mb-4 border border-border">
                <h1 className="text-lg md:text-2xl font-bold text-text-secondary">
                  {movies.length}
                </h1>
                <p className="text-text">Total</p>
              </div>
              <div className="flex flex-col items-center bg-background-secondary px-4 py-4 rounded-md mb-4 border border-border">
                <h1 className="text-lg md:text-2xl font-bold text-sucess">
                  {movies.filter((m) => m.watched).length}
                </h1>
                <p className="text-text">Assistidos</p>
              </div>
              <div className="flex flex-col items-center bg-background-secondary px-4 py-4 rounded-md mb-4 border border-border">
                <h1 className="text-lg md:text-2xl font-bold text-text-secondary">
                  {movies.filter((m) => !m.watched).length}
                </h1>
                <p className="text-text">Para Assistir</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4 mt-10">
              {movies
                .filter((movie) => {
                  if (statusFilter === "Todos os filmes") return true;
                  if (statusFilter === "Assistidos") return movie.watched;
                  if (statusFilter === "para assistir") return !movie.watched;
                  return true;
                })
                .sort((a, b) => {
                  if (orderFilter === "Data de adição") {
                    if (a.createdAt && b.createdAt) {
                      return new Date(b.createdAt) - new Date(a.createdAt);
                    }
                    return 0;
                  }
                  if (orderFilter === "Título") {
                    const titleA = (a.title || a.original_title || "").toLowerCase();
                    const titleB = (b.title || b.original_title || "").toLowerCase();
                    return titleA.localeCompare(titleB);
                  }
                  if (orderFilter === "Nota") {
                    return (b.vote_average || b.vote || 0) - (a.vote_average || a.vote || 0);
                  }
                  return 0;
                })
                .map((movie) => (
                  <SavedMovieCard
                    key={movie.id || movie.movieTmdbId}
                    id={movie.id || movie.movieTmdbId}
                    title={movie.title || movie.original_title || "Filme do TMDB"}
                    poster_path={movie.poster_path}
                    vote={movie.vote_average || movie.vote}
                    genres={movie.genres ? movie.genres.map((g) => g.name) : []}
                    watched={movie.watched}
                    onRemove={() => handleRemove(movie.id || movie.movieTmdbId)}
                    onWatch={() => handleWatched(movie.id || movie.movieTmdbId)}
                  />
                ))}
            </div>
          </>
        )}
      </section>
    </MainLayout>
  );
}

export default MinhaLista;
