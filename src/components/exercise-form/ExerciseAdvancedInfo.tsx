
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ExerciseAdvancedInfoProps {
  restTime: string;
  notes: string;
  isWeakPoint: boolean;
  onRestTimeChange: (value: string) => void;
  onNotesChange: (value: string) => void;
  onWeakPointChange: (checked: boolean) => void;
}

const ExerciseAdvancedInfo: React.FC<ExerciseAdvancedInfoProps> = ({
  restTime,
  notes,
  isWeakPoint,
  onRestTimeChange,
  onNotesChange,
  onWeakPointChange,
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="rest-time">Rest Time (seconds)</Label>
        <Select 
          value={restTime} 
          onValueChange={onRestTimeChange}
        >
          <SelectTrigger id="rest-time">
            <SelectValue placeholder="Select rest time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30">30s</SelectItem>
            <SelectItem value="60">60s</SelectItem>
            <SelectItem value="90">90s</SelectItem>
            <SelectItem value="120">120s</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
        {restTime === "custom" && (
          <p className="text-sm text-muted-foreground">
            You can set a custom rest time during your workout.
          </p>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="weak-point" 
          checked={isWeakPoint}
          onCheckedChange={(checked) => onWeakPointChange(checked === true)}
        />
        <Label htmlFor="weak-point" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Mark as weak point exercise
        </Label>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Textarea 
          id="notes"
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="e.g., slow tempo, pause at bottom"
        />
      </div>
    </>
  );
};

export default ExerciseAdvancedInfo;
