
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

export interface TripRequest {
  id: string;
  trip_id: string;
  user_id: string;
  message: string | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  trips?: {
    id: string;
    title: string;
    destination: string;
    image_url: string | null;
  };
}

export function useTripRequests() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function getRequestsForTrip(tripId: string) {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from("trip_requests")
        .select("*, profiles(id, username, full_name, avatar_url)")
        .eq("trip_id", tripId);

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error: any) {
      console.error("Error fetching trip requests:", error);
      toast({
        title: "Error loading requests",
        description: error.message,
        variant: "destructive",
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  }

  async function getUserRequests() {
    if (!user) return [];
    
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from("trip_requests")
        .select("*, trips(id, title, destination, image_url)")
        .eq("user_id", user.id);

      if (error) {
        throw error;
      }

      // Cast the data to ensure it matches our TripRequest interface
      return data as TripRequest[] || [];
    } catch (error: any) {
      console.error("Error fetching user requests:", error);
      toast({
        title: "Error loading your requests",
        description: error.message,
        variant: "destructive",
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  }

  async function createRequest(tripId: string, message: string) {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to send a request",
        variant: "destructive",
      });
      return null;
    }
    
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from("trip_requests")
        .insert([
          { trip_id: tripId, user_id: user.id, message: message }
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast({
        title: "Request sent",
        description: "Your request to join this trip has been sent",
      });

      return data;
    } catch (error: any) {
      console.error("Error creating trip request:", error);
      
      if (error.code === '23505') {
        toast({
          title: "Request already sent",
          description: "You've already sent a request to join this trip",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error sending request",
          description: error.message,
          variant: "destructive",
        });
      }
      
      return null;
    } finally {
      setIsLoading(false);
    }
  }

  async function updateRequestStatus(requestId: string, status: 'approved' | 'rejected') {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from("trip_requests")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", requestId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // If approved, update the current_travelers count on the trip
      if (status === 'approved') {
        const tripId = data.trip_id;
        
        await supabase.rpc('increment_trip_travelers', { trip_id: tripId });
      }

      toast({
        title: `Request ${status}`,
        description: `The request has been ${status}`,
      });

      return data;
    } catch (error: any) {
      console.error("Error updating trip request:", error);
      
      toast({
        title: "Error updating request",
        description: error.message,
        variant: "destructive",
      });
      
      return null;
    } finally {
      setIsLoading(false);
    }
  }

  return {
    isLoading,
    getRequestsForTrip,
    getUserRequests,
    createRequest,
    updateRequestStatus,
  };
}
