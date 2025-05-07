
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppContext } from "@/context/AppContext";
import { useToast } from "@/hooks/use-toast";

const MoodLogForm: React.FC<{ logId?: string; onClose: () => void }> = ({ logId, onClose }) => {
  const { moodLogs, addMoodLog, updateMoodLog } = useAppContext();
  const { toast } = useToast();
  const [date, setDate] = useState("");
  const [mood, setMood] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // If editing an existing mood log, load its data
  useEffect(() => {
    if (logId) {
      const log = moodLogs.find((l) => l.id === logId);
      if (log) {
        setDate(typeof log.date === 'string' ? log.date : new Date(log.date).toISOString().split('T')[0]);
        setMood(String(log.mood)); // Convert to string to avoid type issues
        setNotes(log.notes || "");
      }
    }
  }, [logId, moodLogs]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !mood) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const logData = {
        date,
        mood,
        notes,
      };

      if (logId) {
        await updateMoodLog(logId, { ...logData, id: logId });
        toast({
          title: "Success",
          description: "Mood log updated successfully.",
        });
      } else {
        await addMoodLog(logData);
        toast({
          title: "Success",
          description: "Mood log added successfully.",
        });
      }
      onClose();
    } catch (error) {
      console.error("MoodLogForm.tsx: Error saving mood log:", error);
      toast({
        title: "Error",
        description: "Failed to save mood log.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{logId ? "Edit Mood Log" : "Add Mood Log"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div>
            <Label htmlFor="mood">Mood</Label>
            <Select onValueChange={setMood} value={mood}>
              <SelectTrigger id="mood">
                <SelectValue placeholder="Select your mood" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Happy">Happy</SelectItem>
                <SelectItem value="Sad">Sad</SelectItem>
                <SelectItem value="Neutral">Neutral</SelectItem>
                <SelectItem value="Stressed">Stressed</SelectItem>
                <SelectItem value="Excited">Excited</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes"
              disabled={isLoading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Saving..." : logId ? "Update Mood Log" : "Add Mood Log"}
          </Button>
          <Button type="button" variant="outline" className="w-full" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default MoodLogForm;
