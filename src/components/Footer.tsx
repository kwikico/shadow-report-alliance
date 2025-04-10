
import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Github, ExternalLink } from 'lucide-react';

const Footer = () => {
  const token = localStorage.getItem('token');
    return (
    <footer className="bg-secondary/50 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <Shield className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold tracking-tight">
                <span className="text-primary">Shadow</span>Report
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              A secure platform for anonymous reporting, enabling whistleblowers and activists to safely share information.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/reports" className="text-muted-foreground hover:text-primary transition-colors">
                  Browse Reports
                </Link>
              </li>
              <li>
                <Link to="/map" className="text-muted-foreground hover:text-primary transition-colors">
                  Report Map
                </Link>
              </li>
              <li>
                <Link to="/submit" className="text-muted-foreground hover:text-primary transition-colors">
                  Submit a Report
                </Link>
              </li>
                {token && (
                    <li>
                        <Link to="/profile" className="text-muted-foreground hover:text-primary transition-colors">
                            Profile & Settings
                        </Link>
                    </li>
                )}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">About</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  Our Mission
                </Link>
              </li>
              <li>
                <Link to="/security" className="text-muted-foreground hover:text-primary transition-colors">
                  Security Measures
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
                <li>
                    <a href="https://github.com/orgs/Shadow-Report-Alliance/repositories" className="text-muted-foreground hover:text-primary transition-colors flex items-center" target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4 mr-1" />
                  Source Code
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border/50 mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Shadow Report Alliance. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
