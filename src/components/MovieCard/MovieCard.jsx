import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom"; // 1. Importe o Link

// 2. Receba o 'id' do filme como prop
const MovieCard = ({
  id,
  title,
  poster_path,
  vote = 0,
  genres = [], // Alterado de 'genre' para 'genres' e inicializado como array vazio
  isClickable = true, // Adiciona a prop `isClickable` com valor padrão `true`
}) => {
  console.log(`MovieCard - isClickable: ${isClickable}, id: ${id}`);
  // Pega o primeiro gênero da lista ou define um texto padrão
  const displayGenre = genres && genres.length > 0 ? genres[0] : "Gênero indisponível";

  const cardContent = (
    <>
      <img
        src={poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}` : "https://placehold.co/400x600/222222/9ca3af?text=Poster+Indispon%C3%ADvel"}
        alt={title}
        className="w-full object-cover"
      />
      <div className="p-4 gap-1 flex flex-col">
        <h2 className="text-sm md:text-lg font-semibold text-text truncate">
          {title}
        </h2>
        <p className="text-sm text-text-secondary flex items-center">{displayGenre}</p>
        <p className="text-sm text-text flex items-center">
          <FaStar className="text-text-secondary mr-1" />
          {vote.toFixed(1)}/10
        </p>
      </div>
    </>
  );

  return isClickable ? (
    <Link
      to={`/filme/${id}`}
      className="w-full max-w-55 md:max-w-59 bg-background-secondary rounded-lg shadow-md overflow-hidden transform transition-transform hover:scale-105 hover:shadow-xl"
    >
      {cardContent}
    </Link>
  ) : (
    <div
      className="w-full max-w-55 md:max-w-59 bg-background-secondary rounded-lg shadow-md overflow-hidden"
    >
      {cardContent}
    </div>
  );
};

export default MovieCard;
