import React, { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import AddExerciseForm from "@/components/AddExerciseForm";
import ExercisesList from "@/components/ExercisesList";
import { useAppContext } from "@/context/AppContext";
import { Exercise } from "@/types";
import { Card, CardContent } from "@/components/ui/card";

const WorkoutBuilder: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { addWorkout, updateWorkout, workouts } = useAppContext();
  const [showExerciseForm, setShowExerciseForm] = useState(false);
  const [editingExerciseId, setEditingExerciseId] = useState<string | null>(null);
  
  const workoutName = location.state?.workoutName || "";
  
  const workout = id ? workouts.find(w => w.id === id) : {
    id: "",
    name: workoutName,
    exercises: [],
    date: new Date(),
    completed: false
  };
  
  if (id && !workout) {
    navigate("/workouts");
    return null;
  }

  const handleSaveExercise = (exercise: Exercise) => {
    let updatedExercises;
    if (editingExerciseId) {
      updatedExercises = workout.exercises.map(ex => 
        ex.id === editingExerciseId ? exercise : ex
      );
    } else {
      updatedExercises = [...workout.exercises, exercise];
    }
    
    if (id) {
      updateWorkout({ ...workout, exercises: updatedExercises });
    } else {
      addWorkout({ ...workout, exercises: updatedExercises });
    }
    
    setShowExerciseForm(false);
    setEditingExerciseId(null);
  };

  const handleDeleteExercise = (exerciseId: string) => {
    const updatedExercises = workout.exercises.filter(ex => ex.id !== exerciseId);
    if (id) {
      updateWorkout({ ...workout, exercises: updatedExercises });
    }
  };

  const totalSets = workout.exercises.reduce((acc: number, exercise) => {
    return acc + exercise.sets.length;
  }, 0);

  return (
    <div className="app-container animate-fade-in">
      <Header title={workout.name} />
      
      <div className="p-4 space-y-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold">{workout.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {workout.exercises.length} exercises • {totalSets} total sets
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
          exercises={workout.exercises}
          onAddExercise={() => setShowExerciseForm(true)}
          onEditExercise={(id) => {
            setEditingExerciseId(id);
            setShowExerciseForm(true);
          }}
          onDeleteExercise={handleDeleteExercise}
        />
        
        <div className="fixed bottom-16 left-0 right-0 p-4 bg-background border-t">
          <Button 
            className="w-full bg-gym-purple hover:bg-gym-darkPurple"
            onClick={() => navigate("/workouts")}
          >
            Finish
          </Button>
        </div>
      </div>

      <AddExerciseForm 
        isOpen={showExerciseForm}
        onClose={() => {
          setShowExerciseForm(false);
          setEditingExerciseId(null);
        }}
        onSave={handleSaveExercise}
        exercise={editingExerciseId ? workout.exercises.find(ex => ex.id === editingExerciseId) : undefined}
      />
    </div>
  );
};

export default WorkoutBuilder;
