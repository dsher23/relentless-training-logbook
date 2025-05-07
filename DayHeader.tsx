
import React from "react";
import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Header for the Workout Days page, with navigation and add button.
 * @param {string} title - The header title.
 * @param {() => void} onBack - Navigate back handler.
 * @param {() => void} onAdd - Open the add dialog handler.
 */
interface DayHeaderProps {
  title: string;
  onBack: () => void;
  onAdd: () => void;
}

const DayHeader: React.FC<DayHeaderProps> = ({ title, onBack, onAdd }) => (
  <div className="p-4 space-y-4">
    <div className="flex gap-2">
      <Button variant="outline" onClick={onBack}>
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Plan
      </Button>
    </div>
    <div className="flex justify-between items-center">
      <h2 className="text-lg font-semibold">{title}</h2>
      <Button size="sm" onClick={onAdd}>
        <Plus className="h-4 w-4 mr-1" /> Add Workout Day
      </Button>
    </div>
  </div>
);

export default DayHeader;
