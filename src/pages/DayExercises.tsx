import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import AddExerciseForm from "@/components/AddExerciseForm";
import ExercisesList from "@/components/ExercisesList";
import { useAppContext } from "@/context/AppContext";
import { Exercise } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const DayExercises: React.FC = () => {
  const { planId = '', dayId = '' } = useParams<{ planId: string, dayId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { workoutPlans, workoutTemplates, updateWorkoutPlan, updateWorkoutTemplate } = useAppContext();
  
  const [showExerciseForm, setShowExerciseForm] = useState(false);
  const [editingExerciseId, setEditingExerciseId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Find active plan if planId is not provided
  const activePlan = planId 
    ? workoutPlans.find(p => p.id === planId)
    : workoutPlans.find(p => p.isActive);
    
  const plan = activePlan;
  
  // Find day in plan or in all templates if not in plan
  const day = plan?.workoutTemplates.find(t => t.id === dayId) || 
              workoutTemplates.find(t => t.id === dayId);
  
  useEffect(() => {
    // Simulate data loading to ensure client-side data is ready
    const timer = setTimeout(() => {
      setIsLoading(false);
      
      if (!day && dayId) {
        setError("Could not load this workout. Please try again.");
        console.error(`Workout day not found. ID: ${dayId}, PlanID: ${planId}`);
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [day, dayId, planId]);
  
  if (isLoading) {
    return (
      <div className="app-container animate-fade-in">
        <Header title="Loading Workout..." />
        <div className="p-4 space-y-4">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }
  
  if (error || !day) {
    // Handle the case where day is not found
    return (
      <div className="app-container animate-fade-in">
        <Header title="Workout Not Found" />
        <div className="p-4 text-center">
          <p className="mb-4">{error || "The workout day could not be found."}</p>
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Go Back
          </Button>
        </div>
      </div>
    );
  }

  const handleSaveExercise = (exercise: Exercise) => {
    let updatedExercises;
    if (editingExerciseId) {
      updatedExercises = day.exercises.map(ex => 
        ex.id === editingExerciseId ? exercise : ex
      );
    } else {
      updatedExercises = [...day.exercises, exercise];
    }
    
    // Update the day template
    const updatedDay = { ...day, exercises: updatedExercises };
    updateWorkoutTemplate(updatedDay);
    
    // If the day is part of a plan, update the plan as well
    if (plan) {
      const updatedPlanTemplates = plan.workoutTemplates.map(t => 
        t.id === dayId ? updatedDay : t
      );
      updateWorkoutPlan({
        ...plan,
        workoutTemplates: updatedPlanTemplates
      });
    }
    
    setShowExerciseForm(false);
    setEditingExerciseId(null);
    
    toast({
      title: "Success",
      description: editingExerciseId ? "Exercise updated" : "Exercise added",
    });
  };

  const handleDeleteExercise = (exerciseId: string) => {
    const updatedExercises = day.exercises.filter(ex => ex.id !== exerciseId);
    
    // Update the day template
    const updatedDay = { ...day, exercises: updatedExercises };
    updateWorkoutTemplate(updatedDay);
    
    // If the day is part of a plan, update the plan as well
    if (plan) {
      const updatedPlanTemplates = plan.workoutTemplates.map(t => 
        t.id === dayId ? updatedDay : t
      );
      updateWorkoutPlan({
        ...plan,
        workoutTemplates: updatedPlanTemplates
      });
    }
    
    toast({
      title: "Success",
      description: "Exercise removed",
    });
  };

  // Calculate total sets across all exercises with safety checks
  const totalSets: number = (day.exercises || []).reduce(
    (acc: number, curr: Exercise) => acc + (curr.sets?.length || 0), 
    0
  );
  
  // Determine the back button navigation destination
  const handleBackClick = () => {
    if (plan) {
      navigate(`/exercise-plans/${plan.id}/days`);
    } else {
      navigate("/workouts");
    }
  };

  return (
    <div className="app-container animate-fade-in">
      <Header title={day ? (day.name || "Edit Workout") : "Workout Not Found"} />
      
      <div className="p-4 space-y-6">
        <Button 
          variant="outline" 
          onClick={handleBackClick}
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        
        {day ? (
          <>
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-semibold">{day.name || "Workout Day"}</h2>
                    <p className="text-sm text-muted-foreground">
                      {(day.exercises || []).length} exercises • {totalSets} total sets
                    </p>
                  </div>
                  <Button 
                    onClick={() => {
                      setEditingExerciseId(null);
                      setShowExerciseForm(true);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add Exercise
                  </Button>
                </div>
              </CardContent>
            </Card>

            <ExercisesList 
              exercises={day.exercises || []}
              onAddExercise={() => setShowExerciseForm(true)}
              onEditExercise={(id) => {
                setEditingExerciseId(id);
                setShowExerciseForm(true);
              }}
              onDeleteExercise={handleDeleteExercise}
            />
          </>
        ) : !isLoading && (
          <div className="text-center p-6 bg-muted/30 rounded-md">
            <p className="text-muted-foreground">This workout couldn't be loaded. Please check the link or try again.</p>
          </div>
        )}
      </div>

      <AddExerciseForm 
        isOpen={showExerciseForm}
        onClose={() => {
          setShowExerciseForm(false);
          setEditingExerciseId(null);
        }}
        onSave={handleSaveExercise}
        exercise={editingExerciseId ? day?.exercises.find(ex => ex.id === editingExerciseId) : undefined}
      />
    </div>
  );
};

export default DayExercises;
