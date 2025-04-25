import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save, Play } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import Header from "@/components/Header";
import { useAppContext } from "@/context/AppContext";

interface CreateWorkoutFormValues {
  name: string;
  notes?: string;
}

const CreateWorkout: React.FC = () => {
  const { addWorkout } = useAppContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<CreateWorkoutFormValues>({
    defaultValues: {
      name: "",
      notes: ""
    }
  });

  const handleSave = async (values: CreateWorkoutFormValues, startWorkout = false) => {
    setSubmitting(true);
    
    try {
      // Generate a unique ID for the workout
      const workoutId = uuidv4();
      // Add workout to context
      addWorkout(values.name, [], { notes: values.notes, id: workoutId });
      // Pass workout data to builder, including ID for tracking
      navigate("/workouts/builder", {
        state: { 
          workoutId,
          workoutName: values.name,
          notes: values.notes,
          startAfterCreation: startWorkout 
        }
      });
    } catch (error) {
      console.error("Error creating workout:", error);
      toast({
        title: "Error",
        description: "Failed to create workout. Please try again.",
        variant: "destructive"
      });
      setSubmitting(false);
    }
  };

  return (
    <div className="app-container animate-fade-in">
      <Header title="Create Workout" />
      
      <div className="p-4">
        <Card>
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={(e) => {
                e.preventDefault();
                const values = form.getValues();
                handleSave(values, false); // Default to just saving without starting
              }} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Workout Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Push Day, Leg Day" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Any specific goals for this workout?"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end gap-2">
                  <Button 
                    type="submit" 
                    className="bg-gym-blue hover:bg-gym-blue/90"
                    disabled={submitting}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Workout
                  </Button>
                  
                  <Button 
                    type="button"
                    className="bg-gym-purple hover:bg-gym-purple/90"
                    disabled={submitting}
                    onClick={() => {
                      const values = form.getValues();
                      handleSave(values, true); // Save and start workout
                    }}
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Start Workout
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateWorkout;
