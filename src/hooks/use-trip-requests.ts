
import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface TripRequest {
  id: string;
  trip_id: string;
  user_id: string;
  status: "pending" | "approved" | "rejected";
  message: string | null;
  created_at: string | null;
  updated_at: string | null;
  trips?: {
    id: string;
    title: string;
    destination: string;
    user_id: string;
  };
}

export const useTripRequests = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Get requests for a trip (as the trip owner)
  const getTripRequests = useCallback(
    async (tripId: string): Promise<TripRequest[]> => {
      if (!user) return [];

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("trip_requests")
          .select(
            `
            *,
            trips:trip_id (
              id,
              title,
              destination,
              user_id
            )
          `
          )
          .eq("trip_id", tripId);

        if (error) {
          throw error;
        }

        return data as TripRequest[] || [];
      } catch (error: any) {
        console.error("Error fetching trip requests:", error);
        toast({
          title: "Error",
          description: "Failed to load trip requests",
          variant: "destructive",
        });
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    [user, toast]
  );

  // Get requests from a user (their sent requests)
  const getUserRequests = useCallback(async (): Promise<TripRequest[]> => {
    if (!user) return [];

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("trip_requests")
        .select(
          `
          *,
          trips:trip_id (
            id,
            title,
            destination,
            user_id
          )
        `
        )
        .eq("user_id", user.id);

      if (error) {
        throw error;
      }

      return data as TripRequest[] || [];
    } catch (error: any) {
      console.error("Error fetching user requests:", error);
      toast({
        title: "Error",
        description: "Failed to load your trip requests",
        variant: "destructive",
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  // Send a request to join a trip
  const sendTripRequest = useCallback(
    async (tripId: string, message: string) => {
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to send trip requests",
          variant: "destructive",
        });
        return false;
      }

      setIsLoading(true);
      try {
        // Check if request already exists
        const { data: existingRequest } = await supabase
          .from("trip_requests")
          .select("*")
          .eq("trip_id", tripId)
          .eq("user_id", user.id)
          .single();

        if (existingRequest) {
          toast({
            title: "Request exists",
            description: "You have already sent a request for this trip",
          });
          return false;
        }

        const { error } = await supabase.from("trip_requests").insert([
          {
            trip_id: tripId,
            user_id: user.id,
            message,
            status: "pending",
          },
        ]);

        if (error) {
          throw error;
        }

        toast({
          title: "Request sent",
          description: "Your request to join the trip has been sent",
        });

        return true;
      } catch (error: any) {
        console.error("Error sending trip request:", error);
        toast({
          title: "Error",
          description: "Failed to send trip request",
          variant: "destructive",
        });
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [user, toast]
  );

  // Update request status (approve/reject)
  const updateRequestStatus = useCallback(
    async (requestId: string, status: "approved" | "rejected") => {
      if (!user) return false;

      setIsLoading(true);
      try {
        const { error } = await supabase
          .from("trip_requests")
          .update({ status, updated_at: new Date().toISOString() })
          .eq("id", requestId);

        if (error) {
          throw error;
        }

        toast({
          title: `Request ${status}`,
          description: `The trip request has been ${status}`,
        });

        return true;
      } catch (error: any) {
        console.error("Error updating request status:", error);
        toast({
          title: "Error",
          description: "Failed to update request status",
          variant: "destructive",
        });
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [user, toast]
  );

  return {
    isLoading,
    getTripRequests,
    getUserRequests,
    sendTripRequest,
    updateRequestStatus,
  };
};
