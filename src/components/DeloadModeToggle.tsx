import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/AppContext";
import { useToast } from "@/hooks/use-toast";

const DeloadModeToggle: React.FC = () => {
  const { toggleDeloadMode } = useAppContext();
  const { toast } = useToast();

  const handleToggle = async () => {
    try {
      await toggleDeloadMode(); // No arguments expected
      console.log("DeloadModeToggle.tsx: Deload mode toggled successfully");
      toast({
        title: "Success",
        description: "Deload mode toggled successfully.",
      });
    } catch (error) {
      console.error("DeloadModeToggle.tsx: Error toggling deload mode:", error);
      toast({
        title: "Error",
        description: "Failed to toggle deload mode.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Deload Mode</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={handleToggle} className="w-full">
          Toggle Deload Mode
        </Button>
      </CardContent>
    </Card>
  );
};

export default DeloadModeToggle;
