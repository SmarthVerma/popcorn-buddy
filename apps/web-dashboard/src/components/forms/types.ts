import z from "zod";
import { uploadMovieMetadataSchema } from "./upload-movie-form/schema";

export type UploadMovieInput = z.infer<typeof uploadMovieMetadataSchema>;
