
import { useState } from 'react';
import { SteroidCompound } from '@/types';

export const useCompounds = () => {
  const [compounds, setCompounds] = useState<SteroidCompound[]>([]);

  const addCompound = (compound: SteroidCompound) => {
    setCompounds([...compounds, compound]);
  };

  const updateCompound = (compound: SteroidCompound) => {
    setCompounds(compounds.map(c => c.id === compound.id ? compound : c));
  };

  const deleteCompound = (id: string) => {
    setCompounds(compounds.filter(c => c.id !== id));
  };

  const getCompoundsByCycleId = (cycleId: string) => {
    return compounds.filter(c => c.cycleId === cycleId);
  };

  return {
    compounds,
    setCompounds,
    addCompound,
    updateCompound,
    deleteCompound,
    getCompoundsByCycleId
  };
};
