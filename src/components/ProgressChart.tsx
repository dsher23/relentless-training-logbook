
import React from "react";
import {
  ResponsiveContainer, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip
} from "recharts";

interface Props {
  data: { date: string; value: number }[];
  yAxisLabel?: string;
  maxValue?: number;
}

const ProgressChart: React.FC<Props> = ({ data, yAxisLabel, maxValue }) => {
  const [min, max] = React.useMemo(() => {
    if (!data.length) return [0, 10];
    const vals = data.map(v => v.value);
    const hi = maxValue ?? Math.max(...vals);
    const lo = Math.min(...vals);
    const pad = (hi - lo) * 0.1;
    return [Math.max(0, lo - pad), hi + pad];
  }, [data, maxValue]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.2}/>
        <XAxis dataKey="date" tick={{ fontSize: 10 }} tickLine={false}/>
        <YAxis
          domain={[min, max]}
          tick={{ fontSize: 10 }}
          tickLine={false}
          axisLine={false}
          label={
            yAxisLabel
              ? { value: yAxisLabel, angle: -90, position: "insideLeft",
                  style: { fontSize: 10, textAnchor: "middle" } }
              : undefined
          }
        />
        <Tooltip/>
        <Line
          type="monotone"
          dataKey="value"
          stroke="#8884d8"
          strokeWidth={2}
          dot={{ r: 4, strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export { ProgressChart };      // named
export default ProgressChart;  // default
