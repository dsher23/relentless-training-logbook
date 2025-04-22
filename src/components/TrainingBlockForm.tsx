
import React, { useState } from "react";
import { Calendar as CalendarIcon, Save } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAppContext, WeeklyRoutine, TrainingBlock } from "@/context/AppContext";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";

interface TrainingBlockFormValues {
  name: string;
  weeklyRoutineId: string;
  startDate: Date;
  durationWeeks: number;
  notes: string;
}

interface WeeklyScheduleBuilderProps {
  value: WeeklyRoutine | null;
  onChange: (value: WeeklyRoutine) => void;
}

const WeeklyScheduleBuilder: React.FC<WeeklyScheduleBuilderProps> = ({ value, onChange }) => {
  const { workoutTemplates } = useAppContext();
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
  const handleDayUpdate = (dayOfWeek: number, templateId: string | null) => {
    if (!value) return;
    
    const updatedDays = [...value.workoutDays];
    const existingDayIndex = updatedDays.findIndex(d => d.dayOfWeek === dayOfWeek);
    
    if (existingDayIndex >= 0) {
      if (templateId === null) {
        updatedDays.splice(existingDayIndex, 1);
      } else {
        updatedDays[existingDayIndex].workoutTemplateId = templateId;
      }
    } else if (templateId !== null) {
      updatedDays.push({ dayOfWeek, workoutTemplateId: templateId });
    }
    
    onChange({
      ...value,
      workoutDays: updatedDays
    });
  };
  
  return (
    <div className="space-y-3">
      {dayNames.map((day, index) => (
        <div key={day} className="flex items-center gap-3">
          <div className="w-20 text-sm font-medium">{day}</div>
          <Select
            value={value?.workoutDays.find(d => d.dayOfWeek === index)?.workoutTemplateId || ""}
            onValueChange={(val) => handleDayUpdate(index, val || null)}
          >
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Rest Day" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Rest Day</SelectItem>
              {workoutTemplates.map((template) => (
                <SelectItem key={template.id} value={template.id}>
                  {template.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}
    </div>
  );
};

interface TrainingBlockFormProps {
  blockId?: string;
  nextSuggestedDate?: Date;
  onSave?: () => void;
  onClose?: () => void;
}

const TrainingBlockForm: React.FC<TrainingBlockFormProps> = ({ 
  blockId, 
  nextSuggestedDate,
  onSave,
  onClose 
}) => {
  const { 
    trainingBlocks, 
    addTrainingBlock, 
    updateTrainingBlock, 
    weeklyRoutines,
    addWeeklyRoutine 
  } = useAppContext();
  const { toast } = useToast();
  
  const existingBlock = blockId ? trainingBlocks.find(b => b.id === blockId) : null;
  
  const [weeklyRoutine, setWeeklyRoutine] = useState<WeeklyRoutine>(() => {
    if (existingBlock) {
      return weeklyRoutines.find(r => r.id === existingBlock.weeklyRoutineId) || {
        id: uuidv4(),
        name: "New Schedule",
        workoutDays: []
      };
    }
    return {
      id: uuidv4(),
      name: "New Schedule",
      workoutDays: []
    };
  });
  
  const form = useForm<TrainingBlockFormValues>({
    defaultValues: {
      name: existingBlock?.name || "",
      weeklyRoutineId: existingBlock?.weeklyRoutineId || "",
      startDate: existingBlock?.startDate ? new Date(existingBlock.startDate) : nextSuggestedDate || new Date(),
      durationWeeks: existingBlock?.durationWeeks || 6,
      notes: existingBlock?.notes || ""
    }
  });
  
  const handleSubmit = (values: TrainingBlockFormValues) => {
    if (weeklyRoutine.workoutDays.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please add at least one workout day to your schedule.",
        variant: "destructive"
      });
      return;
    }
    
    const existingRoutine = weeklyRoutines.find(r => r.id === weeklyRoutine.id);
    if (!existingRoutine) {
      addWeeklyRoutine(weeklyRoutine);
    }
    
    const blockData: TrainingBlock = {
      id: existingBlock?.id || uuidv4(),
      name: values.name,
      startDate: values.startDate,
      durationWeeks: values.durationWeeks,
      weeklyRoutineId: weeklyRoutine.id,
      notes: values.notes
    };
    
    if (existingBlock) {
      updateTrainingBlock(blockData);
      toast({
        title: "Training Block Updated",
        description: `${values.name} has been updated.`
      });
    } else {
      addTrainingBlock(blockData);
      toast({
        title: "Training Block Created",
        description: `${values.name} has been created.`
      });
    }
    
    if (onSave) {
      onSave();
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Block Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Strength Phase" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Start Date</FormLabel>
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
          name="durationWeeks"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration (Weeks)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="1" 
                  max="52" 
                  {...field} 
                  onChange={e => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="space-y-2">
          <FormLabel>Weekly Schedule</FormLabel>
          <Card>
            <CardContent className="pt-4">
              <WeeklyScheduleBuilder 
                value={weeklyRoutine} 
                onChange={setWeeklyRoutine}
              />
            </CardContent>
          </Card>
        </div>
        
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Any specific goals or focus for this training block?"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end">
          <Button type="submit" className="bg-iron-blue hover:bg-blue-700">
            <Save className="mr-2 h-4 w-4" />
            {existingBlock ? "Update" : "Save"} Training Block
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TrainingBlockForm;
