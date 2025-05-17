
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { walletRegister } from '@/api';
import { connectWallet } from '@/utils/walletAuth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Wallet } from 'lucide-react';

interface WalletRegisterFormProps {
  onBack: () => void;
  isFullForm?: boolean;
}

const WalletRegisterForm: React.FC<WalletRegisterFormProps> = ({ onBack, isFullForm = false }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [walletUsername, setWalletUsername] = useState('');
  const [showWalletForm, setShowWalletForm] = useState(false);
  const [walletConnectionTimer, setWalletConnectionTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear any existing timer when component unmounts
    return () => {
      if (walletConnectionTimer) {
        clearTimeout(walletConnectionTimer);
      }
    };
  }, [walletConnectionTimer]);

  const initiateWalletRegistration = async () => {
    setIsSubmitting(true);
    
    try {
      // Set up a timeout to reset the button if wallet connection takes too long
      const timer = setTimeout(() => {
        setIsSubmitting(false);
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
        setIsSubmitting(false);
      }
    } catch (error) {
      // Clear any existing timer
      if (walletConnectionTimer) {
        clearTimeout(walletConnectionTimer);
        setWalletConnectionTimer(null);
      }
      
      toast.error('Failed to connect wallet. Please try again.');
      console.error(error);
      setIsSubmitting(false);
    }
  };

  const handleWalletRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
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
        setIsSubmitting(false);
      }
    } catch (error: any) {
      let errorMessage = 'Wallet registration failed';
      if (error.message === 'Wallet already exists') {
        errorMessage = 'Wallet already registered. Please login instead.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
      setIsSubmitting(false);
    }
  };

  // If we're in the initial state and isFullForm is false, just show the wallet button
  if (!showWalletForm && !isFullForm) {
    return (
      <Button
        variant="outline"
        type="button"
        className="w-full"
        onClick={initiateWalletRegistration}
        disabled={isSubmitting}
      >
        <Wallet className="mr-2 h-4 w-4" />
        {isSubmitting ? 'Connecting...' : 'Register with Wallet'}
      </Button>
    );
  }

  // If we're showing the wallet form or isFullForm is true
  return showWalletForm ? (
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
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Registering...' : 'Complete Wallet Registration'}
      </Button>
      <Button
        variant="outline"
        type="button"
        className="w-full"
        onClick={onBack}
      >
        Back to Registration Options
      </Button>
    </form>
  ) : (
    <Button
      variant="outline"
      type="button"
      className="w-full"
      onClick={initiateWalletRegistration}
      disabled={isSubmitting}
    >
      <Wallet className="mr-2 h-4 w-4" />
      {isSubmitting ? 'Connecting...' : 'Register with Wallet'}
    </Button>
  );
};

export default WalletRegisterForm;
