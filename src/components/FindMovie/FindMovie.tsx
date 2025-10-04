import React, { useState } from 'react';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { ResponseError } from '../../types/ReponseError';
import { MovieData } from '../../types/MovieData';
import classNames from 'classnames';

type Props = {
  onAdd: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const [query, setQuery] = useState<string>('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function isError<T extends object>(
    data: T | ResponseError,
  ): data is ResponseError {
    return Object.hasOwn(data, 'Error');
  }

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setError('');
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();

    setIsLoading(true);
    getMovie(query)
      .then(data => {
        if (!isError<MovieData>(data)) {
          const poster =
            data.Poster === 'N/A'
              ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
              : data.Poster;

          const selectedInfo: Movie = {
            title: data.Title,
            description: data.Plot,
            imgUrl: poster,
            imdbUrl: 'https://www.imdb.com/title/' + data.imdbID,
            imdbId: data.imdbID,
          };

          setMovie(selectedInfo);
        }

        if (isError<MovieData>(data)) {
          setError(data.Error);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleAddMovie = () => {
    setQuery('');
    onAdd(movie as Movie);
    setMovie(null);
  };

  return (
    <>
      <form className="find-movie" onSubmit={event => handleSearch(event)}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames('input', { 'is-danger': error.length > 0 })}
              value={query}
              onChange={event => handleQueryChange(event)}
            />
          </div>
          {error.length > 0 && (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>
        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={classNames('button is-light', {
                'is-loading': isLoading,
              })}
              disabled={query.length === 0 && true}
            >
              {movie ? 'Search again' : 'Find a movie'}
            </button>
          </div>
          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddMovie}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>
      {movie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
