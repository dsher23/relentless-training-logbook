
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface ProgressChartProps {
  title: string;
  data: Array<{ date: string; value: number }>;
  dataKey?: string;
  color?: string;
}

const ProgressChart: React.FC<ProgressChartProps> = ({
  title,
  data,
  dataKey = "value",
  color = "#9b87f5"
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(str) => str.slice(0, 5)}
              />
              <YAxis hide domain={['auto', 'auto']} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  border: "none",
                  borderRadius: "8px",
                  boxShadow: "0 2px 12px rgba(0, 0, 0, 0.1)"
                }}
                labelStyle={{ fontWeight: "bold", color: "#333" }}
                itemStyle={{ color: "#333" }}
              />
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke={color}
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2, fill: "white" }}
                activeDot={{ r: 6, strokeWidth: 0, fill: color }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressChart;
