import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MovieUploadUrlState {
  url: string | null;
}

const initialState: MovieUploadUrlState = {
  url: null,
};

const movieUploadUrlSlice = createSlice({
  name: "movieUploadUrl",
  initialState,
  reducers: {
    setMovieUploadUrl: (state, action: PayloadAction<string>) => {
      state.url = action.payload;
    },
    clearMovieUploadUrl: (state) => {
      state.url = null;
    },
  },
});

export const { setMovieUploadUrl, clearMovieUploadUrl } =
  movieUploadUrlSlice.actions;
export default movieUploadUrlSlice.reducer;
