
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import Layout from "@/components/layout/Layout";
import TripForm from "@/components/trips/TripForm";
import { TripFormValues } from "@/components/trips/TripForm";

const EditTrip = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrip = async () => {
      if (!id) return;

      try {
        const { data, error } = await supabase
          .from("trips")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;

        if (!data) {
          toast({
            title: "Trip not found",
            description: "The requested trip could not be found.",
            variant: "destructive",
          });
          navigate("/explore");
          return;
        }

        // Check if user is the owner
        if (data.user_id !== user?.id) {
          toast({
            title: "Access Denied",
            description: "You don't have permission to edit this trip.",
            variant: "destructive",
          });
          navigate(`/trips/${id}`);
          return;
        }

        setTrip(data);
      } catch (error: any) {
        toast({
          title: "Error fetching trip",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [id, navigate, toast, user]);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 mt-16">
          <div className="text-center">Loading trip details...</div>
        </div>
      </Layout>
    );
  }

  if (!trip) {
    return null;
  }

  // Transform trip data to match form values
  const defaultValues: TripFormValues = {
    title: trip.title,
    destination: trip.destination,
    description: trip.description,
    startDate: new Date(trip.start_date),
    endDate: new Date(trip.end_date),
    maxTravelers: trip.max_travelers,
    budget: trip.budget,
    interests: trip.interests || [],
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 mt-16 max-w-3xl">
        <h1 className="text-3xl font-bold mb-6">Edit Trip</h1>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <p className="text-gray-600 mb-6">
            Update your travel plans. You can modify any details of your trip
            below.
          </p>
          <TripForm
            mode="edit"
            tripId={id}
            defaultValues={defaultValues}
            currentImageUrl={trip.image_url}
          />
        </div>
      </div>
    </Layout>
  );
};

export default EditTrip;
