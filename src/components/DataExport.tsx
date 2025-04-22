
import React, { useState } from "react";
import { Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/AppContext";

const DataExport: React.FC = () => {
  const { exportData } = useAppContext();
  const [exportType, setExportType] = useState<"workouts" | "measurements" | "supplements">("workouts");
  const [open, setOpen] = useState(false);
  
  const handleExport = () => {
    const csvData = exportData(exportType);
    
    // Create a blob and generate download link
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = `ironlog_${exportType}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Close dialog
    setOpen(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Data
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Data</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select data to export</label>
            <Select value={exportType} onValueChange={(value: any) => setExportType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select data type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="workouts">Workout Logs</SelectItem>
                <SelectItem value="measurements">Body Measurements</SelectItem>
                <SelectItem value="supplements">Supplement Records</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="bg-secondary/50 rounded-md p-3">
            <h3 className="text-sm font-medium mb-1">Export details:</h3>
            <p className="text-sm text-muted-foreground">
              {exportType === "workouts" && "Includes workout dates, exercises, sets, reps, weights, and completion status."}
              {exportType === "measurements" && "Includes dates, weight, body measurements, and body composition data."}
              {exportType === "supplements" && "Includes supplement tracking data, dosages, and adherence records."}
            </p>
          </div>
          
          <div className="flex justify-end">
            <Button onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DataExport;
