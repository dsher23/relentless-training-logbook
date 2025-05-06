
export type WeightUnit = 'kg' | 'lbs' | 'stone';
export type MeasurementUnit = 'cm' | 'in';

export interface UnitSystem {
  bodyWeightUnit: WeightUnit;
  bodyMeasurementUnit: MeasurementUnit;
  liftingWeightUnit: WeightUnit; // Restored
}

export interface PR {
  id: string;
  exercise: string; // Changed from exerciseId to match PRLift
  weight: number;
  reps: number;
  date: Date | string;
  workoutId?: string;
  isDirectEntry?: boolean;
}

export interface PRLift {
  id: string;
  exercise: string;
  weight: number;
  date: string;
  reps: number;
  workoutId?: string;
  isDirectEntry?: boolean;
}
