
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Search, PlusCircle, FileQuestion } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import NavigationHeader from "@/components/NavigationHeader";
import TabNavigation from "@/components/TabNavigation";
import { useAppContext } from "@/context/AppContext";

const WorkoutTypeSelection: React.FC = () => {
  const navigate = useNavigate();
  const { workoutTemplates, workoutPlans } = useAppContext();
  const [searchQuery, setSearchQuery] = useState("");

  // Find active workout plan
  const activePlan = workoutPlans.find(plan => plan.active);

  const filteredTemplates = workoutTemplates.filter(
    template => template.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="app-container animate-fade-in pb-16">
      <NavigationHeader title="Start Workout" showBack={true} />
      
      <div className="p-4 space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search workout templates..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Options */}
        <div className="grid gap-4">
          <Card 
            className="cursor-pointer hover:bg-secondary/10"
            onClick={() => navigate("/create-workout")}
          >
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <PlusCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Create New Workout</h3>
                  <p className="text-sm text-muted-foreground">
                    Build a custom workout from scratch
                  </p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:bg-secondary/10"
            onClick={() => navigate("/quick-workout")}
          >
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <FileQuestion className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Quick Workout</h3>
                  <p className="text-sm text-muted-foreground">
                    Start an empty workout and add exercises as you go
                  </p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </div>
        
        {/* Active Plan Templates */}
        {activePlan && activePlan.workoutTemplates.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-3">From Active Plan: {activePlan.name}</h2>
            <div className="grid gap-2">
              {activePlan.workoutTemplates.map((template) => (
                <Card
                  key={template.id}
                  className="cursor-pointer hover:bg-secondary/10"
                  onClick={() => navigate(`/live-workout/${template.id}?isTemplate=true`)}
                >
                  <CardContent className="p-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{template.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {template.exercises?.length || 0} exercises
                      </p>
                    </div>
                    <Button size="sm">
                      Start
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
        
        {/* Recent Templates */}
        {filteredTemplates.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-3">Templates {searchQuery && "(Search Results)"}</h2>
            <div className="grid gap-2">
              {filteredTemplates.map((template) => (
                <Card
                  key={template.id}
                  className="cursor-pointer hover:bg-secondary/10"
                  onClick={() => navigate(`/live-workout/${template.id}?isTemplate=true`)}
                >
                  <CardContent className="p-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{template.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {template.exercises?.length || 0} exercises
                      </p>
                    </div>
                    <Button size="sm">
                      Start
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
        
        {filteredTemplates.length === 0 && searchQuery && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No templates match your search</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setSearchQuery("")}
            >
              Clear Search
            </Button>
          </div>
        )}
        
        {workoutTemplates.length === 0 && !searchQuery && (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No workout templates found</p>
            <Button onClick={() => navigate("/create-workout")}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Your First Template
            </Button>
          </div>
        )}
      </div>
      
      <TabNavigation />
    </div>
  );
};

export default WorkoutTypeSelection;
