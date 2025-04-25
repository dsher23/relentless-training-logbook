export interface Supplement {
  id: string;
  name: string;
  days: string[]; // e.g., ["Monday", "Tuesday"]
  reminderTime?: string; // e.g., "08:00"
  history: { date: Date; taken: boolean }[]; // Log of taken/not taken
}

export interface Cycle {
  id: string;
  name: string; // e.g., "Testosterone Cycle"
  supplements: Supplement[];
  startDate: Date;
  endDate: Date;
  history: { date: Date; taken: boolean }[];
}

export interface AppContextType {
  workouts: Workout[];
  setWorkouts: React.Dispatch<React.SetStateAction<Workout[]>>;
  measurements: Measurement[];
  setMeasurements: React.Dispatch<React.SetStateAction<Measurement[]>>;
  supplements: Supplement[]; // Add
  setSupplements: React.Dispatch<React.SetStateAction<Supplement[]>>; // Add
  cycles: Cycle[]; // Add
  setCycles: React.Dispatch<React.SetStateAction<Cycle[]>>; // Add
  addSupplement: (supplement: Supplement) => void; // Add
  updateSupplement: (updated: Supplement) => void; // Add
  deleteSupplement: (id: string) => void; // Add
  addCycle: (cycle: Cycle) => void; // Add
  updateCycle: (updated: Cycle) => void; // Add
  deleteCycle: (id: string) => void; // Add
  markSupplementTaken: (supplementId: string, date: Date, taken: boolean) => void; // Add
  markCycleTaken: (cycleId: string, date: Date, taken: boolean) => void; // Add
  // ... other properties (e.g., getWorkoutById)
}
