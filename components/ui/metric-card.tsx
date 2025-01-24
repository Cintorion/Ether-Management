"use client";

import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string;
  change: {
    type: 'increase' | 'decrease';
    value: string;
    period: string;
  };
  color: string;
}

export function MetricCard({ title, value, change, color }: MetricCardProps) {
  const isIncrease = change.type === 'increase';
  const changeColor = isIncrease ? 'text-green-600' : 'text-red-600';
  
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <div className="flex items-center gap-4">
        <div className={cn("w-12 h-12 rounded-full", color)} />
        <h3 className="text-gray-600 font-medium">{title}</h3>
      </div>
      <div className="mt-4">
        <p className="text-3xl font-semibold">{value}</p>
        <p className={cn("text-sm mt-1", changeColor)}>
          {isIncrease ? '↑' : '↓'} {change.value} from {change.period}
        </p>
      </div>
    </div>
  );
}