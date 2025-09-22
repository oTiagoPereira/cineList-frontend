import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import Button from "../Button/Button";

const SavedMovieCard = ({
  id,
  title,
  poster_path,
  vote = 0,
  genres = [],
  watched = false,
  onRemove,
  onWatch,
}) => {
  const displayGenre = genres && genres.length > 0 ? genres[0] : "Gênero indisponível";
  const statusText = watched ? "Assistido" : "Para assistir";
  const statusColor = watched ? "sucess" : "primary";


  return (
    <div className="w-full max-w-55 md:max-w-59 bg-background-secondary rounded-lg shadow-md overflow-hidden">
      <Link to={`/filme/${id}`}>
        <img
          src={poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}` : "https://placehold.co/400x600/222222/9ca3af?text=Poster+Indispon%C3%ADvel"}
          alt={title}
          className="w-full object-cover"
        />
      </Link>
      <div className="p-4 gap-1 flex flex-col">
        <h2 className="text-sm md:text-lg font-semibold text-text truncate">{title}</h2>
        <p className="text-sm text-text-secondary flex items-center">{displayGenre}</p>
        <p className="text-sm text-text flex items-center">
          <FaStar className="text-text-secondary mr-1" />
          {vote.toFixed(1)}/10
        </p>
        <span className="flex flex-col gap-4 mt-2">
          <Button
          variant={statusColor}
            onClick={onWatch}
            label={statusText}
          />
          <Button
          variant={"delete"}
            onClick={onRemove}
            label="Remover"
          />
        </span>
      </div>
    </div>
  );
};

export default SavedMovieCard;
