
import React, { useState, useEffect } from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Exercise } from "@/types";
import { v4 as uuidv4 } from 'uuid';
import { MoveVertical } from "lucide-react";

interface WeeklyRoutineBuilderProps {
  onSave: (exercises: Exercise[]) => void;
  onCancel: () => void;
  templateId?: string;
}

const SortableExerciseItem = ({ exercise, onRemove }: { exercise: Exercise; onRemove: (id: string) => void }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: exercise.id });
  
  const style = {
    transform: transform ? `translate3d(0, ${transform.y}px, 0)` : undefined,
    transition,
  };
  
  return (
    <li 
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between p-3 border rounded-md bg-white shadow-sm"
    >
      <div className="flex items-center space-x-2">
        <span className="cursor-grab" {...attributes} {...listeners}>
          <MoveVertical size={16} />
        </span>
        <span>{exercise.name}</span>
      </div>
      <Button variant="ghost" size="sm" onClick={() => onRemove(exercise.id)}>
        Remove
      </Button>
    </li>
  );
};

const WeeklyRoutineBuilder: React.FC<WeeklyRoutineBuilderProps> = ({ 
  onSave, 
  onCancel,
  templateId 
}) => {
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [exerciseName, setExerciseName] = useState("");
  const [exerciseNotes, setExerciseNotes] = useState("");
  const [isWeakPoint, setIsWeakPoint] = useState(false);
  const [showAddExercise, setShowAddExercise] = useState(false);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
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
  
  const handleRemoveExercise = (exerciseId: string) => {
    setSelectedExercises(selectedExercises.filter(exercise => exercise.id !== exerciseId));
  };
  
  const handleSaveRoutine = () => {
    const exercises: Exercise[] = selectedExercises.map(exercise => ({
      ...exercise,
      sets: exercise.sets || [], // Ensure sets is always an array
      lastProgressDate: exercise.lastProgressDate || new Date() // Ensure lastProgressDate exists
    }));
    onSave(exercises);
  };
  
  function handleDragEnd(event: any) {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      setSelectedExercises((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Create Your Workout</CardTitle>
          <CardDescription>Drag and drop to reorder, or add new exercises.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
          >
            <SortableContext 
              items={selectedExercises.map(ex => ex.id)} 
              strategy={verticalListSortingStrategy}
            >
              <ul className="space-y-2">
                {selectedExercises.map((exercise) => (
                  <SortableExerciseItem 
                    key={exercise.id}
                    exercise={exercise}
                    onRemove={handleRemoveExercise}
                  />
                ))}
              </ul>
            </SortableContext>
          </DndContext>
          
          {showAddExercise && (
            <div className="space-y-3 p-3 border rounded-md">
              <Input 
                placeholder="Exercise name" 
                value={exerciseName}
                onChange={(e) => setExerciseName(e.target.value)}
              />
              <Textarea 
                placeholder="Notes (optional)" 
                value={exerciseNotes}
                onChange={(e) => setExerciseNotes(e.target.value)}
              />
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="weak-point" 
                  checked={isWeakPoint}
                  onChange={(e) => setIsWeakPoint(e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="weak-point">Mark as weak point</label>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowAddExercise(false)}>Cancel</Button>
                <Button onClick={handleCreateExercise}>Add Exercise</Button>
              </div>
            </div>
          )}
          
          {!showAddExercise && (
            <Button onClick={handleAddExercise} className="w-full">+ Add Exercise</Button>
          )}
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
