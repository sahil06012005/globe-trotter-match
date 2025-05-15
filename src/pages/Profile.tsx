
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTripRequests, TripRequest } from "@/hooks/use-trip-requests";
import Layout from "@/components/layout/Layout";
import { useToast } from "@/hooks/use-toast";
import { useProfile } from "@/hooks/use-profile";
import { PlusCircle } from "lucide-react";

// Define the Profile type
interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  updated_at: string | null;
}

const Profile = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const { getUserRequests, updateRequestStatus } = useTripRequests();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userRequests, setUserRequests] = useState<TripRequest[]>([]);
  const [userTrips, setUserTrips] = useState<any[]>([]);
  const isCurrentUserProfile = user?.id === id;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!id) return;
        
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          throw error;
        }

        setProfile(data);
      } catch (error: any) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error loading profile",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProfile();
    }
  }, [id, toast]);

  useEffect(() => {
    const fetchUserTrips = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from("trips")
          .select("*")
          .eq("user_id", id)
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }

        setUserTrips(data || []);
      } catch (error: any) {
        console.error("Error fetching user trips:", error);
      }
    };

    fetchUserTrips();
  }, [id]);

  useEffect(() => {
    const fetchUserRequests = async () => {
      if (isCurrentUserProfile) {
        const requests = await getUserRequests();
        setUserRequests(requests);
      }
    };

    fetchUserRequests();
  }, [getUserRequests, isCurrentUserProfile]);

  const handleRequestAction = async (requestId: string, action: 'approved' | 'rejected') => {
    await updateRequestStatus(requestId, action);
    // Refresh user requests after action
    const updatedRequests = await getUserRequests();
    setUserRequests(updatedRequests);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-8 flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-triplink-blue"></div>
        </div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Profile not found</h2>
            <p className="mt-2">The profile you're looking for doesn't exist or you don't have permission to view it.</p>
            <Button asChild className="mt-4">
              <Link to="/">Go Home</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              {profile.full_name || profile.username || "User Profile"}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <Avatar className="h-32 w-32 rounded-full border-2 border-triplink-teal">
              <AvatarImage src={profile.avatar_url || ""} alt={profile.full_name || profile.username || "Avatar"} />
              <AvatarFallback>{profile.username?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
            </Avatar>
            <div className="mt-4 text-center">
              <p className="text-gray-700">Username: {profile.username || "Not set"}</p>
              <p className="text-gray-700">Full Name: {profile.full_name || "N/A"}</p>
              {isCurrentUserProfile && (
                <p className="text-sm text-gray-500">
                  Profile last updated: {profile.updated_at ? new Date(profile.updated_at).toLocaleDateString() : "N/A"}
                </p>
              )}
              
              {isCurrentUserProfile && (
                <div className="mt-4">
                  <Button asChild className="w-full">
                    <Link to="/create-trip">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Create New Trip
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* User's created trips */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">
            {isCurrentUserProfile ? "Your Trips" : `${profile.full_name || profile.username || "User"}'s Trips`}
          </h2>
          {userTrips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userTrips.map((trip) => (
                <Card key={trip.id} className="overflow-hidden">
                  <div className="h-40 bg-gray-200 relative">
                    {trip.image_url ? (
                      <img 
                        src={trip.image_url} 
                        alt={trip.title} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gray-100 text-gray-400">
                        No image
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                      <h3 className="text-white font-semibold truncate">{trip.title}</h3>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-600 mb-2">
                      {trip.destination}
                    </p>
                    <p className="text-xs text-gray-500 mb-2">
                      {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}
                    </p>
                    <Button asChild variant="outline" size="sm" className="w-full mt-2">
                      <Link to={`/trips/${trip.id}`}>View Details</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p>No trips found.</p>
          )}
        </div>

        {/* Trip requests section - only for current user */}
        {isCurrentUserProfile && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Your Trip Requests</h2>
            {userRequests.length > 0 ? (
              userRequests.map((request) => (
                <Card key={request.id} className="mb-4">
                  <CardContent className="p-6">
                    <CardTitle className="text-xl mb-2">{request.trips?.title || "Unnamed Trip"}</CardTitle>
                    <p className="mb-1">Destination: {request.trips?.destination || "Unknown"}</p>
                    <p className="mb-1">Message: {request.message}</p>
                    <p className="mb-3">Status: <span className={`font-semibold ${
                      request.status === 'approved' ? 'text-green-600' : 
                      request.status === 'rejected' ? 'text-red-600' : 
                      'text-amber-600'
                    }`}>{request.status}</span></p>
                    
                    {request.status === 'pending' && (
                      <div className="flex justify-end space-x-2 mt-4">
                        <Button variant="outline" onClick={() => handleRequestAction(request.id, 'approved')}>
                          Approve
                        </Button>
                        <Button variant="destructive" onClick={() => handleRequestAction(request.id, 'rejected')}>
                          Reject
                        </Button>
                      </div>
                    )}
                    
                    <div className="mt-2">
                      <Button asChild variant="link" size="sm" className="px-0">
                        <Link to={`/trips/${request.trip_id}`}>View Trip Details</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p>No trip requests found.</p>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Profile;
