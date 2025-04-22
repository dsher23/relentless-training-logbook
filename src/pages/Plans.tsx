
import React from "react";
import Header from "@/components/Header";
import WorkoutPlanList from "@/components/WorkoutPlanList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/AppContext";

const Plans: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { workoutPlans } = useAppContext();

  // Redirect from /plans to /exercise-plans for consistency
  React.useEffect(() => {
    if (window.location.pathname === "/plans") {
      navigate("/exercise-plans", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="app-container animate-fade-in pb-16">
      <Header title="Workout Plans" />
      
      <div className="px-4 mt-4 mb-6">
        <Card className="bg-secondary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary/60">
                <CalendarDays className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">Workout Plans</h3>
                <p className="text-sm text-muted-foreground">
                  Organize multiple workout days into structured training plans
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="px-4 mt-4">
        <Tabs defaultValue="plans">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="plans" className="flex-1">Active Plans</TabsTrigger>
            <TabsTrigger value="archived" className="flex-1">Archived</TabsTrigger>
          </TabsList>
          
          <TabsContent value="plans" className="mt-1">
            <WorkoutPlanList />
          </TabsContent>
          
          <TabsContent value="archived" className="mt-4">
            {workoutPlans.filter(p => p.archived).length > 0 ? (
              <WorkoutPlanList showArchived={true} />
            ) : (
              <div className="text-center p-6 text-muted-foreground border border-dashed rounded-lg">
                <p>Archived plans will appear here</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Plans;
