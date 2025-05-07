
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format a date string or Date object to a readable string
export function formatDate(date: string | Date): string {
  if (!date) return '';
  
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString();
}

// Format a date with time
export function formatDateTime(date: string | Date): string {
  if (!date) return '';
  
  const d = typeof date === 'string' ? new Date(date) : date;
  return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
}

// Convert weight between units (kg/lbs)
export function convertWeight(weight: number, fromUnit: 'kg' | 'lbs', toUnit: 'kg' | 'lbs'): number {
  if (fromUnit === toUnit) return weight;
  
  if (fromUnit === 'kg' && toUnit === 'lbs') {
    return weight * 2.20462;
  } else {
    return weight / 2.20462;
  }
}

// Convert between weight units including stone
export function convertWeightExtended(
  weight: number, 
  fromUnit: 'kg' | 'lbs' | 'stone', 
  toUnit: 'kg' | 'lbs' | 'stone'
): number {
  if (fromUnit === toUnit) return weight;
  
  // First convert to kg as base unit
  let weightInKg: number;
  
  switch (fromUnit) {
    case 'kg':
      weightInKg = weight;
      break;
    case 'lbs':
      weightInKg = weight / 2.20462;
      break;
    case 'stone':
      weightInKg = weight * 6.35029;
      break;
  }
  
  // Then convert from kg to target unit
  switch (toUnit) {
    case 'kg':
      return weightInKg;
    case 'lbs':
      return weightInKg * 2.20462;
    case 'stone':
      return weightInKg / 6.35029;
  }
}

// Convert measurements between cm and inches
export function convertMeasurement(
  measurement: number,
  fromUnit: 'cm' | 'in',
  toUnit: 'cm' | 'in'
): number {
  if (fromUnit === toUnit) return measurement;
  
  if (fromUnit === 'cm' && toUnit === 'in') {
    return measurement / 2.54;
  } else {
    return measurement * 2.54;
  }
}

// Format a weight value with the appropriate unit
export function formatWeight(weight: number, unit: 'kg' | 'lbs' | 'stone'): string {
  if (unit === 'stone') {
    const stones = Math.floor(weight);
    const pounds = Math.round((weight - stones) * 14);
    return `${stones} st ${pounds} lb`;
  }
  return `${weight.toFixed(1)} ${unit}`;
}
