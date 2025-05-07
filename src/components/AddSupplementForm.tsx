
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppContext } from "@/context/AppContext";
import { useToast } from "@/hooks/use-toast";

const AddSupplementForm: React.FC<{ supplementId?: string; onClose: () => void }> = ({ supplementId, onClose }) => {
  const { supplements, addSupplement, updateSupplement } = useAppContext();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // If editing an existing supplement, load its data
  useEffect(() => {
    if (supplementId) {
      const supplement = supplements.find((s) => s.id === supplementId);
      if (supplement) {
        setName(supplement.name);
        setDosage(supplement.dosage);
        setFrequency(supplement.frequency);
      }
    }
  }, [supplementId, supplements]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      const supplementData = {
        name,
        dosage,
        frequency,
        date: new Date().toISOString(), // Add the required date field
      };

      if (supplementId) {
        await updateSupplement(supplementId, { ...supplementData, id: supplementId });
        toast({
          title: "Success",
          description: "Supplement updated successfully.",
        });
      } else {
        await addSupplement(supplementData);
        toast({
          title: "Success",
          description: "Supplement added successfully.",
        });
      }
      onClose();
    } catch (error) {
      console.error("AddSupplementForm.tsx: Error saving supplement:", error);
      toast({
        title: "Error",
        description: "Failed to save supplement.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{supplementId ? "Edit Supplement" : "Add Supplement"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Supplement Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter supplement name"
              disabled={isLoading}
            />
          </div>
          <div>
            <Label htmlFor="dosage">Dosage</Label>
            <Input
              id="dosage"
              type="text"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              placeholder="Enter dosage (e.g., 2 capsules daily)"
              disabled={isLoading}
            />
          </div>
          <div>
            <Label htmlFor="frequency">Frequency</Label>
            <Input
              id="frequency"
              type="text"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              placeholder="Enter frequency (e.g., daily)"
              disabled={isLoading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Saving..." : supplementId ? "Update Supplement" : "Add Supplement"}
          </Button>
          <Button type="button" variant="outline" className="w-full" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddSupplementForm;
