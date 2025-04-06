
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, FileText, Search, ThumbsUp } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="hero-gradient min-h-[calc(100vh-4rem)] flex flex-col justify-center">
      <div className="container mx-auto px-4 py-16 flex flex-col items-center text-center">
        <div className="mb-6 animate-pulse-slow">
          <Shield className="h-16 w-16 text-primary mx-auto" />
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-fade-in">
          <span className="text-primary">Shadow</span> Report Alliance
        </h1>
        
        <p className="text-xl md:text-2xl text-foreground/80 mb-8 max-w-3xl animate-fade-in">
          A secure platform for anonymous reporting, enabling whistleblowers and activists to share sensitive information safely.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in">
          <Link to="/submit">
            <Button size="lg" className="w-full sm:w-auto">
              <FileText className="h-5 w-5 mr-2" />
              Submit a Report
            </Button>
          </Link>
          <Link to="/reports">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              <Search className="h-5 w-5 mr-2" />
              Browse Reports
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-secondary/50 rounded-lg p-6 text-center card-hover">
            <div className="bg-primary/10 text-primary rounded-full p-3 inline-flex mb-4">
              <FileText className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Anonymous Submission</h3>
            <p className="text-sm text-foreground/70">
              Submit reports with complete anonymity. We strip metadata and protect your identity.
            </p>
          </div>
          
          <div className="bg-secondary/50 rounded-lg p-6 text-center card-hover">
            <div className="bg-primary/10 text-primary rounded-full p-3 inline-flex mb-4">
              <ThumbsUp className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Join Hands</h3>
            <p className="text-sm text-foreground/70">
              Support reports and show solidarity with whistleblowers while maintaining your anonymity.
            </p>
          </div>
          
          <div className="bg-secondary/50 rounded-lg p-6 text-center card-hover">
            <div className="bg-primary/10 text-primary rounded-full p-3 inline-flex mb-4">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Secure Messaging</h3>
            <p className="text-sm text-foreground/70">
              Communicate privately with end-to-end encryption to protect sensitive conversations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
