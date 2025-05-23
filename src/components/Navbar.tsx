import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, Map, FileText, Users, Menu, X, LogOut, Bell } from 'lucide-react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { getNotifications, markNotificationAsRead } from '@/api/supabaseReports';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { user, signOut } = useSupabaseAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      if (user) {
        const notifs = await getNotifications();
        setNotifications(notifs);
        setUnreadCount(notifs.filter(n => !n.read).length);
      }
    };

    fetchNotifications();
    // Fetch notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const handleNotificationClick = async (notification: any) => {
    if (!notification.read) {
      await markNotificationAsRead(notification.id);
      setNotifications(prev => 
        prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    }

    // Navigate based on notification type
    if (notification.data?.report_id) {
      navigate(`/reports/${notification.data.report_id}`);
    }
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <Bell className="h-5 w-5" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-xs text-destructive-foreground flex items-center justify-center">
                          {unreadCount}
                        </span>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-80" align="end">
                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {notifications.length > 0 ? (
                      <>
                        {notifications.slice(0, 5).map((notification) => (
                          <DropdownMenuItem
                            key={notification.id}
                            onClick={() => handleNotificationClick(notification)}
                            className={`cursor-pointer ${!notification.read ? 'bg-secondary/50' : ''}`}
                          >
                            <div className="flex-1">
                              <p className="font-medium text-sm">{notification.title}</p>
                              <p className="text-xs text-muted-foreground">{notification.message}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                              </p>
                            </div>
                          </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigate('/notifications')}>
                          View all notifications
                        </DropdownMenuItem>
                      </>
                    ) : (
                      <DropdownMenuItem disabled>No notifications</DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
                <Link
                  to="/profile"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Profile
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
