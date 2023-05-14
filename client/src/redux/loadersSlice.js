import { createSlice } from "@reduxjs/toolkit";

export const loadersSlice = createSlice({
  name: "loaders",
  initialState: {
    loading: false,
  },
  reducers: {
    SetLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { SetLoading } = loadersSlice.actions;
