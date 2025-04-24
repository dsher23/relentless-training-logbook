import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

/* ---------- props ---------- */
export interface ProgressChartProps {
  title?: string;
  data: Array<{ date: string; value: number }>;
  /** label on the Y-axis */
  yAxisLabel?: string;
  /** optional upper limit for nicer padding */
  maxValue?: number;
  /** group by week / month (future use) */
  interval?: "weekly" | "monthly";
}

/* ---------- component ---------- */
export const ProgressChart: React.FC<ProgressChartProps> = ({
  data,
  yAxisLabel,
  maxValue,
}) => {
  /* calculate y-domain with padding */
  const [min, max] = React.useMemo(() => {
    if (!data.length) return [0, 10];
    const vals = data.map((d) => d.value);
    const hi = maxValue ?? Math.max(...vals);
    const lo = Math.min(...vals);
    const pad = (hi - lo) * 0.1;
    return [Math.max(0, lo - pad), hi + pad];
  }, [data, maxValue]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 10 }}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          domain={[min, max]}
          tick={{ fontSize: 10 }}
          tickLine={false}
          axisLine={false}
          label={
            yAxisLabel
              ? {
                  value: yAxisLabel,
                  angle: -90,
                  position: "insideLeft",
                  style: { fontSize: 10, textAnchor: "middle" },
                }
              : undefined
          }
        />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#8884d8"
          strokeWidth={2}
          dot={{ r: 4, strokeWidth: 2 }}
          activeDot={{ r: 6, strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

/* ---------- default export for legacy imports ---------- */
export default ProgressChart;
