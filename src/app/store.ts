import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import moviesReducer from "../features/movies/moviesSlice";
import usersReducer from "../features/users/usersSlice";
import reviewsReducer from "../features/reviews/reviewsSlice";

export const store = configureStore({
  reducer: {
    movies: moviesReducer,
    users: usersReducer,
    reviews: reviewsReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
