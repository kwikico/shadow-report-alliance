import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { seedReports } from "@/utils/seedReports";

export const SeedDataButton = () => {
  const handleSeed = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error("You must be logged in to seed data");
      return;
    }

    await seedReports(user.id);
  };

  // Only show this component in development mode
  if (import.meta.env.DEV) {
    return (
      <button 
        onClick={handleSeed}
        className="fixed bottom-4 right-4 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-md text-sm font-medium z-50"
      >
        Add Test Reports
      </button>
    );
  }

  return null;
}; 