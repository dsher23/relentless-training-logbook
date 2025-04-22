
import { useState } from 'react';
import { WeakPoint } from '@/types';

export const useWeakPoints = () => {
  const [weakPoints, setWeakPoints] = useState<WeakPoint[]>([]);

  const addWeakPoint = (weakPoint: WeakPoint) => {
    setWeakPoints([...weakPoints, weakPoint]);
  };

  const updateWeakPoint = (weakPoint: WeakPoint) => {
    setWeakPoints(weakPoints.map(w => w.id === weakPoint.id ? weakPoint : w));
  };

  const deleteWeakPoint = (id: string) => {
    setWeakPoints(weakPoints.filter(w => w.id !== id));
  };

  return {
    weakPoints,
    setWeakPoints,
    addWeakPoint,
    updateWeakPoint,
    deleteWeakPoint,
  };
};
