
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const CallToAction = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-20 bg-gradient-to-r from-triplink-teal to-triplink-blue text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Find Your Travel Companion?</h2>
        <p className="max-w-2xl mx-auto text-lg mb-10">
          Join thousands of travelers already connecting on TripLink. 
          Create your profile today and start discovering compatible travel buddies for your next adventure!
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <Button 
            size="lg" 
            className="bg-white text-triplink-blue hover:bg-gray-100"
            onClick={() => navigate("/register")}
          >
            Sign Up - It's Free
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="border-white text-white hover:bg-white/10"
            onClick={() => navigate("/explore")}
          >
            Browse Trips
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
