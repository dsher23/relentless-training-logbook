
import React, { useState } from "react";
import { format } from "date-fns";
import { PillIcon, Check, X, Clock, CalendarCheck, Edit, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Supplement, SupplementLog, useAppContext } from "@/context/AppContext";

interface SupplementItemProps {
  supplement: Supplement;
  log?: SupplementLog;
  date?: Date;
}

const SupplementItem: React.FC<SupplementItemProps> = ({ supplement, log, date = new Date() }) => {
  const { addSupplementLog, updateSupplementLog, addReminder, updateSupplement } = useAppContext();
  const [showTimePopover, setShowTimePopover] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(supplement.name);
  const [editedDosage, setEditedDosage] = useState(supplement.dosage);
  const [editedNotes, setEditedNotes] = useState(supplement.notes || "");
  
  const handleToggle = () => {
    if (!log) {
      addSupplementLog({
        id: crypto.randomUUID(),
        supplementId: supplement.id,
        date: new Date(date),
        dosageTaken: supplement.dosage,
        taken: true,
        time: new Date()
      } as SupplementLog);
    } else {
      updateSupplementLog({
        ...log,
        taken: !log.taken,
        time: log.taken ? undefined : new Date()
      } as SupplementLog);
    }
  };
  
  const handleAddReminder = (time: string) => {
    // Create a date object for today with the specified time
    const [hours, minutes] = time.split(':').map(Number);
    const reminderDate = new Date();
    reminderDate.setHours(hours, minutes, 0, 0);
    
    // Add reminder
    addReminder({
      id: crypto.randomUUID(),
      type: "supplement",
      supplementId: supplement.id,
      dateTime: reminderDate,
      title: `Time to take ${supplement.name}`,
      message: `${supplement.dosage} as scheduled`,
      dueDate: reminderDate,
      seen: false,
      dismissed: false
    });
    
    // Update supplement with time
    const times = supplement.schedule?.times || [];
    if (!times.includes(time)) {
      updateSupplement({
        ...supplement,
        schedule: {
          times: [...times, time],
          workoutDays: supplement.schedule?.workoutDays || false
        }
      });
    }
    
    setShowTimePopover(false);
  };

  const handleStartEditing = () => {
    setEditedName(supplement.name);
    setEditedDosage(supplement.dosage);
    setEditedNotes(supplement.notes || "");
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    updateSupplement({
      ...supplement,
      name: editedName,
      dosage: editedDosage,
      notes: editedNotes || undefined
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  // Get formatted schedule times if available
  const scheduleTimes = supplement.schedule?.times?.map(time => {
    const [hours, minutes] = time.split(':').map(Number);
    const timeDate = new Date();
    timeDate.setHours(hours, minutes, 0, 0);
    return format(timeDate, "h:mm a");
  }).join(', ');

  if (isEditing) {
    return (
      <div className="p-4 border-b bg-muted/30">
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium mb-1 block">Name</label>
            <Input 
              value={editedName} 
              onChange={(e) => setEditedName(e.target.value)} 
              className="h-8"
            />
          </div>
          <div>
            <label className="text-xs font-medium mb-1 block">Dosage</label>
            <Input 
              value={editedDosage} 
              onChange={(e) => setEditedDosage(e.target.value)} 
              className="h-8"
            />
          </div>
          <div>
            <label className="text-xs font-medium mb-1 block">Notes (optional)</label>
            <Input 
              value={editedNotes} 
              onChange={(e) => setEditedNotes(e.target.value)} 
              className="h-8"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <Button 
              size="sm" 
              onClick={handleSaveEdit}
              className="h-8"
            >
              <Save className="h-4 w-4 mr-1" /> Save
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCancelEdit}
              className="h-8"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center">
        <div className="p-2 rounded-full bg-secondary text-gym-purple mr-3">
          <PillIcon className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-medium">{supplement.name}</h3>
          <p className="text-xs text-muted-foreground">
            {supplement.dosage}
            {scheduleTimes && ` · ${scheduleTimes}`}
          </p>
          {supplement.notes && (
            <p className="text-xs text-muted-foreground italic mt-1">{supplement.notes}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Popover open={showTimePopover} onOpenChange={setShowTimePopover}>
          <PopoverTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-muted-foreground hover:text-primary"
            >
              <Clock className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-3" side="top">
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Set reminder time</h4>
              <div className="grid grid-cols-3 gap-1">
                {["08:00", "12:00", "15:00", "18:00", "21:00", "23:00"].map(time => (
                  <Button 
                    key={time}
                    variant="outline"
                    size="sm"
                    className="text-xs h-7"
                    onClick={() => handleAddReminder(time)}
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-muted-foreground hover:text-primary"
          onClick={handleStartEditing}
        >
          <Edit className="h-4 w-4" />
        </Button>
        
        <button
          onClick={handleToggle}
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            log?.taken ? "bg-gym-success text-white" : "bg-secondary text-muted-foreground"
          }`}
          aria-label={log?.taken ? "Mark as not taken" : "Mark as taken"}
        >
          {log?.taken ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};

export default SupplementItem;
