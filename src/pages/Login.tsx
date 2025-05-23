
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { UserRoundPlus, Wallet } from 'lucide-react';
import { connectWallet } from '@/utils/walletAuth';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

const Login = () => {
  const navigate = useNavigate();
  const { signIn, signInWithWallet, user } = useSupabaseAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isWalletLoading, setIsWalletLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        setError('Invalid email or password.');
      } else {
        navigate('/');
      }
    } catch (err: any) {
      if (err.message === 'Invalid credentials') {
        setError('Invalid email or password.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleWalletLogin = async () => {
    setIsWalletLoading(true);
    setError(null);
    
    try {
      const walletAuth = await connectWallet();
      
      if (walletAuth) {
        const { address, signature } = walletAuth;
        const { error } = await signInWithWallet(address, signature);
        
        if (error) {
          setError('Invalid wallet or not registered. Please register first.');
        } else {
          navigate('/');
        }
      }
    } catch (err: any) {
      setError('Wallet login failed. Please try again.');
      console.error(err);
    } finally {
      setIsWalletLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Login</CardTitle>
          <CardDescription className="text-center">Enter your credentials to login</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <div className="text-red-500 mt-2">{error}</div>}
            <Button type="submit" className="w-full mt-4" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login with Email'}
            </Button>
          </form>
          
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            type="button" 
            onClick={handleWalletLogin} 
            disabled={isWalletLoading}
            className="w-full"
          >
            <Wallet className="mr-2 h-4 w-4" />
            {isWalletLoading ? 'Connecting...' : 'Connect Wallet'}
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col items-center">
          <div className="text-sm text-muted-foreground mt-2">
            Don't have an account?
          </div>
          <div className="flex w-full gap-2 mt-2">
            <Link to="/register" className="w-full">
              <Button variant="outline" className="w-full">
                <UserRoundPlus className="mr-2 h-4 w-4" />
                Register with Email
              </Button>
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
