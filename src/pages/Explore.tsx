
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Globe,
  Calendar,
  DollarSign,
  Users,
  Filter,
  Search
} from "lucide-react";
import { trips, Trip } from "@/lib/data";

const Explore = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  const [filteredTrips, setFilteredTrips] = useState<Trip[]>(trips);
  const [searchParams, setSearchParams] = useState({
    destination: queryParams.get("destination") || "",
    period: queryParams.get("period") || "",
    budget: "",
    interests: [] as string[]
  });
  
  // All available interests from trips
  const allInterests = Array.from(
    new Set(trips.flatMap(trip => trip.interests))
  ).sort();
  
  // Apply filters when search params change
  useEffect(() => {
    let results = trips;
    
    // Filter by destination
    if (searchParams.destination) {
      const searchTerm = searchParams.destination.toLowerCase();
      results = results.filter(trip => 
        trip.destination.toLowerCase().includes(searchTerm) ||
        trip.title.toLowerCase().includes(searchTerm)
      );
    }
    
    // Filter by period
    if (searchParams.period) {
      const currentDate = new Date();
      switch(searchParams.period) {
        case "next-month":
          const nextMonth = new Date();
          nextMonth.setMonth(currentDate.getMonth() + 1);
          results = results.filter(trip => {
            const startDate = new Date(trip.startDate);
            return startDate <= nextMonth && startDate >= currentDate;
          });
          break;
        case "next-3-months":
          const next3Months = new Date();
          next3Months.setMonth(currentDate.getMonth() + 3);
          results = results.filter(trip => {
            const startDate = new Date(trip.startDate);
            return startDate <= next3Months && startDate >= currentDate;
          });
          break;
        case "next-6-months":
          const next6Months = new Date();
          next6Months.setMonth(currentDate.getMonth() + 6);
          results = results.filter(trip => {
            const startDate = new Date(trip.startDate);
            return startDate <= next6Months && startDate >= currentDate;
          });
          break;
        case "this-year":
          const endOfYear = new Date(currentDate.getFullYear(), 11, 31);
          results = results.filter(trip => {
            const startDate = new Date(trip.startDate);
            return startDate <= endOfYear && startDate >= currentDate;
          });
          break;
      }
    }
    
    // Filter by budget
    if (searchParams.budget) {
      results = results.filter(trip => trip.budget === searchParams.budget);
    }
    
    // Filter by interests
    if (searchParams.interests.length > 0) {
      results = results.filter(trip => 
        searchParams.interests.some(interest => trip.interests.includes(interest))
      );
    }
    
    setFilteredTrips(results);
  }, [searchParams]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Update URL with current destination and period
    const params = new URLSearchParams();
    if (searchParams.destination) params.set("destination", searchParams.destination);
    if (searchParams.period) params.set("period", searchParams.period);
    
    navigate(`/explore?${params.toString()}`);
  };
  
  const toggleInterest = (interest: string) => {
    setSearchParams(prev => {
      if (prev.interests.includes(interest)) {
        return {
          ...prev,
          interests: prev.interests.filter(i => i !== interest)
        };
      } else {
        return {
          ...prev,
          interests: [...prev.interests, interest]
        };
      }
    });
  };
  
  const resetFilters = () => {
    setSearchParams({
      destination: "",
      period: "",
      budget: "",
      interests: []
    });
    navigate("/explore");
  };
  
  return (
    <Layout>
      <div className="bg-triplink-lightBlue py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6 text-center">Explore Travel Companions</h1>
          
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Globe className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Destination"
                  className="pl-10"
                  value={searchParams.destination}
                  onChange={e => setSearchParams(prev => ({ ...prev, destination: e.target.value }))}
                />
              </div>
              
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Select 
                  value={searchParams.period} 
                  onValueChange={value => setSearchParams(prev => ({ ...prev, period: value }))}
                >
                  <SelectTrigger className="pl-10">
                    <SelectValue placeholder="When?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="next-month">Next Month</SelectItem>
                    <SelectItem value="next-3-months">Next 3 Months</SelectItem>
                    <SelectItem value="next-6-months">Next 6 Months</SelectItem>
                    <SelectItem value="this-year">This Year</SelectItem>
                    <SelectItem value="flexible">I'm Flexible</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button type="submit" className="bg-triplink-teal hover:bg-triplink-darkBlue">
                <Search className="mr-2 h-4 w-4" /> Search Trips
              </Button>
            </div>
            
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium">Filters:</span>
              
              <Select 
                value={searchParams.budget} 
                onValueChange={value => setSearchParams(prev => ({ ...prev, budget: value }))}
              >
                <SelectTrigger className="h-8 text-xs border-dashed">
                  <SelectValue placeholder="Budget" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Budget">Budget</SelectItem>
                  <SelectItem value="Mid-range">Mid-range</SelectItem>
                  <SelectItem value="Mid-range to High">Mid-range to High</SelectItem>
                  <SelectItem value="Mid-range to Luxury">Mid-range to Luxury</SelectItem>
                  <SelectItem value="Luxury">Luxury</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex-1 flex flex-wrap gap-1">
                {allInterests.slice(0, 8).map(interest => (
                  <Badge
                    key={interest}
                    variant={searchParams.interests.includes(interest) ? "default" : "outline"}
                    className={`cursor-pointer text-xs ${
                      searchParams.interests.includes(interest) 
                        ? "bg-triplink-teal hover:bg-triplink-teal/80" 
                        : "hover:bg-triplink-teal/10"
                    }`}
                    onClick={() => toggleInterest(interest)}
                  >
                    {interest}
                  </Badge>
                ))}
                
                {(searchParams.destination || searchParams.period || searchParams.budget || searchParams.interests.length > 0) && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs h-6 ml-auto"
                    onClick={resetFilters}
                  >
                    Reset All
                  </Button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">
            {filteredTrips.length} {filteredTrips.length === 1 ? 'Trip' : 'Trips'} Found
          </h2>
          <Select defaultValue="newest">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="soon">Starting Soon</SelectItem>
              <SelectItem value="budget-low">Budget: Low to High</SelectItem>
              <SelectItem value="budget-high">Budget: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {filteredTrips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTrips.map((trip) => (
              <Card 
                key={trip.id} 
                className="overflow-hidden transition-all hover:shadow-md"
                onClick={() => navigate(`/trips/${trip.id}`)}
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={trip.imageUrl} 
                    alt={trip.title} 
                    className="h-full w-full object-cover transition-transform hover:scale-105"
                  />
                  <Badge 
                    variant={trip.status === 'planning' ? 'default' : 'outline'}
                    className="absolute top-3 right-3"
                  >
                    {trip.status === 'planning' ? 'Open to Join' : trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                  </Badge>
                </div>
                
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">{trip.title}</CardTitle>
                  <p className="text-sm text-gray-500">{trip.destination}</p>
                </CardHeader>
                
                <CardContent className="pb-2">
                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-triplink-teal" />
                      <span>
                        {new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - 
                        {new Date(trip.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1.5">
                      <DollarSign className="h-4 w-4 text-triplink-teal" />
                      <span>{trip.budget}</span>
                    </div>
                    
                    <div className="flex items-center gap-1.5">
                      <Users className="h-4 w-4 text-triplink-teal" />
                      <span>
                        {trip.currentTravelers} of {trip.maxTravelers} travelers
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {trip.interests.slice(0, 3).map((interest) => (
                      <Badge 
                        key={interest} 
                        variant="secondary" 
                        className="text-xs bg-triplink-lightBlue text-triplink-darkBlue"
                      >
                        {interest}
                      </Badge>
                    ))}
                    {trip.interests.length > 3 && (
                      <span className="text-xs text-gray-500">+{trip.interests.length - 3}</span>
                    )}
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    className="w-full bg-triplink-teal hover:bg-triplink-darkBlue"
                  >
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="mb-4">
              <Search className="mx-auto h-12 w-12 text-gray-300" />
            </div>
            <h3 className="text-xl font-medium mb-2">No trips found</h3>
            <p className="text-gray-500 mb-8">Try adjusting your filters to find more travel companions</p>
            <Button onClick={resetFilters}>Reset All Filters</Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Explore;
