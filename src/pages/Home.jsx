import React, { useState } from "react";
import MainLayout from "../layout/mainLayout";
import Button from "../components/Button/Button";
import Input from "../components/Input/Input";
import getMoviesPopulares from "../services/getMoviesPopulares";
import MovieCard from "../components/MovieCard/MovieCard";
import { AiOutlineLoading } from "react-icons/ai";
import { useQuery } from "@tanstack/react-query";
import getGenres from "../services/getGenres";
import getTopRated from "../services/getTopRated";
import searchMovies from "../services/searchMovies";

function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchValue, setSearchValue] = useState(""); // valor do input
  // 1. Substituir useState e useEffect pelo hook useQuery
  const {
    data: moviesData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["popularMovies"],
    queryFn: getMoviesPopulares,
    staleTime: 1000 * 60 * 5, // 5 minutos de cache
  });

  const {
    data: topRatedMoviesData,
    isLoading: isLoadingTopRated,
    isError: isErrorTopRated,
    error: errorTopRated,
  } = useQuery({
    queryKey: ["topRatedMovies"],
    queryFn: getTopRated,
    staleTime: 1000 * 60 * 5, // 5 minutos de cache
  });

  // Query para buscar a lista de gêneros (usará o cache se já tiver sido buscada pela MovieDetails)
  const { data: genresList = [] } = useQuery({
    queryKey: ["genres"],
    queryFn: getGenres,
    staleTime: 1000 * 60 * 60 * 24, // Cache de 24 horas, pois não muda
    retry: false, // Não tente novamente se falhar, para não poluir o console
  });

  // Função auxiliar para criar um mapa de busca de gêneros (ID -> Nome)
  // useMemo garante que o mapa só seja recriado se a lista de gêneros mudar.
  const genresMap = React.useMemo(() => {
    if (!genresList.length) return new Map();
    return new Map(genresList.map((genre) => [genre.id, genre.name]));
  }, [genresList]);

  // Função que traduz os IDs de um filme para nomes de gêneros
  const getGenreNames = (genreIds) => {
    if (!genreIds || !genresMap.size) return [];
    return genreIds.map((id) => genresMap.get(id)).filter(Boolean); // .filter(Boolean) remove os nulos/undefined
  };

  // Query para pesquisa de filmes
  const {
    data: searchResults,
    isLoading: isLoadingSearch,
    isError: isErrorSearch,
    error: errorSearch,
  } = useQuery({
    queryKey: ["searchMovies", searchTerm],
    queryFn: () => searchMovies({ query: searchTerm }),
    enabled: !!searchTerm, // só busca se houver termo
    staleTime: 1000 * 60 * 2,
  });

  const handleSearch = (event) => {
    event.preventDefault();
    setSearchTerm(searchValue.trim());
  };

  // 2. Garantir que temos um array para mapear
  const popularMovies = moviesData?.results || [];

  // 3. Garantir que temos um array para mapear
  const topRatedMovies = topRatedMoviesData?.results || [];

  return (
    <MainLayout>
      <div className="container mx-auto px-4">
        <header className="flex flex-col items-center justify-center md:items-start mt-10 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-text-secondary">
            Pesquisar filmes
          </h1>
          <form onSubmit={handleSearch} className="flex items-center space-x-4 md:w-3/5 w-full md:items-start">
            <Input
              id="search"
              type="text"
              placeholder="Pesquisar filmes"
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
            />
            <span className="flex items-center md:w-1/5">
              <Button label="Buscar" variant="primary" type="submit" />
            </span>
          </form>
        {/* Resultados da pesquisa */}
        {searchTerm && (
          <div className="flex flex-col w-full items-center justify-center mt-10 gap-4 md:items-start overflow-hidden">
            <h1 className="text-2xl md:text-3xl font-bold text-text-secondary">
              Resultados da pesquisa
            </h1>
            {isLoadingSearch ? (
              <div className="flex flex-col items-center justify-center gap-4 h-40">
                <AiOutlineLoading className="animate-spin text-primary w-10 h-10" />
                <p className="text-lg text-gray-300">Carregando...</p>
              </div>
            ) : isErrorSearch ? (
              <p className="text-center mt-10 text-red-500">Ocorreu um erro: {errorSearch?.message}</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4 ">
                {(searchResults?.results?.length > 0 ? searchResults.results : []).map((movie) => (
                  <MovieCard
                    key={movie.id}
                    id={movie.id}
                    title={movie.title}
                    poster_path={movie.poster_path}
                    vote={movie.vote_average}
                    genres={getGenreNames(movie.genre_ids)}
                  />
                ))}
                {searchResults?.results?.length === 0 && (
                  <p className="text-center col-span-full text-gray-400">Nenhum filme encontrado.</p>
                )}
              </div>
            )}
          </div>
        )}
        </header>

        <div className="flex flex-col w-full items-center justify-center mt-10 gap-4 md:items-start overflow-hidden">
          <h1 className="text-2xl md:text-3xl font-bold text-text-secondary">
            Filmes Populares
          </h1>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center gap-4 h-40">
              <AiOutlineLoading className="animate-spin text-primary w-10 h-10" />
              <p className="text-lg text-gray-300">Carregando...</p>
            </div>
          ) : isError ? (
            <p className="text-center mt-10 text-red-500">Ocorreu um erro: {error?.message}</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4 ">
              {popularMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  id={movie.id}
                  title={movie.title}
                  poster_path={movie.poster_path}
                  vote={movie.vote_average}
                  genres={getGenreNames(movie.genre_ids)}
                />
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-col w-full items-center justify-center mt-10 gap-4 md:items-start overflow-hidden">
          <h1 className="text-2xl md:text-3xl font-bold text-text-secondary">
            Filmes mais avaliados
          </h1>
          {isLoadingTopRated ? (
            <div className="flex flex-col items-center justify-center gap-4 h-40">
              <AiOutlineLoading className="animate-spin text-primary w-10 h-10" />
              <p className="text-lg text-gray-300">Carregando...</p>
            </div>
          ) : isErrorTopRated ? (
            <p className="text-center mt-10 text-red-500">Ocorreu um erro: {errorTopRated?.message}</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4 ">
              {topRatedMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  id={movie.id}
                  title={movie.title}
                  poster_path={movie.poster_path}
                  vote={movie.vote_average}
                  genres={getGenreNames(movie.genre_ids)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default Home;
