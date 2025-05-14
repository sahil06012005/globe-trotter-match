
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-triplink-lightBlue to-white px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold mb-6 text-triplink-darkBlue">404</h1>
        <h2 className="text-2xl font-bold mb-4 text-triplink-navy">Page not found</h2>
        <p className="text-lg text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="space-y-4">
          <Button 
            className="w-full bg-triplink-teal hover:bg-triplink-darkBlue"
            onClick={() => navigate("/")}
          >
            Return to Home
          </Button>
          <Button 
            variant="outline"
            className="w-full border-triplink-teal text-triplink-teal hover:bg-triplink-teal hover:text-white"
            onClick={() => navigate("/explore")}
          >
            Explore Trips
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
