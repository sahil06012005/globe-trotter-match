
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PlusCircle, Menu, X, MessageSquare } from 'lucide-react';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [transparent, setTransparent] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMobile();
  const { user, signOut } = useAuth();

  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      if (isHomePage) {
        const scrollTop = window.scrollY;
        setTransparent(scrollTop < 100);
      } else {
        setTransparent(false);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isHomePage]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  const navbarClasses = `fixed top-0 left-0 right-0 z-50 ${
    isHomePage && transparent
      ? 'bg-transparent text-white'
      : 'bg-white border-b shadow-sm text-gray-800'
  } transition-all duration-300`;

  return (
    <nav className={navbarClasses}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="font-bold text-2xl">
            TripLink
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/explore"
              className="font-medium hover:text-triplink-teal transition-colors"
            >
              Explore
            </Link>
            {user && (
              <>
                <Link
                  to="/messages"
                  className="font-medium hover:text-triplink-teal transition-colors flex items-center"
                >
                  <MessageSquare className="mr-1 h-4 w-4" />
                  Messages
                </Link>
                <Button variant="outline" asChild>
                  <Link to="/create-trip" className="flex items-center">
                    <PlusCircle className="mr-2 h-4 w-4" /> Create Trip
                  </Link>
                </Button>
              </>
            )}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="p-0 h-10 w-10 rounded-full"
                  >
                    <Avatar>
                      <AvatarImage src={user.user_metadata?.avatar_url} />
                      <AvatarFallback>
                        {(user.user_metadata?.full_name?.[0] ||
                          user.email?.[0] ||
                          'U').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    {user.user_metadata?.full_name || user.email}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to={`/profile/${user.id}`}>Your Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/messages">Messages</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-3">
                <Button variant="ghost" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              className="text-current"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobile && mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg pt-2 pb-6 border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-col space-y-4">
              <Link
                to="/explore"
                className="font-medium py-2"
                onClick={closeMobileMenu}
              >
                Explore
              </Link>
              {user && (
                <>
                  <Link
                    to="/messages"
                    className="font-medium py-2 flex items-center"
                    onClick={closeMobileMenu}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" /> Messages
                  </Link>
                  <Link
                    to="/create-trip"
                    className="font-medium py-2 flex items-center"
                    onClick={closeMobileMenu}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" /> Create Trip
                  </Link>
                  <Link
                    to={`/profile/${user.id}`}
                    className="font-medium py-2"
                    onClick={closeMobileMenu}
                  >
                    Your Profile
                  </Link>
                  <Button 
                    variant="destructive" 
                    onClick={() => {
                      handleSignOut();
                      closeMobileMenu();
                    }}
                    className="mt-2"
                  >
                    Sign out
                  </Button>
                </>
              )}
              {!user && (
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <Button variant="outline" asChild>
                    <Link to="/login" onClick={closeMobileMenu}>
                      Login
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link to="/register" onClick={closeMobileMenu}>
                      Sign Up
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
