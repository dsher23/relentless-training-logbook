
import { useState } from 'react';
import { BodyMeasurement } from '@/types';

export const useBodyMeasurements = () => {
  const [bodyMeasurements, setBodyMeasurements] = useState<BodyMeasurement[]>([]);

  const addBodyMeasurement = (measurement: BodyMeasurement) => {
    setBodyMeasurements([...bodyMeasurements, measurement]);
  };

  const updateBodyMeasurement = (measurement: BodyMeasurement) => {
    setBodyMeasurements(bodyMeasurements.map(m => m.id === measurement.id ? measurement : m));
  };

  const deleteBodyMeasurement = (id: string) => {
    setBodyMeasurements(bodyMeasurements.filter(m => m.id !== id));
  };

  return {
    bodyMeasurements,
    setBodyMeasurements,
    addBodyMeasurement,
    updateBodyMeasurement,
    deleteBodyMeasurement,
  };
};
