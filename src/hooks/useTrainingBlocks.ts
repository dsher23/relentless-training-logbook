
import { useState } from 'react';
import { TrainingBlock } from '@/types';

export const useTrainingBlocks = () => {
  const [trainingBlocks, setTrainingBlocks] = useState<TrainingBlock[]>([]);

  const addTrainingBlock = (block: TrainingBlock) => {
    setTrainingBlocks([...trainingBlocks, block]);
  };

  const updateTrainingBlock = (block: TrainingBlock) => {
    setTrainingBlocks(trainingBlocks.map(b => b.id === block.id ? block : b));
  };

  const deleteTrainingBlock = (id: string) => {
    setTrainingBlocks(trainingBlocks.filter(b => b.id !== id));
  };

  return {
    trainingBlocks,
    setTrainingBlocks,
    addTrainingBlock,
    updateTrainingBlock,
    deleteTrainingBlock,
  };
};
