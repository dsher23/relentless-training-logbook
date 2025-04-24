
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from "recharts";
import { ChartContainer } from "@/components/ui/chart";

interface ChartDataPoint {
  date: string;
  fullData: {
    weight: number;
    reps: number;
    volume: number;
    notes: string;
  };
  estimatedOneRM: number;
}

interface ProgressChartProps {
  data: ChartDataPoint[];
  displayMode: "topSet" | "volume" | "reps";
  maxValue?: number;
  yAxisLabel: string;
}

export const ProgressChart: React.FC<ProgressChartProps> = ({
  data,
  displayMode,
  maxValue,
  yAxisLabel
}) => {
  const getYAxisDomain = () => {
    if (data.length === 0) return [0, 10];
    
    const values = data.map(d => 
      displayMode === "topSet" ? Number(d["Top Set"] || 0) : 
      displayMode === "volume" ? Number(d["Volume"] || 0) : 
      Number(d["Reps"] || 0)
    );
    
    const max = Math.max(...values);
    const min = Math.min(...values);
    const padding = (max - min) * 0.1;
    
    return [Math.max(0, min - padding), max + padding];
  };

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full border rounded-md border-dashed">
        <p className="text-muted-foreground text-sm">
          No data available for this exercise
        </p>
      </div>
    );
  }

  return (
    <ChartContainer 
      className="mb-4"
      config={{ progress: { label: "Progress" } }}
    >
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 10 }}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis 
            tick={{ fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            domain={getYAxisDomain()}
            allowDecimals={displayMode !== "reps"}
            label={{ 
              value: yAxisLabel, 
              angle: -90, 
              position: 'insideLeft', 
              style: { fontSize: 10, textAnchor: 'middle' } 
            }}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-md">
                    <div className="grid gap-1">
                      <div className="font-medium">{data.date}</div>
                      <div className="text-sm text-muted-foreground">
                        {displayMode === "topSet" && 
                          <span>Weight: <span className="font-medium">{Number(data.fullData.weight)} kg</span> × {Number(data.fullData.reps)} reps</span>
                        }
                        {displayMode === "volume" && 
                          <span>Volume: <span className="font-medium">{Number(data.fullData.volume)} kg</span></span>
                        }
                        {displayMode === "reps" && 
                          <span>Reps: <span className="font-medium">{Number(data.fullData.reps)}</span> at {Number(data.fullData.weight)} kg</span>
                        }
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Est. 1RM: <span className="font-medium">{Number(data.estimatedOneRM)} kg</span>
                      </div>
                      {data.fullData.notes && (
                        <div className="text-xs italic mt-1 text-muted-foreground">
                          "{data.fullData.notes}"
                        </div>
                      )}
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Line
            type="monotone"
            dataKey={
              displayMode === "topSet" 
                ? "Top Set" 
                : displayMode === "volume" 
                  ? "Volume" 
                  : "Reps"
            }
            stroke="#8884d8"
            strokeWidth={2}
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6, strokeWidth: 2 }}
          />
          {maxValue !== undefined && (
            <ReferenceLine 
              y={Number(maxValue)} 
              stroke="green" 
              strokeDasharray="3 3" 
              label={{ 
                value: 'PR', 
                position: 'insideTopRight',
                fill: 'green',
                fontSize: 10
              }} 
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
