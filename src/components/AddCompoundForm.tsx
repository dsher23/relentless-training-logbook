
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { SteroidCompound } from "@/types";

interface AddCompoundFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (compound: SteroidCompound) => void;
  initialCompound?: SteroidCompound;
  cycleId?: string;
}

const AddCompoundForm: React.FC<AddCompoundFormProps> = ({
  open,
  onOpenChange,
  onSave,
  initialCompound,
  cycleId,
}) => {
  const form = useForm({
    defaultValues: {
      name: initialCompound?.name || "",
      weeklyDosage: initialCompound?.weeklyDosage?.toString() || "",
      dosageUnit: initialCompound?.dosageUnit || "mg",
      frequency: initialCompound?.frequency || "2x/week",
      duration: initialCompound?.duration?.toString() || "",
      notes: initialCompound?.notes || "",
    },
  });

  const handleSubmit = (values: any) => {
    const compound: SteroidCompound = {
      id: initialCompound?.id || uuidv4(),
      cycleId: cycleId || "",
      name: values.name,
      weeklyDosage: parseFloat(values.weeklyDosage) || 0,
      dosageUnit: values.dosageUnit,
      frequency: values.frequency,
      duration: values.duration ? parseInt(values.duration, 10) || undefined : undefined,
      notes: values.notes,
      active: initialCompound?.active ?? true,
    };
    
    onSave(compound);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{initialCompound ? "Edit Compound" : "Add Compound"}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Compound Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Testosterone Enanthate" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex gap-2">
              <FormField
                control={form.control}
                name="weeklyDosage"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Weekly Dosage</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="500" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="dosageUnit"
                render={({ field }) => (
                  <FormItem className="w-1/3">
                    <FormLabel>Unit</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="mg" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="mg">mg</SelectItem>
                        <SelectItem value="ml">ml</SelectItem>
                        <SelectItem value="mcg">mcg</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="frequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Frequency</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1x/week">1x per week</SelectItem>
                      <SelectItem value="2x/week">2x per week</SelectItem>
                      <SelectItem value="3x/week">3x per week</SelectItem>
                      <SelectItem value="EOD">Every other day</SelectItem>
                      <SelectItem value="ED">Every day</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration (weeks) - Optional</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="10" {...field} />
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
                  <FormLabel>Notes - Optional</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Split Mon/Thu" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end pt-4">
              <Button type="submit" className="bg-gym-purple hover:bg-gym-darkPurple">
                Save Compound
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCompoundForm;
