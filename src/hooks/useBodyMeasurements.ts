
import { useState, useEffect, useCallback } from "react";
import { v4 as uuid } from "uuid";
import { BodyMeasurement, ProgressPhoto } from "@/types";

const MEASUREMENTS_STORAGE_KEY = "bodyMeasurements";
const PHOTOS_STORAGE_KEY = "progressPhotos";

export function useBodyMeasurements() {
  const [bodyMeasurements, setBodyMeasurements] = useState<BodyMeasurement[]>([]);
  const [progressPhotos, setProgressPhotos] = useState<ProgressPhoto[]>([]);

  // Load data on mount
  useEffect(() => {
    try {
      const rawMeasurements = localStorage.getItem(MEASUREMENTS_STORAGE_KEY);
      if (rawMeasurements) {
        setBodyMeasurements(JSON.parse(rawMeasurements));
      }
      
      const rawPhotos = localStorage.getItem(PHOTOS_STORAGE_KEY);
      if (rawPhotos) {
        setProgressPhotos(JSON.parse(rawPhotos));
      }
    } catch (err) {
      console.error("Failed to load body measurements data", err);
    }
  }, []);

  // Save measurements when updated
  useEffect(() => {
    if (bodyMeasurements.length > 0) {
      localStorage.setItem(MEASUREMENTS_STORAGE_KEY, JSON.stringify(bodyMeasurements));
    }
  }, [bodyMeasurements]);
  
  // Save photos when updated
  useEffect(() => {
    if (progressPhotos.length > 0) {
      localStorage.setItem(PHOTOS_STORAGE_KEY, JSON.stringify(progressPhotos));
    }
  }, [progressPhotos]);

  // Add a new measurement
  const addBodyMeasurement = useCallback((measurement: Omit<BodyMeasurement, "id">) => {
    const newMeasurement = {
      ...measurement,
      id: uuid()
    } as BodyMeasurement;
    setBodyMeasurements(prev => [...prev, newMeasurement]);
    return newMeasurement;
  }, []);

  // Update existing measurement
  const updateBodyMeasurement = useCallback((measurement: BodyMeasurement) => {
    setBodyMeasurements(prev => 
      prev.map(m => m.id === measurement.id ? measurement : m)
    );
  }, []);

  // Delete measurement
  const deleteBodyMeasurement = useCallback((id: string) => {
    setBodyMeasurements(prev => prev.filter(m => m.id !== id));
  }, []);
  
  // Get measurement by ID
  const getBodyMeasurementById = useCallback((id: string) => {
    return bodyMeasurements.find(m => m.id === id) || null;
  }, [bodyMeasurements]);

  // Add a new progress photo
  const addProgressPhoto = useCallback((photo: Omit<ProgressPhoto, "id">) => {
    const newPhoto = {
      ...photo,
      id: uuid()
    } as ProgressPhoto;
    setProgressPhotos(prev => [...prev, newPhoto]);
    return newPhoto;
  }, []);

  // Update existing photo
  const updateProgressPhoto = useCallback((photo: ProgressPhoto) => {
    setProgressPhotos(prev => 
      prev.map(p => p.id === photo.id ? photo : p)
    );
  }, []);

  // Delete photo
  const deleteProgressPhoto = useCallback((id: string) => {
    setProgressPhotos(prev => prev.filter(p => p.id !== id));
  }, []);

  return {
    bodyMeasurements,
    setBodyMeasurements,
    addBodyMeasurement,
    updateBodyMeasurement,
    deleteBodyMeasurement,
    getBodyMeasurementById,
    progressPhotos,
    setProgressPhotos,
    addProgressPhoto,
    updateProgressPhoto,
    deleteProgressPhoto
  };
}
