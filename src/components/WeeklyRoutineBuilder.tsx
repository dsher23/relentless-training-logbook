
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
      className="flex items-center justify-between p-3 border rounded-md bg-white shadow-sm mb-2"
    >
      <div className="flex items-center space-x-2">
        <span className="cursor-grab" {...attributes} {...listeners}>
          <MoveVertical size={16} />
        </span>
        <div>
          <span className="font-medium">{exercise.name}</span>
          <div className="text-sm text-muted-foreground">
            {exercise.sets.length} sets × {exercise.sets[0]?.reps || 0} reps
            {exercise.restTime ? ` – Rest: ${exercise.restTime}s` : ''}
          </div>
        </div>
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
  const [routineName, setRoutineName] = useState("New Routine");
  
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
    
    // If templateId is provided, try to load that routine from local storage
    if (templateId) {
      const storedRoutines = localStorage.getItem('workoutTemplates');
      if (storedRoutines) {
        const routines = JSON.parse(storedRoutines);
        const targetRoutine = routines.find((r: any) => r.id === templateId);
        if (targetRoutine) {
          setRoutineName(targetRoutine.name);
          setSelectedExercises(targetRoutine.exercises || []);
        }
      }
    }
  }, [templateId]);
  
  useEffect(() => {
    // Save exercises to local storage whenever selectedExercises changes
    localStorage.setItem('selectedExercises', JSON.stringify(selectedExercises));
  }, [selectedExercises]);
  
  const handleAddExercise = () => {
    setShowAddExercise(true);
  };
  
  const handleSaveExercise = (exercise: Exercise) => {
    setSelectedExercises([...selectedExercises, exercise]);
    setShowAddExercise(false);
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
  
  const handleSaveRoutine = () => {
    // Create a workout template object
    const workoutTemplate = {
      id: templateId || uuidv4(),
      name: routineName,
      exercises: selectedExercises,
      isFavorite: false
    };
    
    // Save to localStorage for persistence between sessions
    const storedTemplates = localStorage.getItem('workoutTemplates');
    let templates = [];
    
    if (storedTemplates) {
      templates = JSON.parse(storedTemplates);
      // Update existing or add new
      const existingIndex = templates.findIndex((t: any) => t.id === workoutTemplate.id);
      if (existingIndex >= 0) {
        templates[existingIndex] = workoutTemplate;
      } else {
        templates.push(workoutTemplate);
      }
    } else {
      templates = [workoutTemplate];
    }
    
    localStorage.setItem('workoutTemplates', JSON.stringify(templates));
    
    // Pass the exercises to the parent component
    onSave(selectedExercises);
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Create Your Workout Routine</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="routine-name" className="block text-sm font-medium mb-1">
              Routine Name
            </label>
            <Input
              id="routine-name"
              value={routineName}
              onChange={(e) => setRoutineName(e.target.value)}
              placeholder="e.g., Push Day, Pull Day, Leg Day"
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Exercises</h3>
              <Button onClick={handleAddExercise} size="sm">
                <Plus className="h-4 w-4 mr-2" /> Add Exercise
              </Button>
            </div>
            
            {selectedExercises.length === 0 ? (
              <div className="p-4 border border-dashed rounded-md text-center text-muted-foreground">
                No exercises added yet. Click "Add Exercise" to start building your routine.
              </div>
            ) : (
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
            )}
          </div>
          
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={onCancel}>Cancel</Button>
            <Button onClick={handleSaveRoutine}>Save Routine</Button>
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
