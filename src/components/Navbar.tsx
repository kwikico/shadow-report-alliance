
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, Map, FileText, Users, Menu, X, LogOut } from 'lucide-react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { user, signOut } = useSupabaseAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <nav className="bg-secondary/50 backdrop-blur-md fixed w-full z-10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold tracking-tight">
              <span className="text-primary">Shadow</span>Report
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/reports"
              className="text-foreground/80 hover:text-primary transition-colors"
            >
              Reports
            </Link>
            <Link
              to="/map"
              className="text-foreground/80 hover:text-primary transition-colors"
            >
              Map
            </Link>
            <Link
              to="/submit"
              className="text-foreground/80 hover:text-primary transition-colors"
            >
              Submit Report
            </Link>
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile">
                  <Button variant="secondary">My Profile</Button>
                </Link>
                <Button variant="outline" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button variant="secondary">Login</Button>
              </Link>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-foreground"
            onClick={toggleMenu}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pt-4 pb-3 space-y-3 animate-fade-in">
            <Link 
              to="/reports"
              className="block py-2 px-4 text-foreground/80 hover:bg-secondary rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              <FileText className="inline-block mr-2 h-5 w-5" />
              Reports
            </Link>
            <Link 
              to="/map"
              className="block py-2 px-4 text-foreground/80 hover:bg-secondary rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              <Map className="inline-block mr-2 h-5 w-5" />
              Map
            </Link>
            <Link 
              to="/submit"
              className="block py-2 px-4 text-foreground/80 hover:bg-secondary rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              <FileText className="inline-block mr-2 h-5 w-5" />
              Submit Report
            </Link>
            {user ? (
              <>
                <Link 
                  to="/profile"
                  className="block py-2 px-4 text-foreground/80 hover:bg-secondary rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Users className="inline-block mr-2 h-5 w-5"/>
                  My Profile
                </Link>
                <button
                  className="block w-full text-left py-2 px-4 text-foreground/80 hover:bg-secondary rounded-md"
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleLogout();
                  }}
                >
                  <LogOut className="inline-block mr-2 h-5 w-5"/>
                  Logout
                </button>
              </>
            ) : (
              <Link 
                to="/login"
                className="block py-2 px-4 text-foreground/80 hover:bg-secondary rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                <Users className="inline-block mr-2 h-5 w-5"/>
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
