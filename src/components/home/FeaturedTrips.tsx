
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, DollarSign } from "lucide-react";
import { trips } from "@/lib/data";

const FeaturedTrips = () => {
  const navigate = useNavigate();
  // Get 3 most recent trips
  const featuredTrips = [...trips]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);
  
  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-triplink-navy">Latest Trips</h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Discover recent trips posted by our community members looking for travel companions
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-3">
          {featuredTrips.map((trip) => (
            <Card key={trip.id} className="overflow-hidden transition-all hover:shadow-lg">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={trip.imageUrl} 
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
                      {new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - 
                      {new Date(trip.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-triplink-teal" />
                    <span>
                      {trip.currentTravelers} of {trip.maxTravelers} travelers
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-triplink-teal" />
                    <span>Budget: {trip.budget}</span>
                  </div>
                </div>
                
                <div className="mt-4 flex flex-wrap gap-2">
                  {trip.interests.slice(0, 3).map((interest) => (
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
