
import { useState } from 'react';
import { BodyMeasurement, ProgressPhoto } from '@/types';

export const useBodyMeasurements = () => {
  const [bodyMeasurements, setBodyMeasurements] = useState<BodyMeasurement[]>([]);
  const [progressPhotos, setProgressPhotos] = useState<ProgressPhoto[]>([]);

  const addBodyMeasurement = (measurement: BodyMeasurement) => {
    setBodyMeasurements([...bodyMeasurements, measurement]);
  };

  const updateBodyMeasurement = (measurement: BodyMeasurement) => {
    setBodyMeasurements(bodyMeasurements.map(m => m.id === measurement.id ? measurement : m));
  };

  const deleteBodyMeasurement = (id: string) => {
    setBodyMeasurements(bodyMeasurements.filter(m => m.id !== id));
  };
  
  const addProgressPhoto = (photo: ProgressPhoto) => {
    setProgressPhotos([...progressPhotos, photo]);
  };
  
  const updateProgressPhoto = (photo: ProgressPhoto) => {
    setProgressPhotos(progressPhotos.map(p => p.id === photo.id ? photo : p));
  };
  
  const deleteProgressPhoto = (id: string) => {
    setProgressPhotos(progressPhotos.filter(p => p.id !== id));
  };

  return {
    bodyMeasurements,
    setBodyMeasurements,
    addBodyMeasurement,
    updateBodyMeasurement,
    deleteBodyMeasurement,
    progressPhotos,
    setProgressPhotos,
    addProgressPhoto,
    updateProgressPhoto,
    deleteProgressPhoto
  };
};
