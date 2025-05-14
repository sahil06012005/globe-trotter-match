
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Globe } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, rememberMe: checked }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, we'd validate credentials here
      toast({
        title: "Login successful",
        description: "Welcome back to TripLink!"
      });
      
      navigate("/");
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side - Image */}
      <div 
        className="hidden md:block md:w-1/2 bg-cover bg-center"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&fit=crop&w=1000&q=80')"
        }}
      />
      
      {/* Right Side - Login Form */}
      <div className="w-full md:w-1/2 flex justify-center items-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2">
              <Globe className="h-6 w-6 text-triplink-blue" />
              <span className="text-2xl font-bold text-triplink-blue">TripLink</span>
            </Link>
            <h1 className="text-2xl font-bold mt-6">Welcome back</h1>
            <p className="text-gray-600">Login to your TripLink account</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-triplink-blue hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={formData.rememberMe}
                onCheckedChange={handleCheckboxChange}
              />
              <Label htmlFor="remember" className="text-sm">Remember me</Label>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-triplink-teal hover:bg-triplink-darkBlue"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Log In"}
            </Button>
            
            <p className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/register" className="text-triplink-blue hover:underline font-medium">
                Sign up
              </Link>
            </p>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" type="button" className="w-full">
                Google
              </Button>
              <Button variant="outline" type="button" className="w-full">
                Facebook
              </Button>
            </div>
          </form>
          
          <div className="mt-8 text-center text-sm text-gray-500">
            By logging in, you agree to our{" "}
            <Link to="/terms" className="text-triplink-blue hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-triplink-blue hover:underline">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
