import { toast } from "sonner";

export interface ToastTripletConfig {
  id: string;
  loading: string;
  success: string;
  error: string;
}

export function attachToastTriplet(config: ToastTripletConfig) {
  return {
    onMutate() {
      toast.loading(config.loading, { id: config.id });
    },
    onSuccess() {
      toast.success(config.success, { id: config.id });
    },
    onError() {
      toast.error(config.error, { id: config.id });
    },
  };
}
