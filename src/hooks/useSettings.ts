
import { useState } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import localforage from 'localforage';

export type UnitSettings = {
  bodyWeightUnit: 'kg' | 'lbs' | 'stone';
  bodyMeasurementUnit: 'cm' | 'in';
  liftingWeightUnit: 'kg' | 'lbs';
};

export const useSettings = () => {
  const [settings, setSettings] = useState<UnitSettings>({
    bodyWeightUnit: 'kg',
    bodyMeasurementUnit: 'cm',
    liftingWeightUnit: 'kg',
  });
  
  // Load settings from Firestore or local storage
  const loadSettings = async () => {
    try {
      if (auth.currentUser) {
        // Load from Firestore if user is logged in
        const userRef = doc(db, `users/${auth.currentUser.uid}/settings/units`);
        const snapshot = await getDoc(userRef);
        if (snapshot.exists()) {
          const data = snapshot.data() as UnitSettings;
          setSettings(data);
          return data;
        }
      } else {
        // Load from local storage if not logged in
        const localSettings = await localforage.getItem<UnitSettings>('unitSettings');
        if (localSettings) {
          setSettings(localSettings);
          return localSettings;
        }
      }
      
      // Return default settings if nothing is found
      return settings;
    } catch (error) {
      console.error("Error loading settings:", error);
      return settings;
    }
  };
  
  // Save settings to Firestore and local storage
  const saveSettings = async (newSettings: UnitSettings) => {
    try {
      setSettings(newSettings);
      
      // Save locally regardless
      await localforage.setItem('unitSettings', newSettings);
      
      // If logged in, also save to Firestore
      if (auth.currentUser) {
        const userRef = doc(db, `users/${auth.currentUser.uid}/settings/units`);
        await setDoc(userRef, newSettings, { merge: true });
      }
      
      return true;
    } catch (error) {
      console.error("Error saving settings:", error);
      return false;
    }
  };
  
  // Update a single setting
  const updateSetting = async <K extends keyof UnitSettings>(
    key: K, 
    value: UnitSettings[K]
  ): Promise<boolean> => {
    try {
      const newSettings = {
        ...settings,
        [key]: value
      };
      
      await saveSettings(newSettings);
      return true;
    } catch (error) {
      console.error(`Error updating ${key} setting:`, error);
      return false;
    }
  };
  
  return {
    settings,
    loadSettings,
    saveSettings,
    updateSetting,
  };
};

export default useSettings;
