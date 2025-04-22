
import React, { useState } from "react";
import { AlertTriangle, Plus, Tag, Trash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAppContext, WeakPoint } from "@/context/AppContext";
import { v4 as uuidv4 } from "uuid";

interface WeakPointFormProps {
  onSave: () => void;
}

const WeakPointForm: React.FC<WeakPointFormProps> = ({ onSave }) => {
  const { addWeakPoint } = useAppContext();
  const { toast } = useToast();
  const [muscleGroup, setMuscleGroup] = useState("");
  const [priority, setPriority] = useState(2); // Medium priority by default
  const [sessionsPerWeek, setSessionsPerWeek] = useState(2);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!muscleGroup.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide a muscle group name.",
        variant: "destructive"
      });
      return;
    }
    
    const newWeakPoint: WeakPoint = {
      id: uuidv4(),
      muscleGroup: muscleGroup.trim(),
      priority,
      sessionsPerWeekGoal: sessionsPerWeek
    };
    
    addWeakPoint(newWeakPoint);
    toast({
      title: "Weak Point Added",
      description: `"${muscleGroup}" has been added as a weak point.`
    });
    
    // Reset form
    setMuscleGroup("");
    setPriority(2);
    setSessionsPerWeek(2);
    onSave();
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="muscle-group" className="text-sm font-medium">
          Muscle Group
        </label>
        <Input
          id="muscle-group"
          placeholder="e.g., Shoulders, Arms, Chest"
          value={muscleGroup}
          onChange={(e) => setMuscleGroup(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="priority" className="text-sm font-medium">
          Priority Level
        </label>
        <div className="flex space-x-2">
          {[1, 2, 3].map((level) => (
            <Button
              key={level}
              type="button"
              variant={priority === level ? "default" : "outline"}
              className={
                priority === level 
                  ? "bg-iron-blue hover:bg-blue-700" 
                  : ""
              }
              onClick={() => setPriority(level)}
            >
              {level === 1 ? "Low" : level === 2 ? "Medium" : "High"}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="sessions-per-week" className="text-sm font-medium">
          Target Sessions Per Week
        </label>
        <Input
          id="sessions-per-week"
          type="number"
          min="1"
          max="7"
          value={sessionsPerWeek}
          onChange={(e) => setSessionsPerWeek(parseInt(e.target.value))}
        />
      </div>
      
      <div className="pt-2">
        <Button type="submit" className="w-full bg-iron-blue hover:bg-blue-700">
          Add Weak Point
        </Button>
      </div>
    </form>
  );
};

const WeakPointTracker: React.FC = () => {
  const { weakPoints, deleteWeakPoint, workouts } = useAppContext();
  const [showDialog, setShowDialog] = useState(false);
  
  // Calculate how many times each weak point was trained this week
  const calculateTrainingFrequency = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6); // End of week (Saturday)
    endOfWeek.setHours(23, 59, 59, 999);
    
    const thisWeeksWorkouts = workouts.filter(workout => {
      const workoutDate = new Date(workout.date);
      return workoutDate >= startOfWeek && workoutDate <= endOfWeek;
    });
    
    const trainingCount: Record<string, number> = {};
    
    // Initialize all weak points with 0
    weakPoints.forEach(wp => {
      trainingCount[wp.muscleGroup.toLowerCase()] = 0;
    });
    
    // Count occurrences of each weak point in this week's workouts
    thisWeeksWorkouts.forEach(workout => {
      workout.exercises.forEach(exercise => {
        if (exercise.isWeakPoint) {
          const matchingWeakPoint = weakPoints.find(wp => 
            exercise.name.toLowerCase().includes(wp.muscleGroup.toLowerCase())
          );
          
          if (matchingWeakPoint) {
            trainingCount[matchingWeakPoint.muscleGroup.toLowerCase()]++;
          }
        }
      });
    });
    
    return trainingCount;
  };
  
  const trainingFrequency = calculateTrainingFrequency();
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Weak Point Tracker</h2>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" /> Add Weak Point
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Weak Point</DialogTitle>
            </DialogHeader>
            <WeakPointForm onSave={() => setShowDialog(false)} />
          </DialogContent>
        </Dialog>
      </div>
      
      {weakPoints.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <Tag className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
            <h3 className="text-lg font-medium mb-1">No Weak Points Defined</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Track your weak points to ensure you're training them enough
            </p>
            <Button onClick={() => setShowDialog(true)}>
              Add Your First Weak Point
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {weakPoints
            .sort((a, b) => b.priority - a.priority)
            .map(weakPoint => {
              const currentFrequency = trainingFrequency[weakPoint.muscleGroup.toLowerCase()] || 0;
              const isUnderTrained = currentFrequency < weakPoint.sessionsPerWeekGoal;
              
              return (
                <Card key={weakPoint.id} className="overflow-hidden">
                  <CardHeader className="p-3 pb-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div 
                          className={`w-3 h-3 rounded-full ${
                            weakPoint.priority === 3 
                              ? 'bg-red-500' 
                              : weakPoint.priority === 2 
                                ? 'bg-amber-500' 
                                : 'bg-blue-500'
                          }`}
                        />
                        <CardTitle className="text-base font-medium">
                          {weakPoint.muscleGroup}
                        </CardTitle>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0" 
                        onClick={() => deleteWeakPoint(weakPoint.id)}
                      >
                        <Trash className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <div className="flex justify-between items-center text-sm">
                      <div>
                        <span className="text-muted-foreground">This week: </span>
                        <span className="font-medium">
                          {currentFrequency} / {weakPoint.sessionsPerWeekGoal}
                        </span>
                      </div>
                      {isUnderTrained && (
                        <div className="flex items-center gap-1 text-amber-500">
                          <AlertTriangle className="h-4 w-4" />
                          <span className="text-xs font-medium">Undertrained</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="w-full bg-secondary rounded-full h-2 mt-2">
                      <div 
                        className={`h-2 rounded-full ${
                          isUnderTrained 
                            ? 'bg-amber-500' 
                            : 'bg-green-500'
                        }`}
                        style={{ 
                          width: `${Math.min(
                            100, 
                            (currentFrequency / weakPoint.sessionsPerWeekGoal) * 100
                          )}%` 
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default WeakPointTracker;
