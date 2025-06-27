import { GenreEnum, PlatformEnum } from "./schema";

export const GENRE_OPTIONS = GenreEnum.options.map((value) => ({
  label: toTitleCase(value.replace("_", " ")),
  value,
}));

export const PLATFORM_OPTIONS = PlatformEnum.options.map((value) => ({
  label: toTitleCase(value.replace("_", " ")),
  value,
}));

// Helper to format labels:
function toTitleCase(str: string) {
  return str
    .toLowerCase()
    .replace(/(^|\s)\S/g, (letter) => letter.toUpperCase());
}
