import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  apiDeleteMovie,
  apiGetAllMovies,
  apiGetMoviesByGenre,
  apiGetMoviesByUserId,
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

export const initialState: {
  items: Movie[];
  status: "idle" | "loading" | "failed";
  errMsg: string;
} = {
  items: [
    // {
    //   _id: "",
    //   user: "",
    //   title: "",
    //   director: {
    //     name: "",
    //   },
    //   rating: 0,
    //   review: "",
    //   year: 0,
    //   genres: [],
    //   photoId: "",
    //   photoUrl: "",
    //   totalRating: 0,
    //   totalReviews: 0,
    // },
  ],
  status: "idle",
  errMsg: "",
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
    // deleteMovie: (state, action: PayloadAction<string>) => {
    //   state.items = state.items.filter((movie) => movie._id !== action.payload);
    // },
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
      });
  },
});
export const selectMovies = (state: RootState) => state.movies;
export default moviesSlice.reducer;
