import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Plus, Edit, Trash2, GripVertical } from "lucide-react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import { useAppContext } from "@/context/AppContext";
import { Workout, Exercise, WorkoutTemplate } from "@/types";

interface ExerciseItemProps {
  exercise: Exercise;
  index: number;
  moveExercise: (dragIndex: number, hoverIndex: number) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const ExerciseItem: React.FC<ExerciseItemProps> = ({
  exercise,
  index,
  moveExercise,
  onEdit,
  onDelete,
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: "EXERCISE",
    item: { id: exercise.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        //console.log(`Dropped ${item.id} into ${dropResult.id}`);
      }
    },
  });

  const [{ isOver }, drop] = useDrop({
    accept: "EXERCISE",
    hover: (item: any, monitor) => {
      if (!drag) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }
      const hoverBoundingRect = (
        (monitor.getSourceClientOffset() as any)?.target as HTMLElement
      )?.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = (clientOffset as any).y - hoverBoundingRect.top;
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      moveExercise(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const opacity = isDragging ? 0 : 1;

  const dragDropRef = React.useRef(null);
  const dragRef = (el: any) => {
    drag(el);
    dragDropRef.current = el;
  };
  const dropRef = (el: any) => drop(el);

  React.useEffect(() => {
    dropRef(dragDropRef.current);
  }, [dropRef]);

  return (
    <Card
      ref={dragRef}
      id={`exercise-${exercise.id}`}
      className="mb-2 cursor-move"
      style={{ opacity }}
    >
      <CardContent className="flex items-center justify-between p-3">
        <div className="flex items-center">
          <GripVertical className="mr-2 h-4 w-4 text-muted-foreground" />
          <span>{exercise.name}</span>
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onEdit(exercise.id)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="destructive"
            size="icon"
            onClick={() => onDelete(exercise.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const WorkoutBuilder: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { addWorkoutTemplate, updateWorkoutTemplate, workoutTemplates } = useAppContext();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [exerciseName, setExerciseName] = useState("");
  const [editingExerciseId, setEditingExerciseId] = useState<string | null>(null);
  const [workoutName, setWorkoutName] = useState(location.state?.workoutName || "");
  const [showAddExercise, setShowAddExercise] = useState(false);

  useEffect(() => {
    if (id) {
      const workoutToEdit = workoutTemplates.find(template => template.id === id);
      if (workoutToEdit) {
        setWorkoutName(workoutToEdit.name);
        setExercises(workoutToEdit.exercises);
      } else {
        toast({
          title: "Workout not found",
          description: "The workout you're trying to edit does not exist.",
          variant: "destructive"
        });
        navigate("/workouts");
      }
    } else if (location.state?.workoutName) {
      setWorkoutName(location.state.workoutName);
    }
  }, [id, location.state, navigate, toast, workoutTemplates]);

  const { startAfterCreation } = location.state || {};

  const handleAddExercise = () => {
    if (exerciseName.trim() === "") {
      toast({
        title: "Error",
        description: "Exercise name cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    const newExercise: Exercise = {
      id: uuidv4(),
      name: exerciseName,
      sets: [],
      lastProgressDate: new Date(), // Adding the required property
    };

    setExercises([...exercises, newExercise]);
    setExerciseName("");
    setShowAddExercise(false);
  };

  const handleEditExercise = (id: string) => {
    setEditingExerciseId(id);
    const exerciseToEdit = exercises.find((exercise) => exercise.id === id);
    if (exerciseToEdit) {
      setExerciseName(exerciseToEdit.name);
      setShowAddExercise(true);
    }
  };

  const handleUpdateExercise = () => {
    if (exerciseName.trim() === "") {
      toast({
        title: "Error",
        description: "Exercise name cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    const updatedExercises = exercises.map((exercise) =>
      exercise.id === editingExerciseId
        ? { ...exercise, name: exerciseName }
        : exercise
    );

    setExercises(updatedExercises);
    setExerciseName("");
    setEditingExerciseId(null);
    setShowAddExercise(false);
  };

  const handleDeleteExercise = (id: string) => {
    setExercises(exercises.filter((exercise) => exercise.id !== id));
  };

  const moveExercise = (dragIndex: number, hoverIndex: number) => {
    const draggedExercise = exercises[dragIndex];
    const newExercises = [...exercises];
    newExercises.splice(dragIndex, 1);
    newExercises.splice(hoverIndex, 0, draggedExercise);
    setExercises(newExercises);
  };

  const handleComplete = () => {
    if (!workoutName || exercises.length === 0) {
      toast({
        title: "Cannot create workout",
        description: "Please add at least one exercise to your workout.",
        variant: "destructive",
      });
      return;
    }

    try {
      const workoutId = id || uuidv4();

      const newWorkoutTemplate: WorkoutTemplate = {
        id: workoutId,
        name: workoutName,
        exercises: exercises,
        isFavorite: false,
      };

      if (id) {
        updateWorkoutTemplate(newWorkoutTemplate);
      } else {
        addWorkoutTemplate(newWorkoutTemplate);
      }

      toast({
        title: "Success",
        description: "Your workout has been saved successfully.",
      });

      if (startAfterCreation) {
        navigate(`/live-workout/${workoutId}?isTemplate=true`);
      } else {
        navigate("/workouts");
      }
    } catch (error) {
      console.error("Error creating workout:", error);
      toast({
        title: "Error",
        description: "Failed to save workout. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="app-container animate-fade-in">
        <Header title={id ? "Edit Workout" : "Create Workout"} />

        <div className="p-4">
          <Input
            type="text"
            placeholder="Workout Name"
            value={workoutName}
            onChange={(e) => setWorkoutName(e.target.value)}
            className="mb-4"
          />

          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Exercises</h2>
                <Button size="sm" onClick={() => setShowAddExercise(true)}>
                  <Plus className="h-4 w-4 mr-2" /> Add Exercise
                </Button>
              </div>
            </CardContent>
          </Card>

          {showAddExercise && (
            <Card className="mb-4">
              <CardContent className="p-4">
                <Label htmlFor="exerciseName">Exercise Name</Label>
                <Input
                  type="text"
                  id="exerciseName"
                  placeholder="e.g., Bench Press"
                  value={exerciseName}
                  onChange={(e) => setExerciseName(e.target.value)}
                  className="mb-3"
                />
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setShowAddExercise(false);
                      setExerciseName("");
                      setEditingExerciseId(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={
                      editingExerciseId ? handleUpdateExercise : handleAddExercise
                    }
                  >
                    {editingExerciseId ? "Update Exercise" : "Add Exercise"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {exercises.length === 0 ? (
            <Card>
              <CardContent className="text-center p-5">
                No exercises added yet. Click "Add Exercise" to start building
                your workout.
              </CardContent>
            </Card>
          ) : (
            exercises.map((exercise, index) => (
              <ExerciseItem
                key={exercise.id}
                exercise={exercise}
                index={index}
                moveExercise={moveExercise}
                onEdit={handleEditExercise}
                onDelete={handleDeleteExercise}
              />
            ))
          )}

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => navigate("/workouts")}>
              Cancel
            </Button>
            <Button onClick={handleComplete}>
              {startAfterCreation ? "Save and Start Workout" : "Save Workout"}
            </Button>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default WorkoutBuilder;
