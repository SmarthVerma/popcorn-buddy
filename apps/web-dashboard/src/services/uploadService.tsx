import { store } from "@/redux/store";
import {
  addUpload,
  pauseUpload,
  updateUploadProgress,
  updateUploadStatus,
  UploadFile,
} from "@/redux/slices/uploadSlice";

class UploadService {
  private activeUploads: Map<string, XMLHttpRequest> = new Map();

  async startUpload(file: File, uploadUrl: string): Promise<string> {
    const uploadId = `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const uploadFile: UploadFile = {
      id: uploadId,
      name: file.name,
      size: file.size,
      type: file.type,
      progress: 0,
      status: "pending",
      uploadUrl,
      startTime: Date.now(),
    };

    // Add to Redux store
    store.dispatch(addUpload(uploadFile));

    // Start the actual upload
    this.performUpload(uploadId, file, uploadUrl);

    return uploadId;
  }

  private performUpload(uploadId: string, file: File, uploadUrl: string) {
    const xhr = new XMLHttpRequest();
    this.activeUploads.set(uploadId, xhr);

    // Update status to uploading
    store.dispatch(updateUploadStatus({ id: uploadId, status: "uploading" }));

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        store.dispatch(
          updateUploadProgress({ id: uploadId, progress: percentComplete })
        );
      }
    };

    xhr.onload = () => {
      this.activeUploads.delete(uploadId);
      if (xhr.status === 200 || xhr.status === 204) {
        store.dispatch(
          updateUploadStatus({ id: uploadId, status: "completed" })
        );
      } else {
        store.dispatch(
          updateUploadStatus({
            id: uploadId,
            status: "failed",
            error: `Upload failed with status: ${xhr.status}`,
          })
        );
      }
    };

    xhr.onerror = () => {
      this.activeUploads.delete(uploadId);
      store.dispatch(
        updateUploadStatus({
          id: uploadId,
          status: "failed",
          error: "Network error occurred during upload",
        })
      );
    };

    xhr.onabort = () => {
      this.activeUploads.delete(uploadId);
      store.dispatch(
        updateUploadStatus({
          id: uploadId,
          status: "paused",
        })
      );
    };

    xhr.open("PUT", uploadUrl);
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.send(file);
  }

  pauseUpload(uploadId: string) {
    const xhr = this.activeUploads.get(uploadId);
    if (xhr) {
      xhr.abort();
      store.dispatch(pauseUpload(uploadId));
    }
  }

  resumeUpload(uploadId: string) {
    // Note: Resuming uploads requires server support for range requests
    // This is a simplified version - you'd need to implement chunked uploads for true resume functionality
    console.log("Resume functionality requires chunked upload implementation");
  }

  getActiveUploads() {
    return Array.from(this.activeUploads.keys());
  }
}

export const uploadService = new UploadService();
