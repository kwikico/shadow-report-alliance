import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Index from "@/pages/Index";
import Reports from "@/pages/Reports";
import Map from "@/pages/Map";
import Submit from "@/pages/Submit";
import Profile from "@/pages/Profile";
import ReportDetail from "@/pages/ReportDetail";
import NotFound from "@/pages/NotFound";
import { SeedDataButton } from "@/components/SeedDataButton";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/reports/:id" element={<ReportDetail />} />
            <Route path="/map" element={<Map />} />
            <Route path="/submit" element={<Submit />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="/register" element={<Navigate to="/" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          {/* Seed data button for development */}
          <SeedDataButton />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
