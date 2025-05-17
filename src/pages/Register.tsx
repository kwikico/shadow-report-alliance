import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { register, walletRegister } from '@/api';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Wallet } from 'lucide-react';
import { connectWallet } from '@/utils/walletAuth';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isWalletSubmitting, setIsWalletSubmitting] = useState(false);
  const [walletUsername, setWalletUsername] = useState('');
  const [showWalletForm, setShowWalletForm] = useState(false);
  const [walletConnectionTimer, setWalletConnectionTimer] = useState<NodeJS.Timeout | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await register(
        formData.username,
        formData.email,
        formData.password
      );

      toast.success('Registration Successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error: any) {
      let errorMessage = 'Registration failed';
      if (error.message === 'User already exists') {
        errorMessage = 'Email already in use. Please use a different email or login.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    // Clear any existing timer when component unmounts
    return () => {
      if (walletConnectionTimer) {
        clearTimeout(walletConnectionTimer);
      }
    };
  }, [walletConnectionTimer]);

  const initiateWalletRegistration = async () => {
    setIsWalletSubmitting(true);
    
    try {
      // Set up a timeout to reset the button if wallet connection takes too long
      const timer = setTimeout(() => {
        setIsWalletSubmitting(false);
        toast.error('Wallet connection timed out. Please try again.');
      }, 10000);
      
      setWalletConnectionTimer(timer);
      
      const walletAuth = await connectWallet();
      
      // Clear the timeout if we got a response
      clearTimeout(timer);
      setWalletConnectionTimer(null);
      
      if (walletAuth) {
        // Show username form if wallet is connected
        setShowWalletForm(true);
      } else {
        setIsWalletSubmitting(false);
      }
    } catch (error) {
      // Clear any existing timer
      if (walletConnectionTimer) {
        clearTimeout(walletConnectionTimer);
        setWalletConnectionTimer(null);
      }
      
      toast.error('Failed to connect wallet. Please try again.');
      console.error(error);
      setIsWalletSubmitting(false);
    }
  };

  const handleWalletRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsWalletSubmitting(true);
    
    try {
      const walletAuth = await connectWallet();
      
      if (walletAuth && walletUsername) {
        const { address, signature } = walletAuth;
        await walletRegister(walletUsername, address, signature);
        
        toast.success('Wallet Registration Successful! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        toast.error('Please provide a username and connect your wallet.');
        setIsWalletSubmitting(false);
      }
    } catch (error: any) {
      let errorMessage = 'Wallet registration failed';
      if (error.message === 'Wallet already exists') {
        errorMessage = 'Wallet already registered. Please login instead.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
      setIsWalletSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background">
      <Card className="w-[350px]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Register</CardTitle>
          <CardDescription>Create an account to submit reports</CardDescription>
        </CardHeader>
        
        {!showWalletForm ? (
          <>
            <CardContent className="grid gap-4">
              <form onSubmit={handleSubmit} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Registering...' : 'Register with Email'}
                </Button>
              </form>
              
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or</span>
                </div>
              </div>
              
              <Button
                variant="outline"
                type="button"
                className="w-full"
                onClick={initiateWalletRegistration}
                disabled={isWalletSubmitting}
              >
                <Wallet className="mr-2 h-4 w-4" />
                {isWalletSubmitting ? 'Connecting...' : 'Register with Wallet'}
              </Button>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Link to="/login" className="text-sm text-muted-foreground hover:text-primary">
                Already have an account? Login
              </Link>
            </CardFooter>
          </>
        ) : (
          <CardContent className="grid gap-4">
            <form onSubmit={handleWalletRegister} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="walletUsername">Username</Label>
                <Input
                  id="walletUsername"
                  placeholder="Enter your username"
                  value={walletUsername}
                  onChange={(e) => setWalletUsername(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={isWalletSubmitting}
              >
                {isWalletSubmitting ? 'Registering...' : 'Complete Wallet Registration'}
              </Button>
              <Button
                variant="outline"
                type="button"
                className="w-full"
                onClick={() => setShowWalletForm(false)}
              >
                Back to Registration Options
              </Button>
            </form>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default Register;
