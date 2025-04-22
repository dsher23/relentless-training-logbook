
import React from "react";
import { Shield, Info } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAppContext } from "@/context/AppContext";

interface DeloadModeProps {
  workoutId: string;
  isDeload: boolean;
}

const DeloadModeToggle: React.FC<DeloadModeProps> = ({ workoutId, isDeload }) => {
  const { toggleDeloadMode } = useAppContext();
  
  const handleToggle = (checked: boolean) => {
    toggleDeloadMode(workoutId, checked);
  };
  
  return (
    <div className="flex items-center space-x-2 mb-4 p-3 border rounded-md bg-secondary">
      <Shield className={`h-5 w-5 ${isDeload ? 'text-iron-blue' : 'text-muted-foreground'}`} />
      <div className="flex-1">
        <div className="flex items-center">
          <Label htmlFor="deload-mode" className="font-medium">Deload Mode</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground ml-1" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="w-[200px] text-xs">
                  Deload mode reduces your working weights to help recovery. 
                  Previous weights will be shown but reduced by your preferred percentage.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <p className="text-xs text-muted-foreground">
          Reduce working weights for recovery
        </p>
      </div>
      <Switch 
        id="deload-mode" 
        checked={isDeload}
        onCheckedChange={handleToggle}
      />
    </div>
  );
};

export default DeloadModeToggle;
