
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// Define trip type
interface Trip {
  id: string;
  title: string;
  destination: string;
  start_date: string;
  end_date: string;
  current_travelers: number;
  max_travelers: number;
  budget: string;
  status: string;
  interests: string[];
  image_url: string;
}

const FeaturedTrips = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const { data, error } = await supabase
          .from("trips")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(3);
          
        if (error) throw error;
        
        setTrips(data || []);
      } catch (error) {
        console.error("Error fetching trips:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTrips();
  }, []);
  
  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-triplink-navy">Latest Trips</h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Discover recent trips posted by our community members looking for travel companions
          </p>
        </div>
        
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading featured trips...</p>
          </div>
        ) : trips.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-3">
            {trips.map((trip) => (
              <Card key={trip.id} className="overflow-hidden transition-all hover:shadow-lg">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={trip.image_url} 
                    alt={trip.title} 
                    className="h-full w-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl">{trip.title}</CardTitle>
                    <Badge variant={trip.status === 'planning' ? 'default' : 'outline'}>
                      {trip.status === 'planning' ? 'Open to Join' : 'Confirmed'}
                    </Badge>
                  </div>
                  <CardDescription>{trip.destination}</CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-triplink-teal" />
                      <span>
                        {new Date(trip.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - 
                        {new Date(trip.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-triplink-teal" />
                      <span>
                        {trip.current_travelers} of {trip.max_travelers} travelers
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-triplink-teal" />
                      <span>Budget: {trip.budget}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                    {trip.interests?.slice(0, 3).map((interest) => (
                      <Badge key={interest} variant="secondary" className="bg-triplink-lightBlue text-triplink-darkBlue">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    className="w-full bg-triplink-teal hover:bg-triplink-darkBlue"
                    onClick={() => navigate(`/trips/${trip.id}`)}
                  >
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-gray-600 mb-4">No trips have been created yet!</p>
            <Button 
              onClick={() => navigate('/create-trip')}
              className="bg-triplink-teal hover:bg-triplink-darkBlue"
            >
              Create the First Trip
            </Button>
          </div>
        )}
        
        <div className="mt-12 text-center">
          <Button 
            variant="outline" 
            onClick={() => navigate("/explore")}
            className="border-triplink-teal text-triplink-teal hover:bg-triplink-teal hover:text-white"
          >
            Explore All Trips
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedTrips;
