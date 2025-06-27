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
    formData.append("thumbnail", data.thumbnail);
  }

  try {
    const response = await uploadMovieMetadata(formData);
    console.log("Upload response:", response);
    return response;
  } catch (error) {
    console.error("Error uploading movie metadata:", error);
    throw error; // Re-throw the error to be handled by the mutation hook
  }
};
type UploadMovieMetadataResponse = Awaited<
  ReturnType<typeof uploadMovieMetadata>
>;
export const useUploadMovieMetadata = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { mutate, isPending } = useMutationData<UploadMovieMetadataResponse>(
    ["create-movie"],
    (data) => handleMutation(data),
    "movies",
    (data) => {
      console.log("Movie upload completed", data.data);
      if (data?.status === 201 || data?.status === 200) {
        dispatch(setMovieUploadUrl(data?.data));
        router.push("upload/movie");
      }
    }
  );

  const { register, errors, onFormSubmit, watch, setValue } = useZodForm(
    uploadMovieMetadataSchema,
    (data) => {
      mutate(data);
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

// const useUploadMovie = () => {
//   // WIP: get movie upload URL and upload movie on that URL
// };
