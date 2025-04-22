
import React from "react";
import Header from "@/components/Header";
import WorkoutPlanList from "@/components/WorkoutPlanList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";

const Plans: React.FC = () => {
  const navigate = useNavigate();

  // Redirect from /plans to /exercise-plans for consistency
  React.useEffect(() => {
    if (window.location.pathname === "/plans") {
      navigate("/exercise-plans", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="app-container animate-fade-in">
      <Header title="Exercise Plans" />
      
      <div className="px-4 mt-4">
        <Tabs defaultValue="plans">
          <TabsList className="w-full">
            <TabsTrigger value="plans" className="flex-1">Active Plans</TabsTrigger>
            <TabsTrigger value="archived" className="flex-1">Archived</TabsTrigger>
          </TabsList>
          
          <TabsContent value="plans" className="mt-4">
            <WorkoutPlanList />
          </TabsContent>
          
          <TabsContent value="archived" className="mt-4">
            <div className="text-center p-6 text-muted-foreground">
              Archived plans will appear here
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Plans;
