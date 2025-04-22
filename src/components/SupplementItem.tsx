
import React from "react";
import { format } from "date-fns";
import { PillIcon, Check, X } from "lucide-react";
import { Supplement, SupplementLog, useAppContext } from "@/context/AppContext";

interface SupplementItemProps {
  supplement: Supplement;
  log?: SupplementLog;
  date?: Date;
}

const SupplementItem: React.FC<SupplementItemProps> = ({ supplement, log, date = new Date() }) => {
  const { addSupplementLog, updateSupplementLog } = useAppContext();

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
            {supplement.reminder && 
              ` · ${format(new Date(supplement.reminder), "h:mm a")}`
            }
          </p>
        </div>
      </div>
      <button
        onClick={handleToggle}
        className={`w-8 h-8 rounded-full flex items-center justify-center ${
          log?.taken ? "bg-gym-success text-white" : "bg-secondary text-muted-foreground"
        }`}
      >
        {log?.taken ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
      </button>
    </div>
  );
};

export default SupplementItem;
