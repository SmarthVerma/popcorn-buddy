import z from "zod";
import { uploadMovieSchema } from "./upload-movie-form/schema";

export type UploadMovieInput = z.infer<typeof uploadMovieSchema>;
