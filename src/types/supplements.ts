
// Supplement types
export interface Supplement {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  days?: string[];
  time?: string;
  notes?: string;
}

export interface SupplementLog {
  id: string;
  supplementId: string;
  date: string;
  taken: boolean;
  notes?: string;
}

export interface SteroidCycle {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  compounds: SteroidCompound[];
  notes?: string;
  isPrivate: boolean;
}

export interface SteroidCompound {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  notes?: string;
}

// Form interfaces
export interface SupplementFormProps {
  supplementId?: string;
  onClose: () => void;
}

export interface CycleFormProps {
  cycleId?: string;
  onClose: () => void;
}
