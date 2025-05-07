
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppContext } from '@/context/AppContext';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface MoodLogFormProps {
  moodLogId?: string;
  onClose: () => void;
}

const MoodLogForm: React.FC<MoodLogFormProps> = ({ moodLogId, onClose }) => {
  const { addMoodLog, updateMoodLog, moodLogs } = useAppContext();
  
  // Find the existing log if we're editing
  const existingLog = moodLogId ? moodLogs.find(log => log.id === moodLogId) : undefined;
  
  // Set up form state
  const [date, setDate] = useState<string>(existingLog?.date || format(new Date(), 'yyyy-MM-dd'));
  const [time, setTime] = useState<string>(existingLog?.time || format(new Date(), 'HH:mm'));
  const [mood, setMood] = useState<number>(existingLog?.mood || 5);
  const [energy, setEnergy] = useState<string>(existingLog?.energy || 'Normal');
  const [sleep, setSleep] = useState<number>(existingLog?.sleep || 8);
  const [notes, setNotes] = useState<string>(existingLog?.notes || '');
  
  // Form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const logData = {
      date,
      time,
      mood,
      energy,
      sleep,
      notes
    };
    
    if (existingLog) {
      updateMoodLog({
        id: existingLog.id,
        ...logData
      });
    } else {
      addMoodLog(logData);
    }
    
    onClose();
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-xl font-semibold mb-4">{existingLog ? 'Edit Mood Log' : 'New Mood Log'}</h2>
      
      <div className="space-y-4">
        {/* Date and Time */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(new Date(date), 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={new Date(date)}
                  onSelect={(selectedDate) => setDate(format(selectedDate || new Date(), 'yyyy-MM-dd'))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <div className="relative">
              <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="time"
                id="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </div>
        
        {/* Mood Score */}
        <div className="space-y-2">
          <Label>
            Mood Score: {mood}/10
          </Label>
          <div className="flex items-center gap-4 pt-2">
            <span>😞</span>
            <Slider
              defaultValue={[mood]}
              min={1}
              max={10}
              step={1}
              onValueChange={(value) => setMood(value[0])}
              className="flex-1"
            />
            <span>😁</span>
          </div>
        </div>
        
        {/* Energy Level */}
        <div className="space-y-2">
          <Label htmlFor="energy">Energy Level</Label>
          <Select value={energy} onValueChange={setEnergy}>
            <SelectTrigger>
              <SelectValue placeholder="Select energy level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Energized">Energized</SelectItem>
              <SelectItem value="Normal">Normal</SelectItem>
              <SelectItem value="Tired">Tired</SelectItem>
              <SelectItem value="Exhausted">Exhausted</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Sleep Duration */}
        <div className="space-y-2">
          <Label htmlFor="sleep">Sleep Duration (hours)</Label>
          <Input
            type="number"
            id="sleep"
            min={0}
            max={24}
            step={0.5}
            value={sleep}
            onChange={(e) => setSleep(Number(e.target.value))}
          />
        </div>
        
        {/* Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes">Notes (optional)</Label>
          <Textarea
            id="notes"
            placeholder="How are you feeling today?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </div>
      </div>
      
      <div className="flex justify-end gap-2 mt-6">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          {existingLog ? 'Update' : 'Save'}
        </Button>
      </div>
    </form>
  );
};

export default MoodLogForm;
