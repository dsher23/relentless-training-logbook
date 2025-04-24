
import React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useForm } from "react-hook-form";
import { BodyMeasurement } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';
import NavigationHeader from "./NavigationHeader";

interface MeasurementFormProps {
  onSubmit: (measurement: BodyMeasurement) => void;
  onCancel: () => void;
  unitSystem?: 'metric' | 'imperial';
}

const MeasurementForm: React.FC<MeasurementFormProps> = ({ onSubmit, onCancel, unitSystem = 'metric' }) => {
  const { toast } = useToast();
  const weightUnit = unitSystem === 'metric' ? 'kg' : 'lbs';
  const sizeUnit = unitSystem === 'metric' ? 'cm' : 'in';
  
  const form = useForm({
    defaultValues: {
      date: new Date(),
      weight: "",
      chest: "",
      waist: "",
      armsLeft: "",
      armsRight: "",
      legsLeft: "",
      legsRight: "",
      thigh: "",
      calf: "",
      biceps: "",
      forearm: "",
      bodyFatPercentage: "",
      notes: ""
    }
  });

  const handleSubmit = form.handleSubmit((data) => {
    if (!data.weight) {
      toast({
        title: "Error",
        description: "Weight is required",
        variant: "destructive"
      });
      return;
    }

    const measurement: BodyMeasurement = {
      id: uuidv4(),
      date: data.date,
      weight: Number(data.weight),
      chest: data.chest ? Number(data.chest) : undefined,
      waist: data.waist ? Number(data.waist) : undefined,
      arms: data.armsLeft ? Number(data.armsLeft) : undefined,
      legs: data.legsLeft ? Number(data.legsLeft) : undefined,
      bodyFat: data.bodyFatPercentage ? Number(data.bodyFatPercentage) : undefined,
      notes: data.notes || undefined
    };

    toast({
      title: "Measurements Saved",
      description: `New measurements added for ${format(data.date, "PPP")}`
    });

    onSubmit(measurement);
  });

  return (
    <div className="flex flex-col h-full">
      <NavigationHeader 
        title="Add Measurements"
        showBack={true}
        showHome={true}
      />
      
      <Form {...form}>
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-2">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
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
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weight ({weightUnit})*</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.1" 
                      required 
                      {...field}
                      className="bg-background"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="chest"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chest ({sizeUnit})</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="waist"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Waist ({sizeUnit})</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="armsLeft"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Left Arm ({sizeUnit})</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="armsRight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Right Arm ({sizeUnit})</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="biceps"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Biceps ({sizeUnit})</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="forearm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Forearm ({sizeUnit})</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="legsLeft"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Left Leg ({sizeUnit})</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="legsRight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Right Leg ({sizeUnit})</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="thigh"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thigh ({sizeUnit})</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="calf"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Calf ({sizeUnit})</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="bodyFatPercentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Body Fat %</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.1" 
                      min="0" 
                      max="100" 
                      {...field}
                      className="bg-background"
                    />
                  </FormControl>
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
                      placeholder="Add any notes about your measurements..."
                      className="min-h-[100px] bg-background resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Optional context about your measurements (diet changes, training phase, etc.)
                  </FormDescription>
                </FormItem>
              )}
            />
          </div>

          <div className="sticky bottom-0 p-4 bg-background border-t">
            <div className="flex gap-2">
              <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Save Measurements
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default MeasurementForm;
