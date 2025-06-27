import request from "./request";
import { MovieMetadataParams, Response } from "./types";

/**
 *
 * @param data - The movie metadata to upload.
 */

export const uploadMovieMetadata = (data: MovieMetadataParams) =>
  request.post<any, Response<{ uploadUrl: string }>>(
    "/api/upload/movie-metadata",
    data
  );
