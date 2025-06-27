import { uploadMovieMetadataSchema } from "@/components/forms/upload-movie-form/schema";
import { uploadMovieMetadata } from "@/lib/api";
import { setMovieUploadUrl } from "@/redux/slice/movie-upload-url-slice";
import { useAppDispatch } from "@/redux/store";
import { useRouter } from "next/navigation";
import { useMutationData } from "./react-query-hooks/useMutationData";
import useZodForm from "./useZodForm";
import { UploadMovieInput } from "@/components/forms/types";

const handleMutation = async (data: UploadMovieInput) => {
  console.log("Uploading movie data:", data);

  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("genre", data.genre);
  formData.append("platform", data.platform);

  // Handle file properly
  if (data.thumbnail instanceof File) {
    console.log('reachhed here', data.thumbnail);
    formData.append("thumbnail", data.thumbnail);
  }

  console.log("this is formData", formData);

  try {
    return await uploadMovieMetadata(formData);
  } catch (error) {
    console.error("Error uploading movie metadata:", error);
    throw error; // Re-throw the error to be handled by the mutation hook
  }
};

export const useUploadMovieMetadata = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { mutate, isPending } = useMutationData(
    ["create-movie"],
    (data) => handleMutation(data),
    "movies"
  );

  const { register, errors, onFormSubmit, watch, setValue } = useZodForm(
    uploadMovieMetadataSchema,
    (data) => {
      mutate(data, {
        onSuccess: (responseData) => {
          console.log("Response from API:", responseData);
          if (responseData.formData?.url) {
            dispatch(setMovieUploadUrl(responseData.formData.url));
            // router.push("/movies");
          }
        },
      });
    }
  );

  return {
    register,
    errors,
    onFormSubmit,
    isPending,
    watch,
    setValue,
  };
};

const useUploadMovie = () => {
  // WIP: get movie upload URL and upload movie on that URL
};
