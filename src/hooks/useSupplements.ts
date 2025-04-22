
import { useState } from 'react';
import { Supplement, SupplementLog } from '@/types';

export const useSupplements = () => {
  const [supplements, setSupplements] = useState<Supplement[]>([]);
  const [supplementLogs, setSupplementLogs] = useState<SupplementLog[]>([]);

  const addSupplement = (supplement: Supplement) => {
    setSupplements([...supplements, supplement]);
  };

  const updateSupplement = (supplement: Supplement) => {
    setSupplements(supplements.map(s => s.id === supplement.id ? supplement : s));
  };

  const deleteSupplement = (id: string) => {
    setSupplements(supplements.filter(s => s.id !== id));
  };

  const addSupplementLog = (log: SupplementLog) => {
    setSupplementLogs([...supplementLogs, log]);
  };

  const updateSupplementLog = (log: SupplementLog) => {
    setSupplementLogs(supplementLogs.map(s => s.id === log.id ? log : s));
  };

  const deleteSupplementLog = (id: string) => {
    setSupplementLogs(supplementLogs.filter(s => s.id !== id));
  };

  return {
    supplements,
    setSupplements,
    supplementLogs,
    setSupplementLogs,
    addSupplement,
    updateSupplement,
    deleteSupplement,
    addSupplementLog,
    updateSupplementLog,
    deleteSupplementLog,
  };
};
