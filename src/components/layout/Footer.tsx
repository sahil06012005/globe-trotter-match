
import { Link } from "react-router-dom";
import { Globe, Mail, Instagram, Facebook, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-triplink-navy text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <Globe className="h-6 w-6" />
              <span className="text-2xl font-bold">TripLink</span>
            </div>
            <p className="mt-4 text-gray-300">
              Connect with like-minded travelers and explore the world together.
            </p>
            <div className="mt-6 flex space-x-4">
              <a href="#" className="hover:text-triplink-coral transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-triplink-coral transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="hover:text-triplink-coral transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-triplink-coral transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold">Explore</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/explore" className="text-gray-300 hover:text-white transition-colors">
                  Find Trips
                </Link>
              </li>
              <li>
                <Link to="/explore?type=local" className="text-gray-300 hover:text-white transition-colors">
                  Local Experiences
                </Link>
              </li>
              <li>
                <Link to="/explore?type=adventure" className="text-gray-300 hover:text-white transition-colors">
                  Adventure Trips
                </Link>
              </li>
              <li>
                <Link to="/explore?type=leisure" className="text-gray-300 hover:text-white transition-colors">
                  Leisure Travel
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold">Company</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-gray-300 hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-gray-300 hover:text-white transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/press" className="text-gray-300 hover:text-white transition-colors">
                  Press
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold">Support</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/help" className="text-gray-300 hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/safety" className="text-gray-300 hover:text-white transition-colors">
                  Safety Center
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-300 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-gray-700 pt-8">
          <p className="text-center text-gray-300">
            © {new Date().getFullYear()} TripLink. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
