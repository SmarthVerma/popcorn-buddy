import { z } from "zod";

export const GenreEnum = z.enum([
  "ACTION",
  "ADVENTURE",
  "COMEDY",
  "DRAMA",
  "HORROR",
  "ROMANCE",
  "SCI_FI",
  "THRILLER",
  "FANTASY",
]);

export const PlatformEnum = z.enum(["NETFLIX", "AMAZON_PRIME", "HOTSTAR"]);

export const uploadMovieSchema = z.object({
  title: z.string().min(1, "Title is required"),
  genre: GenreEnum,
  platform: PlatformEnum,
  thumbnail: z.instanceof(File, { message: "Thumbnail must be a file" }),
});
