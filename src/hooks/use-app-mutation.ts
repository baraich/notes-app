import { useMutation, type UseMutationOptions, type UseMutationResult, QueryClient, useQueryClient } from "@tanstack/react-query";
import { attachToastTriplet, type ToastTripletConfig } from "@/lib/toast-helpers";

interface AppMutationOptions<TData = unknown, TError = unknown, TVariables = void, TContext = unknown> {
  base: UseMutationOptions<TData, TError, TVariables, TContext>;
  toast?: ToastTripletConfig;
  invalidate?: Array<(queryClient: QueryClient) => void>;
}

export function useAppMutation<TData = unknown, TError = unknown, TVariables = void, TContext = unknown>(
  options: AppMutationOptions<TData, TError, TVariables, TContext>,
): UseMutationResult<TData, TError, TVariables, TContext> {
  const queryClient = useQueryClient();
  const toastHandlers = options.toast ? attachToastTriplet(options.toast) : undefined;

  return useMutation<TData, TError, TVariables, TContext>({
    ...options.base,
    onMutate: async (variables) => {
      toastHandlers?.onMutate();
      return options.base.onMutate?.(variables);
    },
    onSuccess: (data, variables, context) => {
      toastHandlers?.onSuccess();
      options.invalidate?.forEach((fn) => fn(queryClient));
      options.base.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toastHandlers?.onError();
      options.base.onError?.(error, variables, context);
    },
  });
}
