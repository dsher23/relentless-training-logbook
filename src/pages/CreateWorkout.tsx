
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Save } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { useAppContext, Workout } from "@/context/AppContext";
import Header from "@/components/Header";

interface CreateWorkoutFormValues {
  name: string;
  date: Date;
  notes?: string;
}

const CreateWorkout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addWorkout, workouts, updateWorkout, getWorkoutById } = useAppContext();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  // Get edit ID from query params (if any)
  const searchParams = new URLSearchParams(location.search);
  const editId = searchParams.get('edit');
  const templateId = searchParams.get('templateId');
  
  // Find workout if in edit mode
  const existingWorkout = editId ? getWorkoutById(editId) : null;
  
  // Setup form
  const form = useForm<CreateWorkoutFormValues>({
    defaultValues: {
      name: existingWorkout?.name || "",
      date: existingWorkout?.date ? new Date(existingWorkout.date) : new Date(),
      notes: existingWorkout?.notes || ""
    }
  });
  
  // Load data when edit ID changes
  useEffect(() => {
    if (existingWorkout) {
      form.reset({
        name: existingWorkout.name,
        date: new Date(existingWorkout.date),
        notes: existingWorkout.notes || ""
      });
    }
  }, [editId, existingWorkout, form]);

  const handleSubmit = async (values: CreateWorkoutFormValues) => {
    setSubmitting(true);
    
    try {
      if (existingWorkout) {
        // Update existing workout
        const updatedWorkout: Workout = {
          ...existingWorkout,
          name: values.name,
          date: values.date,
          notes: values.notes || ""
        };
        
        updateWorkout(updatedWorkout);
        
        toast({
          title: "Workout Updated",
          description: `${values.name} has been updated.`
        });
        
        // Add a slight delay before navigation to ensure context is updated
        setTimeout(() => {
          navigate(`/workouts/${updatedWorkout.id}`);
          setSubmitting(false);
        }, 100);
      } else {
        // Create new workout
        const newWorkout: Workout = {
          id: uuidv4(),
          name: values.name,
          date: values.date,
          exercises: [],
          completed: false,
          notes: values.notes || ""
        };
        
        addWorkout(newWorkout);
        
        toast({
          title: "Workout Created",
          description: `${values.name} has been created.`
        });
        
        // Add a slight delay before navigation to ensure context is updated
        setTimeout(() => {
          navigate(`/workouts/${newWorkout.id}`);
          setSubmitting(false);
        }, 100);
      }
    } catch (error) {
      console.error("Error saving workout:", error);
      toast({
        title: "Error",
        description: "Failed to save workout. Please try again.",
        variant: "destructive"
      });
      setSubmitting(false);
    }
  };

  return (
    <div className="app-container animate-fade-in">
      <Header title={existingWorkout ? "Edit Workout" : "Create Workout"} />
      
      <div className="p-4">
        <Card>
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Workout Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className="w-full pl-3 text-left font-normal"
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
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
                
                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    className="bg-gym-purple hover:bg-gym-darkPurple"
                    disabled={submitting}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {submitting ? "Saving..." : existingWorkout ? "Update Workout" : "Create Workout"}
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
