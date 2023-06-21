export function apiFetchAllMovies() {
  return fetch(`${process.env.REACT_APP_BASE_URL}/movies/`);
}

export function apiFetchMoviesByGenre(genre: string) {
  return fetch(`${process.env.REACT_APP_BASE_URL}/movies/genre/${genre}`);
}

export function apiFetchMoviesByUserId(userId: string) {
  return fetch(`${process.env.REACT_APP_BASE_URL}/movies/userId/${userId}`);
}

export function apiFetchMovieById(movieId: string) {
  return fetch(`${process.env.REACT_APP_BASE_URL}/movies/${movieId}`);
}

export function apiDeleteMovie(movie: {
  movieId: string;
  photoId: string;
  tokenStr: string;
}) {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${movie.tokenStr}`);
  return fetch(
    `${process.env.REACT_APP_BASE_URL}/movies/${movie.movieId}/photoid/${movie.photoId}`,
    {
      method: "DELETE",
      headers: myHeaders,
    }
  );
}
