import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { register } from '@/api';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      const response = await register(
        formData.username,
        formData.email,
        formData.password
      );

      toast({
        title: 'Registration Successful!',
        description: 'You have successfully registered. Redirecting to login...',
        duration: 3000,
        position: 'top-right',
      });
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      let errorMessage = 'Registration failed';
      if (error.message === 'User already exists') {
        errorMessage = 'Email already in use. Please use a different email or login.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMessage,
        position: 'top-right',
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background">
      <Card className="w-[350px]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Register</CardTitle>
          <CardDescription>Create an account to submit reports</CardDescription>
        </CardHeader>
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
            <CardFooter className="mt-4">
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Registering...' : 'Register'}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;