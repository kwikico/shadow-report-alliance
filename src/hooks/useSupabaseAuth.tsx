
import { useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useSupabaseAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // First set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        return { error };
      }

      toast.success('Logged in successfully!');
      return { data };
    } catch (error: any) {
      toast.error(error.message || 'An error occurred during login');
      return { error };
    }
  };

  const signInWithWallet = async (address: string, signature: string) => {
    try {
      // For demonstration purposes, we're using a custom JWT approach
      // In a real implementation, you might want to use a proper wallet auth method
      const { data, error } = await supabase.auth.signInWithPassword({
        email: `${address}@wallet.com`,
        password: signature.substring(0, 20), // This is just for demo purposes
      });

      if (error) {
        toast.error(error.message);
        return { error };
      }

      toast.success('Logged in with wallet successfully!');
      return { data };
    } catch (error: any) {
      toast.error(error.message || 'An error occurred during wallet login');
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error(error.message);
        return { error };
      }
      toast.success('Logged out successfully!');
      return { success: true };
    } catch (error: any) {
      toast.error(error.message || 'An error occurred during logout');
      return { error };
    }
  };

  return {
    user,
    session,
    loading,
    signIn,
    signInWithWallet,
    signOut,
  };
}
