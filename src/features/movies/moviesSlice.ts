import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
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

export const moviesSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {
    deleteMovie: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((movie) => movie._id !== action.payload);
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
      });
  },
});
export const selectMovies = (state: RootState) => state.movies;
export const { deleteMovie } = moviesSlice.actions;
export default moviesSlice.reducer;
