import React, { useState, useEffect } from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Exercise } from "@/types";
import AddExerciseForm from "./AddExerciseForm";
import { v4 as uuidv4 } from 'uuid';
import { Plus, MoveVertical } from "lucide-react";

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
  
  const handleSaveExercise = (exercise: Exercise) => {
    setSelectedExercises([...selectedExercises, exercise]);
  };
  
  const handleRemoveExercise = (exerciseId: string) => {
    setSelectedExercises(selectedExercises.filter(exercise => exercise.id !== exerciseId));
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
          
          <Button onClick={handleAddExercise} className="w-full">
            <Plus className="h-4 w-4 mr-2" /> Add Exercise
          </Button>
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={onCancel}>Cancel</Button>
            <Button onClick={() => onSave(selectedExercises)}>Save Workout</Button>
          </div>
        </CardContent>
      </Card>
      
      <AddExerciseForm 
        isOpen={showAddExercise}
        onClose={() => setShowAddExercise(false)}
        onSave={handleSaveExercise}
      />
    </div>
  );
};

export default WeeklyRoutineBuilder;
