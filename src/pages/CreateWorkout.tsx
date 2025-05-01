
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
      // Validate input
      if (!values.name.trim()) {
        toast({
          title: "Workout name required",
          description: "Please enter a name for your workout.",
          variant: "destructive"
        });
        setSubmitting(false);
        return;
      }

      // Generate a unique ID for the workout
      const workoutId = uuidv4();
      
      // Add workout to context with initial data
      addWorkout(values.name, [], { id: workoutId, notes: values.notes });
      
      // Show confirmation toast
      toast({
        title: "Workout created",
        description: `'${values.name}' has been created. Add exercises to complete your workout.`
      });
      
      // Pass workout data to builder
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
        <Card className="bg-secondary/20 border-border/30">
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={(e) => {
                e.preventDefault();
                const values = form.getValues();
                handleSave(values, false);
              }} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white font-semibold text-base">Workout Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., Push Day, Leg Day" 
                          {...field} 
                          className="bg-secondary/75 text-white font-medium"
                        />
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
                      <FormLabel className="text-white">Notes</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Any specific goals for this workout?"
                          className="min-h-[100px] bg-secondary/50 text-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex flex-col sm:flex-row justify-end gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="border-muted-foreground text-muted-foreground order-2 sm:order-1"
                    disabled={submitting}
                    onClick={() => navigate("/workouts")}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-gym-blue hover:bg-gym-blue/90 order-1 sm:order-2"
                    disabled={submitting}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Create Workout
                  </Button>
                  
                  <Button 
                    type="button"
                    className="bg-gym-purple hover:bg-gym-purple/90 order-3"
                    disabled={submitting}
                    onClick={() => {
                      const values = form.getValues();
                      handleSave(values, true); // Save and start workout
                    }}
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Create & Start
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
