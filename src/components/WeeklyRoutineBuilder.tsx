import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash, Star } from "lucide-react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAppContext, WorkoutTemplate, Exercise } from "@/context/AppContext";
import { v4 as uuidv4 } from 'uuid';

interface ExerciseItemProps {
  exercise: Omit<Exercise, "sets">;
  onDelete: () => void;
  isLast?: boolean;
}

const SortableExerciseItem = ({ exercise, onDelete, isLast = false }: ExerciseItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: exercise.id
  });
  
  const style = {
    transform: transform ? `translate3d(0, ${transform.y}px, 0)` : undefined,
    transition,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`flex items-center gap-2 p-3 bg-card border rounded-md mb-2 ${isLast ? "" : "border-b"}`}
    >
      <div {...attributes} {...listeners} className="cursor-move text-muted-foreground">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="18" 
          height="18" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="lucide lucide-grip-vertical"
        >
          <circle cx="9" cy="12" r="1"/>
          <circle cx="9" cy="5" r="1"/>
          <circle cx="9" cy="19" r="1"/>
          <circle cx="15" cy="12" r="1"/>
          <circle cx="15" cy="5" r="1"/>
          <circle cx="15" cy="19" r="1"/>
        </svg>
      </div>
      <div className="flex-grow">
        {exercise.name}
        {exercise.isWeakPoint && (
          <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-800 text-xs rounded-full">
            Weak Point
          </span>
        )}
      </div>
      <Button variant="ghost" size="sm" onClick={onDelete}>
        <Trash size={16} className="text-destructive" />
      </Button>
    </div>
  );
};

interface RoutineBuilderProps {
  templateId?: string;
  onSave?: () => void;
}

const WeeklyRoutineBuilder: React.FC<RoutineBuilderProps> = ({ templateId, onSave }) => {
  const { workoutTemplates, addWorkoutTemplate, updateWorkoutTemplate, weakPoints } = useAppContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const existingTemplate = templateId 
    ? workoutTemplates.find(t => t.id === templateId) 
    : undefined;
  
  const [name, setName] = useState(existingTemplate?.name || "");
  const [dayName, setDayName] = useState(existingTemplate?.dayName || "");
  const [exercises, setExercises] = useState<Omit<Exercise, "sets">[]>(
    existingTemplate?.exercises || []
  );
  const [newExercise, setNewExercise] = useState("");
  const [isWeakPoint, setIsWeakPoint] = useState(false);
  const [isFavorite, setIsFavorite] = useState(existingTemplate?.isFavorite || false);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setExercises((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };
  
  const addExercise = () => {
    if (newExercise.trim()) {
      setExercises([
        ...exercises, 
        {
          id: uuidv4(),
          name: newExercise.trim(),
          lastProgressDate: new Date(),
          isWeakPoint
        }
      ]);
      setNewExercise("");
      setIsWeakPoint(false);
    }
  };
  
  const removeExercise = (id: string) => {
    setExercises(exercises.filter(e => e.id !== id));
  };
  
  const handleSave = () => {
    if (!name.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide a template name.",
        variant: "destructive",
      });
      return;
    }
    
    if (exercises.length === 0) {
      toast({
        title: "Missing Exercises",
        description: "Please add at least one exercise.",
        variant: "destructive",
      });
      return;
    }
    
    const template: WorkoutTemplate = {
      id: existingTemplate?.id || uuidv4(),
      name: name.trim(),
      dayName: dayName.trim() || undefined,
      exercises,
      isFavorite,
    };
    
    if (existingTemplate) {
      updateWorkoutTemplate(template);
      toast({
        title: "Template Updated",
        description: `"${name}" has been updated.`,
      });
    } else {
      addWorkoutTemplate(template);
      toast({
        title: "Template Created",
        description: `"${name}" has been created.`,
      });
    }
    
    if (onSave) {
      onSave();
    } else {
      navigate("/routines");
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-medium">
              {existingTemplate ? "Edit" : "Create"} Workout Template
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFavorite(!isFavorite)}
              className={isFavorite ? "text-yellow-500" : "text-muted-foreground"}
            >
              <Star className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="template-name">Template Name</Label>
              <Input 
                id="template-name" 
                placeholder="e.g., Push Day"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="day-name">Day Name (Optional)</Label>
              <Input 
                id="day-name" 
                placeholder="e.g., Push, Pull, Legs"
                value={dayName}
                onChange={(e) => setDayName(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div className="pt-4 border-t">
              <h3 className="font-medium mb-2">Exercises</h3>
              
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToVerticalAxis]}
              >
                <SortableContext 
                  items={exercises.map(e => e.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {exercises.length > 0 ? (
                    <div className="space-y-2 mb-4">
                      {exercises.map((exercise, index) => (
                        <SortableExerciseItem 
                          key={exercise.id}
                          exercise={exercise}
                          onDelete={() => removeExercise(exercise.id)}
                          isLast={index === exercises.length - 1}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 border border-dashed rounded-md mb-4">
                      <p className="text-muted-foreground">No exercises added yet</p>
                    </div>
                  )}
                </SortableContext>
              </DndContext>
              
              <div className="flex gap-2 items-end">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="new-exercise">Add Exercise</Label>
                  <Input 
                    id="new-exercise" 
                    placeholder="Exercise name"
                    value={newExercise}
                    onChange={(e) => setNewExercise(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addExercise()}
                  />
                </div>
                <div className="flex items-center gap-2 mb-0.5">
                  <input
                    type="checkbox"
                    id="weak-point"
                    checked={isWeakPoint}
                    onChange={(e) => setIsWeakPoint(e.target.checked)}
                    className="rounded border-iron-muted text-iron-blue focus:ring-iron-blue"
                  />
                  <label htmlFor="weak-point" className="text-sm">Weak Point</label>
                  <Button type="button" onClick={addExercise}>
                    <Plus size={16} />
                    Add
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end pt-4">
              <Button
                onClick={handleSave}
                className="bg-iron-blue hover:bg-blue-700"
              >
                {existingTemplate ? "Update" : "Save"} Template
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeeklyRoutineBuilder;
