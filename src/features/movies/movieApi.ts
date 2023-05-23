export function apiGetAllMovies() {
  return fetch(`${process.env.REACT_APP_BASE_URL}/movies/`);
}

export function apiGetMoviesByGenre(genre: string) {
  return fetch(`${process.env.REACT_APP_BASE_URL}/movies/genre/${genre}`);
}

export function apiGetMoviesByUserId(userId: string) {
  return fetch(`${process.env.REACT_APP_BASE_URL}/movies/userId/${userId}`);
}
