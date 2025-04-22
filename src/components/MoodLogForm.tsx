
import React, { useState } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { MoodLog, useAppContext } from "@/context/AppContext";

const emojis = ["😖", "😔", "😐", "😊", "🤩"];

interface MoodLogFormProps {
  existingLog?: MoodLog;
  onSave?: () => void;
}

const MoodLogForm: React.FC<MoodLogFormProps> = ({ existingLog, onSave }) => {
  const { addMoodLog, updateMoodLog } = useAppContext();
  const [sleep, setSleep] = useState(existingLog?.sleepQuality || existingLog?.sleep || 7);
  const [energy, setEnergy] = useState(existingLog?.energyLevel || existingLog?.energy || 7);
  const [mood, setMood] = useState<number>(existingLog?.mood || 3); // Use number for mood, default to 3 (neutral)
  const [notes, setNotes] = useState(existingLog?.notes || "");

  const handleSave = () => {
    const newLog = {
      id: existingLog?.id || crypto.randomUUID(),
      date: existingLog?.date || new Date(),
      sleepQuality: sleep,
      energyLevel: energy,
      mood,
      notes,
      stressLevel: existingLog?.stressLevel || 5, // Default stress level
      // Add compatibility fields
      sleep,
      energy
    };
    
    if (existingLog) {
      updateMoodLog(newLog as MoodLog);
    } else {
      addMoodLog(newLog as MoodLog);
    }
    
    if (onSave) onSave();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {existingLog 
            ? `Edit Recovery Log - ${format(new Date(existingLog.date), "MMM d, yyyy")}`
            : `Today's Recovery Log - ${format(new Date(), "MMM d, yyyy")}`
          }
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Sleep Quality</label>
          <div className="flex items-center">
            <span className="mr-4 text-sm">Poor</span>
            <Slider
              value={[sleep]}
              min={1}
              max={10}
              step={1}
              onValueChange={(value) => setSleep(value[0])}
              className="flex-1"
            />
            <span className="ml-4 text-sm">Great</span>
          </div>
          <div className="text-center text-sm text-muted-foreground mt-1">
            {sleep}/10
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Energy Level</label>
          <div className="flex items-center">
            <span className="mr-4 text-sm">Low</span>
            <Slider
              value={[energy]}
              min={1}
              max={10}
              step={1}
              onValueChange={(value) => setEnergy(value[0])}
              className="flex-1"
            />
            <span className="ml-4 text-sm">High</span>
          </div>
          <div className="text-center text-sm text-muted-foreground mt-1">
            {energy}/10
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Mood</label>
          <div className="flex justify-between">
            {emojis.map((emoji, index) => (
              <button
                key={index}
                onClick={() => setMood(index + 1)} // Set mood as number 1-5
                className={`p-2 rounded-full text-2xl ${
                  mood === index + 1 ? "bg-secondary" : ""
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Notes</label>
          <Textarea
            placeholder="How are you feeling today?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </div>
        
        <Button onClick={handleSave} className="w-full bg-gym-purple text-white hover:bg-gym-darkPurple">
          Save Recovery Log
        </Button>
      </CardContent>
    </Card>
  );
};

export default MoodLogForm;
