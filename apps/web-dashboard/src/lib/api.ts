import request from "./request";
import { Response } from "./types";

/**
 *
 * @param data - The movie metadata to upload.
 */

export const uploadMovieMetadata = (data: FormData) =>
  request.post<any, Response<{ uploadUrl: string }>>(
    "/api/upload/movie-metadata",
    data
  );
