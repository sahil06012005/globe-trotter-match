
// Re-export the toast hook and function from its actual location
import { useToast as importedUseToast, toast as importedToast } from "@/hooks/use-toast";

// Export both items
export const useToast = importedUseToast;
export const toast = importedToast;
