
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Trip {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  destination: string;
  start_date: string;
  end_date: string;
  budget: string;
  max_travelers: number;
  current_travelers: number;
  interests: string[] | null;
  image_url: string | null;
  created_at: string;
  status: 'planning' | 'confirmed' | 'completed' | 'cancelled';
}

export function useTrips() {
  const { toast } = useToast();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTrips();
  }, []);

  async function fetchTrips() {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from("trips")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      // Cast the data to ensure it matches our Trip interface
      const typedData = data as Trip[];
      setTrips(typedData || []);
    } catch (error: any) {
      console.error("Error fetching trips:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function getTripById(id: string) {
    try {
      const { data, error } = await supabase
        .from("trips")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        throw error;
      }

      return data as Trip;
    } catch (error: any) {
      console.error("Error fetching trip:", error);
      toast({
        title: "Error loading trip",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  }

  async function createTrip(tripData: Omit<Trip, "id" | "user_id" | "created_at" | "current_travelers">) {
    try {
      const { data, error } = await supabase
        .from("trips")
        .insert([{ ...tripData, user_id: supabase.auth.getUser().then(res => res.data.user?.id) }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      setTrips((prevTrips) => [data as Trip, ...prevTrips]);

      toast({
        title: "Trip created",
        description: "Your trip has been created successfully",
      });

      return data as Trip;
    } catch (error: any) {
      console.error("Error creating trip:", error);
      
      toast({
        title: "Error creating trip",
        description: error.message,
        variant: "destructive",
      });
      
      return null;
    }
  }

  async function updateTrip(id: string, updates: Partial<Trip>) {
    try {
      const { data, error } = await supabase
        .from("trips")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setTrips((prevTrips) =>
        prevTrips.map((trip) => (trip.id === id ? { ...trip, ...data } as Trip : trip))
      );

      toast({
        title: "Trip updated",
        description: "Your trip has been updated successfully",
      });

      return data as Trip;
    } catch (error: any) {
      console.error("Error updating trip:", error);
      
      toast({
        title: "Error updating trip",
        description: error.message,
        variant: "destructive",
      });
      
      return null;
    }
  }

  async function deleteTrip(id: string) {
    try {
      const { error } = await supabase
        .from("trips")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }

      setTrips((prevTrips) => prevTrips.filter((trip) => trip.id !== id));

      toast({
        title: "Trip deleted",
        description: "Your trip has been deleted successfully",
      });

      return true;
    } catch (error: any) {
      console.error("Error deleting trip:", error);
      
      toast({
        title: "Error deleting trip",
        description: error.message,
        variant: "destructive",
      });
      
      return false;
    }
  }

  async function uploadTripImage(file: File, tripId: string) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${tripId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("trips")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("trips").getPublicUrl(filePath);

      // Update the trip with the new image URL
      await updateTrip(tripId, { image_url: data.publicUrl });
      
      return data.publicUrl;
    } catch (error: any) {
      console.error("Error uploading trip image:", error);
      
      toast({
        title: "Error uploading image",
        description: error.message,
        variant: "destructive",
      });
      
      return null;
    }
  }

  return {
    trips,
    isLoading,
    error,
    fetchTrips,
    getTripById,
    createTrip,
    updateTrip,
    deleteTrip,
    uploadTripImage,
  };
}
