
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';

interface FormData {
  username: string;
  email: string;
  password: string;
}

interface EmailRegisterFormProps {
  onSubmitting: (isSubmitting: boolean) => void;
}

const EmailRegisterForm: React.FC<EmailRegisterFormProps> = ({ onSubmitting }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
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
    onSubmitting(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            username: formData.username,
          }
        }
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Registration Successful! Check your email to confirm your account.');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
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
      onSubmitting(false);
    }
  };

  return (
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
  );
};

export default EmailRegisterForm;
