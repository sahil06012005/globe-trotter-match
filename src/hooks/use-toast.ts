
import { useToast as useToastHook } from "@/components/ui/use-toast";
import { toast as toastNotification } from "@/components/ui/use-toast";

export function useToast() {
  return useToastHook();
}

export const toast = toastNotification;
