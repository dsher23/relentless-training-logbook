
import { useState } from 'react';
import { MoodLog } from '@/types';

export const useMoodLogs = () => {
  const [moodLogs, setMoodLogs] = useState<MoodLog[]>([]);

  const addMoodLog = (log: MoodLog) => {
    setMoodLogs([...moodLogs, log]);
  };

  const updateMoodLog = (log: MoodLog) => {
    setMoodLogs(moodLogs.map(m => m.id === log.id ? log : m));
  };

  const deleteMoodLog = (id: string) => {
    setMoodLogs(moodLogs.filter(m => m.id !== id));
  };

  return {
    moodLogs,
    setMoodLogs,
    addMoodLog,
    updateMoodLog,
    deleteMoodLog,
  };
};
