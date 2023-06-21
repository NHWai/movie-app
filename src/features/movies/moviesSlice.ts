import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Review } from "../reviews/reviewsSlice";

import {
  apiDeleteMovie,
  apiFetchAllMovies,
  apiFetchMoviesByGenre,
  apiFetchMoviesByUserId,
  apiFetchMovieById,
} from "./movieApi";
import { RootState } from "../../app/store";

export interface Movie {
  _id: string;
  user: {
    _id: string;
    username: string;
  };
  title: string;
  director: {
    name: string;
  };
  rating: number;
  review: string;
  year: number;
  genres: string[];
  photoId: string;
  photoUrl: string;
  totalRating: number;
  totalReviews: number;
  [key: string]:
    | string
    | number
    | string[]
    | { _id: string; username: string }
    | { name: string };
}

export interface MovieDetails {
  movie: Movie;
  reviews: Review[];
  moreItems: Movie[];
}

export const initialState: {
  items: Movie[];
  filteredItems: Movie[];
  status: "idle" | "loading" | "failed";
  errMsg: string;
  movieDetails: MovieDetails;
} = {
  items: [],
  filteredItems: [],
  status: "idle",
  errMsg: "",
  movieDetails: {
    movie: {
      _id: "",
      user: {
        _id: "",
        username: "",
      },
      title: "",
      director: {
        name: "",
      },
      rating: 0,
      review: "",
      year: 0,
      genres: [],
      photoId: "",
      photoUrl: "",
      totalRating: 0,
      totalReviews: 0,
    },
    reviews: [],
    moreItems: [],
  },
};

export const fetchAllMovies = createAsyncThunk(
  "movies/apiFetchAllMovies",
  async () => {
    const response = await apiFetchAllMovies();
    return response.json();
  }
);

export const fetchMoviesByGenre = createAsyncThunk(
  "movies/apiFetchMoviesByGenre",
  async (genre: string) => {
    console.log("genre", genre);
    const response = await apiFetchMoviesByGenre(genre);
    return response.json();
  }
);

export const fetchMoviesByUserId = createAsyncThunk(
  "movies/apiFetchMoviesByUserId",
  async (userId: string) => {
    const resposne = await apiFetchMoviesByUserId(userId);
    return resposne.json();
  }
);

export const fetchMovieById = createAsyncThunk(
  "movies/apiFetchMovieById",
  async (movieId: string) => {
    const response = await apiFetchMovieById(movieId);
    return response.json();
  }
);

export const deleteMovie = createAsyncThunk(
  "movies/apiDeleteMovie",
  async (
    movie: { movieId: string; photoId: string; tokenStr: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiDeleteMovie(movie);
      if (response.status === 204) {
        return movie.movieId;
      } else if (response.status === 401) {
        throw Error(`Unauthorized user, login or signup`);
      } else {
        throw Error("Failed to delete movie");
      }
    } catch (error: any) {
      const errorMessage = error?.message || "Failed to delete movie.";
      return rejectWithValue(errorMessage);
    }
  }
);

export const moviesSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {
    getAllMovies: (state) => {
      state.filteredItems = state.items;
    },
    getMoviesByGenresWithUserId: (
      state,
      action: PayloadAction<{ userId: string; genre: string }>
    ) => {
      state.filteredItems = state.items
        .filter((movie) => movie.user._id === action.payload.userId)
        .filter((movie) =>
          movie.genres.some((genre) => genre === action.payload.genre)
        );
    },
    getMoviesByGenre: (state, action: PayloadAction<string>) => {
      state.filteredItems = state.items.filter((movie) =>
        movie.genres.some((genre) => genre === action.payload)
      );
    },
    getMoviesByUserId: (state, action: PayloadAction<string>) => {
      state.filteredItems = state.items.filter(
        (movie) => movie.user._id === action.payload
      );
    },
    updateMovieInStore: (state, action: PayloadAction<Movie>) => {
      state.items = state.items.map((movie) =>
        movie.id === action.payload._id ? action.payload : movie
      );
      state.movieDetails.movie = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllMovies.pending, (state) => {
        state.status = "loading";
        state.items = [];
      })
      .addCase(fetchAllMovies.fulfilled, (state, action) => {
        state.status = "idle";
        state.items = action.payload.data;
      })
      .addCase(fetchAllMovies.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(fetchMoviesByGenre.pending, (state) => {
        state.status = "loading";
        state.items = [];
      })
      .addCase(fetchMoviesByGenre.fulfilled, (state, action) => {
        state.status = "idle";
        state.items = action.payload.data;
      })
      .addCase(fetchMoviesByGenre.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(fetchMoviesByUserId.pending, (state) => {
        state.status = "loading";
        state.items = [];
      })
      .addCase(fetchMoviesByUserId.fulfilled, (state, action) => {
        state.status = "idle";
        state.items = action.payload.data;
      })
      .addCase(fetchMoviesByUserId.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(deleteMovie.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteMovie.fulfilled, (state, action) => {
        state.status = "idle";
        state.items = state.items.filter(
          (movie) => movie._id !== action.payload
        );
      })
      .addCase(deleteMovie.rejected, (state, action) => {
        state.status = "failed";
        state.errMsg = action.payload as string;
      })
      .addCase(fetchMovieById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMovieById.fulfilled, (state, action) => {
        state.status = "idle";
        state.movieDetails = action.payload.data;
      })
      .addCase(fetchMovieById.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const {
  getMoviesByGenresWithUserId,
  updateMovieInStore,
  getAllMovies,
  getMoviesByGenre,
  getMoviesByUserId,
} = moviesSlice.actions;

export const selectMovies = (state: RootState) => state.movies;
export default moviesSlice.reducer;
