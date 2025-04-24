
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
  onWeakPointChange: (value: boolean) => void;
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
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="rest-time">Rest Time</Label>
        <div className="grid grid-cols-2 gap-2">
          <Select
            value={restTime}
            onValueChange={onRestTimeChange}
          >
            <SelectTrigger id="rest-time">
              <SelectValue placeholder="Select rest time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">30 seconds</SelectItem>
              <SelectItem value="60">60 seconds</SelectItem>
              <SelectItem value="90">90 seconds</SelectItem>
              <SelectItem value="120">2 minutes</SelectItem>
              <SelectItem value="180">3 minutes</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
          {restTime === "custom" && (
            <Input
              type="number"
              placeholder="Seconds"
              min={1}
              onChange={(e) => onRestTimeChange(e.target.value)}
            />
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          placeholder="Any additional notes about this exercise..."
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          rows={3}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="weak-point"
          checked={isWeakPoint}
          onCheckedChange={onWeakPointChange}
        />
        <Label htmlFor="weak-point" className="cursor-pointer">
          Mark as weak point exercise
        </Label>
      </div>
    </div>
  );
};

export default ExerciseAdvancedInfo;
