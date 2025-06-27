import request from "./request";
import { MovieMetadataParams } from "./types";


/**
 * 
 * @param data - The movie metadata to upload.
 */

export const uploadMovieMetadata = (data: MovieMetadataParams) =>
  request.post<any, { formData: string }>("/api/upload/movie-metadata", data);


