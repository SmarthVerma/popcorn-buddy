import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UploadFile {
  id: string;
  name: string;
  size: number;
  type: string;
  progress: number;
  status: "pending" | "uploading" | "completed" | "failed" | "paused";
  uploadUrl: string;
  error?: string;
  startTime?: number;
  completedTime?: number;
}

interface UploadState {
  uploads: Record<string, UploadFile>;
  activeUploads: string[];
  completedUploads: string[];
  failedUploads: string[];
}

const initialState: UploadState = {
  uploads: {},
  activeUploads: [],
  completedUploads: [],
  failedUploads: [],
};

const uploadSlice = createSlice({
  name: "uploads",
  initialState,
  reducers: {
    addUpload: (state, action: PayloadAction<UploadFile>) => {
      const upload = action.payload;
      state.uploads[upload.id] = upload;
      state.activeUploads.push(upload.id);
    },
    updateUploadProgress: (
      state,
      action: PayloadAction<{ id: string; progress: number }>
    ) => {
      const { id, progress } = action.payload;
      if (state.uploads[id]) {
        state.uploads[id].progress = progress;
      }
    },
    updateUploadStatus: (
      state,
      action: PayloadAction<{
        id: string;
        status: UploadFile["status"];
        error?: string;
      }>
    ) => {
      const { id, status, error } = action.payload;
      if (state.uploads[id]) {
        state.uploads[id].status = status;
        if (error) state.uploads[id].error = error;

        // Remove from active uploads
        state.activeUploads = state.activeUploads.filter(
          (uploadId) => uploadId !== id
        );

        // Add to appropriate array
        if (status === "completed") {
          state.uploads[id].completedTime = Date.now();
          if (!state.completedUploads.includes(id)) {
            state.completedUploads.push(id);
          }
        } else if (status === "failed") {
          if (!state.failedUploads.includes(id)) {
            state.failedUploads.push(id);
          }
        }
      }
    },
    pauseUpload: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.uploads[id]) {
        state.uploads[id].status = "paused";
      }
    },
    removeUpload: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      delete state.uploads[id];
      state.activeUploads = state.activeUploads.filter(
        (uploadId) => uploadId !== id
      );
      state.completedUploads = state.completedUploads.filter(
        (uploadId) => uploadId !== id
      );
      state.failedUploads = state.failedUploads.filter(
        (uploadId) => uploadId !== id
      );
    },
  },
});

export const {
  addUpload,
  updateUploadProgress,
  updateUploadStatus,
  pauseUpload,
  removeUpload,
} = uploadSlice.actions;

export default uploadSlice.reducer;
