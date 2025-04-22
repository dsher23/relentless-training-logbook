
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { SteroidCycle } from '@/types';

export const useCycles = () => {
  const [steroidCycles, setSteroidCycles] = useState<SteroidCycle[]>([]);

  const addSteroidCycle = (cycle: SteroidCycle) => {
    setSteroidCycles([...steroidCycles, cycle]);
  };

  const updateSteroidCycle = (cycle: SteroidCycle) => {
    setSteroidCycles(steroidCycles.map(c => c.id === cycle.id ? cycle : c));
  };

  const deleteSteroidCycle = (id: string) => {
    setSteroidCycles(steroidCycles.filter(c => c.id !== id));
  };

  const duplicateSteroidCycle = (id: string) => {
    const cycleToDuplicate = steroidCycles.find(c => c.id === id);
    if (cycleToDuplicate) {
      const newCycle = {
        ...cycleToDuplicate,
        id: uuidv4(),
        name: `${cycleToDuplicate.name} (Copy)`,
      };
      setSteroidCycles([...steroidCycles, newCycle]);
    }
  };

  return {
    steroidCycles,
    addSteroidCycle,
    updateSteroidCycle,
    deleteSteroidCycle,
    duplicateSteroidCycle,
  };
};
