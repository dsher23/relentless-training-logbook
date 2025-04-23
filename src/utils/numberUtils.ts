
/**
 * Safely converts a value to a number, with fallback to 0 if invalid
 */
export function getNumber(value: string | number | undefined | null): number {
  if (value === undefined || value === null) return 0;
  const num = Number(value);
  return isNaN(num) ? 0 : num;
}

/**
 * Calculates one rep max using Brzycki formula
 */
export function calculateOneRepMax(weight: number, reps: number): number {
  const numWeight = getNumber(weight);
  const numReps = getNumber(reps);
  
  if (numReps === 1) return numWeight;
  return numWeight * (1 + numReps / 30);
}
