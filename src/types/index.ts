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

export interface MoodLog {
  id: string;
  date: string;
  time: string;
  mood: number;
  energy?: string;
  sleep?: number;
  notes?: string;
}

export interface Reminder {
  id: string;
  type: string;
  dueDate: string;
  time: string;
  days: string[];
  seen: boolean;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description?: string;
  active: boolean;
  templates: string[]; // IDs of workout templates
  createdAt: string;
  updatedAt: string;
}
