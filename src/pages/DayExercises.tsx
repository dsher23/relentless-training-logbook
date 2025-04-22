
import React, { useState } from "react";
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

const DayExercises: React.FC = () => {
  const { planId, dayId } = useParams<{ planId: string, dayId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { workoutPlans, workoutTemplates, updateWorkoutPlan, updateWorkoutTemplate } = useAppContext();
  
  const [showExerciseForm, setShowExerciseForm] = useState(false);
  const [editingExerciseId, setEditingExerciseId] = useState<string | null>(null);
  
  const plan = workoutPlans.find(p => p.id === planId);
  const day = plan?.workoutTemplates.find(t => t.id === dayId) || 
              workoutTemplates.find(t => t.id === dayId);
  
  if (!day) {
    navigate(`/exercise-plans/${planId}/days`);
    return null;
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

  // Calculate total sets across all exercises
  const totalSets: number = (day.exercises as Exercise[]).reduce(
    (acc: number, curr: Exercise) => acc + curr.sets.length, 
    0
  );

  return (
    <div className="app-container animate-fade-in">
      <Header title={day.name} />
      
      <div className="p-4 space-y-6">
        <Button 
          variant="outline" 
          onClick={() => navigate(`/exercise-plans/${planId}/days`)}
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Workout Days
        </Button>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold">{day.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {day.exercises.length} exercises • {totalSets} total sets
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
          exercises={day.exercises}
          onAddExercise={() => setShowExerciseForm(true)}
          onEditExercise={(id) => {
            setEditingExerciseId(id);
            setShowExerciseForm(true);
          }}
          onDeleteExercise={handleDeleteExercise}
        />
      </div>

      <AddExerciseForm 
        isOpen={showExerciseForm}
        onClose={() => {
          setShowExerciseForm(false);
          setEditingExerciseId(null);
        }}
        onSave={handleSaveExercise}
        exercise={editingExerciseId ? day.exercises.find(ex => ex.id === editingExerciseId) : undefined}
      />
    </div>
  );
};

export default DayExercises;
