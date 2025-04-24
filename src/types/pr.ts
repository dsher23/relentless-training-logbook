
export interface PR {
  exerciseId: string;
  weight: number;
  date: string;
  reps: number;
  workoutId?: string;
  isDirectEntry?: boolean;
}

export type WeightUnit = 'kg' | 'lbs' | 'stone';
export type MeasurementUnit = 'cm' | 'in';

export interface UnitSystem {
  bodyWeightUnit: WeightUnit;
  bodyMeasurementUnit: MeasurementUnit;
  liftingWeightUnit: WeightUnit;
}
