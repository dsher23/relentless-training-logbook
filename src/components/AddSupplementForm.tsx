
import React from "react";
import { useForm } from "react-hook-form";
import { PillIcon, X } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAppContext, Supplement } from "@/context/AppContext";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from "@/components/ui/drawer";

interface AddSupplementFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type SupplementFormValues = {
  name: string;
  dosage: string;
  notes?: string;
  times: string[];
  days: string[];
};

const weekDays = [
  { value: "mon", label: "M" },
  { value: "tue", label: "T" },
  { value: "wed", label: "W" },
  { value: "thu", label: "T" },
  { value: "fri", label: "F" },
  { value: "sat", label: "S" },
  { value: "sun", label: "S" },
];

const timesOfDay = [
  { value: "08:00", label: "Morning" },
  { value: "12:00", label: "Noon" },
  { value: "15:00", label: "Afternoon" },
  { value: "18:00", label: "Evening" },
  { value: "21:00", label: "Night" },
];

const AddSupplementForm: React.FC<AddSupplementFormProps> = ({ open, onOpenChange }) => {
  const { addSupplement } = useAppContext();
  
  const form = useForm<SupplementFormValues>({
    defaultValues: {
      name: "",
      dosage: "",
      notes: "",
      times: ["08:00"],
      days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
    },
  });

  const onSubmit = (data: SupplementFormValues) => {
    const newSupplement: Supplement = {
      id: crypto.randomUUID(),
      name: data.name,
      dosage: data.dosage,
      notes: data.notes,
      schedule: {
        times: data.times,
        workoutDays: false
      },
    };
    
    addSupplement(newSupplement);
    form.reset();
    onOpenChange(false);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90%] overflow-y-auto">
        <DrawerHeader className="flex items-center justify-between pr-4">
          <DrawerTitle className="flex items-center gap-2">
            <PillIcon className="h-5 w-5 text-gym-purple" />
            Add New Supplement
          </DrawerTitle>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </DrawerClose>
        </DrawerHeader>
        
        <div className="px-4 pb-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                rules={{ required: "Supplement name is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Supplement Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Creatine, Vitamin D, Protein" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="dosage"
                rules={{ required: "Dosage is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dosage</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 5g, 300mg, 1 scoop" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="space-y-2">
                <FormLabel>Time of Day</FormLabel>
                <div className="grid grid-cols-5 gap-2">
                  {timesOfDay.map((time) => (
                    <FormField
                      key={time.value}
                      control={form.control}
                      name="times"
                      render={({ field }) => (
                        <FormItem className="flex flex-col items-center space-y-1">
                          <FormControl>
                            <div className="flex flex-col items-center">
                              <Checkbox 
                                checked={field.value?.includes(time.value)} 
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    field.onChange([...field.value, time.value]);
                                  } else {
                                    field.onChange(field.value?.filter((value) => value !== time.value));
                                  }
                                }}
                              />
                              <span className="text-xs mt-1">{time.label}</span>
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <FormLabel>Days of Week</FormLabel>
                <div className="flex justify-between">
                  {weekDays.map((day) => (
                    <FormField
                      key={day.value}
                      control={form.control}
                      name="days"
                      render={({ field }) => (
                        <FormItem className="flex flex-col items-center space-y-1">
                          <FormControl>
                            <div className="flex flex-col items-center">
                              <Checkbox 
                                checked={field.value?.includes(day.value)} 
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    field.onChange([...field.value, day.value]);
                                  } else {
                                    field.onChange(field.value?.filter((value) => value !== day.value));
                                  }
                                }}
                              />
                              <span className="text-xs mt-1">{day.label}</span>
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </div>
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Any special instructions or notes"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full bg-gym-purple hover:bg-gym-darkPurple"
                >
                  Save Supplement
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default AddSupplementForm;
