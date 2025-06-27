/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  MutationFunction,
  MutationKey,
  useMutation,
  useMutationState,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export const useMutationData = <TResponse = any>(
  mutationKey: MutationKey,
  mutationFn: MutationFunction<any, any>,
  queryKey?: string,
  onSuccess?: (data?: TResponse) => void // custom onSuccess callback
) => {
  const client = useQueryClient();
  const { mutate, isPending } = useMutation<TResponse, any>({
    mutationKey,
    mutationFn,
    onSuccess(data) {
      if (onSuccess) onSuccess(data);
      console.log("before", data);
      if ((data as any)?.status === 201 && (data as any)?.message) {
        console.log("after", data);
        toast("Success", { description: (data as any).message });
      }
    },
    onError: (error: AxiosError["response"]) => {
      console.error("Error occurred:", error?.status, error);
      if (error?.status === 400 && error?.error) {
        toast.error("Error", {
          description: error?.error || "An error occurred",
        });
      }
    },
    onSettled: async () => {
      return await client.invalidateQueries({ queryKey: [queryKey] });
    },
  });

  return { mutate, isPending };
};

export const useMutationDataState = (mutationKey: MutationKey) => {
  const data = useMutationState({
    filters: { mutationKey },
    select: (mutation) => {
      return {
        variables: mutation.state.variables as any,
        status: mutation.state.status,
      };
    },
  });

  const latestVariables = data[data.length - 1];
  return { latestVariables };
};
