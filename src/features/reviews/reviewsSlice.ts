import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiGetReviewsByMovieId, apiUploadReview } from "./reviewsApi";
import { RootState } from "../../app/store";

export interface Review {
  _id: string;
  rating: number;
  comment: string;
  movieId: string;
  userId: string;
  username: string;
}

export interface ReviewInputType extends Review {
  tokenStr: string;
}

type Status = "idle" | "loading" | "failed";

const initialState: { items: Review[]; status: Status; errMsg: string } = {
  items: [],
  status: "idle",
  errMsg: "",
};

export const getReviewsByMovieId = createAsyncThunk(
  "reviews/apiGetReviewsByMovieId",
  async (movieId: string) => {
    const response = await apiGetReviewsByMovieId(movieId);
    return response.json();
  }
);

export const uploadReview = createAsyncThunk(
  "reviews/apiUploadReview",
  async (review: ReviewInputType, { rejectWithValue }) => {
    try {
      const response = await apiUploadReview(review);
      if (response.status === 201) {
        return response.json();
      } else if (response.status === 401) {
        throw Error(`Unauthorized user, login or signup`);
      } else {
        throw Error("Failed to upload review.");
      }
    } catch (error: any) {
      const errorMessage = error?.message || "Failed to upload review.";
      return rejectWithValue(errorMessage);
    }
  }
);

export const reviewsSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {
    removeReviews(state) {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadReview.pending, (state) => {
        state.status = "loading";
      })
      .addCase(uploadReview.fulfilled, (state, action) => {
        state.status = "idle";
        state.items.push(action.payload.data);
      })
      .addCase(uploadReview.rejected, (state, action) => {
        state.status = "failed";
        state.errMsg = action.payload as string;
      })
      .addCase(getReviewsByMovieId.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getReviewsByMovieId.fulfilled, (state, action) => {
        state.status = "idle";
        state.items = action.payload.data;
      })
      .addCase(getReviewsByMovieId.rejected, (state) => {
        state.status = "failed";
        state.errMsg = "Failed to fetch the reviews";
      });
  },
});

export const { removeReviews } = reviewsSlice.actions;
export const selectReviews = (state: RootState) => state.reviews;
export default reviewsSlice.reducer;
