
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Workouts from "./pages/Workouts";
import Measurements from "./pages/Measurements";
import Supplements from "./pages/Supplements";
import Recovery from "./pages/Recovery";
import TabNavigation from "./components/TabNavigation";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/workouts" element={<Workouts />} />
            <Route path="/measurements" element={<Measurements />} />
            <Route path="/supplements" element={<Supplements />} />
            <Route path="/recovery" element={<Recovery />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <TabNavigation />
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
