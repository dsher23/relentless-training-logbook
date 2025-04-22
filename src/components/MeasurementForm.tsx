
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

interface MeasurementFormProps {
  onSubmit: (measurement: BodyMeasurement) => void;
  onCancel: () => void;
}

const MeasurementForm: React.FC<MeasurementFormProps> = ({ onSubmit, onCancel }) => {
  const { toast } = useToast();
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
      bodyFatPercentage: "",
      notes: ""
    }
  });

  const handleSubmit = form.handleSubmit((data) => {
    const measurement: BodyMeasurement = {
      id: uuidv4(),
      date: data.date.toISOString(),
      weight: Number(data.weight),
      chest: data.chest ? Number(data.chest) : undefined,
      waist: data.waist ? Number(data.waist) : undefined,
      armsLeft: data.armsLeft ? Number(data.armsLeft) : undefined,
      armsRight: data.armsRight ? Number(data.armsRight) : undefined,
      legsLeft: data.legsLeft ? Number(data.legsLeft) : undefined,
      legsRight: data.legsRight ? Number(data.legsRight) : undefined,
      bodyFatPercentage: data.bodyFatPercentage ? Number(data.bodyFatPercentage) : undefined,
      notes: data.notes || undefined
    };

    toast({
      title: "Measurement Added",
      description: `New measurement added for ${format(data.date, "PPP")}`
    });

    onSubmit(measurement);
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
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
              <FormLabel>Weight (kg)*</FormLabel>
              <FormControl>
                <Input type="number" step="0.1" required {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="chest"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chest (cm)</FormLabel>
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
                <FormLabel>Waist (cm)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="armsLeft"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Left Arm (cm)</FormLabel>
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
                <FormLabel>Right Arm (cm)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="legsLeft"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Left Leg (cm)</FormLabel>
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
                <FormLabel>Right Leg (cm)</FormLabel>
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
                <Input type="number" step="0.1" min="0" max="100" {...field} />
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
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Optional context about your measurements (diet changes, training phase, etc.)
              </FormDescription>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save Measurement</Button>
        </div>
      </form>
    </Form>
  );
};

export default MeasurementForm;
