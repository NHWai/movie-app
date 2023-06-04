export function apiGetAllMovies() {
  return fetch(`${process.env.REACT_APP_BASE_URL}/movies/`);
}

export function apiGetMoviesByGenre(genre: string) {
  return fetch(`${process.env.REACT_APP_BASE_URL}/movies/genre/${genre}`);
}

export function apiGetMoviesByUserId(userId: string) {
  return fetch(`${process.env.REACT_APP_BASE_URL}/movies/userId/${userId}`);
}

export function apiGetMovieById(movieId: string) {
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
