
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Globe, Calendar, Search } from "lucide-react";

const HeroSection = () => {
  const navigate = useNavigate();
  const [destination, setDestination] = useState("");
  const [travelPeriod, setTravelPeriod] = useState("");
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/explore?destination=${destination}&period=${travelPeriod}`);
  };
  
  return (
    <div className="relative bg-triplink-blue text-white">
      {/* Background image with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=1920&q=80')",
          backgroundBlendMode: "multiply",
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
      </div>
      
      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 py-24 md:py-40">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-6 text-4xl font-bold leading-tight md:text-6xl">
            Find Your Perfect Travel Companion
          </h1>
          <p className="mb-12 text-lg md:text-xl">
            Connect with like-minded travelers, share experiences, and explore the world together
          </p>
          
          {/* Search Form */}
          <form 
            onSubmit={handleSearch}
            className="mx-auto mb-8 flex flex-col space-y-4 rounded-lg bg-white/10 backdrop-blur-sm p-4 md:p-6 md:flex-row md:space-y-0 md:space-x-4"
          >
            <div className="flex-1 relative">
              <Globe className="absolute left-3 top-3 h-5 w-5 text-white/70" />
              <Input
                type="text"
                placeholder="Where to?"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="pl-10 text-white bg-white/20 border-white/30 placeholder:text-white/70"
              />
            </div>
            <div className="flex-1 relative">
              <Calendar className="absolute left-3 top-3 h-5 w-5 text-white/70" />
              <Select value={travelPeriod} onValueChange={setTravelPeriod}>
                <SelectTrigger className="pl-10 text-white bg-white/20 border-white/30 [&_span]:text-white/70">
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
            <Button 
              type="submit" 
              className="bg-triplink-coral hover:bg-triplink-coral/80 text-white"
              disabled={!destination}
            >
              <Search className="mr-2 h-4 w-4" /> Find Trips
            </Button>
          </form>
          
          <div className="flex flex-col items-center justify-center space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <Button 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-triplink-blue"
              onClick={() => navigate("/register")}
            >
              Sign Up - It's Free
            </Button>
            <Button 
              variant="ghost" 
              className="text-white hover:bg-white/10"
              onClick={() => navigate("/how-it-works")}
            >
              How It Works
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
