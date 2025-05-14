
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/toast";
import { 
  Menu, 
  X, 
  User, 
  Globe, 
  MessageSquare, 
  Plus,
  LogOut 
} from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const toggleMenu = () => setIsOpen(!isOpen);
  
  const handleLogout = () => {
    toast({
      title: "Logged out successfully",
      description: "See you again soon!",
    });
    // In a real app, we'd handle authentication state here
  };

  // Mock authenticated state - in a real app, this would come from auth context
  const isAuthenticated = true;

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <Globe className="h-6 w-6 text-triplink-blue" />
          <span className="text-2xl font-bold text-triplink-blue">TripLink</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link to="/explore" className="text-gray-600 hover:text-triplink-blue transition-colors">
            Explore
          </Link>
          <Link to="/how-it-works" className="text-gray-600 hover:text-triplink-blue transition-colors">
            How It Works
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/trips/new" className="text-gray-600 hover:text-triplink-blue transition-colors">
                Post Trip
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-10 w-10 border-2 border-triplink-teal bg-triplink-lightBlue"
                  >
                    <User className="h-5 w-5 text-triplink-darkBlue" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/messages" className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      <span>Messages</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/trips/new" className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      <span>Post Trip</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 text-destructive focus:text-destructive">
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" className="border-triplink-teal text-triplink-teal hover:bg-triplink-teal hover:text-white">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-triplink-teal hover:bg-triplink-darkBlue">Sign Up</Button>
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={toggleMenu}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t">
          <div className="flex flex-col p-4 space-y-4">
            <Link to="/explore" className="px-3 py-2 hover:bg-gray-100 rounded" onClick={toggleMenu}>
              Explore
            </Link>
            <Link to="/how-it-works" className="px-3 py-2 hover:bg-gray-100 rounded" onClick={toggleMenu}>
              How It Works
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="px-3 py-2 hover:bg-gray-100 rounded" onClick={toggleMenu}>
                  Profile
                </Link>
                <Link to="/messages" className="px-3 py-2 hover:bg-gray-100 rounded" onClick={toggleMenu}>
                  Messages
                </Link>
                <Link to="/trips/new" className="px-3 py-2 hover:bg-gray-100 rounded" onClick={toggleMenu}>
                  Post Trip
                </Link>
                <button 
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                  className="px-3 py-2 hover:bg-red-50 text-red-600 rounded text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={toggleMenu}>
                  <Button 
                    variant="outline" 
                    className="w-full border-triplink-teal text-triplink-teal hover:bg-triplink-teal hover:text-white"
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/register" onClick={toggleMenu}>
                  <Button className="w-full bg-triplink-teal hover:bg-triplink-darkBlue">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
