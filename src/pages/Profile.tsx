
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTripRequests, TripRequest } from "@/hooks/use-trip-requests";

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
  const { getUserRequests, updateRequestStatus } = useTripRequests();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userRequests, setUserRequests] = useState<TripRequest[]>([]);
  const isCurrentUserProfile = user?.id === id;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
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
        // Handle error appropriately (e.g., show a toast)
      }
    };

    if (id) {
      fetchProfile();
    }
  }, [id]);

  useEffect(() => {
    const fetchUserRequests = async () => {
      const requests = await getUserRequests();
      setUserRequests(requests);
    };

    if (isCurrentUserProfile) {
      fetchUserRequests();
    }
  }, [getUserRequests, isCurrentUserProfile]);

  const handleRequestAction = async (requestId: string, action: 'approved' | 'rejected') => {
    await updateRequestStatus(requestId, action);
    // Refresh user requests after action
    const updatedRequests = await getUserRequests();
    setUserRequests(updatedRequests);
  };

  if (!profile) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {profile.full_name || profile.username || "User Profile"}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <Avatar className="h-32 w-32 rounded-full border-2 border-triplink-teal">
            <AvatarImage src={profile.avatar_url} alt={profile.full_name || profile.username || "Avatar"} />
            <AvatarFallback>{profile.username?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
          </Avatar>
          <div className="mt-4 text-center">
            <p className="text-gray-700">Username: {profile.username}</p>
            <p className="text-gray-700">Full Name: {profile.full_name || "N/A"}</p>
            {isCurrentUserProfile && (
              <p className="text-sm text-gray-500">
                Profile last updated: {profile.updated_at ? new Date(profile.updated_at).toLocaleDateString() : "N/A"}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {isCurrentUserProfile && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Your Trip Requests</h2>
          {userRequests.length > 0 ? (
            userRequests.map((request) => (
              <Card key={request.id} className="mb-4">
                <CardContent>
                  <CardTitle>{request.trips?.title || "Unnamed Trip"}</CardTitle>
                  <p>Destination: {request.trips?.destination || "Unknown"}</p>
                  <p>Message: {request.message}</p>
                  <p>Status: {request.status}</p>
                  {request.status === 'pending' && (
                    <div className="flex justify-end space-x-2">
                      <Button variant="secondary" onClick={() => handleRequestAction(request.id, 'approved')}>
                        Approve
                      </Button>
                      <Button variant="destructive" onClick={() => handleRequestAction(request.id, 'rejected')}>
                        Reject
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <p>No trip requests found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
