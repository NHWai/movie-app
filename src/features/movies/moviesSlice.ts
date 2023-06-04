import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Review } from "../reviews/reviewsSlice";

import {
  apiDeleteMovie,
  apiGetAllMovies,
  apiGetMoviesByGenre,
  apiGetMoviesByUserId,
  apiGetMovieById,
} from "./movieApi";
import { RootState } from "../../app/store";

export interface Movie {
  _id: string;
  user: string;
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
}

export interface MovieDetails {
  movie: {
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
  };
  reviews: Review[];
  moreItems: Movie[];
}

export const initialState: {
  items: Movie[];
  status: "idle" | "loading" | "failed";
  errMsg: string;
  movieDetails: MovieDetails;
} = {
  items: [],
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

export const getAllMovies = createAsyncThunk(
  "movies/apiGetAllMovies",
  async () => {
    const response = await apiGetAllMovies();
    return response.json();
  }
);

export const getMoviesByGenre = createAsyncThunk(
  "movies/apiGetMoviesByGenre",
  async (genre: string) => {
    console.log("genre", genre);
    const response = await apiGetMoviesByGenre(genre);
    return response.json();
  }
);

export const getMoviesByUserId = createAsyncThunk(
  "movies/apiGetMoviesByUserId",
  async (userId: string) => {
    const resposne = await apiGetMoviesByUserId(userId);
    return resposne.json();
  }
);

export const getMovieById = createAsyncThunk(
  "movies/apiGetMovieById",
  async (movieId: string) => {
    const response = await apiGetMovieById(movieId);
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
    getMoviesByGenresWithUserId: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((movie) =>
        movie.genres.some((genre) => genre === action.payload)
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllMovies.pending, (state) => {
        state.status = "loading";
        state.items = [];
      })
      .addCase(getAllMovies.fulfilled, (state, action) => {
        state.status = "idle";
        state.items = action.payload.data;
      })
      .addCase(getAllMovies.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(getMoviesByGenre.pending, (state) => {
        state.status = "loading";
        state.items = [];
      })
      .addCase(getMoviesByGenre.fulfilled, (state, action) => {
        state.status = "idle";
        state.items = action.payload.data;
      })
      .addCase(getMoviesByGenre.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(getMoviesByUserId.pending, (state) => {
        state.status = "loading";
        state.items = [];
      })
      .addCase(getMoviesByUserId.fulfilled, (state, action) => {
        state.status = "idle";
        state.items = action.payload.data;
      })
      .addCase(getMoviesByUserId.rejected, (state) => {
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
      .addCase(getMovieById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getMovieById.fulfilled, (state, action) => {
        state.status = "idle";
        state.movieDetails = action.payload.data;
      })
      .addCase(getMovieById.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { getMoviesByGenresWithUserId } = moviesSlice.actions;

export const selectMovies = (state: RootState) => state.movies;
export default moviesSlice.reducer;
