
import React from "react";
import { calculateOneRepMax } from "@/utils/numberUtils";

interface ExerciseSetData {
  dateFormatted: string;
  weight: number;
  reps: number;
  volume: number;
}

interface ExerciseHistoryProps {
  exerciseData: ExerciseSetData[];
}

export const ExerciseHistory: React.FC<ExerciseHistoryProps> = ({
  exerciseData
}) => {
  if (exerciseData.length === 0) return null;

  return (
    <div className="mt-4 text-sm">
      <h4 className="font-medium mb-2 text-sm">Recent History</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="border-b">
            <tr>
              <th className="py-2 text-left font-medium">Date</th>
              <th className="py-2 text-right font-medium">Weight</th>
              <th className="py-2 text-right font-medium">Reps</th>
              <th className="py-2 text-right font-medium">Volume</th>
              <th className="py-2 text-right font-medium">Est. 1RM</th>
            </tr>
          </thead>
          <tbody>
            {exerciseData.slice(-3).reverse().map((entry, idx) => (
              <tr key={idx} className="border-b border-gray-100">
                <td className="py-2 text-left">{entry.dateFormatted}</td>
                <td className="py-2 text-right">{entry.weight} kg</td>
                <td className="py-2 text-right">{entry.reps}</td>
                <td className="py-2 text-right">{entry.volume} kg</td>
                <td className="py-2 text-right">
                  {calculateOneRepMax(Number(entry.weight), Number(entry.reps)).toFixed(1)} kg
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
