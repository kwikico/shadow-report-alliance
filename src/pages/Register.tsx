
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import EmailRegisterForm from '@/components/auth/EmailRegisterForm';
import WalletRegisterForm from '@/components/auth/WalletRegisterForm';

const Register = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showWalletForm, setShowWalletForm] = useState(false);

  const handleSubmittingChange = (submitting: boolean) => {
    setIsSubmitting(submitting);
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
              <EmailRegisterForm onSubmitting={handleSubmittingChange} />
              
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or</span>
                </div>
              </div>
              
              <WalletRegisterForm 
                onBack={() => setShowWalletForm(false)} 
                isFullForm={false} 
              />
            </CardContent>
            <CardFooter className="flex justify-center">
              <Link to="/login" className="text-sm text-muted-foreground hover:text-primary">
                Already have an account? Login
              </Link>
            </CardFooter>
          </>
        ) : (
          <CardContent className="grid gap-4">
            <WalletRegisterForm 
              onBack={() => setShowWalletForm(false)} 
              isFullForm={true} 
            />
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default Register;
