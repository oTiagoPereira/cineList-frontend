import React, { useState } from 'react';
import axios from 'axios';
import MainLayout from "../layout/mainLayout"
import Input from "../components/Input/Input"
import Button from '../components/Button/Button';
import { FaUser, FaUserFriends } from "react-icons/fa"
import { AiFillCloseCircle, AiOutlineLoading } from "react-icons/ai";

// --- DADOS PARA OS FORMULÁRIOS ---
const movieData = {
  genres: ["Ação", "Comédia", "Drama", "Romance", "Terror", "Ficção Científica", "Aventura", "Fantasia", "Suspense", "Animação"],
  popularActors: ["Tom Hanks", "Scarlett Johansson", "Will Smith", "Dwayne Johnson", "Jennifer Lawrence", "Leonardo DiCaprio", "Robert Downey Jr.", "Meryl Streep"],
  directors: ["Steven Spielberg", "Quentin Tarantino", "Christopher Nolan", "Martin Scorsese", "James Cameron", "Alfred Hitchcock", "Guillermo del Toro"],
};


// --- COMPONENTE PRINCIPAL ---
export default function Recomendacao() {
  const [mode, setMode] = useState('single'); // 'single' ou 'couple'
  const [preferences, setPreferences] = useState({
    user1: { genres: [], actors: [], directors: [], other: '' },
    user2: { genres: [], actors: [], directors: [], other: '' }
  });
  const [recommendations, setRecommendations] = useState([]);
  const [chosenMovie, setChosenMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [view, setView] = useState('form');

  // Lida com a mudança de preferências para qualquer usuário e campo (toggle)
  const handlePreferenceChange = (user, field, value) => {
    setPreferences(prev => {
      const userPrefs = prev[user];
      const newValues = userPrefs[field].includes(value)
        ? userPrefs[field].filter(item => item !== value)
        : [...userPrefs[field], value];
      return {
        ...prev,
        [user]: { ...userPrefs, [field]: newValues }
      };
    });
  };

  // Adiciona uma preferência customizada (ex: ator digitado)
  const addCustomPreference = (user, field, value) => {
    const cleanedValue = value.trim();
    if (!cleanedValue) return;

    setPreferences(prev => {
      const userPrefs = prev[user];
      if (userPrefs[field].map(v => v.toLowerCase()).includes(cleanedValue.toLowerCase())) {
        return prev;
      }
      const newValues = [...userPrefs[field], cleanedValue];
      return {
        ...prev,
        [user]: { ...userPrefs, [field]: newValues }
      };
    });
  };

  const handleTextChange = (user, value) => {
    setPreferences(prev => ({
      ...prev,
      [user]: { ...prev[user], other: value }
    }));
  };


  const fetchRecommendations = async () => {
    setIsLoading(true);
    setError('');
    setRecommendations([]);
    setChosenMovie(null);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BACKEND}/recommendation`,
        {
          mode,
          preferences,
        }
      );
      const movies = response.data.movies;
      if (movies && movies.length > 0) {
        setRecommendations(movies);
        setChosenMovie(movies[Math.floor(Math.random() * movies.length)]);
        setView('results');
      } else {
        throw new Error("Nenhuma recomendação encontrada.");
      }
    } catch (e) {
      console.error("Falha ao buscar recomendações:", e);
      setError("Não foi possível obter as recomendações. Verifique suas preferências e tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRespin = () => {
    let newChoice = chosenMovie;
    if (recommendations.length > 1) {
      while (newChoice.title === chosenMovie.title) {
        newChoice = recommendations[Math.floor(Math.random() * recommendations.length)];
      }
    }
    setChosenMovie(newChoice);
  };

  const handleReset = () => {
    setView('form');
    setRecommendations([]);
    setChosenMovie(null);
    setError('');
    setPreferences({
      user1: { genres: [], actors: [], directors: [], other: '' },
      user2: { genres: [], actors: [], directors: [], other: '' }
    });
  };

  // --- COMPONENTES DE UI ---
  const PreferenceForm = ({ user, title }) => {
    const [actorInput, setActorInput] = useState('');

    const handleAddActor = () => {
      addCustomPreference(user, 'actors', actorInput);
      setActorInput('');
    };

    const handleActorInputKeyDown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleAddActor();
      }
    };

    return (
      <div className="w-full bg-background-secondary p-6 rounded-2xl border border-border space-y-6">
        <h3 className="text-xl font-semibold text-center text-text">{title}</h3>

        {/* Gêneros e Diretores */}
        {['genres', 'directors'].map(field => (
          <div key={field}>
            <h4 className="font-medium text-text-secondary capitalize mb-3">{field === 'genres' ? 'Gêneros' : 'Diretores'}</h4>
            <div className="flex flex-wrap gap-2">
              {movieData[field].map(item => {
                const isSelected = preferences[user][field].includes(item);
                return (
                  <button
                    key={item}
                    onClick={() => handlePreferenceChange(user, field, item)}
                    className={`px-3 py-1.5 text-sm rounded-full transition-all duration-200 ${isSelected
                      ? 'bg-primary text-text-button font-semibold shadow-lg'
                      : 'bg-transparent text-text border border-border hover:bg-primary/20'
                      }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Seção de Atores (Customizável) */}
        <div>
          <h4 className="font-medium text-text-secondary mb-3">Atores / Atrizes</h4>
          <div className="flex gap-2 mb-3 w-full">
            <span className='w-full'><Input type="text" value={actorInput} onChange={e => setActorInput(e.target.value)} onKeyDown={handleActorInputKeyDown} placeholder="Ex: Tom Hanks" /></span>
            <span className='max-w-2/5 md:min-w-1/5'>
              <Button onClick={handleAddActor} label={"Adicionar"} type='button' variant={'primary'} />
            </span>
          </div>
          <div className="flex flex-wrap gap-2 min-h-[2.5rem]">
            {preferences[user].actors.map(actor => (
              <span key={actor} className="flex items-center gap-2 bg-primary text-text-button text-sm font-semibold pl-3 pr-2 py-1 rounded-full animate-fade-in">
                {actor}
                <button onClick={() => handlePreferenceChange(user, 'actors', actor)} className="bg-transparent rounded-full p-0.5 cursor-pointer">
                  <AiFillCloseCircle className="h-5 w-5"/>
                </button>
              </span>
            ))}
          </div>
          {movieData.popularActors && movieData.popularActors.length > 0 && (
            <div className="mt-4">
              <h5 className="font-medium text-text-secondary text-sm mb-3">Ou escolha da lista:</h5>
              <div className="flex flex-wrap gap-2">
                {movieData.popularActors.map(item => {
                  const isSelected = preferences[user].actors.includes(item);
                  return (
                    <button
                      key={item}
                      onClick={() => handlePreferenceChange(user, 'actors', item)}
                      className={`px-3 py-1.5 text-sm rounded-full transition-all duration-200 ${isSelected
                        ? 'bg-primary text-text-button font-semibold shadow-lg'
                        : 'bg-transparent text-text border border-border hover:bg-primary/20'
                        }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="w-full">
          <h4 className="font-medium text-text-secondary mb-3">Algo mais? (Opcional)</h4>
          <Input
            type="text"
            value={preferences[user].other}
            onChange={(e) => handleTextChange(user, e.target.value)}
            placeholder="Ex: 'filme de natal', 'ganhador do oscar'"
          />
        </div>
      </div>
    )
  };

  const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center gap-4">
      <AiOutlineLoading className="animate-spin text-primary w-10 h-10" />
      <p className="text-lg text-gray-300">Carregando...</p>
    </div>
  );

  return (
    <MainLayout>
        <div className="w-full py-8 text-text">
          <header className="text-center mb-10">
            <div className="flex justify-center items-center gap-4 mb-2">
              <h1 className="text-2xl md:text-3xl font-bold text-text-secondary">
                Recomendações de filmes
              </h1>
            </div>
            <p className="text-md text-text">Sugestões de filmes com base no seu gosto</p>
          </header>

          {view === 'form' ? (
            <main className="flex flex-col items-center">
              <div className="w-lg mx-auto bg-background-secondary rounded-2xl p-2 flex gap-2 border border-border mb-8">
                <button onClick={() => setMode('single')} className={`w-1/2 py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-all ${mode === 'single' ? 'bg-primary text-text-button shadow-lg' : 'text-text hover:bg-background-input'}`}>
                  <FaUser className="h-4 w-4" /> Para Mim
                </button>
                <button onClick={() => setMode('couple')} className={`w-1/2 py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-all ${mode === 'couple' ? 'bg-primary text-text-button shadow-lg' : 'text-text hover:bg-background-input'}`}>
                  <FaUserFriends className="h-5 w-5" /> Para Nós
                </button>
              </div>

              <div className={`grid gap-8 transition-all duration-300 ${mode === 'single' ? 'grid-cols-1 max-w-2xl mx-auto' : 'grid-cols-1 lg:grid-cols-2 max-w-6xl mx-auto'}`}>
                <PreferenceForm user="user1" title={mode === 'single' ? 'Suas Preferências' : 'Preferências - Pessoa 1'} />
                {mode === 'couple' && <PreferenceForm user="user2" title="Preferências - Pessoa 2" />}
              </div>

              <div className="mt-10 text-center w-1/5 items-center flex flex-col">
                {isLoading ? <LoadingSpinner /> : (
                  <Button
                    onClick={fetchRecommendations}
                    label={"Recomendar"}
                    type='button'
                    variant={'primary'}
                  />
                )}
                {error && <p className="text-red-400 mt-4">{error}</p>}
              </div>

            </main>
          ) : (
            <main className="max-w-5xl mx-auto flex flex-col items-center">
              {chosenMovie && (
                <div className="bg-background-secondary rounded-md p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 items-center border border-border">
                  <img
                    src={chosenMovie.posterUrl}
                    alt={`Pôster de ${chosenMovie.title}`}
                    className="w-48 md:w-64 h-auto rounded-2xl object-cover shadow-lg border-2 border-border"
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x600/222222/9ca3af?text=Poster+Indispon%C3%ADvel'; }}
                  />
                  <div className="flex-1 text-center md:text-left">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">{chosenMovie.title}</h2>
                    <p className="text-lg text-text mb-4">{chosenMovie.year}</p>
                    <p className="text-text leading-relaxed">{chosenMovie.synopsis}</p>
                    <p className='text-text text-sm mt-4'>Onde assistir: {chosenMovie.platform}</p>
                  </div>
                </div>
              )}
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8 w-full md:max-w-3/6">
                <Button onClick={handleRespin} label={"Sortear Outro"} type='button' variant={'primary'} />
                <Button onClick={handleReset} label={"Começar de Novo"} variant={'secondary'} type='button' />
              </div>

              <div className="mt-12">
                <h3 className="text-2xl font-bold text-center mb-6">Outras recomendações da lista:</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {recommendations.filter(m => m.title !== chosenMovie?.title).map(movie => (
                    <div key={movie.title} className="text-center group">
                      <img
                        src={movie.posterUrl}
                        alt={`Pôster de ${movie.title}`}
                        className="rounded-lg object-cover w-full h-auto mb-2 transform group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x600/222222/9ca3af?text=Poster+Indispon%C3%ADvel'; }}
                      />
                      <h4 className="text-sm font-semibold text-text">{movie.title}</h4>
                      <p className="text-xs text-text opacity-70">{movie.year}</p>
                    </div>
                  ))}
                </div>
              </div>
            </main>
          )}
        </div>
    </MainLayout>
  );
}
