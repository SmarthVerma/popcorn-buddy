import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MovieUploadUrlState {
  uploadUrl: string | null;
}

const initialState: MovieUploadUrlState = {
  uploadUrl: null,
};

const movieUploadUrlSlice = createSlice({
  name: "movieUploadUrl",
  initialState,
  reducers: {
    setMovieUploadUrl: (state, action: PayloadAction<MovieUploadUrlState>) => {
      return {
        ...action.payload,
      };
    },
    clearMovieUploadUrl: (state) => {
      state.uploadUrl = null;
    },
  },
});

export const { setMovieUploadUrl, clearMovieUploadUrl } =
  movieUploadUrlSlice.actions;
export default movieUploadUrlSlice.reducer;
