import { uploadMovieSchema } from "@/components/forms/upload-movie-form/schema";
import { useMutationData } from "./react-query-hooks/useMutationData";
import useZodForm from "./useZodForm";

const uploadMovie = async () => {};

export const useUploadMovie = () => {
  const { mutate, isPending } = useMutationData(
    ["create-movie"],
    () => uploadMovie(),
    "movies"
  );

  const { register, errors, onFormSubmit } = useZodForm(
    uploadMovieSchema,
    mutate
  );

  return {
    register,
    errors,
    onFormSubmit,
    isPending,
  };
};
