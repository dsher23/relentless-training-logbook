import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import { v4 as uuidv4 } from "uuid";
import {
  Workout,
  WorkoutTemplate,
  BodyMeasurement,
  ProgressPhoto,
  MoodLog,
  TrainingBlock,
  WeeklyRoutine,
  PRLift,
  Supplement,
  SteroidCycle,
  SteroidCompound,
  UserProfile,
} from "@/types";

interface AppContextType {
  userProfile: UserProfile | null;
  setUserProfile: Dispatch<SetStateAction<UserProfile | null>>;
  workouts: Workout[];
  setWorkouts: Dispatch<SetStateAction<Workout[]>>;
  addWorkout: (workout: Omit<Workout, "id">) => Promise<void>;
  updateWorkout: (id: string, updates: Partial<Workout>) => Promise<void>;
  deleteWorkout: (id: string) => Promise<void>;
  workoutTemplates: WorkoutTemplate[];
  setWorkoutTemplates: Dispatch<SetStateAction<WorkoutTemplate[]>>;
  addWorkoutTemplate: (
    workoutTemplate: Omit<WorkoutTemplate, "id">
  ) => Promise<void>;
  updateWorkoutTemplate: (
    id: string,
    updates: Partial<WorkoutTemplate>
  ) => Promise<void>;
  deleteWorkoutTemplate: (id: string) => Promise<void>;
  bodyMeasurements: BodyMeasurement[];
  setBodyMeasurements: Dispatch<SetStateAction<BodyMeasurement[]>>;
  addBodyMeasurement: (
    measurement: Omit<BodyMeasurement, "id">
  ) => Promise<void>;
  updateBodyMeasurement: (
    id: string,
    updates: Partial<BodyMeasurement>
  ) => Promise<void>;
  deleteBodyMeasurement: (id: string) => Promise<void>;
  progressPhotos: ProgressPhoto[];
  setProgressPhotos: Dispatch<SetStateAction<ProgressPhoto[]>>;
  addProgressPhoto: (photo: Omit<ProgressPhoto, "id">) => Promise<void>;
  updateProgressPhoto: (
    id: string,
    updates: Partial<ProgressPhoto>
  ) => Promise<void>;
  deleteProgressPhoto: (id: string) => Promise<void>;
  moodLogs: MoodLog[];
  setMoodLogs: Dispatch<SetStateAction<MoodLog[]>>;
  addMoodLog: (moodLog: Omit<MoodLog, "id">) => Promise<void>;
  updateMoodLog: (id: string, updates: Partial<MoodLog>) => Promise<void>;
  deleteMoodLog: (id: string) => Promise<void>;
  trainingBlocks: TrainingBlock[];
  setTrainingBlocks: Dispatch<SetStateAction<TrainingBlock[]>>;
  addTrainingBlock: (
    trainingBlock: Omit<TrainingBlock, "id">
  ) => Promise<void>;
  updateTrainingBlock: (
    id: string,
    updates: Partial<TrainingBlock>
  ) => Promise<void>;
  deleteTrainingBlock: (id: string) => Promise<void>;
  weeklyRoutines: WeeklyRoutine[];
  setWeeklyRoutines: Dispatch<SetStateAction<WeeklyRoutine[]>>;
  addWeeklyRoutine: (
    weeklyRoutine: Omit<WeeklyRoutine, "id">
  ) => Promise<void>;
  updateWeeklyRoutine: (
    id: string,
    updates: Partial<WeeklyRoutine>
  ) => Promise<void>;
  deleteWeeklyRoutine: (id: string) => Promise<void>;
  prLifts: PRLift[];
  setPRLifts: Dispatch<SetStateAction<PRLift[]>>;
  addPRLift: (prLift: Omit<PRLift, "id">) => Promise<void>;
  updatePRLift: (id: string, updates: Partial<PRLift>) => Promise<void>;
  deletePRLift: (id: string) => Promise<void>;
  supplements: Supplement[];
  setSupplements: Dispatch<SetStateAction<Supplement[]>>;
  addSupplement: (supplement: Omit<Supplement, "id">) => Promise<void>;
  updateSupplement: (
    id: string,
    updates: Partial<Supplement>
  ) => Promise<void>;
  deleteSupplement: (id: string) => Promise<void>;
  steroidCycles: SteroidCycle[];
  setSteroidCycles: Dispatch<SetStateAction<SteroidCycle[]>>;
  addSteroidCycle: (steroidCycle: Omit<SteroidCycle, "id">) => Promise<void>;
  updateSteroidCycle: (
    id: string,
    updates: Partial<SteroidCycle>
  ) => Promise<void>;
  deleteSteroidCycle: (id: string) => Promise<void>;
  steroidCompounds: SteroidCompound[];
  setSteroidCompounds: Dispatch<SetStateAction<SteroidCompound[]>>;
  addSteroidCompound: (
    steroidCompound: Omit<SteroidCompound, "id">
  ) => Promise<void>;
  updateSteroidCompound: (
    id: string,
    updates: Partial<SteroidCompound>
  ) => Promise<void>;
  deleteSteroidCompound: (id: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [workoutTemplates, setWorkoutTemplates] = useState<WorkoutTemplate[]>(
    []
  );
  const [bodyMeasurements, setBodyMeasurements] = useState<BodyMeasurement[]>(
    []
  );
  const [progressPhotos, setProgressPhotos] = useState<ProgressPhoto[]>([]);
  const [moodLogs, setMoodLogs] = useState<MoodLog[]>([]);
  const [trainingBlocks, setTrainingBlocks] = useState<TrainingBlock[]>([]);
  const [weeklyRoutines, setWeeklyRoutines] = useState<WeeklyRoutine[]>([]);
  const [prLifts, setPRLifts] = useState<PRLift[]>([]);
  const [supplements, setSupplements] = useState<Supplement[]>([]);
  const [steroidCycles, setSteroidCycles] = useState<SteroidCycle[]>([]);
  const [steroidCompounds, setSteroidCompounds] = useState<SteroidCompound[]>(
    []
  );

  // User Profile
  const handleSetUserProfile = async (
    updates: Partial<UserProfile>
  ): Promise<void> => {
    setUserProfile((prevProfile) => ({
      ...prevProfile,
      ...updates,
    }));
  };

  // Workouts
  const handleAddWorkout = async (
    workout: Omit<Workout, "id">
  ): Promise<void> => {
    setWorkouts((prevWorkouts) => [...prevWorkouts, { ...workout, id: uuidv4() }]);
  };

  const handleUpdateWorkout = async (
    id: string,
    updates: Partial<Workout>
  ): Promise<void> => {
    setWorkouts((prevWorkouts) =>
      prevWorkouts.map((workout) => (workout.id === id ? { ...workout, ...updates } : workout))
    );
  };

  const handleDeleteWorkout = async (id: string): Promise<void> => {
    setWorkouts((prevWorkouts) => prevWorkouts.filter((workout) => workout.id !== id));
  };

  // Workout Templates
  const handleAddWorkoutTemplate = async (
    workoutTemplate: Omit<WorkoutTemplate, "id">
  ): Promise<void> => {
    setWorkoutTemplates((prevTemplates) => [
      ...prevTemplates,
      { ...workoutTemplate, id: uuidv4() },
    ]);
  };

  const handleUpdateWorkoutTemplate = async (
    id: string,
    updates: Partial<WorkoutTemplate>
  ): Promise<void> => {
    setWorkoutTemplates((prevTemplates) =>
      prevTemplates.map((template) =>
        template.id === id ? { ...template, ...updates } : template
      )
    );
  };

  const handleDeleteWorkoutTemplate = async (id: string): Promise<void> => {
    setWorkoutTemplates((prevTemplates) =>
      prevTemplates.filter((template) => template.id !== id)
    );
  };

  // Body Measurements
  const handleAddBodyMeasurement = async (
    measurement: Omit<BodyMeasurement, "id">
  ): Promise<void> => {
    setBodyMeasurements((prevMeasurements) => [
      ...prevMeasurements,
      { ...measurement, id: uuidv4() },
    ]);
  };

  const handleUpdateBodyMeasurement = async (
    id: string,
    updates: Partial<BodyMeasurement>
  ): Promise<void> => {
    setBodyMeasurements((prevMeasurements) =>
      prevMeasurements.map((measurement) =>
        measurement.id === id ? { ...measurement, ...updates } : measurement
      )
    );
  };

  const handleDeleteBodyMeasurement = async (id: string): Promise<void> => {
    setBodyMeasurements((prevMeasurements) =>
      prevMeasurements.filter((measurement) => measurement.id !== id)
    );
  };

  // Progress Photos
  const handleAddProgressPhoto = async (
    photo: Omit<ProgressPhoto, "id">
  ): Promise<void> => {
    setProgressPhotos((prevPhotos) => [...prevPhotos, { ...photo, id: uuidv4() }]);
  };

  const handleUpdateProgressPhoto = async (
    id: string,
    updates: Partial<ProgressPhoto>
  ): Promise<void> => {
    setProgressPhotos((prevPhotos) =>
      prevPhotos.map((photo) => (photo.id === id ? { ...photo, ...updates } : photo))
    );
  };

  const handleDeleteProgressPhoto = async (id: string): Promise<void> => {
    setProgressPhotos((prevPhotos) => prevPhotos.filter((photo) => photo.id !== id));
  };

  // Mood Logs
  const handleAddMoodLog = async (moodLog: Omit<MoodLog, "id">): Promise<void> => {
    setMoodLogs((prevMoodLogs) => [...prevMoodLogs, { ...moodLog, id: uuidv4() }]);
  };

  const handleUpdateMoodLog = async (
    id: string,
    updates: Partial<MoodLog>
  ): Promise<void> => {
    setMoodLogs((prevMoodLogs) =>
      prevMoodLogs.map((moodLog) => (moodLog.id === id ? { ...moodLog, ...updates } : moodLog))
    );
  };

  const handleDeleteMoodLog = async (id: string): Promise<void> => {
    setMoodLogs((prevMoodLogs) => prevMoodLogs.filter((moodLog) => moodLog.id !== id));
  };

  // Training Blocks
  const handleAddTrainingBlock = async (
    trainingBlock: Omit<TrainingBlock, "id">
  ): Promise<void> => {
    setTrainingBlocks((prevBlocks) => [
      ...prevBlocks,
      { ...trainingBlock, id: uuidv4() },
    ]);
  };

  const handleUpdateTrainingBlock = async (
    id: string,
    updates: Partial<TrainingBlock>
  ): Promise<void> => {
    setTrainingBlocks((prevBlocks) =>
      prevBlocks.map((block) => (block.id === id ? { ...block, ...updates } : block))
    );
  };

  const handleDeleteTrainingBlock = async (id: string): Promise<void> => {
    setTrainingBlocks((prevBlocks) => prevBlocks.filter((block) => block.id !== id));
  };

  // Weekly Routines
  const handleAddWeeklyRoutine = async (
    weeklyRoutine: Omit<WeeklyRoutine, "id">
  ): Promise<void> => {
    setWeeklyRoutines((prevRoutines) => [
      ...prevRoutines,
      { ...weeklyRoutine, id: uuidv4() },
    ]);
  };

  const handleUpdateWeeklyRoutine = async (
    id: string,
    updates: Partial<WeeklyRoutine>
  ): Promise<void> => {
    setWeeklyRoutines((prevRoutines) =>
      prevRoutines.map((routine) =>
        routine.id === id ? { ...routine, ...updates } : routine
      )
    );
  };

  const handleDeleteWeeklyRoutine = async (id: string): Promise<void> => {
    setWeeklyRoutines((prevRoutines) =>
      prevRoutines.filter((routine) => routine.id !== id)
    );
  };

  // PR Lifts
  const handleAddPRLift = async (prLift: Omit<PRLift, "id">): Promise<void> => {
    setPRLifts((prevPRLifts) => [...prevPRLifts, { ...prLift, id: uuidv4() }]);
  };

  const handleUpdatePRLift = async (
    id: string,
    updates: Partial<PRLift>
  ): Promise<void> => {
    setPRLifts((prevPRLifts) =>
      prevPRLifts.map((prLift) => (prLift.id === id ? { ...prLift, ...updates } : prLift))
    );
  };

  const handleDeletePRLift = async (id: string): Promise<void> => {
    setPRLifts((prevPRLifts) => prevPRLifts.filter((prLift) => prLift.id !== id));
  };

  // Supplements
  const handleAddSupplement = async (
    supplement: Omit<Supplement, "id">
  ): Promise<void> => {
    setSupplements((prevSupplements) => [
      ...prevSupplements,
      { ...supplement, id: uuidv4() },
    ]);
  };

  const handleUpdateSupplement = async (
    id: string,
    updates: Partial<Supplement>
  ): Promise<void> => {
    setSupplements((prevSupplements) =>
      prevSupplements.map((supplement) =>
        supplement.id === id ? { ...supplement, ...updates } : supplement
      )
    );
  };

  const handleDeleteSupplement = async (id: string): Promise<void> => {
    setSupplements((prevSupplements) =>
      prevSupplements.filter((supplement) => supplement.id !== id)
    );
  };

  // Steroid Cycles
  const handleAddSteroidCycle = async (
    steroidCycle: Omit<SteroidCycle, "id">
  ): Promise<void> => {
    setSteroidCycles((prevCycles) => [
      ...prevCycles,
      { ...steroidCycle, id: uuidv4() },
    ]);
  };

  const handleUpdateSteroidCycle = async (
    id: string,
    updates: Partial<SteroidCycle>
  ): Promise<void> => {
    setSteroidCycles((prevCycles) =>
      prevCycles.map((cycle) => (cycle.id === id ? { ...cycle, ...updates } : cycle))
    );
  };

  const handleDeleteSteroidCycle = async (id: string): Promise<void> => {
    setSteroidCycles((prevCycles) => prevCycles.filter((cycle) => cycle.id !== id));
  };

  // Steroid Compounds
  const handleAddSteroidCompound = async (
    steroidCompound: Omit<SteroidCompound, "id">
  ): Promise<void> => {
    setSteroidCompounds((prevCompounds) => [
      ...prevCompounds,
      { ...steroidCompound, id: uuidv4() },
    ]);
  };

  const handleUpdateSteroidCompound = async (
    id: string,
    updates: Partial<SteroidCompound>
  ): Promise<void> => {
    setSteroidCompounds((prevCompounds) =>
      prevCompounds.map((compound) =>
        compound.id === id ? { ...compound, ...updates } : compound
      )
    );
  };

  const handleDeleteSteroidCompound = async (id: string): Promise<void> => {
    setSteroidCompounds((prevCompounds) =>
      prevCompounds.filter((compound) => compound.id !== id)
    );
  };

  return (
    <AppContext.Provider
      value={{
        userProfile,
        setUserProfile: handleSetUserProfile,
        workouts,
        setWorkouts,
        addWorkout: handleAddWorkout,
        updateWorkout: handleUpdateWorkout,
        deleteWorkout: handleDeleteWorkout,
        workoutTemplates,
        setWorkoutTemplates,
        addWorkoutTemplate: handleAddWorkoutTemplate,
        updateWorkoutTemplate: handleUpdateWorkoutTemplate,
        deleteWorkoutTemplate: handleDeleteWorkoutTemplate,
        bodyMeasurements,
        setBodyMeasurements,
        addBodyMeasurement: handleAddBodyMeasurement,
        updateBodyMeasurement: handleUpdateBodyMeasurement,
        deleteBodyMeasurement: handleDeleteBodyMeasurement,
        progressPhotos,
        setProgressPhotos,
        addProgressPhoto: handleAddProgressPhoto,
        updateProgressPhoto: handleUpdateProgressPhoto,
        deleteProgressPhoto: handleDeleteProgressPhoto,
        moodLogs,
        setMoodLogs,
        addMoodLog: handleAddMoodLog,
        updateMoodLog: handleUpdateMoodLog,
        deleteMoodLog: handleDeleteMoodLog,
        trainingBlocks,
        setTrainingBlocks,
        addTrainingBlock: handleAddTrainingBlock,
        updateTrainingBlock: handleUpdateTrainingBlock,
        deleteTrainingBlock: handleDeleteTrainingBlock,
        weeklyRoutines,
        setWeeklyRoutines,
        addWeeklyRoutine: handleAddWeeklyRoutine,
        updateWeeklyRoutine: handleUpdateWeeklyRoutine,
        deleteWeeklyRoutine: handleDeleteWeeklyRoutine,
        prLifts,
        setPRLifts,
        addPRLift: handleAddPRLift,
        updatePRLift: handleUpdatePRLift,
        deletePRLift: handleDeletePRLift,
        supplements,
        setSupplements,
        addSupplement: handleAddSupplement,
        updateSupplement: handleUpdateSupplement,
        deleteSupplement: handleDeleteSupplement,
        steroidCycles,
        setSteroidCycles,
        addSteroidCycle: handleAddSteroidCycle,
        updateSteroidCycle: handleUpdateSteroidCycle,
        deleteSteroidCycle: handleDeleteSteroidCycle,
        steroidCompounds,
        setSteroidCompounds,
        addSteroidCompound: handleAddSteroidCompound,
        updateSteroidCompound: handleUpdateSteroidCompound,
        deleteSteroidCompound: handleDeleteSteroidCompound,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
