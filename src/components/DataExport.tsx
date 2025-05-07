import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/AppContext";
import { useToast } from "@/hooks/use-toast";

const DataExport: React.FC = () => {
  const { exportData } = useAppContext();
  const { toast } = useToast();

  const handleExport = async () => {
    try {
      await exportData(); // No arguments expected
      console.log("DataExport.tsx: Data exported successfully");
      toast({
        title: "Success",
        description: "Data exported successfully. Check your downloads.",
      });
    } catch (error) {
      console.error("DataExport.tsx: Error exporting data:", error);
      toast({
        title: "Error",
        description: "Failed to export data.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Export Data</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={handleExport} className="w-full">
          Export All Data
        </Button>
      </CardContent>
    </Card>
  );
};

export default DataExport;
