import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ProgressChartProps {
  title: string;
  data?: Array<{ date: string; value: number }>;
  interval?: 'weekly' | 'monthly';
}

const ProgressChart: React.FC<ProgressChartProps> = ({ title, data = [], interval = 'weekly' }) => {
  // Aggregate data based on interval
  const aggregatedData = React.useMemo(() => {
    if (interval === 'monthly') {
      const monthlyData = new Map<string, number[]>();
      
      data.forEach(item => {
        const monthYear = item.date.substring(0, 5); // Get MM/YY format
        if (!monthlyData.has(monthYear)) {
          monthlyData.set(monthYear, []);
        }
        monthlyData.get(monthYear)?.push(item.value);
      });

      return Array.from(monthlyData.entries()).map(([date, values]) => ({
        date,
        value: values.reduce((a, b) => a + b, 0) / values.length
      }));
    }

    return data;
  }, [data, interval]);

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={aggregatedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#8884d8"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgressChart;
