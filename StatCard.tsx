
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  change?: {
    value: string | number;
    positive: boolean;
  };
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, change, onClick }) => {
  return (
    <Card 
      className={`overflow-hidden ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
      onClick={onClick}
    >
      <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <div className={`text-xs mt-1 ${change.positive ? "progress-increase" : "progress-decrease"}`}>
            {change.positive ? "+" : "-"}{change.value} since last measurement
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
