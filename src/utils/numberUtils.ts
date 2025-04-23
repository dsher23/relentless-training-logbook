
/**
 * Safely converts a value to a number, with fallback to 0 if invalid
 */
export function getNumber(value: string | number | undefined | null | any): number {
  if (value === undefined || value === null) return 0;
  if (typeof value === "number") return value;
  if (typeof value === "string") return isNaN(parseFloat(value)) ? 0 : parseFloat(value);
  if (typeof value === "object") {
    // Handle potential object types like ExerciseSetData
    const w = value.weight;
    const r = value.reps;
    if (w !== undefined || r !== undefined) {
      return 0; // Return 0 instead of calculating w+r as that's not meaningful
    }
  }
  return 0;
}

/**
 * Calculates one rep max using Brzycki formula
 */
export function calculateOneRepMax(weight: number | string | undefined | null, reps: number | string | undefined | null): number {
  const numWeight = getNumber(weight);
  const numReps = getNumber(reps);
  
  if (numReps === 1) return numWeight;
  return numWeight * (1 + numReps / 30);
}
