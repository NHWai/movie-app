import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiGetUsername } from "./usersApi";
import { RootState } from "../../app/store";

interface User {
  id: string;
  username: string;
}

type Status = "idle" | "loading" | "failed";

const initialState: { data: User; status: Status } = {
  data: {
    id: "",
    username: "",
  },
  status: "idle",
};

export const getUsername = createAsyncThunk(
  "users/apiGetUsername",
  async (userId: string) => {
    const resposnse = await apiGetUsername(userId);
    return resposnse.json();
  }
);

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    //
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUsername.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getUsername.fulfilled, (state, action) => {
        console.log(action.payload);
        state.status = "idle";
        state.data = action.payload.data;
      })
      .addCase(getUsername.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const selectUsers = (state: RootState) => state.users;

export default usersSlice.reducer;
