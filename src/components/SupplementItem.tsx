
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppContext } from "@/context/AppContext";
import { useToast } from "@/hooks/use-toast";

const SupplementItem: React.FC<{ supplement: any }> = ({ supplement }) => {
  const { supplementLogs, addSupplementLog, updateSupplementLog, addReminder, updateSupplement } = useAppContext();
  const { toast } = useToast();
  const [logDate, setLogDate] = useState("");
  const [taken, setTaken] = useState(false);
  const [reminderDate, setReminderDate] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(supplement.name);
  const [dosage, setDosage] = useState(supplement.dosage);
  const [frequency, setFrequency] = useState(supplement.frequency);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogSupplement = async () => {
    if (!logDate) {
      toast({
        title: "Error",
        description: "Please select a date for the log.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const logData = {
        supplementId: supplement.id,
        date: logDate, // Already a string from input type="date"
        taken,
      };

      const existingLog = supplementLogs.find(
        (log) => log.supplementId === supplement.id && log.date === logDate
      );

      if (existingLog) {
        await updateSupplementLog(existingLog.id, { ...logData, id: existingLog.id });
        toast({
          title: "Success",
          description: "Supplement log updated successfully.",
        });
      } else {
        await addSupplementLog(logData);
        toast({
          title: "Success",
          description: "Supplement log added successfully.",
        });
      }
    } catch (error) {
      console.error("SupplementItem.tsx: Error logging supplement:", error);
      toast({
        title: "Error",
        description: "Failed to log supplement.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddReminder = async () => {
    if (!reminderDate) {
      toast({
        title: "Error",
        description: "Please select a reminder date.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const reminderData = {
        type: `Take ${supplement.name}`,
        dueDate: reminderDate, // Already a string from input type="datetime-local"
        seen: false,
      };
      await addReminder(reminderData);
      toast({
        title: "Success",
        description: "Reminder added successfully.",
      });
    } catch (error) {
      console.error("SupplementItem.tsx: Error adding reminder:", error);
      toast({
        title: "Error",
        description: "Failed to add reminder.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateSupplement = async () => {
    if (!name || !dosage || !frequency) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const updatedSupplement = {
        name,
        dosage,
        frequency,
        date: supplement.date,
      };
      await updateSupplement(supplement.id, { ...updatedSupplement, id: supplement.id });
      toast({
        title: "Success",
        description: "Supplement updated successfully.",
      });
      setIsEditing(false);
    } catch (error) {
      console.error("SupplementItem.tsx: Error updating supplement:", error);
      toast({
        title: "Error",
        description: "Failed to update supplement.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{supplement.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing ? (
          <>
            <div>
              <Label htmlFor={`name-${supplement.id}`}>Name</Label>
              <Input
                id={`name-${supplement.id}`}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter supplement name"
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor={`dosage-${supplement.id}`}>Dosage</Label>
              <Input
                id={`dosage-${supplement.id}`}
                type="text"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                placeholder="Enter dosage"
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor={`frequency-${supplement.id}`}>Frequency</Label>
              <Input
                id={`frequency-${supplement.id}`}
                type="text"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                placeholder="Enter frequency"
                disabled={isLoading}
              />
            </div>
            <Button onClick={handleUpdateSupplement} className="w-full" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setIsEditing(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </>
        ) : (
          <>
            <p>Dosage: {supplement.dosage}</p>
            <p>Frequency: {supplement.frequency}</p>
            <div>
              <Label htmlFor={`logDate-${supplement.id}`}>Log Date</Label>
              <Input
                id={`logDate-${supplement.id}`}
                type="date"
                value={logDate}
                onChange={(e) => setLogDate(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div>
              <Label>
                <Input
                  type="checkbox"
                  checked={taken}
                  onChange={(e) => setTaken(e.target.checked)}
                  disabled={isLoading}
                />
                Taken
              </Label>
            </div>
            <Button onClick={handleLogSupplement} className="w-full" disabled={isLoading}>
              {isLoading ? "Logging..." : "Log Supplement"}
            </Button>
            <div>
              <Label htmlFor={`reminderDate-${supplement.id}`}>Set Reminder</Label>
              <Input
                id={`reminderDate-${supplement.id}`}
                type="datetime-local"
                value={reminderDate}
                onChange={(e) => setReminderDate(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button onClick={handleAddReminder} className="w-full" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Reminder"}
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setIsEditing(true)}
              disabled={isLoading}
            >
              Edit Supplement
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SupplementItem;
