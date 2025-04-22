import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppContext, Exercise } from "@/context/AppContext";
import { v4 as uuidv4 } from 'uuid';

interface WeeklyRoutineBuilderProps {
  onSave: (exercises: Exercise[]) => void;
  onCancel: () => void;
}

const WeeklyRoutineBuilder: React.FC<WeeklyRoutineBuilderProps> = ({ onSave, onCancel }) => {
  const { exercises: allExercises } = useAppContext();
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [exerciseName, setExerciseName] = useState("");
	const [exerciseNotes, setExerciseNotes] = useState("");
  const [isWeakPoint, setIsWeakPoint] = useState(false);
  const [showAddExercise, setShowAddExercise] = useState(false);
  
  useEffect(() => {
    // Load exercises from local storage on component mount
    const storedExercises = localStorage.getItem('selectedExercises');
    if (storedExercises) {
      setSelectedExercises(JSON.parse(storedExercises));
    }
  }, []);
  
  useEffect(() => {
    // Save exercises to local storage whenever selectedExercises changes
    localStorage.setItem('selectedExercises', JSON.stringify(selectedExercises));
  }, [selectedExercises]);
  
  const handleAddExercise = () => {
    setShowAddExercise(true);
  };
  
  const handleCreateExercise = () => {
    if (exerciseName.trim() === "") {
      alert("Exercise name cannot be empty.");
      return;
    }
    
    const newExercise: Exercise = {
      id: uuidv4(),
      name: exerciseName,
      notes: exerciseNotes,
      isWeakPoint: isWeakPoint,
      sets: [], // Add empty sets array to satisfy the Exercise type
      lastProgressDate: new Date() // Add required lastProgressDate
    };
    
    setSelectedExercises([...selectedExercises, newExercise]);
    setExerciseName("");
		setExerciseNotes("");
    setIsWeakPoint(false);
    setShowAddExercise(false);
  };
  
  const handleExerciseSelect = (exerciseId: string) => {
    const exerciseToAdd = allExercises.find(exercise => exercise.id === exerciseId);
    if (exerciseToAdd) {
      setSelectedExercises([...selectedExercises, exerciseToAdd]);
    }
  };
  
  const handleRemoveExercise = (exerciseId: string) => {
    setSelectedExercises(selectedExercises.filter(exercise => exercise.id !== exerciseId));
  };
  
  const handleSaveRoutine = () => {
    // const exercises: Exercise[] = selectedExercises.map(exercise => ({
    //   ...exercise,
    //   sets: [] // Ensure sets is always an array
    // }));
		const exercises: Exercise[] = selectedExercises.map(exercise => ({
      ...exercise,
      sets: [], // Add empty sets array to satisfy the Exercise type
      lastProgressDate: new Date() // Add required lastProgressDate
    }));
    onSave(exercises);
  };
  
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }
    
    const items = Array.from(selectedExercises);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setSelectedExercises(items);
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Create Your Workout</CardTitle>
          <CardDescription>Drag and drop to reorder, or add new exercises.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="exercises">
              {(provided) => (
                <ul {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                  {selectedExercises.map((exercise, index) => (
                    <Draggable key={exercise.id} draggableId={exercise.id} index={index}>
                      {(provided) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="flex items-center justify-between p-3 border rounded-md bg-white shadow-sm"
                        >
                          <span>{exercise.name}</span>
                          <Button variant="ghost" size="icon" onClick={() => handleRemoveExercise(exercise.id)}>
                            Remove
                          </Button>
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>
        </CardContent>
      </Card>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSaveRoutine}>Save Workout</Button>
      </div>
    </div>
  );
};

export default WeeklyRoutineBuilder;
