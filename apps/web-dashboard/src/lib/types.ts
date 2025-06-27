// UploadMovieInput is expected to be of type FormData

export type Response<T> = {
  status: number;
  data: T;
  message: string;
};

export type MovieMetadataParams = FormData;
