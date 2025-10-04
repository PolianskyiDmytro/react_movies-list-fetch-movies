import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const handleAddToList = (movie: Movie) => {
    for (const addedMovie of movies) {
      if (addedMovie.imdbId === movie.imdbId) {
        return;
      }
    }

    setMovies((currMovies: Movie[]) => [...currMovies, movie]);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie onAdd={handleAddToList} />
      </div>
    </div>
  );
};
